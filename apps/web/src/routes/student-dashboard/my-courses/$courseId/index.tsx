import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileText,
  MessageSquare,
  Play,
  Star,
} from "lucide-react";
import { useState } from "react";
import { CourseNav } from "@/components/CourseNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCoachingCourse } from "@/hooks/coaching";

export const Route = createFileRoute(
  "/student-dashboard/my-courses/$courseId/",
)({
  component: CoursePlayerPage,
});

function CoursePlayerPage() {
  const { courseId } = Route.useParams();

  const { data: courseData } = useGetCoachingCourse(courseId);
  const course = courseData?.data;
  const overallProgress = course?.courseProgress?.[0]?.progressPercent ?? 0;
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([course?.courseModules?.[0]?.id ?? ""]),
  );
  const [selectedLesson, setSelectedLesson] = useState<any>(
    course?.courseModules?.[0]?.lessons?.[0] ?? null,
  );
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(
      course?.courseModules
        ?.flatMap((m: any) => m.lessons)
        .filter((l: any) => l.completed)
        .map((l: any) => l.id) ?? [],
    ),
  );

  const totalLessons: number =
    course?.courseModules?.reduce(
      (s: number, m: any) => s + m.lessons.length,
      0,
    ) ?? 0;
  const completedCount = completedLessonIds.size;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => new Set([...prev, lessonId]));
  };

  return (
    <div className="space-y-4">
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
      {/* Course nav tabs */}
      <CourseNav courseId={courseId} courseName={course?.title ?? ""} />
      {/* Overall progress banner */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-bold text-primary">
                {overallProgress}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          <div className="text-right text-xs text-muted shrink-0">
            <p className="font-semibold text-foreground">
              {completedCount} / {totalLessons}
            </p>
            <p>lessons done</p>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Lesson Sidebar */}
        <div className="bg-white rounded-lg border border-border/60 shadow-sm h-fit sticky top-4 overflow-hidden">
          <div className="p-4 border-b border-border/60">
            <h3 className="font-semibold text-sm">Course Content</h3>
            <p className="text-xs text-muted mt-0.5">
              {completedCount}/{totalLessons} lessons completed
            </p>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
            {course?.courseModules?.map((mod: any) => (
              <div
                key={mod.id}
                className="border-b border-border/40 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {mod.title}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {mod.lessons.length} lessons · {mod.duration} min
                    </p>
                  </div>
                  {expandedModules.has(mod.id) ? (
                    <ChevronUp size={14} className="text-muted shrink-0 ml-2" />
                  ) : (
                    <ChevronDown
                      size={14}
                      className="text-muted shrink-0 ml-2"
                    />
                  )}
                </button>
                {expandedModules.has(mod.id) && (
                  <div className="divide-y divide-border/30">
                    {mod.lessons.map((lesson: any) => {
                      const isDone = completedLessonIds.has(lesson.id);
                      const isSelected = selectedLesson?.id === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            isSelected
                              ? "bg-primary/8 border-l-2 border-primary"
                              : "hover:bg-muted/30"
                          }`}
                        >
                          <div
                            className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              isDone
                                ? "bg-emerald-500"
                                : "border-2 border-border"
                            }`}
                          >
                            {isDone && (
                              <CheckCircle2 size={11} className="text-white" />
                            )}
                            {!isDone && lesson.lessonType === "VIDEO" && (
                              <Play size={9} className="text-muted ml-0.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-xs font-medium truncate ${
                                isSelected ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {lesson.title}
                            </p>
                            <p className="text-[10px] text-muted">
                              {lesson.duration} min
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Video Player / Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Area */}
          <div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden">
            {selectedLesson?.videoUrl ? (
              // biome-ignore lint/a11y/useMediaCaption: captions served via external API
              <video
                key={selectedLesson.id}
                src={selectedLesson.videoUrl}
                controls
                className="w-full aspect-video bg-black"
                onEnded={() => handleLessonComplete(selectedLesson.id)}
              />
            ) : (
              <div className="aspect-video bg-linear-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center gap-3">
                {selectedLesson ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                      <FileText size={24} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium">
                      {selectedLesson.title}
                    </p>
                    <p className="text-xs text-muted">
                      Text / PDF content lesson
                    </p>
                    {!completedLessonIds.has(selectedLesson.id) && (
                      <Button
                        size="sm"
                        className="mt-2 bg-primary text-xs"
                        onClick={() => handleLessonComplete(selectedLesson.id)}
                      >
                        <CheckCircle2 size={13} className="mr-1" /> Mark as
                        Complete
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                      <Play size={24} className="text-primary ml-1" />
                    </div>
                    <p className="text-sm text-muted">
                      Select a lesson to start watching
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Lesson title & actions */}
          {selectedLesson && (
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-switzer font-bold text-base">
                  {selectedLesson.title}
                </h2>
                {selectedLesson.description && (
                  <p className="text-xs text-muted mt-1 line-clamp-2">
                    {selectedLesson.description}
                  </p>
                )}
              </div>
              {!completedLessonIds.has(selectedLesson.id) ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => handleLessonComplete(selectedLesson.id)}
                >
                  <CheckCircle2 size={13} className="mr-1" /> Mark Complete
                </Button>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs shrink-0">
                  ✓ Completed
                </Badge>
              )}
            </div>
          )}

          {/* Info tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="bg-white border border-border/60 rounded-xl p-1">
              <TabsTrigger
                value="overview"
                className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <BookOpen size={13} /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="discussions"
                className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <MessageSquare size={13} /> Discussions
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="gap-1 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Star size={13} /> Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="bg-white rounded-xl border border-border/60 p-5 space-y-3">
                <h3 className="font-semibold text-foreground">
                  {course?.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {course?.longDescription ?? course?.shortDescription}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <BookOpen size={12} className="text-primary" />
                    {totalLessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Play size={12} className="text-primary" />
                    {course?.duration ?? "—"}h total
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500" />
                    {course?.averageRating ?? 0} ({course?.totalReviews ?? 0}{" "}
                    ratings)
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="discussions" className="mt-4">
              <div className="bg-white rounded-xl border border-border/60 p-5 text-center text-sm text-muted py-8">
                {selectedLesson
                  ? "Discussions for this lesson will appear here."
                  : "Select a lesson to view discussions."}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="bg-white rounded-xl border border-border/60 p-5 text-center text-sm text-muted py-8">
                Course reviews will appear here.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
