import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	useCreateCoupon,
	useDeleteCoupon,
	useGetCoupons,
	useUpdateCoupon,
} from "@/hooks/order";

export const Route = createFileRoute("/dashboard/coupon-management/")({
	component: RouteComponent,
});

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Coupon {
	id: string;
	code: string;
	discountType: "PERCENT" | "FIXED";
	value: number;
	maxUses: number | null;
	minOrderAmount: number | null;
	expiresAt: string | null;
	isActive: boolean;
	usedCount: number;
	createdAt: string;
	updatedAt: string;
}

interface CouponFormData {
	code: string;
	discountType: "PERCENT" | "FIXED";
	value: number;
	maxUses: number | null;
	minOrderAmount: number | null;
	expiresAt: string;
	isActive: boolean;
}

// ─── Form defaults ──────────────────────────────────────────────────────────────

const EMPTY_FORM: CouponFormData = {
	code: "",
	discountType: "PERCENT",
	value: 0,
	maxUses: null,
	minOrderAmount: null,
	expiresAt: "",
	isActive: true,
};

// ─── Route ──────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const queryClient = useQueryClient();
	const { data: responseData, isLoading, isError } = useGetCoupons();
	const createMutation = useCreateCoupon();
	const updateMutation = useUpdateCoupon();
	const deleteMutation = useDeleteCoupon();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
	const [formData, setFormData] = useState<CouponFormData>(EMPTY_FORM);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	// Generate unique IDs for form elements
	const id = useId();
	const codeId = `${id}-code`;
	const discountTypeId = `${id}-discount-type`;
	const valueId = `${id}-value`;
	const maxUsesId = `${id}-max-uses`;
	const minOrderId = `${id}-min-order`;
	const expiresId = `${id}-expires`;
	const activeId = `${id}-active`;

	// Extract coupon array from response (consistent with course-management pattern)
	const coupons: Coupon[] = responseData?.data?.data || [];
	const pagination = responseData?.data?.pagination;

	// ── Open dialog for create ──
	const openCreateDialog = () => {
		setEditingCoupon(null);
		setFormData(EMPTY_FORM);
		setDialogOpen(true);
	};

	// ── Open dialog for edit ──
	const openEditDialog = (coupon: Coupon) => {
		setEditingCoupon(coupon);
		setFormData({
			code: coupon.code,
			discountType: coupon.discountType,
			value: coupon.value,
			maxUses: coupon.maxUses,
			minOrderAmount: coupon.minOrderAmount,
			expiresAt: coupon.expiresAt
				? new Date(coupon.expiresAt).toISOString().slice(0, 16)
				: "",
			isActive: coupon.isActive,
		});
		setDialogOpen(true);
	};

	// ── Save (create or update) ──
	const handleSave = async () => {
		if (!formData.code.trim()) {
			toast.error("Coupon code is required");
			return;
		}
		if (formData.value <= 0) {
			toast.error("Value must be greater than 0");
			return;
		}

		setSaving(true);
		try {
			const payload = {
				code: formData.code.toUpperCase(),
				discountType: formData.discountType,
				value: formData.value,
				maxUses: formData.maxUses || undefined,
				minOrderAmount: formData.minOrderAmount || undefined,
				expiresAt: formData.expiresAt || undefined,
				isActive: formData.isActive,
			};

			if (editingCoupon) {
				await updateMutation.mutateAsync({ id: editingCoupon.id, ...payload });
				toast.success("Coupon updated successfully");
			} else {
				await createMutation.mutateAsync(payload);
				toast.success("Coupon created successfully");
			}

			queryClient.invalidateQueries({ queryKey: ["coupons"] });
			setDialogOpen(false);
		} catch (err: unknown) {
			const msg =
				err instanceof Error
					? err.message
					: err && typeof err === "object" && "response" in err
						? (err as any).response?.data?.message || "Failed to save coupon"
						: "Failed to save coupon";
			toast.error(msg);
		} finally {
			setSaving(false);
		}
	};

	// ── Toggle active status ──
	const handleToggleActive = async (coupon: Coupon) => {
		try {
			await updateMutation.mutateAsync({
				id: coupon.id,
				isActive: !coupon.isActive,
			});
			toast.success(
				`Coupon ${coupon.isActive ? "deactivated" : "activated"} successfully`,
			);
			queryClient.invalidateQueries({ queryKey: ["coupons"] });
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : "Failed to toggle coupon status";
			toast.error(msg);
		}
	};

	// ── Delete ──
	const handleDelete = async (id: string) => {
		setDeletingId(id);
		try {
			await deleteMutation.mutateAsync(id);
			toast.success("Coupon deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["coupons"] });
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : "Failed to delete coupon";
			toast.error(msg);
		} finally {
			setDeletingId(null);
		}
	};

	// ── Columns ──
	const columns: ColumnDef<Coupon>[] = [
		{
			accessorKey: "sl",
			header: "SL",
			cell: ({ row }) => <div>{row.index + 1}</div>,
		},
		{
			accessorKey: "code",
			header: "Code",
			cell: ({ row }) => (
				<div className="font-mono font-semibold uppercase">
					{row.original.code}
				</div>
			),
		},
		{
			accessorKey: "discountType",
			header: "Type",
			cell: ({ row }) => {
				const type = row.original.discountType;
				return (
					<Badge variant={type === "PERCENT" ? "default" : "secondary"}>
						{type === "PERCENT" ? "% Percentage" : "$ Fixed"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "value",
			header: () => <div className="text-center">Value</div>,
			cell: ({ row }) => {
				const c = row.original;
				return (
					<div className="text-center font-medium">
						{c.discountType === "PERCENT" ? `${c.value}%` : `$${c.value}`}
					</div>
				);
			},
		},
		{
			accessorKey: "minOrderAmount",
			header: () => <div className="text-center">Min Order</div>,
			cell: ({ row }) => {
				const val = row.original.minOrderAmount;
				return (
					<div className="text-center">
						{val != null ? `$${val}` : "\u2014"}
					</div>
				);
			},
		},
		{
			accessorKey: "maxUses",
			header: () => <div className="text-center">Max Uses</div>,
			cell: ({ row }) => {
				const val = row.original.maxUses;
				return <div className="text-center">{val ?? "\u221E"}</div>;
			},
		},
		{
			accessorKey: "usedCount",
			header: () => <div className="text-center">Used</div>,
			cell: ({ row }) => (
				<div className="text-center">{row.original.usedCount ?? 0}</div>
			),
		},
		{
			accessorKey: "expiresAt",
			header: "Expires",
			cell: ({ row }) => {
				const date = row.original.expiresAt;
				if (!date) return <div className="text-muted-foreground">Never</div>;
				const d = new Date(date);
				const formatted = d
					.toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "short",
						year: "numeric",
					})
					.replace(/,/g, "")
					.replace(/ /g, "-");
				const expired = d < new Date();
				return <div className={expired ? "text-red-500" : ""}>{formatted}</div>;
			},
		},
		{
			accessorKey: "isActive",
			header: () => <div className="text-center">Status</div>,
			cell: ({ row }) => {
				const active = row.original.isActive;
				const expired = row.original.expiresAt
					? new Date(row.original.expiresAt) < new Date()
					: false;
				return (
					<div className="text-center">
						<Badge
							variant={active && !expired ? "default" : "secondary"}
							className={expired ? "bg-gray-200 text-gray-500" : ""}
						>
							{expired ? "Expired" : active ? "Active" : "Inactive"}
						</Badge>
					</div>
				);
			},
		},
		{
			id: "actions",
			header: () => <div className="text-right">Action</div>,
			cell: ({ row }) => {
				const coupon = row.original;
				const isDeleting = deletingId === coupon.id;

				return (
					<div className="flex justify-end gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => openEditDialog(coupon)}
						>
							Edit
						</Button>
						<Button
							variant={coupon.isActive ? "outline" : "default"}
							size="sm"
							onClick={() => handleToggleActive(coupon)}
						>
							{coupon.isActive ? "Deactivate" : "Activate"}
						</Button>
						<DeleteConfirmationDialog
							trigger={
								<Button variant="destructive" size="sm" disabled={isDeleting}>
									{isDeleting ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Trash2 className="h-4 w-4" />
									)}
								</Button>
							}
							title="Delete Coupon"
							description={
								<>
									Are you sure you want to delete{" "}
									<span className="font-bold">{coupon.code}</span>? This action
									cannot be undone.
								</>
							}
							confirmText="Delete"
							variant="destructive"
							onConfirm={() => handleDelete(coupon.id)}
						/>
					</div>
				);
			},
		},
	];

	// ── Render ──
	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error loading coupons</p>;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold">Coupon Management</h1>
					<p className="text-sm text-muted-foreground">
						Create and manage promotional coupon codes
					</p>
				</div>

				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={openCreateDialog}
							className="inline-flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Create Coupon
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-lg">
						<DialogHeader>
							<DialogTitle>
								{editingCoupon ? "Edit Coupon" : "Create Coupon"}
							</DialogTitle>
							<DialogDescription>
								{editingCoupon
									? "Update the coupon code details below."
									: "Fill in the details to create a new coupon code."}
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							{/* Code */}
							<div className="flex flex-col gap-1.5">
								<label htmlFor={codeId} className="text-sm font-medium">
									Code
								</label>
								<input
									id={codeId}
									className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
									placeholder="SUMMER2025"
									value={formData.code}
									onChange={(e) =>
										setFormData({ ...formData, code: e.target.value })
									}
								/>
							</div>

							{/* Discount Type + Value */}
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<label
										htmlFor={discountTypeId}
										className="text-sm font-medium"
									>
										Discount Type
									</label>
									<select
										id={discountTypeId}
										className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
										value={formData.discountType}
										onChange={(e) =>
											setFormData({
												...formData,
												discountType: e.target.value as "PERCENT" | "FIXED",
											})
										}
									>
										<option value="PERCENT">Percentage (%)</option>
										<option value="FIXED">Fixed ($)</option>
									</select>
								</div>
								<div className="flex flex-col gap-1.5">
									<label htmlFor={valueId} className="text-sm font-medium">
										Value
									</label>
									<input
										id={valueId}
										type="number"
										min="0"
										step="0.01"
										className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
										placeholder="10"
										value={formData.value || ""}
										onChange={(e) =>
											setFormData({
												...formData,
												value: Number.parseFloat(e.target.value) || 0,
											})
										}
									/>
								</div>
							</div>

							{/* Max Uses + Min Order */}
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<label htmlFor={maxUsesId} className="text-sm font-medium">
										Max Uses
									</label>
									<input
										id={maxUsesId}
										type="number"
										min="0"
										className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
										placeholder="Unlimited"
										value={formData.maxUses ?? ""}
										onChange={(e) =>
											setFormData({
												...formData,
												maxUses: e.target.value
													? Number.parseInt(e.target.value)
													: null,
											})
										}
									/>
								</div>
								<div className="flex flex-col gap-1.5">
									<label htmlFor={minOrderId} className="text-sm font-medium">
										Min Order Amount ($)
									</label>
									<input
										id={minOrderId}
										type="number"
										min="0"
										step="0.01"
										className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
										placeholder="0"
										value={formData.minOrderAmount ?? ""}
										onChange={(e) =>
											setFormData({
												...formData,
												minOrderAmount: e.target.value
													? Number.parseFloat(e.target.value)
													: null,
											})
										}
									/>
								</div>
							</div>

							{/* Expires At */}
							<div className="flex flex-col gap-1.5">
								<label htmlFor={expiresId} className="text-sm font-medium">
									Expires At
								</label>
								<input
									id={expiresId}
									type="datetime-local"
									className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
									value={formData.expiresAt}
									onChange={(e) =>
										setFormData({ ...formData, expiresAt: e.target.value })
									}
								/>
							</div>

							{/* Active */}
							<label
								htmlFor={activeId}
								className="flex items-center gap-2 text-sm cursor-pointer"
							>
								<input
									id={activeId}
									type="checkbox"
									checked={formData.isActive}
									onChange={(e) =>
										setFormData({ ...formData, isActive: e.target.checked })
									}
									className="h-4 w-4 accent-blue-600"
								/>
								Active on creation
							</label>
						</div>

						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setDialogOpen(false)}
								disabled={saving}
							>
								Cancel
							</Button>
							<Button onClick={handleSave} disabled={saving}>
								{saving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : editingCoupon ? (
									"Update Coupon"
								) : (
									"Create Coupon"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-lg border bg-background">
				<DataTable
					data={coupons}
					columns={columns}
					searchKey="code"
					searchPlaceholder="Search by coupon code..."
					title=""
				/>
			</div>

			{/* Pagination info */}
			{pagination && (
				<div className="text-sm text-muted-foreground text-right">
					Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
					coupons total)
				</div>
			)}
		</div>
	);
}

export default RouteComponent;
