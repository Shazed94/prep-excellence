import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	CalendarDays,
	Clock,
	GraduationCap,
	Receipt,
	TrendingUp,
	UserSearch,
} from "lucide-react";
import {
	EmptyState,
	PageHeader,
	SectionCard,
	StatCard,
	StatusBadge,
	ViewAllLink,
} from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetMyCoachingEnrollments } from "@/hooks/coaching";
import { useGetMyLMSEnrollments } from "@/hooks/lms-enrollment";
import { useGetMyStudentSessions } from "@/hooks/onetoone";
import { useGetMyAttempts } from "@/hooks/sat-attempt";
import { useGetStudentProfile } from "@/hooks/user-management";

export const Route = createFileRoute("/student-dashboard/")({
	component: StudentDashboardHome,
});

function StudentDashboardHome() {
	const { data: profileData } = useGetStudentProfile();
	const student = profileData?.data;
	const studentId = student?.id;

	const { data: enrollmentData, isLoading: enrollLoading } =
		useGetMyLMSEnrollments(studentId);
	const { data: attemptData } = useGetMyAttempts(studentId);
	const { data: sessionData } = useGetMyStudentSessions();
	const { data: coachingData } = useGetMyCoachingEnrollments();

	const enrollments = enrollmentData?.data ?? [];
	const attempts = attemptData?.data ?? [];
	const sessions = sessionData?.data ?? [];
	const coachingEnrollments = coachingData?.data ?? [];

	const activeEnrollments = enrollments.filter(
		(e: any) => e.status === "ACTIVE",
	);
	const upcomingSessions = sessions.filter(
		(s: any) => s.status === "SCHEDULED",
	);
	const latestAttempt = attempts[0];

	const stats = [
		{
			label: "LMS Courses",
			value: enrollments.length,
			icon: BookOpen,
			href: "/student-dashboard/my-courses",
		},
		{
			label: "Coaching Programs",
			value: coachingEnrollments.length,
			icon: GraduationCap,
			href: "/student-dashboard/coaching",
		},
		{
			label: "Upcoming Sessions",
			value: upcomingSessions.length,
			icon: CalendarDays,
			href: "/student-dashboard/sessions",
		},
		{
			label: "SAT Attempts",
			value: attempts.length,
			icon: TrendingUp,
			href: "/student-dashboard/sat-results",
		},
	];

	return (
		<div className="w-full space-y-6">
			<PageHeader
				title={`Welcome back, ${student?.user?.name ?? "Student"}`}
				subtitle="Here's what's happening with your learning today."
				actions={
					<Link to="/student-dashboard/find-tutor">
						<Button size="sm" className="gap-1.5">
							<UserSearch size={14} /> Find a tutor
						</Button>
					</Link>
				}
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{stats.map((stat) => (
					<StatCard
						key={stat.label}
						label={stat.label}
						value={stat.value}
						icon={stat.icon}
						href={stat.href}
					/>
				))}
			</div>

			<div className="grid gap-5 lg:grid-cols-3">
				{/* Continue Learning */}
				<SectionCard
					className="lg:col-span-2"
					title="Continue Learning"
					subtitle="Pick up where you left off"
					action={<ViewAllLink to="/student-dashboard/my-courses" />}
				>
					{enrollLoading ? (
						<div className="space-y-3">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="h-18 animate-pulse rounded-lg bg-muted/10"
								/>
							))}
						</div>
					) : activeEnrollments.length === 0 ? (
						<EmptyState
							icon={BookOpen}
							title="No active courses yet"
							action={
								<Link
									to="/student-dashboard/my-courses"
									className="text-xs text-primary underline underline-offset-2"
								>
									Browse courses
								</Link>
							}
						/>
					) : (
						<div className="space-y-2">
							{activeEnrollments.slice(0, 3).map((enrollment: any) => (
								<Link
									key={enrollment.id}
									to="/student-dashboard/my-courses/$courseId"
									params={{ courseId: enrollment.id }}
								>
									<div className="group flex cursor-pointer gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/5">
										{enrollment.course?.thumbnail ? (
											<img
												src={enrollment.course.thumbnail}
												alt={enrollment.course.title}
												className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
											/>
										) : (
											<div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light">
												<BookOpen size={20} className="text-primary/50" />
											</div>
										)}
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
												{enrollment.course?.title}
											</p>
											<p className="mt-0.5 text-xs text-muted">
												{enrollment.course?.instructor?.user?.name ??
													"Instructor"}
											</p>
											<div className="mt-2 flex items-center gap-2">
												<Progress
													value={enrollment.progress ?? 0}
													className="h-1.5 flex-1"
												/>
												<span className="shrink-0 text-xs font-medium text-muted">
													{enrollment.progress ?? 0}%
												</span>
											</div>
										</div>
										<ArrowRight
											size={14}
											className="shrink-0 self-center text-muted opacity-0 transition-opacity group-hover:opacity-100"
										/>
									</div>
								</Link>
							))}
						</div>
					)}
				</SectionCard>

				{/* Right column */}
				<div className="space-y-4">
					{/* Latest SAT Score */}
					<SectionCard
						title="Latest SAT Score"
						action={<ViewAllLink to="/student-dashboard/sat-results" />}
					>
						{latestAttempt ? (
							<div className="py-2 text-center">
								<div className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-primary-light">
									<p className="text-2xl font-bold text-primary">
										{latestAttempt.totalScore ?? "—"}
									</p>
								</div>
								<p className="text-xs text-muted">
									{latestAttempt.satPractice?.name ?? "SAT Practice"}
								</p>
								<div className="mt-2">
									<StatusBadge
										tone={
											latestAttempt.status === "COMPLETED"
												? "success"
												: "warning"
										}
									>
										{latestAttempt.status}
									</StatusBadge>
								</div>
								{latestAttempt.percentageScore != null && (
									<p className="mt-1 text-xs text-muted">
										{latestAttempt.percentageScore}th percentile
									</p>
								)}
							</div>
						) : (
							<EmptyState icon={TrendingUp} title="No attempts yet" />
						)}
					</SectionCard>

					{/* Upcoming Sessions */}
					<SectionCard
						title="Upcoming Sessions"
						action={<ViewAllLink to="/student-dashboard/sessions" />}
					>
						{upcomingSessions.length === 0 ? (
							<EmptyState icon={CalendarDays} title="No upcoming sessions" />
						) : (
							<div className="space-y-2">
								{upcomingSessions.slice(0, 2).map((session: any) => {
									const avail = session.teacherAvailability;
									const date = avail?.date
										? new Date(avail.date).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})
										: "—";
									const time = avail?.startTime ?? "—";
									const teacher =
										avail?.profile?.teacher?.user?.name ?? "Tutor";
									return (
										<div
											key={session.id}
											className="flex items-start gap-3 rounded-lg border border-border p-3"
										>
											<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light">
												<CalendarDays size={14} className="text-primary" />
											</div>
											<div>
												<p className="text-xs font-semibold text-foreground">
													{teacher}
												</p>
												<p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
													<Clock size={10} /> {date} · {time}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</SectionCard>

					{/* Quick Links */}
					<SectionCard title="Quick Links">
						<div className="space-y-1">
							{[
								{
									label: "My Coaching",
									icon: GraduationCap,
									to: "/student-dashboard/coaching",
								},
								{
									label: "Find Tutors",
									icon: UserSearch,
									to: "/student-dashboard/find-tutor",
								},
								{
									label: "My Orders",
									icon: Receipt,
									to: "/student-dashboard/orders",
								},
								{
									label: "My Profile",
									icon: TrendingUp,
									to: "/student-dashboard/profile",
								},
							].map((link) => (
								<Link key={link.to} to={link.to}>
									<div className="group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-primary-light hover:text-primary">
										<link.icon size={14} />
										{link.label}
									</div>
								</Link>
							))}
						</div>
					</SectionCard>
				</div>
			</div>
		</div>
	);
}
