import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGradingStats = () => {
	return useQuery({
		queryKey: ["grading-stats"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/grading/pending`);
			return response.data;
		},
	});
};
