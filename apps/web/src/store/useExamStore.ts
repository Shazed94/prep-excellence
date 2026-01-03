import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Answer {
	questionId: string;
	selectedAnswer: string | null; // For single choice
	selectedAnswers: string[]; // For multiple choice
	markedForReview: boolean;
	strikethroughAnswers: string[]; // IDs of eliminated answers
	textAnswer?: string; // For fill-in-the-blank and short answer
}

interface ExamState {
	answers: Record<string, Answer>;
	currentQuestionId: string;
	currentSectionId: string;
	currentPage: "exam" | "check-work" | "break" | "complete" | "loading";
	isShowUndo: boolean;
	showPreview: boolean;

	// Actions
	selectAnswer: (questionId: string, answerId: string | null) => void;
	selectMultipleAnswers: (questionId: string, answerIds: string[]) => void;
	setTextAnswer: (questionId: string, text: string) => void;
	toggleMarkForReview: (questionId: string) => void;
	strikethroughAnswer: (questionId: string, answerId: string) => void;
	removeStrikethrough: (questionId: string, answerId: string) => void;
	setCurrentQuestion: (questionId: string) => void;
	setPage: (
		page: "exam" | "check-work" | "break" | "complete" | "loading",
	) => void;
	setShowUndo: (show: boolean) => void;
	getAnswer: (questionId: string) => Answer | undefined;
	getAnsweredCount: () => number;
	getUnansweredCount: () => number;
	getForReviewCount: () => number;
	initAnswers: (questionIds: string[]) => void;
	setShowPreview: (show: boolean) => void;
	resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
	persist(
		(set, get) => ({
			answers: {},
			currentQuestionId: "q1",
			currentSectionId: "section-1",
			currentPage: "exam",
			isShowUndo: true,
			showPreview: false,

			selectAnswer: (questionId: string, answerId: string | null) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
						selectedAnswers: [],
						markedForReview: false,
						strikethroughAnswers: [],
					};

					// Remove the answer from strikethrough if it's being selected
					const newStrikethroughAnswers = answerId
						? current.strikethroughAnswers.filter((id) => id !== answerId)
						: current.strikethroughAnswers;

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								selectedAnswer: answerId,
								// When a user selects an answer, clear markedForReview for that question
								markedForReview: answerId ? false : current.markedForReview,
								strikethroughAnswers: newStrikethroughAnswers,
							},
						},
					};
				}),

			selectMultipleAnswers: (questionId: string, answerIds: string[]) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
						selectedAnswers: [],
						markedForReview: false,
						strikethroughAnswers: [],
					};

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								selectedAnswers: answerIds,
								markedForReview:
									answerIds.length > 0 ? false : current.markedForReview,
							},
						},
					};
				}),

			setTextAnswer: (questionId: string, text: string) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
						selectedAnswers: [],
						markedForReview: false,
						strikethroughAnswers: [],
					};

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								textAnswer: text,
								markedForReview: text.trim() ? false : current.markedForReview,
							},
						},
					};
				}),

			toggleMarkForReview: (questionId: string) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
						selectedAnswers: [],
						markedForReview: false,
						strikethroughAnswers: [],
					};

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								markedForReview: !current.markedForReview,
							},
						},
					};
				}),

			strikethroughAnswer: (questionId: string, answerId: string) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
						selectedAnswers: [],
						markedForReview: false,
						strikethroughAnswers: [],
					};

					// If this answer is currently selected, deselect it
					const newSelectedAnswer =
						current.selectedAnswer === answerId ? null : current.selectedAnswer;

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								selectedAnswer: newSelectedAnswer,
								strikethroughAnswers: [
									...new Set([...current.strikethroughAnswers, answerId]),
								],
							},
						},
					};
				}),

			removeStrikethrough: (questionId: string, answerId: string) =>
				set((state) => {
					const current = state.answers[questionId];
					if (!current) return state; // No change if answer doesn't exist

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								strikethroughAnswers: current.strikethroughAnswers.filter(
									(id) => id !== answerId,
								),
							},
						},
					};
				}),

			setShowUndo: (show: boolean) => set({ isShowUndo: show }),
			setShowPreview: (show: boolean) => set({ showPreview: show }),
			setCurrentQuestion: (questionId: string) =>
				set({ currentQuestionId: questionId }),

			setPage: (page) => set({ currentPage: page }),

			getAnswer: (questionId: string) => get().answers[questionId],

			getAnsweredCount: () => {
				const answers = get().answers;
				// Count only answers where selectedAnswer is a non-null, non-empty string
				return Object.values(answers).filter((a) => a.selectedAnswer != null)
					.length;
			},

			getUnansweredCount: () => {
				const answers = get().answers;
				// This needs the total number of questions to work properly
				return Object.values(answers).filter((a) => !a.selectedAnswer).length;
			},

			getForReviewCount: () => {
				const answers = get().answers;
				return Object.values(answers).filter((a) => a.markedForReview).length;
			},
			initAnswers: (questionIds: string[]) =>
				set((state) => ({
					answers: questionIds.reduce(
						(acc, id) => {
							if (!acc[id]) {
								acc[id] = {
									questionId: id,
									selectedAnswer: null,
									selectedAnswers: [],
									markedForReview: false,
									strikethroughAnswers: [],
								};
							}
							return acc;
						},
						{ ...state.answers },
					),
				})),

			resetExam: () =>
				set({
					answers: {},
					currentQuestionId: "q1",
					currentPage: "exam",
					showPreview: true,
				}),
		}),
		{
			name: "exam-store",
		},
	),
);
