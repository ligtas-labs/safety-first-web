// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { Dashboard } from "./Dashboard";
import { SignIn } from "./SignIn";

const mocks = vi.hoisted(() => ({
	api: vi.fn(),
	signup: vi.fn(),
	verify: vi.fn(),
	signin: vi.fn(),
	recover: vi.fn(),
	reset: vi.fn(),
	logout: vi.fn(),
}));
vi.mock("./client", () => ({
	api: mocks.api,
	ApiError: class extends Error {},
	auth: {
		signUp: { email: mocks.signup },
		signIn: { email: mocks.signin },
		$fetch: mocks.verify,
		requestPasswordReset: mocks.recover,
		resetPassword: mocks.reset,
		signOut: mocks.logout,
	},
}));
afterEach(() => {
	cleanup();
	vi.resetAllMocks();
	history.replaceState(null, "", "/");
});
test("signup moves to verification and submits the emailed code for that address", async () => {
	const user = userEvent.setup();
	mocks.signup.mockResolvedValue({ error: null });
	mocks.verify.mockResolvedValue({ error: null });
	const onVerified = vi.fn();
	history.replaceState(null, "", "/mobile/login?state=fixture");
	render(
		<SignIn
			initialMode="signup"
			oauthQuery="state=fixture"
			onVerified={onVerified}
		/>,
	);
	await user.type(screen.getByLabelText("Display name"), "Sam");
	await user.type(screen.getByLabelText("Email"), "sam@example.test");
	await user.type(screen.getByLabelText("Password"), "synthetic123");
	await user.click(
		screen.getByRole("button", { name: "Create student account" }),
	);
	await user.type(await screen.findByLabelText("Verification code"), "123456");
	await user.click(screen.getByRole("button", { name: "Verify email" }));
	await waitFor(() => expect(onVerified).toHaveBeenCalledOnce());
	expect(mocks.verify).toHaveBeenCalledWith("/email-otp/verify-email", {
		method: "POST",
		body: { email: "sam@example.test", otp: "123456" },
	});
});
test("a failed sign-in displays the provider error", async () => {
	const user = userEvent.setup();
	mocks.signin.mockResolvedValue({ error: { message: "Invalid credentials" } });
	render(<SignIn />);
	await user.type(screen.getByLabelText("Email"), "sam@example.test");
	await user.type(screen.getByLabelText("Password"), "wrong");
	await user.click(screen.getByRole("button", { name: "Sign in" }));
	expect(await screen.findByText("Invalid credentials")).toBeDefined();
});
test("an expired recovery link displays the provider error", async () => {
	history.replaceState(null, "", "/reset-password?token=expired-fixture");
	mocks.reset.mockResolvedValue({ error: { message: "Link expired" } });
	const user = userEvent.setup();
	render(<SignIn reset />);
	await user.type(screen.getByLabelText("Password"), "replacement123");
	await user.click(screen.getByRole("button", { name: "Set new password" }));
	expect(await screen.findByText("Link expired")).toBeDefined();
});
test("requests recovery without exposing account existence", async () => {
	const user = userEvent.setup();
	mocks.recover.mockResolvedValue({ error: null });
	render(<SignIn initialMode="recover" />);
	await user.type(screen.getByLabelText("Email"), "sam@example.test");
	await user.click(screen.getByRole("button", { name: "Recover account" }));
	expect(
		await screen.findByText(/If the address has an account/),
	).toBeDefined();
});
test.each(["student", "teacher"])(
	"active %s sees their role-specific class controls",
	async (role) => {
		mocks.api.mockImplementation(async (path) =>
			path === "account"
				? {
						status: "active",
						role,
						email: "user@example.test",
						displayName: "Casey",
						organization: { name: "School", isManager: false },
					}
				: [],
		);
		const cache = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		render(
			<QueryClientProvider client={cache}>
				<Dashboard name="Casey" />
			</QueryClientProvider>,
		);
		expect(
			await screen.findByRole("heading", {
				name: role === "student" ? "Student dashboard" : "Teacher dashboard",
			}),
		).toBeDefined();
		expect(
			screen.getByLabelText(role === "student" ? "Class code" : "Class name"),
		).toBeDefined();
		const user = userEvent.setup();
		await user.clear(screen.getByLabelText("Display name"));
		await user.type(screen.getByLabelText("Display name"), "New name");
		await user.click(screen.getByRole("button", { name: "Save profile" }));
		await waitFor(() =>
			expect(mocks.api).toHaveBeenCalledWith("account", "PATCH", {
				displayName: "New name",
			}),
		);
	},
);
