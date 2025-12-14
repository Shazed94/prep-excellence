import type {
	TCTrustedCompanies,
	TNewsletterSubscription,
} from "@prepexcellence/shared-validators";
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

export function useGetNewsletter(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: ["newsletter", "get", page, limit, search, sortBy, orderBy], // Add dependencies to refetch
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/newsletter?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
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
		mutationFn: async (data: TCTrustedCompanies) => {
			const res = await axiosInstance.post(`/trusted-companies`, data);
			return res.data;
		},
	});
}

export function useGetTrustedCompanies() {
	return useQuery({
		queryKey: ["trusted-companies", "get"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/trusted-companies`);
			return response.data;
		},
	});
}

export function useEditTrustedCompanies() {
	return useMutation({
		mutationFn: async (data: TCTrustedCompanies & { id: string }) => {
			const { id, ...updateData } = data;
			const res = await axiosInstance.put(
				`/trusted-companies/${id}`,
				updateData,
			);
			return res.data;
		},
	});
}

export function useDeleteTrustedCompanies() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/trusted-companies`, {
				data: { id },
			});
			return res.data;
		},
	});
}
