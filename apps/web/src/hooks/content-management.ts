import type { TNewsletterSubscription } from "@prepexcellence/shared-validators";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

//! ====================== NEWSLETTER ===============================

export function usePostNewsletter() {
	return useMutation({
		mutationFn: async (data: TNewsletterSubscription) => {
			const res = axiosInstance.post(`/newsletter`, data);
			return res;
		},
	});
}

export function useGetNewsletter() {
	return useQuery({
		queryKey: ["newsletter", "get"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/newsletter`);
			return response;
		},
	});
}

export function useDeleteNewsletter() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete("/newsletter", {
				data: { id },
			});
			return res.data;
		},
	});
}

//! ====================== TRUSTED BY =============================

export function usePostTrustedCompanies() {
	return useMutation({
		mutationFn: async (data: TNewsletterSubscription) => {
			const res = axiosInstance.post(`/coaching/trusted-companies`, data);
			return res;
		},
	});
}

export function useGetTrustedCompanies() {
	return useQuery({
		queryKey: ["trusted-companies", "get"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/coaching/trusted-companies`);
			return response;
		},
	});
}

export function useEditTrustedCompanies() {
	return useQuery({
		queryKey: ["trusted-companies", "edit"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/coaching/trusted-companies`);
			return response;
		},
	});
}

export function useDeleteTrustedCompanies() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete("/coaching/trusted-companies", {
				data: { id },
			});
			return res.data;
		},
	});
}
