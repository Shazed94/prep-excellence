/**
 * Phase 3 – Browse Coaching Courses
 * Route: /student-dashboard/coaching/browse
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Calendar, Clock, Loader2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type CoachingCourse } from "@/hooks/coaching";
import { useGetPublishedCoachingCourses } from "@/hooks/course-management";

export const Route = createFileRoute("/student-dashboard/coaching/browse")({
  component: BrowseCoachingPage,
});

function levelColor(level: string) {
  const map: Record<string, string> = {
    BEGINNER: "bg-emerald-100 text-emerald-700",
    INTERMEDIATE: "bg-amber-100 text-amber-700",
    ADVANCED: "bg-red-100 text-red-600",
  };
  return map[level] ?? "bg-muted/20 text-muted";
}

function CourseBrowseCard({ course }: { course: CoachingCourse }) {
  const price = course.discount ?? course.price;
  const hasDiscount = course.discount && course.discount < course.price;

  return (
    <div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden transition-shadow group">
      <div className="relative aspect-video overflow-hidden bg-primary-light">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={40} className="text-primary/30" />
          </div>
        )}
        {course.level && (
          <div className="absolute top-2 left-2">
            <Badge
              className={`text-[10px] border-0 ${levelColor(course.level)}`}
            >
              {course.level}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-switzer font-bold text-sm line-clamp-2">
            {course.title}
          </h3>
          {course.shortDescription && (
            <p className="text-xs text-muted mt-1 line-clamp-2">
              {course.shortDescription}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] text-muted">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {course.duration} weeks
            </span>
          )}
          {course.capacity && (
            <span className="flex items-center gap-1">
              <Users size={11} /> {course.capacity} seats
            </span>
          )}
          {course.startDate && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />{" "}
              {new Date(course.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="font-bold text-foreground">
              ৳{price?.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through ml-1.5">
                ৳{course.price?.toLocaleString()}
              </span>
            )}
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}

function BrowseCoachingPage() {
  const { data, isLoading } = useGetPublishedCoachingCourses();
  const courses: CoachingCourse[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-switzer font-bold">Browse Coaching</h1>
          <p className="text-muted text-sm mt-0.5">
            Instructor-led programs with live sessions
          </p>
        </div>
        <Link to="/student-dashboard/coaching">
          <Button variant="outline" size="sm" className="text-xs">
            My Enrollments
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-muted">
          <BookOpen size={48} className="opacity-20" />
          <p className="text-sm">No coaching programs available yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <CourseBrowseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
