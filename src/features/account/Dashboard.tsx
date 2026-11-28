import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { ApiError, api, auth } from "./client";

type Org = { id: string; name: string; description: string };
type Account = {
	status: string;
	id?: string;
	role?: "student" | "teacher";
	displayName?: string;
	email?: string;
	organization?: { name: string; isManager: boolean };
};
type Person = { id: string; displayName: string; role: string };
type ClassRow = {
	id: string;
	name: string;
	term: string;
	status?: string;
	requests?: { id: string; displayName: string }[];
};
type Directory = {
	organization: { name: string; description: string };
	people: Person[];
	classes: {
		id: string;
		name: string;
		teacherName: string;
		roster: Person[];
	}[];
};
function formValues(e: FormEvent<HTMLFormElement>) {
	e.preventDefault();
	return Object.fromEntries(new FormData(e.currentTarget));
}
function detailsFields(org?: { name: string; description: string }) {
	return (
		<>
			<label>
				Organization name
				<input required name="name" maxLength={160} defaultValue={org?.name} />
			</label>
			<label>
				Description
				<textarea
					required
					name="description"
					maxLength={2000}
					defaultValue={org?.description}
				/>
			</label>
		</>
	);
}
export function Dashboard({ name }: { name: string }) {
	const cache = useQueryClient();
	const [message, setMessage] = useState("");
	const [busy, setBusy] = useState(false);
	const [locked, setLocked] = useState(false);
	const [invite] = useState(() =>
		location.pathname === "/invite"
			? new URLSearchParams(location.hash.slice(1)).get("token")
			: null,
	);
	const account = useQuery({
		queryKey: ["account"],
		queryFn: () => api<Account>("account"),
		enabled: !locked,
	});
	const user = account.data;
	const active = user?.status === "active";
	const teacher = user?.role === "teacher";
	const organizations = useQuery({
		queryKey: ["organizations"],
		queryFn: () => api<Org[]>("account/organizations"),
		enabled: !!user && !active && !teacher && !locked,
	});
	const classes = useQuery({
		queryKey: ["classes"],
		queryFn: () => api<ClassRow[]>("classes"),
		enabled: active && !locked,
	});
	const directory = useQuery({
		queryKey: ["directory"],
		queryFn: () => api<Directory>("organization/directory"),
		enabled: !!user?.organization?.isManager && !locked,
	});
	const err = [
		account.error,
		organizations.error,
		classes.error,
		directory.error,
	].find(Boolean);
	async function signOut() {
		setLocked(true);
		setMessage("");
		await cache.cancelQueries();
		cache.clear();
		try {
			const result = await auth?.signOut();
			if (result?.error) throw new Error();
			location.replace("/");
		} catch {
			setMessage("Session sign-out could not finish. Reconnect and retry.");
		}
	}
	async function change(
		path: string,
		body: unknown,
		method = "POST",
		done = "Saved.",
	) {
		setBusy(true);
		setMessage("");
		try {
			const result = await api<
				{ joinCode?: string; status?: string } | undefined
			>(path, method, body);
			setMessage(
				result?.joinCode
					? `Share this class code: ${result.joinCode}`
					: result?.status === "pending"
						? "Awaiting teacher approval."
						: done,
			);
			await cache.invalidateQueries();
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) {
				await signOut();
				return;
			}
			setMessage(e instanceof Error ? e.message : "Unable to save.");
		} finally {
			setBusy(false);
		}
	}
	if (locked || (err instanceof ApiError && err.status === 401))
		return (
			<section>
				<h1>Session closed</h1>
				<p role="status">{message || "Sign in again to continue."}</p>
				<button type="button" onClick={signOut}>
					Return to sign-in
				</button>
			</section>
		);
	const org = directory.data?.organization;
	return (
		<>
			<nav>
				<button type="button" onClick={signOut}>
					Sign out
				</button>
			</nav>
			{err && (
				<p role="alert">
					{err.message}{" "}
					<button type="button" onClick={() => cache.invalidateQueries()}>
						Retry
					</button>
				</p>
			)}
			{!user && !err && <p role="status">Loading your account…</p>}
			{user && !active && (
				<section>
					<h1>
						{teacher ? "Set up your organization" : "Choose your organization"}
					</h1>
					{teacher ? (
						<>
							{invite && (
								<button
									disabled={busy}
									type="button"
									onClick={() =>
										change("organization/invitations/accept", { token: invite })
									}
								>
									Accept teacher invitation
								</button>
							)}
							<form onSubmit={(e) => change("organization", formValues(e))}>
								{detailsFields()}
								<button disabled={busy} type="submit">
									Create organization
								</button>
							</form>
						</>
					) : (
						<form onSubmit={(e) => change("account/student", formValues(e))}>
							<label>
								Display name
								<input
									name="displayName"
									required
									maxLength={120}
									defaultValue={name}
								/>
							</label>
							<label>
								Organization
								<select name="organizationId" defaultValue="" required>
									<option value="" disabled>
										Select an organization
									</option>
									{organizations.data?.map((o) => (
										<option key={o.id} value={o.id}>
											{o.name} — {o.description}
										</option>
									))}
								</select>
							</label>
							<button
								disabled={busy || !organizations.data?.length}
								type="submit"
							>
								Join organization
							</button>
						</form>
					)}
				</section>
			)}
			{active && (
				<>
					<section>
						<h1>{teacher ? "Teacher dashboard" : "Student dashboard"}</h1>
						<p>
							{user.email} · {user.organization?.name}
						</p>
						<form onSubmit={(e) => change("account", formValues(e), "PATCH")}>
							<label>
								Display name
								<input
									name="displayName"
									defaultValue={user.displayName}
									required
									maxLength={120}
								/>
							</label>
							<button disabled={busy} type="submit">
								Save profile
							</button>
						</form>
					</section>
					<section>
						<h2>My classes</h2>
						{classes.data?.map((c) => (
							<div key={c.id}>
								<h3>{c.name}</h3>
								<p>
									{c.term} {c.status}
								</p>
								{c.requests?.map((r) => (
									<p key={r.id}>
										{r.displayName}{" "}
										<button
											type="button"
											disabled={busy}
											onClick={() =>
												change(
													`classes/${c.id}/enrollments/${r.id}/approve`,
													undefined,
												)
											}
										>
											Approve enrollment
										</button>
									</p>
								))}
							</div>
						))}
						{teacher ? (
							<form onSubmit={(e) => change("classes", formValues(e))}>
								<label>
									Class name
									<input required name="name" />
								</label>
								<label>
									Term
									<input name="term" required />
								</label>
								<button disabled={busy} type="submit">
									Create class
								</button>
							</form>
						) : (
							<form onSubmit={(e) => change("classes/join", formValues(e))}>
								<label>
									Class code
									<input required name="code" />
								</label>
								<button disabled={busy} type="submit">
									Request class access
								</button>
							</form>
						)}
					</section>
				</>
			)}
			{directory.data && (
				<section>
					<h2>Organization management</h2>
					<form
						onSubmit={(e) => change("organization", formValues(e), "PATCH")}
					>
						{detailsFields(org)}
						<button disabled={busy} type="submit">
							Save organization
						</button>
					</form>
					<form
						onSubmit={(e) =>
							change(
								"organization/invitations",
								formValues(e),
								"POST",
								"Invitation sent.",
							)
						}
					>
						<label>
							Teacher email
							<input type="email" required name="email" />
						</label>
						<button disabled={busy} type="submit">
							Invite teacher
						</button>
					</form>
					<h3>Members</h3>
					<ul>
						{directory.data.people.map((p) => (
							<li key={p.id}>
								{p.displayName} · {p.role}
							</li>
						))}
					</ul>
					<h3>Classes and approved rosters</h3>
					{directory.data.classes.map((c) => (
						<div key={c.id}>
							<strong>{c.name}</strong> · {c.teacherName}
							<ul>
								{c.roster.map((p) => (
									<li key={p.id}>{p.displayName}</li>
								))}
							</ul>
						</div>
					))}
				</section>
			)}
			<p role="status">{message}</p>
		</>
	);
}
