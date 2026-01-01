"use client";

import type React from "react";
import { useCallback } from "react";
import { useCreateSatAttemptMCQAnswer } from "@/hooks/sat-attempt";
import { useExamStore } from "@/store/useExamStore";

interface AnswerOptionProps {
	questionId: string;
	optionId: string;
	attemptId: string;
	label: string;
	text: string;
	isSelected: boolean;
	isStrikethrough: boolean;
}

export function AnswerOption({
	questionId,
	optionId,
	attemptId,
	label,
	text,
	isSelected,
	isStrikethrough,
}: AnswerOptionProps) {
	const selectAnswer = useExamStore((s) => s.selectAnswer);
	const strikethroughAnswer = useExamStore((s) => s.strikethroughAnswer);
	const removeStrikethrough = useExamStore((s) => s.removeStrikethrough);
	const isShowUndo = useExamStore((s) => s.isShowUndo);

	const mcqAnswerMutation = useCreateSatAttemptMCQAnswer();

	const handleSelectAnswer = useCallback(() => {
		mcqAnswerMutation.mutate({
			attemptId,
			questionId,
			choice: optionId,
		});
		selectAnswer(questionId, optionId);
	}, [attemptId, questionId, optionId, selectAnswer, mcqAnswerMutation]);

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
			onClick={handleSelectAnswer}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleSelectAnswer();
				}
			}}
			aria-pressed={isSelected}
			aria-label={`Option ${label}: ${text}`}
		>
			<div className="flex items-start">
				<div className="flex items-center gap-3 flex-1">
					<div
						className={`flex items-center justify-center w-7 h-7 rounded-full border-2 text-sm font-semibold mt-0.5 shrink-0 ${
							isSelected
								? "border-blue-600 bg-blue-600 text-white"
								: isStrikethrough
									? "border-gray-300 text-gray-400"
									: "border-gray-600 text-gray-700"
						}`}
						aria-hidden="true"
					>
						{label}
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
					<div className="  ">
						{isStrikethrough ? (
							<button
								type="button"
								className="text-sm  font-semibold text-black underline"
							>
								Undo
							</button>
						) : (
							<button
								type="button"
								onClick={() => strikethroughAnswer(questionId, optionId)}
								className="size-6 me-auto relative rounded-full border-2 border-black/70  text-gray-700 flex justify-center items-center transition-colors"
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
