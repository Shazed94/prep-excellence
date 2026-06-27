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
import { motion, type Variants } from "motion/react";
import { Badge } from "@/components/ui/badge";
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

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.45,
			delay: i * 0.07,
			ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
		},
	}),
};

function StudentDashboardHome() {
	const { data: profileData } = useGetStudentProfile();
	const student = profileData?.data;
	const studentId = student?.id;

	const { data: enrollmentData, isLoading: enrollLoading } =
		useGetMyLMSEnrollments(studentId);
	const { data: attemptData } = useGetMyAttempts(studentId);
	const { data: sessionData } = useGetMyStudentSessions(studentId);
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
			gradient: "from-[#1552fd] to-[#0d3197]",
			textColor: "text-white",
			href: "/student-dashboard/my-courses",
		},
		{
			label: "Coaching Programs",
			value: coachingEnrollments.length,
			icon: GraduationCap,
			gradient: "from-emerald-500 to-emerald-700",
			textColor: "text-white",
			href: "/student-dashboard/coaching",
		},
		{
			label: "Upcoming Sessions",
			value: upcomingSessions.length,
			icon: CalendarDays,
			gradient: "from-[#f7b03f] to-[#ef782e]",
			textColor: "text-white",
			href: "/student-dashboard/sessions",
		},
		{
			label: "SAT Attempts",
			value: attempts.length,
			icon: TrendingUp,
			gradient: "from-violet-500 to-violet-700",
			textColor: "text-white",
			href: "/student-dashboard/sat-results",
		},
	];

	return (
		<div className="space-y-7 max-w-6xl">
			{/* Welcome banner */}
			<motion.div
				initial="hidden"
				animate="visible"
				variants={fadeUp}
				custom={0}
				className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1552fd] to-[#0d3197] p-6 md:p-8 text-white"
			>
				{/* Decorative circles */}
				<div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
				<div className="absolute -bottom-12 -right-4 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
				<div className="absolute top-6 right-32 w-16 h-16 rounded-full bg-[#f7b03f]/20 pointer-events-none" />

				<div className="relative">
					<p className="text-white/60 text-sm font-inter mb-1">
						Welcome back 👋
					</p>
					<h1 className="text-2xl md:text-3xl font-switzer font-bold text-white">
						{student?.user?.name ?? "Student"}
					</h1>
					<p className="text-white/60 mt-2 text-sm font-inter">
						Here's what's happening with your learning today.
					</p>
					<div className="flex gap-3 mt-5">
						<Link to="/student-dashboard/my-courses">
							<button
								type="button"
								className="flex items-center gap-1.5 bg-white text-[#1552fd] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
							>
								<BookOpen size={13} /> My Courses
							</button>
						</Link>
						<Link to="/student-dashboard/sessions">
							<button
								type="button"
								className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
							>
								<CalendarDays size={13} /> Sessions
							</button>
						</Link>
						<Link to="/student-dashboard/coaching">
							<button
								type="button"
								className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
							>
								<GraduationCap size={13} /> Coaching
							</button>
						</Link>
						<Link to="/student-dashboard/find-tutor">
							<button
								type="button"
								className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
							>
								<UserSearch size={13} /> Find Tutor
							</button>
						</Link>
					</div>
				</div>
			</motion.div>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, i) => (
					<motion.div
						key={stat.label}
						initial="hidden"
						animate="visible"
						variants={fadeUp}
						custom={i + 1}
					>
						<Link to={stat.href}>
							<div
								className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.gradient} p-5 cursor-pointer group hover:scale-[1.02] transition-transform duration-200`}
							>
								<div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
								<div
									className={`w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3`}
								>
									<stat.icon size={18} className="text-white" />
								</div>
								<p className={`text-3xl font-bold ${stat.textColor}`}>
									{stat.value}
								</p>
								<p className={`text-xs mt-0.5 ${stat.textColor} opacity-75`}>
									{stat.label}
								</p>
							</div>
						</Link>
					</motion.div>
				))}
			</div>

			<div className="grid lg:grid-cols-3 gap-5">
				{/* Continue Learning */}
				<motion.div
					className="lg:col-span-2"
					initial="hidden"
					animate="visible"
					variants={fadeUp}
					custom={5}
				>
					<div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
						<div className="flex items-center justify-between mb-5">
							<div>
								<h2 className="font-switzer font-semibold text-base text-foreground">
									Continue Learning
								</h2>
								<p className="text-xs text-muted mt-0.5">
									Pick up where you left off
								</p>
							</div>
							<Link to="/student-dashboard/my-courses">
								<Button
									variant="ghost"
									size="sm"
									className="text-primary text-xs gap-1 hover:text-primary/80"
								>
									View all <ArrowRight size={13} />
								</Button>
							</Link>
						</div>

						{enrollLoading ? (
							<div className="space-y-3">
								{[1, 2].map((i) => (
									<div
										key={i}
										className="h-18 bg-muted/10 rounded-xl animate-pulse"
									/>
								))}
							</div>
						) : activeEnrollments.length === 0 ? (
							<div className="flex flex-col items-center py-10 text-muted gap-2">
								<div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center">
									<BookOpen size={24} className="text-primary/40" />
								</div>
								<p className="text-sm mt-1">No active courses yet</p>
								<Link to="/student-dashboard/my-courses">
									<span className="text-xs text-primary underline underline-offset-2">
										Browse courses
									</span>
								</Link>
							</div>
						) : (
							<div className="space-y-2">
								{activeEnrollments.slice(0, 3).map((enrollment: any) => (
									<Link
										key={enrollment.id}
										to="/student-dashboard/my-courses/$courseId"
										params={{ courseId: enrollment.id }}
									>
										<div className="flex gap-3 p-3 rounded-xl hover:bg-muted/6 border border-transparent hover:border-border/50 transition-all group cursor-pointer">
											{enrollment.course?.thumbnail ? (
												<img
													src={enrollment.course.thumbnail}
													alt={enrollment.course.title}
													className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
												/>
											) : (
												<div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
													<BookOpen size={20} className="text-primary/40" />
												</div>
											)}
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
													{enrollment.course?.title}
												</p>
												<p className="text-xs text-muted mt-0.5">
													{enrollment.course?.instructor?.user?.name ??
														"Instructor"}
												</p>
												<div className="mt-2 flex items-center gap-2">
													<Progress
														value={enrollment.progress ?? 0}
														className="h-1.5 flex-1"
													/>
													<span className="text-xs text-muted shrink-0 font-medium">
														{enrollment.progress ?? 0}%
													</span>
												</div>
											</div>
											<ArrowRight
												size={14}
												className="text-muted self-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
											/>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
				</motion.div>

				{/* Right column */}
				<div className="space-y-4">
					{/* Latest SAT Score */}
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeUp}
						custom={6}
					>
						<div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<h2 className="font-switzer font-semibold text-sm text-foreground">
									Latest SAT Score
								</h2>
								<Link to="/student-dashboard/sat-results">
									<Button
										variant="ghost"
										size="sm"
										className="text-primary text-xs gap-1 p-0 h-auto hover:text-primary/80"
									>
										View all <ArrowRight size={12} />
									</Button>
								</Link>
							</div>
							{latestAttempt ? (
								<div className="text-center py-2">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/8 mb-2">
										<p className="text-2xl font-bold text-primary">
											{latestAttempt.totalScore ?? "—"}
										</p>
									</div>
									<p className="text-xs text-muted">
										{latestAttempt.satPractice?.name ?? "SAT Practice"}
									</p>
									<Badge
										variant="secondary"
										className={`mt-2 text-[10px] border-0 ${
											latestAttempt.status === "COMPLETED"
												? "bg-emerald-100 text-emerald-700"
												: "bg-amber-100 text-amber-700"
										}`}
									>
										{latestAttempt.status}
									</Badge>
									{latestAttempt.percentageScore != null && (
										<p className="text-xs text-muted mt-1">
											{latestAttempt.percentageScore}th percentile
										</p>
									)}
								</div>
							) : (
								<div className="flex flex-col items-center py-5 gap-2 text-muted">
									<div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
										<TrendingUp size={20} className="text-violet-400" />
									</div>
									<p className="text-sm">No attempts yet</p>
								</div>
							)}
						</div>
					</motion.div>

					{/* Upcoming Sessions */}
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeUp}
						custom={7}
					>
						<div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<h2 className="font-switzer font-semibold text-sm text-foreground">
									Upcoming Sessions
								</h2>
								<Link to="/student-dashboard/sessions">
									<Button
										variant="ghost"
										size="sm"
										className="text-primary text-xs gap-1 p-0 h-auto hover:text-primary/80"
									>
										View all <ArrowRight size={12} />
									</Button>
								</Link>
							</div>
							{upcomingSessions.length === 0 ? (
								<div className="flex flex-col items-center py-5 gap-2 text-muted">
									<div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
										<CalendarDays size={20} className="text-amber-400" />
									</div>
									<p className="text-sm">No upcoming sessions</p>
								</div>
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
												className="flex gap-3 items-start p-3 rounded-xl bg-amber-50 border border-amber-100"
											>
												<div className="w-8 h-8 rounded-lg bg-[#f7b03f] flex items-center justify-center flex-shrink-0">
													<CalendarDays size={14} className="text-white" />
												</div>
												<div>
													<p className="text-xs font-semibold text-foreground">
														{teacher}
													</p>
													<p className="text-xs text-muted flex items-center gap-1 mt-0.5">
														<Clock size={10} /> {date} · {time}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</motion.div>

					{/* Quick Links */}
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeUp}
						custom={8}
					>
						<div className="bg-white rounded-2xl border border-border/60 p-4 shadow-sm">
							<p className="font-switzer font-semibold text-sm mb-3">
								Quick Links
							</p>
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
										<div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-sm text-muted group">
											<link.icon
												size={14}
												className="group-hover:text-primary transition-colors"
											/>
											{link.label}
										</div>
									</Link>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
