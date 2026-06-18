import { useCallback } from "react";
import { useCreateSatAttemptMCQAnswer } from "@/hooks/sat-attempt";
import { useExamStore } from "@/store/useExamStore";

interface TrueFalseOptionProps {
	questionId: string;
	attemptId: string;
	options: { id: string; label: string; text: string }[];
	selectedAnswer?: string | null;
}

export function TrueFalseOption({
	questionId,
	attemptId,
	options,
	selectedAnswer,
}: TrueFalseOptionProps) {
	const selectAnswer = useExamStore((s) => s.selectAnswer);
	const mcqAnswerMutation = useCreateSatAttemptMCQAnswer();

	const handleSelectAnswer = useCallback(
		(optionId: string) => {
			mcqAnswerMutation.mutate({
				attemptId,
				questionId,
				selectedOptionIds: [optionId],
			});
			selectAnswer(questionId, optionId);
		},
		[attemptId, questionId, selectAnswer, mcqAnswerMutation],
	);

	// True/False questions typically have 2 options
	const trueOption = options.find(
		(o) => o.text.toLowerCase() === "true" || o.label === "A",
	);
	const falseOption = options.find(
		(o) => o.text.toLowerCase() === "false" || o.label === "B",
	);

	return (
		<div className="flex gap-4 w-[95%]">
			{trueOption && (
				<button
					type="button"
					onClick={() => handleSelectAnswer(trueOption.id)}
					className={`flex-1 py-4 rounded-lg border-2 text-center font-semibold text-lg transition-all ${
						selectedAnswer === trueOption.id
							? "border-blue-600 bg-blue-50 text-blue-900"
							: "border-slate-500 bg-white text-gray-700 hover:border-gray-400"
					}`}
					aria-pressed={selectedAnswer === trueOption.id}
				>
					True
				</button>
			)}
			{falseOption && (
				<button
					type="button"
					onClick={() => handleSelectAnswer(falseOption.id)}
					className={`flex-1 py-4 rounded-lg border-2 text-center font-semibold text-lg transition-all ${
						selectedAnswer === falseOption.id
							? "border-blue-600 bg-blue-50 text-blue-900"
							: "border-slate-500 bg-white text-gray-700 hover:border-gray-400"
					}`}
					aria-pressed={selectedAnswer === falseOption.id}
				>
					False
				</button>
			)}
		</div>
	);
}
