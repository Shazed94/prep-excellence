import { formatDistanceToNow } from "date-fns";
import { MessageCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Discussion, useDeleteDiscussion } from "@/hooks/lms-discussions";
import { DiscussionForm } from "./discussion-form";

interface DiscussionItemProps {
	discussion: Discussion;
	currentUserId?: string;
	onEdit?: (discussion: Discussion) => void;
	level?: number;
}

export function DiscussionItem({
	discussion,
	currentUserId,
	onEdit,
	level = 0,
}: DiscussionItemProps) {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [showReplies, setShowReplies] = useState(true);
	const deleteDiscussion = useDeleteDiscussion();

	const isAuthor = currentUserId === discussion.authorId;
	const hasReplies = discussion.replies && discussion.replies.length > 0;

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this discussion?")) return;

		try {
			await deleteDiscussion.mutateAsync(discussion.id);
			toast.success("Discussion deleted successfully");
		} catch (error: any) {
			toast.error(
				error.response?.data?.message || "Failed to delete discussion",
			);
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
		<div className={`space-y-3 ${level > 0 ? "ml-8 border-l-2 pl-4" : ""}`}>
			<div className="flex gap-3">
				<Avatar className="h-10 w-10">
					<AvatarImage src={discussion.author.image || undefined} />
					<AvatarFallback>{getInitials(discussion.author.name)}</AvatarFallback>
				</Avatar>{" "}
				<div className="flex-1 space-y-2">
					<div className="flex items-start justify-between">
						<div>
							<p className="font-semibold text-sm">{discussion.author.name}</p>
							<p className="text-xs text-muted-foreground">
								{formatDistanceToNow(new Date(discussion.createdAt), {
									addSuffix: true,
								})}
								{discussion.isEdited && " (edited)"}
							</p>
						</div>

						{isAuthor && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => onEdit?.(discussion)}>
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

					<p className="text-sm whitespace-pre-wrap">{discussion.content}</p>

					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowReplyForm(!showReplyForm)}
						>
							<MessageCircle className="h-4 w-4 mr-1" />
							Reply
						</Button>

						{hasReplies && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? "Hide" : "Show"} {discussion.replies?.length}{" "}
								{discussion.replies?.length === 1 ? "reply" : "replies"}
							</Button>
						)}
					</div>

					{showReplyForm && (
						<div className="mt-3">
							<DiscussionForm
								lessonId={discussion.lessonId}
								parentId={discussion.id}
								placeholder="Write your reply..."
								submitButtonText="Reply"
								onSuccess={() => setShowReplyForm(false)}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Nested Replies */}
			{showReplies && hasReplies && (
				<div className="space-y-3">
					{discussion.replies?.map((reply) => (
						<DiscussionItem
							key={reply.id}
							discussion={reply}
							currentUserId={currentUserId}
							onEdit={onEdit}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}
