import { useQuery } from "@tanstack/react-query";
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
