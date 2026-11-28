// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App";

vi.mock("./features/account/client", () => ({
	auth: { useSession: () => ({ data: null, isPending: false }) },
	ApiError: class extends Error {},
}));
afterEach(() => {
	cleanup();
	history.replaceState(null, "", "/");
});
test.each([
	["/sign-in", "Sign in"],
	["/sign-up", "Create student account"],
	["/recover", "Recover account"],
])("%s opens its own auth form", (path, title) => {
	history.replaceState(null, "", path);
	render(<App />);
	expect(screen.getByRole("heading", { name: title })).toBeDefined();
	expect(screen.getByLabelText("Email")).toBeDefined();
	expect(Boolean(screen.queryByLabelText("Password"))).toBe(
		path !== "/recover",
	);
});
