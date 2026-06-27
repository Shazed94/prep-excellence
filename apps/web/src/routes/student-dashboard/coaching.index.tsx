/**
 * Phase 3 – My Coaching Courses - Index
 * Route: /student-dashboard/coaching/
 *
 * Shows the student's enrolled instructor-led coaching programs.
 * Each program has modules unlocked progressively as payment % increases.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	Calendar,
	CheckCircle2,
	ChevronRight,
	Clock,
	Loader2,
	Lock,
	Play,
	Sparkles,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	type CoachingEnrollment,
	useGetMyCoachingEnrollments,
} from "@/hooks/coaching";

export const Route = createFileRoute("/student-dashboard/coaching/")({
	component: CoachingIndexPage,
});

function levelColor(level: string) {
	const map: Record<string, string> = {
		BEGINNER: "bg-emerald-100 text-emerald-700",
		INTERMEDIATE: "bg-amber-100 text-amber-700",
		ADVANCED: "bg-red-100 text-red-600",
	};
	return map[level] ?? "bg-muted/20 text-muted";
}

function levelLabel(level: string) {
	const map: Record<string, string> = {
		BEGINNER: "Beginner",
		INTERMEDIATE: "Intermediate",
		ADVANCED: "Advanced",
	};
	return map[level] ?? level;
}

function statusConfig(status: string) {
	const map: Record<string, { label: string; color: string }> = {
		ACTIVE: { label: "In Progress", color: "bg-primary/10 text-primary" },
		COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-700" },
		CANCELLED: { label: "Cancelled", color: "bg-muted/20 text-muted" },
	};
	return map[status] ?? { label: status, color: "bg-muted/20 text-muted" };
}

function CoachingEnrollmentCard({
	enrollment,
}: {
	enrollment: CoachingEnrollment;
}) {
	const course = enrollment.course;
	const progress = enrollment.progressPercent ?? 0;
	const sc = statusConfig(enrollment.status);

	const startDate = course.startDate
		? new Date(course.startDate).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: null;
	const endDate = course.endDate
		? new Date(course.endDate).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: null;

	return (
		<div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
			{/* Course Thumbnail */}
			<div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
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
				<div className="absolute top-2 left-2">
					<Badge className={`text-[10px] border-0 font-medium ${sc.color}`}>
						{sc.label}
					</Badge>
				</div>
				{course.level && (
					<div className="absolute top-2 right-2">
						<Badge
							className={`text-[10px] border-0 ${levelColor(course.level)}`}
						>
							{levelLabel(course.level)}
						</Badge>
					</div>
				)}
				{/* Progress overlay */}
				{enrollment.status === "ACTIVE" && (
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
						<Progress
							value={progress}
							className="h-1.5 bg-white/20 [&>div]:bg-white"
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4 space-y-3">
				<div>
					<h3 className="font-switzer font-bold text-sm line-clamp-2 leading-snug">
						{course.title}
					</h3>
					{course.sortDescription && (
						<p className="text-xs text-muted mt-1 line-clamp-2">
							{course.sortDescription}
						</p>
					)}
				</div>

				{/* Meta */}
				<div className="flex flex-wrap gap-2 text-[11px] text-muted">
					{course.duration && (
						<span className="flex items-center gap-1">
							<Clock size={11} /> {course.duration} weeks
						</span>
					)}
					{startDate && (
						<span className="flex items-center gap-1">
							<Calendar size={11} /> Starts {startDate}
						</span>
					)}
					{endDate && (
						<span className="flex items-center gap-1 text-muted">
							· Ends {endDate}
						</span>
					)}
				</div>

				{/* Progress bar (detail) */}
				{enrollment.status === "ACTIVE" && (
					<div className="space-y-1">
						<div className="flex justify-between text-[11px]">
							<span className="text-muted">Progress</span>
							<span className="font-semibold text-primary">{progress}%</span>
						</div>
						<Progress value={progress} className="h-1.5" />
					</div>
				)}

				{/* Certificate badge */}
				{enrollment.certificateUrl && (
					<a
						href={enrollment.certificateUrl}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-1.5 text-[11px] text-amber-600 hover:text-amber-700 font-medium"
					>
						<Sparkles size={12} />
						View Certificate
					</a>
				)}

				{/* CTA */}
				<Link to={`/student-dashboard/coaching/${course.id}` as "/"}>
					<Button
						size="sm"
						className="w-full bg-primary hover:bg-primary/90 gap-1.5 text-xs mt-1"
						disabled={enrollment.status === "CANCELLED"}
					>
						{enrollment.status === "COMPLETED" ? (
							<>
								<CheckCircle2 size={13} /> Review Course
							</>
						) : (
							<>
								<Play size={13} /> {progress > 0 ? "Continue" : "Start"}{" "}
								Learning
							</>
						)}
					</Button>
				</Link>
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center py-20 gap-4">
			{/* Illustration */}
			<div className="w-20 h-20 rounded-2xl bg-primary/8 flex items-center justify-center">
				<BookOpen size={36} className="text-primary/40" />
			</div>
			<div className="text-center">
				<h3 className="font-switzer font-semibold text-base">
					No coaching programs yet
				</h3>
				<p className="text-sm text-muted mt-1 max-w-xs">
					Enroll in an instructor-led coaching program to start learning with
					live sessions and personalized feedback.
				</p>
			</div>
			<div className="flex flex-col items-center gap-2 mt-2">
				<Lock size={16} className="text-muted opacity-40" />
				<p className="text-xs text-muted">
					Modules unlock as your payment progresses
				</p>
			</div>
		</div>
	);
}

