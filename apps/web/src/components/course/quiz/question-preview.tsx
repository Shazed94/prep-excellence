// components/course/quiz/question-preview.tsx

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface QuestionOption {
	text: string;
	isCorrect: boolean;
	orderIndex: number;
}

interface Question {
	id?: string;
	question: string;
	type: "MCQ_SINGLE" | "MCQ_MULTIPLE" | "TRUE_FALSE" | "SHORT" | "LONG";
	orderIndex: number;
	points: number;
	explanation?: string;
	options?: QuestionOption[];
}

interface QuestionPreviewProps {
	question: Question;
	currentIndex: number;
}

export function QuestionPreview({
	question,
	currentIndex,
}: QuestionPreviewProps) {
	return (
		<Card className="border-slate-200 h-full sticky top-4">
			<CardHeader className="pb-1">
				<CardTitle className="text-base flex items-center justify-between">
					<span>Question {currentIndex + 1}</span>
					<Badge variant="outline" className="font-normal text-xs">
						{question.type}
					</Badge>
				</CardTitle>
				<CardDescription className="line-clamp-2">
					{question.question || "No question content yet"}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-1">
				{/* Multiple Choice Preview */}
				{(question.type === "MCQ_SINGLE" || question.type === "MCQ_MULTIPLE") &&
					question.options && (
						<div className="space-y-2">
							{question.options.map((option, index) => (
								<div
									key={index}
									className={`p-2 px-3 rounded-lg border text-sm transition-colors ${
										option.isCorrect
											? "border-emerald-500 bg-emerald-50"
											: "border-slate-200 bg-slate-50"
									}`}
								>
									<div className="flex items-start gap-2">
										<div
											className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
												option.isCorrect
													? "bg-emerald-500 text-white"
													: "bg-slate-300 text-slate-700"
											}`}
										>
											{String.fromCharCode(65 + index)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-slate-700">
												{option.text ||
													`Option ${String.fromCharCode(65 + index)}`}
											</p>
											{option.isCorrect && (
												<div className="flex items-center gap-1 mt-1 text-emerald-600">
													<CheckCircle2 className="w-3 h-3" />
													<span className="text-xs font-medium">Correct</span>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}

				{/* True/False Preview */}
				{question.type === "TRUE_FALSE" && question.options && (
					<div className="grid grid-cols-2 gap-2">
						{[
							{ text: "True", value: true },
							{ text: "False", value: false },
						].map((item) => {
							const isCorrect = question.options?.some(
								(o) => o.text === String(item.value) && o.isCorrect,
							);
							return (
								<div
									key={item.text}
									className={`p-2 rounded-lg border text-center transition-colors ${
										isCorrect
											? "border-emerald-500 bg-emerald-50"
											: "border-slate-200 bg-slate-50"
									}`}
								>
									<p className="text-sm font-medium text-slate-700">
										{item.text}
									</p>
									{isCorrect && (
										<div className="flex items-center justify-center gap-1 mt-1 text-emerald-600">
											<CheckCircle2 className="w-3 h-3" />
											<span className="text-xs">Correct</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}

				{/* Short/Long Answer Preview */}
				{(question.type === "SHORT" || question.type === "LONG") && (
					<div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
						<p className="text-xs font-medium text-blue-700 mb-1">
							{question.type === "SHORT" ? "Short Answer" : "Long Answer"}
						</p>
						<p className="text-xs text-blue-600 line-clamp-3">
							{question.options?.[0]?.text || "No rubric provided"}
						</p>
					</div>
				)}
			</CardContent>

			{/* Explanation Footer */}
			{question.explanation && (
				<CardFooter className="pt-3 border-t bg-slate-50">
					<div className="text-xs">
						<p className="font-medium text-slate-700 mb-1">Explanation:</p>
						<p className="text-slate-600 line-clamp-3">
							{question.explanation}
						</p>
					</div>
				</CardFooter>
			)}

			{/* Points Badge */}
			<div className="px-4 pb-4">
				<Badge variant="secondary" className="w-full justify-center">
					{question.points} point{question.points !== 1 ? "s" : ""}
				</Badge>
			</div>
		</Card>
	);
}
