// hooks/lms-Course.ts
"use client";

// Course Schema (from your shared-validators)
import type {
	TcreateLMSCourseSchema,
	TcreateLMSLessonSchema,
	TcreateLMSModuleSchema,
} from "@prepexcellence/shared-validators";
import {
	createLMSCourseSchema,
	createLMSLessonSchema,
	createLMSModuleSchema,
	updateLMSCourseSchema,
	updateLMSLessonSchema,
	updateLMSModuleSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios"; // your axios instance with interceptors

// ==================== CREATE COURSE ====================
export function useCreateCourse() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (data: TcreateLMSCourseSchema) => {
			// Validate against Zod schema
			const validated = createLMSCourseSchema.parse(data);

			const formData = new FormData();

			// Add all text fields
			formData.append("title", validated.title);
			formData.append("description", validated.description);
			formData.append("category", validated.category);
			formData.append("level", validated.level);
			formData.append("instructorId", validated.instructorId);
			formData.append("price", String(validated.price));

			// Add optional fields
			if (validated.discount !== undefined) {
				formData.append("discount", String(validated.discount));
			}
			if (validated.duration !== undefined) {
				formData.append("duration", String(validated.duration));
			}
			if (validated.thumbnail) {
				formData.append("thumbnail", validated.thumbnail);
			}

			// Add arrays
			if (validated.tags.length > 0) {
				formData.append("tags", JSON.stringify(validated.tags));
			}
			if (validated.requirements.length > 0) {
				formData.append("requirements", JSON.stringify(validated.requirements));
			}
			if (validated.whatYouLearn.length > 0) {
				formData.append("whatYouLearn", JSON.stringify(validated.whatYouLearn));
			}

			const res = await axiosInstance.post("/courses", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			return res.data;
		},
		onSuccess: (newCourse) => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			toast.success("Course created successfully!");
			router.navigate({
				to: `/dashboard/instructor-portal/courses/${newCourse.id}`,
			});
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
			const res = await axiosInstance.get("/courses");
			return res.data;
		},
	});
}

// ==================== GET SINGLE COURSE ====================
export function useGetCourse(courseId: string) {
	return useQuery({
		queryKey: ["courses", courseId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/courses/${courseId}`);
			return res.data;
		},
		enabled: !!courseId,
	});
}

// ==================== UPDATE COURSE ====================
export function useUpdateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			courseId,
			data,
		}: {
			courseId: string;
			data: Partial<TcreateLMSCourseSchema>;
		}) => {
			// Validate against Zod update schema
			const validated = updateLMSCourseSchema.parse(data);
			const res = await axiosInstance.patch(`/courses/${courseId}`, validated);
			return res.data;
		},
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Course updated successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update course");
		},
	});
}

// ==================== DELETE COURSE ====================
export function useDeleteCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (courseId: string) => {
			await axiosInstance.delete(`/courses/${courseId}`);
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
		mutationFn: async (courseId: string) => {
			await axiosInstance.patch(`/courses/${courseId}/publish`);
		},
		onSuccess: (_, courseId) => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Course published successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to publish course");
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
				`/courses/${courseId}/modules`,
				validated,
			);
			return res.data;
		},
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
			toast.success("Module created successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create module");
		},
	});
}

export function useGetModules(courseId: string) {
	return useQuery({
		queryKey: ["modules", courseId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/courses/${courseId}/modules`);
			return res.data;
		},
		enabled: !!courseId,
	});
}

export function useUpdateModule() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			moduleId,
			courseId,
			data,
		}: {
			moduleId: string;
			courseId: string;
			data: Partial<Omit<TcreateLMSModuleSchema, "courseId">>;
		}) => {
			const validated = updateLMSModuleSchema.parse(data);
			const res = await axiosInstance.patch(`/modules/${moduleId}`, validated);
			return res.data;
		},
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
			toast.success("Module updated successfully!");
		},
	});
}

export function useDeleteModule() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (moduleId: string) => {
			await axiosInstance.delete(`/modules/${moduleId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["modules"] });
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
			data,
		}: {
			moduleId: string;
			data: Omit<TcreateLMSLessonSchema, "id" | "moduleId">;
		}) => {
			// Validate against Zod schema with moduleId
			const validated = createLMSLessonSchema.parse({
				...data,
				moduleId,
			});

			const res = await axiosInstance.post(
				`/modules/${moduleId}/lessons`,
				validated,
			);
			return res.data;
		},
		onSuccess: (_, { moduleId }) => {
			queryClient.invalidateQueries({ queryKey: ["lessons", moduleId] });
			queryClient.invalidateQueries({ queryKey: ["modules"] });
			toast.success("Lesson created successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create lesson");
		},
	});
}

export function useGetLessons(moduleId: string) {
	return useQuery({
		queryKey: ["lessons", moduleId],
		queryFn: async () => {
			const res = await axiosInstance.get(`/modules/${moduleId}/lessons`);
			return res.data;
		},
		enabled: !!moduleId,
	});
}

export function useUpdateLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			lessonId,
			data,
		}: {
			lessonId: string;
			data: Partial<Omit<TcreateLMSLessonSchema, "moduleId">>;
		}) => {
			// Validate against update schema (omits moduleId)
			const validated = updateLMSLessonSchema.parse(data);
			const res = await axiosInstance.patch(`/lessons/${lessonId}`, validated);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			toast.success("Lesson updated successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update lesson");
		},
	});
}

export function useDeleteLesson() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (lessonId: string) => {
			await axiosInstance.delete(`/lessons/${lessonId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
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
			file,
		}: {
			lessonId: string;
			file: File;
		}) => {
			const formData = new FormData();
			formData.append("video", file);
			const res = await axiosInstance.post(
				`/lessons/${lessonId}/upload-video`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			toast.success("Video uploaded successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to upload video");
		},
	});
}
