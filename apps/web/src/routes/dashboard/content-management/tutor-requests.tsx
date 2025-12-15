import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	useDeleteTutorRequest,
	useGetTutorRequests,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/tutor-requests",
)({
	component: RouteComponent,
});

function RouteComponent() {
	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const {
		data: requests,
		isLoading,
		isError,
	} = useGetTutorRequests(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		sorting.sortBy || "id",
		sorting.sortOrder,
	);
	const deleteMutation = useDeleteTutorRequest();
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
			accessorKey: "parentName",
			header: createSortableHeader("Parent Name"),
			cell: ({ row }) => {
				const parentName = row.getValue("parentName") as string;
				return <div className="truncate max-w-[150px]">{parentName}</div>;
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
			accessorKey: "email",
			header: createSortableHeader("Email"),
			cell: ({ row }) => {
				const email = row.getValue("email") as string;
				return <div className="truncate max-w-[200px]">{email}</div>;
			},
		},
		{
			accessorKey: "phoneNumber",
			header: "Phone",
			cell: ({ row }) => {
				const phone = row.getValue("phoneNumber") as string;
				return <div className="truncate max-w-[120px]">{phone}</div>;
			},
		},
		{
			accessorKey: "studentGrade",
			header: "Grade",
			cell: ({ row }) => {
				const grade = row.getValue("studentGrade") as string;
				return <Badge variant="outline">{grade}</Badge>;
			},
		},
		{
			accessorKey: "tutorType",
			header: "Tutor Type",
			cell: ({ row }) => {
				const tutorType = row.getValue("tutorType") as string[];
				return (
					<div className="flex flex-wrap gap-1 max-w-[200px]">
						{tutorType?.slice(0, 2).map((item, idx) => (
							<Badge key={idx} variant="secondary" className="text-xs">
								{item}
							</Badge>
						))}
						{tutorType?.length > 2 && (
							<Badge variant="secondary" className="text-xs">
								+{tutorType.length - 2}
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "needHelp",
			header: "Subject",
			cell: ({ row }) => {
				const needHelp = row.getValue("needHelp") as string;
				return (
					<div className="truncate max-w-[150px]" title={needHelp}>
						{needHelp}
					</div>
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
							title="Delete Tutor Request"
							description={
								<>
									Are you sure you want to delete this tutor request from{" "}
									<span className="font-bold">{row.original.parentName}</span>?
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
				queryClient.invalidateQueries({ queryKey: ["tutor-request", "get"] });
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error</p>;

	// Extract data from axios response
	const responseData = requests?.data || [];
	const paginationInfo = requests?.pagination;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">
						Tutor Request Registrations
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage tutor request submissions
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
					emptyMessage="No tutor requests found. Try adjusting your search."
					hasNext={paginationInfo?.hasNext}
					hasPrev={paginationInfo?.hasPrev}
					total={paginationInfo?.total}
				/>
			</div>
		</div>
	);
}
