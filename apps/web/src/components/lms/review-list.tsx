import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetCourseReviews, useGetMyReview } from "@/hooks/lms-reviews";
import { ReviewForm } from "./review-form";
import { ReviewItem } from "./review-item";

interface ReviewListProps {
	courseId: string;
	currentUserId?: string;
}

export function ReviewList({ courseId, currentUserId }: ReviewListProps) {
	const [page, setPage] = useState(1);
	const [showForm, setShowForm] = useState(false);
	const { data, isLoading, error } = useGetCourseReviews(courseId, page, 10);
	const { data: myReview } = useGetMyReview(courseId);

	if (isLoading) {
		return (
			<div className="flex justify-center py-8">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="py-8 text-center text-destructive">
					Failed to load reviews. Please try again later.
				</CardContent>
			</Card>
		);
	}

	const reviews = data?.data || [];
	const pagination = data?.pagination;
	const stats = data?.stats;
	const hasMyReview = myReview?.data !== null;

	const getRatingPercentage = (rating: number) => {
		if (!stats?.distribution) return 0;
		const total = stats.totalReviews;
		if (total === 0) return 0;
		const count = stats.distribution[rating as 1 | 2 | 3 | 4 | 5];
		return (count / total) * 100;
	};

	return (
		<div className="space-y-6">
			{/* Rating Summary */}
			{stats && (
				<Card>
					<CardHeader>
						<CardTitle>Course Rating</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-2 gap-6">
							{/* Overall Rating */}
							<div className="flex flex-col items-center justify-center">
								<div className="text-5xl font-bold">
									{stats.averageRating?.toFixed(1) || "0.0"}
								</div>
								<div className="flex my-2">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`h-6 w-6 ${
												star <= Math.round(stats.averageRating || 0)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<p className="text-sm text-muted-foreground">
									{stats.totalReviews}{" "}
									{stats.totalReviews === 1 ? "review" : "reviews"}
								</p>
							</div>

							{/* Rating Distribution */}
							<div className="space-y-2">
								{[5, 4, 3, 2, 1].map((rating) => (
									<div key={rating} className="flex items-center gap-2">
										<span className="text-sm w-8">{rating} ★</span>
										<Progress
											value={getRatingPercentage(rating)}
											className="flex-1"
										/>
										<span className="text-sm text-muted-foreground w-12 text-right">
											{stats.distribution[rating as 1 | 2 | 3 | 4 | 5]}
										</span>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Add Review Section */}
			{currentUserId && !hasMyReview && (
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Write a Review</CardTitle>
							{!showForm && (
								<Button onClick={() => setShowForm(true)}>Add Review</Button>
							)}
						</div>
					</CardHeader>
					{showForm && (
						<CardContent>
							<ReviewForm
								courseId={courseId}
								onSuccess={() => setShowForm(false)}
							/>
						</CardContent>
					)}
				</Card>
			)}

			{/* Reviews List */}
			<Card>
				<CardHeader>
					<CardTitle>Reviews ({stats?.totalReviews || 0})</CardTitle>
				</CardHeader>
				<CardContent>
					{reviews.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No reviews yet. Be the first to review this course!
						</p>
					) : (
						<div>
							{reviews.map((review) => (
								<ReviewItem
									key={review.id}
									review={review}
									currentUserId={currentUserId}
								/>
							))}

							{pagination && pagination.totalPages > 1 && (
								<div className="flex justify-center gap-2 mt-6">
									<Button
										variant="outline"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
									>
										Previous
									</Button>
									<span className="flex items-center px-4">
										Page {page} of {pagination.totalPages}
									</span>
									<Button
										variant="outline"
										onClick={() => setPage((p) => p + 1)}
										disabled={page >= pagination.totalPages}
									>
										Next
									</Button>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
