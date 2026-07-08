import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  XCircle,
} from "lucide-react";
import { CourseNav } from "@/components/CourseNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourseAttendance, mockCourses } from "@/lib/mock-data";

export const Route = createFileRoute(
  "/student-dashboard/my-courses/$courseId/attendence",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
  const attendance = getCourseAttendance(courseId);

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const lateCount = attendance.filter((a) => a.status === "Late").length;
  const attendancePercentage = (presentCount / attendance.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700 border-green-200";
      case "Absent":
        return "bg-red-100 text-red-700 border-red-200";
      case "Late":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present":
        return <CheckCircle size={16} />;
      case "Absent":
        return <XCircle size={16} />;
      case "Late":
        return <Clock size={16} />;
      default:
        return null;
    }
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
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Attendance Rate
                </span>
                <Calendar size={20} className="text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {attendancePercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {presentCount} out of {attendance.length} days
              </p>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-700">Present</span>
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-700">
                {presentCount}
              </div>
              <p className="text-xs text-green-600 mt-2">Days attended</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-700">Absent</span>
                <XCircle size={20} className="text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-700">
                {absentCount}
              </div>
              <p className="text-xs text-red-600 mt-2">Days missed</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-yellow-700">Late</span>
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-yellow-700">
                {lateCount}
              </div>
              <p className="text-xs text-yellow-600 mt-2">Days late</p>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Attendance Calendar
            </h2>

            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {attendance.map((record, idx) => (
                <div key={idx} className="relative">
                  <button
                    type="button"
                    className={`w-full aspect-square rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-200 ${getStatusColor(
                      record.status,
                    )} border`}
                    title={`${record.date.toLocaleDateString()}: ${record.status}`}
                  >
                    {record.date.getDate()}
                  </button>
                  {record.status !== "Present" && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs opacity-70">
                      {getStatusIcon(record.status)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detailed List */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                Detailed Attendance
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance
                    .slice()
                    .reverse()
                    .map((record, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-border last:border-b-0 hover:bg-muted/50"
                      >
                        <td className="px-6 py-3 text-sm text-foreground">
                          {record.date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">
                          {record.date.toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          <Badge
                            variant={
                              record.status === "Present" ||
                              record.status === "Late"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              record.status === "Present"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : record.status === "Late"
                                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                  : undefined
                            }
                          >
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">
                          {record.status === "Present"
                            ? "Attended"
                            : record.status === "Late"
                              ? "Attended 15 min late"
                              : "No attendance recorded"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
