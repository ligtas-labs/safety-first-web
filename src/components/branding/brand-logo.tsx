import logo from "@/assets/safety-first-logo.png";

export function BrandLogo({ className }: { className?: string }) {
	return (
		<img
			className={className}
			src={logo}
			alt="Safety First"
			width={2112}
			height={736}
		/>
	);
}
