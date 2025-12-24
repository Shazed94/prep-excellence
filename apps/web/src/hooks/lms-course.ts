// hooks/lms-Course.ts
"use client";

// Course Schema (from your shared-validators)
import type {
	TcreateLMSCourseSchema,
	TcreateLMSLessonSchema,
	TcreateLMSModuleSchema,
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
			const res = await axiosInstance.post("/courses", data, {
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
			const res = await axiosInstance.patch(`/courses/${courseId}`, data);
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
			data: Omit<TcreateLMSModuleSchema, "id">;
		}) => {
			const res = await axiosInstance.post(
				`/courses/${courseId}/modules`,
				data,
			);
			return res.data;
		},
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
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
			data,
		}: {
			moduleId: string;
			data: Partial<TcreateLMSModuleSchema>;
		}) => {
			const res = await axiosInstance.patch(`/modules/${moduleId}`, data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["modules"] });
			toast.success("Module updated successfully!");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update module");
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
			data: Omit<TcreateLMSLessonSchema, "id">;
		}) => {
			const res = await axiosInstance.post(
				`/modules/${moduleId}/lessons`,
				data,
			);
			return res.data;
		},
		onSuccess: (_, { moduleId }) => {
			queryClient.invalidateQueries({ queryKey: ["lessons", moduleId] });
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
			data: Partial<TcreateLMSLessonSchema>;
		}) => {
			const res = await axiosInstance.patch(`/lessons/${lessonId}`, data);
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

// // hooks/lms-Course.ts
// "use client";

// import type {
// 	TcreateLMSCourseSchema,
// 	TcreateLMSLessonSchema,
// 	TcreateLMSModuleSchema,
// } from "@prepexcellence/shared-validators";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "@tanstack/react-router";
// import { toast } from "sonner";
// import axiosInstance from "@/lib/axios";

// // ==================== CREATE COURSE WITH MODULES & LESSONS ====================
// export function useCreateFullCourse() {
// 	const queryClient = useQueryClient();
// 	const router = useRouter();

// 	return useMutation({
// 		mutationFn: async (data: {
// 			course: Omit<TcreateLMSCourseSchema, "id">;
// 			modules: Array<
// 				Omit<TcreateLMSModuleSchema, "id" | "courseId"> & {
// 					lessons: Array<Omit<TcreateLMSLessonSchema, "id" | "moduleId">>;
// 				}
// 			>;
// 			thumbnailFile?: File | null;
// 			lessonVideos?: { [lessonTempId: string]: File };
// 			lessonAttachments?: { [lessonTempId: string]: File[] };
// 		}) => {
// 			// Step 1: Create FormData for course with thumbnail
// 			const formData = new FormData();

// 			// Add course basic fields
// 			formData.append("title", data.course.title);
// 			formData.append("slug", data.course.slug);
// 			formData.append("description", data.course.description);
// 			formData.append("instructorId", data.course.instructorId);
// 			formData.append("price", data.course.price.toString());

// 			if (data.course.discount !== undefined) {
// 				formData.append("discount", data.course.discount.toString());
// 			}

// 			formData.append("level", data.course.level);

// 			if (data.course.duration !== undefined) {
// 				formData.append("duration", data.course.duration.toString());
// 			}

// 			formData.append("category", data.course.category);
// 			formData.append("tags", JSON.stringify(data.course.tags));
// 			formData.append("requirements", JSON.stringify(data.course.requirements));
// 			formData.append("whatYouLearn", JSON.stringify(data.course.whatYouLearn));

// 			// Add thumbnail file
// 			if (data.thumbnailFile) {
// 				formData.append("thumbnail", data.thumbnailFile);
// 			}

// 			// Step 2: Create course
// 			const courseRes = await axiosInstance.post("/courses", formData, {
// 				headers: { "Content-Type": "multipart/form-data" },
// 			});

// 			const createdCourse = courseRes.data;
// 			const courseId = createdCourse.id;

// 			// Step 3: Create modules with lessons
// 			const createdModules = [];

// 			for (const moduleData of data.modules) {
// 				const { lessons, ...moduleFields } = moduleData;

// 				// Create module
// 				const moduleRes = await axiosInstance.post(
// 					`/courses/${courseId}/modules`,
// 					moduleFields,
// 				);
// 				const createdModule = moduleRes.data;
// 				createdModules.push(createdModule);

// 				// Step 4: Create lessons for this module
// 				for (const lessonData of lessons) {
// 					const lessonRes = await axiosInstance.post(
// 						`/modules/${createdModule.id}/lessons`,
// 						lessonData,
// 					);
// 					const createdLesson = lessonRes.data;

// 					// Step 5: Upload video if exists
// 					if (
// 						data.lessonVideos &&
// 						data.lessonVideos[lessonData.tempId as any]
// 					) {
// 						const videoFile = data.lessonVideos[lessonData.tempId as any];
// 						const videoFormData = new FormData();
// 						videoFormData.append("video", videoFile);

// 						await axiosInstance.post(
// 							`/lessons/${createdLesson.id}/upload-video`,
// 							videoFormData,
// 							{
// 								headers: { "Content-Type": "multipart/form-data" },
// 							},
// 						);
// 					}

// 					// Step 6: Upload attachments if exist
// 					if (
// 						data.lessonAttachments &&
// 						data.lessonAttachments[lessonData.tempId as any]
// 					) {
// 						const attachments =
// 							data.lessonAttachments[lessonData.tempId as any];

// 						for (const attachment of attachments) {
// 							const attachmentFormData = new FormData();
// 							attachmentFormData.append("attachment", attachment);

// 							await axiosInstance.post(
// 								`/lessons/${createdLesson.id}/upload-attachment`,
// 								attachmentFormData,
// 								{
// 									headers: { "Content-Type": "multipart/form-data" },
// 								},
// 							);
// 						}
// 					}
// 				}
// 			}

// 			return { course: createdCourse, modules: createdModules };
// 		},
// 		onSuccess: (data) => {
// 			queryClient.invalidateQueries({ queryKey: ["courses"] });
// 			toast.success(
// 				"Course created successfully with all modules and lessons!",
// 			);
// 			router.navigate({
// 				to: `/dashboard/instructor-portal/courses/${data.course.id}`,
// 			});
// 		},
// 		onError: (error: any) => {
// 			toast.error(
// 				error.response?.data?.message ||
// 					"Failed to create course. Please try again.",
// 			);
// 		},
// 	});
// }

// // ==================== CREATE COURSE ====================
// export function useCreateCourse() {
// 	const queryClient = useQueryClient();
// 	const router = useRouter();

// 	return useMutation({
// 		mutationFn: async (data: FormData) => {
// 			const res = await axiosInstance.post("/courses", data, {
// 				headers: { "Content-Type": "multipart/form-data" },
// 			});
// 			return res.data;
// 		},
// 		onSuccess: (newCourse) => {
// 			queryClient.invalidateQueries({ queryKey: ["courses"] });
// 			toast.success("Course created successfully!");
// 			router.navigate({
// 				to: `/dashboard/instructor-portal/courses/${newCourse.id}`,
// 			});
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to create course");
// 		},
// 	});
// }

// // ==================== GET ALL COURSES ====================
// export function useGetCourses() {
// 	return useQuery({
// 		queryKey: ["courses"],
// 		queryFn: async () => {
// 			const res = await axiosInstance.get("/courses");
// 			return res.data;
// 		},
// 	});
// }

// // ==================== GET SINGLE COURSE ====================
// export function useGetCourse(courseId: string) {
// 	return useQuery({
// 		queryKey: ["courses", courseId],
// 		queryFn: async () => {
// 			const res = await axiosInstance.get(`/courses/${courseId}`);
// 			return res.data;
// 		},
// 		enabled: !!courseId,
// 	});
// }

// // ==================== UPDATE COURSE ====================
// export function useUpdateCourse() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			courseId,
// 			data,
// 		}: {
// 			courseId: string;
// 			data: Partial<TcreateLMSCourseSchema>;
// 		}) => {
// 			const res = await axiosInstance.patch(`/courses/${courseId}`, data);
// 			return res.data;
// 		},
// 		onSuccess: (_, { courseId }) => {
// 			queryClient.invalidateQueries({ queryKey: ["courses"] });
// 			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
// 			toast.success("Course updated successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to update course");
// 		},
// 	});
// }

// // ==================== DELETE COURSE ====================
// export function useDeleteCourse() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (courseId: string) => {
// 			await axiosInstance.delete(`/courses/${courseId}`);
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["courses"] });
// 			toast.success("Course deleted successfully");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to delete course");
// 		},
// 	});
// }

