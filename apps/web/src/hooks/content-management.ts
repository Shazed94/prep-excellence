import {
	type TCBlogCategorySchema,
	type TCBlogSchema,
	type TCContactUsSchema,
	type TCcollegeEssayReviewSchema,
	type TCFreeSeminarForm,
	type TCTutorRequestRegistrationSchema,
	type TNewsletterSubscription,
	type TUBlogCategorySchema,
	type TUBlogSchema,
	ZCBlogCategorySchema,
	ZCBlogSchema,
	ZUBlogCategorySchema,
	ZUBlogSchema,
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

export interface BlogCategory {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	slug: string;
	_count?: {
		blogs: number;
	};
}

export interface Blog {
	id: string;
	createdAt: string;
	updatedAt: string;
	image: string;
	title: string;
	description: string;
	slug: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	tags: string[];
	publishedAt: string | null;
	categoryId: string;
	category: BlogCategory;
	authorId: string;
	author: {
		id: string;
		name: string;
		email: string;
	};
	_count?: {
		comments: number;
	};
	comments?: BlogComment[];
}

export interface BlogComment {
	id: string;
	createdAt: string;
	updatedAt: string;
	blogId: string;
	userId: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
	content: string;
	parentId: string | null;
	replies?: BlogComment[];
	isPublished: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

interface QueryParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: "asc" | "desc";
}

interface BlogQueryParams extends QueryParams {
	categoryId?: string;
	status?: string;
	search?: string;
}

// ============================================
// BLOG CATEGORY HOOKS
// ============================================

export function useCreateBlogCategory() {
	return useMutation({
		mutationFn: async (data: TCBlogCategorySchema) => {
			const response = await axiosInstance.post("/blog-categories", data);
			return response.data;
		},
	});
}

export function useBlogCategories(params: QueryParams = {}) {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		orderBy = "desc",
	} = params;

	return useQuery<PaginatedResponse<BlogCategory>>({
		queryKey: ["blog-categories", page, limit, sortBy, orderBy],
		queryFn: async () => {
			const response = await axiosInstance.get("/blog-categories", {
				params: { page, limit, sortBy, orderBy },
			});
			return response.data;
		},
	});
}

export function useBlogCategory(id: string, enabled = true) {
	return useQuery<{ success: boolean; data: BlogCategory }>({
		queryKey: ["blog-category", id],
		queryFn: async () => {
			const response = await axiosInstance.get(`/blog-categories/${id}`);
			return response.data;
		},
		enabled: !!id && enabled,
	});
}

export function useUpdateBlogCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: TUBlogCategorySchema;
		}) => {
			const validated = ZUBlogCategorySchema.parse(data);
			const response = await axiosInstance.patch(
				`/blog-categories/${id}`,
				validated,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
			queryClient.invalidateQueries({ queryKey: ["blog-category"] });
			toast.success("Blog category updated successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to update blog category",
			);
		},
	});
}

export function useDeleteBlogCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(`/blog-categories/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
			toast.success("Blog category deleted successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to delete blog category",
			);
		},
	});
}

// ============================================
// BLOG HOOKS
// ============================================

export function useCreateBlog() {
	return useMutation({
		mutationFn: async (data: TCBlogSchema) => {
			const response = await axiosInstance.post("/blogs", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
	});
}

export function useBlogs(params: BlogQueryParams = {}) {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		orderBy = "desc",
		categoryId,
		status,
		search,
	} = params;

	return useQuery<PaginatedResponse<Blog>>({
		queryKey: [
			"blogs",
			page,
			limit,
			sortBy,
			orderBy,
			categoryId,
			status,
			search,
		],
		queryFn: async () => {
			const response = await axiosInstance.get("/blogs", {
				params: { page, limit, sortBy, orderBy, categoryId, status, search },
			});
			return response.data;
		},
	});
}

export function useBlog(id: string, enabled = true) {
	return useQuery<{ success: boolean; data: Blog }>({
		queryKey: ["blog", id],
		queryFn: async () => {
			const response = await axiosInstance.get(`/blogs/${id}`);
			return response.data;
		},
		enabled: !!id && enabled,
	});
}

export function useBlogBySlug(slug: string, enabled = true) {
	return useQuery<{ success: boolean; data: Blog }>({
		queryKey: ["blog", "slug", slug],
		queryFn: async () => {
			const response = await axiosInstance.get(`/blogs/slug/${slug}`);
			return response.data;
		},
		enabled: !!slug && enabled,
	});
}

export function useUpdateBlog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: TUBlogSchema & { image?: File };
		}) => {
			const { image, ...blogData } = data;
			const validated = ZUBlogSchema.parse(blogData);

			const formData = new FormData();
			if (image) formData.append("image", image);
			if (validated.title) formData.append("title", validated.title);
			if (validated.categoryId)
				formData.append("categoryId", validated.categoryId);
			if (validated.description)
				formData.append("description", validated.description);
			if (validated.status) formData.append("status", validated.status);
			if (validated.tags && validated.tags.length > 0) {
				formData.append("tags", JSON.stringify(validated.tags));
			}

			const response = await axiosInstance.patch(`/blogs/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			queryClient.invalidateQueries({ queryKey: ["blog"] });
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
			const response = await axiosInstance.delete(`/blogs/${id}`);
			return response.data;
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
