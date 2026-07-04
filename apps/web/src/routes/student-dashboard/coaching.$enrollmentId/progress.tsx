import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { CoachingNav } from "@/components/CoachingNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetCoachingCourse } from "@/hooks/coaching";

export const Route = createFileRoute(
  "/student-dashboard/coaching/$enrollmentId/progress",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { enrollmentId } = Route.useParams();
  const { data: courseData, isLoading } = useGetCoachingCourse(enrollmentId);
  const course = courseData?.data ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center py-20 gap-3">
        <p className="text-muted">Course not found</p>
        <Link to="/student-dashboard/coaching">
          <Button variant="outline" size="sm">
            Back to Coaching
          </Button>
        </Link>
      </div>
    );
  }

  const progress = course.progressPercent ?? 0;
  const modules = course.courseModules ?? [];
  const totalLessons = modules.reduce(
    (sum: number, m: any) => sum + (m.lessons?.length ?? 0),
    0,
  );
  const completedLessons = modules.reduce(
    (sum: number, m: any) =>
      sum + (m.lessons?.filter((l: any) => l.isCompleted).length ?? 0),
    0,
  );

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/student-dashboard/coaching">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted text-xs"
          >
            <ArrowLeft size={14} /> My Coaching
          </Button>
        </Link>
        <ChevronRight size={13} className="text-muted" />
        <span className="text-sm font-medium text-foreground truncate">
          {course?.title ?? "Progress"}
        </span>
      </div>

      {/* Coaching Nav tabs */}
      <CoachingNav
        enrollmentId={enrollmentId}
        courseName={course?.title ?? ""}
      />

      {/* Overall progress banner */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold text-primary">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="text-right text-xs text-muted shrink-0">
            <p className="font-semibold text-foreground">
              {completedLessons} / {totalLessons}
            </p>
            <p>lessons done</p>
          </div>
        </div>
      </div>

      {/* Module-by-module breakdown */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          Module Progress
        </h3>
        <div className="space-y-4">
          {modules.length === 0 ? (
            <p className="text-sm text-muted italic">
              No modules available yet.
            </p>
          ) : (
            modules.map((mod: any) => {
              const modLessons = mod.lessons ?? [];
              const modCompleted = modLessons.filter(
                (l: any) => l.isCompleted,
              ).length;
              const modPct =
                modLessons.length > 0
                  ? Math.round((modCompleted / modLessons.length) * 100)
                  : 0;
              return (
                <div key={mod.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {mod.title}
                    </span>
                    <span className="text-muted">
                      {modCompleted}/{modLessons.length} ({modPct}%)
                    </span>
                  </div>
                  <Progress value={modPct} className="h-1.5" />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Completion stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium text-muted">Completed</span>
          </div>
          <p className="text-xl font-bold">{completedLessons}</p>
          <p className="text-[10px] text-muted">lessons</p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <BookOpen size={16} />
            <span className="text-xs font-medium text-muted">Total</span>
          </div>
          <p className="text-xl font-bold">{totalLessons}</p>
          <p className="text-[10px] text-muted">lessons</p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium text-muted">Progress</span>
          </div>
          <p className="text-xl font-bold">{progress}%</p>
          <p className="text-[10px] text-muted">overall</p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 p-4">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <Clock size={16} />
            <span className="text-xs font-medium text-muted">Duration</span>
          </div>
          <p className="text-xl font-bold">{course.duration ?? "—"}</p>
          <p className="text-[10px] text-muted">days</p>
        </div>
      </div>

      {/* Completion status */}
      {course.status === "COMPLETED" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Course Completed
            </p>
            <p className="text-xs text-emerald-600">
              Congratulations! You have completed this coaching program.
            </p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 border-0 ml-auto shrink-0">
            Completed
          </Badge>
        </div>
      )}
    </div>
  );
}
