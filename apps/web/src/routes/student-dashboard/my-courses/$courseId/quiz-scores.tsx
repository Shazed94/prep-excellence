import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getCourseQuizzes, mockCourses } from "@/lib/mock-data";
import { CourseNav } from "@/components/CourseNav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/student-dashboard/my-courses/$courseId/quiz-scores",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const course = mockCourses.find((c) => c.id === courseId) ?? mockCourses[0];
  const quizzes = getCourseQuizzes(courseId);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  const avgScore = quizzes.length
    ? Math.round(quizzes.reduce((s, q) => s + q.percentage, 0) / quizzes.length)
    : 0;
  const passed = quizzes.filter((q) => q.status === "Passed").length;

  const scoreBg = (pct: number) => {
    if (pct >= 90) return "border-emerald-400 bg-emerald-50 text-emerald-600";
    if (pct >= 70) return "border-amber-400 bg-amber-50 text-amber-600";
    return "border-red-400 bg-red-50 text-red-500";
  };

  const statusBadge = (pct: number) => {
    if (pct >= 90) return "bg-emerald-100 text-emerald-700";
    if (pct >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-600";
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
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Award size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted">Avg Score</p>
                <p className="text-2xl font-bold text-primary">{avgScore}%</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={22} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted">Passed</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {passed}/{quizzes.length}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Clock size={22} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted">Total Quizzes</p>
                <p className="text-2xl font-bold text-foreground">
                  {quizzes.length}
                </p>
              </div>
            </div>
          </div>

          {/* Quiz list */}
          {quizzes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border/60">
              <Award size={40} className="mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold text-foreground">No quizzes yet</h3>
              <p className="text-sm text-muted mt-1">
                Complete course lessons to unlock quizzes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-border/60 overflow-hidden"
                >
                  <button
                    type="button"
                    className="w-full flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors text-left"
                    onClick={() =>
                      setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)
                    }
                  >
                    {/* Score circle */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-bold text-lg border-2 ${scoreBg(quiz.percentage)}`}
                    >
                      {quiz.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {quiz.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {quiz.attemptDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {Math.floor(quiz.timeSpent / 60)}m{" "}
                        {quiz.timeSpent % 60}s
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        className={`border-0 text-xs ${statusBadge(quiz.percentage)}`}
                      >
                        {quiz.status}
                      </Badge>
                      {quiz.canRetake && (
                        <span className="flex items-center gap-1 text-xs text-primary">
                          <RotateCcw size={12} /> Retake
                        </span>
                      )}
                    </div>
                  </button>

                  {expandedQuiz === quiz.id && quiz.questions.length > 0 && (
                    <div className="border-t border-border/60 px-5 pb-5 pt-3 space-y-3">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wide">
                        Question Review
                      </p>
                      {quiz.questions.map((q) => (
                        <div
                          key={q.id}
                          className={`rounded-xl border p-4 ${
                            q.isCorrect
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {q.isCorrect ? (
                              <CheckCircle2
                                size={15}
                                className="text-emerald-600 mt-0.5 shrink-0"
                              />
                            ) : (
                              <XCircle
                                size={15}
                                className="text-red-500 mt-0.5 shrink-0"
                              />
                            )}
                            <p className="text-sm font-medium text-foreground">
                              {q.question}
                            </p>
                          </div>
                          <div className="ml-5 space-y-1 text-xs">
                            <p className="text-muted">
                              Your answer:{" "}
                              <span
                                className={
                                  q.isCorrect
                                    ? "text-emerald-600 font-medium"
                                    : "text-red-500 font-medium"
                                }
                              >
                                {q.userAnswer}
                              </span>
                            </p>
                            {!q.isCorrect && (
                              <p className="text-muted">
                                Correct:{" "}
                                <span className="text-emerald-600 font-medium">
                                  {q.correctAnswer}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
