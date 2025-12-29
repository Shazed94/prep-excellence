"use client";

import { Button } from "@/components/ui/button";
import { SECTION_1_QUESTIONS } from "@/store/question";
import { useExamStore } from "@/store/useExamStore";

interface CheckYourWorkProps {
	onNext: () => void;
	handleBack: () => void;
}

export function CheckYourWork({ onNext, handleBack }: CheckYourWorkProps) {
	const answers = useExamStore((s) => s.answers);

	const getQuestionStatus = (questionId: string) => {
		const answer = answers[questionId];
		if (answer?.markedForReview) return "review";
		if (answer?.selectedAnswer) return "answered";
		return "unanswered";
	};

	const answeredCount = SECTION_1_QUESTIONS.filter(
		(q) => getQuestionStatus(q.id) === "answered",
	).length;
	const unansweredCount = SECTION_1_QUESTIONS.filter(
		(q) => getQuestionStatus(q.id) === "unanswered",
	).length;

	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4">
			<div className="max-w-2xl w-full">
				<h1 className="text-4xl font-bold text-center mb-6">Check Your Work</h1>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
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
				<div className=" bg-gray-50 rounded-lg p-6 mb-8">
					<div className="flex items-center justify-between border-b mb-4">
						<h2 className="text-xl font-bold mb-4 ">Section I Questions</h2>

						<div className="flex gap-4 mb-6 pb-4 ">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-blue-600 rounded"></div>
								<span className="text-sm text-gray-700">
									Answered: {answeredCount}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
								<span className="text-sm text-gray-700">
									Unanswered: {unansweredCount}
								</span>
							</div>
						</div>
					</div>

					{/* Question Grid */}
					<div className="grid grid-cols-10 gap-2">
						{SECTION_1_QUESTIONS.map((question) => {
							const status = getQuestionStatus(question.id);
							return (
								<div
									key={question.id}
									className={`aspect-square flex items-center justify-center text-xs font-bold rounded border-2 ${
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

				<div className="flex justify-end">
					<Button
						type="button"
						onClick={handleBack}
						style={{ backgroundColor: "var(--button-blue)" }}
						className="px-6 h-10! bg-indigo-600! rounded-full text-white font-bold hover:opacity-90 disabled:opacity-50"
					>
						Back
					</Button>
					<Button
						onClick={onNext}
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
