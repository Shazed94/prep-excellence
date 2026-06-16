import { z } from "zod";

// ============= Coaching Course Validators =============

export const ZCreateCourseSchema = z.object({
	title: z
		.string()
		.min(1, "Course title is required")
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be less than 100 characters"),
	sortDescription: z
		.string()
		.min(1, "Description is required")
		.min(20, "Description must be at least 20 characters"),
	longDescription: z
		.string()
		.min(1, "Description is required")
		.min(20, "Description must be at least 20 characters"),
	startDate: z.coerce.date().refine((date) => date > new Date(), {
		message: "Start date must be in the future",
	}),
	duration: z.number().min(1, "Duration must be at least 1 day"),
	schedule: z
		.array(
			z.object({
				day: z.string().min(1, "Day is required"),
				startTime: z.string().min(1, "Start time is required"),
				endTime: z.string().min(1, "End time is required"),
			}),
		)
		.min(1, "Add at least one weekly session"),
	video: z.string().optional(),
	regular_price: z.number().min(1, "Price must be 0 or more"),
	offer_price: z.number().min(1, "Price must be 0 or more"),
	capacity: z.number().min(1, "Capacity must be at least 1"),
	thumbnail: z.string().optional(),
	category: z.string().min(1, "Category is required"),
	level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
	tags: z.array(z.string()),
});

export const ZUpdateCourseSchema = ZCreateCourseSchema.partial();

export const publishCoachingCourseSchema = z.object({
	isPublished: z.boolean(),
});

// ============= Coaching Module Validators =============
export const createCoachingModuleSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().optional(),
	orderIndex: z.number().int().min(0),
	unlockAtPercent: z.number().int().min(0).max(100).default(0),
	courseId: z.string().cuid(),
});

export const updateCoachingModuleSchema = createCoachingModuleSchema
	.partial()
	.omit({ courseId: true });

export const reorderCoachingModulesSchema = z.object({
	modules: z.array(
		z.object({
			id: z.string().cuid(),
			orderIndex: z.number().int().min(0),
		}),
	),
});

// ============= Coaching Topic Validators =============
export const createCoachingTopicSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().optional(),
	orderIndex: z.number().int().min(0),
	moduleId: z.string().cuid(),
});

export const updateCoachingTopicSchema = createCoachingTopicSchema
	.partial()
	.omit({ moduleId: true });

// ============= Coaching Content Validators =============
const baseContentSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().optional(),
	orderIndex: z.number().int().min(0),
	contentType: z.enum([
		"VIDEO_RECORDED",
		"VIDEO_LIVE",
		"VIDEO_SCHEDULED",
		"QUIZ",
		"ASSIGNMENT",
		"TEST",
		"READING_MATERIAL",
	]),
	topicId: z.string().cuid(),
});

