import {
	type TCreateTeacher,
	type TUpdateTeacher,
	ZUTeacher,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

export function usePostInstructor() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: FormData) => {
			const res = await axiosInstance.post(`/teachers/`, data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			toast.success("Instructor added successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message ||
					error.message ||
					"Failed to create Instructor",
			);
		},
	});
}
export function useGetInstructorById(id: string) {
	return useQuery({
		queryKey: ["teachers", id],
		queryFn: async () => {
			const res = await axiosInstance.get(`/teachers/${id}`);
			return res.data;
		},
		enabled: !!id, // Only run if id exists
	});
}
export function useGetInstructors({
	page,
	limit,
	search,
	sortBy,
	orderBy,
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	orderBy?: string;
} = {}) {
	const params = new URLSearchParams();
	if (page !== undefined) params.set("page", String(page));
	if (limit !== undefined) params.set("limit", String(limit));
	if (search) params.set("search", search);
	if (sortBy) params.set("sortBy", sortBy);
	if (orderBy) params.set("orderBy", orderBy);
	const qs = params.toString();

	return useQuery({
		queryKey: ["teachers", "get", page, limit, search, sortBy, orderBy],
		queryFn: async () => {
			const res = await axiosInstance.get(`/teachers${qs ? `?${qs}` : ""}`);
			return res.data;
		},
	});
}

export function useDeleteInstructor() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axiosInstance.delete(`/teachers/${id}`);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Instructor deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
		},
		onError: (error: TCreateTeacher) => {
			console.error("Error deleting instructor:", error);
			throw error;
		},
	});
}

export function useUpdateInstructor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: TUpdateTeacher }) => {
			const validated = ZUTeacher.parse(data);
			const res = await axiosInstance.put(`/teachers/${id}`, validated);
			return res.data;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teachers"] });
			toast.success("Instructor updated successfully");
		},

		onError: (error) => {
			console.error("Error updating instructor:", error);
			throw error;
		},
	});
}

export const useUploadImage = () => {
	const [isUploading, setIsUploading] = useState(false);

	const uploadImage = async (file: File): Promise<string> => {
		setIsUploading(true);

		try {
			// Create FormData object[citation:3][citation:9]
			const formData = new FormData();
			formData.append("image", file);
			formData.append("fileName", file.name);
			formData.append("fileType", file.type);

			// Make actual upload request to your backend API
			// Replace '/api/upload' with your actual upload endpoint[citation:1][citation:4]
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				// Note: Do NOT set Content-Type header when using FormData[citation:5]
				// The browser will set it automatically with the correct boundary
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(
					errorData.message || `Upload failed with status: ${response.status}`,
				);
			}

			const result = await response.json();

			// Assuming your backend returns { url: string, fileName: string }
			if (!result.url) {
				throw new Error("No image URL returned from server");
			}

			return result.url;
		} catch (error: any) {
			console.error("Image upload error:", error);
			throw new Error(error.message || "Failed to upload image");
		} finally {
			setIsUploading(false);
		}
	};

	return {
		uploadImage,
		isUploading,
	};
};

export const useGetInstructorsPublic = () => {
	return useQuery({
		queryKey: ["instructors", "public"],
		queryFn: async () => {
			const res = await axiosInstance.get(`/teachers/all`);
			return res.data;
		},
	});
};
