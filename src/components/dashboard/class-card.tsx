import { Badge, Button } from "@/components/ui";
import type { ClassRow } from "./dashboard";

export function ClassCard({
	classroom,
	code,
	teacher,
	busy,
	generate,
	approve,
}: {
	classroom: ClassRow;
	code?: string;
	teacher: boolean;
	busy: boolean;
	generate: () => void;
	approve: (id: string) => void;
}) {
	return (
		<article className="workspace-row">
			<h3>{classroom.name}</h3>
			<p>
				{classroom.term}{" "}
				{classroom.status && (
					<Badge variant="secondary">{classroom.status}</Badge>
				)}
			</p>
			{teacher && (
				<div className="class-code-actions">
					{code && (
						<p>
							Class code <code>{code}</code>
						</p>
					)}
					<Button
						variant="outline"
						type="button"
						disabled={busy}
						onClick={() => {
							if (
								window.confirm(
									"Generate a new class code? The previous code will stop working.",
								)
							)
								generate();
						}}
					>
						Generate new class code
					</Button>
				</div>
			)}
			{classroom.requests?.map((request) => (
				<div className="class-request" key={request.id}>
					<span>{request.displayName}</span>
					<Button
						type="button"
						disabled={busy}
						onClick={() => approve(request.id)}
					>
						Approve enrollment
					</Button>
				</div>
			))}
		</article>
	);
}
