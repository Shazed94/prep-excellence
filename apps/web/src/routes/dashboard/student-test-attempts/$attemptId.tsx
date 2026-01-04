import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import {
	ArrowLeft,
	CheckCircle,
	Clock,
	Save,
	XCircle,
	Flag,
	Award,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
	"/dashboard/student-test-attempts/$attemptId",
)({
	component: GradingPage,
});

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
	correctAnswer: string | string[];
	isCorrect: boolean | null;
	pointsEarned: number | null;
	timeSpent: number;
	flaggedForReview: boolean;
	teacherFeedback?: string;
}

// Dummy Data (in real app, fetch this from API based on attemptId)
const DUMMY_DATA: Record<
	string,
	{ attempt: StudentAttempt; answers: QuestionAnswer[] }
> = {
	att_001: {
		attempt: {
			id: "att_001",
			studentName: "Alice Johnson",
			studentEmail: "alice.johnson@example.com",
			testName: "SAT Math Practice Test - Full Length",
			subject: "Mathematics",
			status: "SUBMITTED",
			totalQuestions: 5,
			answeredQuestions: 5,
			score: null,
			maxScore: 6,
			startedAt: "2026-01-03T09:00:00Z",
			completedAt: "2026-01-03T10:45:00Z",
			timeSpent: 6300,
		},
		answers: [
			{
				id: "ans_001",
				questionId: "q_001",
				questionContent: "If 3x + 5 = 20, what is the value of x?",
				questionType: "SINGLE_CHOICE",
				points: 1,
				difficulty: "EASY",
				domain: "Algebra",
				skill: "Linear Equations",
				options: [
					{ id: "opt_1", content: "3", isCorrect: false },
					{ id: "opt_2", content: "5", isCorrect: true },
					{ id: "opt_3", content: "7", isCorrect: false },
					{ id: "opt_4", content: "15", isCorrect: false },
				],
				studentAnswer: "opt_2",
				correctAnswer: "opt_2",
				isCorrect: true,
				pointsEarned: 1,
				timeSpent: 45,
				flaggedForReview: false,
			},
			{
				id: "ans_002",
				questionId: "q_002",
				questionContent:
					"A rectangular garden has a length of 12 meters and a width of 8 meters. What is the area of the garden in square meters?",
				questionType: "SHORT_ANSWER",
				points: 1,
				difficulty: "EASY",
				domain: "Geometry",
				skill: "Area Calculation",
				studentAnswer: "96",
				correctAnswer: "96",
				isCorrect: null,
				pointsEarned: null,
				timeSpent: 60,
				flaggedForReview: false,
			},
			{
				id: "ans_003",
				questionId: "q_003",
				questionContent:
					"Which of the following are prime numbers? (Select all that apply)",
				questionType: "MULTIPLE_CHOICE",
				points: 1,
				difficulty: "MEDIUM",
				domain: "Number Theory",
				skill: "Prime Numbers",
				options: [
					{ id: "opt_5", content: "11", isCorrect: true },
					{ id: "opt_6", content: "13", isCorrect: true },
					{ id: "opt_7", content: "15", isCorrect: false },
					{ id: "opt_8", content: "17", isCorrect: true },
				],
				studentAnswer: ["opt_5", "opt_6"],
				correctAnswer: ["opt_5", "opt_6", "opt_8"],
				isCorrect: false,
				pointsEarned: null,
				timeSpent: 90,
				flaggedForReview: true,
			},
			{
				id: "ans_004",
				questionId: "q_004",
				questionContent: "Solve for y: 2y - 7 = 15. Show your work.",
				questionType: "SHORT_ANSWER",
				points: 2,
				difficulty: "MEDIUM",
				domain: "Algebra",
				skill: "Equation Solving",
				studentAnswer: "y = 11\nSteps: 2y = 15 + 7, 2y = 22, y = 11",
				correctAnswer: "11",
				isCorrect: null,
				pointsEarned: null,
				timeSpent: 120,
				flaggedForReview: false,
			},
			{
				id: "ans_005",
				questionId: "q_005",
				questionContent: "If f(x) = 2x² + 3x - 5, what is f(3)?",
				questionType: "SINGLE_CHOICE",
				points: 1,
				difficulty: "HARD",
				domain: "Functions",
				skill: "Function Evaluation",
				options: [
					{ id: "opt_9", content: "10", isCorrect: false },
					{ id: "opt_10", content: "16", isCorrect: false },
					{ id: "opt_11", content: "22", isCorrect: true },
					{ id: "opt_12", content: "28", isCorrect: false },
				],
				studentAnswer: "opt_10",
				correctAnswer: "opt_11",
				isCorrect: false,
				pointsEarned: 0,
				timeSpent: 150,
				flaggedForReview: true,
			},
		],
	},
};

function GradingPage() {
	const { attemptId } = Route.useParams();
	const navigate = useNavigate();

	// In real app, fetch from API
	const attemptData = DUMMY_DATA[attemptId];

	const [answers, setAnswers] = React.useState<QuestionAnswer[]>(
		attemptData?.answers || [],
	);
	const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
	const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
	const [showSaveDialog, setShowSaveDialog] = React.useState(false);

	if (!attemptData) {
		return (
			<div className="container mx-auto py-10 text-center">
				<h2 className="text-2xl font-bold">Attempt not found</h2>
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

	// Save all grades
	const handleSaveGrades = () => {
		// In real app, make API call here
		console.log("Saving grades:", answers);
		toast.success("Grades saved successfully!");
		setHasUnsavedChanges(false);
	};

	// Submit final grading
	const handleSubmitGrading = () => {
		if (gradedCount < answers.length) {
			toast.error("Please grade all questions before submitting");
			return;
		}
		setShowSaveDialog(true);
	};

	const confirmSubmit = () => {
		// In real app, make API call to finalize grading
		console.log("Finalizing grades with total score:", totalScore);
		toast.success("Test graded and submitted to student!");
		setShowSaveDialog(false);
		navigate({ to: "/dashboard/student-test-attempts" });
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b sticky top-0 z-10">
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
							<Button variant="outline" onClick={handleSaveGrades}>
								<Save className="w-4 h-4 mr-2" />
								Save Progress
							</Button>
							<Button onClick={handleSubmitGrading}>Submit Final Grade</Button>
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
								<ScrollArea className="h-[calc(100vh-300px)]">
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
										<p className="text-sm text-muted-foreground">
											{currentQuestion.domain} • {currentQuestion.skill} • Time
											spent: {formatTime(currentQuestion.timeSpent)}
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Question Content */}
								<div className="p-6 bg-gray-50 rounded-lg">
									<Label className="text-base font-semibold mb-2 block">
										Question
									</Label>
									<p className="text-lg">{currentQuestion.questionContent}</p>
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
											id="points"
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
											id="feedback"
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
