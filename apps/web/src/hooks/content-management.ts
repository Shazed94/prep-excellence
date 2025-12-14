import type {
	TCFreeSeminarForm,
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
		mutationFn: async (data: FormData) => {
			const res = await axiosInstance.post(`/trusted-companies`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
	});
}

export function useGetTrustedCompanies(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: [
			"trusted-companies",
			"get",
			// page,
			// limit,
			// search,
			// sortBy,
			// orderBy,
		],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/trusted-companies?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useEditTrustedCompanies() {
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
			const res = await axiosInstance.put(`/trusted-companies/${id}`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
	});
}

export function useDeleteTrustedCompanies() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/trusted-companies/${id}`);
			return res.data;
		},
	});
}

//! ====================== Free Seminar =============================

export function usePostFreeSeminar() {
	return useMutation({
		mutationFn: async (data: TCFreeSeminarForm) => {
			const res = await axiosInstance.post(`/free-seminars`, data);
			return res.data;
		},
	});
}

export function useGetFreeSeminars(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: ["free-seminars", "get", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/free-seminars?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useDeleteFreeSeminar() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/free-seminars/${id}`);
			return res.data;
		},
	});
}

// ! ====================== Guidance Form =============================

export function usePostGuidanceFormSubmission() {
	return useMutation({
		mutationFn: async (data: FormData) => {
			const res = await axiosInstance.post(`/guidance`, data);
			return res.data;
		},
	});
}

export function useGetGuidanceFormSubmissions(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: [
			"guidance-form-submissions",
			"get",
			page,
			limit,
			search,
			sortBy,
			orderBy,
		],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/guidance?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useDeleteGuidanceFormSubmission() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/guidance/${id}`);
			return res.data;
		},
	});
}
