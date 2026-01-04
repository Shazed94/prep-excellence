import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export const useCreateQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/questions`,
				data,
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			// Show success toast
			toast.success("Question created successfully!", {
				description: "The question has been added to the question bank.",
			});
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || "Failed to create question",
			);
		},
	});
};

export const useGetQuestions = (params?: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	search?: string;
	filters?: any;
}) => {
	return useQuery({
		queryKey: ["questions", params],
		queryFn: async () => {
			const response = await axiosInstance.get(`/sat-practice/questions`, {
				params,
			});
			return response.data;
		},
	});
};

export const getQuestionById = async (id: string) => {
	const response = await axiosInstance.get(`/sat-practice/questions/${id}`);
	return response.data;
};
export const useGetQuestionById = (id: string) => {
	return useQuery({
		queryKey: ["question", id],
		queryFn: async () => getQuestionById(id),
		enabled: !!id,
	});
};

export const useUpdateQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const response = await axiosInstance.put(
				`/sat-practice/questions/${id}`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			toast.success("Question updated successfully!", {
				description: "The question has been updated in the question bank.",
			});
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || "Failed to update question",
			);
		},
	});
};

export const useDeleteQuestion = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(
				`/sat-practice/questions/${id}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["questions"] });
			toast.success("Question deleted successfully");
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message || "Failed to delete question",
			);
		},
	});
};
