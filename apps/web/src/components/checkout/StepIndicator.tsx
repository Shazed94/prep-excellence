import {
	CheckSvg,
	PaymentCardSvg,
	UserAccountSvg,
} from "@/components/SvgComponents";
import { cn } from "@/lib/utils";
import type { Step } from "./types";
import { STEP_ORDER } from "./types";

export function StepIndicator({
	currentStep,
	onStepClick,
}: {
	currentStep: Step;
	onStepClick: (step: Step) => void;
}) {
	const currentIdx = STEP_ORDER.indexOf(currentStep);

	const steps = [
		{ key: "billing" as Step, label: "Billing Information" },
		{ key: "payment" as Step, label: "Make Payment" },
		{ key: "confirm" as Step, label: "Confirm" },
	];

	return (
		<div className="bg-[#F8F8F9] border-b border-gray-200 py-5 mb-8">
			<div className="container mx-auto">
				<div className="flex items-start justify-center max-w-xl mx-auto">
					{steps.map((step, idx) => {
						const isCompleted = idx < currentIdx;
						const isActive = idx === currentIdx;
						const isClickable = idx < currentIdx;
						const isLineCompleted = idx < currentIdx;

						return (
							<div key={step.key} className="flex items-start">
								{/* Circle + label */}
								<div className="flex flex-col items-center">
									<button
										type="button"
										onClick={() => isClickable && onStepClick(step.key)}
										disabled={!isClickable}
										className={[
											"w-12 h-12 rounded-full flex items-center justify-center border transition-all",
											isActive
												? "bg-blue-600 border-blue-600 text-white"
												: isCompleted
													? "bg-blue-600 border-blue-600 text-white cursor-pointer hover:bg-blue-700"
													: "bg-white border-gray-300 text-gray-400",
										].join(" ")}
									>
										<span className="">
											{step.key === "billing" ? (
												<UserAccountSvg className="text-white" />
											) : step.key === "payment" ? (
												<PaymentCardSvg
													className={cn({
														"text-white": isCompleted || isActive,
													})}
												/>
											) : (
												<CheckSvg
													className={cn({
														"text-white": isActive || isCompleted,
													})}
												/>
											)}
										</span>
									</button>
									<span
										className={[
											"text-[12px] md:text-[18px] mt-2 whitespace-nowrap",
											isActive || isCompleted
												? "text-[#1552FD] font-medium"
												: "text-gray-400",
										].join(" ")}
									>
										{step.label}
									</span>
								</div>

								{/* Connector line between steps */}
								{idx < steps.length - 1 && (
									<div className="flex items-center mt-5 mx-1">
										<div
											className={[
												"w-2 h-2 rounded-full border shrink-0",
												isCompleted || isActive
													? "border-white bg-[#1552FD]"
													: "border-[#141511] bg-white",
											].join(" ")}
										/>
										<div
											className={[
												"w-12 md:w-24 h-px shrink-0",
												isLineCompleted || isActive
													? "bg-[repeating-linear-gradient(to_right,#1552fd_0,#1552fd_4px,transparent_4px,transparent_8px)]"
													: "bg-[repeating-linear-gradient(to_right,#141511_0,#141511_4px,transparent_4px,transparent_8px)]",
											].join(" ")}
										/>
										<div
											className={[
												"w-2 h-2 rounded-full border shrink-0",
												idx + 1 < currentIdx ||
												idx === currentIdx ||
												isLineCompleted
													? "border-[#1552FD] "
													: "border-[#141511] bg-white",
											].join(" ")}
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
