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

// ==================== Type Exports ====================
export type OptionInput = z.infer<typeof ZOption>;
export type QuestionBankInput = z.infer<typeof ZQuestionBank>;
export type ModuleInput = z.infer<typeof ZModule>;
export type SectionInput = z.infer<typeof ZSection>;
export type SATPracticeInput = z.infer<typeof ZSATPractice>;

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
