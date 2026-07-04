import { z } from "zod";

export const ZTestType = z.object({
	id: z.string().min(1, "Invalid test type ID").optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
});

export const ZSubject = z.object({
	id: z.string().min(1, "Invalid subject ID").optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
	testTypeIds: z.array(z.string().min(1, "Invalid test type ID")),
});

export const ZDifficulty = z.object({
	id: z.string().min(1, "Invalid difficulty ID").optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	level: z.number().min(1, "Level is required"),
	order: z.number().int().min(0).optional(),
});

export const ZDomain = z.object({
	id: z.string().min(1, "Invalid domain ID").optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
	subjectIds: z.array(z.string().min(1, "Invalid subject ID")).optional(),
});

export const ZSkill = z.object({
	id: z.string().min(1, "Invalid skill ID").optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
	domainIds: z.array(z.string().min(1, "Invalid domain ID")).optional(),
});

// =========================== types =================================
export type TTestType = z.infer<typeof ZTestType>;
export type TSubject = z.infer<typeof ZSubject>;
export type TDifficulty = z.infer<typeof ZDifficulty>;
export type TDomain = z.infer<typeof ZDomain>;
export type TSkill = z.infer<typeof ZSkill>;
