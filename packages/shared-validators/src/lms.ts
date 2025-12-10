import z, { file } from "zod";

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

export const ZEditQuestion = z.object({
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

export const courseSchema = z.object({
	title: z
		.string()
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be less than 100 characters"),
	shortDescription: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(2000, "Description must be less than 2000 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters")
		.max(2000, "Description must be less than 2000 characters"),
	category: z.string().min(1, "Please select a category"),
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
	IntroductionVideo: z
		.instanceof(File)
		.refine((file) => file.size <= 50 * 1024 * 1024, {
			message: "Video must be less than 50MB",
		})
		.optional(),
	videoTrailer: z
		.instanceof(File)
		.refine((file) => file.size <= 50 * 1024 * 1024, {
			message: "Video must be less than 50MB",
		})
		.optional(),

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
