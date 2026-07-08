import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import parse from "html-react-parser";
import {
	Award,
	Calendar,
	Clock,
	Edit2,
	Eye,
	GraduationCap,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { FreeSeminarFormDialog } from "@/components/FreeSeminarFoemDialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	type FreeSeminar,
	useDeleteFreeSeminar,
	useGetFreeSeminars,
	usePostFreeSeminar,
	useUpdateFreeSeminar,
	useViewFreeSeminar,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/free-seminars",
)({
	component: RouteComponent,
});

// InfoItem component moved outside
function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | React.ReactNode;
}) {
	return (
		<div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
			<Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
			<div className="flex-1 min-w-0">
				<p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
					{label}
				</p>
				<p className="text-sm text-gray-900 font-medium mt-1">{value}</p>
			</div>
		</div>
	);
}

export function ViewDetailsDialog({
	seminar,
	open,
	onOpenChange,
}: {
	seminar: FreeSeminar | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!seminar) return null;

	const enrollmentPercentage = seminar.capacity
		? Math.round((seminar._count.enrollments / seminar.capacity) * 100)
		: 0;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader className="pb-4 border-b shrink-0">
					<DialogTitle className="text-lg md:text-xl font-semibold flex items-center gap-2">
						<GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-blue-600 shrink-0" />
						<span className="truncate">
							{seminar.title || "Seminar Details"}
						</span>
					</DialogTitle>
				</DialogHeader>

				<div className="overflow-y-auto flex-1">
					<div className="space-y-6 p-4 md:p-6">
						{/* Image */}
						{seminar.image && (
							<div className="w-full max-w-sm h-40 md:h-48 rounded-lg overflow-hidden border border-gray-200">
								<img
									src={seminar.image}
									alt={seminar.title}
									className="w-full h-full object-cover"
								/>
							</div>
						)}

						{/* Seminar Information */}
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
								<GraduationCap className="w-4 h-4 text-blue-600" />
								Seminar Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<InfoItem
									icon={Calendar}
									label="Date"
									value={`${new Date(seminar.startDate).toLocaleDateString(
										"en-US",
										{ dateStyle: "medium" },
									)} - ${new Date(seminar.endDate).toLocaleDateString("en-US", {
										dateStyle: "medium",
									})}`}
								/>
								<InfoItem
									icon={Clock}
									label="Time"
									value={`${format(
										new Date(seminar.startTime),
										"hh:mm a",
									)} - ${format(new Date(seminar.endTime), "hh:mm a")}`}
								/>
								<InfoItem
									icon={User}
									label="Capacity"
									value={`${seminar.capacity} participants`}
								/>
								<InfoItem
									icon={Award}
									label="Status"
									value={
										<span
											className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
												seminar.isActive
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{seminar.isActive ? "Active" : "Inactive"}
										</span>
									}
								/>
							</div>
						</div>

						{/* Description */}
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								Description
							</h3>
							<div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 prose prose-sm max-w-none">
								{parse(seminar.description)}
							</div>
						</div>

						{/* Enrollment Section */}
						<div>
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
									<Users className="w-4 h-4 text-blue-600" />
									Enrollments
								</h3>
								<div className="text-sm text-gray-600">
									<span className="font-semibold text-gray-900">
										{seminar._count.enrollments}
									</span>
									<span className="text-gray-500"> / </span>
									<span className="font-semibold text-gray-900">
										{seminar.capacity}
									</span>
									<span className="text-gray-500 ml-1">
										({enrollmentPercentage}%)
									</span>
								</div>
							</div>

							{/* Progress Bar */}
							<div className="mb-4">
								<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
									<div
										className="bg-blue-600 h-2 rounded-full transition-all"
										style={{ width: `${enrollmentPercentage}%` }}
									/>
								</div>
							</div>

							{/* Enrollments Table */}
							{seminar.enrollments && seminar.enrollments.length > 0 ? (
								<div className="border border-gray-200 rounded-lg overflow-hidden">
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead className="bg-gray-50 border-b border-gray-200">
												<tr>
													<th className="px-3 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
														Name
													</th>
													<th className="px-3 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
														Email
													</th>
													<th className="px-3 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900 text-xs md:text-sm hidden md:table-cell">
														Phone
													</th>
													<th className="px-3 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900 text-xs md:text-sm hidden lg:table-cell">
														Country
													</th>
													<th className="px-3 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
														Enrolled
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{seminar.enrollments.map((enrollment) => (
													<tr
														key={enrollment.id}
														className="hover:bg-gray-50 transition-colors"
													>
														<td className="px-3 md:px-4 py-2 md:py-3 text-gray-900 font-medium text-xs md:text-sm">
															{enrollment.firstName} {enrollment.lastName}
														</td>
														<td className="px-3 md:px-4 py-2 md:py-3 text-gray-600 text-xs md:text-sm">
															<a
																href={`mailto:${enrollment.email}`}
																className="text-blue-600 hover:underline truncate block"
																title={enrollment.email}
															>
																{enrollment.email}
															</a>
														</td>
														<td className="px-3 md:px-4 py-2 md:py-3 text-gray-600 text-xs md:text-sm hidden md:table-cell">
															<a
																href={`tel:${enrollment.phone}`}
																className="text-blue-600 hover:underline"
															>
																{enrollment.phone}
															</a>
														</td>
														<td className="px-3 md:px-4 py-2 md:py-3 text-gray-600 text-xs md:text-sm hidden lg:table-cell">
															{enrollment.country || "—"}
														</td>
														<td className="px-3 md:px-4 py-2 md:py-3 text-gray-500 text-xs md:text-sm">
															{new Date(
																enrollment.createdAt,
															).toLocaleDateString("en-US", {
																dateStyle: "short",
															})}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							) : (
								<div className="p-8 text-center rounded-lg bg-gray-50 border border-gray-200">
									<Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
									<p className="text-gray-600 font-medium">
										No enrollments yet
									</p>
								</div>
							)}
						</div>

						{/* Creation Info */}
						{seminar.createdAt && (
							<div className="pt-4 border-t">
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<Calendar className="w-4 h-4 shrink-0" />
									<span className="font-medium">Created:</span>
									<span>
										{new Date(seminar.createdAt).toLocaleString("en-US", {
											dateStyle: "medium",
											timeStyle: "short",
										})}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="pt-4 border-t shrink-0">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function RouteComponent() {
	const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(
		null,
	);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const { data: viewData, isLoading: _isViewLoading } = useViewFreeSeminar(
		selectedSeminarId ?? "",
	);
	const selectedSeminar = viewData?.data || null;
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingSeminar, setEditingSeminar] = useState<FreeSeminar | null>(
		null,
	);
	console.log("editingSeminar", editingSeminar);
	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const {
		data: seminars,
		isLoading,
		isError,
	} = useGetFreeSeminars(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		sorting.sortBy || "id",
		sorting.sortOrder,
	);

	const createSeminarMutation = usePostFreeSeminar();
	const updateSeminarMutation = useUpdateFreeSeminar();
	const deleteMutation = useDeleteFreeSeminar();
	const queryClient = useQueryClient();

	// Handle create
	const handleCreateSeminar = async (formData: FormData) => {
		try {
			createSeminarMutation.mutate(formData, {
				onSuccess: (res) => {
					toast.success(res.message || "Seminar created successfully");
					queryClient.invalidateQueries({
						queryKey: ["free-seminars", "get"],
					});
				},
				onError: (error: any) => {
					const message =
						error?.response?.data?.message ||
						error?.message ||
						"Failed to create seminar";
					toast.error(message);
				},
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	// Handle update
	const handleUpdateSeminar = async (formData: FormData) => {
		if (!editingSeminar) return;

		try {
			await new Promise((resolve, reject) => {
				updateSeminarMutation.mutate(
					{ id: editingSeminar.id, data: formData },
					{
						onSuccess: (res) => {
							toast.success(res.message || "Seminar updated successfully");
							queryClient.invalidateQueries({
								queryKey: ["free-seminars", "get"],
							});
							setEditingSeminar(null);
							resolve(res);
						},
						onError: (error: any) => {
							const message =
								error?.response?.data?.message ||
								error?.message ||
								"Failed to update seminar";
							toast.error(message);
							reject(error);
						},
					},
				);
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleView = (seminar: FreeSeminar) => {
		setSelectedSeminarId(seminar.id);
		setIsViewOpen(true);
	};

	const handleEdit = (seminar: FreeSeminar) => {
		setEditingSeminar(seminar);
		setIsFormOpen(true);
	};

	const columns: ColumnDef<FreeSeminar>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => {
				const sl = row.index + 1 + pagination.pageIndex * pagination.pageSize;
				return <div className="text-left">{sl}</div>;
			},
		},
		{
			accessorKey: "title",
			header: createSortableHeader("Title"),
			cell: ({ row }) => {
				const title = row.getValue("title") as string;
				return <div className="truncate max-w-[200px]">{title}</div>;
			},
		},
		{
			header: "Date",
			cell: ({ row }) => {
				const startDate = row.original.startDate;
				const endDate = row.original.endDate;
				const starttime = row.original.startTime;
				const endtime = row.original.endTime;

				return (
					<div>
						{format(startDate, "dd")} - {format(endDate, "dd MMM yyyy")} <br />
						{format(starttime, "hh:mm a")} to {format(endtime, "hh:mm a")}
					</div>
				);
			},
		},
		{
			accessorKey: "capacity",
			header: "Capacity",
			cell: ({ row }) => {
				const capacity = row.getValue("capacity") as number;
				return <div>{capacity}</div>;
			},
		},
		{
			accessorKey: "isActive",
			header: "Status",
			cell: ({ row }) => {
				const isActive = row.getValue("isActive") as boolean;
				return (
					<div>
						<span
							className={`px-2 py-1 rounded-full text-xs font-semibold ${
								isActive
									? "bg-green-100 text-green-800"
									: "bg-gray-100 text-gray-800"
							}`}
						>
							{isActive ? "Active" : "Inactive"}
						</span>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right">Actions</div>,
			cell: ({ row }) => {
				const original = row.original;
				return (
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
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
							<Edit2 className="w-4 h-4 mr-1" />
							Edit
						</Button>
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
							title="Delete Seminar"
							description={
								<>
									Are you sure you want to delete the seminar{" "}
									<span className="font-bold">{original.title}</span>?
								</>
							}
							confirmText="Delete"
							variant="destructive"
							onConfirm={() => handleDelete(original.id)}
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
				toast.success(res.message || "Seminar deleted successfully");
				queryClient.invalidateQueries({ queryKey: ["free-seminars", "get"] });
			},
			onError: (error: any) => {
				const message =
					error?.response?.data?.message ||
					error?.message ||
					"Failed to delete seminar";
				toast.error(message);
			},
		});
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error loading seminars</p>;

	// Extract data from axios response
	const responseData = seminars?.data || [];
	const paginationInfo = seminars?.pagination;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Free Seminars</h1>
					<p className="text-gray-600 mt-1">
						View, create, and manage free seminars
					</p>
				</div>
				{/* Create seminar button */}
				<Button
					onClick={() => {
						setEditingSeminar(null);
						setIsFormOpen(true);
					}}
				>
					Create Seminar
				</Button>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={responseData || []}
					columns={columns}
					searchKey="title"
					searchPlaceholder="Search by seminar title..."
					manualPagination
					pageCount={paginationInfo?.totalPages}
					pageIndex={pagination.pageIndex}
					pageSize={pagination.pageSize}
					onPaginationChange={setPagination}
					onSearch={setSearchTerm}
					searchValue={searchTerm}
					isLoading={isLoading}
					emptyMessage="No seminars found. Try creating one or adjusting your search."
					hasNext={paginationInfo?.hasNext}
					hasPrev={paginationInfo?.hasPrev}
					total={paginationInfo?.total}
				/>
			</div>

			{/* View Details Dialog */}
			<ViewDetailsDialog
				seminar={selectedSeminar}
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
			/>

			{/* Form Dialog for Create/Edit */}
			<FreeSeminarFormDialog
				open={isFormOpen}
				onOpenChange={setIsFormOpen}
				onSubmit={editingSeminar ? handleUpdateSeminar : handleCreateSeminar}
				isLoading={
					createSeminarMutation.isPending || updateSeminarMutation.isPending
				}
				initialData={
					editingSeminar
						? {
								id: editingSeminar.id,
								title: editingSeminar.title,
								description: editingSeminar.description,
								startDate: new Date(editingSeminar.startDate),
								endDate: new Date(editingSeminar.endDate),
								startTime: editingSeminar.startTime,
								endTime: editingSeminar.endTime,
								capacity: editingSeminar.capacity,
								isActive: editingSeminar.isActive,
								image: editingSeminar.image,
							}
						: undefined
				}
				isEditMode={!!editingSeminar}
			/>
		</div>
	);
}
