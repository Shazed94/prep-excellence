import { format } from "date-fns";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetMyAttemptsAnswers } from "@/hooks/sat-attempt";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* =========================
   Attempt Status Enum
========================= */
export enum AttemptStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  SUBMITTED = "SUBMITTED",
  GRADED = "GRADED",
}

/* =========================
   Props
========================= */
interface ResultDetailProps {
  attemptId: string;
  meta: {
    testName: string;
    date: string;
    status: AttemptStatus;
  };
  onBack: () => void;
}

/* =========================
   Status Helpers
========================= */
const STATUS_CONFIG: Record<
  AttemptStatus,
  { label: string; className: string }
> = {
  [AttemptStatus.NOT_STARTED]: {
    label: "Not Started",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [AttemptStatus.IN_PROGRESS]: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [AttemptStatus.PAUSED]: {
    label: "Paused",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  [AttemptStatus.COMPLETED]: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [AttemptStatus.SUBMITTED]: {
    label: "Submitted",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  [AttemptStatus.GRADED]: {
    label: "Graded",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

/* =========================
   Question Type Renderers
========================= */
const QuestionRenderer = ({
  answer,
  questionNumber,
}: {
  answer: any;
  questionNumber: number;
}) => {
  const question = answer.question;
  const optionType = question.optionType;

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const renderOptions = () => {
    if (optionType === "SINGLE_CHOICE" || optionType === "MULTIPLE_CHOICE") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-3">
          {question.options.map((option: any) => {
            const isSelected = option.selected;
            const isCorrect = option.isCorrect;

            let bgColor = "bg-gray-50";
            let borderColor = "border-gray-200";
            let textColor = "text-gray-900";

            if (isSelected && isCorrect) {
              bgColor = "bg-emerald-50";
              borderColor = "border-emerald-500";
              textColor = "text-emerald-900";
            } else if (isSelected && !isCorrect) {
              bgColor = "bg-red-50";
              borderColor = "border-red-500";
              textColor = "text-red-900";
            } else if (!isSelected && isCorrect) {
              bgColor = "bg-emerald-50/50";
              borderColor = "border-emerald-300";
              textColor = "text-emerald-800";
            }

            return (
              <div
                key={option.id}
                className={cn(
                  "p-2.5 md:p-3 rounded-lg border-2 flex items-start gap-2 md:gap-3",
                  bgColor,
                  borderColor,
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isSelected && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                  )}
                  {!isSelected && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "text-sm md:text-base font-medium",
                      textColor,
                    )}
                  >
                    {stripHtml(option.content)}
                  </p>
                  {isCorrect && !isSelected && (
                    <p className="text-xs text-emerald-600 mt-1">
                      ✓ Correct answer
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (optionType === "TRUE_FALSE") {
      return (
        <div className="grid grid-cols-2 gap-2 md:gap-3 mt-3">
          {question.options.map((option: any) => {
            const isSelected = option.selected;
            const isCorrect = option.isCorrect;

            let bgColor = "bg-gray-50";
            let borderColor = "border-gray-200";

            if (isSelected && isCorrect) {
              bgColor = "bg-emerald-50";
              borderColor = "border-emerald-500";
            } else if (isSelected && !isCorrect) {
              bgColor = "bg-red-50";
              borderColor = "border-red-500";
            } else if (!isSelected && isCorrect) {
              bgColor = "bg-emerald-50/50";
              borderColor = "border-emerald-300";
            }

            return (
              <div
                key={option.id}
                className={cn(
                  "p-2.5 md:p-3 rounded-lg border-2 flex items-center gap-2 md:gap-3",
                  bgColor,
                  borderColor,
                )}
              >
                {isSelected && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                )}
                {isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                )}
                {!isSelected && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                )}
                <span className="text-sm md:text-base font-medium">
                  {option.content}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    if (optionType === "SHORT_ANSWER") {
      const correctAnswer = question.correctAnswer || "";
      return (
        <div className="space-y-2 md:space-y-3 mt-3">
          <div
            className={cn(
              "p-3 md:p-4 rounded-lg border-2",
              answer.isCorrect
                ? "bg-emerald-50 border-emerald-500"
                : "bg-red-50 border-red-500",
            )}
          >
            <p className="text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2">
              Your Answer:
            </p>
            <p className="text-sm md:text-base font-medium">
              {answer.textAnswer || "(No answer provided)"}
            </p>
          </div>

          <div className="p-3 md:p-4 rounded-lg border-2 bg-emerald-50/50 border-emerald-300">
            <p className="text-xs md:text-sm text-emerald-600 mb-1.5 md:mb-2">
              Correct Answer:
            </p>
            <p className="text-sm md:text-base font-medium text-emerald-900">
              {stripHtml(correctAnswer)}
            </p>
          </div>
        </div>
      );
    }

    if (optionType === "FILL_IN_THE_BLANK") {
      const correctAnswer = question.correctAnswer || "";
      return (
        <div className="space-y-2 md:space-y-3 mt-3">
          <div
            className={cn(
              "p-3 md:p-4 rounded-lg border-2",
              answer.isCorrect
                ? "bg-emerald-50 border-emerald-500"
                : "bg-red-50 border-red-500",
            )}
          >
            <p className="text-xs md:text-sm text-gray-600 mb-1.5 md:mb-2">
              Your Answer:
            </p>
            <p className="text-sm md:text-base font-medium">
              {answer.textAnswer || "(No answer provided)"}
            </p>
          </div>

          {correctAnswer && (
            <div className="p-3 md:p-4 rounded-lg border-2 bg-emerald-50/50 border-emerald-300">
              <p className="text-xs md:text-sm text-emerald-600 mb-1.5 md:mb-2">
                Correct Answer:
              </p>
              <p className="text-sm md:text-base font-medium text-emerald-900">
                {correctAnswer}
              </p>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg p-3 md:p-4 bg-white">
      <div className="flex flex-col md:flex-row items-start justify-between mb-3 md:mb-4 gap-2">
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-semibold">
            Q{questionNumber}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {question.difficulty}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {optionType.replace(/_/g, " ")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {question.points}pt
          </Badge>
        </div>

        {answer.isCorrect !== null ? (
          answer.isCorrect ? (
            <Badge className="bg-emerald-500 text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Correct
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              <XCircle className="w-3 h-3 mr-1" />
              Incorrect
            </Badge>
          )
        ) : (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        )}
      </div>

      <div className="prose prose-sm max-w-none mb-3 text-sm md:text-base">
        {parse(DOMPurify.sanitize(question.content))}
      </div>

      {renderOptions()}

      {question.explanation && (
        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs md:text-sm font-semibold text-blue-900 mb-1.5 md:mb-2">
            Explanation:
          </p>
          <div className="prose prose-sm max-w-none text-blue-800 text-xs md:text-sm">
            {parse(DOMPurify.sanitize(question.explanation))}
          </div>
        </div>
      )}

      <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-4 text-xs text-gray-600 flex-wrap">
        <span>
          Earned: {answer.pointsEarned}/{question.points}
        </span>
        {answer.timeSpent > 0 && (
          <>
            <span>•</span>
            <span>Time: {answer.timeSpent}s</span>
          </>
        )}
        {answer.flaggedForReview && (
          <>
            <span>•</span>
            <Badge variant="outline" className="text-xs">
              Flagged
            </Badge>
          </>
        )}
      </div>
    </div>
  );
};

/* =========================
   Component
========================= */
export function ResultDetail({ attemptId, meta, onBack }: ResultDetailProps) {
  const { data, isLoading, isError } = useGetMyAttemptsAnswers(attemptId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading result details…</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">Failed to load result details</p>
        <Button onClick={onBack} variant="outline">
          Back to Results
        </Button>
      </div>
    );
  }

  const attemptData = data.data;
  const totalScore = attemptData.totalScore ?? 0;
  const percentage = attemptData.percentageScore ?? 0;
  const maxScore = attemptData.maxScore ?? 0;
  const studentInfo = attemptData.student?.user;
  const testInfo = attemptData.satPractice;
  const sections = attemptData.sections ?? [];

  // Calculate totals
  let totalCorrectAnswers = 0;
  let totalQuestions = 0;
  sections.forEach((section: any) => {
    section.modules?.forEach((module: any) => {
      totalCorrectAnswers += module.correctAnswers ?? 0;
      totalQuestions += module.totalQuestions ?? 0;
    });
  });

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const statusConfig = STATUS_CONFIG[meta.status];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2 text-sm md:text-base h-9 md:h-10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Results</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      {/* Test Info */}
      <div className="border rounded-lg p-3 md:p-6 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 md:space-y-2 flex-1 min-w-0">
            <h1 className="text-lg md:text-2xl font-bold break-words">
              {testInfo?.name ?? meta.testName}
            </h1>
            <div className="space-y-0.5 md:space-y-1 text-xs md:text-sm text-muted-foreground">
              <p>Type: {testInfo?.testType?.name ?? "—"}</p>
              <p>Subject: {testInfo?.subject?.name ?? "—"}</p>
              {studentInfo && (
                <p className="break-words">
                  {studentInfo.name} • {studentInfo.email}
                </p>
              )}
            </div>
          </div>

          <Badge className={cn(statusConfig.className, "text-xs shrink-0")}>
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <div className="border-2 border-primary/20 rounded-lg p-3 md:p-6 bg-white">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <Target className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Score</p>
          </div>
          <p className="text-2xl md:text-4xl font-bold text-primary">
            {totalScore}
          </p>
          <p className="text-xs text-muted-foreground mt-1 md:mt-2">
            of {maxScore}
          </p>
        </div>

        <div className="border rounded-lg p-3 md:p-6 bg-white">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
            <p className="text-xs font-medium text-muted-foreground">Rate</p>
          </div>
          <p className="text-2xl md:text-4xl font-bold text-emerald-600">
            {percentage.toFixed(1)}%
          </p>
        </div>

        <div className="border rounded-lg p-3 md:p-6 bg-white">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <Award className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
            <p className="text-xs font-medium text-muted-foreground">Correct</p>
          </div>
          <p className="text-2xl md:text-4xl font-bold text-blue-600">
            {totalCorrectAnswers}/{totalQuestions}
          </p>
        </div>

        <div className="border rounded-lg p-3 md:p-6 bg-white">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <Clock className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
            <p className="text-xs font-medium text-muted-foreground">Time</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            {sections[0]?.section?.duration ?? 0}m
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="border rounded-lg p-3 md:p-6 bg-white">
        <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">
          Timeline
        </h2>
        <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">Started:</span>
            <span className="font-medium text-right">
              {attemptData.startedAt
                ? formatDateTime(attemptData.startedAt)
                : "—"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">Completed:</span>
            <span className="font-medium text-right">
              {attemptData.completedAt
                ? formatDateTime(attemptData.completedAt)
                : "—"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">Submitted:</span>
            <span className="font-medium text-right">
              {attemptData.submittedAt
                ? formatDateTime(attemptData.submittedAt)
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      {(meta.status === AttemptStatus.GRADED ||
        meta.status === AttemptStatus.SUBMITTED) && (
        <div className="border rounded-lg p-3 md:p-6 bg-white">
          <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">
            Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                <span className="text-sm md:text-base font-medium">
                  Correct
                </span>
              </div>
              <span className="text-lg md:text-xl font-bold text-emerald-600">
                {totalCorrectAnswers}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 md:p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                <span className="text-sm md:text-base font-medium">
                  Incorrect
                </span>
              </div>
              <span className="text-lg md:text-xl font-bold text-red-600">
                {totalQuestions - totalCorrectAnswers}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sections with Modules and Questions */}
      {sections.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold">Test Sections</h2>

          {sections.map((section: any, sectionIndex: number) => {
            let questionCounter = 0;
            for (let i = 0; i < sectionIndex; i++) {
              sections[i].modules?.forEach((m: any) => {
                questionCounter += m.totalQuestions ?? 0;
              });
            }

            return (
              <div
                key={section.id}
                className="border-2 rounded-lg overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-gray-50 p-3 md:p-4 border-b-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-xl font-bold break-words">
                        {section.section?.name ?? `Section ${sectionIndex + 1}`}
                      </h3>
                      {/* <div className="flex items-center gap-2 md:gap-4 mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground flex-wrap">
												<span>{section.section?.duration ?? 0}min</span>
												<span>•</span>
												<span>Order: {(section.section?.orderIndex ?? 0) + 1}</span>
											</div> */}
                    </div>
                    <Badge
                      variant={
                        section.status === "COMPLETED" ? "default" : "outline"
                      }
                      className="text-xs shrink-0"
                    >
                      {section.status}
                    </Badge>
                  </div>
                </div>

                {/* Modules */}
                <div className="p-3 md:p-4 space-y-4 md:space-y-6 bg-white">
                  {section.modules && section.modules.length > 0 ? (
                    section.modules.map((module: any, moduleIndex: number) => {
                      const moduleStartQuestion = questionCounter + 1;
                      questionCounter += module.totalQuestions ?? 0;

                      return (
                        <div key={module.id} className="space-y-3 md:space-y-4">
                          {/* Module Header */}
                          <div className="flex items-start justify-between pb-2 md:pb-3 border-b gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm md:text-lg font-semibold break-words">
                                {module.module?.name ??
                                  `Module ${moduleIndex + 1}`}
                              </h4>
                              <div className="flex items-center gap-2 md:gap-3 flex-wrap mt-1 md:mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {module.usedQuestionSet?.replace(/_/g, " ")}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {module.score ?? 0}/{module.maxScore ?? 0}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {module.correctAnswers ?? 0}/
                                  {module.totalQuestions ?? 0}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                module.status === "COMPLETED"
                                  ? "default"
                                  : "outline"
                              }
                              className="text-xs shrink-0"
                            >
                              {module.status}
                            </Badge>
                          </div>

                          {/* Questions */}
                          <div className="space-y-3 md:space-y-4">
                            {module.answers && module.answers.length > 0 ? (
                              module.answers.map(
                                (answer: any, answerIndex: number) => (
                                  <QuestionRenderer
                                    key={answer.id}
                                    answer={answer}
                                    questionNumber={
                                      moduleStartQuestion + answerIndex
                                    }
                                  />
                                ),
                              )
                            ) : (
                              <p className="text-center text-muted-foreground text-sm py-4">
                                No questions available
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      No modules available
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* In Progress Notice */}
      {meta.status === AttemptStatus.IN_PROGRESS && (
        <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-3 md:p-4">
          <div className="flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm md:text-base font-medium text-blue-900 mb-1">
                Test in Progress
              </p>
              <p className="text-xs md:text-sm text-blue-700">
                Complete the test to see your final score and analysis.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
