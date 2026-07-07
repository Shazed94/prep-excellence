// hooks/lms-Course.ts

// Course Schema (from your shared-validators)
import type {
	LMSCourseResponse,
	LMSLessonResponse,
	TcreateLMSCourseSchema,
	TcreateLMSLessonSchema,
	TcreateLMSModuleSchema,
} from "@prepexcellence/shared-validators";
import {
	createLMSLessonSchema,
	createLMSModuleSchema,
	updateLMSCourseSchema,
	updateLMSLessonSchema,
	updateLMSModuleSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios"; // your axios instance with interceptors

// ==================== CREATE COURSE ====================
export function useCreateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TcreateLMSCourseSchema) => {
			// If there's a thumbnail file, use FormData
			if (data.thumbnail && typeof data.thumbnail !== "string") {
				const formData = new FormData();

				// Add all text fields — field names match createLMSCourseSchema
				formData.append("title", data.title);
				formData.append("shortDescription", data.shortDescription);
				formData.append("longDescription", data.longDescription);
				formData.append("categoryId", data.categoryId);
				formData.append("teacherId", data.teacherId);
				formData.append("level", data.level);
				formData.append("price", String(data.price));

				// Add optional fields
				if (data.discount !== undefined && data.discount !== null) {
					formData.append("discount", String(data.discount));
				}
				if (data.duration !== undefined && data.duration !== null) {
					formData.append("duration", String(data.duration));
				}

				// Handle thumbnail file
				formData.append("thumbnail", data.thumbnail as any);

				// Add arrays as JSON strings (parseMultipartBody middleware parses them)
				formData.append("tags", JSON.stringify(data.tags ?? []));
				formData.append(
					"requirements",
					JSON.stringify(data.requirements ?? []),
				);
				formData.append(
					"whatYouLearn",
					JSON.stringify(data.whatYouLearn ?? []),
				);

				const res = await axiosInstance.post("/lms/courses", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				return res.data.data;
			} else {
				// No file upload, send as JSON
				const payload = {
					...data,
					tags: data.tags ?? [],
					requirements: data.requirements ?? [],
					whatYouLearn: data.whatYouLearn ?? [],
				};

				const res = await axiosInstance.post("/lms/courses", payload);
				return res.data.data;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			toast.success("Course created successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create course");
		},
	});
}

// ==================== GET ALL COURSES ====================
export function useGetCourses() {
	return useQuery({
		queryKey: ["courses"],
		queryFn: async () => {
			const res = await axiosInstance.get("/lms/courses");
			return res.data.data || res.data; // Extract data array
		},
	});
}

// ============ GET MY (TEACHER) COURSES — auth-scoped, incl. drafts ============
export function useGetMyLMSCourses() {
	return useQuery({
		queryKey: ["courses", "mine"],
		queryFn: async () => {
			const res = await axiosInstance.get("/lms/courses");
			// Return the full envelope { data: Course[], pagination } so callers
			// can read `.data` (overview) or the array directly (list page).
			return res.data;
		},
	});
}

// ==================== GET SINGLE COURSE ====================
// THIS IS THE SINGLE SOURCE OF TRUTH - includes modules and lessons
export function useGetCourse(courseId: string) {
	return useQuery<LMSCourseResponse>({
		queryKey: ["courses", courseId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/lms/courses/${courseId}`);
			return res.data.data || res.data;
		},
		enabled: !!courseId,
	});
}
// ==================== UPDATE COURSE ====================
export function useUpdateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ courseId, data }: { courseId: string; data: any }) => {
			// Validate against Zod update schema
			const validated = updateLMSCourseSchema.parse(data);
			const res = await axiosInstance.patch(
				`/lms/courses/${courseId}`,
				validated,
			);
			console.log("resssssss", res);
			return res.data.data || res.data; // Extract updated course
		},
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Course updated successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update course ");
		},
	});
}

// ==================== DELETE COURSE ====================
export function useDeleteCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (courseId: string) => {
			await axiosInstance.delete(`/lms/courses/${courseId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			toast.success("Course deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete course");
		},
	});
}

// ==================== PUBLISH COURSE ====================
export function usePublishCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			courseId,
			isPublished,
		}: {
			courseId: string;
			isPublished: boolean;
		}) => {
			const res = await axiosInstance.patch(
				`/lms/courses/${courseId}/publish`,
				{ isPublished },
			);
			return res.data.data || res.data; // Extract updated course
		},
		onSuccess: (data, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			const action = data?.isPublished ? "published" : "unpublished";
			toast.success(`Course ${action} successfully!`);
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update course status",
			);
		},
	});
}

export function useCreateModule() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			courseId,
			data,
		}: {
			courseId: string;
			data: Omit<TcreateLMSModuleSchema, "id" | "courseId">;
		}) => {
			// Validate against Zod schema with courseId
			const validated = createLMSModuleSchema.parse({
				...data,
				courseId,
			});

			const res = await axiosInstance.post(
				`/lms/courses/${courseId}/modules`,
				validated,
			);
			return res.data.data || res.data; // Extract created module
		},
		onSuccess: (_, { courseId }) => {
			// CRITICAL: Refetch the full course to get updated modules
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Module created successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create module");
		},
	});
}