function CoachingIndexPage() {
	const { data, isLoading } = useGetMyCoachingEnrollments();
	const enrollments: CoachingEnrollment[] = data?.data ?? [];

	const active = enrollments.filter((e) => e.status === "ACTIVE");
	const completed = enrollments.filter((e) => e.status === "COMPLETED");

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold text-foreground">
						My Coaching
					</h1>
					<p className="text-muted text-sm mt-0.5">
						Instructor-led programs with live sessions
					</p>
				</div>

				{enrollments.length > 0 && (
					<div className="flex items-center gap-2 text-xs text-muted">
						<Users size={13} />
						<span>
							{active.length} active · {completed.length} completed
						</span>
					</div>
				)}
			</div>

			{/* How It Works Banner */}
			<div className="bg-gradient-to-br from-[#1552fd] to-[#0d3197] rounded-2xl p-5 text-white">
				<div className="flex items-start gap-4">
					<div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
						<Sparkles size={20} />
					</div>
					<div>
						<h3 className="font-switzer font-bold text-sm">
							How Coaching Programs Work
						</h3>
						<p className="text-xs text-white/75 mt-1 leading-relaxed">
							Each program has modules that unlock progressively as your payment
							advances (0% → 25% → 50% → 75% → 100%). Live sessions use Jitsi —
							no extra software needed. Recordings are available after each live
							class.
						</p>
					</div>
				</div>

				{/* Step indicators */}
				<div className="mt-4 grid grid-cols-4 gap-2">
					{[
						{ step: "01", label: "Enroll", icon: BookOpen },
						{ step: "02", label: "Attend Live", icon: Play },
						{ step: "03", label: "Submit Work", icon: CheckCircle2 },
						{ step: "04", label: "Get Certified", icon: Sparkles },
					].map(({ step, label, icon: Icon }) => (
						<div key={step} className="flex flex-col items-center gap-1.5">
							<div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
								<Icon size={14} />
							</div>
							<span className="text-[10px] text-white/70 text-center">
								{label}
							</span>
						</div>
					))}
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : enrollments.length === 0 ? (
				<EmptyState />
			) : (
				<div className="space-y-6">
					{/* Active programs */}
					{active.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-3">
								<h2 className="font-switzer font-semibold text-sm text-foreground">
									Active Programs
								</h2>
								<Badge className="bg-primary/10 text-primary border-0 text-[10px]">
									{active.length}
								</Badge>
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{active.map((e) => (
									<CoachingEnrollmentCard key={e.id} enrollment={e} />
								))}
							</div>
						</div>
					)}

					{/* Completed programs */}
					{completed.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-3">
								<h2 className="font-switzer font-semibold text-sm text-foreground">
									Completed
								</h2>
								<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
									{completed.length}
								</Badge>
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{completed.map((e) => (
									<CoachingEnrollmentCard key={e.id} enrollment={e} />
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Browse more */}
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
						Browse Courses <ChevronRight size={13} />
					</Button>
				</Link>
			</div>
		</div>
	);
}
