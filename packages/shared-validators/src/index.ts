import { z } from "zod";

// ============= Common Validators =============

export const ZCuid = z.object({
	id: z.cuid({ message: "Invalid CUID format for id parameter" }),
});

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

export const ZQueryParams = z.object({
	page: z.preprocess(emptyToUndefined, z.coerce.number().min(1).default(1)),
	limit: z.preprocess(
		emptyToUndefined,
		z.coerce.number().min(1).max(100).default(10),
	),
	sortBy: z.preprocess(emptyToUndefined, z.string().default("createdAt")),
	orderBy: z.preprocess(
		emptyToUndefined,
		z.enum(["asc", "desc"]).default("desc"),
	),
	search: z.preprocess(emptyToUndefined, z.string().trim().min(1).optional()),
	filters: z.preprocess(
		emptyToUndefined,
		z.record(z.string(), z.string()).optional(),
	),
});

export type TCuid = z.infer<typeof ZCuid>;
export type ZQueryParams = z.infer<typeof ZQueryParams>;

// ============= Module Exports =============
export * from "./auth";
export * from "./coaching";
export * from "./lms";
export * from "./onetoone";
export * from "./payment";
export * from "./questionMeterial";
export * from "./services";
export * from "./users";
