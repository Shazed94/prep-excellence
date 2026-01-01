import {
	type TCreateParent,
	type TCreateStudent,
	type TCreateSystemUser,
	type TCreateTeacher,
	type TUpdateParent,
	type TUpdateStudent,
	type TUpdateSystemUser,
	type TUpdateTeacher,
	ZCSystemUser,
	ZUParent,
	ZUStudent,
	ZUSystemUser,
	ZUTeacher,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

// ================= STUDENT HOOKS =================
export function usePostStudent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: TCreateStudent | FormData) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.post("/students/", data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Handle regular JSON data
			const res = await axiosInstance.post("/students/", data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student added successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create student");
		},
	});
}

export function useGetStudentById(id: string) {
	return useQuery({
		queryKey: ["students", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/students/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function useGetStudents({
	page = 1,
	limit = 10,
	search = "",
	sortBy = "createdAt",
	orderBy = "desc",
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	orderBy?: string;
} = {}) {
	return useQuery({
		queryKey: ["students", "list", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				search: search || "",
				sortBy: sortBy || "createdAt",
				orderBy: orderBy || "desc",
			});

			const res = await axiosInstance.get(`/students?${params.toString()}`);
			return res.data;
		},
	});
}

export function useUpdateStudent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: TUpdateStudent | FormData;
		}) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.put(`/students/${id}`, data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Handle regular JSON data with validation
			const validated = ZUStudent.parse(data);
			const res = await axiosInstance.put(`/students/${id}`, validated);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student updated successfully");
		},
		onError: (error) => {
			console.error("Error updating student:", error);
			throw error;
		},
	});
}

export function useDeleteStudent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/students/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			toast.success("Student deleted successfully");
		},
		onError: (error) => {
			console.error("Error deleting student:", error);
			throw error;
		},
	});
}

// ================= PARENT HOOKS =================
export function usePostParent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: TCreateParent | FormData) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.post("/parents/", data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Handle regular JSON data
			const res = await axiosInstance.post("/parents/", data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["parents"] });
			toast.success("Parent added successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create parent");
		},
	});
}

export function useGetParentById(id: string) {
	return useQuery({
		queryKey: ["parents", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/parents/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function useGetParents({
	page = 1,
	limit = 10,
	search = "",
	sortBy = "createdAt",
	orderBy = "desc",
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	orderBy?: string;
} = {}) {
	return useQuery({
		queryKey: ["parents", "list", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				search: search || "",
				sortBy: sortBy || "createdAt",
				orderBy: orderBy || "desc",
			});

			const res = await axiosInstance.get(`/parents?${params.toString()}`);
			return res.data;
		},
	});
}

export function useUpdateParent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: TUpdateParent | FormData;
		}) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.put(`/parents/${id}`, data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Handle regular JSON data with validation
			const validated = ZUParent.parse(data);
			const res = await axiosInstance.put(`/parents/${id}`, validated);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["parents"] });
			toast.success("Parent updated successfully");
		},
		onError: (error) => {
			console.error("Error updating parent:", error);
			throw error;
		},
	});
}

export function useDeleteParent() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/parents/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["parents"] });
			toast.success("Parent deleted successfully");
		},
		onError: (error) => {
			console.error("Error deleting parent:", error);
			throw error;
		},
	});
}

// ================= SYSTEM USER HOOKS =================

export function usePostSystemUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: TCreateSystemUser | FormData) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.post("/system-users/", data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Validate with Zod before sending
			const validated = ZCSystemUser.parse(data);
			const res = await axiosInstance.post("/system-users/", validated);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["system-users"] });
			// Remove duplicate toast - it's already in the form component
		},
		onError: (error: any) => {
			// Let the form component handle the error toast for better UX
			console.error("Error creating system user:", error);
			throw error;
		},
	});
}

export function useGetSystemUserById(id: string) {
	return useQuery({
		queryKey: ["system-users", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/system-users/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function useGetSystemUsers({
	page = 1,
	limit = 10,
	search = "",
	sortBy = "createdAt",
	orderBy = "desc",
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	orderBy?: string;
}) {
	return useQuery({
		queryKey: ["system-users", "list", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				search: search || "",
				sortBy: sortBy || "createdAt",
				orderBy: orderBy || "desc",
			});

			const res = await axiosInstance.get(`/system-users?${params.toString()}`);
			return res.data;
		},
	});
}

export function useUpdateSystemUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: TUpdateSystemUser | FormData;
		}) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.put(`/system-users/${id}`, data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Validate with Zod before sending
			const validated = ZUSystemUser.parse(data);
			const res = await axiosInstance.put(`/system-users/${id}`, validated);
			return res.data;
		},
		onSuccess: (_, variables) => {
			// Invalidate both list and detail queries
			queryClient.invalidateQueries({ queryKey: ["system-users"] });
			queryClient.invalidateQueries({
				queryKey: ["system-users", variables.id],
			});
			toast.success("System user updated successfully");
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.message || "Failed to update system user";
			toast.error(errorMessage);
			console.error("Error updating system user:", error);
			throw error;
		},
	});
}

export function useDeleteSystemUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/system-users/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["system-users"] });
			toast.success("System user deleted successfully");
		},
		onError: (error: any) => {
			const errorMessage =
				error.response?.data?.message || "Failed to delete system user";
			toast.error(errorMessage);
			console.error("Error deleting system user:", error);
			throw error;
		},
	});
}

// ================= TEACHER HOOKS =================
export function usePostTeacher() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: TCreateTeacher | FormData) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.post("/teachers/", data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Handle regular JSON data
			const res = await axiosInstance.post("/teachers/", data);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			toast.success("Teacher added successfully");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to create teacher");
		},
	});
}

export function useGetTeacherById(id: string) {
	return useQuery({
		queryKey: ["teachers", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/teachers/${id}`);
			return res.data;
		},
		enabled: !!id,
	});
}

export function useGetTeachers({
	page = 1,
	limit = 10,
	search = "",
	sortBy = "createdAt",
	orderBy = "desc",
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	orderBy?: string;
} = {}) {
	return useQuery({
		queryKey: ["teachers", "list", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				search: search || "",
				sortBy: sortBy || "createdAt",
				orderBy: orderBy || "desc",
			});

			const res = await axiosInstance.get(`/teachers?${params.toString()}`);
			return res.data;
		},
	});
}

export function useUpdateTeacher() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: TUpdateTeacher | FormData;
		}) => {
			// Handle FormData for image uploads
			if (data instanceof FormData) {
				const res = await axiosInstance.put(`/teachers/${id}`, data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				return res.data;
			}

			// Handle regular JSON data with validation
			const validated = ZUTeacher.parse(data);
			const res = await axiosInstance.put(`/teachers/${id}`, validated);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			toast.success("Teacher updated successfully");
		},
		onError: (error) => {
			console.error("Error updating teacher:", error);
			throw error;
		},
	});
}

export function useDeleteTeacher() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/teachers/${id}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			toast.success("Teacher deleted successfully");
		},
		onError: (error) => {
			console.error("Error deleting teacher:", error);
			throw error;
		},
	});
}
