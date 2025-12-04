// components/ui/SectionTitle.tsx

import type { ReactNode } from "react";
import { cn } from "@/lib/utils"; // if you're using shadcn's cn utility

interface SectionTitleProps {
	children: ReactNode;
	className?: string;
	accentClassName?: string; // optional: customize the accent bar
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function SectionTitle({
	children,
	className,
	accentClassName,
	as: Component = "h2",
}: SectionTitleProps) {
	return (
		<div className="relative inline-block">
			<Component
				className={cn(
					"text-[28px] font-bold text-primary-light leading-snug pb-2 relative inline-block mb-6",
					className,
				)}
			>
				{children}
				<span
					className={cn(
						"absolute left-0 bottom-0 h-[3px] w-44 bg-accent transition-all duration-300",
						accentClassName,
					)}
				/>
			</Component>
		</div>
	);
}
