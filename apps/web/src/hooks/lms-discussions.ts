import {
	type CreateLMSDiscussionInput,
	createLMSDiscussionSchema,
	type UpdateLMSDiscussionInput,
	updateLMSDiscussionSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";

// Types for the API responses
interface Author {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

interface Discussion {
	id: string;
	content: string;
	isEdited: boolean;
	createdAt: string;
	updatedAt: string;
	lessonId: string;
	authorId: string;
	parentId: string | null;
	author: Author;
	replies?: Discussion[];
}

interface PaginatedDiscussions {
	success: boolean;
	data: Discussion[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

interface DiscussionResponse {
	success: boolean;
	data: Discussion;
	message?: string;
}

/**
 * Create a new discussion post or reply
 */
export function useCreateDiscussion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateLMSDiscussionInput) => {
			const validated = createLMSDiscussionSchema.parse(data);
			const response = await axiosInstance.post<DiscussionResponse>(
				`${BACKEND_URL_V1}/lms/discussions`,
				validated,
			);
			return response.data;
		},
		onSuccess: (data) => {
			// Invalidate discussions for the lesson
			queryClient.invalidateQueries({
				queryKey: ["lms-discussions", data.data.lessonId],
			});
			// If it's a reply, also invalidate the parent discussion
			if (data.data.parentId) {
				queryClient.invalidateQueries({
					queryKey: ["lms-discussion", data.data.parentId],
				});
			}
		},
	});
}

/**
 * Get discussions for a specific lesson
 */
export function useGetLessonDiscussions(
	lessonId: string,
	page = 1,
	limit = 20,
) {
	return useQuery({
		queryKey: ["lms-discussions", lessonId, page, limit],
		queryFn: async () => {
			const response = await axiosInstance.get<PaginatedDiscussions>(
				`${BACKEND_URL_V1}/lms/lessons/${lessonId}/discussions`,
				{
					params: { page, limit },
				},
			);
			return response.data;
		},
		enabled: !!lessonId,
	});
}

/**
 * Get a single discussion by ID
 */
export function useGetDiscussion(discussionId: string) {
	return useQuery({
		queryKey: ["lms-discussion", discussionId],
		queryFn: async () => {
			const response = await axiosInstance.get<DiscussionResponse>(
				`${BACKEND_URL_V1}/lms/discussions/${discussionId}`,
			);
			return response.data;
		},
		enabled: !!discussionId,
	});
}

/**
 * Update a discussion
 */
export function useUpdateDiscussion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			discussionId,
			data,
		}: {
			discussionId: string;
			data: UpdateLMSDiscussionInput;
		}) => {
			const validated = updateLMSDiscussionSchema.parse(data);
			const response = await axiosInstance.patch<DiscussionResponse>(
				`${BACKEND_URL_V1}/lms/discussions/${discussionId}`,
				validated,
			);
			return response.data;
		},
		onSuccess: (data) => {
			// Invalidate the specific discussion
			queryClient.invalidateQueries({
				queryKey: ["lms-discussion", data.data.id],
			});
			// Invalidate the lesson discussions list
			queryClient.invalidateQueries({
				queryKey: ["lms-discussions", data.data.lessonId],
			});
		},
	});
}

/**
 * Delete a discussion
 */
export function useDeleteDiscussion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (discussionId: string) => {
			const response = await axiosInstance.delete<{
				success: boolean;
				message: string;
			}>(`${BACKEND_URL_V1}/lms/discussions/${discussionId}`);
			return response.data;
		},
		onSuccess: () => {
			// Invalidate all discussion queries
			queryClient.invalidateQueries({
				queryKey: ["lms-discussions"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lms-discussion"],
			});
		},
	});
}

// Type exports for convenience
export type { Discussion, Author, PaginatedDiscussions, DiscussionResponse };
