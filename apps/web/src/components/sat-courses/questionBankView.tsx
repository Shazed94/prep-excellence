import type { TGQuestion } from "@prepexcellence/shared-validators";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";

interface QuestionModalProps {
	question: TGQuestion;
	questions?: TGQuestion[]; // List of all questions for navigation
	onClose: () => void;
	onNavigate?: (question: TGQuestion) => void; // Callback when navigating to update parent state
}

export function QuestionBankModal({
	question,
	questions = [],
	onClose,
	onNavigate,
}: QuestionModalProps) {
	// Navigation logic
	const currentIndex =
		questions.length > 0
			? questions.findIndex((q) => q.id === question.id)
			: -1;
	const hasPrevious = currentIndex > 0;
	const hasNext = currentIndex >= 0 && currentIndex < questions.length - 1;
	const totalQuestions = questions.length;

	console.log("question", question);

	const handlePrevious = () => {
		if (hasPrevious) {
			const prevQuestion = questions[currentIndex - 1];
			onNavigate?.(prevQuestion);
		}
	};

	const handleNext = () => {
		if (hasNext) {
			const nextQuestion = questions[currentIndex + 1];
			onNavigate?.(nextQuestion);
		}
	};

	// Get difficulty level for visual indicator
	const getDifficultyDots = (difficulty: string) => {
		const level = difficulty?.toUpperCase();
		const activeCount = level === "EASY" ? 1 : level === "MEDIUM" ? 2 : 3;
		return Array(3)
			.fill(0)
			.map((_, i) => (
				<div
					key={i}
					className={`w-3 h-3 rounded-full ${
						i < activeCount ? "bg-primary" : "bg-muted"
					}`}
				/>
			));
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-card rounded-lg shadow-xl container mx-auto h-[90vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start z-10">
					<div className="flex-1">
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold text-foreground mb-4">
								Question ID: {question.questionID || question.id}
							</h2>
							{/* Close Button */}
							<Button
								onClick={onClose}
								className="p-2 hover:bg-muted rounded-lg transition-colors ml-4"
								aria-label="Close modal"
							>
								<X className="w-5 h-5" />
							</Button>
						</div>

						{/* Metadata Table (responsive) */}
						<div className="-mx-6 px-6 md:mx-0 md:px-0">
							<div className="overflow-x-auto max-w-[300px] sm:min-w-[600px]">
								<table className="min-w-full table-auto  border-collapse">
									<thead>
										<tr className="bg-secondary">
											<th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border">
												Test Type
											</th>
											<th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border">
												Subject
											</th>
											<th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border">
												Domain
											</th>
											<th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border">
												Skill
											</th>
											<th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border">
												Difficulty
											</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="px-4 py-2 text-sm text-foreground border border-border">
												{question.testType?.name || "N/A"}
											</td>
											<td className="px-4 py-2 text-sm text-foreground border border-border">
												{question.subject?.name || "N/A"}
											</td>
											<td className="px-4 py-2 text-sm text-foreground border border-border">
												{question.domain?.name || "N/A"}
											</td>
											<td className="px-4 py-2 text-sm text-foreground border border-border">
												{question.skill?.name || "N/A"}
											</td>
											<td className="px-4 py-2 text-sm border border-border">
												<div className="flex gap-1">
													{getDifficultyDots(question.difficulty)}
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto flex-1">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Left: Passage and Question */}
						<div>
							<div className="flex items-center gap-3 mb-3">
								<h3 className="text-lg font-bold text-foreground">
									{question.subject?.name || "Question"}
								</h3>
								<Badge variant="outline">
									{question.optionType?.replace(/_/g, " ")}
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground mb-4">
								Difficulty:{" "}
								<span className="font-semibold text-foreground">
									{question.difficulty}
								</span>
							</p>

							{/* Question Content */}
							<div className="prose prose-sm max-w-none mb-6 dark:prose-invert">
								<div
									className="text-foreground text-sm leading-relaxed"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Question content from database
									dangerouslySetInnerHTML={{ __html: question.content }}
								/>
							</div>

							{/* Explanation if available */}
							{/* {question.explanation && (
								<div className="bg-muted p-4 rounded-lg mt-4">
									<h4 className="font-semibold mb-2">Explanation</h4>
									<div
										className="text-sm text-muted-foreground"
										// biome-ignore lint/security/noDangerouslySetInnerHtml: Explanation content from database
										dangerouslySetInnerHTML={{ __html: question.explanation }}
									/>
								</div>
							)} */}
						</div>

						{/* Right: Answer Options */}
						<div>
							<h3 className="text-lg font-bold text-foreground mb-4">
								Answer Options
							</h3>

							{/* Multiple Choice / Single Choice Options */}
							{question.options && question.options.length > 0 && (
								<div className="space-y-3">
									{question.options.map((option, index) => (
										<div
											key={option.id || index}
											className={`p-4 border rounded-lg transition-colors ${
												option.isCorrect
													? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
													: "border-border bg-muted/30"
											}`}
										>
											<div className="flex items-start gap-3">
												<span className="font-bold text-sm min-w-6">
													{String.fromCharCode(65 + index)}.
												</span>
												<span className="text-sm text-foreground flex-1">
													{option.content}
												</span>

												{option.isCorrect && (
													<Badge className="bg-green-600 text-white shrink-0">
														Correct
													</Badge>
												)}
											</div>
										</div>
									))}
								</div>
							)}

							{/* Fill in the Blanks */}
							{question.fillBlanks && question.fillBlanks.length > 0 && (
								<div className="space-y-3">
									<h4 className="font-semibold text-sm text-muted-foreground">
										Fill in the Blanks
									</h4>
									{question.fillBlanks.map((blank, idx) => (
										<div
											key={blank.id || idx}
											className="p-4 rounded-lg bg-muted/40 border border-border"
										>
											<p className="font-medium text-sm">
												Blank {idx + 1}:{" "}
												<span className="text-primary-light">
													{blank.answer}
												</span>
											</p>
											{blank.alternatives && blank.alternatives.length > 0 && (
												<p className="text-sm text-muted-foreground mt-1">
													Alternatives: {blank.alternatives.join(", ")}
												</p>
											)}
										</div>
									))}
								</div>
							)}

							<div className="mt-8">
								<h3 className="text-2xl font-bold text-foreground mb-4">
									Rationale
								</h3>
							</div>

							{/* Question Content */}
							<div className="prose prose-sm max-w-none mb-6 dark:prose-invert">
								<div
									className="text-foreground text-sm leading-relaxed"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Question content from database
									dangerouslySetInnerHTML={{
										__html: question?.answerDescription || "",
									}}
								/>
							</div>

							{/* Short Answer */}
							{question.optionType === "SHORT_ANSWER" &&
								question.correctAnswer && (
									<div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
										<p className="font-medium text-sm">
											Correct Answer:{" "}
											<span className="text-primary">
												{question?.correctAnswer}
											</span>
										</p>
									</div>
								)}
						</div>
					</div>
				</div>

				{/* Footer (always at bottom) */}
				<div className="bg-card border-t border-border p-6 flex justify-between items-center">
					<Button
						onClick={handlePrevious}
						disabled={!hasPrevious}
						className="px-6 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
					>
						<ChevronLeft className="w-4 h-4" />
						Previous
					</Button>

					{totalQuestions > 0 && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">
								Question {currentIndex + 1} of {totalQuestions}
							</span>
						</div>
					)}

					<Button
						onClick={handleNext}
						disabled={!hasNext}
						className="px-6 py-2 bg-primary-dark text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
					>
						Next
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
