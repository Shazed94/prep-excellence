import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	GraduationCap,
	LayoutDashboard,
	MessageSquare,
	ShoppingCart,
	UserCheck,
	Users,
	Video,
} from "lucide-react";
import { useGetCourses as useGetCoachingCourses } from "@/hooks/course-management";
import { useGetCourses as useGetLMSCourses } from "@/hooks/lms-course";
import { useGetStudents, useGetTeachers } from "@/hooks/user-management";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
	label,
	value,
	icon: Icon,
	color,
	href,
	loading,
}: {
	label: string;
	value: number | string;
	icon: React.ElementType;
	color: string;
	href: string;
	loading?: boolean;
}) {
	return (
		<Link to={href}>
			<div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
				<div className="flex items-start justify-between mb-4">
					<div
						className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
					>
						<Icon className="w-5 h-5" />
					</div>
					<ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
				</div>
				{loading ? (
					<div className="h-8 w-16 bg-gray-100 rounded animate-pulse mb-1" />
				) : (
					<p className="text-[32px] font-bold text-[#141B34] leading-none mb-1">
						{typeof value === "number" ? value.toLocaleString() : value}
					</p>
				)}
				<p className="text-sm text-muted-foreground">{label}</p>
			</div>
		</Link>
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
			<div className="flex items-center gap-4 p-4 rounded-xl border border-[#EBEBEB] bg-white hover:border-primary hover:bg-primary-light/30 transition-all group">
				<div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
					<Icon className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
				</div>
				<div className="min-w-0">
					<p className="text-sm font-semibold text-[#141B34] truncate">
						{label}
					</p>
					<p className="text-xs text-muted-foreground truncate">{desc}</p>
				</div>
				<ArrowRight className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0 group-hover:text-primary transition-colors" />
			</div>
		</Link>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const user = getUser();

	const { data: studentsData, isLoading: studentsLoading } = useGetStudents({
		limit: 100,
	});
	const { data: teachersData, isLoading: teachersLoading } = useGetTeachers({
		limit: 100,
	});
	const { data: lmsData, isLoading: lmsLoading } = useGetLMSCourses();
	const { data: coachingData, isLoading: coachingLoading } =
		useGetCoachingCourses();

	const totalStudents = studentsData?.data?.length ?? 0;
	const totalTeachers = teachersData?.data?.length ?? 0;
	const totalLMS = Array.isArray(lmsData?.data) ? lmsData.data.length : 0;
	const totalCoaching = Array.isArray(coachingData?.data)
		? coachingData.data.length
		: 0;
	const totalCourses = totalLMS + totalCoaching;

	const now = new Date();
	const greeting =
		now.getHours() < 12
			? "Good morning"
			: now.getHours() < 17
				? "Good afternoon"
				: "Good evening";

	// Recent students (last 5)
	const recentStudents: {
		id: string;
		name: string;
		email: string;
		createdAt: string;
	}[] = (studentsData?.data ?? []).slice(0, 5);

	// Recent teachers (last 5)
	const recentTeachers: {
		id: string;
		name: string;
		email: string;
		createdAt: string;
	}[] = (teachersData?.data ?? []).slice(0, 5);

	return (
		<div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
			{/* ── Header ── */}
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm text-muted-foreground mb-1">{greeting}</p>
					<h1 className="text-2xl font-bold text-[#141B34]">
						Welcome back, {user?.name ?? "Admin"} 👋
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Here's what's happening across PrepExcellence today.
					</p>
				</div>
				<div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-light rounded-xl border border-primary/10">
					<LayoutDashboard className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium text-primary">
						Admin Dashboard
					</span>
				</div>
			</div>

			{/* ── KPI Cards ── */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					label="Total Students"
					value={totalStudents}
					icon={Users}
					color="bg-blue-50 text-blue-600"
					href="/dashboard/user-management/students"
					loading={studentsLoading}
				/>
				<StatCard
					label="Total Teachers"
					value={totalTeachers}
					icon={UserCheck}
					color="bg-emerald-50 text-emerald-600"
					href="/dashboard/user-management/teachers"
					loading={teachersLoading}
				/>
				<StatCard
					label="Total Courses"
					value={totalCourses}
					icon={BookOpen}
					color="bg-violet-50 text-violet-600"
					href="/dashboard/course-management"
					loading={lmsLoading || coachingLoading}
				/>
				<StatCard
					label="Coaching Programs"
					value={totalCoaching}
					icon={GraduationCap}
					color="bg-amber-50 text-amber-600"
					href="/dashboard/course-management"
					loading={coachingLoading}
				/>
			</div>

			{/* ── Course breakdown ── */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
							<BookOpen className="w-4 h-4 text-violet-600" />
						</div>
						<p className="font-semibold text-sm text-[#141B34]">LMS Courses</p>
					</div>
					<p className="text-3xl font-bold text-[#141B34]">
						{lmsLoading ? (
							<span className="inline-block h-8 w-12 bg-gray-100 rounded animate-pulse" />
						) : (
							totalLMS
						)}
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						Self-paced video courses
					</p>
					<Link
						to="/dashboard/course-management"
						className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline"
					>
						Manage <ArrowRight className="w-3 h-3" />
					</Link>
				</div>
				<div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
							<GraduationCap className="w-4 h-4 text-amber-600" />
						</div>
						<p className="font-semibold text-sm text-[#141B34]">
							Coaching Programs
						</p>
					</div>
					<p className="text-3xl font-bold text-[#141B34]">
						{coachingLoading ? (
							<span className="inline-block h-8 w-12 bg-gray-100 rounded animate-pulse" />
						) : (
							totalCoaching
						)}
					</p>
					<p className="text-xs text-muted-foreground mt-1">
						Group coaching programs
					</p>
					<Link
						to="/dashboard/course-management"
						className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline"
					>
						Manage <ArrowRight className="w-3 h-3" />
					</Link>
				</div>
			</div>

			{/* ── Recent activity + Quick links ── */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Students */}
				<div className="lg:col-span-1 bg-white rounded-2xl border border-[#EBEBEB] p-5">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-semibold text-sm text-[#141B34]">
							Recent Students
						</h2>
						<Link
							to="/dashboard/user-management/students"
							className="text-xs text-primary hover:underline"
						>
							View all
						</Link>
					</div>
					{studentsLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="flex items-center gap-3 animate-pulse">
									<div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
									<div className="flex-1 space-y-1">
										<div className="h-3 bg-gray-100 rounded w-3/4" />
										<div className="h-2.5 bg-gray-100 rounded w-1/2" />
									</div>
								</div>
							))}
						</div>
					) : recentStudents.length === 0 ? (
						<p className="text-xs text-muted-foreground text-center py-6">
							No students yet
						</p>
					) : (
						<div className="space-y-3">
							{recentStudents.map((s) => (
								<div key={s.id} className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
										<span className="text-xs font-bold text-primary">
											{(s.name ?? "?").charAt(0).toUpperCase()}
										</span>
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium text-[#141B34] truncate">
											{s.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{s.email}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Recent Teachers */}
				<div className="lg:col-span-1 bg-white rounded-2xl border border-[#EBEBEB] p-5">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-semibold text-sm text-[#141B34]">
							Recent Teachers
						</h2>
						<Link
							to="/dashboard/user-management/teachers"
							className="text-xs text-primary hover:underline"
						>
							View all
						</Link>
					</div>
					{teachersLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="flex items-center gap-3 animate-pulse">
									<div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
									<div className="flex-1 space-y-1">
										<div className="h-3 bg-gray-100 rounded w-3/4" />
										<div className="h-2.5 bg-gray-100 rounded w-1/2" />
									</div>
								</div>
							))}
						</div>
					) : recentTeachers.length === 0 ? (
						<p className="text-xs text-muted-foreground text-center py-6">
							No teachers yet
						</p>
					) : (
						<div className="space-y-3">
							{recentTeachers.map((t) => (
								<div key={t.id} className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
										<span className="text-xs font-bold text-emerald-600">
											{(t.name ?? "?").charAt(0).toUpperCase()}
										</span>
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium text-[#141B34] truncate">
											{t.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{t.email}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Quick Links */}
				<div className="lg:col-span-1 bg-white rounded-2xl border border-[#EBEBEB] p-5">
					<h2 className="font-semibold text-sm text-[#141B34] mb-4">
						Quick Actions
					</h2>
					<div className="space-y-2">
						<QuickLink
							label="Add Student"
							desc="Create a new student account"
							href="/dashboard/user-management/students/add-student"
							icon={Users}
						/>
						<QuickLink
							label="Add Teacher"
							desc="Onboard a new instructor"
							href="/dashboard/user-management/teachers/add-teacher"
							icon={UserCheck}
						/>
						<QuickLink
							label="Create Course"
							desc="Publish a new LMS course"
							href="/dashboard/course-management/create"
							icon={BookOpen}
						/>
						<QuickLink
							label="1-on-1 Sessions"
							desc="View all tutoring sessions"
							href="/dashboard/one-to-one-session"
							icon={Video}
						/>
						<QuickLink
							label="Coupons"
							desc="Manage discount codes"
							href="/dashboard/coupon-management"
							icon={ShoppingCart}
						/>
						<QuickLink
							label="Blog"
							desc="Manage content & articles"
							href="/dashboard/content-management/blogs-list"
							icon={MessageSquare}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
