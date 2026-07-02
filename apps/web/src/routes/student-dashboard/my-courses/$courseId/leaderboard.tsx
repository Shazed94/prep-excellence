import { createFileRoute } from "@tanstack/react-router";
import { mockCourses, getCourseLeaderboard } from "@/lib/mock-data";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { CourseNav } from "@/components/CourseNav";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute(
  "/student-dashboard/my-courses/$courseId/leaderboard",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const course = mockCourses.find((c) => c.id === params.id) || mockCourses[0];
  const leaderboard = getCourseLeaderboard(params.id);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "border-yellow-400 bg-yellow-50";
    if (rank === 2) return "border-gray-400 bg-gray-50";
    if (rank === 3) return "border-orange-400 bg-orange-50";
    return "border-border bg-card";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={24} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={24} className="text-gray-500" />;
    if (rank === 3) return <Medal size={24} className="text-orange-500" />;
    return <Award size={24} className="text-muted-foreground" />;
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
          {/* Top 3 Podium */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Top Performers
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {leaderboard.slice(0, 3).map((entry, idx) => (
                <div
                  key={entry.userId}
                  className={`border-2 rounded-xl p-6 ${getRankBadge(entry.rank)}`}
                >
                  <div className="flex flex-col items-center text-center mb-4">
                    {getRankIcon(entry.rank)}
                    <h3 className="font-bold text-lg mt-3 text-foreground">
                      {entry.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Rank #{entry.rank}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-current border-opacity-20">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Points
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {entry.points}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Completed
                        </p>
                        <p className="font-semibold text-foreground">
                          {entry.coursesCompleted}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Streak</p>
                        <p className="font-semibold text-foreground">
                          {entry.streak}d
                        </p>
                      </div>
                    </div>

                    {entry.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {entry.badges.map((badge, idx) => (
                          <Badge key={idx} variant="secondary" size="xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Full Leaderboard
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Points
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Completed
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Streak
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                      Badges
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => (
                    <tr
                      key={entry.userId}
                      className={`border-b border-border hover:bg-muted/30 transition-colors ${
                        entry.userId === "user-1" ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {entry.rank <= 3 ? (
                            getRankIcon(entry.rank)
                          ) : (
                            <span className="text-lg font-bold text-muted-foreground">
                              #{entry.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={entry.avatar}
                              alt={entry.username}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {entry.username}
                            </p>
                            {entry.userId === "user-1" && (
                              <p className="text-xs text-primary font-medium">
                                You
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-foreground">
                          {entry.points}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">
                          {entry.coursesCompleted}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{
                                width: `${Math.min((entry.streak / 50) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground min-w-fit">
                            {entry.streak}d
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {entry.badges.slice(0, 2).map((badge, idx) => (
                            <Badge key={idx} variant="secondary" size="xs">
                              {badge}
                            </Badge>
                          ))}
                          {entry.badges.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{entry.badges.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                How Points Are Calculated
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold">→</span>
                  <span>Quiz Score: 1 point per percentage</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">→</span>
                  <span>Module Completion: 50 bonus points</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">→</span>
                  <span>Attendance: 10 points per day</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">→</span>
                  <span>Streak Bonus: +5 points per day</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-purple-900 mb-3">
                Badges & Achievements
              </h4>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex gap-2">
                  <Award size={16} className="flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Quiz Master:</strong> Score 90%+ on all quizzes
                  </span>
                </li>
                <li className="flex gap-2">
                  <Award size={16} className="flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Top Performer:</strong> Rank #1 on leaderboard
                  </span>
                </li>
                <li className="flex gap-2">
                  <Award size={16} className="flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Consistent:</strong> 30+ day learning streak
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
