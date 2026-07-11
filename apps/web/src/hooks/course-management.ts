import type { CoachingCourse } from "@prepexcellence/shared-types";
import {
  type TCCoachingLessonInput,
  type TCCoachingModuleInput,
  type TUCoachingLessonInput,
  type TUCoachingModuleInput,
  ZCCoachingLessonSchema,
  ZCCoachingModuleSchema,
  ZUCoachingLessonSchema,
  ZUCoachingModuleSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export function useSubmitCourses() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosInstance.post(`/coaching/courses`, data);
      return res.data;
    },
  });
}

export function useGetCourses() {
  return useQuery({
    queryKey: ["coaching-courses"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/coaching/courses`);
      return response.data;
    },
  });
}

export interface UseGetPublishedCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: "asc" | "desc";
  filters?: {
    categoryId?: string;
    level?: string;
  };
}

export function useGetPublishedCoachingCourses(
  params: UseGetPublishedCoursesParams = {},
) {
  const {
    page = 1,
    limit = 6,
    search = "",
    sortBy = "createdAt",
    orderBy = "desc",
    filters = {},
  } = params;

  return useQuery({
    queryKey: [
      "coaching-courses",
      "published",
      page,
      limit,
      search,
      sortBy,
      orderBy,
      filters,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));
      queryParams.append("sortBy", sortBy);
      queryParams.append("orderBy", orderBy);

      if (search) {
        queryParams.append("search", search);
      }

      const filterEntries: Record<string, string> = {};
      if (filters.categoryId && filters.categoryId !== "All Categories") {
        filterEntries.categoryId = filters.categoryId;
      }
      if (filters.level && filters.level !== "All Levels") {
        filterEntries.level = filters.level;
      }

      // Send filters as a JSON string (backend expects JSON string in ZQueryParams)
      if (Object.keys(filterEntries).length > 0) {
        queryParams.append("filters", JSON.stringify(filterEntries));
      }

      const response = await axiosInstance.get(
        `/coaching/courses/published?${queryParams.toString()}`,
      );
      return response.data;
    },
  });
}

export function useGetPublishedCoachingCourse(courseId: string) {
  return useQuery({
    queryKey: ["coaching-courses", "published", courseId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/coaching/courses/published/${courseId}`,
      );
      return response.data.data as CoachingCourse;
    },
    enabled: !!courseId,
  });
}

export function useGetPopularCourses() {
  return useQuery({
    queryKey: ["coaching-courses", "popular"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/coaching/courses/popular`);
      return response.data.data as CoachingCourse[];
    },
  });
}

// ==================== GET SINGLE COURSE ====================
export function useGetCourse(courseId: string) {
  return useQuery({
    queryKey: ["coaching-course", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/coaching/courses/${courseId}`);

      return (res.data.data || res.data) as CoachingCourse;
    },
    enabled: !!courseId,
  });
}

// ==================== UPDATE COURSE ====================
export function useUpdateCourse() {
  return useMutation({
    mutationFn: async ({
      courseId,
      data,
    }: {
      courseId: string;
      data: FormData;
    }) => {
      console.log("Data being sent for update:", data);
      const res = await axiosInstance.patch(
        `/coaching/courses/${courseId}`,
        data,
      );

      return res.data.data || res.data;
    },
  });
}

// ========================= PUBLISH/UNPUBLISH COURSE =========================
export function usePublishCourse() {
  return useMutation({
    mutationFn: async ({
      courseId,
      isPublished,
    }: {
      courseId: string;
      isPublished: boolean;
    }) => {
      const res = await axiosInstance.patch(
        `/coaching/courses/${courseId}/publish`,
        { isPublished },
      );

      return res.data.data || res.data;
    },
  });
}

// ========================= DELETE COURSE =========================
export function useDeleteCourse() {
  return useMutation({
    mutationFn: async (courseId: string) => {
      const res = await axiosInstance.delete(`/coaching/courses/${courseId}`);
      return res.data.data || res.data;
    },
  });
}

