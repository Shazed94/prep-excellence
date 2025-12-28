"use client";

import { Bookmark } from "lucide-react";
import type { Question } from "@/store/question";
import { useExamStore } from "@/store/useExamStore";
import { AnswerOption } from "./answer-option";

interface QuestionDisplayProps {
	question: Question;
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
	const answer = useExamStore((s) => s.getAnswer(question.id));
	const toggleMarkForReview = useExamStore((s) => s.toggleMarkForReview);

	const isMarkedForReview = answer?.markedForReview || false;

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between bg-gray-200 border-b-2 pb-0.5 border-slate-700 border-dashed">
				<div className="flex items-center gap-2">
					<div className="bg-gray-800 text-white font-bold w-8 h-8  flex items-center justify-center text-sm">
						{question.questionNumber}
					</div>
					<button
						type="button"
						onClick={() => toggleMarkForReview(question.id)}
						className={`flex items-center gap-1 text-sm font-medium transition-colors ${
							isMarkedForReview
								? "text-red-600"
								: "text-gray-600 hover:text-red-600"
						}`}
					>
						<Bookmark
							className="w-4 h-4"
							fill={isMarkedForReview ? "currentColor" : "none"}
						/>
						Mark for Review
					</button>
				</div>
				<div className="bg-blue-600 text-white px-1.5 py-1.5 rounded me-1 text-xs font-semibold">
					ABC
				</div>
			</div>

			{/* Question Text */}
			<h3 className="font-serif text-base text-gray-800 leading-relaxed">
				{question.text}
			</h3>

			{/* Passage (only for non-split layout) */}
			{question.passage && question.layout !== "split" && (
				<div className="bg-gray-50 p-4 rounded text-sm text-gray-700 whitespace-pre-line border-l-4 border-gray-300">
					{question.passage}
				</div>
			)}

			{/* Answer Options */}
			<div className="space-y-2 pt-4">
				{question?.options?.map((option) => (
					<AnswerOption
						key={option.id}
						questionId={question.id}
						optionId={option.id}
						label={option.label}
						text={option.text}
						isSelected={answer?.selectedAnswer === option.id}
						isStrikethrough={
							answer?.strikethroughAnswers?.includes(option.id) || false
						}
					/>
				))}
			</div>
		</div>
	);
}
