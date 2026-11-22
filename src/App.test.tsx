// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test } from "vitest";
import App from "./App";

afterEach(cleanup);

test("increments the visible count when the counter is clicked", async () => {
	const user = userEvent.setup();
	render(<App />);

	await user.click(screen.getByRole("button", { name: "Count is 0" }));

	expect(screen.getByRole("button", { name: "Count is 1" })).toBeDefined();
});
