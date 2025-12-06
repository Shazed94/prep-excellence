import z from "zod";

export const ZCreateBlogPost = z.object({
	title: z.string().min(2, "Title must be at least 2 characters"),
	content: z.string().min(10, "Content must be at least 10 characters"),
	authorId: z.string().cuid("Invalid author ID"),
	tags: z.array(z.string()).min(1, "At least one tag is required"),
});

export const ZUpdateBlogPost = z.object({
	title: z.string().min(2, "Title must be at least 2 characters").optional(),
	content: z
		.string()
		.min(10, "Content must be at least 10 characters")
		.optional(),
	tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
});

export const ZBlogPost = z.object({
	id: z.string().cuid("Invalid blog post ID"),
	title: z.string().min(2, "Title must be at least 2 characters"),
	content: z.string().min(10, "Content must be at least 10 characters"),
	authorId: z.string().cuid("Invalid author ID"),
	tags: z.array(z.string()).min(1, "At least one tag is required"),
	createdAt: z.date(),
	updatedAt: z.date(),
});
