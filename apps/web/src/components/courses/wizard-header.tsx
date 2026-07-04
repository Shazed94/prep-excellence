import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Minimalist step header for the course create/edit wizard.
 * Shared by the basic-info, details and modules steps.
 */
const STEPS = ["Basics", "Details", "Modules"] as const;

export function WizardHeader({
	title,
	subtitle,
	currentStep,
	onStepClick,
}: {
	title: string;
	subtitle?: string;
	/** 1-based index of the active step */
	currentStep: 1 | 2 | 3;
	/** When provided, step chips become clickable (e.g. in edit mode). */
	onStepClick?: (step: 1 | 2 | 3) => void;
}) {
	return (
		<div className="space-y-5">
			<div>
				<h1 className="font-switzer text-xl font-semibold text-foreground md:text-2xl">
					{title}
				</h1>
				{subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
			</div>

			<div className="flex items-center gap-2">
				{STEPS.map((label, i) => {
					const step = (i + 1) as 1 | 2 | 3;
					const isDone = step < currentStep;
					const isActive = step === currentStep;
					const clickable = !!onStepClick;
					const chipClass = cn(
						"flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
						isActive && "bg-primary text-white",
						isDone && "bg-primary-light text-primary",
						!isActive && !isDone && "bg-muted/10 text-muted",
						clickable &&
							!isActive &&
							"hover:bg-primary-light hover:text-primary",
					);
					const inner = (
						<>
							<span
								className={cn(
									"flex h-4 w-4 items-center justify-center rounded-full text-[10px]",
									isActive && "bg-white/20",
									isDone && "bg-primary/15",
									!isActive && !isDone && "bg-muted/20",
								)}
							>
								{isDone ? <Check size={10} /> : step}
							</span>
							{label}
						</>
					);
					return (
						<div key={label} className="flex items-center gap-2">
							{clickable ? (
								<button
									type="button"
									onClick={() => onStepClick?.(step)}
									className={chipClass}
								>
									{inner}
								</button>
							) : (
								<div className={chipClass}>{inner}</div>
							)}
							{step < STEPS.length && (
								<div className="h-px w-4 bg-border sm:w-8" />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
