import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const usePostDomains = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(`/sat-practice/attempts`, data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sat-practice", "attempts"] });
		},
	});
};
