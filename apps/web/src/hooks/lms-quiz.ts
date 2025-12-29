"use client";

import {
	createLMSQuizSchema,
	createQuizQuestionSchema,
	submitQuizAttemptSchema,
	updateLMSQuizSchema,
	updateQuizQuestionSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

// ==================== TYPES ====================
export interface QuizFormState {
	title: string;
	description: string;
	orderIndex: number;
	passingScore: number;
	timeLimit?: number;
	maxAttempts?: number;
	shuffleQuestions: boolean;
	showResults: boolean;
	moduleId: string;
}

export interface QuestionFormState {
	id?: string;
	question: string;
	type: "MCQ_SINGLE" | "MCQ_MULTIPLE" | "TRUE_FALSE" | "SHORT" | "LONG";
	orderIndex: number;
	points: number;
	explanation?: string;
	options?: Array<{
		text: string;
		isCorrect: boolean;
		orderIndex: number;
	}>;
}

export interface QuizWithQuestionsState extends QuizFormState {
	questions: QuestionFormState[];
}

// ==================== CREATE QUIZ ====================
/**
 * Hook for creating a new quiz (without questions)
 * Questions can be added separately using useAddQuestionToQuiz
 */
export function useCreateQuiz() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			data: Omit<QuizFormState, "moduleId"> & { moduleId: string },
		) => {
			// Validate against Zod schema
			const validated = createLMSQuizSchema.parse({
				title: data.title,
				description: data.description,
				orderIndex: data.orderIndex,
				passingScore: data.passingScore,
				timeLimit: data.timeLimit,
				maxAttempts: data.maxAttempts,
				shuffleQuestions: data.shuffleQuestions,
				showResults: data.showResults,
			});

			const response = await axiosInstance.post("/lms/quizzes", validated);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quizzes"] });
			toast.success("Quiz created successfully");
		},
		onError: (error: any) => {
			const message = error.response?.data?.message || "Failed to create quiz";
			toast.error(message);
		},
	});
}

// ==================== CREATE QUIZ WITH QUESTIONS ====================
/**
 * Hook for creating a complete quiz with all questions in one operation
 * Use this when you have all questions ready before submission
 */
export function useCreateQuizWithQuestions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: QuizWithQuestionsState) => {
			const { moduleId, questions, ...quizData } = data;

			// Step 1: Create the quiz
			const quizResponse = await axiosInstance.post(
				`/lms/modules/${moduleId}/quizzes`,
				quizData,
			);

			const quizId = quizResponse.data.data.id;

			// Step 2: Add all questions
			const questionsWithIds = await Promise.all(
				questions.map(async (q) => {
					const questionData = {
						question: q.question,
						type: q.type,
						orderIndex: q.orderIndex,
						points: q.points,
						explanation: q.explanation,
						options:
							q.type.includes("MCQ") || q.type === "TRUE_FALSE"
								? q.options
								: undefined,
					};

					// Validate against Zod schema
					const validated = createQuizQuestionSchema.parse(questionData);

					const response = await axiosInstance.post(
						`/lms/quizzes/${quizId}/questions`,
						validated,
					);
					return response.data.data;
				}),
			);

			return {
				data: {
					...quizResponse.data.data,
					questions: questionsWithIds,
				},
				success: true,
				message: "Quiz with questions created successfully",
			};
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quizzes"] });
			toast.success("Quiz with questions created successfully");
		},
		onError: (error: any) => {
			const message = error.response?.data?.message || "Failed to create quiz";
			toast.error(message);
		},
	});
}

// ==================== UPDATE QUIZ ====================
/**
 * Hook for updating existing quiz metadata (title, description, settings, etc.)
 * Does not affect questions
 */
export function useUpdateQuiz(quizId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<QuizFormState>) => {
			// Validate against Zod schema
			const validated = updateLMSQuizSchema.parse(data);

			const response = await axiosInstance.patch(
				`/lms/quizzes/${quizId}`,
				validated,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quiz", quizId] });
			queryClient.invalidateQueries({ queryKey: ["lms-quizzes"] });
			toast.success("Quiz updated successfully");
		},
		onError: (error: any) => {
			const message = error.response?.data?.message || "Failed to update quiz";
			toast.error(message);
		},
	});
}

// ==================== QUESTION MANAGEMENT ====================
/**
 * Hook for adding a new question to an existing quiz
 */
export function useAddQuestionToQuiz(quizId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: QuestionFormState) => {
			// Transform frontend format to API format
			const apiData = {
				question: data.question,
				type: data.type,
				orderIndex: data.orderIndex,
				points: data.points,
				explanation: data.explanation,
				options:
					data.type.includes("MCQ") || data.type === "TRUE_FALSE"
						? data.options
						: undefined,
			};

			// Validate against Zod schema
			const validated = createQuizQuestionSchema.parse(apiData);

			const response = await axiosInstance.post(
				`/lms/quizzes/${quizId}/questions`,
				validated,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quiz", quizId] });
			queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
			toast.success("Question added successfully");
		},
		onError: (error: any) => {
			const message = error.response?.data?.message || "Failed to add question";
			toast.error(message);
		},
	});
}

// ==================== UPDATE QUESTION ====================
/**
 * Hook for updating an existing question
 */
