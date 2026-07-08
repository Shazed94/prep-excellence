import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	Eye,
	HelpCircle,
	Loader2,
	Mail,
	MessageSquare,
	Phone,
	User,
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useDeleteContactUs,
	useGetContactUs,
	useUpdateContactUsStatus,
} from "@/hooks/content-management";
import { Loading } from "@/components/ui/loading";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute(
	"/dashboard/content-management/contact-us",
)({
	component: RouteComponent,
});

interface ContactUs {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	query: string;
	status: "PENDING" | "IN_PROGRESS" | "REPLIED" | "RESOLVED" | "CLOSED";
	createdAt?: string;
}

const statusConfig: Record<
	string,
	{ label: string; color: string; bg: string }
> = {
	PENDING: {
		label: "Pending",
		color: "text-yellow-800",
		bg: "bg-yellow-100",
	},
	IN_PROGRESS: {
		label: "In Progress",
		color: "text-blue-800",
		bg: "bg-blue-100",
	},
	REPLIED: {
		label: "Replied",
		color: "text-purple-800",
		bg: "bg-purple-100",
	},
	RESOLVED: {
		label: "Resolved",
		color: "text-green-800",
		bg: "bg-green-100",
	},
	CLOSED: {
		label: "Closed",
		color: "text-gray-800",
		bg: "bg-gray-100",
	},
};

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
	contact,
	open,
	onOpenChange,
	onStatusChange,
	isUpdatingStatus,
}: {
	contact: ContactUs | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onStatusChange: (id: string, status: ContactUs["status"]) => void;
	isUpdatingStatus: boolean;
}) {
	if (!contact) return null;

	const fullName = `${contact.firstName} ${contact.lastName}`;
	const currentStatus = statusConfig[contact.status] ?? statusConfig.PENDING;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl md:max-w-5xl">
				<DialogHeader className="pb-4 border-b">
					<DialogTitle className="text-xl font-semibold flex items-center gap-2">
						<MessageSquare className="w-6 h-6 text-primary" />
						Contact Submission Details
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4 max-h-[65vh] overflow-y-auto">
					{/* Status Section */}
					<div className="flex items-center justify-between p-4 rounded-lg border">
						<div className="flex items-center gap-3">
							<HelpCircle className="w-5 h-5 text-primary" />
							<span className="text-sm font-medium text-gray-700">
								Current Status
							</span>
							<Badge
								className={`${currentStatus.bg} ${currentStatus.color} border-0`}
							>
								{currentStatus.label}
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<Select
								value={contact.status}
								onValueChange={(val) =>
									onStatusChange(
										contact.id,
										val as ContactUs["status"],
									)
								}
								disabled={isUpdatingStatus}
							>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Change status" />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(statusConfig).map(
										([key, config]) => (
											<SelectItem key={key} value={key}>
												<div className="flex items-center gap-2">
													<div
														className={`w-2 h-2 rounded-full ${config.bg} border`}
													/>
													{config.label}
												</div>
											</SelectItem>
										),
									)}
								</SelectContent>
							</Select>
							{isUpdatingStatus && (
								<Loader2 className="w-4 h-4 animate-spin text-primary" />
							)}
						</div>
					</div>

					{/* Personal Information Section */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
							<User className="w-4 h-4 text-primary" />
							Contact Information
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<InfoItem icon={User} label="Full Name" value={fullName} />
							<InfoItem icon={Mail} label="Email" value={contact.email} />
							<InfoItem icon={Phone} label="Phone" value={contact.phone} />
						</div>
					</div>

					{/* Query Section */}
					<div className="space-y-3">
						<div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
							<div className="flex items-start gap-3 mb-2">
								<MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
								<p className="text-xs font-medium text-blue-900 uppercase tracking-wide">
									Query / Message
								</p>
							</div>
							<p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed pl-8">
								{contact.query}
							</p>
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
	const [selectedContact, setSelectedContact] = useState<ContactUs | null>(
		null,
	);
	const [isViewOpen, setIsViewOpen] = useState(false);

	// Use Zustand store for table state
	const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
		useTableStore();

	const {
		data: contacts,
		isLoading,
		isError,
	} = useGetContactUs(
		pagination.pageIndex + 1,
		pagination.pageSize,
		searchTerm,
		sorting.sortBy || "createdAt",
		sorting.sortOrder,
	);
	const deleteMutation = useDeleteContactUs();
	const updateStatusMutation = useUpdateContactUsStatus();
	const queryClient = useQueryClient();

	const handleView = (contact: ContactUs) => {
		setSelectedContact(contact);
		setIsViewOpen(true);
	};

	const handleStatusChange = (
		id: string,
		status: ContactUs["status"],
	) => {
		updateStatusMutation.mutate(
			{ id, status },
			{
				onSuccess: (res) => {
					toast.success(res.message);
					queryClient.invalidateQueries({
						queryKey: ["contact-us"],
					});
					setSelectedContact((prev) =>
						prev?.id === id ? { ...prev, status } : prev,
					);
				},
				onError: (error: any) => {
					toast.error(
						error?.response?.data?.message ||
							error.message ||
							"Failed to update status",
					);
				},
			},
		);
	};

	const columns: ColumnDef<ContactUs>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => {
				return <div className="text-left">{row.index + 1}</div>;
			},
		},
		{
			accessorKey: "firstName",
			header: createSortableHeader("First Name"),
			cell: ({ row }) => {
				return (
					<div className="truncate max-w-[120px]">
						{row.getValue("firstName") as string}
					</div>
				);
			},
		},
		{
			accessorKey: "lastName",
			header: createSortableHeader("Last Name"),
			cell: ({ row }) => {
				return (
					<div className="truncate max-w-[120px]">
						{row.getValue("lastName") as string}
					</div>
				);
			},
		},
		{
			accessorKey: "email",
			header: createSortableHeader("Email"),
			cell: ({ row }) => {
				return (
					<div className="truncate max-w-[200px]">
						{row.getValue("email") as string}
					</div>
				);
			},
		},
		{
			accessorKey: "phone",
			header: "Phone",
			cell: ({ row }) => {
				return (
					<div className="truncate max-w-[120px]">
						{row.getValue("phone") as string}
					</div>
				);
			},
		},
		{
			accessorKey: "status",
			header: createSortableHeader("Status"),
			cell: ({ row }) => {
				const status = row.getValue("status") as ContactUs["status"];
				const config = statusConfig[status] ?? statusConfig.PENDING;
				return (
					<div className="flex items-center gap-2">
						<Select
							value={status}
							onValueChange={(val) =>
								handleStatusChange(
									row.original.id,
									val as ContactUs["status"],
								)
							}
						>
							<SelectTrigger
								className={`w-32 h-7 text-xs ${config.bg} ${config.color} border-0`}
							>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(statusConfig).map(
									([key, cfg]) => (
										<SelectItem key={key} value={key}>
											<div className="flex items-center gap-2">
												<div
													className={`w-2 h-2 rounded-full ${cfg.bg} border`}
												/>
												{cfg.label}
											</div>
										</SelectItem>
									),
								)}
							</SelectContent>
						</Select>
					</div>
				);
			},
		},
		{
			accessorKey: "query",
			header: "Query",
			cell: ({ row }) => {
				const query = row.getValue("query") as string;
				return (
					<div className="truncate max-w-[200px]" title={query}>
						{query}
					</div>
				);
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
							title="Delete Contact Submission"
							description={
								<>
									Are you sure you want to delete this contact
									submission from{" "}
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
				toast.success(res.message);
				// Invalidate all contact-us queries to refresh the list
				queryClient.invalidateQueries({
					queryKey: ["contact-us"],
				});
			},
			onError: (error: any) => {
				toast.error(
					error?.response?.data?.message ||
						error.message ||
						"Failed to delete",
				);
			},
		});
	};

	if (isLoading) return <Loading label="Loading contact submissions..." />;
	if (isError) return <p>Error loading contact submissions</p>;

	// Extract data from axios response
	const responseData = contacts?.data || [];
	const paginationInfo = contacts?.pagination;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Contact Us Submissions</h1>
					<p className="text-sm text-muted-foreground">
						Manage contact form submissions
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
					emptyMessage="No contact submissions found. Try adjusting your search."
					hasNext={paginationInfo?.hasNext}
					hasPrev={paginationInfo?.hasPrev}
					total={paginationInfo?.total}
				/>
			</div>

			{/* View Details Dialog */}
			<ViewDetailsDialog
				contact={selectedContact}
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				onStatusChange={handleStatusChange}
				isUpdatingStatus={updateStatusMutation.isPending}
			/>
		</div>
	);
}
