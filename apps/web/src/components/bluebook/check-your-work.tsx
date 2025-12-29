"use client";

import { Bookmark, SquareDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_1_QUESTIONS } from "@/store/question";
import { useExamStore } from "@/store/useExamStore";

export function CheckYourWork() {
	const answers = useExamStore((s) => s.answers);

	const getQuestionStatus = (questionId: string) => {
		const answer = answers[questionId];
		if (answer?.markedForReview) return "review";
		if (answer?.selectedAnswer) return "answered";
		return "unanswered";
	};

	return (
		<div className=" w-full bg-white items-center justify-center py-12 px-4">
			<div className="max-w-2xl w-full mx-auto">
				<h1 className="text-4xl text-center mb-6">Check Your Work</h1>

				<div className="  mb-8">
					<p className="text-gray-700 mb-2">
						On test day, you won't be able to move on to the next module until
						time expires.
					</p>
					<p className="text-gray-700">
						For these practice questions, you can click{" "}
						<span className="font-bold">Next</span> when you're ready to move
						on.
					</p>
				</div>

				{/* Question Summary */}
				<div className=" bg-white shadow-xl rounded-lg p-6 mb-8">
					<div className="flex items-center justify-between border-b mb-4">
						<h2 className="text-xl font-bold mb-4 ">Section I Questions</h2>

						<div className="flex gap-4 mb-4 ">
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-700">
									<SquareDashed className="inline" /> Unanswered
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-700">
									<Bookmark
										fill="currentColor"
										className={`inline text-red-500`}
									/>
									For Review
								</span>
							</div>
						</div>
					</div>

					{/* Question Grid */}
					<div className="flex flex-wrap items-center gap-3 py-3">
						{SECTION_1_QUESTIONS.map((question) => {
							const status = getQuestionStatus(question.id);
							return (
								<div
									key={question.id}
									className={`size-7 flex items-center justify-center text-xs font-bold rounded border-2 ${
										status === "answered"
											? "bg-blue-600 text-white border-blue-600"
											: status === "review"
												? "border-red-600 text-red-600 border-2"
												: "border-gray-300 text-gray-600 border-dashed"
									}`}
								>
									{question.questionNumber}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
