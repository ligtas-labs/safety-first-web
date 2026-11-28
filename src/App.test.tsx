// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import App from "./App";

vi.mock("./features/account/client", () => ({
	auth: { useSession: () => ({ data: null, isPending: false }) },
	ApiError: class extends Error {},
}));
afterEach(cleanup);
test("signed-out users can choose signup and recovery", async () => {
	const user = userEvent.setup();
	render(<App />);
	expect(screen.getByRole("heading", { name: "Sign in" })).toBeDefined();
	await user.click(
		screen.getByRole("button", { name: "Create student account" }),
	);
	expect(screen.getByLabelText("Display name")).toBeDefined();
	await user.click(screen.getByRole("button", { name: "Recover account" }));
	expect(screen.getByLabelText("Email")).toBeDefined();
	expect(screen.queryByLabelText("Password")).toBeNull();
});
