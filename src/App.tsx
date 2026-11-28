import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import { LoadingState } from "@/components/loading";
import { MobileAuthorization } from "@/components/mobile-authorization";
import { SignIn } from "@/components/sign-in";
import { auth } from "@/lib/auth-client";
import "./App.css";

const Dashboard = lazy(() =>
	import("@/components/dashboard").then(({ Dashboard }) => ({
		default: Dashboard,
	})),
);

function SignedIn({ name }: { name: string }) {
	const [client] = useState(
		() => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
	);
	return (
		<QueryClientProvider client={client}>
			<Suspense fallback={<LoadingState message="Loading dashboard…" />}>
				<Dashboard name={name} />
			</Suspense>
		</QueryClientProvider>
	);
}
function Navigate({ to }: { to: string }) {
	useEffect(() => {
		location.replace(to);
	}, [to]);
	return <LoadingState message="Opening page…" />;
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
	if (session.isPending)
		return <LoadingState message="Checking your session…" />;
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
		<main className="app-shell">
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
