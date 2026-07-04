import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { CoachingNav } from "@/components/CoachingNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCoachingCourse } from "@/hooks/coaching";

export const Route = createFileRoute(
  "/student-dashboard/coaching/$enrollmentId/quiz-scores",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { enrollmentId } = Route.useParams();
  const { data: courseData, isLoading } = useGetCoachingCourse(enrollmentId);
  const course = courseData?.data ?? null;
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  // Collect quiz-type content from all modules
  const quizzes: Array<{
    id: string;
    title: string;
    score?: number;
    totalPoints?: number;
    grade?: string;
    feedback?: string;
    isCompleted?: boolean;
  }> = [];

  if (course?.courseModules) {
    for (const mod of course.courseModules) {
      for (const lesson of mod.lessons ?? []) {
        if (lesson.lessonType === "EXAM") {
          quizzes.push({
            id: lesson.id,
            title: lesson.title,
            score: lesson.progress?.score,
            totalPoints: lesson.totalPoints,
            grade: lesson.progress?.grade,
            feedback: lesson.progress?.feedback,
            isCompleted: lesson.isCompleted,
          });
        }
      }
    }
  }

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

  const completedQuizzes = quizzes.filter((q) => q.isCompleted);
  const avgScore = completedQuizzes.length
    ? Math.round(
        completedQuizzes.reduce(
          (s, q) =>
            s +
            (q.score != null && q.totalPoints
              ? (q.score / q.totalPoints) * 100
              : 0),
          0,
        ) / completedQuizzes.length,
      )
    : 0;

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
          {course?.title ?? "Quiz Scores"}
        </span>
      </div>

      {/* Coaching Nav tabs */}
      <CoachingNav
        enrollmentId={enrollmentId}
        courseName={course?.title ?? ""}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Award size={16} />
            <span className="text-xs font-medium text-muted">
              Average Score
            </span>
          </div>
          <p className="text-2xl font-bold">{avgScore}%</p>
          <p className="text-[10px] text-muted">
            across {completedQuizzes.length} quiz
            {completedQuizzes.length !== 1 ? "zes" : ""}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium text-muted">Completed</span>
          </div>
          <p className="text-2xl font-bold">{completedQuizzes.length}</p>
          <p className="text-[10px] text-muted">of {quizzes.length} quizzes</p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <RotateCcw size={16} />
            <span className="text-xs font-medium text-muted">Pending</span>
          </div>
          <p className="text-2xl font-bold">
            {quizzes.length - completedQuizzes.length}
          </p>
          <p className="text-[10px] text-muted">quizzes remaining</p>
        </div>
      </div>

      {/* Quiz list */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
        <h3 className="font-semibold text-sm mb-4">Quiz History</h3>
        {quizzes.length === 0 ? (
          <p className="text-sm text-muted italic py-4 text-center">
            No quizzes available for this course yet.
          </p>
        ) : (
          <div className="space-y-2">
            {quizzes.map((quiz) => {
              const isExpanded = expandedQuiz === quiz.id;
              const pct =
                quiz.score != null && quiz.totalPoints
                  ? Math.round((quiz.score / quiz.totalPoints) * 100)
                  : null;
              return (
                <div
                  key={quiz.id}
                  className="border border-border/60 rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedQuiz(isExpanded ? null : quiz.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
                  >
                    {quiz.isCompleted ? (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 shrink-0"
                      />
                    ) : (
                      <XCircle size={16} className="text-muted shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {quiz.title}
                      </p>
                      <p className="text-[11px] text-muted">
                        {quiz.isCompleted ? "Completed" : "Pending"}
                      </p>
                    </div>
                    {pct != null && (
                      <Badge
                        className={`text-xs shrink-0 ${
                          pct >= 80
                            ? "bg-emerald-100 text-emerald-700"
                            : pct >= 50
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-600"
                        } border-0`}
                      >
                        {pct}%
                      </Badge>
                    )}
                  </button>
                  {isExpanded && quiz.isCompleted && (
                    <div className="px-4 pb-3 border-t border-border/40 pt-2">
                      <div className="text-xs text-muted space-y-1">
                        <p>
                          Score:{" "}
                          <span className="font-semibold text-foreground">
                            {quiz.score}/{quiz.totalPoints ?? "—"}
                          </span>
                        </p>
                        {quiz.grade && (
                          <p>
                            Grade:{" "}
                            <span className="font-semibold text-foreground">
                              {quiz.grade}
                            </span>
                          </p>
                        )}
                        {quiz.feedback && (
                          <p className="italic">"{quiz.feedback}"</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
