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
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetCourses } from "@/hooks/lms-course";
import {
	useGetMyCoachingCourses,
	useGetOwnTeacherProfile,
	useGetTeacherOwnSessions,
} from "@/hooks/teacher";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/teacher-dashboard/")({
	component: TeacherOverviewPage,
});

function StatCard({
	label,
	value,
	icon: Icon,
	gradient,
	sub,
}: {
	label: string;
	value: string | number;
	icon: React.ElementType;
	gradient: string;
	sub?: string;
}) {
	return (
		<div className={`rounded-2xl p-5 text-white ${gradient}`}>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-xs text-white/70 font-medium">{label}</p>
					<p className="text-3xl font-bold mt-1 font-switzer">{value}</p>
					{sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
				</div>
				<div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
					<Icon size={20} />
				</div>
			</div>
		</div>
	);
}

function TeacherOverviewPage() {
	const user = getUser();
	const { data: sessionsData } = useGetTeacherOwnSessions(user?.id);
	const { data: coachingData } = useGetMyCoachingCourses();
	const { data: lmsData } = useGetCourses();
	const { data: profileData } = useGetOwnTeacherProfile(user?.id);

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
		completedSessions.length * (profile?.hourlyRate ?? 0);

	const greeting = () => {
		const h = new Date().getHours();
		if (h < 12) return "Good morning";
		if (h < 17) return "Good afternoon";
		return "Good evening";
	};

	return (
		<div className="space-y-6">
			{/* Welcome Banner */}
			<div className="bg-gradient-to-br from-[#1552fd] to-[#0d3197] rounded-2xl p-6 text-white">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<p className="text-white/70 text-sm">{greeting()},</p>
						<h1 className="text-2xl font-switzer font-bold mt-0.5">
							{user?.name ?? "Teacher"} 👋
						</h1>
						<p className="text-white/60 text-sm mt-1">
							Here's what's happening with your classes today.
						</p>
					</div>
					<div className="flex gap-2 flex-wrap">
						<Link to="/teacher-dashboard/sessions">
							<Button
								size="sm"
								className="bg-white/15 hover:bg-white/25 text-white border-0 text-xs gap-1.5"
							>
								<CalendarDays size={13} /> Manage Availability
							</Button>
						</Link>
						<Link to="/teacher-dashboard/sessions">
							<Button
								size="sm"
								className="bg-white/15 hover:bg-white/25 text-white border-0 text-xs gap-1.5"
							>
								<Video size={13} /> My Sessions
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					label="Upcoming Sessions"
					value={upcomingSessions.length}
					icon={CalendarDays}
					gradient="bg-gradient-to-br from-[#1552fd] to-[#0d3197]"
					sub="Scheduled & in progress"
				/>
				<StatCard
					label="Total Students"
					value={totalStudents}
					icon={Users}
					gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
					sub="LMS + Coaching"
				/>
				<StatCard
					label="Courses"
					value={lmsCourses.length + coachingCourses.length}
					icon={BookOpen}
					gradient="bg-gradient-to-br from-violet-500 to-violet-700"
					sub={`${lmsCourses.length} LMS · ${coachingCourses.length} Coaching`}
				/>
				<StatCard
					label="Est. Earnings"
					value={
						estimatedEarnings > 0
							? `৳${estimatedEarnings.toLocaleString()}`
							: `${completedSessions.length} done`
					}
					icon={DollarSign}
					gradient="bg-gradient-to-br from-amber-500 to-amber-600"
					sub={
						estimatedEarnings > 0
							? `${completedSessions.length} completed sessions`
							: "Complete sessions to track"
					}
				/>
			</div>

			{/* Profile Snapshot */}
			{profile && (
				<div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4 flex flex-wrap items-center gap-6">
					<div className="flex items-center gap-2">
						<Star size={15} className="text-amber-400 fill-amber-400" />
						<span className="font-bold text-sm">
							{profile.rating.toFixed(1)}
						</span>
						<span className="text-xs text-muted">rating</span>
					</div>
					<div className="flex items-center gap-2">
						<CheckCircle2 size={15} className="text-emerald-500" />
						<span className="font-bold text-sm">{profile.totalSessions}</span>
						<span className="text-xs text-muted">total sessions</span>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign size={15} className="text-primary" />
						<span className="font-bold text-sm">৳{profile.hourlyRate}/hr</span>
						<span className="text-xs text-muted">rate</span>
					</div>
					{profile.isAvailable ? (
						<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
							Available for bookings
						</Badge>
					) : (
						<Badge className="bg-muted/20 text-muted border-0 text-[10px]">
							Not accepting bookings
						</Badge>
					)}
					<Link to="/teacher-dashboard/profile" className="ml-auto">
						<Button size="sm" variant="outline" className="text-xs">
							Edit Profile
						</Button>
					</Link>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{[
					{
						title: "LMS Courses",
						desc: "Manage your online courses, modules & lessons",
						icon: BookOpen,
						href: "/teacher-dashboard/lms-courses",
						color: "text-primary bg-primary/8",
					},
					{
						title: "Coaching Programs",
						desc: "Live instructor-led courses with assignments",
						icon: GraduationCap,
						href: "/teacher-dashboard/coaching",
						color: "text-violet-600 bg-violet-50",
					},
					{
						title: "1-on-1 Sessions",
						desc: "View upcoming sessions & manage your availability",
						icon: Video,
						href: "/teacher-dashboard/sessions",
						color: "text-blue-600 bg-blue-50",
					},
					{
						title: "Practice Tests",
						desc: "Create and manage SAT practice tests for students",
						icon: ClipboardList,
						href: "/teacher-dashboard/question-bank/practice-test",
						color: "text-indigo-600 bg-indigo-50",
					},
					{
						title: "My Students",
						desc: "Browse students enrolled in your courses",
						icon: Users,
						href: "/teacher-dashboard/students",
						color: "text-amber-600 bg-amber-50",
					},
					{
						title: "My Profile",
						desc: "Bio, hourly rate, specializations & intro video",
						icon: Star,
						href: "/teacher-dashboard/profile",
						color: "text-rose-600 bg-rose-50",
					},
				].map((item) => (
					<Link key={item.href} to={item.href}>
						<div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4 hover:shadow-md transition-shadow flex items-start gap-3 group">
							<div
								className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
							>
								<item.icon size={18} />
							</div>
							<div className="min-w-0">
								<p className="font-switzer font-semibold text-sm group-hover:text-primary transition-colors">
									{item.title}
								</p>
								<p className="text-xs text-muted mt-0.5 line-clamp-2">
									{item.desc}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* Upcoming Sessions */}
			{upcomingSessions.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-3">
						<h2 className="font-switzer font-semibold text-sm">
							Upcoming Sessions
						</h2>
						<Link to="/teacher-dashboard/sessions">
							<span className="text-xs text-primary hover:underline">
								View all
							</span>
						</Link>
					</div>
					<div className="space-y-2">
						{upcomingSessions.slice(0, 3).map((s) => {
							const student = s.student?.user;
							return (
								<div
									key={s.id}
									className="bg-white rounded-xl border border-border/60 shadow-sm p-3 flex items-center gap-3"
								>
									<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
										{student?.image ? (
											<img
												src={student.image}
												alt={student.name}
												className="w-full h-full rounded-lg object-cover"
											/>
										) : (
											<span className="text-primary font-bold text-xs">
												{(student?.name ?? "S")[0].toUpperCase()}
											</span>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">
											{student?.name ?? "Student"}
										</p>
										{s.topic && (
											<p className="text-xs text-muted truncate">{s.topic}</p>
										)}
									</div>
									<div className="text-right shrink-0">
										<p className="text-xs font-medium text-foreground">
											{new Date(s.scheduledAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</p>
										<p className="text-[11px] text-muted flex items-center gap-1 justify-end">
											<Clock size={10} />
											{new Date(s.scheduledAt).toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
									{s.status === "IN_PROGRESS" && (
										<Badge className="bg-red-100 text-red-600 border-0 text-[10px] shrink-0">
											LIVE
										</Badge>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Performance Tip */}
			<div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl border border-amber-200/60 p-5">
				<div className="flex items-start gap-3">
					<div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
						<TrendingUp size={18} className="text-amber-600" />
					</div>
					<div>
						<p className="font-switzer font-semibold text-sm text-amber-900">
							Build your reputation
						</p>
						<p className="text-xs text-amber-700 mt-1 leading-relaxed">
							Complete your profile, add an intro video, and set your
							availability to attract more students. Teachers with complete
							profiles get 3× more bookings.
						</p>
						<Link to="/teacher-dashboard/profile">
							<Button
								size="sm"
								className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs"
							>
								Complete Profile
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
