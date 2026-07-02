import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCourseProgress, mockCourses } from "@/lib/mock-data";
import { CourseNav } from "@/components/CourseNav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/student-dashboard/my-courses/$courseId/progress",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const course = mockCourses.find((c) => c.id === courseId) ?? mockCourses[0];
  const progressData = getCourseProgress(courseId);

  const completionPct =
    progressData.totalLessons > 0
      ? Math.round(
          (progressData.completedLessons / progressData.totalLessons) * 100,
        )
      : 0;

  const activityIcon = (type: string) => {
    if (type === "lesson_completed")
      return <CheckCircle2 size={14} className="text-primary" />;
    if (type === "quiz_completed")
      return <Award size={14} className="text-amber-500" />;
    if (type === "course_completed")
      return <TrendingUp size={14} className="text-emerald-500" />;
    return <BookOpen size={14} className="text-muted" />;
  };

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/student-dashboard/my-courses">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted text-xs"
          >
            <ArrowLeft size={14} /> My Courses
          </Button>
        </Link>
        <ChevronRight size={13} className="text-muted" />
        <span className="text-sm font-medium text-foreground truncate">
          {course?.title ?? "Course Player"}
        </span>
      </div>
      <CourseNav courseId={course.id} courseName={course.title} />
      <div className="">
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted">Overall Progress</span>
                <TrendingUp size={18} className="text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">
                {completionPct}%
              </p>
              <Progress value={completionPct} className="h-1.5 mt-3" />
            </div>

            <div className="bg-white rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted">Lessons Done</span>
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {progressData.completedLessons}
                <span className="text-lg text-muted font-normal">
                  /{progressData.totalLessons}
                </span>
              </p>
              <p className="text-xs text-muted mt-1">lessons completed</p>
            </div>

            <div className="bg-white rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted">Avg Quiz Score</span>
                <Award size={18} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {progressData.averageScore}%
              </p>
              <p className="text-xs text-muted mt-1">quiz performance</p>
            </div>

            <div className="bg-white rounded-2xl border border-border/60 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted">Time Remaining</span>
                <Clock size={18} className="text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {progressData.estimatedTimeRemaining}h
              </p>
              <p className="text-xs text-muted mt-1">estimated left</p>
            </div>
          </div>

          {/* Module breakdown */}
          <div className="bg-white rounded-2xl border border-border/60 p-6">
            <h2 className="font-semibold text-foreground mb-5">
              Module Breakdown
            </h2>
            <div className="space-y-4">
              {(course as any)?.modules?.map((mod: any) => {
                const total = mod.lessons.length;
                const done = mod.lessons.filter((l: any) => l.completed).length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {mod.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">
                          {done}/{total} lessons
                        </span>
                        {mod.completed && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                            ✓ Done
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          {progressData.recentActivity.length > 0 && (
            <div className="bg-white rounded-2xl border border-border/60 p-6">
              <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                <Activity size={16} className="text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {progressData.recentActivity.map(
                  (activity: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {activityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted">
                          {activity.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {activity.score !== undefined &&
                            ` · Score: ${activity.score}%`}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
