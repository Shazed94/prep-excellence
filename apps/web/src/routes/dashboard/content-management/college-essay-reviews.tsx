import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	CheckCircle,
	Eye,
	FileText,
	GraduationCap,
	Mail,
	Phone,
	School,
	Target,
	User,
	XCircle,
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
	useDeleteCollegeEssayReview,
	useGetCollegeEssayReviews,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/college-essay-reviews",
)({
	component: RouteComponent,
});

interface CollegeEssayReview {
	id: string;
	studentName: string;
	parentName: string;
	email: string;
	phone: string;
	grade: string;
	studentSchool: string;
	collegeTarget: string;
	agreedToTerms: boolean;
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
	value: string | boolean;
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
				{typeof value === "boolean" ? (
					<Badge variant={value ? "default" : "destructive"}>
						{value ? "Yes" : "No"}
					</Badge>
				) : (
					<p className="text-sm text-gray-900 wrap-break-word">{value}</p>
				)}
			</div>
		</div>
	);
}

function ViewDetailsDialog({
	review,
	open,
	onOpenChange,
}: {
	review: CollegeEssayReview | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!review) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl md:max-w-5xl">
				<DialogHeader className="pb-4 border-b">
					<DialogTitle className="text-xl font-semibold flex items-center gap-2">
						<FileText className="w-6 h-6 text-primary" />
						College Essay Review Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto">
					{/* Student Information Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<User className="w-4 h-4 text-primary" />
							Student Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoItem
								icon={User}
								label="Student Name"
								value={review.studentName}
							/>
							<InfoItem
								icon={User}
								label="Parent Name"
								value={review.parentName}
							/>
							<InfoItem icon={Mail} label="Email" value={review.email} />
							<InfoItem icon={Phone} label="Phone" value={review.phone} />
							<InfoItem
								icon={GraduationCap}
								label="Grade"
								value={review.grade}
							/>
							<InfoItem
								icon={School}
								label="School"
								value={review.studentSchool}
							/>
						</div>
					</div>

					{/* College Information Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<Target className="w-4 h-4 text-primary" />
							College Goals
						</h3>
						<div className="grid grid-cols-1 gap-3">
							<InfoItem
								icon={Target}
								label="Target College"
								value={review.collegeTarget}
							/>
						</div>
					</div>

					{/* Terms Agreement Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							{review.agreedToTerms ? (
								<CheckCircle className="w-4 h-4 text-green-600" />
							) : (
								<XCircle className="w-4 h-4 text-red-600" />
							)}
							Terms & Conditions
						</h3>
						<div className="grid grid-cols-1 gap-3">
							<InfoItem
								icon={review.agreedToTerms ? CheckCircle : XCircle}
								label="Agreed to Terms"
								value={review.agreedToTerms}
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
	const [selectedReview, setSelectedReview] =
		useState<CollegeEssayReview | null>(null);
	const [isViewOpen, setIsViewOpen] = useState(false);

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

	const handleView = (review: CollegeEssayReview) => {
		setSelectedReview(review);
		setIsViewOpen(true);
	};

	const columns: ColumnDef<CollegeEssayReview>[] = [
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
							title="Delete College Essay Review"
							description={
								<>
									Are you sure you want to delete this review submission from{" "}
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
			<div className="">
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

			{/* View Details Dialog */}
			<ViewDetailsDialog
				review={selectedReview}
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
			/>
		</div>
	);
}
