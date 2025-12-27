export interface InstructorUser {
	id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
}

export interface Instructor {
	id: string;
	user: InstructorUser;
	experienceYears: number;
	subjects: string[];
	certifications: string[];
	bio?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PaginatedInstructorResponse {
	data: Instructor[];
	meta?: {
		total: number;
		page: number;
		limit: number;
	};
}

import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import {
	useDeleteInstructor,
	useGetInstructors,
	useUpdateInstructor,
} from "@/hooks/instructor";
import { useTableStore } from "@/store/usePagination";
import EditInstructorDialog from "./edit-instructor-modal";

export const Route = // "/dashboard/instructor-portal/view-instructor",
	createFileRoute("/dashboard/instructor-portal/view-instructor")({
		component: RouteComponent,
	});

function RouteComponent() {
	const queryClient = useQueryClient();
	const deleteInstructor = useDeleteInstructor();
	const updateInstructor = useUpdateInstructor();

	// State for edit dialog
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedInstructor, setSelectedInstructor] =
		useState<Instructor | null>(null);

	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const {
		data: instructorsData,
		isError,
		isLoading: isLoadingData,
	} = useGetInstructors(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		sorting.sortBy || "id",
		sorting.sortOrder,
	);

	const handleDelete = (id: string) => {
		deleteInstructor.mutate(id, {
			onSuccess: (res) => {
				queryClient.invalidateQueries({ queryKey: ["instructors"] });
				toast.success(res.message || "Instructor deleted successfully");
			},
			onError: (err: any) => {
				toast.error(err.message || "Failed to delete instructor");
			},
		});
	};

	const handleEdit = (instructor: Instructor) => {
		setSelectedInstructor(instructor);
		setIsEditDialogOpen(true);
	};

	const handleSaveEdit = (data: any) => {
		if (!selectedInstructor) return;

		updateInstructor.mutate(
			{ id: selectedInstructor.id, data },
			{
				onSuccess: () => {
					toast.success("Instructor updated successfully");
					setIsEditDialogOpen(false);
					setSelectedInstructor(null);
				},
				onError: (error: any) => {
					toast.error(error.message || "Failed to update instructor");
				},
			},
		);
	};

	// Filter data based on search term
	const filteredInstructors =
		instructorsData?.data?.filter((instructor: Instructor) => {
			if (!searchTerm) return true;

			const searchLower = searchTerm.toLowerCase();
			const userName = instructor.user?.name || "";
			const userEmail = instructor.user?.email || "";
			const userPhone = instructor.user?.phone || "";

			return (
				userName.toLowerCase().includes(searchLower) ||
				userEmail.toLowerCase().includes(searchLower) ||
				userPhone.toLowerCase().includes(searchLower)
			);
		}) || [];

	// Calculate pagination info
	// const paginatedInstructors = filteredInstructors.slice(
	// 	pagination.pageIndex * pagination.pageSize,
	// 	(pagination.pageIndex + 1) * pagination.pageSize,
	// );

	const columns: ColumnDef<Instructor>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => {
				const index =
					pagination.pageIndex * pagination.pageSize + row.index + 1;
				return index;
			},
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.user?.name || "-"}</div>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => (
				<div className="truncate">{row.original.user?.email || "-"}</div>
			),
		},
		{
			accessorKey: "phone",
			header: "Phone",
			cell: ({ row }) => <div>{row.original.user?.phone || "-"}</div>,
		},
		{
			accessorKey: "address",
			header: "Address",
			cell: ({ row }) => (
				<div className="truncate ">{row.original.user?.address || "-"}</div>
			),
		},
		{
			accessorKey: "experienceYears",
			header: "Experience",
			cell: ({ row }) => <span>{row.original.experienceYears} years</span>,
		},
		{
			accessorKey: "subjects",
			header: "Subjects",
			cell: ({ row }) => (
				<div className="truncate">
					{Array.isArray(row.original.subjects)
						? row.original.subjects.join(", ")
						: "-"}
				</div>
			),
		},
		{
			accessorKey: "certifications",
			header: "Certificate",
			cell: ({ row }) => (
				<div className="truncate">
					{Array.isArray(row.original.certifications)
						? row.original.certifications.join(", ")
						: "-"}
				</div>
			),
		},
		{
			accessorKey: "bio",
			header: "Bio",
			cell: ({ row }) => (
				<div className="truncate ">{row.original.bio || "-"}</div>
			),
		},
		{
			id: "actions",
			header: () => <div className="text-right">Action</div>,
			cell: ({ row }) => {
				const instructor = row.original;
				const userName = instructor.user?.name || "Instructor";

				return (
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleEdit(instructor)}
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
							title="Delete Instructor"
							description={
								<>
									Are you sure you want to delete{" "}
									<span className="font-semibold">{userName}</span>?
								</>
							}
							confirmText="Delete"
							variant="destructive"
							onConfirm={() => handleDelete(instructor.id)}
							isLoading={deleteInstructor.isPending}
						/>
					</div>
				);
			},
		},
	];

	if (isLoadingData) return <p>Loading...</p>;
	if (isError) return <p>Error loading instructors</p>;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Instructors</h1>
				<Button asChild>
					<a href="/dashboard/instructor-portal/add-instructor">
						<Plus className="w-4 h-4 mr-2" />
						Add Instructor
					</a>
				</Button>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={filteredInstructors}
					columns={columns}
					searchKey={"name" as keyof Instructor}
					isLoading={isLoadingData}
					searchPlaceholder="Search instructor..."
					emptyMessage="No instructors found"
					manualPagination
					pageCount={Math.ceil(
						filteredInstructors.length / pagination.pageSize,
					)}
					pageIndex={pagination.pageIndex}
					pageSize={pagination.pageSize}
					onPaginationChange={setPagination}
					onSearch={setSearchTerm}
					searchValue={searchTerm}
					total={filteredInstructors.length}
					hasNext={
						(pagination.pageIndex + 1) * pagination.pageSize <
						filteredInstructors.length
					}
					hasPrev={pagination.pageIndex > 0}
				/>
			</div>

			{/* Edit Dialog */}
			<EditInstructorDialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				instructor={selectedInstructor}
				onSave={handleSaveEdit}
				isLoading={updateInstructor.isPending}
			/>
		</div>
	);
}
