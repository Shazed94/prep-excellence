import type { TNewsletterSubscription } from "@prepexcellence/shared-validators";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

//! ====================== NEWSLETTER ===============================

export function usePostNewsletter() {
	return useMutation({
		mutationFn: async (data: TNewsletterSubscription) => {
			const res = axiosInstance.post(`/coaching/newsletter`, data);
			return res;
		},
	});
}

export function useGetNewsletter() {
	return useQuery({
		queryKey: ["newsletter", "get"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/coaching/newsletter`);
			return response;
		},
	});
}

export function useDeleteNewsletter() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete("/coaching/newsletter", {
				data: { id },
			});
			return res.data;
		},
	});
}

//! ====================== TRUSTED BY =============================

export function usePostTrustedBy() {
	return useMutation({
		mutationFn: async (data: TNewsletterSubscription) => {
			const res = axiosInstance.post(`/coaching/trusted-by`, data);
			return res;
		},
	});
}

export function useGetTrustedBy() {
	return useQuery({
		queryKey: ["trusted-by", "get"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/coaching/trusted-by`);
			return response;
		},
	});
}

export function useEditTrustedBy() {
	return useQuery({
		queryKey: ["trusted-by", "edit"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/coaching/trusted-by`);
			return response;
		},
	});
}

export function useDeleteTrustedBy() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete("/coaching/trusted-by", {
				data: { id },
			});
			return res.data;
		},
	});
}