export const createCoachingContentSchema = z.discriminatedUnion("contentType", [
	// Live session
	baseContentSchema.extend({
		contentType: z.literal("VIDEO_LIVE"),
		scheduledAt: z.string().datetime(),
		duration: z.number().int().positive(), // minutes
		instructorId: z.string().cuid(),
		maxParticipants: z.number().int().positive().optional(),
	}),
	// Scheduled video
	baseContentSchema.extend({
		contentType: z.literal("VIDEO_SCHEDULED"),
		scheduledAt: z.string().datetime(),
		duration: z.number().int().positive(),
		instructorId: z.string().cuid().optional(),
	}),
	// Recorded video
	baseContentSchema.extend({
		contentType: z.literal("VIDEO_RECORDED"),
	}),
	// Quiz
	baseContentSchema.extend({
		contentType: z.literal("QUIZ"),
		quizData: z.object({
			questions: z
				.array(
					z.object({
						question: z.string().min(10),
						questionType: z.enum([
							"MULTIPLE_CHOICE",
							"TRUE_FALSE",
							"SHORT_ANSWER",
						]),
						options: z.array(z.string()).optional(),
						correctAnswer: z.string(),
						points: z.number().int().positive().default(1),
					}),
				)
				.min(1),
		}),
		passingScore: z.number().int().min(0).max(100),
		timeLimit: z.number().int().positive().optional(),
	}),
	// Assignment
	baseContentSchema.extend({
		contentType: z.literal("ASSIGNMENT"),
		assignmentData: z.object({
			instructions: z.string().min(10),
			rubric: z.string().optional(),
			acceptedFileTypes: z.array(z.string()).optional(),
			maxFileSize: z.number().int().positive().optional(),
		}),
		dueDate: z.string().datetime(),
		totalPoints: z.number().int().positive(),
	}),
	// Test
	baseContentSchema.extend({
		contentType: z.literal("TEST"),
		quizData: z.object({
			questions: z
				.array(
					z.object({
						question: z.string().min(10),
						questionType: z.enum([
							"MULTIPLE_CHOICE",
							"TRUE_FALSE",
							"SHORT_ANSWER",
						]),
						options: z.array(z.string()).optional(),
						correctAnswer: z.string(),
						points: z.number().int().positive().default(1),
					}),
				)
				.min(1),
		}),
		passingScore: z.number().int().min(0).max(100),
		timeLimit: z.number().int().positive(),
		dueDate: z.string().datetime().optional(),
		totalPoints: z.number().int().positive(),
	}),
	// Reading material
	baseContentSchema.extend({
		contentType: z.literal("READING_MATERIAL"),
		content: z.string().min(10),
		attachments: z.array(z.string()).default([]),
	}),
]);

export const updateCoachingContentSchema = createCoachingContentSchema;

export const uploadContentVideoSchema = z.object({
	contentId: z.string().cuid(),
});

export const selectContentThumbnailSchema = z.object({
	thumbnailId: z.string(),
});

// ============= Coaching Enrollment Validators =============
export const enrollInCoachingCourseSchema = z.object({
	courseId: z.string().cuid(),
	installmentSchedule: z
		.array(
			z.object({
				amount: z.number().min(0),
				dueDate: z.string().datetime(),
				percentage: z.number().int().min(0).max(100),
			}),
		)
		.min(1, "At least one installment required"),
});

export const updateCoachingProgressSchema = z.object({
	contentId: z.string().cuid(),
	isCompleted: z.boolean(),
	score: z.number().int().min(0).max(100).optional(),
	grade: z.string().optional(),
	feedback: z.string().optional(),
});

// ============= Coaching Submission Validators =============
export const createCoachingSubmissionSchema = z.object({
	contentId: z.string().cuid(),
	fileUrls: z.array(z.string()).default([]),
	textAnswer: z.string().optional(),
});

export const gradeSubmissionSchema = z.object({
	submissionId: z.string().cuid(),
	score: z.number().int().min(0).max(100).optional(),
	grade: z.string().optional(),
	feedback: z.string().optional(),
});

// ============= Coaching Attendance Validators =============
export const recordAttendanceSchema = z.object({
	contentId: z.string().cuid(),
	studentId: z.string().cuid(),
	joinedAt: z.string().datetime(),
	leftAt: z.string().datetime().optional(),
	isPresent: z.boolean().default(true),
});

// ============= Type Exports =============
export type TCreateCourseSchema = z.infer<typeof ZCreateCourseSchema>;
export type TUpdateCourseSchema = z.infer<typeof ZUpdateCourseSchema>;

export type CreateCoachingModuleInput = z.infer<
	typeof createCoachingModuleSchema
>;
export type UpdateCoachingModuleInput = z.infer<
	typeof updateCoachingModuleSchema
>;
export type CreateCoachingTopicInput = z.infer<
	typeof createCoachingTopicSchema
>;
export type UpdateCoachingTopicInput = z.infer<
	typeof updateCoachingTopicSchema
>;
export type CreateCoachingContentInput = z.infer<
	typeof createCoachingContentSchema
>;
export type EnrollInCoachingCourseInput = z.infer<
	typeof enrollInCoachingCourseSchema
>;
export type CreateCoachingSubmissionInput = z.infer<
	typeof createCoachingSubmissionSchema
>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
