/**
 * Phase 4 – One-to-One Online/Offline Coaching
 * API base: /onetoone
 *
 * Flow:
 *  Browse teachers → View profile + availability → Book a slot → Join Jitsi session
 *  After session: Watch recording (HLS, 7-day expiry) → Leave review
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionStatus =
	| "SCHEDULED"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELLED";

export type AvailabilityType =
	| "ONLINE"
	| "OFFLINE"
	| "RECURRING_WEEKLY"
	| "ONE_TIME_SLOT";
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

export interface TeacherProfile {
	id: string;
	bio?: string;
	hourlyRate: number;
	timezone: string;
	videoUrl?: string;
	rating: number;
	totalSessions: number;
	totalReviews: number;
	isAvailable: boolean;
	responseTime?: number; // hours
	teacherId: string;
	teacher: {
		id: string;
		user: {
			id: string;
			name: string;
			image?: string;
			email: string;
		};
	};
	specializations: TeacherSpecialization[];
}

export interface TeacherAvailabilitySlot {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	category: "AVAILABLE" | "BLOCKED";
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
	startTime?: string | null;
	endTime?: string | null;
	isBooked: boolean;
	profileId: string;
}

export interface SessionRecording {
	id: string;
	status: "processing" | "ready" | "failed";
	masterPlaylistUrl?: string; // HLS m3u8
	thumbnailUrl?: string;
	duration?: number; // seconds
	fileSize?: number;
	downloadUrl?: string;
	isDownloadEnabled: boolean;
	downloadCount: number;
	expiresAt: string; // 7-day expiry
}

export interface OneToOneReview {
	id: string;
	rating: number;
	comment?: string;
	isPublic: boolean;
	response?: string;
	respondedAt?: string;
	student: { user: { name: string; image?: string } };
	createdAt: string;
}

export interface OneToOneSession {
	id: string;
	status: SessionStatus;
	topic?: string;
	notes?: string;
	scheduledAt: string;
	duration: number; // minutes
	timezone: string;
	// Jitsi
	jitsiRoomId: string;
	jitsiRoomToken?: string;
	jitsiStartUrl?: string;
	actualStartTime?: string;
	actualEndTime?: string;
	// Cancellation
	cancelledAt?: string;
	cancellationReason?: string;
	// Relations
	teacherAvailability: {
		id: string;
		startTime?: string;
		endTime?: string;
		specificDate?: string;
		specificStartTime?: string;
		specificEndTime?: string;
		profile: {
			id: string;
			hourlyRate: number;
			rating: number;
			teacher: {
				id: string;
				user: { name: string; image?: string; email: string };
			};
		};
	};
	recording?: SessionRecording;
	review?: OneToOneReview;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
	sessions: ["onetoone", "sessions"] as const,
	session: (id: string) => ["onetoone", "session", id] as const,
	teachers: (filters?: string) => ["onetoone", "teachers", filters] as const,
	teacherProfile: (id: string) =>
		["onetoone", "teacher", "profile", id] as const,
	teacherAvailability: (id: string) =>
		["onetoone", "teacher", "availability", id] as const,
	availableSlots: (id: string, range: string) =>
		["onetoone", "teacher", "slots", id, range] as const,
	teacherReviews: (id: string) =>
		["onetoone", "teacher", "reviews", id] as const,
	recording: (sessionId: string) =>
		["onetoone", "recording", sessionId] as const,
};

// ─── Teacher Search & Browse ──────────────────────────────────────────────────

/**
 * GET /onetoone/teachers
 * Search/filter teachers by subject, price range, availability
 *
 * Expected query params: subject?, minRate?, maxRate?, page?, limit?
 */
