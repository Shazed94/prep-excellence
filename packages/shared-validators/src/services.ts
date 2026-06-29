import { z } from "zod";

// API schema for backend (expects G-prefixed grades)
export const ZCFreeSeminarForm = z.object({
	image: z.string().optional(), // Will be handled by multer middleware
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	startDate: z.coerce.date().min(new Date(), "Date must be in the future"),
	endDate: z.coerce.date().optional(),
	startTime: z.string().min(1, "Start time is required"),
	endTime: z.string().optional(),
	capacity: z.coerce
		.number()
		.int()
		.positive("Capacity must be a positive integer"),
	isActive: z.coerce.boolean().default(true),
});

// API schema for backend (expects G-prefixed grades)
export const ZCFreeSeminarEnrollmentForm = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().optional(),
	email: z.email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	country: z.string().min(1, "Country is required"),
	address: z.string().optional(),
	seminarId: z.string().min(1, "Free seminar ID is required"),
});

export const ZNewsletterSubscription = z.object({
	email: z.email("Please enter a valid email address"),
});

export const ZCTrustedCompanies = z.object({
	name: z.string().min(1, "Name is required"),
	logo: z.string().optional(),
});

export const ZCContactUsSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	query: z.string().min(1, "Please describe how we can help you"),
});

export const ZCBlogCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
});

export const ZUBlogCategorySchema = ZCBlogCategorySchema.partial();

export const ZCBlogSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.min(5, "Title must be at least 5 characters")
		.max(200, "Title must not exceed 200 characters"),

	categoryId: z.string().min(1, "Category is required"),
	image: z.string().optional(), // Will be handled by multer middleware
	description: z
		.string()
		.min(1, "Description is required")
		.min(10, "Description must be at least 10 characters"),

	status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),

	tags: z.array(z.string()).optional().default([]),
});

export const ZUBlogSchema = ZCBlogSchema.partial();

export const ZCBlogCommentSchema = z.object({
	blogId: z.string().min(1, "Blog ID is required"),
	content: z
		.string()
		.min(1, "Comment content is required")
		.min(3, "Comment must be at least 3 characters"),
	parentId: z.string().optional(),
});

export const ZCCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
	description: z.string().optional(),
	isActive: z.boolean().default(true),
});

export const ZUCategorySchema = ZCCategorySchema.extend({
	id: z.string().optional(),
}).partial();

export const ZUBlogCommentSchema = ZCBlogCommentSchema.partial();

export const ZUFreeSeminarForm = ZCFreeSeminarForm.extend({
	id: z.string().optional(),
}).partial();

export type TCFreeSeminarFormInput = z.infer<typeof ZCFreeSeminarForm>;
export type TCFreeSeminarForm = z.infer<typeof ZCFreeSeminarForm>;

export type TNewsletterSubscription = z.infer<typeof ZNewsletterSubscription>;
export type TCTrustedCompanies = z.infer<typeof ZCTrustedCompanies>;
export type TCContactUsSchema = z.infer<typeof ZCContactUsSchema>;
export type TCBlogSchema = z.infer<typeof ZCBlogSchema>;
export type TUBlogSchema = z.infer<typeof ZUBlogSchema>;
export type TCBlogCategorySchema = z.infer<typeof ZCBlogCategorySchema>;
export type TUBlogCategorySchema = z.infer<typeof ZUBlogCategorySchema>;
export type TCBlogCommentSchema = z.infer<typeof ZCBlogCommentSchema>;
export type TUBlogCommentSchema = z.infer<typeof ZUBlogCommentSchema>;
export type TFreeSeminarEnrollmentForm = z.infer<
	typeof ZCFreeSeminarEnrollmentForm
>;

export type TCCategorySchema = z.infer<typeof ZCCategorySchema>;
export type TUCateogrySchema = z.infer<typeof ZUCategorySchema>;
