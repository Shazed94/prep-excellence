import { Bookmark } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Question } from "@/store/question";
import { useExamStore } from "@/store/useExamStore";
import { AnswerOption } from "./answer-option";
import { FillInTheBlank } from "./fill-in-the-blank";
import { MultipleChoiceOption } from "./multiple-choice-option";
import { ShortAnswer } from "./short-answer";
import { TrueFalseOption } from "./true-false-option";

interface QuestionDisplayProps {
	question: Question;
	attemptId: string;
}

export function QuestionDisplay({ question, attemptId }: QuestionDisplayProps) {
	const isShowUndo = useExamStore((s) => s.isShowUndo);
	const setShowUndo = useExamStore((s) => s.setShowUndo);
	const answer = useExamStore((s) => s.getAnswer(question.id));
	const toggleMarkForReview = useExamStore((s) => s.toggleMarkForReview);
	const isMarkedForReview = answer?.markedForReview || false;

	const questionType = question.optionType || "SINGLE_CHOICE";

	return (
		<div className="space-y-4 w-[95%] mx-auto">
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
								? "text-red-600 border-black"
								: "text-gray-600 hover:text-red-600"
						}`}
					>
						<Bookmark
							className="w-4 h-4"
							fill={isMarkedForReview ? "currentColor" : "none"}
						/>
					</button>
					<span>Mark for Review</span>
				</div>

				{(questionType === "SINGLE_CHOICE" ||
					questionType === "MULTIPLE_CHOICE") && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={() => {
										setShowUndo(!isShowUndo);
									}}
									className={`${
										isShowUndo
											? "bg-blue-500 text-white"
											: "bg-white text-black"
									} px-1.5 py-1.5 rounded me-1 text-xs font-semibold relative cursor-pointer`}
								>
									ABC
									<span
										className={`absolute inset-0 top-3.5 h-px bg-black rotate-145`}
									></span>
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Cross out answer choices you think are wrong</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>

			{/* Answer Options Based on Question Type */}
			<div className="space-y-2 pt-4">
				{questionType === "SINGLE_CHOICE" &&
					question?.options?.map((option) => (
						<AnswerOption
							key={option.id}
							questionId={question.id}
							attemptId={attemptId}
							optionId={option.id}
							label={option.label}
							text={option.text}
							isSelected={answer?.selectedAnswer === option.id}
							isStrikethrough={
								answer?.strikethroughAnswers?.includes(option.id) || false
							}
						/>
					))}

				{questionType === "MULTIPLE_CHOICE" &&
					question?.options?.map((option) => (
						<MultipleChoiceOption
							key={option.id}
							questionId={question.id}
							attemptId={attemptId}
							optionId={option.id}
							label={option.label}
							text={option.text}
							isSelected={answer?.selectedAnswers?.includes(option.id) || false}
							isStrikethrough={
								answer?.strikethroughAnswers?.includes(option.id) || false
							}
						/>
					))}

				{questionType === "TRUE_FALSE" && (
					<TrueFalseOption
						questionId={question.id}
						attemptId={attemptId}
						options={question.options || []}
						selectedAnswer={answer?.selectedAnswer}
					/>
				)}

				{questionType === "FILL_IN_THE_BLANK" && (
					<FillInTheBlank
						questionId={question.id}
						attemptId={attemptId}
						value={answer?.textAnswer || ""}
					/>
				)}

				{questionType === "SHORT_ANSWER" && (
					<ShortAnswer
						questionId={question.id}
						attemptId={attemptId}
						value={answer?.textAnswer || ""}
					/>
				)}
			</div>
		</div>
	);
}
