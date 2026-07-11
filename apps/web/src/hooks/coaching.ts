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
export type { CoachingCourse };

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type AxiosError, isAxiosError } from "axios";
import { toast } from "sonner";
import type { CoachingAssignmentFormValues } from "@/lib/assignment-schema";
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

export function useGetMyCoachingCourses() {
	return useQuery({
		queryKey: ["coaching", "my-courses"] as const,
		queryFn: async (): Promise<{ data: CoachingCourse[] }> => {
			const res = await axiosInstance.get("/coaching/courses/my-courses");
			return res.data;
		},
	});
}

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
// export function useGetPublishedCoachingCourses() {
// 	return useQuery({
// 		queryKey: ["coaching", "courses", "published"],
// 		queryFn: async (): Promise<{ data: CoachingCourse[] }> => {
// 			const res = await axiosInstance.get("/coaching/courses/published");
// 			return res.data;
// 		},
// 	});
// }

const ATTACHMENTS_KEY = (lessonId: string) =>
	["coaching", "lessons", lessonId, "attachments"] as const;

export interface LessonAttachmentItem {
	title: string;
	file: File;
}

export function useAddLessonAttachments(lessonId?: string) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (items: LessonAttachmentItem[]) => {
			if (!lessonId) throw new Error("Missing lessonId");

			const fd = new FormData();
			items.forEach((item) => {
				fd.append(`titles`, item.title);
				fd.append(`files`, item.file);
			});

			const res = await axiosInstance.post(
				`/coaching/courses/lessons/${lessonId}/attachments`,

				fd,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			return res.data;
		},
		onSuccess: () => {
			if (lessonId) {
				qc.invalidateQueries({ queryKey: ATTACHMENTS_KEY(lessonId) });
			}
			qc.invalidateQueries({ queryKey: ["coaching-course"] });
			toast.success("Reading material added successfully");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? (error.response?.data?.message ?? "Failed to add reading material")
				: "Failed to add reading material";
			toast.error(message);
		},
	});
}

export function useGetLessonAttachments(lessonId?: string) {
	return useQuery({
		queryKey: ATTACHMENTS_KEY(lessonId ?? ""),
		queryFn: async (): Promise<{ data: any[] }> => {
			const res = await axiosInstance.get(
				`/coaching/courses/lessons/${lessonId}/attachments`,
			);
			return res.data;
		},
		enabled: !!lessonId,
	});
}

export function useDeleteLessonAttachment(lessonId?: string) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (attachmentId: string) => {
			if (!lessonId) throw new Error("Missing lessonId");
			const res = await axiosInstance.delete(
				`/coaching/courses/lessons/${lessonId}/attachments/${attachmentId}`,
			);
			return res.data;
		},
		onSuccess: () => {
			if (lessonId) {
				qc.invalidateQueries({ queryKey: ATTACHMENTS_KEY(lessonId) });
			}
			qc.invalidateQueries({ queryKey: ["coaching-course"] });
			toast.success("Reading material deleted");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? (error.response?.data?.message ?? "Failed to delete")
				: "Failed to delete";
			toast.error(message);
		},
	});
}

// ─── Live Class ──────────────────────────────────────────────────────────────

/**
 * POST /coaching/courses/lessons/:lessonId/live-class
 * Create or update a live class for a lesson
 */
export function useCreateLiveClass(lessonId?: string) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (data: Record<string, any>) => {
			if (!lessonId) throw new Error("Missing lessonId");
			const res = await axiosInstance.post(
				`/coaching/courses/lessons/${lessonId}/live-class`,
				data,
			);
			return res.data;
		},
		onSuccess: () => {
			if (lessonId) {
				qc.invalidateQueries({ queryKey: ["live-class", lessonId] });
			}
			toast.success("Live class saved successfully");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? (error.response?.data?.message ?? "Failed to save live class")
				: "Failed to save live class";
			toast.error(message);
		},
	});
}

/**
 * GET /coaching/courses/lessons/:lessonId/live-class
 * Fetch existing live class data
 */
export function useGetLiveClass(lessonId?: string) {
	return useQuery({
		queryKey: ["live-class", lessonId ?? ""],
		queryFn: async (): Promise<{ data: any }> => {
			const res = await axiosInstance.get(
				`/coaching/courses/lessons/${lessonId}/live-class`,
			);
			return res.data;
		},
		enabled: !!lessonId,
	});
}

