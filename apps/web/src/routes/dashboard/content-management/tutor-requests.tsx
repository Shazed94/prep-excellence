import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	BookOpen,
	Briefcase,
	Eye,
	GraduationCap,
	Mail,
	Phone,
	User,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

interface TutorRequest {
	id: string;
	parentName: string;
	studentName: string;
	email: string;
	phoneNumber: string;
	studentGrade: string;
	tutorType: string[];
	needHelp: string;
	createdAt?: string;
}

// InfoItem component
function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon: any;
	label: string;
	value: string | string[];
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
				{Array.isArray(value) ? (
					<div className="flex flex-wrap gap-1">
						{value.map((item, idx) => (
							<Badge key={idx} variant="secondary" className="text-xs">
								{item}
							</Badge>
						))}
					</div>
				) : (
					<p className="text-sm text-gray-900 wrap-break-word">{value}</p>
				)}
			</div>
		</div>
	);
}

function ViewDetailsDialog({
	request,
	open,
	onOpenChange,
}: {
	request: TutorRequest | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!request) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl md:max-w-5xl">
				<DialogHeader className="pb-4 border-b">
					<DialogTitle className="text-xl font-semibold flex items-center gap-2">
						<Briefcase className="w-6 h-6 text-primary" />
						Tutor Request Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto">
					{/* Contact Information Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<Users className="w-4 h-4 text-primary" />
							Contact Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoItem
								icon={User}
								label="Parent Name"
								value={request.parentName}
							/>
							<InfoItem
								icon={User}
								label="Student Name"
								value={request.studentName}
							/>
							<InfoItem icon={Mail} label="Email" value={request.email} />
							<InfoItem
								icon={Phone}
								label="Phone Number"
								value={request.phoneNumber}
							/>
							<InfoItem
								icon={GraduationCap}
								label="Student Grade"
								value={request.studentGrade}
							/>
						</div>
					</div>

					{/* Tutor Requirements Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<Briefcase className="w-4 h-4 text-primary" />
							Tutor Requirements
						</h3>
						<div className="grid grid-cols-1 gap-3">
							<InfoItem
								icon={Briefcase}
								label="Tutor Type"
								value={request.tutorType}
							/>
							<InfoItem
								icon={BookOpen}
								label="Subject/Area Needed"
								value={request.needHelp}
							/>
						</div>
					</div>
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
	const [selectedRequest, setSelectedRequest] = useState<TutorRequest | null>(
		null,
	);
	const [isViewOpen, setIsViewOpen] = useState(false);

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

	const handleView = (request: TutorRequest) => {
		setSelectedRequest(request);
		setIsViewOpen(true);
	};

	const columns: ColumnDef<TutorRequest>[] = [
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
							title="Delete Tutor Request"
							description={
								<>
									Are you sure you want to delete this tutor request from{" "}
									<span className="font-bold">{original.parentName}</span>?
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

			{/* View Details Dialog */}
			<ViewDetailsDialog
				request={selectedRequest}
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
			/>
		</div>
	);
}
