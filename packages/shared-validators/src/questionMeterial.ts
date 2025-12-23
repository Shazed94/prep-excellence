import { z } from "zod";

export const ZTestType = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
});

export const ZSubject = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
	testTypeIds: z.array(z.string().cuid("Invalid test type ID")),
});

export const ZDifficulty = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	level: z.number().min(1, "Level is required"),
	order: z.number().int().min(0).optional(),
});

export const ZDomain = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
	subjectIds: z.array(z.string().cuid("Invalid subject ID")).optional(),
});

export const ZSkill = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	order: z.number().int().min(0).optional(),
	domainIds: z.array(z.string().cuid("Invalid domain ID")).optional(),
});
