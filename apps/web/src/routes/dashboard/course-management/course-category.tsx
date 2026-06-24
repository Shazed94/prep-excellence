import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  type Category,
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "@/hooks/course-management";

export const Route = createFileRoute(
  "/dashboard/course-management/course-category",
)({
  component: RouteComponent,
});

// ─── Form state ─────────────────────────────────────────────────────────────────

interface CategoryFormData {
  name: string;
  description: string;
}

const EMPTY_FORM: CategoryFormData = {
  name: "",
  description: "",
};

// ─── Route Component ────────────────────────────────────────────────────────────

function RouteComponent() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading, isError } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const id = useId();
  const nameId = `${id}-name`;
  const descriptionId = `${id}-description`;

  // ── Open dialog for create ──
  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData(EMPTY_FORM);
    setDialogOpen(true);
  };

  // ── Open dialog for edit ──
  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description ?? "",
    });
    setDialogOpen(true);
  };

  // ── Save (create or update) ──
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        });
      }
      setDialogOpen(false);
    } catch {
      // Error handled by mutation
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle active status ──
  const handleToggleActive = async (category: Category) => {
    try {
      await updateMutation.mutateAsync({
        id: category.id,
        data: { isActive: !category.isActive },
      });
      toast.success(
        `Category ${category.isActive ? "deactivated" : "activated"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["coaching-categories"] });
    } catch {
      // Error handled by mutation
    }
  };

  // ── Delete ──
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      queryClient.invalidateQueries({ queryKey: ["coaching-categories"] });
    } catch {
      // Error handled by mutation
    } finally {
      setDeletingId(null);
    }
  };

  // ── Columns ──
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.original.description || "\u2014"}
        </div>
      ),
    },
    {
      accessorKey: "_count",
      header: () => <div className="text-center">Courses</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="secondary">{row.original._count?.courses ?? 0}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const active = row.original.isActive;
        return (
          <div className="text-center">
            <Badge variant={active ? "default" : "secondary"}>
              {active ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const category = row.original;
        const isDeleting = deletingId === category.id;

        return (
          <div className="flex justify-end gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog(category)}
            >
              Edit
            </Button>
            <Button
              variant={category.isActive ? "outline" : "default"}
              size="sm"
              onClick={() => handleToggleActive(category)}
            >
              {category.isActive ? "Deactivate" : "Activate"}
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
              title="Delete Category"
              description={
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-bold">{category.name}</span>? This
                  action cannot be undone.
                </>
              }
              confirmText="Delete"
              variant="destructive"
              onConfirm={() => handleDelete(category.id)}
            />
          </div>
        );
      },
    },
  ];

  // ── Render ──
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading categories</p>;

  return (
    <div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Course Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage course categories for organizing coaching courses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/course-management"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
          <Button
            onClick={openCreateDialog}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <DataTable columns={columns} data={categories || []} />
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Fill in the details to create a new course category."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={nameId} className="text-sm font-medium">
                Name
              </label>
              <input
                id={nameId}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="e.g., Web Development"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor={descriptionId} className="text-sm font-medium">
                Description
              </label>
              <textarea
                id={descriptionId}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 min-h-[80px] resize-y"
                placeholder="Optional description for this category"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
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
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RouteComponent;
