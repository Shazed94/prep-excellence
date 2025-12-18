import type { TCTrustedCompanies } from "@prepexcellence/shared-validators";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Upload } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable";
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useCreateTrustedCompany,
  useDeleteTrustedCompany,
  useGetTrustedCompanies,
  useUpdateTrustedCompany,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

interface Company {
  id: string;
  name: string;
  logo: string;
  email?: string;
}

export const Route = createFileRoute(
  "/dashboard/content-management/trusted-companies"
)({
  component: TrustedCompanies,
});

// Move CompanyFormDialog outside the main component
function CompanyFormDialog({
  open,
  onOpenChange,
  isEdit = false,
  form,
  onSubmit,
  thumbnailPreview,
  handleThumbnailUpload,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  form: any;
  onSubmit: (data: TCTrustedCompanies) => void;
  thumbnailPreview: string | null;
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}) {
  const fileInputId = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit" : "Add"} Trusted Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 text-base">
                    Company Name
                  </FormLabel>
                  <Input placeholder="Enter company name" {...field} />
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel className="text-slate-800 text-base">
                    Company Logo
                  </FormLabel>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id={fileInputId}
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailUpload}
                    />
                    <label
                      htmlFor={fileInputId}
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      {thumbnailPreview ? (
                        <div className="w-full">
                          <img
                            src={thumbnailPreview}
                            alt="Logo preview"
                            className="w-full h-32 object-contain rounded-lg"
                          />
                          <p className="text-center text-sm text-slate-500 mt-2">
                            Click to change logo
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-slate-500" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-slate-800">
                              Upload logo
                            </p>
                            <p className="text-sm text-slate-500">
                              PNG, JPG up to 5MB
                            </p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : isEdit ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function TrustedCompanies() {
  const queryClient = useQueryClient();
  const addMutation = useCreateTrustedCompany();
  const editMutation = useUpdateTrustedCompany();
  const deleteMutation = useDeleteTrustedCompany();

  // Use Zustand store for table state
  const { pagination, setPagination, searchTerm, setSearchTerm, sorting } =
    useTableStore();

  const {
    data: companies,
    isError,
    isLoading: isLoadingData,
  } = useGetTrustedCompanies(
    pagination.pageIndex + 1,
    pagination.pageSize,
    searchTerm,
    sorting.sortBy || "id",
    sorting.sortOrder
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [_thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<TCTrustedCompanies>({
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setThumbnailFile(file);

      // Create preview using createObjectURL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);

      // Set the file object directly
      form.setValue("logo", file as any);
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      logo: "",
    });

    // Revoke the object URL to free memory
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailPreview(null);
    setThumbnailFile(null);
    setEditingCompany(null);
  };

  const onSubmit = (data: TCTrustedCompanies) => {
    // Create FormData for binary file upload
    const formData = new FormData();
    formData.append("name", data.name.trim());

    // Only append file if a new one was uploaded
    if (data.logo && typeof data.logo !== "string") {
      // logo is a File object
      formData.append("logo", data.logo as File);
    }

    if (editingCompany) {
      // Edit existing company
      editMutation.mutate(
        { id: editingCompany.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Company updated successfully");
            queryClient.invalidateQueries({
              queryKey: ["trusted-companies", "get"],
            });
            setIsEditOpen(false);
            resetForm();
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update company");
          },
        }
      );
    } else {
      // Add new company
      addMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Company added successfully");
          queryClient.invalidateQueries({
            queryKey: ["trusted-companies", "get"],
          });
          setIsAddOpen(false);
          resetForm();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to add company");
        },
      });
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    form.reset({
      name: company.name,
      logo: company.logo as any,
    });
    // For edit, show the existing logo URL (not createObjectURL)
    setThumbnailPreview(company.logo);
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Company deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["trusted-companies", "get"],
        });
        form.reset({
          name: "",
          logo: "",
        });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete company");
      },
    });
  };

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => (
        <img
          src={row.getValue("logo")}
          alt={row.original.name}
          className="w-full h-11 object-contain rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px]">{row.getValue("name")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const original = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(original)}
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <DeleteConfirmationDialog
              trigger={
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              }
              title="Delete Company"
              description={
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-bold">{original.name}</span>?
                </>
              }
              confirmText="Delete"
              variant="destructive"
              onConfirm={() => handleDelete(original.id)}
            />
          </div>
        );
      },
    },
  ];

  const isLoading = addMutation.isPending || editMutation.isPending;

  if (isError) return <p>Error</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trusted Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage companies that are trusted by your users.
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary text-white hover:bg-primary/90"
        >
          Add Company
        </Button>
      </div>

      <DataTable
        data={companies?.data || []}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search by company name..."
        title=""
        manualPagination
        pageCount={companies?.pagination?.totalPages}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        isLoading={isLoadingData || isLoading}
        emptyMessage="No data found. Try adjusting your search."
        hasNext={companies?.pagination?.hasNext}
        hasPrev={companies?.pagination?.hasPrev}
        total={companies?.pagination?.total}
      />

      <CompanyFormDialog
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) resetForm();
        }}
        isEdit={false}
        form={form}
        onSubmit={onSubmit}
        thumbnailPreview={thumbnailPreview}
        handleThumbnailUpload={handleThumbnailUpload}
        isLoading={isLoading}
      />

      <CompanyFormDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetForm();
        }}
        isEdit={true}
        form={form}
        onSubmit={onSubmit}
        thumbnailPreview={thumbnailPreview}
        handleThumbnailUpload={handleThumbnailUpload}
        isLoading={isLoading}
      />
    </div>
  );
}
