/**
 * Teacher Dashboard – Overview
 * Route: /teacher-dashboard
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	Clock,
	DollarSign,
	GraduationCap,
	Star,
	TrendingUp,
	Users,
	Video,
} from "lucide-react";
import {
	PageHeader,
	SectionCard,
	StatCard,
	StatusBadge,
	ViewAllLink,
} from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import { useGetMyLMSCourses } from "@/hooks/lms-course";
import {
	useGetMyCoachingCourses,
	useGetOwnTeacherProfile,
	useGetTeacherMe,
	useGetTeacherOwnSessions,
} from "@/hooks/teacher";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/teacher-dashboard/")({
	component: TeacherOverviewPage,
});

function TeacherOverviewPage() {
	const user = getUser();
	// onetoone endpoints are keyed by Teacher.id (NOT User.id) — resolve it.
	const { data: teacherMe } = useGetTeacherMe();
	const teacherId = teacherMe?.id;
	const { data: sessionsData } = useGetTeacherOwnSessions(teacherId);
	const { data: coachingData } = useGetMyCoachingCourses();
	const { data: lmsData } = useGetMyLMSCourses();
	const { data: profileData } = useGetOwnTeacherProfile(teacherId);

	const sessions = sessionsData?.data ?? [];
	const coachingCourses = coachingData?.data ?? [];
	const lmsCourses = lmsData?.data ?? [];
	const profile = profileData?.data;

	const upcomingSessions = sessions.filter(
		(s) => s.status === "SCHEDULED" || s.status === "IN_PROGRESS",
	);
	const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

	const totalStudentsCoaching = coachingCourses.reduce(
		(acc, c) => acc + (c.enrollmentCount ?? 0),
		0,
	);
	const totalStudentsLms = lmsCourses.reduce(
		(acc: number, c: any) => acc + (c.enrollmentCount ?? 0),
		0,
	);
	const totalStudents = totalStudentsCoaching + totalStudentsLms;

	// Estimated earnings: completed sessions × hourly rate
	const estimatedEarnings =
		completedSessions.length * (profile?.onlineHourlyRate ?? 0);

	const greeting = () => {
		const h = new Date().getHours();
		if (h < 12) return "Good morning";
		if (h < 17) return "Good afternoon";
		return "Good evening";
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title={`${greeting()}, ${user?.name ?? "Teacher"}`}
				subtitle="Here's what's happening with your classes today."
				actions={
					<Link to="/teacher-dashboard/sessions">
						<Button size="sm" className="gap-1.5">
							<Video size={14} /> My Sessions
						</Button>
					</Link>
				}
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatCard
					label="Upcoming Sessions"
					value={upcomingSessions.length}
					icon={CalendarDays}
					hint="Scheduled & in progress"
				/>
				<StatCard
					label="Total Students"
					value={totalStudents}
					icon={Users}
					hint="LMS + Coaching"
				/>
				<StatCard
					label="Courses"
					value={lmsCourses.length + coachingCourses.length}
					icon={BookOpen}
					hint={`${lmsCourses.length} LMS · ${coachingCourses.length} Coaching`}
				/>
				<StatCard
					label="Est. Earnings"
					value={
						estimatedEarnings > 0
							? `৳${estimatedEarnings.toLocaleString()}`
							: `${completedSessions.length} done`
					}
					icon={DollarSign}
					hint={
						estimatedEarnings > 0
							? `${completedSessions.length} completed sessions`
							: "Complete sessions to track"
					}
				/>
			</div>

			{/* Profile Snapshot */}
			{profile && (
				<div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-white p-4">
					<div className="flex items-center gap-2">
						<Star size={15} className="fill-amber-400 text-amber-400" />
						<span className="text-sm font-bold">
							{profile.rating.toFixed(1)}
						</span>
						<span className="text-xs text-muted">rating</span>
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle2 size={15} className="text-emerald-500" />
						<span className="text-sm font-bold">{profile.totalSessions}</span>
						<span className="text-xs text-muted">total sessions</span>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign size={15} className="text-primary" />
						<span className="text-sm font-bold">
							৳{profile.onlineHourlyRate}/hr
						</span>
						<span className="text-xs text-muted">rate</span>
					</div>
					{profile.isAvailable ? (
						<StatusBadge tone="success">Available for bookings</StatusBadge>
					) : (
						<StatusBadge tone="neutral">Not accepting bookings</StatusBadge>
					)}
					<Link to="/teacher-dashboard/profile" className="ml-auto">
						<Button size="sm" variant="outline" className="text-xs">
							Edit Profile
						</Button>
					</Link>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{[
					{
						title: "LMS Courses",
						desc: "Manage your online courses, modules & lessons",
						icon: BookOpen,
						href: "/teacher-dashboard/lms-courses",
					},
					{
						title: "Coaching Programs",
						desc: "Live instructor-led courses with assignments",
						icon: GraduationCap,
						href: "/teacher-dashboard/coaching",
					},
					{
						title: "1-on-1 Sessions",
						desc: "View upcoming sessions & manage your availability",
						icon: Video,
						href: "/teacher-dashboard/sessions",
					},
					{
						title: "Practice Tests",
						desc: "Create and manage SAT practice tests for students",
						icon: ClipboardList,
						href: "/teacher-dashboard/question-bank/practice-test",
					},
					{
						title: "My Students",
						desc: "Browse students enrolled in your courses",
						icon: Users,
						href: "/teacher-dashboard/students",
					},
					{
						title: "My Profile",
						desc: "Bio, hourly rate, specializations & intro video",
						icon: Star,
						href: "/teacher-dashboard/profile",
					},
				].map((item) => (
					<Link key={item.href} to={item.href}>
						<div className="group flex items-start gap-3 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/40">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
								<item.icon size={18} className="text-primary" />
							</div>
							<div className="min-w-0">
								<p className="font-switzer text-sm font-semibold transition-colors group-hover:text-primary">
									{item.title}
								</p>
								<p className="mt-0.5 line-clamp-2 text-xs text-muted">
									{item.desc}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Upcoming Sessions */}
			{upcomingSessions.length > 0 && (
				<SectionCard
					title="Upcoming Sessions"
					action={<ViewAllLink to="/teacher-dashboard/sessions" />}
					bodyClassName="space-y-2"
				>
					{upcomingSessions.slice(0, 3).map((s) => {
						const student = s.student?.user;
						return (
							<div
								key={s.id}
								className="flex items-center gap-3 rounded-lg border border-border p-3"
							>
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
									{student?.image ? (
										<img
											src={student.image}
											alt={student.name}
											className="h-full w-full rounded-lg object-cover"
										/>
									) : (
										<span className="text-xs font-bold text-primary">
											{(student?.name ?? "S")[0].toUpperCase()}
										</span>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">
										{student?.name ?? "Student"}
									</p>
									{s.topic && (
										<p className="truncate text-xs text-muted">{s.topic}</p>
									)}
								</div>
								<div className="shrink-0 text-right">
									<p className="text-xs font-medium text-foreground">
										{new Date(s.scheduledAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</p>
									<p className="flex items-center justify-end gap-1 text-[11px] text-muted">
										<Clock size={10} />
										{new Date(s.scheduledAt).toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
								{s.status === "IN_PROGRESS" && (
									<StatusBadge tone="danger">LIVE</StatusBadge>
								)}
							</div>
						);
					})}
				</SectionCard>
			)}

			{/* Performance Tip */}
			<div className="rounded-lg border border-border bg-primary-light/40 p-5">
				<div className="flex items-start gap-3">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
						<TrendingUp size={18} className="text-primary" />
					</div>
					<div>
						<p className="font-switzer text-sm font-semibold text-foreground">
							Build your reputation
						</p>
						<p className="mt-1 text-xs leading-relaxed text-muted">
							Complete your profile, add an intro video, and set your
							availability to attract more students. Teachers with complete
							profiles get 3× more bookings.
						</p>
						<Link to="/teacher-dashboard/profile">
							<Button size="sm" className="mt-3 text-xs">
								Complete Profile
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
