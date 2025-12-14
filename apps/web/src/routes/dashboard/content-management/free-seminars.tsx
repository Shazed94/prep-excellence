import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	Award,
	Calendar,
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
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
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
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/free-seminars",
)({
	component: RouteComponent,
});

interface FreeSeminar {
	id: string;
	parentName: string;
	parentPhone: string;
	parentCity: string;
	studentName: string;
	studentEmail: string;
	studentGrade: string;
	studentSchool: string;
	targetScore: string;
	dreamColleges: string;
	seminarGoals: string;
	questions: string;
	createdAt?: string;
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
						Seminar Registration Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto">
					{/* Parent Information Section */}
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
								value={seminar.parentPhone}
							/>
							<InfoItem
								icon={MapPin}
								label="City & ZIP"
								value={seminar.parentCity}
							/>
						</div>
					</div>

					{/* Student Information Section */}
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
								value={seminar.studentEmail}
							/>
							<InfoItem
								icon={Award}
								label="Grade"
								value={seminar.studentGrade}
							/>
							<InfoItem
								icon={School}
								label="School"
								value={seminar.studentSchool}
							/>
						</div>
					</div>

					{/* Goals & Targets Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<Target className="w-4 h-4 text-primary" />
							Goals & Targets
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoItem
								icon={Target}
								label="Target Score"
								value={seminar.targetScore}
							/>
							<InfoItem
								icon={School}
								label="Dream Colleges"
								value={seminar.dreamColleges}
							/>
						</div>
					</div>

					{/* Additional Details Section */}
					<div className="space-y-3">
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
					</div>

					{/* Submission Info */}
					{seminar.createdAt && (
						<div className="pt-4 border-t">
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<Calendar className="w-4 h-4" />
								<span className="font-medium">Submitted:</span>
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

	const deleteMutation = useDeleteFreeSeminar();
	const queryClient = useQueryClient();

	const handleView = (seminar: FreeSeminar) => {
		setSelectedSeminar(seminar);
		setIsViewOpen(true);
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
			accessorKey: "parentName",
			header: createSortableHeader("Parent Name"),
			cell: ({ row }) => {
				const name = row.getValue("parentName") as string;
				return <div className="truncate max-w-[150px]">{name}</div>;
			},
		},
		{
			accessorKey: "studentName",
			header: createSortableHeader("Student Name"),
			cell: ({ row }) => {
				const name = row.getValue("studentName") as string;
				return <div className="truncate max-w-[150px]">{name}</div>;
			},
		},
		{
			accessorKey: "studentEmail",
			header: createSortableHeader("Student Email"),
			cell: ({ row }) => {
				const email = row.getValue("studentEmail") as string;
				return <div className="truncate max-w-[200px]">{email}</div>;
			},
		},
		{
			accessorKey: "studentGrade",
			header: createSortableHeader("Grade"),
			cell: ({ row }) => {
				const grade = row.getValue("studentGrade") as string;
				return <div>{grade}</div>;
			},
		},
		{
			accessorKey: "parentPhone",
			header: "Phone",
			cell: ({ row }) => {
				const phone = row.getValue("parentPhone") as string;
				return <div>{phone}</div>;
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
							title="Delete Registration"
							description={
								<>
									Are you sure you want to delete this registration for{" "}
									<span className="font-bold">{original.studentName}</span>?
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
				toast.success(res.message || "Registration deleted successfully");
				queryClient.invalidateQueries({ queryKey: ["free-seminars", "get"] });
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to delete registration");
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
					<h1 className="text-2xl font-semibold">Free Seminar Registrations</h1>
					<p className="text-gray-600 mt-1">
						View and manage seminar registrations
					</p>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={responseData || []}
					columns={columns}
					searchKey="studentName"
					searchPlaceholder="Search by student name..."
					manualPagination
					pageCount={paginationInfo?.totalPages}
					pageIndex={pagination.pageIndex}
					pageSize={pagination.pageSize}
					onPaginationChange={setPagination}
					onSearch={setSearchTerm}
					searchValue={searchTerm}
					isLoading={isLoading}
					emptyMessage="No registrations found. Try adjusting your search."
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
		</div>
	);
}
