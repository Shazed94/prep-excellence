import type { TCreateTeacher } from "@prepexcellence/shared-validators";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export function usePostInstructor() {
	return useMutation({
		mutationFn: async (data: TCreateTeacher) => {
			const res = await axiosInstance.post(`/teachers/`, data);
			return res.data;
		},
		onError: (error: any) => {
			console.error("Error adding instructor:", error);
			throw error;
		},
	});
}
