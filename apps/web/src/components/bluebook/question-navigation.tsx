"use client";

import { Bookmark, ChevronDown, MapPin, SquareDashed, X } from "lucide-react";
import { SECTION_1_QUESTIONS } from "@/store/question";
import { useExamStore } from "@/store/useExamStore";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "../ui/popover";

export function QuestionNavigator() {
	const setCurrentQuestion = useExamStore((s) => s.setCurrentQuestion);
	const answers = useExamStore((s) => s.answers);
	const currentQuestionId = useExamStore((s) => s.currentQuestionId);
	const setPage = useExamStore((s) => s.setPage);

	const currentIndex = SECTION_1_QUESTIONS.findIndex(
		(q) => q.id === currentQuestionId,
	);

	const getQuestionStatus = (questionId: string) => {
		const answer = answers[questionId];
		if (answer?.markedForReview) return "review";
		if (answer?.selectedAnswer) return "answered";
		return "unanswered";
	};
	const _currentStatus = getQuestionStatus(currentQuestionId);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="group flex items-center gap-2 px-4 py-2 bg-black text-white rounded font-semibold text-sm"
				>
					Question {currentIndex + 1} of {SECTION_1_QUESTIONS.length}
					<ChevronDown
						className="
          w-4 h-4
          transition-transform duration-200
          group-data-[state=open]:rotate-180
        "
					/>
				</button>
			</PopoverTrigger>

			<PopoverContent
				side="top"
				align="center"
				sideOffset={20}
				className="z-50 w-[360px] max-h-[70vh] p-0 bg-white shadow-xl overflow-hidden flex flex-col"
			>
				<span
					className="absolute -bottom-3 left-1/2 -translate-x-1/2
          w-0 h-0
          border-l-[20px] border-l-transparent
          border-r-[20px] border-r-transparent
          border-t-[20px] border-t-white
  "
				/>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b">
					<h2 className="">Section I Questions</h2>

					<PopoverClose asChild>
						<button type="button" className="text-gray-500 hover:text-gray-700">
							<X className="w-4 h-4" />
						</button>
					</PopoverClose>
				</div>

				{/* Legend */}
				<div className="flex justify-center items-center gap-4 px-4 py-3 border-b text-xs ">
					<span>
						<MapPin className="inline" /> Current
					</span>
					<span>
						<SquareDashed className="inline" /> Unanswered
					</span>
					<span>
						<Bookmark className={`inline text-red-600`} fill={"currentColor"} />
						For Review
					</span>
				</div>

				{/* Question Grid */}
				<div className="grid grid-cols-5 gap-2 p-4 py-6 overflow-y-auto">
					{SECTION_1_QUESTIONS?.map((question) => {
						const status = getQuestionStatus(question.id);
						const isCurrent = question.id === currentQuestionId;

						return (
							<button
								type="button"
								key={question.id}
								onClick={() => setCurrentQuestion(question.id)}
								className={`relative size-8 flex flex-wrap items-center justify-center text-sm font-bold rounded border-2 ${
									status === "answered"
										? "bg-blue-600 text-white border-blue-600"
										: status === "review"
											? "bg-blue-600 text-white border-blue-600"
											: "border-gray-300 text-gray-700 border-dashed"
								}`}
							>
								{status === "review" && (
									<Bookmark
										className={`absolute -right-2.5 -top-2.5 bg-white rounded ${
											status === "review" ? "text-red-600" : "text-gray-800"
										}`}
										fill={status === "review" ? "currentColor" : "none"}
										size={16}
									/>
								)}
								{question.questionNumber}
								{isCurrent && (
									<span className="absolute -top-[17px] left-1/2 -translate-x-1/2">
										<MapPin size={15} color="black" />
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* Footer */}
				<div className="border-t p-3">
					<button
						type="button"
						onClick={() => setPage("check-work")}
						className="block w-fit mx-auto bg-transparent text-blue-600 text-sm font-semibold px-2 py-1.5 rounded-full border border-blue-700"
					>
						Go to Review Page
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
