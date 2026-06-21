import {
  type CreateCoachingModuleInput,
  type CreateCoachingTopicInput,
  createCoachingModuleSchema,
  createCoachingTopicSchema,
  type UpdateCoachingModuleInput,
  type UpdateCoachingTopicInput,
  updateCoachingModuleSchema,
  updateCoachingTopicSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Course,
  CourseResponse,
} from "@/components/sat-courses/sat_courses";
import axiosInstance from "@/lib/axios";

export function useSubmitCourses() {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = axiosInstance.post(`/coaching/courses`, data);
      return res;
    },
  });
}

export function useGetCourses() {
  return useQuery({
    queryKey: ["coaching-courses"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/coaching/courses`);
      return response;
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
    category?: string;
    level?: string;
  };
}

export function useGetPublishedCourses(
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

  return useQuery<CourseResponse>({
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
      if (filters.category && filters.category !== "All Categories") {
        filterEntries.category = filters.category;
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

// ==================== GET SINGLE COURSE ====================
export function useGetCourse(courseId: string) {
  return useQuery({
    queryKey: ["coaching-course", courseId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/coaching/courses/${courseId}`);

      return (res.data.data || res.data) as Course;
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
      data: Omit<CreateCoachingModuleInput, "id" | "courseId">;
    }) => {
      // Validate against Zod schema with courseId
      const validated = createCoachingModuleSchema.parse({
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
      data: Partial<Omit<UpdateCoachingModuleInput, "courseId">>;
    }) => {
      const validated = updateCoachingModuleSchema.parse(data);
      const res = await axiosInstance.patch(
        `/coaching/modules/${moduleId}`,
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
      await axiosInstance.delete(`/coaching/courses/${moduleId}`);
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
      data: Omit<CreateCoachingTopicInput, "id" | "moduleId">;
    }) => {
      // Validate against Zod schema with moduleId
      const validated = createCoachingTopicSchema.parse({
        ...data,
        moduleId,
      });

      const res = await axiosInstance.post(
        `/coaching/modules/${moduleId}/topics`,
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
      data: Partial<Omit<UpdateCoachingTopicInput, "moduleId">>;
    }) => {
      // Validate against update schema (omits moduleId)
      console.log("dataaaaaaaaaaaaaaaaaaaaaaa", data);
      const validated = updateCoachingTopicSchema.parse(data);
      const res = await axiosInstance.put(
        `/coaching/topics/${lessonId}`,
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
      await axiosInstance.delete(`/coaching/topics/${lessonId}`);
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
