import { useMutation, useQuery } from "@tanstack/react-query";
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

export function useGetPublishedCourses() {
  return useQuery({
    queryKey: ["coaching-courses", "published"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/coaching/courses/published`);
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
      return res.data.data || res.data;
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
