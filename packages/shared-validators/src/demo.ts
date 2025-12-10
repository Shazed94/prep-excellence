import { z } from "zod";

// Demo post schema (matching JSONPlaceholder API)
export const ZDemoPost = z.object({
	userId: z.number(),
	id: z.number(),
	title: z.string(),
	body: z.string(),
});

export type TDemoPost = z.infer<typeof ZDemoPost>;

// Query parameters for fetching demo posts
export const ZDemoPostQuery = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	search: z.string().optional(),
	sortBy: z.enum(["id", "title", "userId"]).optional().default("id"),
	orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type TDemoPostQuery = z.infer<typeof ZDemoPostQuery>;
