import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useGetGradingStats = (params?: {
	page?: number;
	limit?: number;
	search?: string;
}) => {
	return useQuery({
		queryKey: ["grading-stats"],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/sat-practice/grading/pending?`,
				{
					params,
				},
			);
			return response.data;
		},
	});
};

export const useSubmitGrading = () => {
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/grading/grade`,
				data,
			);
			return response.data;
		},
	});
};
