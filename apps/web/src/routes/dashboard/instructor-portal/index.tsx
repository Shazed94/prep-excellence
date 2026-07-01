import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Loader2,
  Plus,
  Star,
  TrendingUp,
  Users,
  Video,
  XCircle,
} from "lucide-react";
import { useGetCourses } from "@/hooks/lms-course";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/dashboard/instructor-portal/")({
  component: RouteComponent,
});

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border border-[#EBEBEB] p-5 bg-white`}>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[28px] font-bold text-[#141B34] leading-none mb-1">
        {value}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// ─── Course Row ───────────────────────────────────────────────────────────────

function CourseRow({ course }: { course: any }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#F1F5F9] last:border-0">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0 overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#141B34] truncate">
          {course.title}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" />
            {course.enrolledCount ?? 0} enrolled
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {course.level ?? "—"}
          </span>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex-shrink-0">
        {course.isPublished ? (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            Draft
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Link
          to="/dashboard/instructor-portal/courses/$courseId"
          params={{ courseId: course.id }}
        >
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-light transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </Link>
        <Link
          to="/dashboard/instructor-portal/courses/$courseId"
          params={{ courseId: course.id }}
        >
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-light transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </Link>
      </div>
    </div>
  );
}

// ─── Quick Link ───────────────────────────────────────────────────────────────

function QuickLink({
  label,
  desc,
  href,
  icon: Icon,
}: {
  label: string;
  desc: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link to={href}>
      <div className="flex items-center gap-3 p-4 rounded-xl border border-[#EBEBEB] bg-white hover:border-primary hover:bg-primary-light/30 transition-all group">
        <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
          <Icon className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#141B34]">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const user = getUser();

  const { data: courses, isLoading } = useGetCourses();
  const allCourses: any[] = Array.isArray(courses) ? courses : [];

  const published = allCourses.filter((c) => c.isPublished);
  const drafts = allCourses.filter((c) => !c.isPublished);
  const totalStudents = allCourses.reduce(
    (acc, c) => acc + (c.enrolledCount ?? 0),
    0,
  );
  const totalRevenue = allCourses.reduce(
    (acc, c) =>
      acc +
      (c.enrolledCount ?? 0) * (Number(c.price) || Number(c.discount) || 0),
    0,
  );

  const recentCourses = [...allCourses].slice(0, 6);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{greeting}</p>
          <h1 className="text-2xl font-bold text-[#141B34]">
            {greeting}, {user?.name ?? "Instructor"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's a summary of your courses and students.
          </p>
        </div>
        <Link to="/dashboard/instructor-portal/create-course">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total Courses"
          value={isLoading ? "—" : allCourses.length}
          icon={BookOpen}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Published"
          value={isLoading ? "—" : published.length}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Total Students"
          value={isLoading ? "—" : totalStudents}
          icon={Users}
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Est. Revenue"
          value={isLoading ? "—" : `$${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* ── Courses + Quick links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-[#141B34]">
              Your Courses
            </h2>
            <Link
              to="/dashboard/instructor-portal/courses"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                No courses yet
              </p>
              <Link to="/dashboard/instructor-portal/create-course">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create your first course
                </button>
              </Link>
            </div>
          ) : (
            <div>
              {recentCourses.map((course) => (
                <CourseRow key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Draft reminder */}
          {drafts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-amber-600" />
                <p className="text-sm font-semibold text-amber-700">
                  {drafts.length} unpublished{" "}
                  {drafts.length === 1 ? "course" : "courses"}
                </p>
              </div>
              <p className="text-xs text-amber-600 mb-3">
                Publish your drafts to make them visible to students.
              </p>
              <Link to="/dashboard/instructor-portal/courses">
                <button
                  type="button"
                  className="text-xs font-semibold text-amber-700 underline underline-offset-2"
                >
                  Review drafts →
                </button>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
            <h2 className="font-semibold text-sm text-[#141B34] mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <QuickLink
                label="Create Course"
                desc="Build a new LMS course"
                href="/dashboard/instructor-portal/create-course"
                icon={Plus}
              />
              <QuickLink
                label="My Courses"
                desc="Manage all your courses"
                href="/dashboard/instructor-portal/courses"
                icon={BookOpen}
              />
              <QuickLink
                label="Create Quiz"
                desc="Add a quiz to a course"
                href="/dashboard/instructor-portal/create-quiz"
                icon={Star}
              />
              <QuickLink
                label="View Profile"
                desc="Update your instructor profile"
                href="/dashboard/instructor-portal/view-instructor"
                icon={Video}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
