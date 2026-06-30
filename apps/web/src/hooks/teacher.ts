/**
 * Teacher Dashboard Hooks
 *
 * Covers:
 *  - Own 1-on-1 teacher profile (create / read / update)
 *  - Availability slot management (add / update / delete)
 *  - Session control (start / end / cancel)
 *  - Coaching course management (teacher POV)
 *  - Assignment submissions + grading
 *  - Live-session attendance
 *  - Student list per course/topic
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvailabilityType = "ONLINE" | "OFFLINE";
export type AvailabilityCategory = "AVAILABLE" | "BLOCKED";
export type DayOfWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";

export interface TeacherSpecialization {
	id: string;
	subject: string;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	yearsExp?: number;
	description?: string;
}

export interface OwnTeacherProfile {
	id: string;
	teacherId: string;
	bio?: string;
	onlineHourlyRate: number | null;
	offlineHourlyRate: number | null;
	timezone: string;
	videoUrl?: string;
	rating: number;
	totalSessions: number;
	totalReviews: number;
	isAvailable: boolean;
	responseTime?: number;
	specializations: TeacherSpecialization[];
}

export interface AvailabilitySlot {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	category: AvailabilityCategory;
	availabilityType: AvailabilityType | null;
	bufferTime: number | null;
	sessionDuration: number | null;
	hourlyRate: number | null;
	reason: string | null;
	title: string | null;
	repeatDuration: number | null;
	dayOfWeek: DayOfWeek | null;
	specificDate: string | null;
	specificStartTime: string | null;
	specificEndTime: string | null;
	isBooked: boolean;
	profileId: string;
}

export interface CreateAvailabilityInput {
	category: AvailabilityCategory;
	availabilityType?: AvailabilityType;
	daysOfWeek?: number[];
	startTime: string;
	endTime: string;
	startDate: string;
	endDate?: string;
	sessionDuration?: number;
	bufferTime?: number;
	hourlyRate?: number;
	fullDay?: boolean;
	reason?: string;
	title?: string;
	repeatDuration?: number;
}

export interface TeacherSession {
	id: string;
	status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
	topic?: string;
	notes?: string;
	scheduledAt: string;
	duration: number;
	timezone: string;
	jitsiRoomId?: string;
	jitsiStartUrl?: string;
	actualStartTime?: string;
	actualEndTime?: string;
	cancelledAt?: string;
	cancellationReason?: string;
	student: {
		id: string;
		user: { name: string; image?: string; email: string };
	};
	recording?: {
		id: string;
		status: "processing" | "ready" | "failed";
		masterPlaylistUrl?: string;
		expiresAt: string;
	};
	review?: {
		id: string;
		rating: number;
		comment?: string;
	};
}

export interface CoachingSubmission {
	id: string;
	textAnswer?: string;
	fileUrl?: string;
	score?: number;
	feedback?: string;
	gradedAt?: string;
	submittedAt: string;
	student: {
		id: string;
		user: { name: string; image?: string };
	};
	content: { id: string; title: string };
}

export interface AttendanceRecord {
	id: string;
	joinedAt: string;
	leftAt?: string;
	duration?: number;
	student: {
		id: string;
		user: { name: string; image?: string };
	};
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
	ownProfile: ["teacher", "own-profile"] as const,
	availability: ["teacher", "availability"] as const,
	sessions: (teacherId: string) => ["teacher", "sessions", teacherId] as const,
	coachingCourses: ["teacher", "coaching-courses"] as const,
	submissions: (contentId: string) =>
		["teacher", "submissions", contentId] as const,
	attendance: (contentId: string) =>
		["teacher", "attendance", contentId] as const,
};

// ─── Own Profile ──────────────────────────────────────────────────────────────

/**
 * GET /teachers/me — current teacher (Teacher model + User)
 */
export function useGetTeacherMe() {
	return useQuery({
		queryKey: ["teacher", "me"] as const,
		queryFn: async () => {
			const res = await axiosInstance.get("/teachers/me");
			return res.data.data as {
				id: string;
				userId: string;
				name: string;
				email: string;
				image?: string;
				phone?: string;
				role?: string;
				qualifications?: string;
				experienceYears?: number;
				isActive: boolean;
			};
		},
	});
}

/**
 * GET /onetoone/teachers/:teacherId/profile  (own profile — auth)
 */
