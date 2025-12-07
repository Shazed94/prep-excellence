import { z } from "zod";


// ============= Common Validators =============

export const ZCuid = z.object({
	id: z.cuid({ message: "Invalid CUID format for id parameter" }),
});

export const ZPagination = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
	sortBy: z.string().default("createdAt"),
	orderBy: z.enum(["asc", "desc"]).default("desc"),
});

// Export types

export type TCuid = z.infer<typeof ZCuid>;
export type TPagination = z.infer<typeof ZPagination>;



// ============= Blog Validators =============
export * from "./auth";
export * from "./phaseOne";
export * from "./phaseTwo";
export * from "./users";
export * from "./blog";





