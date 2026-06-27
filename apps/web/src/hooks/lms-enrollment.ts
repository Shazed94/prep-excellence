// hooks/lms-enrollment.ts
// LMS Enrollment + Progress hooks for the Student Dashboard

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LMSEnrollment {
	id: string;
	status: "ACTIVE" | "COMPLETED" | "CANCELLED";
	progress: number;
	enrolledAt: string;
	completedAt: string | null;
	course: {
		id: string;
		title: string;
		thumbnail: string | null;
		level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
		instructor: {
			user: { name: string; image: string | null };
		} | null;
	};
}

export interface LMSLessonProgress {
	id: string;
	lessonId: string;
	enrollmentId: string;
	isCompleted: boolean;
	completionPercent: number;
	watchTime: number;
	completedAt: string | null;
}

export interface LMSEnrollmentProgress {
	enrollment: {
		id: string;
		progress: number;
		status: string;
	};
	lessons: LMSLessonProgress[];
	totalLessons: number;
	completedLessons: number;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Get all LMS enrollments for the authenticated student.
 * Requires studentId — fetched automatically from /students/me first.
 */
export function useGetMyLMSEnrollments(studentId?: string) {
	return useQuery({
		queryKey: ["lms", "enrollments", studentId],
		queryFn: async () => {
			const res = await axiosInstance.get("/lms/enrollments", {
				params: {
					filters: { studentId },
					limit: 100,
				},
			});
			return res.data;
		},
		enabled: !!studentId,
	});
}

/**
 * Get detailed progress for a single enrollment.
 * GET /lms/progress/:enrollmentId
 */
export function useGetEnrollmentProgress(enrollmentId?: string) {
	return useQuery({
		queryKey: ["lms", "progress", enrollmentId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/lms/progress/${enrollmentId}`);
			return res.data.data as LMSEnrollmentProgress;
		},
		enabled: !!enrollmentId,
	});
}

/**
 * Get progress for a single lesson inside an enrollment.
 * GET /lms/progress/:enrollmentId/lessons/:lessonId
 */
export function useGetLessonProgress(enrollmentId?: string, lessonId?: string) {
	return useQuery({
		queryKey: ["lms", "progress", enrollmentId, "lesson", lessonId],
		queryFn: async () => {
			const res = await axiosInstance.get(
				`/lms/progress/${enrollmentId}/lessons/${lessonId}`,
			);
			return res.data.data as LMSLessonProgress;
		},
		enabled: !!enrollmentId && !!lessonId,
	});
}

/**
 * Mark a lesson as watched / update watch time.
 * PATCH /lms/progress/:enrollmentId/lessons/:lessonId
 */
export function useUpdateLessonProgress() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			enrollmentId,
			lessonId,
			completionPercent,
			isCompleted,
			watchTime,
		}: {
			enrollmentId: string;
			lessonId: string;
			completionPercent?: number;
			isCompleted?: boolean;
			watchTime?: number;
		}) => {
			const res = await axiosInstance.patch(
				`/lms/progress/${enrollmentId}/lessons/${lessonId}`,
				{ completionPercent, isCompleted, watchTime },
			);
			return res.data;
		},
		onSuccess: (_data, vars) => {
			queryClient.invalidateQueries({
				queryKey: ["lms", "progress", vars.enrollmentId],
			});
		},
		onError: () => {
			toast.error("Failed to update progress");
		},
	});
}

/**
 * Get a single LMS course with all modules, topics, and lessons.
 * GET /lms/courses/:courseId
 */
export function useGetLMSCourseForStudent(courseId?: string) {
	return useQuery({
		queryKey: ["lms", "courses", courseId, "student"],
		queryFn: async () => {
			const res = await axiosInstance.get(`/lms/courses/${courseId}`);
			return res.data.data;
		},
		enabled: !!courseId,
	});
}