export function useGetOwnTeacherProfile(profileId?: string) {
	return useQuery({
		queryKey: KEYS.ownProfile,
		queryFn: async (): Promise<{ data: OwnTeacherProfile }> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${profileId}/profile`,
			);
			return res.data;
		},
		enabled: !!profileId,
	});
}

/**
 * POST /onetoone/teachers/profile
 */
export function useCreateTeacherProfile() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: {
			bio?: string;
			onlineHourlyRate: number;
			offlineHourlyRate: number;
			timezone?: string;
			videoUrl?: string;
			isAvailable?: boolean;
			specializations?: Array<{
				subject: string;
				level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
				yearsExp?: number;
				description?: string;
			}>;
		}) => {
			const res = await axiosInstance.post("/onetoone/teachers/profile", body);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.ownProfile });
			toast.success("Profile created");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to create profile");
		},
	});
}

/**
 * PATCH /onetoone/teachers/:teacherId/profile
 * Accepts full profile including specializations array.
 */
export function useUpdateTeacherProfile(profileId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: any) => {
			const res = await axiosInstance.patch(
				`/onetoone/teachers/${profileId}/profile`,
				body,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.ownProfile });
			toast.success("Profile updated");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to update profile");
		},
	});
}

/**
 * POST /onetoone/teachers/:teacherId/specializations
 * Add a single specialization.
 */
export function useAddSpecialization(profileId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: {
			subject: string;
			level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
			yearsExp?: number;
			description?: string;
		}) => {
			const res = await axiosInstance.post(
				`/onetoone/teachers/${profileId}/specializations`,
				body,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.ownProfile });
			toast.success("Specialization added");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to add specialization");
		},
	});
}

/**
 * DELETE /onetoone/teachers/specializations/:id
 * Remove a single specialization by ID.
 */
export function useRemoveSpecialization() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (specializationId: string) => {
			const res = await axiosInstance.delete(
				`/onetoone/teachers/specializations/${specializationId}`,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.ownProfile });
			toast.success("Specialization removed");
		},
		onError: (e: any) => {
			toast.error(
				e.response?.data?.message ?? "Failed to remove specialization",
			);
		},
	});
}

/**
 * POST /onetoone/sessions/:reviewId/review-response
 * Teacher responds to a student review.
 */
export function useRespondToReview() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			sessionId,
			response,
		}: {
			sessionId: string;
			response: string;
		}) => {
			const res = await axiosInstance.post(
				`/onetoone/sessions/${sessionId}/review-response`,
				{ response },
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["teacher", "sessions"] });
			toast.success("Response submitted");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to submit response");
		},
	});
}

// ─── Availability ─────────────────────────────────────────────────────────────

/**
 * GET /onetoone/teachers/:teacherId/availability
 */
export function useGetOwnAvailability(teacherId?: string) {
	return useQuery({
		queryKey: KEYS.availability,
		queryFn: async (): Promise<{ data: AvailabilitySlot[] }> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${teacherId}/availability`,
			);
			return res.data;
		},
		enabled: !!teacherId,
	});
}

/**
 * POST /onetoone/teachers/:teacherId/availability
 */
export function useAddAvailability(teacherId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: CreateAvailabilityInput) => {
			const res = await axiosInstance.post(
				`/onetoone/teachers/${teacherId}/availability`,
				body,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.availability });
			toast.success("Availability slot added");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to add slot");
		},
	});
}

/**
 * POST /onetoone/teachers/:teacherId/availability (bulk for recurring)
 * Creates multiple day-of-week records at once.
 */
export function useAddBulkAvailability(teacherId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: CreateAvailabilityInput) => {
			const res = await axiosInstance.post(
				`/onetoone/teachers/${teacherId}/availability`,
				body,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.availability });
			toast.success("Availability slots created");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to create slots");
		},
	});
}

/**
 * PUT /onetoone/teachers/availability/:id
 */
export function useUpdateAvailability() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: string;
			body: Partial<CreateAvailabilityInput>;
		}) => {
			const res = await axiosInstance.put(
				`/onetoone/teachers/availability/${id}`,
				body,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.availability });
			toast.success("Slot updated");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to update slot");
		},
	});
}

/**
 * DELETE /onetoone/availability/:id
 */
export function useDeleteAvailability() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/onetoone/availability/${id}`);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.availability });
			toast.success("Slot removed");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to delete slot");
		},
	});
}

// ─── Sessions (Teacher POV) ───────────────────────────────────────────────────

/**
 * GET /onetoone/teachers/:teacherId/sessions
 */
export function useGetTeacherOwnSessions(teacherId?: string) {
	return useQuery({
		queryKey: KEYS.sessions(teacherId ?? ""),
		queryFn: async (): Promise<{
			data: TeacherSession[];
			pagination?: { total: number };
		}> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${teacherId}/sessions`,
			);
			return res.data;
		},
		enabled: !!teacherId,
	});
}

/**
 * POST /onetoone/sessions/:id/start
 */
export function useStartSession(teacherId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (sessionId: string) => {
			const res = await axiosInstance.post(
				`/onetoone/sessions/${sessionId}/start`,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.sessions(teacherId ?? "") });
			toast.success("Session started");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to start session");
		},
	});
}

/**
 * POST /onetoone/sessions/:id/end
 */
