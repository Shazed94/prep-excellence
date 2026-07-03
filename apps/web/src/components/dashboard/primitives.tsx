import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared minimalist dashboard primitives.
 *
 * Design language (matches the client-designed front-face):
 *  - Flat white surfaces on a #FAFAFA canvas, single hairline border.
 *  - One accent colour: primary (#1552FD). No multi-colour gradients.
 *  - rounded-lg corners, at most shadow-sm, borders preferred over shadows.
 *  - Switzer for headings, Inter for body.
 *
 * Use these instead of hand-rolling gradient cards so every panel
 * (admin / teacher / student) stays visually consistent.
 */

/* ------------------------------------------------------------------ */
/* PageHeader                                                          */
/* ------------------------------------------------------------------ */

export function PageHeader({
	title,
	subtitle,
	actions,
	className,
}: {
	title: string;
	subtitle?: string;
	actions?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<div>
				<h1 className="font-switzer text-xl font-semibold text-foreground md:text-2xl">
					{title}
				</h1>
				{subtitle && (
					<p className="mt-1 font-inter text-sm text-muted">{subtitle}</p>
				)}
			</div>
			{actions && <div className="flex items-center gap-2">{actions}</div>}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* SectionCard                                                         */
/* ------------------------------------------------------------------ */

export function SectionCard({
	title,
	subtitle,
	action,
	children,
	className,
	bodyClassName,
}: {
	title?: string;
	subtitle?: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
}) {
	return (
		<div
			className={cn("rounded-lg border border-border bg-white p-5", className)}
		>
			{(title || action) && (
				<div className="mb-4 flex items-center justify-between">
					<div>
						{title && (
							<h2 className="font-switzer text-base font-semibold text-foreground">
								{title}
							</h2>
						)}
						{subtitle && (
							<p className="mt-0.5 text-xs text-muted">{subtitle}</p>
						)}
					</div>
					{action}
				</div>
			)}
			<div className={bodyClassName}>{children}</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* StatCard — flat, single-accent                                     */
/* ------------------------------------------------------------------ */

export function StatCard({
	label,
	value,
	icon: Icon,
	href,
	hint,
	className,
}: {
	label: string;
	value: ReactNode;
	icon: LucideIcon;
	href?: string;
	hint?: string;
	className?: string;
}) {
	const body = (
		<div
			className={cn(
				"group flex h-full flex-col rounded-lg border border-border bg-white p-5 transition-colors",
				href && "cursor-pointer hover:border-primary/40",
				className,
			)}
		>
			<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
				<Icon size={18} className="text-primary" />
			</div>
			<p className="font-switzer text-2xl font-bold text-foreground">{value}</p>
			<p className="mt-0.5 text-xs text-muted">{label}</p>
			{hint && <p className="mt-1 text-[11px] text-muted/80">{hint}</p>}
		</div>
	);

	if (href) {
		return (
			<Link to={href} className="block h-full">
				{body}
			</Link>
		);
	}
	return body;
}

/* ------------------------------------------------------------------ */
/* ViewAllLink                                                         */
/* ------------------------------------------------------------------ */

export function ViewAllLink({
	to,
	label = "View all",
}: {
	to: string;
	label?: string;
}) {
	return (
		<Link
			to={to}
			className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-dark"
		>
			{label} <ArrowRight size={13} />
		</Link>
	);
}

/* ------------------------------------------------------------------ */
/* EmptyState                                                          */
/* ------------------------------------------------------------------ */

export function EmptyState({
	icon: Icon,
	title,
	description,
	action,
	className,
}: {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-2 py-10 text-center",
				className,
			)}
		>
			<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light">
				<Icon size={22} className="text-primary/50" />
			</div>
			<p className="mt-1 text-sm font-medium text-foreground">{title}</p>
			{description && (
				<p className="max-w-xs text-xs text-muted">{description}</p>
			)}
			{action && <div className="mt-2">{action}</div>}
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* StatusBadge — small, defined palette used sparingly                */
/* ------------------------------------------------------------------ */

type StatusTone = "neutral" | "primary" | "success" | "warning" | "danger";

const toneClasses: Record<StatusTone, string> = {
	neutral: "bg-muted/10 text-muted",
	primary: "bg-primary-light text-primary",
	success: "bg-emerald-50 text-emerald-700",
	warning: "bg-amber-50 text-amber-700",
	danger: "bg-red-50 text-red-600",
};

export function StatusBadge({
	children,
	tone = "neutral",
	className,
}: {
	children: ReactNode;
	tone?: StatusTone;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
				toneClasses[tone],
				className,
			)}
		>
			{children}
		</span>
	);
}
