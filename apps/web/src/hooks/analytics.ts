import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/**
 * Dashboard summary hooks (backend: /teacher|student/analytics/summary).
 * Single-request replacements for the multi-call client-side stat computation
 * on the overview pages. Adopt incrementally.
 */

export interface TeacherSummary {
	lmsCourseCount: number;
	coachingCourseCount: number;
	upcomingSessions: number;
	completedSessions: number;
	avgRating: number;
	totalReviews: number;
}

export interface StudentSummary {
	activeLmsEnrollments: number;
	activeCoachingEnrollments: number;
	upcomingSessions: number;
	completedSessions: number;
	satAttempts: number;
	avgSatScore: number;
}

export function useTeacherSummary() {
	return useQuery({
		queryKey: ["analytics", "teacher", "summary"],
		queryFn: async (): Promise<{ data: TeacherSummary }> => {
			const res = await axiosInstance.get("/teacher/analytics/summary");
			return res.data;
		},
	});
}

export function useStudentSummary() {
	return useQuery({
		queryKey: ["analytics", "student", "summary"],
		queryFn: async (): Promise<{ data: StudentSummary }> => {
			const res = await axiosInstance.get("/student/analytics/summary");
			return res.data;
		},
	});
}