export function useGetTeachers(filters?: {
	subject?: string;
	minRate?: number;
	maxRate?: number;
	page?: number;
	limit?: number;
}) {
	const filterKey = JSON.stringify(filters ?? {});
	return useQuery({
		queryKey: KEYS.teachers(filterKey),
		queryFn: async (): Promise<{
			data: TeacherProfile[];
			pagination?: { total: number; page: number; totalPages: number };
		}> => {
			const res = await axiosInstance.get("/onetoone/teachers", {
				params: { ...filters, limit: filters?.limit ?? 20 },
			});
			return res.data;
		},
	});
}

/**
 * GET /onetoone/teachers/:teacherId/profile
 */
export function useGetTeacherProfile(teacherId?: string) {
	return useQuery({
		queryKey: KEYS.teacherProfile(teacherId ?? ""),
		queryFn: async (): Promise<{ data: TeacherProfile }> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${teacherId}/profile`,
			);
			return res.data;
		},
		enabled: !!teacherId,
	});
}

/**
 * GET /onetoone/teachers/:teacherId/availability
 * Returns all availability configurations (recurring + one-time)
 */
export function useGetTeacherAvailability(teacherId?: string) {
	return useQuery({
		queryKey: KEYS.teacherAvailability(teacherId ?? ""),
		queryFn: async (): Promise<{ data: TeacherAvailabilitySlot[] }> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${teacherId}/availability`,
			);
			return res.data;
		},
		enabled: !!teacherId,
	});
}

/**
 * GET /onetoone/teachers/:teacherId/available-slots
 * Returns bookable slots for a date range (backend expands recurring rules)
 *
 * Expected query params: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
export function useGetAvailableSlots(
	teacherId?: string,
	startDate?: string,
	endDate?: string,
) {
	const rangeKey = `${startDate}-${endDate}`;
	return useQuery({
		queryKey: KEYS.availableSlots(teacherId ?? "", rangeKey),
		queryFn: async (): Promise<{ data: TeacherAvailabilitySlot[] }> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${teacherId}/available-slots`,
				{ params: { startDate, endDate } },
			);
			return res.data;
		},
		enabled: !!teacherId && !!startDate && !!endDate,
	});
}

/**
 * GET /onetoone/teachers/:teacherId/reviews
 */
export function useGetTeacherReviews(teacherId?: string) {
	return useQuery({
		queryKey: KEYS.teacherReviews(teacherId ?? ""),
		queryFn: async (): Promise<{
			data: OneToOneReview[];
			pagination?: { total: number };
		}> => {
			const res = await axiosInstance.get(
				`/onetoone/teachers/${teacherId}/reviews`,
			);
			return res.data;
		},
		enabled: !!teacherId,
	});
}

// ─── Booking ──────────────────────────────────────────────────────────────────

/**
 * POST /onetoone/sessions/book
 * Body: { availabilityId, topic?, notes?, timezone }
 *
 * Backend creates the session + Jitsi room + payment record
 */
export function useBookSession() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (body: {
			availabilityId: string;
			topic?: string;
			notes?: string;
			timezone?: string;
		}) => {
			const res = await axiosInstance.post("/onetoone/sessions/book", body);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Session booked successfully!");
			qc.invalidateQueries({ queryKey: KEYS.sessions });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.message || "Booking failed");
		},
	});
}

// ─── Student Sessions ─────────────────────────────────────────────────────────

/**
 * GET /onetoone/sessions/my
 * Returns sessions for the authenticated student (uses JWT — no studentId needed).
 *
 * Backend should resolve the student from the auth token.
 * Falls back to GET /onetoone/sessions?studentId if /my is not implemented yet.
 */
export function useGetMyStudentSessions() {
	return useQuery({
		queryKey: [...KEYS.sessions, "my"],
		queryFn: async (): Promise<{
			data: OneToOneSession[];
			pagination: {
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			};
		}> => {
			const res = await axiosInstance.get("/onetoone/sessions/my", {
				params: {
					limit: 50,
					sortBy: "scheduledAt",
					orderBy: "desc",
				},
			});
			return res.data;
		},
	});
}

/**
 * GET /onetoone/sessions/:id
 */
