import { useState } from "react";
import { auth } from "./client";
import { SignIn } from "./SignIn";

export function MobileAuthorization() {
	if (!auth) throw new Error("Missing auth configuration");
	const session = auth.useSession();
	const query = location.search.slice(1);
	const params = new URLSearchParams(query);
	const consent = location.pathname === "/mobile/consent";
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	if (!query) return <p role="alert">Start sign-in from the Android app.</p>;
	if (session.isPending) return <p role="status">Checking session…</p>;
	if (!session.data?.user) return <SignIn oauthQuery={query} />;
	async function send(accept: boolean) {
		if (!auth) return;
		setBusy(true);
		setError("");
		try {
			const result = await auth.$fetch<{ url: string }>(
				consent ? "/oauth2/consent" : "/oauth2/continue",
				{
					method: "POST",
					body: consent
						? { accept, oauth_query: query }
						: { selected: true, oauth_query: query },
				},
			);
			if (result.error || !result.data?.url)
				throw new Error("The sign-in request expired. Start again on Android.");
			navigateOAuth(result.data.url);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to continue.");
			setBusy(false);
		}
	}
	return (
		<section>
			<h1>
				{consent
					? "Authorize Safety First Android"
					: "Continue to Safety First Android"}
			</h1>
			<p>Signed in as {session.data.user.email}.</p>
			{consent && (
				<>
					<p>Requested permissions: {params.get("scope")}</p>
					<p>Service: {params.get("resource")}</p>
					<p>Return address: {params.get("redirect_uri")}</p>
				</>
			)}
			<button type="button" disabled={busy} onClick={() => send(true)}>
				{consent ? "Allow and return to app" : "Continue"}
			</button>
			{consent && (
				<button type="button" disabled={busy} onClick={() => send(false)}>
					Decline
				</button>
			)}
			<p role="alert">{error}</p>
		</section>
	);
}
export function navigateOAuth(value: string) {
	const next = new URL(value);
	const neonOrigin = new URL(import.meta.env.VITE_NEON_AUTH_URL).origin;
	if (
		next.protocol !== "https:" ||
		(next.origin !== location.origin && next.origin !== neonOrigin)
	)
		throw new Error("Unexpected authorization return address.");
	location.assign(next.toString());
}
