import { z } from "zod";

// ==================== Enums ====================
export const ZOptionType = z.enum([
	"SINGLE_CHOICE",
	"MULTIPLE_CHOICE",
	"TRUE_FALSE",
	"FILL_IN_THE_BLANK",
	"SHORT_ANSWER",
]);

export const ZSATPracticeStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const ZAttemptStatus = z.enum([
	"NOT_STARTED",
	"IN_PROGRESS",
	"PAUSED",
	"COMPLETED",
	"SUBMITTED",
	"GRADED",
]);

// ==================== Options ====================
export const ZOption = z.object({
	content: z.string().min(1, "Option content is required"),
	correctAnswerText: z.string().optional(),
	isCorrect: z.boolean().default(false),
	orderIndex: z.number().int().min(0).optional(),
});

export const ZOptionUpdate = ZOption.partial();

// ==================== Question Bank ====================
export const ZQuestionBank = z.object({
	content: z.string().min(1, "Question content is required"),
	answerDescription: z.string().min(1, "Answer description is required"),
	points: z.number().int().min(1).default(1),
	testTypeId: z.cuid("Invalid test type ID"),
	subjectId: z.cuid("Invalid subject ID"),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
	domainId: z.cuid("Invalid domain ID"),
	skillId: z.cuid("Invalid skill ID"),
	optionType: ZOptionType.default("SINGLE_CHOICE"),
	orderIndex: z.number().int().min(0).optional(),
	options: z.array(ZOption).min(1, "At least one option is required"),
	correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
});

export const ZQuestionBankUpdate = ZQuestionBank.partial();

// ==================== Module ====================
export const ZModule = z.object({
	id: z.cuid("Invalid module ID").optional(),
	name: z.string().min(1).optional(),
	threshold: z.number().int().min(0).optional(),
	direction: z.enum(["EASIER", "HARDER"]).optional(),
	orderIndex: z.number().int().min(0, "Order index is required"),
	questionsSetOneIds: z
		.array(z.cuid())
		.optional()
		.describe("Array of question IDs for set one"),
	questionsSetTwoIds: z
		.array(z.cuid())
		.optional()
		.describe("Array of question IDs for set two"),
});

export const ZModuleUpdate = ZModule.partial().extend({
	orderIndex: z.number().int().min(0, "Order index is required").optional(),
});

// ==================== Section ====================
export const ZSection = z.object({
	id: z.cuid("Invalid section ID").optional(),
	name: z.string().min(1).optional(),
	duration: z.number().int().min(1).optional(),
	orderIndex: z.number().int().min(0, "Order index is required"),
	modules: z.array(ZModule).optional(),
});

export const ZSectionUpdate = ZSection.partial().extend({
	orderIndex: z.number().int().min(0, "Order index is required").optional(),
});

// ==================== SAT Practice ====================
export const ZSATPractice = z.object({
	id: z.cuid("Invalid test ID").optional(),
	name: z.string().min(1).optional(),
	testTypeId: z.cuid("Invalid test type ID").optional(),
	subjectId: z.cuid("Invalid subject ID").optional(),
	difficultyId: z.cuid("Invalid difficulty ID").optional(),
	status: ZSATPracticeStatus.default("DRAFT"),
	sections: z.array(ZSection).optional(),
});

// For upsert operations: all fields are optional
export const ZSATPracticeUpdate = ZSATPractice.partial();

// Zod schema - ensure all fields with defaults are explicitly typed
export const ZCQuestion = z.object({
	testTypeId: z.string().min(1, "Test type is required"),
	subjectId: z.string().min(1, "Subject is required"),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
	domainId: z.string().min(1, "Domain is required"),
	skillId: z.string().min(1, "Skills is required"),
	optionType: z.enum([
		"SINGLE_CHOICE",
		"MULTIPLE_CHOICE",
		"TRUE_FALSE",
		"FILL_IN_THE_BLANK",
		"SHORT_ANSWER",
	]),
	content: z.string().min(10, "Question must be at least 10 characters"),
	answerDescription: z.string().min(10, "Answer description is required"),
	options: z.array(z.string()).optional(),
	correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
	points: z.number().min(1, "Points must be at least 1"),
	isActive: z.boolean().refine((val) => val === true, {
		message: "is active must be true",
	}),
	fillBlanks: z
		.array(
			z.object({
				id: z.number(),
				answer: z.string(),
				alternatives: z.array(z.string()),
			}),
		)
		.optional(),
});

