import {
	type TCBlogCategorySchema,
	type TCBlogCommentSchema,
	type TCBlogSchema,
	type TCContactUsSchema,
	type TFreeSeminarEnrollmentForm,
	type TNewsletterSubscription,
	type TUBlogCategorySchema,
	ZCFreeSeminarEnrollmentForm,
	ZUBlogCategorySchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export interface Enrollment {
	id: string;
	createdAt: string;
	updatedAt: string;
	seminarId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	country: string;
	address: string;
}

export interface FreeSeminar {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;
	image: string;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	startTime: string;
	endTime: string;
	capacity: number;
	enrollments: Enrollment[];
	_count: {
		enrollments: number;
	};
}

//! ====================== NEWSLETTER ===============================

export function usePostNewsletter() {
	return useMutation({
		mutationFn: async (data: TNewsletterSubscription) => {
			const res = await axiosInstance.post(`/newsletter`, data);
			return res.data;
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
			return response.data;
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
			const res = await axiosInstance.put(`/trusted-companies/${id}`, data, {
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
		mutationFn: async (data: FormData) => {
			const res = await axiosInstance.post(`/free-seminars`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
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

export function useViewFreeSeminar(id: string) {
	return useQuery({
		queryKey: ["free-seminars", "view", id],
		queryFn: async () => {
			const response = await axiosInstance.get(`/free-seminars/${id}`);
			return response.data;
		},
		enabled: !!id, // Only run if id is provided
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

export function useUpdateFreeSeminar() {
	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
			const res = await axiosInstance.put(`/free-seminars/${id}`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
	});
}

export function useGetActiveFreeSeminar() {
	return useQuery({
		queryKey: ["free-seminars", "active"],
		queryFn: async () => {
			const response = await axiosInstance.get(`/free-seminars/active`);
			return response.data;
		},
	});
}

// FREE SEMINAR Enrolement Form
export function useFreeSeminarEnrolement() {
	return useMutation({
		mutationFn: async (data: TFreeSeminarEnrollmentForm) => {
			const validated = ZCFreeSeminarEnrollmentForm.parse(data);
			const res = await axiosInstance.post(
				`/free-seminar-enrollments`,
				validated,
			);
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete(`/contact-us/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-us"],
      });
    },
  });
}

export function useUpdateContactUsStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			status,
		}: {
			id: string;
			status: "PENDING" | "IN_PROGRESS" | "REPLIED" | "RESOLVED" | "CLOSED";
		}) => {
			const res = await axiosInstance.patch(`/contact-us/${id}/status`, {
				status,
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["contact-us"],
			});
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
		image?: string;
		email: string;
	};
	_count?: {
		comments: number;
	};
	comments?: BlogComment[];
}

export interface BlogFilter {
	data: {
		categories: [
			{
				id: string;
				name: string;
			},
		];
		tags?: string[];

		months: string[];
	};
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

// ============================================
// BLOG CATEGORY HOOKS
// ============================================

export function useCreateBlogCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TCBlogCategorySchema) => {
			const response = await axiosInstance.post("/blog-categories", data);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
			toast.success("Blog category created successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to create blog category",
			);
		},
	});
}

export function useBlogCategories(params: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
}) {
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
		enabled: true,
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
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			toast.success(res.message || "Blog category updated successfully");
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
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
			toast.success(res.message || "Blog category deleted successfully");
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
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TCBlogSchema) => {
			const response = await axiosInstance.post("/blogs", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
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

export function useBlogs(params: {
	page?: number;
	limit?: number;
	sortBy?: string;
	orderBy?: string;
	categoryId?: string;
	publishedAt?: string;
	status?: string;
	search?: string;
}) {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		orderBy = "desc",
		categoryId,
		publishedAt,
		status,
		search,
	} = params;

	// Build filters object only with defined values
	const filters: Record<string, string> = {};
	if (categoryId) filters.categoryId = categoryId;
	if (status) filters.status = status;
	if (publishedAt) filters.publishedAt = publishedAt;

	return useQuery<PaginatedResponse<Blog>>({
		queryKey: ["blogs", page, limit, sortBy, orderBy, filters, search],
		queryFn: async () => {
			const response = await axiosInstance.get("/blogs", {
				params: {
					page,
					limit,
					sortBy,
					orderBy,
					...(Object.keys(filters).length > 0 && { filters }),
					...(search && { search }),
				},
			});
			return response.data;
		},
	});
}

export function useBlogsFilter(enabled = true) {
	return useQuery<BlogFilter>({
		queryKey: ["blogs", "filters"],
		queryFn: async () => {
			const response = await axiosInstance.get("/blogs/filters");
			return response.data;
		},
		enabled,
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

export function useRelatedBlogs(
	currentBlogId: string,
	categoryId: string,
	tags?: string[],
	limit = 6,
) {
	return useQuery<PaginatedResponse<Blog>>({
		queryKey: ["blogs", "related", currentBlogId, categoryId, tags],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/blogs/${currentBlogId}/related`,
				{
					params: {
						page: 1,
						limit,
						categoryId, // Same category
						status: "PUBLISHED",
						excludeId: currentBlogId, // Exclude current blog
						// Optional: could also filter by tags if your backend supports it
						...(tags?.length && { tags: tags.join(",") }),
					},
				},
			);
			return response.data;
		},
	});
}

export function useUpdateBlog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: any }) => {
			const formData = new FormData();

			// Handle all fields
			if (data.title) formData.append("title", data.title);
			if (data.categoryId) formData.append("categoryId", data.categoryId);
			if (data.description) formData.append("description", data.description);
			if (data.status) formData.append("status", data.status);

			// Handle tags
			if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
				formData.append("tags[]", JSON.stringify(data.tags));
			}

			// Handle image if provided (File object)
			if (data.image instanceof File) {
				formData.append("image", data.image);
			}

			const response = await axiosInstance.patch(`/blogs/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			queryClient.invalidateQueries({ queryKey: ["blog"] });
			toast.success(res.message || "Blog updated successfully");
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

// ! ====================== BLOG COMMENTS HOOKS ===============================

export function usePostBlogComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TCBlogCommentSchema) => {
			const response = await axiosInstance.post(`/blog-comments`, data);
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["blog-comments", variables.blogId],
			});
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			queryClient.invalidateQueries({ queryKey: ["blog"] });
			toast.success("Comment posted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to post comment");
		},
	});
}

export function useGetBlogComments(blogId: string) {
	return useQuery<BlogComment[]>({
		queryKey: ["blog-comments", blogId],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/blog-comments?blogId=${blogId}`,
			);
			return response.data;
		},
		enabled: !!blogId,
	});
}

export function useDeleteBlogComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await axiosInstance.delete(`/blog-comments/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blog-comments"] });
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			queryClient.invalidateQueries({ queryKey: ["blog"] });
			toast.success("Comment deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to delete comment");
		},
	});
}

// ====================== TUTOR REQUESTS =============================

export function useGetTutorRequests(
	page?: number,
	limit?: number,
	search?: string,
	sortBy?: string,
	orderBy?: string,
) {
	return useQuery<PaginatedResponse<any>>({
		queryKey: ["tutor-request", "get", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const response = await axiosInstance.get("/tutor-requests", {
				params: { page, limit, search, sortBy, orderBy },
			});
			return response.data;
		},
	});
}

export function useDeleteTutorRequest() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/tutor-requests/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tutor-request", "get"] });
		},
	});
}
