/**
 * Phase 3 – Coaching Management System
 * API base: /coaching
 *
 * Data flow:
 *   CoachingEnrollment → CoachingCourse → CoachingModule[] → CoachingTopic[] → CoachingContent[]
 *
 * Content types: VIDEO | LIVE | ASSIGNMENT | READING | QUIZ
 * Module locking: unlockAtPercent compared to enrollment.progressPercent (payment-based)
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentType = "VIDEO" | "LIVE" | "ASSIGNMENT" | "READING" | "QUIZ";
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface CoachingCategory {
	id: string;
	name: string;
	description?: string;
}

export interface CoachingCourse {
	id: string;
	title: string;
	slug: string;
	sortDescription: string;
	longDescription: string;
	thumbnail?: string;
	video?: string;
	regular_price: number;
	offer_price: number;
	level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	duration?: number; // weeks
	capacity?: number;
	startDate?: string;
	endDate?: string;
	schedule: Record<string, unknown>;
	isPublished: boolean;
	category?: CoachingCategory;
	tags: string[];
	modules?: CoachingModule[];
	_count?: { enrollments: number };
}

export interface CoachingModule {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	unlockAtPercent: number; // 0, 25, 50, 75, 100 — payment gate
	courseId: string;
	instructor?: { id: string; user: { name: string; image?: string } };
	topics?: CoachingTopic[];
}

export interface CoachingTopic {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	moduleId: string;
	contents?: CoachingContent[];
}

export interface CoachingContent {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	contentType: ContentType;
	topicId: string;

	// VIDEO / LIVE
	scheduledAt?: string;
	duration?: number; // minutes
	jitsiRoomId?: string;
	jitsiRoomToken?: string;
	jitsiStartUrl?: string;
	actualStartTime?: string;
	actualEndTime?: string;
	recordingUrl?: string;
	masterPlaylistUrl?: string; // HLS streaming
	thumbnailUrl?: string;
	videoStatus?: "uploading" | "processing" | "ready" | "failed";

	// READING
	content?: string;
	attachments?: string[];

	// ASSIGNMENT / QUIZ
	assignmentData?: Record<string, unknown>;
	quizData?: Record<string, unknown>;
	dueDate?: string;
	totalPoints?: number;
	passingScore?: number;

	// Student progress for this content
	progress?: CoachingContentProgress;
}

export interface CoachingContentProgress {
	id: string;
	isCompleted: boolean;
	completedAt?: string;
	score?: number;
	grade?: string;
	feedback?: string;
}

export interface CoachingEnrollment {
	id: string;
	status: EnrollmentStatus;
	enrolledAt: string;
	completedAt?: string;
	progressPercent: number;
	certificateUrl?: string;
	lastAccessedAt?: string;
	courseId: string;
	course: CoachingCourse;
}

export interface CoachingSubmission {
	id: string;
	submittedAt: string;
	fileUrls: string[];
	textAnswer?: string;
	score?: number;
	grade?: string;
	feedback?: string;
	gradedAt?: string;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
	enrollments: ["coaching", "enrollments"] as const,
	course: (id: string) => ["coaching", "course", id] as const,
	modules: (courseId: string) => ["coaching", "modules", courseId] as const,
	topics: (moduleId: string) => ["coaching", "topics", moduleId] as const,
	contents: (topicId: string) => ["coaching", "contents", topicId] as const,
	submissions: (contentId: string) =>
		["coaching", "submissions", contentId] as const,
};

// ─── Enrollment ───────────────────────────────────────────────────────────────

/**
 * GET /coaching/enrollments
 * Returns all coaching enrollments for the authenticated student (with course data)
 */
export function useGetMyCoachingEnrollments() {
	return useQuery({
		queryKey: KEYS.enrollments,
		queryFn: async (): Promise<{ data: CoachingEnrollment[] }> => {
			const res = await axiosInstance.get("/coaching/enrollments");
			return res.data;
		},
	});
}

// ─── Course ───────────────────────────────────────────────────────────────────

/**
 * GET /coaching/courses/:id
 */
