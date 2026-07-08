import { Loader2 } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Size of the spinner icon.
	 * @default "md"
	 */
	size?: "sm" | "md" | "lg";
	/**
	 * Optional label text shown below the spinner.
	 */
	label?: string;
	/**
	 * Whether to show inside a full-page centered container.
	 * @default false
	 */
	fullPage?: boolean;
}

const sizeMap = {
	sm: "w-4 h-4",
	md: "w-8 h-8",
	lg: "w-12 h-12",
} as const;

export function Loading({
	size = "md",
	label,
	fullPage = false,
	className,
	...props
}: LoadingProps) {
	const spinner = (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3",
				fullPage && "min-h-[60vh]",
				className,
			)}
			{...props}
		>
			<Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
			{label && <p className="text-sm text-muted-foreground">{label}</p>}
		</div>
	);

	if (fullPage) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				{spinner}
			</div>
		);
	}

	return spinner;
}