export function useUpdateModule() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			moduleId,
			courseId: _courseId,
			data,
		}: {
			moduleId: string;
			courseId: string;
			data: Partial<Omit<TcreateLMSModuleSchema, "courseId">>;
		}) => {
			const validated = updateLMSModuleSchema.parse(data);
			const res = await axiosInstance.patch(
				`/lms/courses/modules/${moduleId}`,
				validated,
			);
			return res.data.data || res.data;
		},
		onSuccess: (_, { courseId: cId }) => {
			// CRITICAL: Refetch the full course to see updated module
			queryClient.invalidateQueries({ queryKey: ["courses", cId] });
			toast.success("Module updated successfully!");
		},
		onError: (error: any) => {
			console.error("Failed to update module:", error);
			toast.error("Failed to save module changes");
		},
	});
}

export function useDeleteModule() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			moduleId,
			courseId: _courseId,
		}: {
			moduleId: string;
			courseId: string;
		}) => {
			await axiosInstance.delete(`/lms/courses/modules/${moduleId}`);
		},
		onSuccess: (_, { courseId }) => {
			// CRITICAL: Refetch the full course
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Module deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete module");
		},
	});
}

export function useCreateLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			moduleId,
			courseId: _courseId,
			data,
		}: {
			moduleId: string;
			courseId: string;
			data: Omit<TcreateLMSLessonSchema, "id" | "moduleId">;
		}) => {
			// Validate against Zod schema with moduleId
			const validated = createLMSLessonSchema.parse({
				...data,
				moduleId,
			});

			const res = await axiosInstance.post(
				`/lms/courses/${moduleId}/lessons`,
				validated,
			);
			return res.data.data || res.data; // Extract created lesson
		},
		onSuccess: (_, { courseId }) => {
			// CRITICAL: Refetch the full course to see new lesson
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Lesson created successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create lesson");
		},
	});
}

export function useUpdateLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			lessonId,
			courseId: _courseId,
			data,
		}: {
			lessonId: string;
			courseId: string;
			data: Partial<Omit<TcreateLMSLessonSchema, "moduleId">>;
		}) => {
			// Validate against update schema (omits moduleId)
			const validated = updateLMSLessonSchema.parse(data);
			const res = await axiosInstance.patch(
				`/lms/courses/lessons/${lessonId}`,
				validated,
			);
			return res.data.data || res.data;
		},
		onSuccess: (_, { courseId }) => {
			// CRITICAL: Refetch the full course
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Lesson updated successfully!");
		},
		onError: (error: any) => {
			console.error("Failed to update lesson:", error);
			toast.error("Failed to save lesson changes");
		},
	});
}

export function useDeleteLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			lessonId,
			courseId: _courseId,
		}: {
			lessonId: string;
			courseId: string;
		}) => {
			await axiosInstance.delete(`/lms/courses/lessons/${lessonId}`);
		},
		onSuccess: (_, { courseId }) => {
			// CRITICAL: Refetch the full course
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Lesson deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete lesson");
		},
	});
}

export function useUploadLessonVideo() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			lessonId,
			courseId: _courseId,
			file,
		}: {
			lessonId: string;
			courseId: string;
			file: File;
		}) => {
			const formData = new FormData();
			formData.append("video", file);
			const res = await axiosInstance.post(
				`/lms/lessons/${lessonId}/upload-video`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);
			return res.data.data || res.data; // Extract upload result
		},
		onSuccess: (_, { courseId }) => {
			// CRITICAL: Refetch the full course to see video status
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Video uploaded successfully! Encoding in progress...");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to upload video");
		},
	});
}

// ==================== CHECK VIDEO ENCODING STATUS ====================
// Poll for video encoding status (called periodically after upload)
export function useCheckVideoEncodingStatus(
	courseId: string,
	lessonId: string | null,
	enabled: boolean = false,
) {
	return useQuery<LMSLessonResponse>({
		queryKey: ["lesson-encoding", lessonId],
		queryFn: async () => {
			if (!lessonId) throw new Error("No lesson ID");
			const res = await axiosInstance.get(`/lms/courses/lessons/${lessonId}`);
			return res.data.data || res.data;
		},
		enabled: enabled && !!lessonId && !!courseId,
		refetchInterval: (query) => {
			// Poll every 3 seconds if encoding is in progress
			const data = query.state.data;
			if (
				data?.videoEncodingStatus === "PROCESSING" ||
				data?.videoEncodingStatus === "PENDING"
			) {
				return 3000;
			}
			// Stop polling if completed or failed
			return false;
		},
	});
}

// ==================== DEPRECATED HOOKS ====================
// These hooks are kept for backward compatibility but should not be used in new code
// Use useGetCourse instead - it returns the full course with modules and lessons

/**
 * @deprecated Use useGetCourse instead - it includes all modules
 * Helper function kept for backward compatibility
 */
export function useGetModulesDeprecated(courseId: string) {
	const courseQuery = useGetCourse(courseId);
	return {
		...courseQuery,
		data: courseQuery.data?.courseModules || [],
	};
}

/**
 * @deprecated Use useGetCourse instead - it includes all lessons in modules
 * Kept for backward compatibility
 */
export function useGetLessonsDeprecated(moduleId: string) {
	return useQuery({
		queryKey: ["lessons", moduleId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/lms/courses/${moduleId}/lessons`);
			return res.data.data || res.data;
		},
		enabled: !!moduleId,
	});
}
