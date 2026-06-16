import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Eye, Loader2, Pencil } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetCourses,
  usePublishCourse,
  useDeleteCourse,
} from "@/hooks/course-management";

export const Route = createFileRoute("/dashboard/course-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: courses, isLoading, isError } = useGetCourses();
  const publishMutation = usePublishCourse();
  const deleteMutation = useDeleteCourse();
  const queryClient = useQueryClient();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePublishToggle = (id: string, currentStatus: boolean) => {
    setPublishingId(id);
    publishMutation.mutate(
      { courseId: id, isPublished: !currentStatus },
      {
        onSuccess: () => {
          toast.success(
            `Course ${!currentStatus ? "published" : "unpublished"} successfully!`,
          );
          queryClient.invalidateQueries({ queryKey: ["coaching-courses"] });
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to update publish status");
        },
        onSettled: () => setPublishingId(null),
      },
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Course deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["coaching-courses"] });
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete course");
      },
      onSettled: () => setDeletingId(null),
    });
  };

  //   const handleReorder = useCallback(
  //     async (startIndex: number, endIndex: number) => {
  //       if (startIndex === endIndex) return;

  //       const reorderedData = [...data];
  //       const [movedItem] = reorderedData.splice(startIndex, 1);
  //       reorderedData.splice(endIndex, 0, movedItem);

  //       const minIndex = Math.min(startIndex, endIndex);
  //       const maxIndex = Math.max(startIndex, endIndex);

  //       const itemsToUpdate = reorderedData
  //         .slice(minIndex, maxIndex + 1)
  //         .map((item, index) => ({
  //           id: item.id,
  //           name: item.name,
  //           description: item.description,
  //           order: minIndex + index,
  //         }));

  //       try {
  //         const batchSize = 5;
  //         for (let i = 0; i < itemsToUpdate.length; i += batchSize) {
  //           const batch = itemsToUpdate.slice(i, i + batchSize);
  //           await Promise.all(
  //             batch.map((item) => updateMutation.mutateAsync(item)),
  //           );
  //         }
  //         toast.success("Order updated successfully!");
  //       } catch (error: any) {
  //         toast.error(error?.response?.data?.message || "Failed to update order");
  //       }
  //     },
  //     [data, updateMutation],
  //   );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }) => {
        const sl = row.index + 1;
        return <div className="text-left ">{sl}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return <div className="truncate max-w-[220px]">{title}</div>;
      },
    },
    {
      accessorKey: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const thumbnail = row.getValue("thumbnail") as string;
        return (
          <div className="truncate max-w-[260px]">
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="h-12 w-12 object-cover rounded"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const startDate = row.original?.startDate;

        if (!startDate) return "";

        const date = new Date(startDate);

        const formatted = date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(",", "");

        const finalFormat = formatted.replace(/ /g, "-");

        return (
          <div className="truncate max-w-[150px]" title={startDate}>
            {finalFormat}
          </div>
        );
      },
    },
    {
      accessorKey: "isPublished",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => {
        const isPublished = row.original?.isPublished;
        return (
          <div className="text-center">
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "regular_price",
      header: () => <div className="text-center">Regular Price</div>,
      cell: ({ row }) => {
        const price = row.original?.regular_price;
        return <div className="text-center">{price}</div>;
      },
    },
    {
      accessorKey: "offer_price",
      header: () => <div className="text-center">Offer Price</div>,
      cell: ({ row }) => {
        const price = row.original?.offer_price;
        return <div className="text-center">{price}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: () => <div className="text-center">Capacity</div>,
      cell: ({ row }) => {
        const capacity = row.original?.capacity;
        return <div className="text-center">{capacity}</div>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const original = row.original as {
          id: string;
          isPublished: boolean;
          title: string;
        };
        const id = original.id;
        const isPublished = original.isPublished;
        const isPublishing = publishingId === id;
        const isDeleting = deletingId === id;

        return (
          <div className="flex justify-end gap-2">
            <Link to={`/dashboard/course-management/${id}/view` as "/"}>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link to={`/dashboard/course-management/${id}/edit` as "/"}>
              <Button variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Button
              variant={isPublished ? "outline" : "default"}
              size="sm"
              disabled={isPublishing}
              onClick={() => handlePublishToggle(id, isPublished)}
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPublished ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </Button>
            <DeleteConfirmationDialog
              trigger={
                <Button variant="destructive" size="sm" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              }
              title="Delete Course"
              description={
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-bold">{original.title}</span>? This
                  action cannot be undone.
                </>
              }
              confirmText="Delete"
              variant="destructive"
              onConfirm={() => handleDelete(id)}
            />
          </div>
        );
      },
    },
  ];

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Course Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and organize all your courses
          </p>
        </div>

        <Link
          to="/dashboard/course-management/create"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Create Course
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-background">
        <DataTable
          data={courses?.data?.data || []}
          columns={columns}
          //   onReorder={handleReorder}
          searchKey="title"
          searchPlaceholder="Search by title..."
          title=""
        />
      </div>
    </div>
  );
}

export default RouteComponent;