interface CreateAssignmentResponse {
	id: string;
	[key: string]: unknown;
}

interface ApiErrorResponse {
	message?: string;
}

export function useCreateAssignment(lessonId?: string) {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation<
		CreateAssignmentResponse,
		AxiosError<ApiErrorResponse>,
		CoachingAssignmentFormValues
	>({
		mutationFn: async (values) => {
			if (!lessonId) {
				throw new Error("lessonId is required to create an assignment");
			}

			const res = await axiosInstance.post(`/coaching/assignments`, {
				...values,
				lessonId,
				dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
			});

			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lesson-assignments", lessonId],
			});
			queryClient.invalidateQueries({
				queryKey: ["coaching-course"],
			});
			toast.success("Assignment created");
			navigate({
				to: "/dashboard/coaching-management/create",
				search: { tab: "modules" },
			});
		},
	});
}

/**
 * GET /coaching/assignments/lessons/:lessonId/assignment
 * Fetch existing assignment for a lesson
 */
export function useGetAssignmentByLesson(lessonId?: string) {
	return useQuery({
		queryKey: ["lesson-assignments", lessonId ?? ""],
		queryFn: async (): Promise<{ data: any }> => {
			const res = await axiosInstance.get(
				`/coaching/assignments/lessons/${lessonId}/assignment`,
			);
			return res.data;
		},
		enabled: !!lessonId,
	});
}

/**
 * PATCH /coaching/assignments/:id
 * Update an existing assignment
 */
export function useUpdateAssignment(assignmentId?: string) {
	const qc = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: async (values: CoachingAssignmentFormValues) => {
			if (!assignmentId) throw new Error("Missing assignmentId");
			const res = await axiosInstance.patch(
				`/coaching/assignments/${assignmentId}`,
				{
					...values,
					dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
				},
			);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["lesson-assignments"] });
			qc.invalidateQueries({ queryKey: ["coaching-course"] });
			toast.success("Assignment updated");
			navigate({
				to: "/dashboard/coaching-management/create",
				search: { tab: "modules" },
			});
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? (error.response?.data?.message ?? "Failed to update assignment")
				: "Failed to update assignment";
			toast.error(message);
		},
	});
}

// ─── Exam ────────────────────────────────────────────────────────────────────

/**
 * POST /coaching/exams
 * Create a new exam for a lesson
 */
export function useCreateExam() {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async ({
			lessonId,
			...data
		}: {
			lessonId: string;
			title: string;
			description?: string;
			passingScore?: number;
			timeLimit?: number;
			maxAttempts?: number;
			shuffleQuestions?: boolean;
			showResults?: boolean;
		}) => {
			const res = await axiosInstance.post(`/coaching/exams`, data, {
				params: { lessonId },
			});
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["lesson-exams"] });
			toast.success("Exam saved successfully");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? (error.response?.data?.message ?? "Failed to save exam")
				: "Failed to save exam";
			toast.error(message);
		},
	});
}

/**
 * GET /coaching/exams/lessons/:lessonId/exam
 * Fetch existing exam for a lesson
 */
export function useGetExamByLesson(lessonId?: string) {
	return useQuery({
		queryKey: ["lesson-exams", lessonId ?? ""],
		queryFn: async (): Promise<{ data: any }> => {
			const res = await axiosInstance.get(
				`/coaching/exams/lessons/${lessonId}/exam`,
			);
			return res.data;
		},
		enabled: !!lessonId,
	});
}

/**
 * PATCH /coaching/exams/:id
 * Update an existing exam
 */
export function useUpdateExam(examId?: string) {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: async (data: Record<string, any>) => {
			if (!examId) throw new Error("Missing examId");
			const res = await axiosInstance.patch(`/coaching/exams/${examId}`, data);
			return res.data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["lesson-exams"] });
			toast.success("Exam updated successfully");
		},
		onError: (error) => {
			const message = isAxiosError(error)
				? (error.response?.data?.message ?? "Failed to update exam")
				: "Failed to update exam";
			toast.error(message);
		},
	});
}
