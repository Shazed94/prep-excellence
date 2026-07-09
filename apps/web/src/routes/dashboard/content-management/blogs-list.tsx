import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useBlog, useBlogs, useDeleteBlog } from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/blogs-list",
)({
	component: BlogsListPage,
});

interface Blog {
	id: string;
	title: string;
	image?: string;
	category?: { name: string };
	author?: { name: string };
	status: string;
	_count?: { comments: number };
	createdAt: string;
}

// ViewBlogModal Component
interface ViewBlogModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	blogId: string;
}

function ViewBlogModal({ open, onOpenChange, blogId }: ViewBlogModalProps) {
	const { data: blogData, isLoading } = useBlog(blogId, open);

	const blog = blogData?.data;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>View Blog Post</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				) : blog ? (
					<div className="space-y-6">
						{/* Blog Image */}
						{blog.image && (
							<div className="w-full h-64 rounded-lg overflow-hidden border">
								<img
									src={blog.image}
									alt={blog.title}
									className="w-full h-full object-cover"
								/>
							</div>
						)}

						{/* Title and Metadata */}
						<div className="space-y-2">
							<h2 className="text-2xl font-bold">{blog.title}</h2>
							<div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
								<Badge variant="outline">{blog.status}</Badge>
								<span>•</span>
								<span>Category: {blog.category?.name || "N/A"}</span>
								<span>•</span>
								<span>Author: {blog.author?.name || "N/A"}</span>
								<span>•</span>
								<span>
									Created: {new Date(blog.createdAt).toLocaleDateString()}
								</span>
							</div>
						</div>

						{/* Tags */}
						{blog.tags && blog.tags.length > 0 && (
							<div className="space-y-2">
								<h3 className="font-semibold">Tags</h3>
								<div className="flex flex-wrap gap-2">
									{blog.tags.map((tag: string, index: number) => (
										<Badge key={index} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Description */}
						<div className="space-y-2">
							<h3 className="font-semibold">Content</h3>
							<div className="prose max-w-none">
								{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is sanitized */}
								<div dangerouslySetInnerHTML={{ __html: blog.description }} />
							</div>
						</div>
					</div>
				) : (
					<p>Blog not found</p>
				)}
			</DialogContent>
		</Dialog>
	);
}

function BlogsListPage() {
	const navigate = useNavigate();
	const deleteMutation = useDeleteBlog();
	const [viewBlogId, setViewBlogId] = useState<string | null>(null);

	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const { data: blogsData, isLoading } = useBlogs({
		page: pagination.pageIndex + 1,
		limit: pagination.pageSize,
		search: searchTerm,
		sortBy: sorting.sortBy || "createdAt",
		orderBy: sorting.sortOrder,
	});

	const handleEdit = (blog: Blog) => {
		navigate({
			to: "/dashboard/content-management/create-blog",
			search: { editId: blog.id },
		});
	};

	const handleView = (blog: Blog) => {
		setViewBlogId(blog.id);
	};

	const handleDelete = async (blogId: string) => {
		try {
			await deleteMutation.mutateAsync(blogId);
		} catch (error: any) {
			toast.error(error?.message);
		}
	};

	const columns: ColumnDef<Blog>[] = [
		{
			header: "Title",
			accessorKey: "title",
		},
		{
			header: "Image",
			accessorKey: "image",
			cell: ({ row }) =>
				row.original.image ? (
					<img
						src={row.original.image}
						alt={row.original.title}
						className="h-10 w-10 object-cover rounded"
					/>
				) : (
					"-"
				),
		},
		{
			header: "Category",
			cell: ({ row }: { row: any }) => row.original.category?.name || "-",
		},
		{
			header: "Author",
			cell: ({ row }: { row: any }) => row.original.author?.name || "-",
		},
		{
			id: "status",
			header: "Status",
			accessorKey: "status",
		},
		{
			header: "Comments",
			accessorKey: "_count.comments",
		},
		{
			header: "Created",
			accessorKey: "createdAt",
		},
		{
			id: "actions",
			header: () => <div className="text-right">Action</div>,
			cell: ({ row }) => {
				const original = row.original;
				return (
					<div className="flex justify-end gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleView(original)}
						>
							<Eye className="w-4 h-4 mr-1" />
							View
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleEdit(original)}
						>
							<Pencil className="w-4 h-4 mr-1" />
							Edit
						</Button>
						<DeleteConfirmationDialog
							trigger={
								<Button variant="destructive" size="sm">
									Delete
								</Button>
							}
							title="Delete Blog Post"
							description={
								<>
									Are you sure you want to delete{" "}
									<span className="font-bold">{original.title}</span>?
								</>
							}
							confirmText="Delete"
							variant="destructive"
							onConfirm={() => handleDelete(original.id)}
						/>
					</div>
				);
			},
		},
	];

	return (
		<div className=" py-6 space-y-6">
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

			<DataTable
				data={blogsData?.data! || []}
				columns={columns}
				manualPagination
				pageCount={blogsData?.pagination?.totalPages}
				pageIndex={pagination.pageIndex}
				pageSize={pagination.pageSize}
				onPaginationChange={setPagination}
				onSearch={setSearchTerm}
				searchValue={searchTerm}
				isLoading={isLoading}
				hasNext={blogsData?.pagination?.hasNext}
				hasPrev={blogsData?.pagination?.hasPrev}
				total={blogsData?.pagination?.total}
				emptyMessage="No blog posts found."
				className="mt-4"
				searchPlaceholder="Search blog posts..."
				searchKey="title"
			/>

			{/* View Blog Modal */}
			{viewBlogId && (
				<ViewBlogModal
					open={!!viewBlogId}
					onOpenChange={(open) => !open && setViewBlogId(null)}
					blogId={viewBlogId}
				/>
			)}
		</div>
	);
}
