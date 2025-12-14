import z from "zod";

export const ZTestType = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export const ZSubject = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export const ZDifficulty = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	level: z.number().min(1, "Level is required"),
});

export const ZDomain = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

export const ZSkill = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	domainId: z.string().optional(),
});