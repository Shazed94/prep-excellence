// components/course/quiz/question-navigator.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuestionNavigatorProps {
	currentIndex: number;
	totalQuestions: number;
	onPrevious: () => void;
	onNext: () => void;
	onSelectQuestion: (index: number) => void;
}

export function QuestionNavigator({
	currentIndex,
	totalQuestions,
	onPrevious,
	onNext,
	onSelectQuestion,
}: QuestionNavigatorProps) {
	if (totalQuestions <= 1) {
		return null;
	}

	return (
		<div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border">
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onPrevious}
				disabled={currentIndex === 0}
				className="gap-2"
			>
				<ChevronLeft className="w-4 h-4" />
				Previous
			</Button>

			<div className="flex items-center gap-3">
				{/* Question Dots */}
				<div className="flex gap-2">
					{Array.from({ length: totalQuestions }).map((_, index) => (
						<button
							key={index}
							type="button"
							onClick={() => onSelectQuestion(index)}
							className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
								index === currentIndex
									? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
									: "bg-slate-200 hover:bg-slate-300 text-slate-700"
							}`}
							title={`Go to question ${index + 1}`}
						>
							{index + 1}
						</button>
					))}
				</div>

				{/* Progress Badge */}
				<Badge variant="secondary" className="ml-2 whitespace-nowrap">
					{currentIndex + 1}/{totalQuestions}
				</Badge>
			</div>

			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onNext}
				disabled={currentIndex === totalQuestions - 1}
				className="gap-2"
			>
				Next
				<ChevronRight className="w-4 h-4" />
			</Button>
		</div>
	);
}
