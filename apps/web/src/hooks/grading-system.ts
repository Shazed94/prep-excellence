import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useGetGradingStats = () => {
	return useQuery({
		queryKey: ["grading-stats"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/grading/pending`);
			return response.data;
		},
	});
};
