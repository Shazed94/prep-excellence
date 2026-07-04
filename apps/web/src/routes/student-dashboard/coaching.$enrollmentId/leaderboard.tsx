import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Loader2,
  Medal,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { CoachingNav } from "@/components/CoachingNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCoachingCourse } from "@/hooks/coaching";

export const Route = createFileRoute(
  "/student-dashboard/coaching/$enrollmentId/leaderboard",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { enrollmentId } = Route.useParams();
  const { data: courseData, isLoading } = useGetCoachingCourse(enrollmentId);
  const course = courseData?.data ?? null;

  // Mock leaderboard data — replace with real API once available
  const leaderboard = [
    {
      rank: 1,
      name: "Alex Johnson",
      progress: 98,
      avatar: null,
      isCurrentUser: false,
    },
    {
      rank: 2,
      name: "Sarah Williams",
      progress: 92,
      avatar: null,
      isCurrentUser: false,
    },
    {
      rank: 3,
      name: "Michael Chen",
      progress: 87,
      avatar: null,
      isCurrentUser: false,
    },
    {
      rank: 4,
      name: "You",
      progress: course?.progressPercent ?? 0,
      avatar: null,
      isCurrentUser: true,
    },
    {
      rank: 5,
      name: "Emily Davis",
      progress: 72,
      avatar: null,
      isCurrentUser: false,
    },
  ].sort((a, b) => a.rank - b.rank);

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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "border-yellow-400 bg-yellow-50";
    if (rank === 2) return "border-gray-400 bg-gray-50";
    if (rank === 3) return "border-orange-400 bg-orange-50";
    return "border-border bg-card";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={16} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={16} className="text-gray-400" />;
    if (rank === 3) return <Medal size={16} className="text-orange-400" />;
    return (
      <span className="text-xs font-bold text-muted w-4 text-center">
        {rank}
      </span>
    );
  };

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
          {course?.title ?? "Leaderboard"}
        </span>
      </div>

      {/* Coaching Nav tabs */}
      <CoachingNav
        enrollmentId={enrollmentId}
        courseName={course?.title ?? ""}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Trophy size={16} />
            <span className="text-xs font-medium text-muted">Your Rank</span>
          </div>
          <p className="text-2xl font-bold">
            #{leaderboard.find((e) => e.isCurrentUser)?.rank ?? "—"}
          </p>
          <p className="text-[10px] text-muted">
            out of {leaderboard.length} students
          </p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium text-muted">
              Your Progress
            </span>
          </div>
          <p className="text-2xl font-bold">{course?.progressPercent ?? 0}%</p>
          <p className="text-[10px] text-muted">course completed</p>
        </div>
        <div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Award size={16} />
            <span className="text-xs font-medium text-muted">Top Score</span>
          </div>
          <p className="text-2xl font-bold">{leaderboard[0]?.progress ?? 0}%</p>
          <p className="text-[10px] text-muted">leading student</p>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <h3 className="font-semibold text-sm">Leaderboard</h3>
          <p className="text-xs text-muted mt-0.5">
            Students ranked by course progress
          </p>
        </div>
        <div className="divide-y divide-border/40">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-4 py-3 ${
                entry.isCurrentUser ? "bg-primary/5" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getRankBadge(entry.rank)}`}
              >
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {entry.name}
                </p>
                <p className="text-[11px] text-muted">
                  {entry.progress}% complete
                </p>
              </div>
              {entry.isCurrentUser && (
                <Badge className="bg-primary/10 text-primary border-0 text-[10px]">
                  You
                </Badge>
              )}
              <div className="w-24">
                <div className="bg-muted/20 rounded-full h-1.5">
                  <div
                    className="bg-primary rounded-full h-1.5 transition-all"
                    style={{ width: `${entry.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
