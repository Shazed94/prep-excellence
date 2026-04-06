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
				"text-[16px] leading-[22px] font-inter font-normal text-[#141B34] -tracking-[-0.5px]",
				"mb-6",
				className,
				alignment,
			)}
		>
			{children}
		</Component>
	);
}