export function useEndSession(teacherId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (sessionId: string) => {
			const res = await axiosInstance.post(
				`/onetoone/sessions/${sessionId}/end`,
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.sessions(teacherId ?? "") });
			toast.success("Session ended");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to end session");
		},
	});
}

/**
 * POST /onetoone/sessions/:id/cancel
 */
export function useCancelTeacherSession(teacherId?: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			sessionId,
			reason,
		}: {
			sessionId: string;
			reason?: string;
		}) => {
			const res = await axiosInstance.post(
				`/onetoone/sessions/${sessionId}/cancel`,
				{ reason },
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.sessions(teacherId ?? "") });
			toast.success("Session cancelled");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to cancel session");
		},
	});
}

// ─── Coaching (Teacher POV) ───────────────────────────────────────────────────

/**
 * GET /coaching/my-courses  (teacher's own coaching courses)
 */
export function useGetMyCoachingCourses() {
	return useQuery({
		queryKey: KEYS.coachingCourses,
		queryFn: async (): Promise<{
			data: Array<{
				id: string;
				title: string;
				thumbnail?: string;
				level?: string;
				status: string;
				duration?: number;
				capacity?: number;
				startDate?: string;
				endDate?: string;
				regular_price: number;
				offer_price?: number;
				enrollmentCount?: number;
			}>;
		}> => {
			const res = await axiosInstance.get("/coaching/courses/my-courses");
			return res.data;
		},
	});
}

/**
 * POST /coaching/courses  — create a coaching course
 */
export function useCreateCoachingCourse() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: {
			title: string;
			description?: string;
			sortDescription?: string;
			regular_price?: number;
			offer_price?: number;
			level?: string;
			capacity?: number;
			duration?: number;
			startDate?: string;
			endDate?: string;
		}) => {
			const res = await axiosInstance.post("/coaching/courses", body);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.coachingCourses });
			toast.success("Coaching course created");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to create course");
		},
	});
}

/**
 * PATCH /coaching/courses/:id/publish  — toggle publish
 */
export function usePublishCoachingCourse() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			courseId,
			publish,
		}: {
			courseId: string;
			publish: boolean;
		}) => {
			const res = await axiosInstance.patch(
				`/coaching/courses/${courseId}/publish`,
				{ publish },
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: KEYS.coachingCourses });
			toast.success("Course status updated");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to update course");
		},
	});
}

// ─── Submissions + Grading ───────────────────────────────────────────────────

/**
 * GET /coaching/contents/:contentId/submissions
 */
export function useGetSubmissions(contentId?: string) {
	return useQuery({
		queryKey: KEYS.submissions(contentId ?? ""),
		queryFn: async (): Promise<{ data: CoachingSubmission[] }> => {
			const res = await axiosInstance.get(
				`/coaching/contents/${contentId}/submissions`,
			);
			return res.data;
		},
		enabled: !!contentId,
	});
}

/**
 * PATCH /coaching/submissions/:id/grade
 */
export function useGradeSubmission() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			submissionId,
			score,
			feedback,
		}: {
			submissionId: string;
			score: number;
			feedback?: string;
		}) => {
			const res = await axiosInstance.patch(
				`/coaching/submissions/${submissionId}/grade`,
				{ score, feedback },
			);
			return res.data;
		},
		onSuccess: () => {
			// We don't know the contentId here, so invalidate broadly
			qc.invalidateQueries({ queryKey: ["teacher", "submissions"] });
			toast.success("Submission graded");
		},
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to grade submission");
		},
	});
}

/**
 * GET /coaching/contents/:contentId/attendance
 */
export function useGetContentAttendance(contentId?: string) {
	return useQuery({
		queryKey: KEYS.attendance(contentId ?? ""),
		queryFn: async (): Promise<{ data: AttendanceRecord[] }> => {
			const res = await axiosInstance.get(
				`/coaching/contents/${contentId}/attendance`,
			);
			return res.data;
		},
		enabled: !!contentId,
	});
}

/**
 * POST /coaching/contents/:id/start-session  (teacher starts live content)
 */
export function useStartLiveContent() {
	return useMutation({
		mutationFn: async (contentId: string) => {
			const res = await axiosInstance.post(
				`/coaching/contents/${contentId}/start-session`,
			);
			return res.data;
		},
		onSuccess: () => toast.success("Live session started"),
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to start session");
		},
	});
}

/**
 * POST /coaching/contents/:id/end-session
 */
export function useEndLiveContent() {
	return useMutation({
		mutationFn: async (contentId: string) => {
			const res = await axiosInstance.post(
				`/coaching/contents/${contentId}/end-session`,
			);
			return res.data;
		},
		onSuccess: () => toast.success("Live session ended"),
		onError: (e: any) => {
			toast.error(e.response?.data?.message ?? "Failed to end session");
		},
	});
}