export function useGetCoachingCourse(courseId?: string) {
	return useQuery({
		queryKey: KEYS.course(courseId ?? ""),
		queryFn: async (): Promise<{ data: CoachingCourse }> => {
			const res = await axiosInstance.get(`/coaching/courses/${courseId}`);
			return res.data;
		},
		enabled: !!courseId,
	});
}

// ─── Modules ──────────────────────────────────────────────────────────────────

/**
 * GET /coaching/courses/:courseId/modules
 * Returns modules ordered by orderIndex, each with instructor info
 */
export function useGetCourseModules(courseId?: string) {
	return useQuery({
		queryKey: KEYS.modules(courseId ?? ""),
		queryFn: async (): Promise<{ data: CoachingModule[] }> => {
			const res = await axiosInstance.get(
				`/coaching/courses/${courseId}/modules`,
			);
			return res.data;
		},
		enabled: !!courseId,
	});
}

// ─── Topics ───────────────────────────────────────────────────────────────────

/**
 * GET /coaching/modules/:moduleId/topics
 */
export function useGetModuleTopics(moduleId?: string) {
	return useQuery({
		queryKey: KEYS.topics(moduleId ?? ""),
		queryFn: async (): Promise<{ data: CoachingTopic[] }> => {
			const res = await axiosInstance.get(
				`/coaching/modules/${moduleId}/topics`,
			);
			return res.data;
		},
		enabled: !!moduleId,
	});
}

// ─── Contents ─────────────────────────────────────────────────────────────────

/**
 * GET /coaching/topics/:topicId/contents
 * Each content includes the student's progress record if available
 */
export function useGetTopicContents(topicId?: string) {
	return useQuery({
		queryKey: KEYS.contents(topicId ?? ""),
		queryFn: async (): Promise<{ data: CoachingContent[] }> => {
			const res = await axiosInstance.get(
				`/coaching/topics/${topicId}/contents`,
			);
			return res.data;
		},
		enabled: !!topicId,
	});
}

// ─── Submissions ──────────────────────────────────────────────────────────────

/**
 * GET /coaching/contents/:contentId/submissions
 */
export function useGetMySubmissions(contentId?: string) {
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
 * POST /coaching/contents/:contentId/submissions
 * Body: { submissionData: object, attachments?: string[], textAnswer?: string }
 */
export function useSubmitAssignment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			contentId,
			textAnswer,
			fileUrls,
			submissionData,
		}: {
			contentId: string;
			textAnswer?: string;
			fileUrls?: string[];
			submissionData?: Record<string, unknown>;
		}) => {
			const res = await axiosInstance.post(
				`/coaching/contents/${contentId}/submissions`,
				{ textAnswer, fileUrls, submissionData },
			);
			return res.data;
		},
		onSuccess: (_data, vars) => {
			qc.invalidateQueries({ queryKey: KEYS.submissions(vars.contentId) });
			qc.invalidateQueries({ queryKey: KEYS.enrollments });
		},
	});
}

// ─── Attendance ───────────────────────────────────────────────────────────────

/**
 * POST /coaching/contents/:contentId/attendance
 * Body: { joinTime?: string, leaveTime?: string }
 * Call when student joins/leaves a live session
 */
export function useRecordAttendance() {
	return useMutation({
		mutationFn: async ({
			contentId,
			joinTime,
			leaveTime,
		}: {
			contentId: string;
			joinTime?: string;
			leaveTime?: string;
		}) => {
			const res = await axiosInstance.post(
				`/coaching/contents/${contentId}/attendance`,
				{ joinTime, leaveTime },
			);
			return res.data;
		},
	});
}

// ─── Published courses (for browsing) ────────────────────────────────────────

/**
 * GET /coaching/courses/published
 * For a browse page — not auth-gated
 */
export function useGetPublishedCoachingCourses() {
	return useQuery({
		queryKey: ["coaching", "courses", "published"],
		queryFn: async (): Promise<{ data: CoachingCourse[] }> => {
			const res = await axiosInstance.get("/coaching/courses/published");
			return res.data;
		},
	});
}
