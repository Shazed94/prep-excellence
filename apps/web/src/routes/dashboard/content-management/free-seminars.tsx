import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import parse from "html-react-parser";
import {
	Award,
	Calendar,
	Edit2,
	Eye,
	GraduationCap,
	HelpCircle,
	Mail,
	MapPin,
	MessageSquare,
	Phone,
	School,
	Target,
	User,
	X,
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
	useDeleteFreeSeminar,
	useGetFreeSeminars,
	usePostFreeSeminar,
	useUpdateFreeSeminar,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/free-seminars",
)({
	component: RouteComponent,
});

interface FreeSeminar {
	id: string;
	parentName?: string;
	parentPhone?: string;
	parentCity?: string;
	studentName?: string;
	studentEmail?: string;
	studentGrade?: string;
	studentSchool?: string;
	targetScore?: string;
	dreamColleges?: string;
	seminarGoals?: string;
	questions?: string;
	title: string;
	description: string;
	date: string;
	capacity: number;
	isActive: boolean;
	image?: string;
	createdAt?: string;
	updatedAt?: string;
}

// InfoItem component moved outside
function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon: any;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
			<div className="mt-0.5 text-primary">
				<Icon className="w-5 h-5" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
					{label}
				</p>
				<p className="text-sm text-gray-900 break-words">{value}</p>
			</div>
		</div>
	);
}

function ViewDetailsDialog({
	seminar,
	open,
	onOpenChange,
}: {
	seminar: FreeSeminar | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!seminar) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl md:max-w-5xl lg:max-w-7xl ">
				<DialogHeader className="pb-4 border-b">
					<DialogTitle className="text-xl font-semibold flex items-center gap-2">
						<GraduationCap className="w-6 h-6 text-primary" />
						{seminar.title || "Seminar Details"}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto">
					{/* Image */}
					{seminar.image && (
						<div className="w-full h-48 rounded-lg overflow-hidden">
							<img
								src={seminar.image}
								alt={seminar.title}
								className="w-full h-full object-cover"
							/>
						</div>
					)}

					{/* Basic Information */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<GraduationCap className="w-4 h-4 text-primary" />
							Seminar Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoItem icon={Target} label="Title" value={seminar.title} />
							<InfoItem
								icon={Calendar}
								label="Date"
								value={new Date(seminar.date).toLocaleDateString("en-US", {
									dateStyle: "medium",
								})}
							/>
							<InfoItem
								icon={User}
								label="Capacity"
								value={`${seminar.capacity} participants`}
							/>
							<InfoItem
								icon={Award}
								label="Status"
								value={seminar.isActive ? "Active" : "Inactive"}
							/>
						</div>
					</div>

					{/* Description */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3">
							Description
						</h3>
						<div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
							{/* <div
                className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: seminar.description }}
              /> */}
							{parse(seminar.description)}
						</div>
					</div>

					{/* Parent Information Section (if exists) */}
					{seminar.parentName && (
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
								<User className="w-4 h-4 text-primary" />
								Parent Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
								<InfoItem
									icon={User}
									label="Parent Name"
									value={seminar.parentName}
								/>
								<InfoItem
									icon={Phone}
									label="Parent Phone"
									value={seminar.parentPhone || "N/A"}
								/>
								<InfoItem
									icon={MapPin}
									label="City & ZIP"
									value={seminar.parentCity || "N/A"}
								/>
							</div>
						</div>
					)}

					{/* Student Information Section (if exists) */}
					{seminar.studentName && (
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
								<GraduationCap className="w-4 h-4 text-primary" />
								Student Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<InfoItem
									icon={User}
									label="Student Name"
									value={seminar.studentName}
								/>
								<InfoItem
									icon={Mail}
									label="Student Email"
									value={seminar.studentEmail || "N/A"}
								/>
								<InfoItem
									icon={Award}
									label="Grade"
									value={seminar.studentGrade || "N/A"}
								/>
								<InfoItem
									icon={School}
									label="School"
									value={seminar.studentSchool || "N/A"}
								/>
							</div>
						</div>
					)}

					{/* Goals & Targets Section (if exists) */}
					{(seminar.targetScore || seminar.dreamColleges) && (
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
								<Target className="w-4 h-4 text-primary" />
								Goals & Targets
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{seminar.targetScore && (
									<InfoItem
										icon={Target}
										label="Target Score"
										value={seminar.targetScore}
									/>
								)}
								{seminar.dreamColleges && (
									<InfoItem
										icon={School}
										label="Dream Colleges"
										value={seminar.dreamColleges}
									/>
								)}
							</div>
						</div>
					)}

					{/* Additional Details Section (if exists) */}
					{(seminar.seminarGoals || seminar.questions) && (
						<div className="space-y-3">
							{seminar.seminarGoals && (
								<div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
									<div className="flex items-start gap-3 mb-2">
										<MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
										<p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
											Seminar Goals
										</p>
									</div>
									<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-8">
										{seminar.seminarGoals}
									</p>
								</div>
							)}

							{seminar.questions && (
								<div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
									<div className="flex items-start gap-3 mb-2">
										<HelpCircle className="w-5 h-5 text-purple-600 mt-0.5" />
										<p className="text-xs font-medium text-purple-900 uppercase tracking-wide">
											Questions for Presenter
										</p>
									</div>
									<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-8">
										{seminar.questions}
									</p>
								</div>
							)}
						</div>
					)}

					{/* Submission Info */}
					{seminar.createdAt && (
						<div className="pt-4 border-t">
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<Calendar className="w-4 h-4" />
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

				<DialogFooter className="pt-4 border-t">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function RouteComponent() {
	const [selectedSeminar, setSelectedSeminar] = useState<FreeSeminar | null>(
		null,
	);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingSeminar, setEditingSeminar] = useState<FreeSeminar | null>(
		null,
	);

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
					toast.error(error.message || "Failed to create seminar");
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
							toast.error(error.message || "Failed to update seminar");
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
		setSelectedSeminar(seminar);
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
			accessorKey: "date",
			header: createSortableHeader("Date"),
			cell: ({ row }) => {
				const date = row.getValue("date") as string;
				return (
					<div>
						{new Date(date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
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
				toast.error(error.message || "Failed to delete seminar");
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
								date: new Date(editingSeminar.date),
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
