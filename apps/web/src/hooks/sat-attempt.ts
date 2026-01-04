import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExportButton } from "@/components/exportButton";
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

export const useCreateSatAttemptMCQAnswer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/attempts/submit-mcq-answer`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sat-practice", "mcq-answer"],
			});
		},
		onError: (error) => {
			console.error("Error creating SAT attempt:", error);
		},
	});
};

export const useCreateSatAttemptMCQModuleComplete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/attempts/complete-module`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sat-practice", "mcq-module-complete"],
			});
		},
		onError: (error) => {
			console.error("Error creating SAT attempt:", error);
		},
	});
};

export const useCreateSatAttemptMCQModuleNext = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: any) => {
			const response = await axiosInstance.post(
				`/sat-practice/attempts/next-module`,
				data,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sat-practice", "mcq-module-next"],
			});
		},
		onError: (error) => {
			console.error("Error creating SAT attempt:", error);
		},
	});
};

// ========================
// Student Attempts GET
// ========================
export const useGetStudentAttempts = (studentId?: string) => {
	return useQuery({
		queryKey: ["student-attempts", studentId],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/sat-practice/students/${studentId}/attempts`,
			);
			return response.data;
		},
		enabled: !!studentId,
	});
};

export const useGetStudentAttemptsAnswers = (attemptId?: string) => {
	return useQuery({
		queryKey: ["student-attempt-answers", attemptId],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/sat-practice/attempts/${attemptId}/answers`,
			);
			return response.data;
		},
		enabled: !!attemptId,
	});
};
