import { BrandLogo } from "@/components/branding";

export function LoadingState({
	message,
	inline = false,
}: {
	message: string;
	inline?: boolean;
}) {
	return (
		<div
			className={inline ? "loading-state loading-inline" : "loading-state"}
			role="status"
			aria-busy="true"
		>
			<div className="loading-card">
				{!inline && <BrandLogo className="loading-logo" />}
				<p>{message}</p>
				<div className="loading-preview" aria-hidden="true">
					<div className="loading-bar loading-title" />
					<div className="loading-row">
						<div className="loading-bar" />
						<div className="loading-bar loading-chip" />
					</div>
					<div className="loading-row">
						<div className="loading-bar" />
						<div className="loading-bar loading-chip" />
					</div>
				</div>
			</div>
		</div>
	);
}