// // ==================== PUBLISH COURSE ====================
// export function usePublishCourse() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (courseId: string) => {
// 			await axiosInstance.patch(`/courses/${courseId}/publish`);
// 		},
// 		onSuccess: (_, courseId) => {
// 			queryClient.invalidateQueries({ queryKey: ["courses"] });
// 			queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
// 			toast.success("Course published successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to publish course");
// 		},
// 	});
// }

// // ==================== MODULE HOOKS ====================
// export function useCreateModule() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			courseId,
// 			data,
// 		}: {
// 			courseId: string;
// 			data: Omit<TcreateLMSModuleSchema, "id">;
// 		}) => {
// 			const res = await axiosInstance.post(
// 				`/courses/${courseId}/modules`,
// 				data,
// 			);
// 			return res.data;
// 		},
// 		onSuccess: (_, { courseId }) => {
// 			queryClient.invalidateQueries({ queryKey: ["modules", courseId] });
// 			toast.success("Module created successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to create module");
// 		},
// 	});
// }

// export function useGetModules(courseId: string) {
// 	return useQuery({
// 		queryKey: ["modules", courseId],
// 		queryFn: async () => {
// 			const res = await axiosInstance.get(`/courses/${courseId}/modules`);
// 			return res.data;
// 		},
// 		enabled: !!courseId,
// 	});
// }

