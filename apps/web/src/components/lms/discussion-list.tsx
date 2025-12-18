import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLessonDiscussions } from "@/hooks/lms-discussions";
import { DiscussionForm } from "./discussion-form";
import { DiscussionItem } from "./discussion-item";

interface DiscussionListProps {
	lessonId: string;
	currentUserId?: string;
}

export function DiscussionList({
	lessonId,
	currentUserId,
}: DiscussionListProps) {
	const [page, setPage] = useState(1);
	const { data, isLoading, error } = useGetLessonDiscussions(
		lessonId,
		page,
		10,
	);

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
					Failed to load discussions. Please try again later.
				</CardContent>
			</Card>
		);
	}

	const discussions = data?.data || [];
	const pagination = data?.pagination;

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>New Discussion</CardTitle>
				</CardHeader>
				<CardContent>
					<DiscussionForm lessonId={lessonId} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Discussions ({pagination?.total || 0})</CardTitle>
				</CardHeader>
				<CardContent>
					{discussions.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No discussions yet. Be the first to start a conversation!
						</p>
					) : (
						<div className="space-y-6">
							{discussions.map((discussion) => (
								<DiscussionItem
									key={discussion.id}
									discussion={discussion}
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
