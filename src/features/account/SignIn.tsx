import { type FormEvent, useState } from "react";
import { auth, navigateOAuth } from "./client";

const authPaths = {
	signin: "/sign-in",
	signup: "/sign-up",
	recover: "/recover",
};

export function SignIn({
	reset = false,
	initialMode = "signin",
	onVerified,
	oauthQuery,
}: {
	reset?: boolean;
	initialMode?: keyof typeof authPaths;
	onVerified?: () => void;
	oauthQuery?: string;
}) {
	const [mode, setMode] = useState<
		"signin" | "signup" | "recover" | "reset" | "verify"
	>(reset ? "reset" : initialMode);
	const [message, setMessage] = useState("");
	const [address, setAddress] = useState("");
	const [busy, setBusy] = useState(false);
	const titles = {
		signin: "Sign in",
		signup: "Create student account",
		recover: "Recover account",
		reset: "Set new password",
		verify: "Verify email",
	};
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!auth) return;
		const data = new FormData(event.currentTarget);
		const email = String(data.get("email") ?? "").trim();
		const password = String(data.get("password") ?? "");
		const name = String(data.get("name") ?? "").trim();
		setBusy(true);
		setMessage("");
		try {
			const resetToken = new URLSearchParams(location.search).get("token");
			if (mode === "reset" && !resetToken)
				throw new Error("This recovery link is invalid. Request a new one.");
			let result: { error: { code?: string; message?: string } | null };
			switch (mode) {
				case "signup":
					result = await auth.signUp.email({
						email,
						password,
						name,
						callbackURL: oauthQuery
							? location.href
							: new URL("/sign-in", location.origin).href,
					});
					break;
				case "signin":
					if (oauthQuery) {
						const response = await auth.$fetch<{ url?: string }>(
							"/sign-in/email",
							{
								method: "POST",
								body: { email, password, oauth_query: oauthQuery },
							},
						);
						if (response.data?.url) {
							navigateOAuth(response.data.url);
						}
						result = response;
					} else result = await auth.signIn.email({ email, password });
					break;
				case "verify":
					result = await auth.$fetch("/email-otp/verify-email", {
						method: "POST",
						body: { email, otp: String(data.get("otp")).trim() },
					});
					break;
				case "recover":
					result = await auth.requestPasswordReset({
						email,
						redirectTo: `${location.origin}/reset-password`,
					});
					break;
				case "reset":
					result = await auth.resetPassword({
						token: resetToken ?? "",
						newPassword: password,
					});
					break;
			}
			if (result.error) {
				if (mode === "signin" && result.error.code === "EMAIL_NOT_VERIFIED") {
					setMode("verify");
					setMessage("Check your email for a verification code.");
					return;
				}
				throw new Error(result.error.message || "Request failed. Try again.");
			}
			if (mode === "signup") {
				setMode("verify");
				setMessage("Enter the verification code sent to your email.");
			}
			if (mode === "verify") {
				onVerified?.();
				setMode("signin");
				setMessage("Email verified. You can now sign in.");
			}
			if (mode === "recover")
				setMessage(
					"If the address has an account, check your email for a recovery link.",
				);
			if (mode === "reset") {
				history.replaceState(null, "", "/sign-in");
				setMode("signin");
				setMessage("Password updated. Sign in to continue.");
			}
		} catch (e) {
			setMessage(
				e instanceof Error ? e.message : "Unable to connect. Try again.",
			);
		} finally {
			setBusy(false);
		}
	}
	return (
		<section>
			<h1>{titles[mode]}</h1>
			<form onSubmit={submit}>
				{mode === "signup" && (
					<label>
						Display name
						<input name="name" maxLength={120} required autoComplete="name" />
					</label>
				)}
				{mode !== "reset" && (
					<label>
						Email
						<input
							type="email"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							name="email"
							required
							autoComplete="email"
						/>
					</label>
				)}
				{mode === "verify" && (
					<label>
						Verification code
						<input
							name="otp"
							autoComplete="one-time-code"
							inputMode="numeric"
							required
						/>
					</label>
				)}
				{mode !== "recover" && mode !== "verify" && (
					<label>
						Password
						<input
							type="password"
							name="password"
							required
							autoComplete={
								mode === "signin" ? "current-password" : "new-password"
							}
						/>
					</label>
				)}
				<button disabled={busy} type="submit">
					{titles[mode]}
				</button>
			</form>
			<p role="status">{message}</p>
			<nav>
				{(["signin", "signup", "recover", "verify"] as const)
					.filter((x) => x !== mode)
					.map((x) =>
						!oauthQuery && x !== "verify" ? (
							<a key={x} href={authPaths[x]}>
								{titles[x]}
							</a>
						) : (
							<button
								key={x}
								type="button"
								disabled={busy}
								onClick={() => {
									setMode(x);
									setMessage("");
								}}
							>
								{titles[x]}
							</button>
						),
					)}
			</nav>
		</section>
	);
}
