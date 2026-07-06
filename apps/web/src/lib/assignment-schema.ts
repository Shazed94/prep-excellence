import { z } from "zod";

export const ZCCoachingAssignmentSchema = z
	.object({
		title: z
			.string()
			.min(1, "Title is required")
			.min(3, "Title must be at least 3 characters")
			.max(200, "Title must be less than 200 characters"),

		description: z.string().optional(),

		instructions: z.string().optional(),

		dueDate: z.date().optional(),

		totalPoints: z.number().int().positive().default(100),

		allowLateSubmission: z.boolean().default(false),

		lateSubmissionPenalty: z.number().int().min(0).max(100).optional(),
	})
	.refine(
		(data) =>
			!data.allowLateSubmission || data.lateSubmissionPenalty !== undefined,
		{
			message: "Set a penalty percentage when late submission is allowed",
			path: ["lateSubmissionPenalty"],
		},
	);

export type CoachingAssignmentFormValues = z.infer<
	typeof ZCCoachingAssignmentSchema
>;
