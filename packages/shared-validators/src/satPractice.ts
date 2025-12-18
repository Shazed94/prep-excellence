import z from "zod";

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
	points: z.number().int().min(1).default(1),
	testTypeId: z.cuid("Invalid test type ID"),
	subjectId: z.cuid("Invalid subject ID"),
	difficultyId: z.cuid("Invalid difficulty ID"),
	domainId: z.cuid("Invalid domain ID"),
	skillId: z.cuid("Invalid skill ID"),
	optionType: ZOptionType.default("SINGLE_CHOICE"),
	orderIndex: z.number().int().min(0).optional(),
	options: z.array(ZOption).min(1, "At least one option is required"),
});

export const ZQuestionBankUpdate = ZQuestionBank.partial();

// ==================== Module ====================
export const ZModule = z.object({
	id: z.cuid("Invalid module ID").optional(),
	name: z.string().min(1, "Module name is required"),
	threshold: z.number().int().min(0, "Threshold must be non-negative"),
	direction: z.enum(["EASIER", "HARDER"]).optional(),
	orderIndex: z.number().int().min(0),
	questionsSetOneIds: z
		.array(z.cuid())
		.optional()
		.describe("Array of question IDs for set one"),
	questionsSetTwoIds: z
		.array(z.cuid())
		.optional()
		.describe("Array of question IDs for set two"),
});

export const ZModuleUpdate = ZModule.partial();

// ==================== Section ====================
export const ZSection = z.object({
	id: z.cuid("Invalid section ID").optional(),
	name: z.string().min(1, "Section name is required"),
	duration: z.number().int().min(1, "Duration must be at least 1 minute"),
	orderIndex: z.number().int().min(0),
	modules: z.array(ZModule).optional(),
});

export const ZSectionUpdate = ZSection.partial();

// ==================== SAT Practice ====================
export const ZSATPractice = z.object({
	id: z.cuid("Invalid test ID").optional(),
	name: z.string().min(1, "Test name is required"),
	testTypeId: z.cuid("Invalid test type ID"),
	subjectId: z.cuid("Invalid subject ID"),
	difficultyId: z.cuid("Invalid difficulty ID").optional(),
	status: ZSATPracticeStatus.default("DRAFT"),
	sections: z.array(ZSection).optional(),
});

// For upsert operations: all fields are optional
export const ZSATPracticeUpdate = ZSATPractice.partial();

// For auto-save (draft mode) - allow partial data with at least name or status
export const ZSATPracticeDraft = z
	.object({
		name: z.string().min(1).optional(),
		testTypeId: z.cuid().optional(),
		subjectId: z.cuid().optional(),
		difficultyId: z.cuid().optional(),
		status: ZSATPracticeStatus.default("DRAFT"),
		sections: z.array(ZSection).optional(),
	})
	.refine((data) => data.name || data.status, {
		message: "At least name or status must be provided for draft",
	});

// ==================== Student Attempt ====================
export const ZStartAttempt = z.object({
	satPracticeId: z.cuid("Invalid SAT practice test ID"),
});

export const ZSubmitAnswer = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
	questionId: z.cuid("Invalid question ID"),
	selectedOptionIds: z.array(z.cuid()).optional(),
	textAnswer: z.string().optional(),
	timeSpent: z.number().int().min(0).optional(),
	flaggedForReview: z.boolean().default(false),
});

export const ZSubmitAttempt = z.object({
	attemptId: z.cuid("Invalid attempt ID"),
});

// ==================== Teacher Grading ====================
export const ZGradeAnswer = z.object({
	studentAnswerId: z.cuid("Invalid student answer ID"),
	isCorrect: z.boolean(),
	pointsEarned: z.number().int().min(0),
	teacherFeedback: z.string().optional(),
});

export const ZBulkGradeAnswers = z.object({
	grades: z.array(ZGradeAnswer).min(1, "At least one grade is required"),
});

// ==================== Query Filters ====================
export const ZQuestionBankFilters = z.object({
	testTypeId: z.cuid().optional(),
	subjectId: z.cuid().optional(),
	difficultyId: z.cuid().optional(),
	domainId: z.cuid().optional(),
	skillId: z.cuid().optional(),
	optionType: ZOptionType.optional(),
	isUsed: z
		.string()
		.transform((val) => val === "true")
		.optional(),
});

export const ZSATPracticeFilters = z.object({
	testTypeId: z.cuid().optional(),
	subjectId: z.cuid().optional(),
	status: ZSATPracticeStatus.optional(),
});

// ==================== Type Exports ====================
export type OptionInput = z.infer<typeof ZOption>;
export type QuestionBankInput = z.infer<typeof ZQuestionBank>;
export type ModuleInput = z.infer<typeof ZModule>;
export type SectionInput = z.infer<typeof ZSection>;
export type SATPracticeInput = z.infer<typeof ZSATPractice>;
export type StartAttemptInput = z.infer<typeof ZStartAttempt>;
export type SubmitAnswerInput = z.infer<typeof ZSubmitAnswer>;
export type GradeAnswerInput = z.infer<typeof ZGradeAnswer>;