export function useGetSession(sessionId?: string) {
	return useQuery({
		queryKey: KEYS.session(sessionId ?? ""),
		queryFn: async (): Promise<{ data: OneToOneSession }> => {
			const res = await axiosInstance.get(`/onetoone/sessions/${sessionId}`);
			return res.data;
		},
		enabled: !!sessionId,
	});
}

// ─── LiveKit Join ──────────────────────────────────────────────────────────────

export interface SessionJoinInfo {
	serverUrl: string;
	token: string;
	room: string;
	role: "HOST" | "GUEST";
	identity: string;
}

/**
 * GET /onetoone/sessions/:sessionId/join
 * Returns a short-lived LiveKit token scoped to the current user.
 * Only fetches on demand (enabled=false by default) — call refetch() when the
 * user clicks "Join".
 */
export function useGetSessionJoinInfo(sessionId?: string, enabled = false) {
	return useQuery({
		queryKey: ["onetoone", "join", sessionId ?? ""] as const,
		queryFn: async (): Promise<{ data: SessionJoinInfo }> => {
			const res = await axiosInstance.get(
				`/onetoone/sessions/${sessionId}/join`,
			);
			return res.data;
		},
		enabled: !!sessionId && enabled,
		staleTime: 0,
		gcTime: 0,
	});
}

// ─── Recording ────────────────────────────────────────────────────────────────

/**
 * GET /onetoone/sessions/:sessionId/recording
 * Returns HLS stream URL + download URL (7-day expiry)
 */
export function useGetSessionRecording(sessionId?: string) {
	return useQuery({
		queryKey: KEYS.recording(sessionId ?? ""),
		queryFn: async (): Promise<{ data: SessionRecording }> => {
			const res = await axiosInstance.get(
				`/onetoone/sessions/${sessionId}/recording`,
			);
			return res.data;
		},
		enabled: !!sessionId,
	});
}

// ─── Session Actions ──────────────────────────────────────────────────────────

/**
 * POST /onetoone/sessions/:id/cancel
 */
export function useCancelSession() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			sessionId,
			cancellationReason,
		}: {
			sessionId: string;
			cancellationReason?: string;
		}) => {
			const res = await axiosInstance.post(
				`/onetoone/sessions/${sessionId}/cancel`,
				{ reason: cancellationReason },
			);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Session cancelled");
			qc.invalidateQueries({ queryKey: KEYS.sessions });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.message || "Failed to cancel session");
		},
	});
}

/**
 * POST /onetoone/sessions/:sessionId/reviews
 */
export function useCreateSessionReview() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			sessionId,
			rating,
			comment,
		}: {
			sessionId: string;
			rating: number;
			comment?: string;
		}) => {
			const res = await axiosInstance.post(
				`/onetoone/sessions/${sessionId}/reviews`,
				{ rating, comment },
			);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Review submitted!");
			qc.invalidateQueries({ queryKey: KEYS.sessions });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.message || "Failed to submit review");
		},
	});
}

// ─── Admin: Session Lookup ────────────────────────────────────────────────────

/**
 * GET /onetoone/sessions?filters[studentId]=<id>
 * Admin use: fetch sessions for a specific studentId.
 * Returns empty when no studentId is provided (API requires it).
 */
export function useGetSessionsByStudent(
	studentId?: string,
	page = 1,
	limit = 20,
) {
	return useQuery({
		queryKey: ["onetoone", "admin-sessions", studentId, page, limit],
		queryFn: async (): Promise<{
			data: OneToOneSession[];
			pagination: {
				total: number;
				page: number;
				limit: number;
				totalPages: number;
			};
		}> => {
			if (!studentId)
				return {
					data: [],
					pagination: { total: 0, page: 1, limit, totalPages: 0 },
				};
			const res = await axiosInstance.get("/onetoone/sessions", {
				params: {
					page,
					limit,
					sortBy: "scheduledAt",
					orderBy: "desc",
					"filters[studentId]": studentId,
				},
			});
			return res.data;
		},
		enabled: !!studentId,
	});
}
