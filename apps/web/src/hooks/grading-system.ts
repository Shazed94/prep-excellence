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
			// Check if we're grading a single answer or multiple answers
			if (data.answers && Array.isArray(data.answers)) {
				// Bulk grade multiple answers
				const response = await axiosInstance.post(
					`/sat-practice/grading/bulk-grade`,
					data,
				);
				return response.data;
			}
			// Single answer grading
			const response = await axiosInstance.post(
				`/sat-practice/grading/grade`,
				data,
			);
			return response.data;
		},
	});
};
