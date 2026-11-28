import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/react/tabs";
import { type FormEvent, useState } from "react";
import { BrandLogo } from "@/components/branding";
import { LoadingState } from "@/components/loading";
import { Badge, Button, Input } from "@/components/ui";
import { ApiError, api, auth } from "@/lib/auth-client";
import { ClassCard } from "./class-card";
import {
	clearClassCodes,
	readClassCode,
	rememberClassCode,
} from "./class-code-storage";

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
export type ClassRow = {
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
			<label htmlFor="dashboard-field-1">
				Organization name
				<Input
					id="dashboard-field-1"
					required
					name="name"
					maxLength={160}
					defaultValue={org?.name}
				/>
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
	const [joinCodes, setJoinCodes] = useState<Record<string, string>>({});
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
		if (user?.id) clearClassCodes(user.id);
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
				| {
						id?: string;
						joinCode?: string;
						codeExpiresAt?: string;
						status?: string;
				  }
				| undefined
			>(path, method, body);
			if (result?.id && result.joinCode) {
				const { id, joinCode, codeExpiresAt } = result;
				if (user?.id && codeExpiresAt)
					rememberClassCode(user.id, id, joinCode, codeExpiresAt);
				setJoinCodes((current) => ({ ...current, [id]: joinCode }));
			}
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
				<Button type="button" onClick={signOut}>
					Return to sign-in
				</Button>
			</section>
		);
	if (!user && !err) return <LoadingState message="Loading your account…" />;
	const org = directory.data?.organization;
	return (
		<div className="workspace">
			<header className="workspace-header">
				<BrandLogo />
				<Button variant="outline" type="button" onClick={signOut}>
					Sign out
				</Button>
			</header>
			{err && (
				<p role="alert">
					{err.message}{" "}
					<Button type="button" onClick={() => cache.invalidateQueries()}>
						Retry
					</Button>
				</p>
			)}

			{user && !active && (
				<section>
					<h1>
						{teacher ? "Set up your organization" : "Choose your organization"}
					</h1>
					{teacher ? (
						<>
							{invite && (
								<Button
									disabled={busy}
									type="button"
									onClick={() =>
										change("organization/invitations/accept", { token: invite })
									}
								>
									Accept teacher invitation
								</Button>
							)}
							<form onSubmit={(e) => change("organization", formValues(e))}>
								{detailsFields()}
								<Button disabled={busy} type="submit">
									Create organization
								</Button>
							</form>
						</>
					) : (
						<form onSubmit={(e) => change("account/student", formValues(e))}>
							<label htmlFor="dashboard-field-2">
								Display name
								<Input
									id="dashboard-field-2"
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
							<Button
								disabled={busy || !organizations.data?.length}
								type="submit"
							>
								Join organization
							</Button>
						</form>
					)}
				</section>
			)}
			{active && (
				<div className="workspace-heading">
					<div>
						<p>{user.organization?.name}</p>
						<h1>{teacher ? "Teacher dashboard" : "Student dashboard"}</h1>
					</div>
					<Badge variant="secondary">
						{user.organization?.isManager
							? "Organization manager"
							: teacher
								? "Teacher"
								: "Student"}
					</Badge>
				</div>
			)}
			{active && (
				<Tabs className="workspace-tabs" defaultValue="classes">
					<TabsList className="workspace-tab-list" aria-label="Dashboard">
						<TabsTab value="classes">My classes</TabsTab>
						<TabsTab value="profile">Profile</TabsTab>
						{user.organization?.isManager && (
							<TabsTab value="organization">Organization</TabsTab>
						)}
					</TabsList>
					<TabsPanel value="profile">
						<section>
							<h2>Profile</h2>
							<p>{user.email}</p>
							<form onSubmit={(e) => change("account", formValues(e), "PATCH")}>
								<label htmlFor="dashboard-field-3">
									Display name
									<Input
										id="dashboard-field-3"
										name="displayName"
										defaultValue={user.displayName}
										required
										maxLength={120}
									/>
								</label>
								<Button disabled={busy} type="submit">
									Save profile
								</Button>
							</form>
						</section>
					</TabsPanel>
					<TabsPanel value="classes">
						<section>
							<h2>My classes</h2>
							{classes.isPending && (
								<LoadingState inline message="Loading classes…" />
							)}
							{classes.data?.length === 0 && (
								<p className="empty-state">
									{teacher
										? "Create your first class to share a join code."
										: "Enter a class code to request access."}
								</p>
							)}
							{classes.data?.map((c) => (
								<ClassCard
									key={c.id}
									classroom={c}
									code={
										teacher
											? (joinCodes[c.id] ??
												(user.id ? readClassCode(user.id, c.id) : undefined))
											: undefined
									}
									teacher={teacher}
									busy={busy}
									generate={() =>
										change(`classes/${c.id}/join-code`, undefined)
									}
									approve={(id) =>
										change(
											`classes/${c.id}/enrollments/${id}/approve`,
											undefined,
										)
									}
								/>
							))}
							{teacher ? (
								<form onSubmit={(e) => change("classes", formValues(e))}>
									<label htmlFor="dashboard-field-4">
										Class name
										<Input id="dashboard-field-4" required name="name" />
									</label>
									<label htmlFor="dashboard-field-5">
										Term
										<Input id="dashboard-field-5" name="term" required />
									</label>
									<Button disabled={busy} type="submit">
										Create class
									</Button>
								</form>
							) : (
								<form onSubmit={(e) => change("classes/join", formValues(e))}>
									<label htmlFor="dashboard-field-6">
										Class code
										<Input id="dashboard-field-6" required name="code" />
									</label>
									<Button disabled={busy} type="submit">
										Request class access
									</Button>
								</form>
							)}
						</section>
					</TabsPanel>
					{user.organization?.isManager && (
						<TabsPanel value="organization">
							{directory.isPending && (
								<LoadingState inline message="Loading organization…" />
							)}
							{directory.data && (
								<section>
									<h2>Organization management</h2>
									<form
										onSubmit={(e) =>
											change("organization", formValues(e), "PATCH")
										}
									>
										{detailsFields(org)}
										<Button disabled={busy} type="submit">
											Save organization
										</Button>
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
										<label htmlFor="dashboard-field-7">
											Teacher email
											<Input
												id="dashboard-field-7"
												type="email"
												required
												name="email"
											/>
										</label>
										<Button disabled={busy} type="submit">
											Invite teacher
										</Button>
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
										<article className="workspace-row" key={c.id}>
											<strong>{c.name}</strong> · {c.teacherName}
											<ul>
												{c.roster.map((p) => (
													<li key={p.id}>{p.displayName}</li>
												))}
											</ul>
										</article>
									))}
								</section>
							)}
						</TabsPanel>
					)}
				</Tabs>
			)}
			<p className="workspace-status" role="status">
				{message}
			</p>
		</div>
	);
}
