import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { type Blog, useBlogs, useDeleteBlog } from "@/hooks/content-management";

export const Route = createFileRoute(
	"/dashboard/content-management/blogs-list",
)({
	component: BlogsListPage,
});

function BlogsListPage() {
	const [page] = useState(1);
	const [limit] = useState(10);

	const { data: blogsData, isLoading } = useBlogs({
		page,
		limit,
	});

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Blog Posts</h1>
					<p className="text-muted-foreground">
						Manage your blog posts and content
					</p>
				</div>
				<Link
					to="/dashboard/content-management/create-blog"
					search={{ editId: undefined }}
				>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Blog
					</Button>
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>All Blogs</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin" />
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Title</TableHead>
									<TableHead>Category</TableHead>
									<TableHead>Author</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Comments</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{blogsData?.data?.map((blog: Blog) => (
									<TableRow key={blog.id}>
										<TableCell className="font-medium max-w-xs truncate">
											{blog.title}
										</TableCell>
										<TableCell>{blog.category.name}</TableCell>
										<TableCell>{blog.author.name}</TableCell>
										<TableCell>
											<Badge
												variant={
													blog.status === "PUBLISHED"
														? "default"
														: blog.status === "DRAFT"
															? "secondary"
															: "outline"
												}
											>
												{blog.status}
											</Badge>
										</TableCell>
										<TableCell>{blog._count?.comments || 0}</TableCell>
										<TableCell>
											{new Date(blog.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Link
													to="/dashboard/content-management/create-blog"
													search={{ editId: blog.id }}
												>
													<Button variant="ghost" size="sm">
														<Pencil className="h-4 w-4" />
													</Button>
												</Link>
												<DeleteBlogButton blogId={blog.id} />
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function DeleteBlogButton({ blogId }: { blogId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const deleteMutation = useDeleteBlog();

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync(blogId);
			toast.success("Blog deleted successfully!");
			setIsOpen(false);
		} catch (error: any) {
			toast.error(error?.message || "Failed to delete blog");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Trash2 className="h-4 w-4 text-red-500" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Blog</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this blog post? This action cannot
						be undone.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
