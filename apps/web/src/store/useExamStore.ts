import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Answer {
	questionId: string;
	selectedAnswer: string | null;
	markedForReview: boolean;
	strikethroughAnswers: string[]; // IDs of eliminated answers
}

interface ExamState {
	answers: Record<string, Answer>;
	currentQuestionId: string;
	currentSectionId: string;
	currentPage: "exam" | "check-work" | "break" | "complete";

	// Actions
	selectAnswer: (questionId: string, answerId: string) => void;
	toggleMarkForReview: (questionId: string) => void;
	strikethroughAnswer: (questionId: string, answerId: string) => void;
	removeStrikethrough: (questionId: string, answerId: string) => void;
	setCurrentQuestion: (questionId: string) => void;
	setPage: (page: "exam" | "check-work" | "break" | "complete") => void;
	getAnswer: (questionId: string) => Answer | undefined;
	getAnsweredCount: () => number;
	getUnansweredCount: () => number;
	getForReviewCount: () => number;
}

export const useExamStore = create<ExamState>()(
	persist(
		(set, get) => ({
			answers: {},
			currentQuestionId: "q1",
			currentSectionId: "section-1",
			currentPage: "exam",

			selectAnswer: (questionId: string, answerId: string) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
						markedForReview: false,
						strikethroughAnswers: [],
					};

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
								selectedAnswer: answerId,
							},
						},
					};
				}),

			toggleMarkForReview: (questionId: string) =>
				set((state) => {
					const current = state.answers[questionId] || {
						questionId,
						selectedAnswer: null,
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
						markedForReview: false,
						strikethroughAnswers: [],
					};

					return {
						answers: {
							...state.answers,
							[questionId]: {
								...current,
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

			setCurrentQuestion: (questionId: string) =>
				set({ currentQuestionId: questionId }),

			setPage: (page) => set({ currentPage: page }),

			getAnswer: (questionId: string) => get().answers[questionId],

			getAnsweredCount: () => {
				const answers = get().answers;
				return Object.values(answers).filter((a) => a.selectedAnswer).length;
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
		}),
		{
			name: "exam-store",
		},
	),
);
