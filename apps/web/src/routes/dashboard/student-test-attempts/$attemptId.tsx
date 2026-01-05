import { useQueryClient } from "@tanstack/react-query";
import {
	createFileRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import {
	ArrowLeft,
	Award,
	CheckCircle,
	Flag,
	Save,
	XCircle,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitGrading } from "@/hooks/grading-system";

export const Route = createFileRoute(
	"/dashboard/student-test-attempts/$attemptId",
)({
	component: GradingPage,
});

// API Response Types
interface ApiAttemptResponse {
	id: string;
	createdAt: string;
	updatedAt: string;
	studentId: string;
	satPracticeId: string;
	status: "IN_PROGRESS" | "COMPLETED" | "SUBMITTED" | "GRADED";
	startedAt: string;
	completedAt: string | null;
	submittedAt: string | null;
	totalScore: number | null;
	maxScore: number;
	percentageScore: number | null;
	totalTimeSpent: number | null;
	student: {
		id: string;
		guardianPhone: string | null;
		guardianName: string | null;
		guardianEmail: string | null;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
	satPractice: {
		id: string;
		name: string;
	};
	answers: Array<{
		id: string;
		createdAt: string;
		updatedAt: string;
		attemptId: string;
		questionId: string;
		textAnswer: string | null;
		isCorrect: boolean | null;
		pointsEarned: number | null;
		isManuallyGraded: boolean;
		gradedByTeacherId: string | null;
		gradedAt: string | null;
		teacherFeedback: string | null;
		timeSpent: number;
		flaggedForReview: boolean;
		answerOrder: number | null;
		question: {
			id: string;
			content: string;
			answerDescription: string;
			points: number;
			difficulty: string;
			domainId: string;
			skillId: string;
			optionType: string;
			options?: Array<{
				id: string;
				content: string;
				isCorrect: boolean;
			}>;
		};
		selectedOptions?: Array<{
			id: string;
			optionId: string;
		}>;
	}>;
}

// Types
interface StudentAttempt {
	id: string;
	studentName: string;
	studentEmail: string;
	testName: string;
	subject: string;
	status: "IN_PROGRESS" | "COMPLETED" | "SUBMITTED" | "GRADED";
	totalQuestions: number;
	answeredQuestions: number;
	score: number | null;
	maxScore: number;
	startedAt: string;
	completedAt: string | null;
	timeSpent: number;
}

interface QuestionAnswer {
	id: string;
	questionId: string;
	questionContent: string;
	questionType:
		| "SINGLE_CHOICE"
		| "MULTIPLE_CHOICE"
		| "TRUE_FALSE"
		| "FILL_IN_THE_BLANK"
		| "SHORT_ANSWER";
	points: number;
	difficulty: "EASY" | "MEDIUM" | "HARD";
	domain: string;
	skill: string;
	options?: {
		id: string;
		content: string;
		isCorrect: boolean;
	}[];
	studentAnswer: string | string[];
	textAnswer?: string; // Add textAnswer field
	correctAnswer: string | string[];
	isCorrect: boolean | null;
	pointsEarned: number | null;
	timeSpent: number;
	flaggedForReview: boolean;
	teacherFeedback?: string;
}

function GradingPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();
	const submitGradingMutation = useSubmitGrading();

	// Get attempt data from location state (passed from listing page)
	const apiAttemptData = (location.state as any)?.attemptData as
		| ApiAttemptResponse
		| undefined;

	// Transform API data to component format
	const attemptData = React.useMemo(() => {
		if (!apiAttemptData) return null;

		const attempt: StudentAttempt = {
			id: apiAttemptData.id,
			studentName: apiAttemptData.student?.user?.name ?? "Unknown Student",
			studentEmail: apiAttemptData.student?.user?.email ?? "N/A",
			testName: apiAttemptData.satPractice?.name ?? "Unnamed Test",
			subject: apiAttemptData.answers?.[0]?.question?.optionType ?? "General",
			status: apiAttemptData.status,
			totalQuestions: apiAttemptData.answers?.length ?? 0,
			answeredQuestions:
				apiAttemptData.answers?.filter(
					(ans) => ans.isCorrect !== null || ans.textAnswer !== null,
				).length ?? 0,
			score: apiAttemptData.totalScore,
			maxScore: apiAttemptData.maxScore ?? 0,
			startedAt: apiAttemptData.startedAt,
			completedAt: apiAttemptData.completedAt,
			timeSpent:
				apiAttemptData.totalTimeSpent ??
				apiAttemptData.answers?.reduce(
					(sum, ans) => sum + (ans.timeSpent ?? 0),
					0,
				) ??
				0,
		};

	

		const answers: QuestionAnswer[] =
			apiAttemptData.answers?.map((ans) => {
				const question = ans.question;
				const isMultipleChoice = question.optionType === "MULTIPLE_CHOICE";
				const isSingleChoice = question.optionType === "SINGLE_CHOICE";

				// Get student answer
				let studentAnswer: string | string[];
				if (isMultipleChoice || isSingleChoice) {
					if (ans.selectedOptions && ans.selectedOptions.length > 0) {
						if (isMultipleChoice) {
							studentAnswer = ans.selectedOptions.map((opt) => opt.optionId);
						} else {
							studentAnswer = ans.selectedOptions[0]?.optionId ?? "";
						}
					} else {
						studentAnswer = isMultipleChoice ? [] : "";
					}
				} else {
					studentAnswer = ans.textAnswer ?? "";
				}

				// Get correct answer
				let correctAnswer: string | string[];
				if (question.options && question.options.length > 0) {
					const correctOptions = question.options.filter(
						(opt) => opt.isCorrect,
					);
					if (isMultipleChoice) {
						correctAnswer = correctOptions.map((opt) => opt.id);
					} else {
						correctAnswer = correctOptions[0]?.id ?? "";
					}
				} else {
					// For short answer, use the option content as correct answer
					correctAnswer = question.options?.[0]?.content ?? "";
				}

				return {
					id: ans.id,
					questionId: question.id,
					questionContent: question.content,
					questionType: question.optionType as QuestionAnswer["questionType"],
					points: question.points,
					difficulty: (question.difficulty?.toUpperCase() ??
						"MEDIUM") as QuestionAnswer["difficulty"],
					domain: question.domainId ?? "Unknown",
					skill: question.skillId ?? "Unknown",
					options: question.options?.map((opt) => ({
						id: opt.id,
						content: opt.content,
						isCorrect: opt.isCorrect,
					})),
					studentAnswer,
					textAnswer: ans.textAnswer ?? undefined, // Preserve textAnswer from API
					correctAnswer,
					isCorrect: ans.isCorrect,
					pointsEarned: ans.pointsEarned,
					timeSpent: ans.timeSpent ?? 0,
					flaggedForReview: ans.flaggedForReview ?? false,
					teacherFeedback: ans.teacherFeedback ?? undefined,
				};
			}) ?? [];

		return { attempt, answers };
	}, [apiAttemptData]);

	const [answers, setAnswers] = React.useState<QuestionAnswer[]>(
		attemptData?.answers || [],
	);


	const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
	const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
	const [showSaveDialog, setShowSaveDialog] = React.useState(false);

	// Update answers when attemptData changes
	React.useEffect(() => {
		if (attemptData?.answers) {
			setAnswers(attemptData.answers);
		}
	}, [attemptData]);

	if (!attemptData) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h2 className="text-2xl font-bold">Attempt not found</h2>
				<p className="text-muted-foreground mt-2">
					No attempt data was passed. Please go back and select an attempt to
					grade.
				</p>
				<Button
					className="mt-4"
					onClick={() => navigate({ to: "/dashboard/student-test-attempts" })}
				>
					Back to Attempts
				</Button>
			</div>
		);
	}

	const currentQuestion = answers[currentQuestionIndex];

	const attempt = attemptData.attempt;

	// Calculate total score
	const totalScore = answers.reduce(
		(sum, ans) => sum + (ans.pointsEarned || 0),
		0,
	);
	const gradedCount = answers.filter((ans) => ans.pointsEarned !== null).length;

	// Format time
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		if (hours > 0) return `${hours}h ${minutes}m`;
		return `${minutes}m ${secs}s`;
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Get difficulty badge
	const getDifficultyBadge = (difficulty: string) => {
		const colors: Record<string, string> = {
			EASY: "bg-green-100 text-green-800 hover:bg-green-100",
			MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
			HARD: "bg-red-100 text-red-800 hover:bg-red-100",
		};
		return (
			<Badge className={colors[difficulty] || "bg-gray-100 text-gray-800"}>
				{difficulty}
			</Badge>
		);
	};

	// Update points for current question
	const handleUpdatePoints = (points: string) => {
		const pointsNum = Number.parseFloat(points);
		if (
			Number.isNaN(pointsNum) ||
			pointsNum < 0 ||
			pointsNum > currentQuestion.points
		) {
			return;
		}

		const updatedAnswers = [...answers];
		updatedAnswers[currentQuestionIndex] = {
			...currentQuestion,
			pointsEarned: pointsNum,
			isCorrect: pointsNum === currentQuestion.points,
		};
		setAnswers(updatedAnswers);
		setHasUnsavedChanges(true);
	};

	// Update feedback
	const handleUpdateFeedback = (feedback: string) => {
		const updatedAnswers = [...answers];
		updatedAnswers[currentQuestionIndex] = {
			...currentQuestion,
			teacherFeedback: feedback,
		};
		setAnswers(updatedAnswers);
		setHasUnsavedChanges(true);
	};

	// Quick grade buttons
	const handleQuickGrade = (grade: "full" | "half" | "zero") => {
		const points =
			grade === "full"
				? currentQuestion.points
				: grade === "half"
					? currentQuestion.points / 2
					: 0;
		handleUpdatePoints(points.toString());
	};

	// Navigate questions
	const goToQuestion = (index: number) => {
		if (index >= 0 && index < answers.length) {
			setCurrentQuestionIndex(index);
		}
	};

	// Save current question grade
	const handleSaveGrades = async () => {
		if (!attemptData?.attempt?.id) {
			toast.error("Attempt ID not found");
			return;
		}

		if (!currentQuestion || currentQuestion.pointsEarned === null) {
			toast.error("Please grade the current question first");
			return;
		}

		try {
			// Save only the current question
			const payload = {
				answerId: currentQuestion.id,
				isCorrect: currentQuestion.isCorrect ?? true,
				pointsEarned: currentQuestion.pointsEarned ?? 0,
				teacherFeedback: currentQuestion.teacherFeedback || undefined,
			};

			await submitGradingMutation.mutateAsync(payload);
			toast.success(
				`Question ${currentQuestionIndex + 1} graded successfully!`,
			);
			setHasUnsavedChanges(false);
		} catch (error: any) {
			console.error("Error saving grade:", error);
			toast.error(error?.response?.data?.message || "Failed to save grade");
		}
	};

	// Submit final grading
	const handleSubmitGrading = () => {
		if (gradedCount < answers.length) {
			toast.error("Please grade all questions before submitting");
			return;
		}
		setShowSaveDialog(true);
	};

	const confirmSubmit = async () => {
		if (!attemptData?.attempt?.id) {
			toast.error("Attempt ID not found");
			return;
		}

		try {
			// Transform answers to API payload format
			const payload = {
				answers: answers.map((ans) => ({
					answerId: ans.id,
					isCorrect: ans.isCorrect ?? false,
					pointsEarned: ans.pointsEarned ?? 0,
					teacherFeedback: ans.teacherFeedback || undefined,
				})),
			};

			await submitGradingMutation.mutateAsync(payload);

			// Invalidate queries to refresh the listing page
			await queryClient.invalidateQueries({ queryKey: ["grading-stats"] });

			toast.success("Test graded and submitted to student!");
			setShowSaveDialog(false);
			setHasUnsavedChanges(false);
			navigate({ to: "/dashboard/student-test-attempts" });
		} catch (error: any) {
			console.error("Error submitting grades:", error);
			toast.error(error?.response?.data?.message || "Failed to submit grades");
			setShowSaveDialog(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b sticky top-0 z-5">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									navigate({ to: "/dashboard/student-test-attempts" })
								}
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Attempts
							</Button>
							<Separator orientation="vertical" className="h-6" />
							<div>
								<h1 className="text-xl font-bold">{attempt.testName}</h1>
								<p className="text-sm text-muted-foreground">
									Grading {attempt.studentName}'s Attempt
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{hasUnsavedChanges && (
								<Badge variant="outline" className="text-orange-600">
									Unsaved Changes
								</Badge>
							)}
							<Button
								variant="outline"
								onClick={handleSaveGrades}
								disabled={submitGradingMutation.isPending}
							>
								<Save className="w-4 h-4 mr-2" />
								{submitGradingMutation.isPending
									? "Saving..."
									: "Save Progress"}
							</Button>
							<Button
								onClick={handleSubmitGrading}
								disabled={submitGradingMutation.isPending}
							>
								{submitGradingMutation.isPending
									? "Submitting..."
									: "Submit Final Grade"}
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-6">
				<div className="grid grid-cols-12 gap-6">
					{/* Left Sidebar - Questions Navigator */}
					<div className="col-span-3">
						<Card className="sticky top-24">
							<CardHeader>
								<CardTitle className="text-lg">Questions</CardTitle>
								<p className="text-sm text-muted-foreground">
									{gradedCount} of {answers.length} graded
								</p>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-[calc(100vh-600px)]">
									<div className="grid grid-cols-4 gap-2">
										{answers.map((answer, index) => {
											const isGraded = answer.pointsEarned !== null;
											const isCurrent = index === currentQuestionIndex;
											const isCorrect = answer.isCorrect;

											return (
												<Button
													key={answer.id}
													variant={isCurrent ? "default" : "outline"}
													size="sm"
													className={`h-12 relative ${
														!isCurrent && isGraded && isCorrect
															? "border-green-500 bg-green-50 hover:bg-green-100"
															: !isCurrent && isGraded && !isCorrect
																? "border-red-500 bg-red-50 hover:bg-red-100"
																: ""
													}`}
													onClick={() => goToQuestion(index)}
												>
													{index + 1}
													{answer.flaggedForReview && (
														<Flag className="w-3 h-3 absolute top-1 right-1 text-orange-500" />
													)}
												</Button>
											);
										})}
									</div>
								</ScrollArea>
							</CardContent>
						</Card>

						{/* Stats Card */}
						<Card className="mt-4">
							<CardHeader>
								<CardTitle className="text-sm">Attempt Stats</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Current Score</span>
									<span className="font-semibold">
										{totalScore}/{attempt.maxScore}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Percentage</span>
									<span className="font-semibold">
										{Math.round((totalScore / attempt.maxScore) * 100)}%
									</span>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Time Spent</span>
									<span>{formatTime(attempt.timeSpent)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Started</span>
									<span className="text-xs">
										{formatDate(attempt.startedAt)}
									</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main Content - Question Grading */}
					<div className="col-span-9">
						<Card>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<h2 className="text-2xl font-bold">
												Question {currentQuestionIndex + 1}
											</h2>
											{getDifficultyBadge(currentQuestion.difficulty)}
											<Badge variant="outline">
												{currentQuestion.questionType.replace(/_/g, " ")}
											</Badge>
											<Badge variant="secondary">
												{currentQuestion.points}{" "}
												{currentQuestion.points === 1 ? "point" : "points"}
											</Badge>
											{currentQuestion.flaggedForReview && (
												<Badge className="bg-orange-100 text-orange-800">
													<Flag className="w-3 h-3 mr-1" />
													Flagged for Review
												</Badge>
											)}
										</div>										
										{/* Student Text Answer (if exists) */}
										{currentQuestion.textAnswer && (
											<div className="mt-4">
												<Label className="text-base font-semibold mb-2 block">
													Student's Text Answer
												</Label>
												<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
													<pre className="whitespace-pre-wrap text-base font-sans">
														{currentQuestion.textAnswer}
													</pre>
												</div>
											</div>
										)}									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-2">
								{/* Question Content */}
								<div className="p-6 bg-gray-50 rounded-lg">
									<Label className="text-base font-semibold mb-2 block">
										Question
									</Label>
									<p className="text-lg">
										<div
											// biome-ignore lint/security/noDangerouslySetInnerHtml: Question content from database
											dangerouslySetInnerHTML={{
												__html: currentQuestion.questionContent,
											}}
										/>
									</p>
								</div>

								{/* Answer Section */}
								<div className="space-y-4">
									{currentQuestion.options ? (
										// Multiple Choice / Single Choice
										<div>
											<Label className="text-base font-semibold mb-3 block">
												Answer Options
											</Label>
											<div className="space-y-2">
												{currentQuestion.options.map((option) => {
													const isStudentAnswer = Array.isArray(
														currentQuestion.studentAnswer,
													)
														? currentQuestion.studentAnswer.includes(option.id)
														: currentQuestion.studentAnswer === option.id;
													const isCorrectOption = option.isCorrect;

													return (
														<div
															key={option.id}
															className={`p-4 rounded-lg border-2 transition-colors ${
																isStudentAnswer && isCorrectOption
																	? "bg-green-50 border-green-400"
																	: isStudentAnswer
																		? "bg-red-50 border-red-400"
																		: isCorrectOption
																			? "bg-green-50 border-green-300 border-dashed"
																			: "bg-white border-gray-200"
															}`}
														>
															<div className="flex items-center justify-between">
																<span className="text-base">
																	{option.content}
																</span>
																<div className="flex items-center gap-2">
																	{isStudentAnswer && (
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			Student Selected
																		</Badge>
																	)}
																	{isCorrectOption && (
																		<div className="flex items-center gap-1 text-green-700 font-medium">
																			<CheckCircle className="w-4 h-4" />
																			<span className="text-xs">Correct</span>
																		</div>
																	)}
																</div>
															</div>
														</div>
													);
												})}
											</div>
											
											{/* Student Text Answer (if exists) */}
											{currentQuestion.textAnswer && (
												<div className="mt-4">
													<Label className="text-base font-semibold mb-2 block">
														Student's Text Answer
													</Label>
													<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
														<pre className="whitespace-pre-wrap text-base font-sans">
															{currentQuestion.textAnswer}
														</pre>
													</div>
												</div>
											)}
										</div>
									) : (
										// Text Answer (SHORT_ANSWER, FILL_IN_THE_BLANK)
										<div className="grid grid-cols-2 gap-4">
											<div>
												<Label className="text-base font-semibold mb-2 block">
													Student's Answer
												</Label>
												<div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg min-h-[120px]">
													<pre className="whitespace-pre-wrap text-base font-sans">
														{Array.isArray(currentQuestion.studentAnswer)
															? currentQuestion.studentAnswer.join(", ")
															: currentQuestion.studentAnswer}
													</pre>
												</div>
											</div>
											<div>
												<Label className="text-base font-semibold mb-2 block">
													Correct Answer
												</Label>
												<div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg min-h-[120px]">
													<pre className="whitespace-pre-wrap text-base font-sans">
														{Array.isArray(currentQuestion.correctAnswer)
															? currentQuestion.correctAnswer.join(", ")
															: currentQuestion.correctAnswer}
													</pre>
												</div>
											</div>
										</div>
									)}
								</div>

								<Separator />

								{/* Grading Section */}
								<div className="space-y-4 bg-white p-6 rounded-lg border-2 border-primary/20">
									<h3 className="text-lg font-semibold flex items-center gap-2">
										<Award className="w-5 h-5" />
										Grade This Question
									</h3>

									{/* Quick Grade Buttons */}
									<div>
										<Label className="mb-2 block">Quick Grade</Label>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleQuickGrade("full")}
												className="flex-1 border-green-500 hover:bg-green-50"
											>
												<CheckCircle className="w-4 h-4 mr-2" />
												Full Credit ({currentQuestion.points})
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleQuickGrade("half")}
												className="flex-1 border-yellow-500 hover:bg-yellow-50"
											>
												Partial ({currentQuestion.points / 2})
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleQuickGrade("zero")}
												className="flex-1 border-red-500 hover:bg-red-50"
											>
												<XCircle className="w-4 h-4 mr-2" />
												No Credit (0)
											</Button>
										</div>
									</div>

									{/* Manual Points Input */}
									<div>
										<Label htmlFor="points" className="mb-2 block">
											Points Earned (Max: {currentQuestion.points})
										</Label>
										<Input
											id={"points"}
											type="number"
											min={0}
											max={currentQuestion.points}
											step={0.5}
											value={currentQuestion.pointsEarned ?? ""}
											onChange={(e) => handleUpdatePoints(e.target.value)}
											placeholder={`0 - ${currentQuestion.points}`}
											className="text-lg font-semibold"
										/>
									</div>

									{/* Teacher Feedback */}
									<div>
										<Label htmlFor="feedback" className="mb-2 block">
											Teacher Feedback (Optional)
										</Label>
										<Textarea
											id={"feedback"}
											rows={4}
											value={currentQuestion.teacherFeedback || ""}
											onChange={(e) => handleUpdateFeedback(e.target.value)}
											placeholder="Provide constructive feedback to help the student improve..."
											className="resize-none"
										/>
									</div>
								</div>

								{/* Navigation Buttons */}
								<div className="flex items-center justify-between pt-4">
									<Button
										variant="outline"
										onClick={() => goToQuestion(currentQuestionIndex - 1)}
										disabled={currentQuestionIndex === 0}
									>
										Previous Question
									</Button>

									<div className="text-sm text-muted-foreground">
										Question {currentQuestionIndex + 1} of {answers.length}
									</div>

									<Button
										onClick={() => goToQuestion(currentQuestionIndex + 1)}
										disabled={currentQuestionIndex === answers.length - 1}
									>
										Next Question
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Submit Confirmation Dialog */}
			<AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Submit Final Grade?</AlertDialogTitle>
						<AlertDialogDescription>
							This will finalize the grading and send the results to the
							student.
							<div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
								<div className="flex justify-between">
									<span>Student:</span>
									<span className="font-semibold">{attempt.studentName}</span>
								</div>
								<div className="flex justify-between">
									<span>Final Score:</span>
									<span className="font-semibold">
										{totalScore}/{attempt.maxScore} (
										{Math.round((totalScore / attempt.maxScore) * 100)}%)
									</span>
								</div>
								<div className="flex justify-between">
									<span>Questions Graded:</span>
									<span className="font-semibold">
										{gradedCount}/{answers.length}
									</span>
								</div>
							</div>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmSubmit}>
							Confirm & Submit
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
