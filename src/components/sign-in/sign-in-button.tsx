import { Button } from "@/components/ui";

export function SignInButton({
	busy,
	children,
}: {
	busy: boolean;
	children: string;
}) {
	return (
		<Button type="submit" disabled={busy} className="auth-submit">
			{busy ? "Please wait…" : children}
		</Button>
	);
}
