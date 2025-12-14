import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	Award,
	BookOpen,
	Calendar,
	Eye,
	Globe,
	GraduationCap,
	HelpCircle,
	Mail,
	MapPin,
	Phone,
	Target,
	TrendingUp,
	User,
	UserCircle,
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
	useDeleteGuidanceFormSubmission,
	useGetGuidanceFormSubmissions,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/guidance-form-submissions",
)({
	component: RouteComponent,
});

interface GuidanceForm {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	stateRegion: string;
	country: string;
	studentGrade: string;
	gpa: string;
	takenSATACT: string;
	satActScore: string;
	extracurricular: string;
	targetColleges: string;
	questions: string;
	childDescription: string;
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
				<p className="text-sm text-gray-900 wrap-break-word">{value}</p>
			</div>
		</div>
	);
}

function ViewDetailsDialog({
	form,
	open,
	onOpenChange,
}: {
	form: GuidanceForm | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!form) return null;

	const fullName = `${form.firstName} ${form.lastName}`;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl md:max-w-5xl lg:max-w-7xl">
				<DialogHeader className="pb-4 border-b">
					<DialogTitle className="text-xl font-semibold flex items-center gap-2">
						<BookOpen className="w-6 h-6 text-primary" />
						Guidance Form Submission Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto">
					{/* Personal Information Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<User className="w-4 h-4 text-primary" />
							Personal Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							<InfoItem icon={User} label="Full Name" value={fullName} />
							<InfoItem icon={Mail} label="Email" value={form.email} />
							<InfoItem icon={Phone} label="Phone" value={form.phone} />
							<InfoItem
								icon={MapPin}
								label="State/Region"
								value={form.stateRegion}
							/>
							<InfoItem icon={Globe} label="Country" value={form.country} />
						</div>
					</div>

					{/* Academic Information Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<GraduationCap className="w-4 h-4 text-primary" />
							Academic Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							<InfoItem
								icon={Award}
								label="Student Grade"
								value={form.studentGrade}
							/>
							<InfoItem icon={TrendingUp} label="GPA" value={form.gpa} />
							<InfoItem
								icon={BookOpen}
								label="Taken SAT/ACT"
								value={form.takenSATACT}
							/>
							<InfoItem
								icon={Award}
								label="SAT/ACT Score"
								value={form.satActScore}
							/>
						</div>
					</div>

					{/* Goals & Activities Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<Target className="w-4 h-4 text-primary" />
							Goals & Activities
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoItem
								icon={Target}
								label="Target Colleges"
								value={form.targetColleges}
							/>
							<InfoItem
								icon={Award}
								label="Extracurricular Activities"
								value={form.extracurricular}
							/>
						</div>
					</div>

					{/* Additional Details Section */}
					<div className="space-y-3">
						<div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
							<div className="flex items-start gap-3 mb-2">
								<UserCircle className="w-5 h-5 text-blue-600 mt-0.5" />
								<p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
									Child Description
								</p>
							</div>
							<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-8">
								{form.childDescription}
							</p>
						</div>

						<div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
							<div className="flex items-start gap-3 mb-2">
								<HelpCircle className="w-5 h-5 text-purple-600 mt-0.5" />
								<p className="text-xs font-medium text-purple-900 uppercase tracking-wide">
									Questions
								</p>
							</div>
							<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-8">
								{form.questions}
							</p>
						</div>
					</div>

					{/* Submission Info */}
					{form.createdAt && (
						<div className="pt-4 border-t">
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<Calendar className="w-4 h-4" />
								<span className="font-medium">Submitted:</span>
								<span>
									{new Date(form.createdAt).toLocaleString("en-US", {
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
	const [selectedForm, setSelectedForm] = useState<GuidanceForm | null>(null);
	const [isViewOpen, setIsViewOpen] = useState(false);

	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const {
		data: forms,
		isLoading,
		isError,
	} = useGetGuidanceFormSubmissions(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		sorting.sortBy || "id",
		sorting.sortOrder,
	);

	const deleteMutation = useDeleteGuidanceFormSubmission();
	const queryClient = useQueryClient();

	const handleView = (form: GuidanceForm) => {
		setSelectedForm(form);
		setIsViewOpen(true);
	};

	const columns: ColumnDef<GuidanceForm>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => {
				const sl = row.index + 1 + pagination.pageIndex * pagination.pageSize;
				return <div className="text-left">{sl}</div>;
			},
		},
		{
			accessorKey: "firstName",
			header: createSortableHeader("First Name"),
			cell: ({ row }) => {
				const name = row.getValue("firstName") as string;
				return <div className="truncate max-w-[120px]">{name}</div>;
			},
		},
		{
			accessorKey: "lastName",
			header: createSortableHeader("Last Name"),
			cell: ({ row }) => {
				const name = row.getValue("lastName") as string;
				return <div className="truncate max-w-[120px]">{name}</div>;
			},
		},
		{
			accessorKey: "email",
			header: createSortableHeader("Email"),
			cell: ({ row }) => {
				const email = row.getValue("email") as string;
				return <div className="truncate max-w-[180px]">{email}</div>;
			},
		},
		{
			accessorKey: "studentGrade",
			header: createSortableHeader("Grade"),
			cell: ({ row }) => {
				const grade = row.getValue("studentGrade") as string;
				return <div className="truncate max-w-[100px]">{grade}</div>;
			},
		},
		{
			accessorKey: "phone",
			header: "Phone",
			cell: ({ row }) => {
				const phone = row.getValue("phone") as string;
				return <div>{phone}</div>;
			},
		},
		{
			accessorKey: "country",
			header: "Country",
			cell: ({ row }) => {
				const country = row.getValue("country") as string;
				return <div className="truncate max-w-[120px]">{country}</div>;
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right">Actions</div>,
			cell: ({ row }) => {
				const original = row.original;
				const fullName = `${original.firstName} ${original.lastName}`;
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
							title="Delete Submission"
							description={
								<>
									Are you sure you want to delete this submission from{" "}
									<span className="font-bold">{fullName}</span>?
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
				toast.success(res.message || "Submission deleted successfully");
				queryClient.invalidateQueries({ queryKey: ["guidance-forms", "get"] });
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to delete submission");
			},
		});
	};

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error loading guidance forms</p>;

	// Extract data from axios response
	const responseData = forms?.data || [];
	const paginationInfo = forms?.pagination;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Guidance Form Submissions</h1>
					<p className="text-gray-600 mt-1">
						View and manage guidance form submissions
					</p>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={responseData || []}
					columns={columns}
					searchKey="firstName"
					searchPlaceholder="Search by first name..."
					manualPagination
					pageCount={paginationInfo?.totalPages}
					pageIndex={pagination.pageIndex}
					pageSize={pagination.pageSize}
					onPaginationChange={setPagination}
					onSearch={setSearchTerm}
					searchValue={searchTerm}
					isLoading={isLoading}
					emptyMessage="No submissions found. Try adjusting your search."
					hasNext={paginationInfo?.hasNext}
					hasPrev={paginationInfo?.hasPrev}
					total={paginationInfo?.total}
				/>
			</div>

			{/* View Details Dialog */}
			<ViewDetailsDialog
				form={selectedForm}
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
			/>
		</div>
	);
}
