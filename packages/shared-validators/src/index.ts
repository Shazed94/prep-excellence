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

export type TCuid = z.infer<typeof ZCuid>;
export type TPagination = z.infer<typeof ZPagination>;

// ============= Module Exports =============
export * from "./auth";
export * from "./coaching";
export * from "./lms";
export * from "./onetoone";
export * from "./payment";
export * from "./services";
export * from "./users";
