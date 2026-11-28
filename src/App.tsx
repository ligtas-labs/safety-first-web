import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { auth } from "./features/account/client";
import { Dashboard } from "./features/account/Dashboard";
import { MobileAuthorization } from "./features/account/MobileAuthorization";
import { SignIn } from "./features/account/SignIn";
import "./App.css";

function SignedIn({ name }: { name: string }) {
	const [client] = useState(
		() => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
	);
	return (
		<QueryClientProvider client={client}>
			<Dashboard name={name} />
		</QueryClientProvider>
	);
}
function Navigate({ to }: { to: string }) {
	useEffect(() => {
		location.replace(to);
	}, [to]);
	return <p role="status">Opening page…</p>;
}
function Session() {
	if (!auth) throw new Error("Missing auth configuration");
	const session = auth.useSession();
	if (["/mobile/login", "/mobile/consent"].includes(location.pathname))
		return <MobileAuthorization />;
	if (location.pathname === "/mobile/callback")
		return (
			<p role="status">
				Return to the Safety First Android app. If it did not open, check its
				supported links setting and restart sign-in.
			</p>
		);
	if (location.pathname === "/reset-password") return <SignIn reset />;
	if (location.pathname === "/recover") return <SignIn initialMode="recover" />;
	if (session.isPending) return <p role="status">Checking your session…</p>;
	if (!session.data?.user) {
		if (location.pathname === "/dashboard") return <Navigate to="/sign-in" />;
		return (
			<SignIn
				initialMode={location.pathname === "/sign-up" ? "signup" : "signin"}
			/>
		);
	}
	if (location.pathname !== "/dashboard" && location.pathname !== "/invite")
		return <Navigate to="/dashboard" />;
	return <SignedIn key={session.data.user.id} name={session.data.user.name} />;
}
export default function App() {
	return (
		<main>
			<header>Safety First</header>
			{auth ? (
				<Session />
			) : (
				<p role="status">
					Sign-in is unavailable. The dashboard needs its Neon Auth URL.
				</p>
			)}
		</main>
	);
}
