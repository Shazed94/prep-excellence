// components/ui/Subtitle.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SubtitleProps {
	children: ReactNode;
	className?: string;
	as?: "p" | "span" | "h3" | "h4";
	alignment?: "left" | "center" | "right";
}

export function Subtitle({
	children,
	className,
	as: Component = "p",
	alignment = "center",
}: SubtitleProps) {
	const alignmentClass = {
		left: "text-left",
		center: "text-center",
		right: "text-right",
	}[alignment];

	return (
		<Component
			className={cn(
				"p", // ✅ single source of typography
				alignmentClass,
				"mx-auto", // keeps centering consistent
				className,
			)}
			style={{
				WebkitFontSmoothing: "antialiased", // 🔥 Mac fix
				MozOsxFontSmoothing: "grayscale",
			}}
		>
			{children}
		</Component>
	);
}
