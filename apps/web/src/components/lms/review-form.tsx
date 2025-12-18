import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CreateLMSReviewInput,
	createLMSReviewSchema,
} from "@prepexcellence/shared-validators";
import { Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/lms-reviews";

interface ReviewFormProps {
	courseId: string;
	onSuccess?: () => void;
}

export function ReviewForm({ courseId, onSuccess }: ReviewFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hoveredRating, setHoveredRating] = useState(0);
	const createReview = useCreateReview();

	const form = useForm<CreateLMSReviewInput>({
		resolver: zodResolver(createLMSReviewSchema),
		defaultValues: {
			courseId,
			rating: 5,
			comment: "",
		},
	});

	const rating = form.watch("rating");

	const onSubmit = async (data: CreateLMSReviewInput) => {
		setIsSubmitting(true);
		try {
			await createReview.mutateAsync(data);
			toast.success("Review submitted successfully");
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to submit review");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="rating"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Rating</FormLabel>
							<FormControl>
								<div className="flex gap-2">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => field.onChange(star)}
											onMouseEnter={() => setHoveredRating(star)}
											onMouseLeave={() => setHoveredRating(0)}
											className="transition-transform hover:scale-110"
										>
											<Star
												className={`h-8 w-8 ${
													star <= (hoveredRating || rating)
														? "fill-yellow-400 text-yellow-400"
														: "text-gray-300"
												}`}
											/>
										</button>
									))}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Your Review (Optional)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Share your experience with this course..."
									rows={4}
									className="resize-none"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => form.reset()}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit Review"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
