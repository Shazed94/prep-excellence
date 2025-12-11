import type { TCreateCourseSchema } from "@prepexcellence/shared-validators";
import { useMutation, useQuery } from "@tanstack/react-query";
// import axiosInstance from "@/lib/axios";
// import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";
import axiosInstance from "@/lib/axios";

export function useSubmitCourses() {
	return useMutation({
		mutationFn: async (data: TCreateCourseSchema) => {
			const res = axiosInstance.post(`/coaching/courses`, data);
			// queryClient.invalidateQueries(["coaching-courses"]);
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
