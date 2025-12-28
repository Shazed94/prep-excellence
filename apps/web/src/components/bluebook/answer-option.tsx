"use client";

import type React from "react";
import { useCallback } from "react";
import { useExamStore } from "@/store/useExamStore";

interface AnswerOptionProps {
	questionId: string;
	optionId: string;
	label: string;
	text: string;
	isSelected: boolean;
	isStrikethrough: boolean;
}

export function AnswerOption({
	questionId,
	optionId,
	label,
	text,
	isSelected,
	isStrikethrough,
}: AnswerOptionProps) {
	const selectAnswer = useExamStore((s) => s.selectAnswer);
	const strikethroughAnswer = useExamStore((s) => s.strikethroughAnswer);
	const removeStrikethrough = useExamStore((s) => s.removeStrikethrough);

	const handleSelectAnswer = useCallback(() => {
		selectAnswer(questionId, optionId);
	}, [questionId, optionId, selectAnswer]);

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
			className={`relative mb-4 w-full text-left cursor-pointer rounded-lg border-2 px-5 py-4 transition-all ${
				isSelected
					? "border-blue-600 bg-blue-50"
					: "border-gray-300 bg-white hover:border-gray-400"
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
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-3 flex-1">
					<div
						className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold mt-0.5 flex-shrink-0 ${
							isSelected
								? "border-blue-600 bg-blue-600 text-white"
								: "border-gray-400 text-gray-700"
						}`}
						aria-hidden="true"
					>
						{label}
					</div>
					<p
						className={`text-base leading-relaxed flex-1 ${
							isStrikethrough
								? "line-through text-gray-400"
								: isSelected
									? "text-blue-900 font-medium"
									: "text-gray-700"
						}`}
					>
						{text}
					</p>
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
					className="ml-3 flex-shrink-0 transition-colors group"
					title={isStrikethrough ? "Undo strikethrough" : "Eliminate option"}
					aria-label={
						isStrikethrough ? "Undo strikethrough" : "Eliminate option"
					}
				>
					{isStrikethrough ? (
						<span className="text-sm font-semibold text-blue-600 hover:text-blue-700">
							Undo
						</span>
					) : (
						<div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors" />
					)}
				</button>
			</div>
		</button>
	);
}
