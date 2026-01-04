"use client";

import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSatAttemptMCQAnswer } from "@/hooks/sat-attempt";
import { useExamStore } from "@/store/useExamStore";

interface ShortAnswerProps {
	questionId: string;
	attemptId: string;
	value: string;
}

export function ShortAnswer({
	questionId,
	attemptId,
	value,
}: ShortAnswerProps) {
	const setTextAnswer = useExamStore((s) => s.setTextAnswer);
	const mcqAnswerMutation = useCreateSatAttemptMCQAnswer();
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleBlur = useCallback(() => {
		if (localValue !== value) {
			// Save to store
			setTextAnswer(questionId, localValue);

			// Save to API (you might need to create a different mutation for text answers)
			mcqAnswerMutation.mutate({
				attemptId,
				questionId,
				selectedOptionIds: [], // Empty for text answers
			});
		}
	}, [
		localValue,
		value,
		questionId,
		attemptId,
		setTextAnswer,
		mcqAnswerMutation,
	]);

	return (
		<div className="w-[95%]">
			<Textarea
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				onBlur={handleBlur}
				placeholder="Type your answer here..."
				rows={6}
				className="w-full px-4 py-3 border-2 border-slate-500 rounded-lg text-base focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-vertical"
			/>
			<div className="flex justify-between items-center mt-2">
				<p className="text-sm text-gray-500">
					Press Tab or click outside the box to save your answer
				</p>
				<p className="text-sm text-gray-400">{localValue.length} characters</p>
			</div>
		</div>
	);
}
