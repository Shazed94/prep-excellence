import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useGetSubjectById = (id: string) => {
	return useQuery({
		queryKey: ["subject", id],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/subjects/${id}`);
			return response.data;
		},
		enabled: !!id,
	});
};

export const useCreateSatAttempt = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(`/sat-practice/attempts`, data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sat-practice", "attempts"] });
		},
		onError: (error) => {
			console.error("Error creating SAT attempt:", error);
		},
	});
};