// ==================== Student Attempt ====================

// Start a new SAT attempt
export const ZStartAttemptSchema = z.object({
	satPracticeId: z.cuid("Invalid SAT Practice ID"),
	studentId: z.cuid("Invalid student ID"),
});

// Get attempt details
export const ZGetAttemptSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
});

// Submit MCQ/Multiple Choice answer
export const ZSubmitMCQAnswerSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
	questionId: z.cuid("Invalid question ID"),
	selectedOptionIds: z
		.array(z.cuid("Invalid option ID"))
		.min(1, "At least one option must be selected"),
	timeSpent: z.number().int().min(0).optional(),
	flaggedForReview: z.boolean().default(false),
});

// Submit text answer (FILL_IN_THE_BLANK, SHORT_ANSWER)
export const ZSubmitTextAnswerSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
	questionId: z.cuid("Invalid question ID"),
	textAnswer: z.string().min(1, "Answer cannot be empty"),
	timeSpent: z.number().int().min(0).optional(),
	flaggedForReview: z.boolean().default(false),
});

// Navigate to next section
export const ZNavigateSectionSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
	currentSectionId: z.cuid("Invalid section ID"),
});

// Complete section
export const ZCompleteSectionSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
	sectionId: z.cuid("Invalid section ID"),
});

// Complete module within a section
export const ZCompleteModuleSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
	sectionId: z.cuid("Invalid section ID"),
	moduleId: z.cuid("Invalid module ID"),
	usedQuestionSet: z.enum(["SET_ONE", "SET_TWO"]),
});

// Submit entire attempt
export const ZSubmitAttemptSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
});

// ==================== Teacher Grading ====================

// Get pending text answers for grading
export const ZGetPendingAnswersSchema = z.object({
	satPracticeId: z.cuid("Invalid SAT Practice ID").optional(),
	studentId: z.cuid("Invalid student ID").optional(),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(10),
});

// Grade a text answer
export const ZGradeTextAnswerSchema = z.object({
	answerId: z.cuid("Invalid answer ID"),
	isCorrect: z.boolean(),
	pointsEarned: z.number().int().min(0),
	teacherFeedback: z.string().optional(),
	gradedByTeacherId: z.cuid("Invalid teacher ID"),
});

// Recalculate score for an attempt
export const ZRecalculateScoreSchema = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
});

// ==================== Type Exports ====================
export type OptionInput = z.infer<typeof ZOption>;
export type QuestionBankInput = z.infer<typeof ZQuestionBank>;
export type ModuleInput = z.infer<typeof ZModule>;
export type SectionInput = z.infer<typeof ZSection>;
export type SATPracticeInput = z.infer<typeof ZSATPractice>;

// ==================== Type Exports ====================
export type StartAttemptInput = z.infer<typeof ZStartAttemptSchema>;
export type GetAttemptInput = z.infer<typeof ZGetAttemptSchema>;
export type SubmitMCQAnswerInput = z.infer<typeof ZSubmitMCQAnswerSchema>;
export type SubmitTextAnswerInput = z.infer<typeof ZSubmitTextAnswerSchema>;
export type NavigateSectionInput = z.infer<typeof ZNavigateSectionSchema>;
export type CompleteSectionInput = z.infer<typeof ZCompleteSectionSchema>;
export type CompleteModuleInput = z.infer<typeof ZCompleteModuleSchema>;
export type SubmitAttemptInput = z.infer<typeof ZSubmitAttemptSchema>;
export type GetPendingAnswersInput = z.infer<typeof ZGetPendingAnswersSchema>;
export type GradeTextAnswerInput = z.infer<typeof ZGradeTextAnswerSchema>;
export type RecalculateScoreInput = z.infer<typeof ZRecalculateScoreSchema>;
