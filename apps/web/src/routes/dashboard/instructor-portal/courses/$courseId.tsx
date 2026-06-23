import { createFileRoute, Link } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { BookOpen, Edit, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteCourse,
  useGetCourse,
  usePublishCourse,
} from "@/hooks/lms-course";

export const Route = createFileRoute(
  "/dashboard/instructor-portal/courses/$courseId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const courseId = (params as any).courseId as string;
  const { data: course, isLoading, error } = useGetCourse(courseId);
  const publishMutation = usePublishCourse();
  const deleteMutation = useDeleteCourse();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700">Failed to load course</p>
          <p className="text-sm text-slate-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const handlePublishToggle = async () => {
    try {
      await publishMutation.mutateAsync({
        courseId: course.id,
        isPublished: !course.isPublished,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(course.id);
      setConfirmOpen(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 px-4 md:px-8 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          <p className="text-slate-600 mt-1">Manage and view your course</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/instructor-portal/courses/$courseId` as "/"}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>
          <Button
            variant="default"
            onClick={handlePublishToggle}
            disabled={publishMutation.isPending}
          >
            {publishMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : course.isPublished ? (
              "Unpublish"
            ) : (
              "Publish"
            )}
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <div className="flex gap-6 items-start">
                <div className="w-48 h-32 bg-slate-100 rounded overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <div className="prose max-w-none">
                    {parse(DOMPurify.sanitize(course.description || ""))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            {course.modules?.map((m: any) => (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle>{m.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-2">{m.description}</p>
                  <div className="space-y-2">
                    {m.lessons?.map((l: any) => (
                      <div key={l.id} className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{l.title}</div>
                            <div className="text-xs text-slate-500">
                              {l.description}
                            </div>
                          </div>
                          <div className="text-sm text-slate-600">
                            {l.duration ? `${l.duration} min` : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter />
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600">Level</div>
                    <div className="font-semibold">{course.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Students</div>
                    <div className="font-semibold">
                      {course?._count?.enrollments || 0}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600">Price</div>
                    <div className="font-semibold">${course.price || 0}</div>
                  </div>
                  <div>
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete Course"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
