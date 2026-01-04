"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	useCreateSatAttemptMCQAnswer,
	useCreateSatAttemptTextAnswer,
} from "@/hooks/sat-attempt";
import { useExamStore } from "@/store/useExamStore";

interface FillInTheBlankProps {
	questionId: string;
	attemptId: string;
	value: string;
}

export function FillInTheBlank({
	questionId,
	attemptId,
	value,
}: FillInTheBlankProps) {
	const setTextAnswer = useExamStore((s) => s.setTextAnswer);
	const textAnswerMutation = useCreateSatAttemptTextAnswer();

	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleBlur = useCallback(() => {
		if (localValue !== value) {
			// Save to store
			setTextAnswer(questionId, localValue);

			// Save to API (you might need to create a different mutation for text answers)
			// For now, we'll use the same mutation but this should ideally be a separate endpoint
			textAnswerMutation.mutate({
				attemptId,
				questionId,
				textAnswer: localValue, // Empty for text answers
			});
		}
	}, [
		localValue,
		value,
		questionId,
		attemptId,
		setTextAnswer,
		textAnswerMutation,
	]);

	return (
		<div className="w-[95%]">
			<Input
				type="text"
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				onBlur={handleBlur}
				placeholder="Type your answer here..."
				className="w-full px-4 py-3 border-2 border-slate-500 rounded-lg text-base focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
			/>
			{/* <p className="text-sm text-gray-500 mt-2">
        Press Tab or click outside the box to save your answer
      </p> */}
		</div>
	);
}
