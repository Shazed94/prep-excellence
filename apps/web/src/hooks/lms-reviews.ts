import {
	type CreateLMSReviewInput,
	createLMSReviewSchema,
	type UpdateLMSReviewInput,
	updateLMSReviewSchema,
} from "@prepexcellence/shared-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";

// Types for the API responses
interface ReviewAuthor {
	id: string;
	name: string;
	email: string;
	image?: string | null;
}

interface Review {
	id: string;
	rating: number;
	comment?: string | null;
	createdAt: string;
	updatedAt: string;
	courseId: string;
	studentId: string;
	student: {
		id: string;
		userId: string;
		user: ReviewAuthor;
	};
	course?: {
		id: string;
		title: string;
		slug: string;
		thumbnail?: string | null;
	};
}

interface RatingDistribution {
	1: number;
	2: number;
	3: number;
	4: number;
	5: number;
}

interface PaginatedReviews {
	success: boolean;
	data: Review[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
	stats: {
		averageRating: number | null;
		totalReviews: number;
		distribution: RatingDistribution;
	};
}

interface ReviewResponse {
	success: boolean;
	data: Review | null;
	message?: string;
}

/**
 * Create a course review
 */
export function useCreateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateLMSReviewInput) => {
			const validated = createLMSReviewSchema.parse(data);
			const response = await axiosInstance.post<ReviewResponse>(
				`${BACKEND_URL_V1}/lms/reviews`,
				validated,
			);
			return response.data;
		},
		onSuccess: (data) => {
			if (data.data) {
				// Invalidate course reviews
				queryClient.invalidateQueries({
					queryKey: ["lms-course-reviews", data.data.courseId],
				});
				// Invalidate user's review for this course
				queryClient.invalidateQueries({
					queryKey: ["lms-my-review", data.data.courseId],
				});
				// Invalidate course data (to update average rating)
				queryClient.invalidateQueries({
					queryKey: ["lms-course", data.data.courseId],
				});
			}
		},
	});
}

/**
 * Get reviews for a specific course
 */
export function useGetCourseReviews(courseId: string, page = 1, limit = 20) {
	return useQuery({
		queryKey: ["lms-course-reviews", courseId, page, limit],
		queryFn: async () => {
			const response = await axiosInstance.get<PaginatedReviews>(
				`${BACKEND_URL_V1}/lms/courses/${courseId}/reviews-list`,
				{
					params: { page, limit },
				},
			);
			return response.data;
		},
		enabled: !!courseId,
	});
}

/**
 * Get current user's review for a course
 */
export function useGetMyReview(courseId: string) {
	return useQuery({
		queryKey: ["lms-my-review", courseId],
		queryFn: async () => {
			const response = await axiosInstance.get<ReviewResponse>(
				`${BACKEND_URL_V1}/lms/courses/${courseId}/my-review`,
			);
			return response.data;
		},
		enabled: !!courseId,
	});
}

/**
 * Get a single review by ID
 */
export function useGetReview(reviewId: string) {
	return useQuery({
		queryKey: ["lms-review", reviewId],
		queryFn: async () => {
			const response = await axiosInstance.get<ReviewResponse>(
				`${BACKEND_URL_V1}/lms/reviews/${reviewId}`,
			);
			return response.data;
		},
		enabled: !!reviewId,
	});
}

/**
 * Update a review
 */
export function useUpdateReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			reviewId,
			data,
		}: {
			reviewId: string;
			data: UpdateLMSReviewInput;
		}) => {
			const validated = updateLMSReviewSchema.parse(data);
			const response = await axiosInstance.patch<ReviewResponse>(
				`${BACKEND_URL_V1}/lms/reviews/${reviewId}`,
				validated,
			);
			return response.data;
		},
		onSuccess: (data) => {
			if (data.data) {
				// Invalidate the specific review
				queryClient.invalidateQueries({
					queryKey: ["lms-review", data.data.id],
				});
				// Invalidate course reviews
				queryClient.invalidateQueries({
					queryKey: ["lms-course-reviews", data.data.courseId],
				});
				// Invalidate user's review for this course
				queryClient.invalidateQueries({
					queryKey: ["lms-my-review", data.data.courseId],
				});
				// Invalidate course data (to update average rating)
				queryClient.invalidateQueries({
					queryKey: ["lms-course", data.data.courseId],
				});
			}
		},
	});
}

/**
 * Delete a review
 */
export function useDeleteReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (reviewId: string) => {
			const response = await axiosInstance.delete<{
				success: boolean;
				message: string;
			}>(`${BACKEND_URL_V1}/lms/reviews/${reviewId}`);
			return response.data;
		},
		onSuccess: () => {
			// Invalidate all review queries
			queryClient.invalidateQueries({
				queryKey: ["lms-course-reviews"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lms-my-review"],
			});
			queryClient.invalidateQueries({
				queryKey: ["lms-review"],
			});
		},
	});
}

// Type exports for convenience
export type {
	Review,
	ReviewAuthor,
	PaginatedReviews,
	ReviewResponse,
	RatingDistribution,
};
