import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	useDeleteCollegeEssayReview,
	useGetCollegeEssayReviews,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/college-essay-reviews",
)({
	component: RouteComponent,
});

function RouteComponent() {
	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const {
		data: reviews,
		isLoading,
		isError,
	} = useGetCollegeEssayReviews(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		sorting.sortBy || "id",
		sorting.sortOrder,
	);
	const deleteMutation = useDeleteCollegeEssayReview();
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
			accessorKey: "studentName",
			header: createSortableHeader("Student Name"),
			cell: ({ row }) => {
				const studentName = row.getValue("studentName") as string;
				return <div className="truncate max-w-[150px]">{studentName}</div>;
			},
		},
		{
			accessorKey: "parentName",
			header: createSortableHeader("Parent Name"),
			cell: ({ row }) => {
				const parentName = row.getValue("parentName") as string;
				return <div className="truncate max-w-[150px]">{parentName}</div>;
			},
		},
		{
			accessorKey: "email",
			header: createSortableHeader("Email"),
			cell: ({ row }) => {
				const email = row.getValue("email") as string;
				return <div className="truncate max-w-[200px]">{email}</div>;
			},
		},
		{
			accessorKey: "phone",
			header: "Phone",
			cell: ({ row }) => {
				const phone = row.getValue("phone") as string;
				return <div className="truncate max-w-[120px]">{phone}</div>;
			},
		},
		{
			accessorKey: "grade",
			header: "Grade",
			cell: ({ row }) => {
				const grade = row.getValue("grade") as string;
				return <Badge variant="outline">{grade}</Badge>;
			},
		},
		{
			accessorKey: "studentSchool",
			header: "School",
			cell: ({ row }) => {
				const school = row.getValue("studentSchool") as string;
				return <div className="truncate max-w-[150px]">{school}</div>;
			},
		},
		{
			accessorKey: "collegeTarget",
			header: "Target College",
			cell: ({ row }) => {
				const college = row.getValue("collegeTarget") as string;
				return (
					<div className="truncate max-w-[150px]" title={college}>
						{college}
					</div>
				);
			},
		},
		{
			accessorKey: "agreedToTerms",
			header: "Agreed",
			cell: ({ row }) => {
				const agreed = row.getValue("agreedToTerms") as boolean;
				return (
					<Badge variant={agreed ? "default" : "destructive"}>
						{agreed ? "Yes" : "No"}
					</Badge>
				);
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
							title="Delete College Essay Review"
							description={
								<>
									Are you sure you want to delete this review submission from{" "}
									<span className="font-bold">{row.original.studentName}</span>?
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
				queryClient.invalidateQueries({
					queryKey: ["college-essay-review", "get"],
				});
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error</p>;

	// Extract data from axios response
	const responseData = reviews?.data || [];
	const paginationInfo = reviews?.pagination;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">
						College Essay Review Registrations
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage college essay review submissions
					</p>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={responseData || []}
					columns={columns}
					searchKey="email"
					searchPlaceholder="Search by email, name..."
					manualPagination
					pageCount={paginationInfo?.totalPages}
					pageIndex={pagination.pageIndex}
					pageSize={pagination.pageSize}
					onPaginationChange={setPagination}
					onSearch={setSearchTerm}
					searchValue={searchTerm}
					isLoading={isLoading}
					emptyMessage="No college essay reviews found. Try adjusting your search."
					hasNext={paginationInfo?.hasNext}
					hasPrev={paginationInfo?.hasPrev}
					total={paginationInfo?.total}
				/>
			</div>
		</div>
	);
}
