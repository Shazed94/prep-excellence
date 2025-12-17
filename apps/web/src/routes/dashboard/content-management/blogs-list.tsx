import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogs } from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/blogs-list",
)({
	component: BlogsListPage,
});

interface Blog {
	id: string;
	name: string;
	title: string;
	category?: { name: string };
	author?: { name: string };
	status: string;
	_count: { comments: number };
	createdAt: string;
}

function BlogsListPage() {
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

	const columns: ColumnDef<Blog[0]>[] = [
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
	];

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
						<DataTable
							data={blogsData?.data || []}
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
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
