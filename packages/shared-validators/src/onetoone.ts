import { z } from "zod";

// ============= Teacher Profile Validators =============
export const createTeacherProfileSchema = z.object({
	onlineHourlyRate: z
		.number()
		.min(0, "Online hourly rate must be non-negative"),
	offlineHourlyRate: z
		.number()
		.min(0, "Offline hourly rate must be non-negative"),
	timezone: z.string().default("UTC"),
	videoUrl: z.string().optional(),
	isAvailable: z.boolean().default(true),
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
//
// Prisma mapping:
//   category          AVAILABILITY_CATEGORY  →  "AVAILABLE" | "BLOCKED"
//   availabilityType  AVAILABILITY_TYPE      →  "ONLINE" | "OFFLINE"
//   dayOfWeek         DAY_OF_WEEK?           →  recurring
//   specificDate      DateTime?              →  one-time date
//   specificStartTime DateTime?              →  full DateTime (date+time)
//   specificEndTime   DateTime?              →  full DateTime (date+time)
//
export const dayOfWeekEnum = z.enum([
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
]);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const timeString = z
	.string()
	.regex(timeRegex, "Time must be in HH:MM format (24-hour)");
const dateString = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const createAvailabilitySchema = z
	.object({
		category: z.enum(["AVAILABLE", "BLOCKED"]),
		availabilityType: z.enum(["ONLINE", "OFFLINE"]).optional(),

		// Recurring (weekly)
		daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
		startTime: timeString,
		endTime: timeString,

		// Date range
		startDate: dateString,
		endDate: dateString.optional(),

		// Session config (AVAILABLE only)
		sessionDuration: z.coerce.number().int().min(5).optional(),
		bufferTime: z.coerce.number().int().min(0).optional(),
		hourlyRate: z.coerce.number().min(0).optional(),

		// Blocked config (BLOCKED only)
		fullDay: z.boolean().optional(),
		reason: z.string().optional(),

		// Common
		title: z.string().optional(),
		repeatDuration: z.coerce.number().int().min(1).optional(),
	})
	.refine(
		(data) => {
			if (data.category === "AVAILABLE" && !data.availabilityType) {
				return false;
			}
			return true;
		},
		{
			message: "availabilityType is required when category is AVAILABLE",
			path: ["availabilityType"],
		},
	)
	.refine(
		(data) => {
			if (data.category === "BLOCKED" && !data.fullDay && !data.startTime) {
				return false;
			}
			return true;
		},
		{
			message: "startTime is required for non-full-day blocked time",
			path: ["startTime"],
		},
	)
	.refine(
		(data) => {
			if (!data.startTime || !data.endTime) return true;
			return data.startTime < data.endTime;
		},
		{
			message: "End time must be after start time",
			path: ["endTime"],
		},
	)
	.refine(
		(data) => {
			if (!data.startDate) return true;
			const today = new Date().toISOString().slice(0, 10);
			return data.startDate >= today;
		},
		{
			message: "Start date cannot be in the past",
			path: ["startDate"],
		},
	);

export const updateAvailabilitySchema = createAvailabilitySchema.partial();

export const deleteAvailabilitySchema = z.object({
	availabilityId: z.string().cuid(),
});

export const dbDayOfWeekMap: Record<number, string> = {
	0: "SUNDAY",
	1: "MONDAY",
	2: "TUESDAY",
	3: "WEDNESDAY",
	4: "THURSDAY",
	5: "FRIDAY",
	6: "SATURDAY",
};

// ============= Session Booking Validators =============
export const bookSessionSchema = z.object({
	teacherAvailabilityId: z
		.string()
		.cuid("Teacher availability slot ID is required"),
	topic: z.string().max(200).optional(),
	notes: z.string().max(1000).optional(),
	// Payment details
	paymentMethod: z.enum(["card", "bank_transfer", "paypal"]),
	paymentProvider: z.enum(["STRIPE", "PAYPAL", "MANUAL"]).default("STRIPE"),
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
	minOnlineHourlyRate: z.coerce.number().min(0).optional(),
	maxOnlineHourlyRate: z.coerce.number().min(0).optional(),
	minOfflineHourlyRate: z.coerce.number().min(0).optional(),
	maxOfflineHourlyRate: z.coerce.number().min(0).optional(),
	minRating: z.coerce.number().min(0).max(5).optional(),
	isAvailable: z
		.union([z.boolean(), z.enum(["true", "false"])])
		.transform((v) => (typeof v === "string" ? v === "true" : v))
		.optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(50).default(20),
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
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type BookSessionInput = z.infer<typeof bookSessionSchema>;
export type CancelSessionInput = z.infer<typeof cancelSessionSchema>;
export type CreateOneToOneReviewInput = z.infer<
	typeof createOneToOneReviewSchema
>;
export type SearchTeachersInput = z.infer<typeof searchTeachersSchema>;
