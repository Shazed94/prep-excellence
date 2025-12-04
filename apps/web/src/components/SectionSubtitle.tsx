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
	return (
		<Component
			className={cn(
				"text-[16px] md:text-[17px] text-muted leading-relaxed tracking-wide max-w-5xl mx-auto text-center",
				"mb-3",
				className,
				alignment,
			)}
		>
			{children}
		</Component>
	);
}
