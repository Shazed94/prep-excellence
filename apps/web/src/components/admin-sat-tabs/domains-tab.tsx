import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	useDeleteDomains,
	useGetDomains,
	usePatchDomains,
	usePostDomains,
} from "@/hooks/sat-practice";
import { DataTable } from "./data-table";
import { DeleteDialog } from "./delete-dialog";
import { ItemDialog } from "./item-dialog";
import type { BaseItem, Domain } from "./lib-data/types";

export function DomainsTab() {
	const [params, setParams] = useState({
		page: 1,
		limit: 10,
		sortBy: "order",
		orderBy: "asc" as "asc" | "desc",
		search: "",
	});

	const [searchInput, setSearchInput] = useState("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<Domain | null>(null);
	const [deletingItem, setDeletingItem] = useState<Domain | null>(null);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [searchInput]);

	const { data: apiResponse, isLoading, isError } = useGetDomains(params);
	const createMutation = usePostDomains();
	const updateMutation = usePatchDomains();
	const deleteMutation = useDeleteDomains();

	const data = apiResponse?.data || [];
	const pagination = apiResponse?.pagination || {
		total: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	};

	const handlePageChange = useCallback((newPage: number) => {
		setParams((prev) => ({ ...prev, page: newPage }));
	}, []);

	const handlePageSizeChange = useCallback((newPageSize: number) => {
		setParams((prev) => ({ ...prev, limit: newPageSize, page: 1 }));
	}, []);

	const handleSearchChange = useCallback((search: string) => {
		setSearchInput(search);
	}, []);

	const handleCreate = useCallback(
		async (itemData: Partial<BaseItem>) => {
			try {
				const maxOrder =
					data.length > 0
						? Math.max(...data.map((item: BaseItem) => item.order || 0))
						: -1;
				await createMutation.mutateAsync({
					...itemData,
					order: maxOrder + 1,
				});
				setIsCreateDialogOpen(false);
				toast.success("Domain created successfully!");
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || "Failed to create domain",
				);
			}
		},
		[createMutation, data],
	);

	const handleEdit = useCallback(
		async (itemData: Partial<BaseItem>) => {
			if (editingItem) {
				try {
					await updateMutation.mutateAsync({
						id: editingItem.id,
						...itemData,
					});
					setEditingItem(null);
					toast.success("Domain updated successfully!");
				} catch (error: any) {
					toast.error(
						error?.response?.data?.message || "Failed to update domain",
					);
				}
			}
		},
		[editingItem, updateMutation],
	);

	const handleDelete = useCallback(async () => {
		if (deletingItem) {
			try {
				await deleteMutation.mutateAsync(deletingItem.id);
				setDeletingItem(null);
				toast.success("Domain deleted successfully!");
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || "Failed to delete domain",
				);
			}
		}
	}, [deletingItem, deleteMutation]);

	const handleReorder = useCallback(
		async (startIndex: number, endIndex: number) => {
			if (startIndex === endIndex) return;

			const reorderedData = [...data];
			const [movedItem] = reorderedData.splice(startIndex, 1);
			reorderedData.splice(endIndex, 0, movedItem);

			const minIndex = Math.min(startIndex, endIndex);
			const maxIndex = Math.max(startIndex, endIndex);

			const itemsToUpdate = reorderedData
				.slice(minIndex, maxIndex + 1)
				.map((item, index) => ({
					id: item.id,
					name: item.name,
					description: item.description,
					order: minIndex + index,
				}));

			try {
				const batchSize = 5;
				for (let i = 0; i < itemsToUpdate.length; i += batchSize) {
					const batch = itemsToUpdate.slice(i, i + batchSize);
					await Promise.all(
						batch.map((item) => updateMutation.mutateAsync(item)),
					);
				}
				toast.success("Order updated successfully!");
			} catch (error: any) {
				toast.error(error?.response?.data?.message || "Failed to update order");
			}
		},
		[data, updateMutation],
	);

	if (isLoading) {
		return (
			<div className="space-y-4 animate-in fade-in-50 duration-500">
				<div className="bg-linear-to-r from-card via-card to-card/50 border border-border/50 rounded-sm p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="h-6 w-32 bg-muted animate-pulse rounded" />
							<div className="h-4 w-48 bg-muted animate-pulse rounded" />
						</div>
						<div className="h-10 w-32 bg-muted animate-pulse rounded" />
					</div>
				</div>
				<div className="border rounded-lg p-8">
					<div className="space-y-3">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-12 bg-muted animate-pulse rounded" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="space-y-4 animate-in fade-in-50 duration-500">
				<div className="border border-destructive/50 rounded-lg p-8 text-center">
					<p className="text-destructive font-medium">Failed to load domains</p>
					<p className="text-sm text-muted-foreground mt-2">
						Please try refreshing the page
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 animate-in fade-in-50 duration-500">
			<div className="bg-linear-to-r from-card via-card to-card/50 border border-border/50 rounded-sm p-4 shadow-sm">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h2 className="text-2xl font-bold tracking-tight">Domains</h2>
							<span className="inline-flex items-center rounded-full bg-primary-dark/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
								{pagination.total} {pagination.total === 1 ? "item" : "items"}
							</span>
						</div>
						<p className="text-sm text-muted-foreground flex items-center gap-2">
							Manage your domain items. Drag rows to reorder.
						</p>
					</div>
					<Button
						onClick={() => setIsCreateDialogOpen(true)}
						className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
						size="lg"
					>
						<Plus className="h-4 w-4" />
						Create Domain
					</Button>
				</div>
			</div>

			<DataTable<Domain>
				data={data}
				onEdit={setEditingItem}
				onDelete={setDeletingItem}
				onReorder={handleReorder}
				pagination={pagination}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
				onSearchChange={handleSearchChange}
				searchValue={searchInput}
				isLoading={isLoading}
				columns={[
					{
						accessorKey: "domain",
						header: "Subjects",
						cell: ({ row }) => {
							const subjects = row.original.domain;
							if (!subjects?.length)
								return <span className="text-muted-foreground italic">—</span>;
							return (
								<div className="flex flex-wrap gap-1">
									{subjects.map((s) => (
										<span
											key={s.id}
											className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600"
										>
											{s.name}
										</span>
									))}
								</div>
							);
						},
					},
				]}
			/>

			<ItemDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				item={null}
				tabType="domain"
				tabLabel="Domain"
				onSave={handleCreate}
			/>

			<ItemDialog
				open={!!editingItem}
				onOpenChange={(open) => !open && setEditingItem(null)}
				item={editingItem}
				tabType="domain"
				tabLabel="Domain"
				onSave={handleEdit}
			/>

			<DeleteDialog
				open={!!deletingItem}
				onOpenChange={(open) => !open && setDeletingItem(null)}
				item={deletingItem}
				tabLabel="Domain"
				onConfirm={handleDelete}
			/>
		</div>
	);
}