export function useUpdateQuestion(quizId: string, questionId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<QuestionFormState>) => {
			// Transform frontend format to API format
			const apiData = {
				question: data.question,
				type: data.type,
				orderIndex: data.orderIndex,
				points: data.points,
				explanation: data.explanation,
				options:
					data.type && (data.type.includes("MCQ") || data.type === "TRUE_FALSE")
						? data.options
						: undefined,
			};

			// Validate against Zod schema (using partial since fields are optional for updates)
			const validated = updateQuizQuestionSchema.parse(apiData);

			const response = await axiosInstance.patch(
				`/lms/quizzes/${quizId}/questions/${questionId}`,
				validated,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quiz", quizId] });
			queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
			queryClient.invalidateQueries({
				queryKey: ["quiz-question", questionId],
			});
			toast.success("Question updated successfully");
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message || "Failed to update question";
			toast.error(message);
		},
	});
}

// ==================== DELETE QUESTION ====================
/**
 * Hook for deleting a question from a quiz
 */
export function useDeleteQuestion(quizId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (questionId: string) => {
			const response = await axiosInstance.delete(
				`/lms/quizzes/${quizId}/questions/${questionId}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quiz", quizId] });
			queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
			toast.success("Question deleted successfully");
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message || "Failed to delete question";
			toast.error(message);
		},
	});
}

// ==================== FETCH QUIZ ====================
/**
 * Hook for fetching a single quiz with all its questions
 */
export function useGetQuiz(quizId: string | undefined) {
	return useQuery({
		queryKey: ["lms-quiz", quizId],
		queryFn: async () => {
			if (!quizId) throw new Error("Quiz ID is required");

			const response = await axiosInstance.get(`/lms/quizzes/${quizId}`);
			return response.data;
		},
		enabled: !!quizId,
	});
}

// ==================== FETCH QUIZ QUESTIONS ====================
/**
 * Hook for fetching all questions for a specific quiz
 */
export function useGetQuizQuestions(quizId: string | undefined) {
	return useQuery({
		queryKey: ["quiz-questions", quizId],
		queryFn: async () => {
			if (!quizId) throw new Error("Quiz ID is required");

			const response = await axiosInstance.get(
				`/lms/quizzes/${quizId}/questions`,
			);
			return response.data;
		},
		enabled: !!quizId,
	});
}

// ==================== SUBMIT QUIZ ATTEMPT ====================
/**
 * Hook for submitting a student's quiz attempt
 */
export function useSubmitQuizAttempt(quizId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: {
			answers: Array<{
				questionId: string;
				selectedOptionId?: string;
				textAnswer?: string;
			}>;
			timeSpent: number;
		}) => {
			// Validate against Zod schema
			const validated = submitQuizAttemptSchema.parse(data);

			const response = await axiosInstance.post(
				`/lms/quizzes/${quizId}/attempts`,
				validated,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["quiz-attempts", quizId] });
			toast.success("Quiz submitted successfully");
		},
		onError: (error: any) => {
			const message = error.response?.data?.message || "Failed to submit quiz";
			toast.error(message);
		},
	});
}

// ==================== FETCH QUIZ ATTEMPTS ====================
/**
 * Hook for fetching quiz attempts (for instructors to view student results)
 */
export function useGetQuizAttempts(
	quizId: string | undefined,
	filters?: { studentId?: string; isPassed?: boolean },
) {
	return useQuery({
		queryKey: ["quiz-attempts", quizId, filters],
		queryFn: async () => {
			if (!quizId) throw new Error("Quiz ID is required");

			const response = await axiosInstance.get(
				`/lms/quizzes/${quizId}/attempts`,
				{ params: filters },
			);
			return response.data;
		},
		enabled: !!quizId,
	});
}

// ==================== REORDER QUESTIONS ====================
/**
 * Hook for reordering questions in a quiz (bulk operation)
 */
export function useReorderQuizQuestions(quizId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			questions: Array<{ id: string; orderIndex: number }>,
		) => {
			const response = await axiosInstance.patch(
				`/lms/quizzes/${quizId}/reorder-questions`,
				{ questions },
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quiz", quizId] });
			queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
			toast.success("Questions reordered successfully");
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message || "Failed to reorder questions";
			toast.error(message);
		},
	});
}

// ==================== DUPLICATE QUESTION ====================
/**
 * Hook for duplicating an existing question in the same quiz
 */
export function useDuplicateQuestion(quizId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (questionId: string) => {
			const response = await axiosInstance.post(
				`/lms/quizzes/${quizId}/questions/${questionId}/duplicate`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lms-quiz", quizId] });
			queryClient.invalidateQueries({ queryKey: ["quiz-questions", quizId] });
			toast.success("Question duplicated successfully");
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message || "Failed to duplicate question";
			toast.error(message);
		},
	});
}

// ==================== UTILITY HOOKS ====================
/**
 * Hook for local form state management - separate from API concerns
 * Use this for managing the form state while editing before submission
 */
export function useQuizFormState(initialState?: Partial<QuizFormState>) {
	const [formState, setFormState] = useState<Partial<QuizFormState>>(
		initialState || {
			title: "",
			description: "",
			orderIndex: 0,
			passingScore: 70,
			shuffleQuestions: false,
			showResults: true,
		},
	);

	return { formState, setFormState };
}

/**
 * Hook for local question state management - for editing individual questions
 */
export function useQuestionFormState(
	initialState?: Partial<QuestionFormState>,
) {
	const [questionState, setQuestionState] = useState<
		Partial<QuestionFormState>
	>(
		initialState || {
			question: "",
			type: "MCQ_SINGLE",
			orderIndex: 0,
			points: 1,
			options: [
				{ text: "", isCorrect: false, orderIndex: 0 },
				{ text: "", isCorrect: false, orderIndex: 1 },
			],
		},
	);

	return { questionState, setQuestionState };
}
