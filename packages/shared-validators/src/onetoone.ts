import z from "zod";

// ============= Teacher Profile Validators =============
export const createTeacherProfileSchema = z.object({
	bio: z.string().min(50, "Bio must be at least 50 characters").max(2000),
	hourlyRate: z.number().min(0, "Hourly rate must be non-negative"),
	timezone: z.string().default("UTC"),
	videoUrl: z.string().url().optional(),
	specializations: z
		.array(
			z.object({
				subject: z.string().min(1, "Subject is required"),
				level: z
					.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"])
					.default("INTERMEDIATE"),
				yearsExp: z.number().int().min(0).optional(),
				description: z.string().optional(),
			}),
		)
		.min(1, "Add at least one specialization"),
});

export const updateTeacherProfileSchema = createTeacherProfileSchema.partial();

export const updateProfileAvailabilitySchema = z.object({
	isAvailable: z.boolean(),
});

// ============= Teacher Availability Validators =============
export const createRecurringAvailabilitySchema = z.object({
	availabilityType: z.literal("RECURRING_WEEKLY"),
	dayOfWeek: z.enum([
		"MONDAY",
		"TUESDAY",
		"WEDNESDAY",
		"THURSDAY",
		"FRIDAY",
		"SATURDAY",
		"SUNDAY",
	]),
	startTime: z
		.string()
		.regex(
			/^([01]\d|2[0-3]):([0-5]\d)$/,
			"Time must be in HH:MM format (24-hour)",
		),
	endTime: z
		.string()
		.regex(
			/^([01]\d|2[0-3]):([0-5]\d)$/,
			"Time must be in HH:MM format (24-hour)",
		),
});

export const createOneTimeAvailabilitySchema = z.object({
	availabilityType: z.literal("ONE_TIME_SLOT"),
	specificDate: z.string().datetime(),
	specificStartTime: z.string().datetime(),
	specificEndTime: z.string().datetime(),
});

export const createAvailabilitySchema = z.discriminatedUnion(
	"availabilityType",
	[createRecurringAvailabilitySchema, createOneTimeAvailabilitySchema],
);

export const bulkCreateAvailabilitySchema = z.object({
	availabilities: z
		.array(createAvailabilitySchema)
		.min(1, "Add at least one availability slot"),
});

export const deleteAvailabilitySchema = z.object({
	availabilityId: z.string().cuid(),
});

// ============= Session Booking Validators =============
export const bookSessionSchema = z.object({
	teacherProfileId: z.string().cuid(),
	scheduledAt: z.string().datetime(),
	duration: z.number().int().min(15).max(180), // 15 mins to 3 hours
	timezone: z.string(),
	topic: z.string().max(200).optional(),
	notes: z.string().max(1000).optional(),
});

export const cancelSessionSchema = z.object({
	sessionId: z.string().cuid(),
	cancellationReason: z
		.string()
		.min(10, "Please provide a reason for cancellation"),
});

export const updateSessionStatusSchema = z.object({
	sessionId: z.string().cuid(),
	status: z.enum([
		"SCHEDULED",
		"IN_PROGRESS",
		"COMPLETED",
		"CANCELLED",
		"NO_SHOW",
	]),
	actualStartTime: z.string().datetime().optional(),
	actualEndTime: z.string().datetime().optional(),
});

// ============= Session Recording Validators =============
export const uploadSessionRecordingSchema = z.object({
	sessionId: z.string().cuid(),
});

export const downloadRecordingSchema = z.object({
	recordingId: z.string().cuid(),
});

// ============= One-to-One Review Validators =============
export const createOneToOneReviewSchema = z.object({
	sessionId: z.string().cuid(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().max(1000).optional(),
	isPublic: z.boolean().default(true),
});

export const respondToReviewSchema = z.object({
	reviewId: z.string().cuid(),
	response: z
		.string()
		.min(10, "Response must be at least 10 characters")
		.max(1000),
});

// ============= Search & Discovery Validators =============
export const searchTeachersSchema = z.object({
	subject: z.string().optional(),
	level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
	minHourlyRate: z.number().min(0).optional(),
	maxHourlyRate: z.number().min(0).optional(),
	minRating: z.number().min(0).max(5).optional(),
	isAvailable: z.boolean().optional(),
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(50).default(20),
});

export const getAvailableSlotsSchema = z.object({
	teacherProfileId: z.string().cuid(),
	startDate: z.string().datetime(),
	endDate: z.string().datetime(),
	timezone: z.string().default("UTC"),
});

// ============= Type Exports =============
export type CreateTeacherProfileInput = z.infer<
	typeof createTeacherProfileSchema
>;
export type UpdateTeacherProfileInput = z.infer<
	typeof updateTeacherProfileSchema
>;
export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;
export type BookSessionInput = z.infer<typeof bookSessionSchema>;
export type CancelSessionInput = z.infer<typeof cancelSessionSchema>;
export type CreateOneToOneReviewInput = z.infer<
	typeof createOneToOneReviewSchema
>;
export type SearchTeachersInput = z.infer<typeof searchTeachersSchema>;
