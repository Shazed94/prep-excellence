import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Review, useDeleteReview } from "@/hooks/lms-reviews";

interface ReviewItemProps {
	review: Review;
	currentUserId?: string;
	onEdit?: (review: Review) => void;
}

export function ReviewItem({ review, currentUserId, onEdit }: ReviewItemProps) {
	const deleteReview = useDeleteReview();
	const isAuthor = currentUserId === review.student.userId;

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this review?")) return;

		try {
			await deleteReview.mutateAsync(review.id);
			toast.success("Review deleted successfully");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to delete review");
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="flex gap-4 py-4 border-b last:border-0">
			<Avatar className="h-12 w-12">
				<AvatarImage src={review.student.user.image || undefined} />
				<AvatarFallback>{getInitials(review.student.user.name)}</AvatarFallback>
			</Avatar>{" "}
			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between">
					<div>
						<p className="font-semibold">{review.student.user.name}</p>
						<div className="flex items-center gap-2">
							<div className="flex">
								{[1, 2, 3, 4, 5].map((star) => (
									<Star
										key={star}
										className={`h-4 w-4 ${
											star <= review.rating
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<span className="text-xs text-muted-foreground">
								{formatDistanceToNow(new Date(review.createdAt), {
									addSuffix: true,
								})}
							</span>
						</div>
					</div>

					{isAuthor && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => onEdit?.(review)}>
									<Pencil className="h-4 w-4 mr-2" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleDelete}
									className="text-destructive"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>

				{review.comment && (
					<p className="text-sm text-muted-foreground whitespace-pre-wrap">
						{review.comment}
					</p>
				)}
			</div>
		</div>
	);
}
