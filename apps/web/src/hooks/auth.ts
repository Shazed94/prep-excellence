import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";

export function useLoginMutation() {
	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const res = await axiosInstance.post(
				`${BACKEND_URL_V1}/auth/login`,
				data,
			);
			return res.data;
		},
	});
}

export function useSignupMutation() {
	return useMutation({
		mutationFn: async (data: {
			name: string;
			email: string;
			password: string;
			role: string;
		}) => {
			const res = await axiosInstance.post(
				`${BACKEND_URL_V1}/auth/register`,
				data,
			);
			return res.data;
		},
	});
}
