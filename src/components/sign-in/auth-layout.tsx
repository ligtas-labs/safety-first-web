import type { ReactNode } from "react";
import { BrandLogo } from "@/components/branding";
import { Card, CardContent } from "@/components/ui";

export function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="auth-layout">
			<aside className="auth-brand">
				<BrandLogo />
				<p>Construction safety training</p>
			</aside>
			<div className="auth-workspace">
				<Card className="auth-card">
					<CardContent>{children}</CardContent>
				</Card>
			</div>
		</div>
	);
}
