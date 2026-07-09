import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Play,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CoachingCourse, useGetMyCoachingCourses } from "@/hooks/coaching";
import parse from "html-react-parser";
export const Route = createFileRoute("/student-dashboard/coaching/")({
  component: CoachingIndexPage,
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function levelColor(level: string) {
  const map: Record<string, string> = {
    Beginner: "bg-emerald-100 text-emerald-700",
    Intermediate: "bg-amber-100 text-amber-700",
    Advanced: "bg-red-100 text-red-600",
    BEGINNER: "bg-emerald-100 text-emerald-700",
    INTERMEDIATE: "bg-amber-100 text-amber-700",
    ADVANCED: "bg-red-100 text-red-600",
  };
  return map[level] ?? "bg-primary/10 text-primary";
}

function statusConfig(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "In Progress", color: "bg-primary/10 text-primary" },
    COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-600" },
  };
  return map[status] ?? { label: status, color: "bg-muted/20 text-muted" };
}

function CoachingCard({
  course,
  index,
}: {
  course: CoachingCourse;
  index: number;
}) {
  const progress = course?.courseProgress?.[0]?.progressPercent ?? 0;
  const status = statusConfig(course?.enrollment?.status);
  const isCompleted = course?.enrollment?.status === "COMPLETED";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={index}
    >
      <div className="bg-white rounded-lg border border-border/60 overflow-hidden transition-all duration-200 group">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-primary/5 overflow-hidden">
          {course?.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-light">
              <BookOpen size={36} className="text-primary/25" />
            </div>
          )}
          {/* Play overlay */}
          {!isCompleted && (
            <Link
              to="/student-dashboard/coaching/$enrollmentId"
              params={{ enrollmentId: course?.id }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <Play size={18} className="text-primary ml-0.5" />
                </div>
              </div>
            </Link>
          )}
          {isCompleted && (
            <div className="absolute top-2.5 right-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                <CheckCircle2 size={14} className="text-white" />
              </div>
            </div>
          )}
          {course?.level && (
            <span
              className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${levelColor(course.level)}`}
            >
              {course.level}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-switzer font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {course?.title ?? "Untitled Program"}
            </h3>
            <Badge className={`text-[10px] shrink-0 border-0 ${status.color}`}>
              {status.label}
            </Badge>
          </div>

          {course?.shortDescription && (
            <p className="text-xs text-muted mb-3 line-clamp-2">
              {parse(course.shortDescription)}
            </p>
          )}

          <p className="font-medium text-foreground text-xs mb-1">
            {course?.teacher?.user?.name}
          </p>

          {/* Progress bar */}
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-xs text-muted">
              <span>Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <p className="text-xs text-muted mb-4 flex items-center gap-1.5">
            <Clock size={11} />
            Enrolled{" "}
            {new Date(course.enrollment.enrolledAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </p>

          {isCompleted ? (
            <div className="flex gap-2">
              <Link to="/student-dashboard/coaching/browse" className="flex-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <Award size={13} /> Certificate
                </Button>
              </Link>
              <Link
                to="/student-dashboard/coaching/$enrollmentId"
                params={{ enrollmentId: course?.id }}
                className="flex-1"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-xs gap-1 text-muted hover:text-foreground"
                >
                  Review <ArrowRight size={12} />
                </Button>
              </Link>
            </div>
          ) : (
            <Link
              to="/student-dashboard/coaching/$enrollmentId"
              params={{ enrollmentId: course?.id }}
            >
              <Button
                size="sm"
                className="w-full text-xs gap-1.5 bg-primary hover:bg-primary/90 rounded-xl"
              >
                <Play size={12} />
                {progress > 0 ? "Continue Learning" : "Start Learning"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-muted">
      <div className="w-16 h-16 rounded-lg bg-primary/8 flex items-center justify-center">
        <BookOpen size={28} className="text-primary/30" />
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

function CoachingIndexPage() {
  const { data, isLoading } = useGetMyCoachingCourses();
  const coachingCourses = data?.data ?? [];

  const active = coachingCourses.filter(
    (e) => e?.enrollment?.status === "ACTIVE",
  );
  const completed = coachingCourses.filter(
    (e) => e?.enrollment?.status === "COMPLETED",
  );
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-switzer font-bold text-foreground">
            My Coaching
          </h1>
          <p className="text-muted text-sm mt-0.5">
            {coachingCourses.length} program
            {coachingCourses.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <div className="flex gap-2 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            {active.length} active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {completed.length} completed
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="bg-white border border-border/60 rounded-xl p-1 mb-6">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              All ({coachingCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              In Progress ({active.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {coachingCourses.length === 0 ? (
                <EmptyState message="You haven't enrolled in any coaching programs yet." />
              ) : (
                coachingCourses.map((course: any, i: number) => (
                  <CoachingCard key={course.id} course={course} index={i} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {active.length === 0 ? (
                <EmptyState message="No programs in progress." />
              ) : (
                active.map((e: any, i: number) => (
                  <CoachingCard key={e.id} course={e} index={i} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {completed.length === 0 ? (
                <EmptyState message="No completed programs yet." />
              ) : (
                completed.map((e: any, i: number) => (
                  <CoachingCard key={e.id} course={e} index={i} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Browse more */}
      {/* {coachingCourses.length > 0 && (
        <div className="flex items-center justify-between py-4 border-t border-border/60">
          <div>
            <p className="text-sm font-medium">Looking for more programs?</p>
            <p className="text-xs text-muted mt-0.5">
              Browse all available coaching courses
            </p>
          </div>
          <Link to="/student-dashboard/coaching/browse">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs border-primary/30 text-primary hover:bg-primary/5"
            >
              Browse Courses <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      )} */}
    </div>
  );
}
