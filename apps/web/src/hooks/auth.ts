import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";
import { useAuth } from "@/store/useAuth";

interface GoogleLoginResponse {
	success: boolean;
	message: string;
	data: {
		user: {
			id: string;
			email: string;
			name: string;
			role: string;
		};
		accessToken: string;
		refreshToken: string;
	};
}

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

export function useGoogleLoginMutation() {
	return useMutation({
		mutationFn: async (accessToken: string) => {
			const res = await axiosInstance.post<GoogleLoginResponse>(
				`${BACKEND_URL_V1}/auth/google`,
				{
					accessToken,
				},
			);
			return res.data;
		},
	});
}

export function useForgetPasswordMutation() {
	return useMutation({
		mutationFn: async (data: { email: string }) => {
			const res = await axiosInstance.post(
				`${BACKEND_URL_V1}/auth/forgot-password`,
				data,
			);
			return res.data;
		},
	});
}

export function useOtpVerificationMutation() {
	return useMutation({
		mutationFn: async (data: { email: string; otp: string }) => {
			const res = await axiosInstance.post(
				`${BACKEND_URL_V1}/auth/verify-otp`,
				data,
			);
			return res.data;
		},
	});
}

export function useResetPasswordMutation() {
	return useMutation({
		mutationFn: async (data: {
			email: string;
			newPassword: string;
			confirmPassword: string;
		}) => {
			const res = await axiosInstance.post(
				`${BACKEND_URL_V1}/auth/reset-password`,
				data,
			);
			return res.data;
		},
	});
}
