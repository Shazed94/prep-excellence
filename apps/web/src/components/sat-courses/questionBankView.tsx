import type { TGQuestion } from "@prepexcellence/shared-validators";
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface QuestionModalProps {
	question: TGQuestion;
	questions?: TGQuestion[]; // List of all questions for navigation
	showAnswers?: boolean; // Toggle to show/hide answers
	onClose: () => void;
	onNavigate?: (question: TGQuestion) => void; // Callback when navigating to update parent state
}

export function QuestionBankModal({
	question,
	questions = [],
	showAnswers = true,
	onClose,
	onNavigate,
}: QuestionModalProps) {
	// Interactive quiz states
	const [localShowAnswers, setLocalShowAnswers] = useState(showAnswers);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]); // For multiple select
	const [userAnswer, setUserAnswer] = useState<string>("");
	const [fillBlankAnswers, setFillBlankAnswers] = useState<{
		[key: string]: string;
	}>({}); // For fill in the blank
	const [hasChecked, setHasChecked] = useState(false);

	console.log(userAnswer, "userAnswer");

	// Reset quiz state when question changes
	useEffect(() => {
		setSelectedAnswer(null);
		setSelectedAnswers([]);
		setUserAnswer("");
		setFillBlankAnswers({});
		setHasChecked(false);
		setLocalShowAnswers(showAnswers);
		console.log("Question changed, resetting quiz state", question.id);
	}, [question.id, showAnswers]);

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

	// Quiz functionality
	const handleCheckAnswer = () => {
		setHasChecked(true);
		setLocalShowAnswers(true);
	};

	const resetQuiz = () => {
		setSelectedAnswer(null);
		setSelectedAnswers([]);
		setUserAnswer("");
		setFillBlankAnswers({});
		setHasChecked(false);
		setLocalShowAnswers(showAnswers);
	};

	// Toggle multiple select answer
	const toggleMultipleAnswer = (optionId: string) => {
		if (hasChecked) return;
		setSelectedAnswers((prev) =>
			prev.includes(optionId)
				? prev.filter((id) => id !== optionId)
				: [...prev, optionId],
		);
	};

	// Update fill blank answer
	const updateFillBlankAnswer = (blankId: number | string, value: string) => {
		setFillBlankAnswers((prev) => ({
			...prev,
			[String(blankId)]: value,
		}));
	};

	// Check if user's answer is correct
	const isUserAnswerCorrect = () => {
		if (question.optionType === "SHORT_ANSWER") {
			const correctAnswer = Array.isArray(question.options)
				? question.options[0].content
				: question.content;
			const isCorrect =
				userAnswer.trim().toLowerCase() === correctAnswer?.toLowerCase();
			return isCorrect;
		}
		// Single select or True/False
		if (
			selectedAnswer &&
			(question.optionType === "SINGLE_CHOICE" ||
				question.optionType === "TRUE_FALSE")
		) {
			const selectedOption = question.options?.find(
				(opt) => opt.id === selectedAnswer,
			);
			return selectedOption?.isCorrect || false;
		}
		// Multiple select
		if (
			selectedAnswers.length > 0 &&
			question.optionType === "MULTIPLE_CHOICE"
		) {
			const correctOptionIds =
				question.options
					?.filter((opt) => opt.isCorrect)
					.map((opt) => opt.id)
					.filter((id): id is string => id !== undefined) || [];
			const isCorrect =
				correctOptionIds.length === selectedAnswers.length &&
				correctOptionIds.every((id) => selectedAnswers.includes(id));
			return isCorrect;
		}
		// Fill in the blank
		if (Object.keys(fillBlankAnswers).length > 0 && question.fillBlanks) {
			return question.fillBlanks.every((blank) => {
				const userAns = fillBlankAnswers[String(blank.id)]
					?.trim()
					.toLowerCase();
				const correctAns = blank.answer.toLowerCase();
				const alternatives =
					blank.alternatives?.map((alt) => alt.toLowerCase()) || [];
				return userAns === correctAns || alternatives.includes(userAns);
			});
		}
		return false;
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
			<div className="bg-card rounded-lg shadow-xl max-w-9xl w-full mx-auto h-[95vh] overflow-hidden flex flex-col">
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

							{question?.optionType !== "SHORT_ANSWER" &&
								question?.optionType !== "FILL_IN_THE_BLANK" && (
									<div>
										{question.options && question.options.length > 0 && (
											<div className="space-y-3">
												{question.optionType === "MULTIPLE_CHOICE" && (
													<p className="text-sm text-muted-foreground mb-2">
														Select all that apply
													</p>
												)}
												{question.options.map((option, index) => {
													const isMultiple =
														question.optionType === "MULTIPLE_CHOICE";
													const isSelected = isMultiple
														? selectedAnswers.includes(option.id || "")
														: selectedAnswer === option.id;
													const isCorrect = option.isCorrect;
													const showCorrectness =
														localShowAnswers && hasChecked;

													let borderClass = "border-border";
													let bgClass = "bg-muted/30";

													if (showCorrectness) {
														if (isCorrect) {
															borderClass =
																"border-green-300 dark:border-green-700";
															bgClass = "bg-green-50 dark:bg-green-900/20";
														} else if (isSelected) {
															borderClass =
																"border-red-300 dark:border-red-700";
															bgClass = "bg-red-50 dark:bg-red-900/20";
														}
													} else if (isSelected) {
														borderClass = "border-[#0086C5]";
														bgClass = "bg-blue-50 dark:bg-blue-900/20";
													}

													return (
														<button
															key={option.id || index}
															onClick={() => {
																if (!hasChecked && option.id) {
																	if (isMultiple) {
																		toggleMultipleAnswer(option.id);
																	} else {
																		setSelectedAnswer(option.id);
																	}
																}
															}}
															type="button"
															disabled={hasChecked}
															className={`w-full p-4 border rounded-lg transition-colors text-left ${borderClass} ${bgClass} ${
																hasChecked
																	? "cursor-not-allowed"
																	: "hover:bg-muted/50 cursor-pointer"
															}`}
														>
															<div className="flex items-start gap-3">
																{isMultiple ? (
																	<input
																		type="checkbox"
																		checked={isSelected}
																		readOnly
																		className="w-5 h-5 mt-0.5 accent-[#0086C5] cursor-pointer"
																	/>
																) : (
																	<span className="font-bold text-sm min-w-6">
																		{String.fromCharCode(65 + index)}.
																	</span>
																)}
																<span className="text-sm text-foreground flex-1">
																	{option.content}
																</span>

																<div className="flex items-center gap-2">
																	{isSelected && !hasChecked && (
																		<Badge className="bg-[#0086C5] text-white shrink-0">
																			Selected
																		</Badge>
																	)}
																	{showCorrectness && isCorrect && (
																		<Badge className="bg-green-600 text-white shrink-0">
																			Correct
																		</Badge>
																	)}
																	{showCorrectness &&
																		isSelected &&
																		!isCorrect && (
																			<Badge className="bg-red-600 text-white shrink-0">
																				Incorrect
																			</Badge>
																		)}
																</div>
															</div>
														</button>
													);
												})}

												{/* Check Answer Button for Multiple Choice */}
												{!hasChecked &&
													(selectedAnswer || selectedAnswers.length > 0) && (
														<Button
															onClick={handleCheckAnswer}
															className="w-full bg-[#0086C5] text-white hover:bg-[#005A8C] flex items-center gap-2 justify-center"
														>
															<Check className="w-4 h-4" />
															Check Answer
														</Button>
													)}

												{/* Feedback */}
												{hasChecked &&
													(selectedAnswer || selectedAnswers.length > 0) && (
														<div
															className={`p-4 rounded-lg border ${
																isUserAnswerCorrect()
																	? "bg-green-50 dark:bg-green-900/20 border-green-300 text-green-800 dark:text-green-200"
																	: "bg-red-50 dark:bg-red-900/20 border-red-300 text-red-800 dark:text-red-200"
															}`}
														>
															<div className="flex items-center gap-2">
																<div
																	className={`w-6 h-6 rounded-full flex items-center justify-center ${
																		isUserAnswerCorrect()
																			? "bg-green-600"
																			: "bg-red-600"
																	}`}
																>
																	{isUserAnswerCorrect() ? "✓" : "✗"}
																</div>
																<span className="font-semibold">
																	{isUserAnswerCorrect()
																		? "Correct!"
																		: "Incorrect"}
																</span>
															</div>
														</div>
													)}
											</div>
										)}
									</div>
								)}

							{/* Short Answer Input */}
							{question.optionType === "SHORT_ANSWER" && (
								<div className="space-y-3">
									<div>
										<Label className="block text-sm font-medium text-foreground mb-2">
											Your Answer:
										</Label>
										<Textarea
											value={userAnswer}
											onChange={(e) => setUserAnswer(e.target.value)}
											disabled={hasChecked}
											placeholder="Type your answer here..."
											className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0086C5] disabled:bg-muted disabled:cursor-not-allowed"
										/>
									</div>

									{/* Check Answer Button for Short Answer */}
									{!hasChecked && userAnswer.trim() && (
										<Button
											onClick={handleCheckAnswer}
											className="w-full bg-[#0086C5] text-white hover:bg-[#005A8C] flex items-center gap-2 justify-center"
										>
											<Check className="w-4 h-4" />
											Check Answer
										</Button>
									)}

									{/* Short Answer Feedback */}
									{hasChecked && userAnswer.trim() && (
										<div
											className={`p-4 rounded-lg border ${
												isUserAnswerCorrect()
													? "bg-green-50 dark:bg-green-900/20 border-green-300 text-green-800 dark:text-green-200"
													: "bg-red-50 dark:bg-red-900/20 border-red-300 text-red-800 dark:text-red-200"
											}`}
										>
											<div className="flex items-center gap-2 mb-2">
												<div
													className={`w-6 h-6 rounded-full flex items-center justify-center ${
														isUserAnswerCorrect()
															? "bg-green-600"
															: "bg-red-600"
													}`}
												>
													{isUserAnswerCorrect() ? "✓" : "✗"}
												</div>
												<span className="font-semibold">
													{isUserAnswerCorrect() ? "Correct!" : "Incorrect"}
												</span>
											</div>
											{localShowAnswers && (
												<p className="text-sm">
													<strong>Correct Answer:</strong>{" "}
													{question.correctAnswer}
												</p>
											)}
										</div>
									)}
								</div>
							)}

							{question.optionType === "SHORT_ANSWER" && localShowAnswers && (
								<div className="space-y-3">
									<h4 className="font-semibold text-sm text-muted-foreground">
										Expected Answer
									</h4>
									<div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
										<p className="text-sm text-foreground">
											{question.options?.[0]?.content}
										</p>
									</div>
								</div>
							)}

							{/* Fill in the Blanks - Interactive */}
							{question.fillBlanks && question.fillBlanks.length > 0 && (
								<div className="space-y-3">
									<h4 className="font-semibold text-sm text-muted-foreground">
										Fill in the Blanks
									</h4>
									{question.fillBlanks.map((blank, idx) => {
										const blankIdStr = String(blank.id);
										const userBlankAnswer = fillBlankAnswers[blankIdStr];
										const isBlankCorrect =
											hasChecked &&
											(userBlankAnswer?.trim().toLowerCase() ===
												blank.answer.toLowerCase() ||
												blank.alternatives?.some(
													(alt) =>
														alt.toLowerCase() ===
														userBlankAnswer?.trim().toLowerCase(),
												));
										const isBlankWrong =
											hasChecked && userBlankAnswer && !isBlankCorrect;

										return (
											<div
												key={blank.id || idx}
												className={`p-4 rounded-lg border ${
													isBlankCorrect
														? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
														: isBlankWrong
															? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
															: "bg-muted/10 border-border"
												}`}
											>
												<Label className="block text-sm font-medium mb-2">
													Blank {idx + 1}:
												</Label>
												<input
													type="text"
													value={fillBlankAnswers[blankIdStr] || ""}
													onChange={(e) =>
														updateFillBlankAnswer(blank.id, e.target.value)
													}
													disabled={hasChecked}
													placeholder="Type your answer..."
													className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0086C5] disabled:bg-muted disabled:cursor-not-allowed"
												/>
												{hasChecked && localShowAnswers && (
													<div className="mt-2">
														<p className="text-sm">
															<strong>Correct Answer:</strong> {blank.answer}
														</p>
														{blank.alternatives &&
															blank.alternatives.length > 0 && (
																<p className="text-sm text-muted-foreground mt-1">
																	Alternatives: {blank.alternatives.join(", ")}
																</p>
															)}
													</div>
												)}
											</div>
										);
									})}

									{/* Check Answer Button for Fill in the Blanks */}
									{!hasChecked &&
										Object.keys(fillBlankAnswers).length ===
											question.fillBlanks.length && (
											<Button
												onClick={handleCheckAnswer}
												className="w-full bg-[#0086C5] text-white hover:bg-[#005A8C] flex items-center gap-2 justify-center"
											>
												<Check className="w-4 h-4" />
												Check Answers
											</Button>
										)}

									{/* Fill in the Blank Feedback */}
									{hasChecked && Object.keys(fillBlankAnswers).length > 0 && (
										<div
											className={`p-4 rounded-lg border ${
												isUserAnswerCorrect()
													? "bg-green-50 dark:bg-green-900/20 border-green-300 text-green-800 dark:text-green-200"
													: "bg-red-50 dark:bg-red-900/20 border-red-300 text-red-800 dark:text-red-200"
											}`}
										>
											<div className="flex items-center gap-2">
												<div
													className={`w-6 h-6 rounded-full flex items-center justify-center ${
														isUserAnswerCorrect()
															? "bg-green-600"
															: "bg-red-600"
													}`}
												>
													{isUserAnswerCorrect() ? "✓" : "✗"}
												</div>
												<span className="font-semibold">
													{isUserAnswerCorrect()
														? "All Correct!"
														: "Some answers are incorrect"}
												</span>
											</div>
										</div>
									)}
								</div>
							)}

							{localShowAnswers && (
								<>
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
								</>
							)}
						</div>
					</div>
				</div>

				{/* Footer (always at bottom) */}
				<div className="bg-card border-t border-border p-6 flex justify-between items-center">
					<div className="flex gap-2">
						<Button
							onClick={handlePrevious}
							size={"sm"}
							disabled={!hasPrevious}
							className=" disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center "
						>
							<ChevronLeft className="w-4 h-4" />
							Previous
						</Button>
						{/* Show/Hide Toggle */}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setLocalShowAnswers(!localShowAnswers)}
							className={`flex items-center gap-2 ${
								localShowAnswers
									? "bg-[#0086C5] text-white border-[#0086C5]"
									: "bg-white text-slate-600"
							}`}
						>
							{localShowAnswers ? (
								<>
									<Eye className="w-4 h-4" />
									Show Answers
								</>
							) : (
								<>
									<EyeOff className="w-4 h-4" />
									Hide Answers
								</>
							)}
						</Button>

						{/* Reset Quiz Button */}
						{hasChecked && (
							<Button
								variant="outline"
								size="sm"
								onClick={resetQuiz}
								className="text-slate-600"
							>
								Try Again
							</Button>
						)}
					</div>

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
						size={"sm"}
						className="hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
					>
						Next
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
