// components/course/quiz/quiz-summary.tsx

import { CheckCircle, FileText, Hash, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizSummaryProps {
	totalQuestions: number;
	totalPoints: number;
	passingScore: number;
	onReset: () => void;
	onSubmit: () => void;
	isSubmitting?: boolean;
}

export function QuizSummary({
	totalQuestions,
	totalPoints,
	passingScore,
	onReset,
	onSubmit,
	isSubmitting = false,
}: QuizSummaryProps) {
	return (
		<div className="sticky bottom-0 bg-white border-t p-4  shadow-lg">
			<div className="flex items-center justify-between">
				{/* Summary Stats */}
				<div className="space-y-1">
					<div className="flex items-center gap-4 text-sm flex-wrap">
						<div className="flex items-center gap-2">
							<FileText className="w-4 h-4 text-slate-500" />
							<span className="font-medium">
								{totalQuestions} question{totalQuestions !== 1 ? "s" : ""}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Hash className="w-4 h-4 text-slate-500" />
							<span className="font-medium">{totalPoints} total points</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-slate-500" />
							<span className="font-medium">{passingScore}% passing score</span>
						</div>
					</div>
					<p className="text-xs text-slate-500">
						All fields marked with * are required
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={onReset}
						disabled={isSubmitting}
						className="gap-2"
					>
						<RefreshCw className="w-4 h-4" />
						Reset
					</Button>
					<Button
						type="submit"
						onClick={onSubmit}
						disabled={isSubmitting}
						className="gap-2"
					>
						<Save className="w-4 h-4" />
						{isSubmitting ? "Saving..." : "Save Quiz"}
					</Button>
				</div>
			</div>
		</div>
	);
}
