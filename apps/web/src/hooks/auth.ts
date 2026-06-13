import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";
import { useGoogleLogin } from "@react-oauth/google";
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
