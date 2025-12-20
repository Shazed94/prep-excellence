import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useCreateQuestion = () => {
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/questions`,
				data,
			);
			return response;
		},
	});
};
