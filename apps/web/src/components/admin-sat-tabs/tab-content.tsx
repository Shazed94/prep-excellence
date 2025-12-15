import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	useDeleteDifficulties,
	useDeleteDomains,
	useDeleteSkills,
	useDeleteSubjects,
	useDeleteTestTypes,
	useGetDifficulties,
	useGetDomains,
	useGetSkills,
	useGetSubjects,
	useGetTestTypes,
	usePatchDifficulties,
	usePatchDomains,
	usePatchSkills,
	usePatchSubjects,
	usePatchTestTypes,
	usePostDifficulties,
	usePostDomains,
	usePostSkills,
	usePostSubjects,
	usePostTestTypes,
} from "@/hooks/sat-practice";
import { DataTable } from "./data-table";
import { DeleteDialog } from "./delete-dialog";
import { ItemDialog } from "./item-dialog";
import type { BaseItem, TabType } from "./lib-data/types";

interface TabContentProps {
	tabType: TabType;
	tabLabel: string;
}

// Hook selector based on tab type
const useTabHooks = (tabType: TabType) => {
	const [params] = useState({
		page: 1,
		limit: 100,
		sortBy: "createdAt",
		orderBy: "asc",
	});

	switch (tabType) {
		case "test-type":
			return {
				useGet: () => useGetTestTypes(params),
				usePost: usePostTestTypes,
				usePatch: usePatchTestTypes,
				useDelete: useDeleteTestTypes,
			};
		case "subject":
			return {
				useGet: () => useGetSubjects(params),
				usePost: usePostSubjects,
				usePatch: usePatchSubjects,
				useDelete: useDeleteSubjects,
			};
		case "difficulty":
			return {
				useGet: () => useGetDifficulties(params),
				usePost: usePostDifficulties,
				usePatch: usePatchDifficulties,
				useDelete: useDeleteDifficulties,
			};
		case "domain":
			return {
				useGet: () => useGetDomains(params),
				usePost: usePostDomains,
				usePatch: usePatchDomains,
				useDelete: useDeleteDomains,
			};
		case "skills":
			return {
				useGet: () => useGetSkills(params),
				usePost: usePostSkills,
				usePatch: usePatchSkills,
				useDelete: useDeleteSkills,
			};
		default:
			return {
				useGet: () => useGetTestTypes(params),
				usePost: usePostTestTypes,
				usePatch: usePatchTestTypes,
				useDelete: useDeleteTestTypes,
			};
	}
};

export function TabContent({ tabType, tabLabel }: TabContentProps) {
	const hooks = useTabHooks(tabType);
	const { data: apiResponse, isLoading, isError } = hooks.useGet();
	const createMutation = hooks.usePost();
	const updateMutation = hooks.usePatch();
	const deleteMutation = hooks.useDelete();

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<BaseItem | null>(null);
	const [deletingItem, setDeletingItem] = useState<BaseItem | null>(null);

	// Extract data from API response
	const data = apiResponse?.data || [];

	const handleCreate = useCallback(
		async (itemData: Partial<BaseItem>) => {
			try {
				await createMutation.mutateAsync({
					...itemData,
					order: data.length + 1,
				});
				setIsCreateDialogOpen(false);
				toast.success(`${tabLabel} created successfully!`);
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message ||
						`Failed to create ${tabLabel.toLowerCase()}`,
				);
			}
		},
		[createMutation, data.length, tabLabel],
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
					toast.success(`${tabLabel} updated successfully!`);
				} catch (error: any) {
					toast.error(
						error?.response?.data?.message ||
							`Failed to update ${tabLabel.toLowerCase()}`,
					);
				}
			}
		},
		[editingItem, updateMutation, tabLabel],
	);

	const handleDelete = useCallback(async () => {
		if (deletingItem) {
			try {
				await deleteMutation.mutateAsync(deletingItem.id);
				setDeletingItem(null);
				toast.success(`${tabLabel} deleted successfully!`);
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message ||
						`Failed to delete ${tabLabel.toLowerCase()}`,
				);
			}
		}
	}, [deletingItem, deleteMutation, tabLabel]);

	const handleReorder = useCallback(
		async (startIndex: number, endIndex: number) => {
			// Optimistically update the UI
			const newData = [...data];
			const [removed] = newData.splice(startIndex, 1);
			newData.splice(endIndex, 0, removed);

			// Update order for all items
			const updates = newData.map((item, index) => ({
				id: item.id,
				order: index + 1,
			}));

			try {
				// Update each item's order
				await Promise.all(
					updates.map((update) =>
						updateMutation.mutateAsync({
							...data.find((d: BaseItem) => d.id === update.id),
							order: update.order,
						}),
					),
				);
				toast.success("Order updated successfully!");
			} catch (error: any) {
				toast.error("Failed to update order");
			}
		},
		[data, updateMutation],
	);

	const handleCreateDialogChange = useCallback((open: boolean) => {
		setIsCreateDialogOpen(open);
	}, []);

	const handleEditDialogChange = useCallback((open: boolean) => {
		if (!open) {
			setEditingItem(null);
		}
	}, []);

	const handleDeleteDialogChange = useCallback((open: boolean) => {
		if (!open) {
			setDeletingItem(null);
		}
	}, []);

	// Show loading state
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

	// Show error state
	if (isError) {
		return (
			<div className="space-y-4 animate-in fade-in-50 duration-500">
				<div className="border border-destructive/50 rounded-lg p-8 text-center">
					<p className="text-destructive font-medium">
						Failed to load {tabLabel.toLowerCase()}s
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						Please try refreshing the page
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4 animate-in fade-in-50 duration-500">
			{/* Header Section with Stats */}
			<div className="bg-linear-to-r from-card via-card to-card/50 border border-border/50 rounded-sm p-4 shadow-sm">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<h2 className="text-2xl font-bold tracking-tight">{tabLabel}</h2>
							<span className="inline-flex items-center rounded-full bg-primary-dark/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
								{data.length} {data.length === 1 ? "item" : "items"}
							</span>
						</div>
						<p className="text-sm text-muted-foreground flex items-center gap-2">
							Manage your {tabLabel.toLowerCase()} items. Drag rows to reorder.
						</p>
					</div>
					<Button
						onClick={() => setIsCreateDialogOpen(true)}
						className="gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
						size="lg"
					>
						<Plus className="h-4 w-4" />
						Create {tabLabel}
					</Button>
				</div>
			</div>

			<DataTable
				data={data}
				onEdit={setEditingItem}
				onDelete={setDeletingItem}
				onReorder={handleReorder}
			/>

			<ItemDialog
				open={isCreateDialogOpen}
				onOpenChange={handleCreateDialogChange}
				item={null}
				tabType={tabType}
				tabLabel={tabLabel}
				onSave={handleCreate}
			/>

			<ItemDialog
				open={!!editingItem}
				onOpenChange={handleEditDialogChange}
				item={editingItem}
				tabType={tabType}
				tabLabel={tabLabel}
				onSave={handleEdit}
			/>

			<DeleteDialog
				open={!!deletingItem}
				onOpenChange={handleDeleteDialogChange}
				item={deletingItem}
				tabLabel={tabLabel}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
