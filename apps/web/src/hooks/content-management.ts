import type {
	TCContactUsSchema,
	TCcollegeEssayReviewSchema,
	TCFreeSeminarForm,
	TCTutorRequestRegistrationSchema,
	TNewsletterSubscription,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

export function useCreateTrustedCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: FormData) => {
			const res = await axiosInstance.post(`/trusted-companies`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["trusted-companies"] });
			toast.success("Trusted company created successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to create trusted company",
			);
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
			page,
			limit,
			search,
			sortBy,
			orderBy,
		],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/trusted-companies?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useUpdateTrustedCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
			const res = await axiosInstance.patch(`/trusted-companies/${id}`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["trusted-companies"] });
			toast.success("Trusted company updated successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update trusted company",
			);
		},
	});
}

export function useDeleteTrustedCompany() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/trusted-companies/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["trusted-companies"] });
			toast.success("Trusted company deleted successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to delete trusted company",
			);
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

//! ====================== TUTOR REQUEST ===============================

export function usePostTutorRequest() {
	return useMutation({
		mutationFn: async (data: TCTutorRequestRegistrationSchema) => {
			const res = await axiosInstance.post(`/tutor-request`, data);
			return res.data;
		},
	});
}

export function useGetTutorRequests(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: ["tutor-request", "get", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/tutor-request?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useDeleteTutorRequest() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/tutor-request/${id}`);
			return res.data;
		},
	});
}

//! ====================== COLLEGE ESSAY REVIEW ===============================

export function usePostCollegeEssayReview() {
	return useMutation({
		mutationFn: async (data: TCcollegeEssayReviewSchema) => {
			const res = await axiosInstance.post(`/college-essay-review`, data);
			return res.data;
		},
	});
}

export function useGetCollegeEssayReviews(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: [
			"college-essay-review",
			"get",
			page,
			limit,
			search,
			sortBy,
			orderBy,
		],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/college-essay-review?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useDeleteCollegeEssayReview() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/college-essay-review/${id}`);
			return res.data;
		},
	});
}

//! ====================== CONTACT US ===============================

export function usePostContactUs() {
	return useMutation({
		mutationFn: async (data: TCContactUsSchema) => {
			const res = await axiosInstance.post(`/contact-us`, data);
			return res.data;
		},
	});
}

export function useGetContactUs(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: ["contact-us", "get", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/contact-us?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useDeleteContactUs() {
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/contact-us/${id}`);
			return res.data;
		},
	});
}

// ! ======================== Blogs ================================

export function useCreateBlog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: FormData) => {
			const res = await axiosInstance.post(`/blogs`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			toast.success("Blog created successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create blog");
		},
	});
}

export function useGetBlogs(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery({
		queryKey: ["blogs", "get", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/blogs?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
			);
			return response.data;
		},
	});
}

export function useUpdateBlog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
			const res = await axiosInstance.patch(`/blogs/${id}`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			toast.success("Blog updated successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to update blog");
		},
	});
}

export function useDeleteBlog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/blogs/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			toast.success("Blog deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete blog");
		},
	});
}
