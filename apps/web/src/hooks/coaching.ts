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

import type {
	CoachingContent,
	CoachingCourse,
	CoachingEnrollment,
	CoachingModule,
	CoachingSubmission,
	CoachingTopic,
} from "@prepexcellence/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

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
			files,
		}: {
			contentId: string;
			textAnswer?: string;
			files?: File[];
		}) => {
			// Multipart upload to the real assignment-submit endpoint. `contentId`
			// is the assignment id for assignment-type content.
			const fd = new FormData();
			if (textAnswer) fd.append("textAnswer", textAnswer);
			for (const f of files ?? []) fd.append("files", f);

			const res = await axiosInstance.post(
				`/coaching/assignments/${contentId}/submit`,
				fd,
				{ headers: { "Content-Type": "multipart/form-data" } },
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
