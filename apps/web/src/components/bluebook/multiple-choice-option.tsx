import type React from "react";
import { useCallback } from "react";
import { useCreateSatAttemptMCQAnswer } from "@/hooks/sat-attempt";
import { useExamStore } from "@/store/useExamStore";

interface MultipleChoiceOptionProps {
	questionId: string;
	optionId: string;
	attemptId: string;
	label: string;
	text: string;
	isSelected: boolean;
	isStrikethrough: boolean;
}

export function MultipleChoiceOption({
	questionId,
	optionId,
	attemptId,
	label,
	text,
	isSelected,
	isStrikethrough,
}: MultipleChoiceOptionProps) {
	const selectMultipleAnswers = useExamStore((s) => s.selectMultipleAnswers);
	const strikethroughAnswer = useExamStore((s) => s.strikethroughAnswer);
	const removeStrikethrough = useExamStore((s) => s.removeStrikethrough);
	const isShowUndo = useExamStore((s) => s.isShowUndo);
	const answer = useExamStore((s) => s.getAnswer(questionId));

	const mcqAnswerMutation = useCreateSatAttemptMCQAnswer();

	const handleToggleAnswer = useCallback(() => {
		const currentSelections = answer?.selectedAnswers || [];
		let newSelections: string[];

		if (isSelected) {
			// Remove from selections
			newSelections = currentSelections.filter((id) => id !== optionId);
		} else {
			// Add to selections
			newSelections = [...currentSelections, optionId];
		}

		mcqAnswerMutation.mutate({
			attemptId,
			questionId,
			selectedOptionIds: newSelections,
		});
		selectMultipleAnswers(questionId, newSelections);
	}, [
		attemptId,
		questionId,
		optionId,
		isSelected,
		answer?.selectedAnswers,
		selectMultipleAnswers,
		mcqAnswerMutation,
	]);

	const handleToggleStrikethrough = useCallback(
		(e: React.MouseEvent | React.KeyboardEvent) => {
			e.stopPropagation();
			if (isStrikethrough) {
				removeStrikethrough(questionId, optionId);
			} else {
				strikethroughAnswer(questionId, optionId);
			}
		},
		[
			isStrikethrough,
			questionId,
			optionId,
			strikethroughAnswer,
			removeStrikethrough,
		],
	);

	return (
		<button
			type="button"
			className={`group relative mb-4 w-[95%] text-left cursor-pointer rounded-lg border-2 px-5 py-2 transition-all ${
				isSelected
					? "border-blue-600 bg-blue-50"
					: "border-slate-500 bg-white hover:border-gray-400"
			}`}
			onClick={handleToggleAnswer}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleToggleAnswer();
				}
			}}
			aria-pressed={isSelected}
			aria-label={`Option ${label}: ${text}`}
		>
			<div className="flex items-start">
				<div className="flex items-center gap-3 flex-1">
					{/* Checkbox instead of radio */}
					<div
						className={`flex items-center justify-center w-7 h-7 rounded border-2 text-sm font-semibold mt-0.5 shrink-0 ${
							isSelected
								? "border-blue-600 bg-blue-600 text-white"
								: isStrikethrough
									? "border-gray-300 text-gray-400"
									: "border-gray-600 text-gray-700"
						}`}
						aria-hidden="true"
					>
						{isSelected && (
							<svg
								className="w-4 h-4"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-label="Selected"
							>
								<title>Selected</title>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</div>
					<p
						className={`text-base leading-relaxed flex-1 ${
							isStrikethrough
								? "text-gray-400"
								: isSelected
									? "text-blue-900 font-medium"
									: "text-gray-700"
						}`}
					>
						{text}
					</p>
				</div>
			</div>
			<button
				type="button"
				onClick={handleToggleStrikethrough}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleToggleStrikethrough(e);
					}
				}}
				className="absolute -right-12 top-1/2 -translate-y-1/2 transition-colors"
				title={isStrikethrough ? "Undo strikethrough" : "Eliminate option"}
				aria-label={isStrikethrough ? "Undo strikethrough" : "Eliminate option"}
			>
				{isShowUndo && (
					<div className="">
						{isStrikethrough ? (
							<button
								type="button"
								className="text-sm font-semibold text-black underline"
							>
								Undo
							</button>
						) : (
							<button
								type="button"
								onClick={() => strikethroughAnswer(questionId, optionId)}
								className="size-6 me-auto relative rounded-full border-2 border-black/70 text-gray-700 flex justify-center items-center transition-colors"
							>
								{label}
								<span className="absolute -left-1 -right-1 h-px bg-gray-600"></span>
							</button>
						)}
					</div>
				)}
			</button>
			{isStrikethrough && (
				<div className="absolute -left-1 -right-1 top-1/2 h-0.5 bg-black transform -translate-y-1/2" />
			)}
		</button>
	);
}