// export function useUpdateModule() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			moduleId,
// 			data,
// 		}: {
// 			moduleId: string;
// 			data: Partial<TcreateLMSModuleSchema>;
// 		}) => {
// 			const res = await axiosInstance.patch(`/modules/${moduleId}`, data);
// 			return res.data;
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["modules"] });
// 			toast.success("Module updated successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to update module");
// 		},
// 	});
// }

// export function useDeleteModule() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (moduleId: string) => {
// 			await axiosInstance.delete(`/modules/${moduleId}`);
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["modules"] });
// 			toast.success("Module deleted successfully");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to delete module");
// 		},
// 	});
// }

// // ==================== LESSON HOOKS ====================
// export function useCreateLesson() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			moduleId,
// 			data,
// 		}: {
// 			moduleId: string;
// 			data: Omit<TcreateLMSLessonSchema, "id">;
// 		}) => {
// 			const res = await axiosInstance.post(
// 				`/modules/${moduleId}/lessons`,
// 				data,
// 			);
// 			return res.data;
// 		},
// 		onSuccess: (_, { moduleId }) => {
// 			queryClient.invalidateQueries({ queryKey: ["lessons", moduleId] });
// 			toast.success("Lesson created successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to create lesson");
// 		},
// 	});
// }

// export function useGetLessons(moduleId: string) {
// 	return useQuery({
// 		queryKey: ["lessons", moduleId],
// 		queryFn: async () => {
// 			const res = await axiosInstance.get(`/modules/${moduleId}/lessons`);
// 			return res.data;
// 		},
// 		enabled: !!moduleId,
// 	});
// }

// export function useUpdateLesson() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			lessonId,
// 			data,
// 		}: {
// 			lessonId: string;
// 			data: Partial<TcreateLMSLessonSchema>;
// 		}) => {
// 			const res = await axiosInstance.patch(`/lessons/${lessonId}`, data);
// 			return res.data;
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["lessons"] });
// 			toast.success("Lesson updated successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to update lesson");
// 		},
// 	});
// }

// export function useDeleteLesson() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async (lessonId: string) => {
// 			await axiosInstance.delete(`/lessons/${lessonId}`);
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["lessons"] });
// 			toast.success("Lesson deleted successfully");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to delete lesson");
// 		},
// 	});
// }

// export function useUploadLessonVideo() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			lessonId,
// 			file,
// 		}: {
// 			lessonId: string;
// 			file: File;
// 		}) => {
// 			const formData = new FormData();
// 			formData.append("video", file);
// 			const res = await axiosInstance.post(
// 				`/lessons/${lessonId}/upload-video`,
// 				formData,
// 				{
// 					headers: { "Content-Type": "multipart/form-data" },
// 				},
// 			);
// 			return res.data;
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["lessons"] });
// 			toast.success("Video uploaded successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(error.response?.data?.message || "Failed to upload video");
// 		},
// 	});
// }

// export function useUploadLessonAttachment() {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: async ({
// 			lessonId,
// 			file,
// 		}: {
// 			lessonId: string;
// 			file: File;
// 		}) => {
// 			const formData = new FormData();
// 			formData.append("attachment", file);
// 			const res = await axiosInstance.post(
// 				`/lessons/${lessonId}/upload-attachment`,
// 				formData,
// 				{
// 					headers: { "Content-Type": "multipart/form-data" },
// 				},
// 			);
// 			return res.data;
// 		},
// 		onSuccess: () => {
// 			queryClient.invalidateQueries({ queryKey: ["lessons"] });
// 			toast.success("Attachment uploaded successfully!");
// 		},
// 		onError: (error: any) => {
// 			toast.error(
// 				error.response?.data?.message || "Failed to upload attachment",
// 			);
// 		},
// 	});
// }
