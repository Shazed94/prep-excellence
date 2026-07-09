import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/DataTable";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useDeleteCourse,
  useGetCourses,
  usePublishCourse,
} from "@/hooks/lms-course";

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
          queryClient.invalidateQueries({ queryKey: ["courses"] });
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
      onSuccess: () => {
        toast.success("Course deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete course");
      },
      onSettled: () => setDeletingId(null),
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "sl",
      header: "SL",
      cell: ({ row }) => {
        const sl = row.index + 1;
        return <div className="text-left">{sl}</div>;
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
        const thumbnail = row.getValue("thumbnail") as string | null;
        return (
          <div className="truncate max-w-[260px]">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="h-12 w-12 object-cover rounded"
              />
            ) : (
              <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                N/A
              </div>
            )}
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
      accessorKey: "level",
      header: () => <div className="text-center">Level</div>,
      cell: ({ row }) => {
        const level = row.original?.level;
        return (
          <div className="text-center capitalize">{level?.toLowerCase()}</div>
        );
      },
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center">Price</div>,
      cell: ({ row }) => {
        const price = row.original?.price;
        return <div className="text-center">{price ? `$${price}` : "-"}</div>;
      },
    },
    {
      accessorKey: "discount",
      header: () => <div className="text-center">Discount</div>,
      cell: ({ row }) => {
        const discount = row.original?.discount;
        return (
          <div className="text-center">{discount ? `$${discount}` : "-"}</div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: () => <div className="text-center">Duration</div>,
      cell: ({ row }) => {
        const duration = row.original?.duration;
        return <div className="text-center">{duration ?? "-"}</div>;
      },
    },
    {
      id: "modules",
      header: () => <div className="text-center">Modules</div>,
      cell: ({ row }) => {
        const count = row.original?._count?.courseModules ?? 0;
        return <div className="text-center">{count}</div>;
      },
    },
    {
      id: "students",
      header: () => <div className="text-center">Students</div>,
      cell: ({ row }) => {
        const count = row.original?._count?.enrollments ?? 0;
        return <div className="text-center">{count}</div>;
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
            <Link to={`/dashboard/course-management/courses/${id}/view` as "/"}>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link to={`/dashboard/course-management/courses/${id}/edit` as "/"}>
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
                  action cannot be undone. All modules, lessons, and student
                  progress will be permanently removed.
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
          search={{} as any}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Create Course
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-background">
        <DataTable
          data={courses || []}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Search by title..."
          title=""
        />
      </div>
    </div>
  );
}

export default RouteComponent;
