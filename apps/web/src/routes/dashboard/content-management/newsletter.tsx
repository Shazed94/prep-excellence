import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useDeleteNewsletter } from "@/hooks/content-management";
import { useGetCourses } from "@/hooks/course-management";

export const Route = createFileRoute(
	"/dashboard/content-management/newsletter",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: courses, isLoading, isError } = useGetCourses();
	const deleteMutation = useDeleteNewsletter();
	const queryClient = useQueryClient();

	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => {
				const sl = row.index + 1;
				return <div className="text-left">{sl}</div>;
			},
		},
		{
			accessorKey: "title",
			header: "Title",
			cell: ({ row }) => {
				const title = row.getValue("title") as string;
				return <div className="truncate max-w-[260px]">{title}</div>;
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right">Action</div>,
			cell: ({ row }) => {
				const original = row.original as { id: string };
				const id = original.id;

				return (
					<div className="flex justify-end gap-2">
						<DeleteConfirmationDialog
							trigger={
								<Button
									variant="destructive"
									size="sm"
									className="cursor-pointer"
								>
									Delete
								</Button>
							}
							title="Delete Newsletter"
							description={
								<>
									Are you sure you want to delete this newsletter?{" "}
									<span className="font-bold">{original.email}</span>
								</>
							}
							confirmText="Delete"
							variant="destructive"
							onConfirm={() => handleDelete(id)}
							isLoading={deleteMutation.isPending}
						/>
					</div>
				);
			},
		},
	];

	const handleDelete = (id: string) => {
		deleteMutation.mutate(id, {
			onSuccess: (res) => {
				toast.success(res.message);
				queryClient.invalidateQueries({ queryKey: ["newsletter", "get"] });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
		console.log("Deleting course:", id);
		// Example: mutate({ id });
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error</p>;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Course Management</h1>
					<p className="text-sm text-muted-foreground">
						Manage and organize all your courses
					</p>
				</div>

				<Link
					to="/dashboard/course-management/create"
					className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					+ Create Course
				</Link>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={courses?.data?.data || []}
					columns={columns}
					searchKey="title"
					searchPlaceholder="Search by title..."
					title=""
				/>
			</div>
		</div>
	);
}