// ======================== COURSE MODULES ========================
export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      courseId,
      data,
    }: {
      courseId: string;
      data: Omit<TCCoachingModuleInput, "id" | "courseId">;
    }) => {
      // Validate against Zod schema with courseId
      const validated = ZCCoachingModuleSchema.parse({
        ...data,
        courseId,
      });

      const res = await axiosInstance.post(
        `/coaching/courses/${courseId}/modules`,
        validated,
      );
      return res.data.data || res.data; // Extract created module
    },
    onSuccess: (_, { courseId }) => {
      // CRITICAL: Refetch the full course to get updated modules
      queryClient.invalidateQueries({
        queryKey: ["coaching-course", courseId],
      });
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
      data: Partial<Omit<TUCoachingModuleInput, "courseId">>;
    }) => {
      const validated = ZUCoachingModuleSchema.parse(data);
      const res = await axiosInstance.patch(
        `/coaching/courses/modules/${moduleId}`,
        validated,
      );
      return res.data.data || res.data;
    },
    onSuccess: (_, { courseId: cId }) => {
      // CRITICAL: Refetch the full course to see updated module
      queryClient.invalidateQueries({ queryKey: ["coaching-course", cId] });
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
      await axiosInstance.delete(`/coaching/courses/modules/${moduleId}`);
    },
    onSuccess: (_, { courseId }) => {
      // CRITICAL: Refetch the full course
      queryClient.invalidateQueries({
        queryKey: ["coaching-course", courseId],
      });
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
      data: Omit<TCCoachingLessonInput, "id" | "moduleId">;
    }) => {
      // Validate against Zod schema with moduleId
      const validated = ZCCoachingLessonSchema.parse({
        ...data,
        moduleId,
      });

      const res = await axiosInstance.post(
        `/coaching/courses/${moduleId}/lessons`,
        validated,
      );
      return res.data.data || res.data; // Extract created lesson
    },
    onSuccess: (_, { courseId }) => {
      // CRITICAL: Refetch the full course to see new lesson
      queryClient.invalidateQueries({
        queryKey: ["coaching-course", courseId],
      });
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
      data: Partial<Omit<TUCoachingLessonInput, "moduleId">>;
    }) => {
      // Validate against update schema (omits moduleId)

      const validated = ZUCoachingLessonSchema.parse(data);
      const res = await axiosInstance.patch(
        `/coaching/courses/lessons/${lessonId}`,
        validated,
      );
      return res.data.data || res.data;
    },
    onSuccess: (_, { courseId }) => {
      // CRITICAL: Refetch the full course
      queryClient.invalidateQueries({
        queryKey: ["coaching-course", courseId],
      });
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
      await axiosInstance.delete(`/coaching/courses/lessons/${lessonId}`);
    },
    onSuccess: (_, { courseId }) => {
      // CRITICAL: Refetch the full course
      queryClient.invalidateQueries({
        queryKey: ["coaching-course", courseId],
      });
      toast.success("Lesson deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete lesson");
    },
  });
}

// ======================== COACHING CONTENTS ========================
export function useCreateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      topicId,
      data,
    }: {
      topicId: string;
      data: Record<string, unknown>;
    }) => {
      const res = await axiosInstance.post(
        `/coaching/topics/${topicId}/contents`,
        data,
      );
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-course"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create content");
    },
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentId,
      data,
    }: {
      contentId: string;
      data: Record<string, unknown>;
    }) => {
      const res = await axiosInstance.patch(
        `/coaching/contents/${contentId}`,
        data,
      );
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-course"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update content");
    },
  });
}

// ======================== CATEGORIES ========================
export interface Category {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { courses: number };
}

export function useGetCategories() {
  return useQuery({
    queryKey: ["coaching-categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data.data as Category[];
    },
  });
}

export function useGetActiveCategories() {
  return useQuery({
    queryKey: ["coaching-categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories/active");
      return res.data.data as Category[];
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await axiosInstance.post("/categories", data);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-categories"] });
      toast.success("Category created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string; isActive?: boolean };
    }) => {
      const res = await axiosInstance.patch(`/categories/${id}`, data);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-categories"] });
      toast.success("Category updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/categories/${id}`);
      return res.data.data || res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coaching-categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
}

//  ============================ Student Enroled Courses ============================
export function useGetStudentEnrolledCourses() {
  return useQuery({
    queryKey: ["student-enrolled-courses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/coaching/my-courses");
      return res.data.data || res.data;
    },
  });
}

export function useGetStudentEnrolledCourse(courseId: string) {
  return useQuery({
    queryKey: ["student-enrolled-course", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/coaching/courses/${courseId}`);
      return res.data.data || res.data;
    },
    enabled: !!courseId,
  });
}
