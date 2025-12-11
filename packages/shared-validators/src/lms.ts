import z from "zod";

// ============= Enums =============
export const ZDifficultyLevel = z.enum([
	"BEGINNER",
	"INTERMEDIATE",
	"ADVANCED",
	"EXPERT",
]);
export const ZContentType = z.enum([
	"VIDEO_RECORDED",
	"VIDEO_LIVE",
	"VIDEO_SCHEDULED",
	"QUIZ",
	"ASSIGNMENT",
	"TEST",
	"READING_MATERIAL",
	"DISCUSSION",
]);

// ============= LMS Course Validators =============
export const createLMSCourseSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	slug: z
		.string()
		.min(3)
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	thumbnail: z.string().url().optional(),
	price: z.number().min(0, "Price must be non-negative"),
	discount: z.number().min(0).max(100).optional(),
	level: ZDifficultyLevel.default("BEGINNER"),
	duration: z.number().int().positive().optional(),
	category: z.string().min(1, "Category is required"),
	tags: z.array(z.string()).default([]),
	requirements: z.array(z.string()).default([]),
	whatYouLearn: z.array(z.string()).min(1, "Add at least one learning outcome"),
	instructorId: z.string().cuid(),
});

export const updateLMSCourseSchema = createLMSCourseSchema
	.partial()
	.omit({ instructorId: true });

export const publishLMSCourseSchema = z.object({
	isPublished: z.boolean(),
});

// ============= LMS Module Validators =============
export const createLMSModuleSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().optional(),
	orderIndex: z.number().int().min(0),
	duration: z.number().int().positive().optional(),
	courseId: z.string().cuid(),
});

export const updateLMSModuleSchema = createLMSModuleSchema
	.partial()
	.omit({ courseId: true });

export const reorderLMSModulesSchema = z.object({
	modules: z.array(
		z.object({
			id: z.string().cuid(),
			orderIndex: z.number().int().min(0),
		}),
	),
});

// ============= LMS Lesson Validators =============
export const createLMSLessonSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().optional(),
	orderIndex: z.number().int().min(0),
	contentType: ZContentType.default("VIDEO_RECORDED"),
	content: z.string().optional(), // Rich text for READING_MATERIAL
	attachments: z.array(z.string()).default([]),
	moduleId: z.string().cuid(),
});

export const updateLMSLessonSchema = createLMSLessonSchema
	.partial()
	.omit({ moduleId: true });

export const uploadLessonVideoSchema = z.object({
	lessonId: z.string().cuid(),
});

export const selectLessonThumbnailSchema = z.object({
	thumbnailId: z.string(),
});

// ============= LMS Quiz Validators =============
export const createLMSQuizSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(200),
	description: z.string().optional(),
	orderIndex: z.number().int().min(0),
	passingScore: z.number().int().min(0).max(100),
	timeLimit: z.number().int().positive().optional(),
	maxAttempts: z.number().int().positive().optional(),
	shuffleQuestions: z.boolean().default(false),
	questions: z
		.array(
			z.object({
				question: z.string().min(10),
				questionType: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
				options: z.array(z.string()).optional(),
				correctAnswer: z.string(),
				points: z.number().int().positive().default(1),
				explanation: z.string().optional(),
			}),
		)
		.min(1, "Add at least one question"),
	moduleId: z.string().cuid(),
});

export const updateLMSQuizSchema = createLMSQuizSchema
	.partial()
	.omit({ moduleId: true });

export const submitQuizAttemptSchema = z.object({
	quizId: z.string().cuid(),
	enrollmentId: z.string().cuid(), // Need to verify enrollment before allowing quiz
	answers: z.record(z.string(), z.string()), // { questionId: answer }
	timeSpent: z.number().int().min(0),
});

// ============= LMS Enrollment Validators =============
export const enrollInLMSCourseSchema = z.object({
	courseId: z.string().cuid(),
});

export const updateLMSProgressSchema = z.object({
	lessonId: z.string().cuid(),
	watchTimeSeconds: z.number().int().min(0),
	lastPosition: z.number().int().min(0),
	completionPercent: z.number().int().min(0).max(100),
	isCompleted: z.boolean().optional(),
});

// ============= LMS Discussion Validators =============
export const createLMSDiscussionSchema = z.object({
	lessonId: z.string().cuid(),
	content: z.string().min(1, "Content is required").max(5000),
	parentId: z.string().cuid().optional(),
});

export const updateLMSDiscussionSchema = z.object({
	content: z.string().min(1, "Content is required").max(5000),
});

// ============= LMS Review Validators =============
export const createLMSReviewSchema = z.object({
	courseId: z.string().cuid(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().max(1000).optional(),
});

export const updateLMSReviewSchema = createLMSReviewSchema
	.partial()
	.omit({ courseId: true });

// ============= Question Bank (Legacy) =============
export const ZAddQuestion = z.object({
	testType: z.string().min(1, "Test type is required"),
	subject: z.string().min(1, "Subject is required"),
	section: z.string().min(1, "Section is required"),
	difficultyLevel: z.string().min(1, "Difficulty level is required"),
	domain: z.string().min(1, "Domain is required"),
	skill: z.string().min(1, "Skill is required"),
	questionType: z.string().min(1, "Question type is required"),
	question: z.string().min(10, "Question must be at least 10 characters"),
	answer: z.string().min(1, "Answer is required"),
	optionA: z.string().min(1, "Option A is required"),
	optionB: z.string().min(1, "Option B is required"),
	optionC: z.string().min(1, "Option C is required"),
	optionD: z.string().min(1, "Option D is required"),
	correctOption: z.enum(["A", "B", "C", "D"], {
		error: "Please select the correct option",
	}),
	time: z.string().optional(),
	date: z.string().optional(),
});

export const ZEditQuestion = ZAddQuestion;

export const courseSchema = z.object({
	title: z
		.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be less than 100 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(2000, "Description must be less than 2000 characters"),
	category: z.string().min(1, "Please select a category"),
	shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
	level: z.enum(["beginner", "intermediate", "advanced"]),
	duration: z.coerce
		.number()
		.min(1, "Duration must be at least 1 minute")
		.max(1000, "Duration must be less than 1000 minutes"),
	price: z.coerce
		.number()
		.min(0, "Price cannot be negative")
		.max(10000, "Price must be less than $10,000"),
	discount: z.coerce
		.number()
		.min(0, "Discount cannot be negative")
		.max(100, "Discount cannot exceed 100%")
		.default(0),
	thumbnail: z.string().optional(),
	videoTrailer: z.string().optional(),
	documents: z.string().array().optional(),
	lessons: z
		.array(
			z.object({
				id: z.string(),
				title: z.string().min(1, "Lesson title is required"),
				description: z.string().optional(),
				videoUrl: z.string().optional(),
				duration: z.coerce
					.number()
					.min(1, "Duration must be at least 1 minute")
					.optional(),
				order: z.number(),
			}),
		)
		.default([]),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export type TAddQuestion = z.infer<typeof ZAddQuestion>;
export type TEditQuestion = z.infer<typeof ZEditQuestion>;
