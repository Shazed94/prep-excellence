// components/course/quiz/create-quiz-form.tsx
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type QuestionFormState,
	type QuizWithQuestionsState,
	useCreateQuizWithQuestions,
} from "@/hooks/lms-quiz";
import { QuestionEditor } from "./question-editor";
import { QuestionNavigator } from "./question-navigator";
import { QuestionPreview } from "./question-preview";
import { QuizSettingsSection } from "./quiz-settings-section";
import { QuizSummary } from "./quiz-summary";

// ==================== TYPES ====================
interface CreateQuizFormProps {
	moduleId: string;
	onSaveSuccess?: () => void;
}

// ==================== COMPONENT ====================
export function CreateQuizForm({
	moduleId,
	onSaveSuccess,
}: CreateQuizFormProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [formData, setFormData] = useState<QuizWithQuestionsState>({
		title: "",
		description: "",
		orderIndex: 0,
		passingScore: 70,
		timeLimit: undefined,
		maxAttempts: undefined,
		shuffleQuestions: false,
		showResults: true,
		moduleId,
		questions: [
			{
				id: undefined,
				question: "",
				type: "MCQ_SINGLE",
				orderIndex: 0,
				points: 1,
				explanation: "",
				options: [
					{ text: "", isCorrect: false, orderIndex: 0 },
					{ text: "", isCorrect: false, orderIndex: 1 },
				],
			},
		],
	});

	// API Hooks
	const createQuizMutation = useCreateQuizWithQuestions();

	const currentQuestion = formData.questions[currentQuestionIndex];
	const totalQuestions = formData.questions.length;

	// ==================== HANDLERS ====================

	const addNewQuestion = () => {
		const newQuestion: QuestionFormState = {
			id: undefined,
			question: "",
			type: "MCQ_SINGLE",
			orderIndex: totalQuestions,
			points: 1,
			explanation: "",
			options: [
				{ text: "", isCorrect: false, orderIndex: 0 },
				{ text: "", isCorrect: false, orderIndex: 1 },
			],
		};
		setFormData({
			...formData,
			questions: [...formData.questions, newQuestion],
		});
		setCurrentQuestionIndex(totalQuestions);
	};

	const removeCurrentQuestion = () => {
		if (totalQuestions > 1) {
			const updated = formData.questions.filter(
				(_, idx) => idx !== currentQuestionIndex,
			);
			setFormData({ ...formData, questions: updated });

			if (currentQuestionIndex >= updated.length) {
				setCurrentQuestionIndex(Math.max(0, updated.length - 1));
			}
		}
	};

	const duplicateQuestion = () => {
		const questionToDuplicate: QuestionFormState = {
			...currentQuestion,
			id: undefined,
			orderIndex: totalQuestions,
		};
		setFormData({
			...formData,
			questions: [...formData.questions, questionToDuplicate],
		});
		setCurrentQuestionIndex(totalQuestions);
	};

	const updateCurrentQuestion = (field: string, value: any) => {
		const updated = formData.questions.map((q, idx) =>
			idx === currentQuestionIndex ? { ...q, [field]: value } : q,
		);
		setFormData({ ...formData, questions: updated });
	};

	const updateQuizField = (field: string, value: any) => {
		setFormData({ ...formData, [field]: value });
	};

	const getTotalPoints = (): number => {
		return formData.questions.reduce((total, q) => total + q.points, 0);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate required fields
		if (!formData.title.trim()) {
			alert("Please enter a quiz title");
			return;
		}
		if (formData.questions.length === 0) {
			alert("Please add at least one question");
			return;
		}

		// Validate at least one question has content
		const hasValidQuestion = formData.questions.some(
			(q) => q.question.trim().length > 0,
		);
		if (!hasValidQuestion) {
			alert("Please add question content to at least one question");
			return;
		}

		try {
			await createQuizMutation.mutateAsync(formData);
			if (onSaveSuccess) {
				onSaveSuccess();
			} else {
				// Navigate back to course if no callback provided
				window.history.back();
			}
		} catch (error) {
			console.error("Failed to save quiz:", error);
		}
	};

	const handleReset = () => {
		setFormData({
			title: "",
			description: "",
			orderIndex: 0,
			passingScore: 70,
			timeLimit: undefined,
			maxAttempts: undefined,
			shuffleQuestions: false,
			showResults: true,
			moduleId,
			questions: [
				{
					id: undefined,
					question: "",
					type: "MCQ_SINGLE",
					orderIndex: 0,
					points: 1,
					explanation: "",
					options: [
						{ text: "", isCorrect: false, orderIndex: 0 },
						{ text: "", isCorrect: false, orderIndex: 1 },
					],
				},
			],
		});
		setCurrentQuestionIndex(0);
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4 pb-4">
			{/* Quiz Settings */}
			<QuizSettingsSection formData={formData} onUpdate={updateQuizField} />

			{/* Questions Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg">Questions</CardTitle>
							<CardDescription>
								Add and manage quiz questions ({totalQuestions} question
								{totalQuestions !== 1 ? "s" : ""}, {getTotalPoints()} total
								points)
							</CardDescription>
						</div>
						<Button type="button" onClick={addNewQuestion} className="gap-2">
							<Plus className="w-4 h-4" />
							Add Question
						</Button>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Question Navigator */}
					<QuestionNavigator
						currentIndex={currentQuestionIndex}
						totalQuestions={totalQuestions}
						onPrevious={() =>
							setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
						}
						onNext={() =>
							setCurrentQuestionIndex(
								Math.min(totalQuestions - 1, currentQuestionIndex + 1),
							)
						}
						onSelectQuestion={(index) => setCurrentQuestionIndex(index)}
					/>

					{/* Current Question Editor and Preview */}
					{currentQuestion && (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* Editor */}
							<div className="lg:col-span-2">
								<QuestionEditor
									question={currentQuestion}
									totalQuestions={totalQuestions}
									currentIndex={currentQuestionIndex}
									onUpdate={updateCurrentQuestion}
									onDuplicate={duplicateQuestion}
									onRemove={removeCurrentQuestion}
									canRemove={totalQuestions > 1}
								/>
							</div>

							{/* Preview */}
							<div className="hidden lg:block">
								<QuestionPreview
									question={currentQuestion}
									currentIndex={currentQuestionIndex}
								/>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Summary and Actions */}
			<QuizSummary
				totalQuestions={totalQuestions}
				totalPoints={getTotalPoints()}
				passingScore={formData.passingScore}
				onReset={handleReset}
				onSubmit={() => {}}
				isSubmitting={createQuizMutation.isPending}
			/>
		</form>
	);
}
