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
import { PageHeader, StatCard } from "@/components/dashboard/primitives";
import { useGetCourses as useGetCoachingCourses } from "@/hooks/course-management";
import { useGetCourses as useGetLMSCourses } from "@/hooks/lms-course";
import { useGetStudents, useGetTeachers } from "@/hooks/user-management";
import { getUser } from "@/store/useAuth";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

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
			<div className="group flex items-center gap-4 rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/40 hover:bg-primary-light/30">
				<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-light transition-colors group-hover:bg-primary">
					<Icon className="h-4 w-4 text-primary transition-colors group-hover:text-white" />
				</div>
				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-foreground">
						{label}
					</p>
					<p className="truncate text-xs text-muted-foreground">{desc}</p>
				</div>
				<ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-primary" />
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

	const recentStudents: {
		id: string;
		name: string;
		email: string;
		createdAt: string;
	}[] = (studentsData?.data ?? []).slice(0, 5);

	const recentTeachers: {
		id: string;
		name: string;
		email: string;
		createdAt: string;
	}[] = (teachersData?.data ?? []).slice(0, 5);

	return (
		<div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
			<PageHeader
				title={`${greeting}, ${user?.name ?? "Admin"}`}
				subtitle="Here's what's happening across PrepExcellence today."
				actions={
					<div className="hidden items-center gap-2 rounded-lg border border-primary/10 bg-primary-light px-4 py-2 sm:flex">
						<LayoutDashboard className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">
							Admin Dashboard
						</span>
					</div>
				}
			/>

			{/* ── KPI Cards ── */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatCard
					label="Total Students"
					value={studentsLoading ? "—" : totalStudents.toLocaleString()}
					icon={Users}
					href="/dashboard/user-management/students"
				/>
				<StatCard
					label="Total Teachers"
					value={teachersLoading ? "—" : totalTeachers.toLocaleString()}
					icon={UserCheck}
					href="/dashboard/user-management/teachers"
				/>
				<StatCard
					label="Total Courses"
					value={lmsLoading || coachingLoading ? "—" : totalCourses}
					icon={BookOpen}
					href="/dashboard/course-management"
				/>
				<StatCard
					label="Coaching Programs"
					value={coachingLoading ? "—" : totalCoaching}
					icon={GraduationCap}
					href="/dashboard/course-management"
				/>
			</div>

			{/* ── Course breakdown ── */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="rounded-lg border border-border bg-white p-5">
					<div className="mb-3 flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
							<BookOpen className="h-4 w-4 text-primary" />
						</div>
						<p className="text-sm font-semibold text-foreground">LMS Courses</p>
					</div>
					<p className="font-switzer text-3xl font-bold text-foreground">
						{lmsLoading ? "—" : totalLMS}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Self-paced video courses
					</p>
					<Link
						to="/dashboard/course-management"
						className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
					>
						Manage <ArrowRight className="h-3 w-3" />
					</Link>
				</div>
				<div className="rounded-lg border border-border bg-white p-5">
					<div className="mb-3 flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
							<GraduationCap className="h-4 w-4 text-primary" />
						</div>
						<p className="text-sm font-semibold text-foreground">
							Coaching Programs
						</p>
					</div>
					<p className="font-switzer text-3xl font-bold text-foreground">
						{coachingLoading ? "—" : totalCoaching}
					</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Group coaching programs
					</p>
					<Link
						to="/dashboard/course-management"
						className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
					>
						Manage <ArrowRight className="h-3 w-3" />
					</Link>
				</div>
			</div>

			{/* ── Recent activity + Quick links ── */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Recent Students */}
				<div className="rounded-lg border border-border bg-white p-5 lg:col-span-1">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-sm font-semibold text-foreground">
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
								<div key={i} className="flex animate-pulse items-center gap-3">
									<div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100" />
									<div className="flex-1 space-y-1">
										<div className="h-3 w-3/4 rounded bg-gray-100" />
										<div className="h-2.5 w-1/2 rounded bg-gray-100" />
									</div>
								</div>
							))}
						</div>
					) : recentStudents.length === 0 ? (
						<p className="py-6 text-center text-xs text-muted-foreground">
							No students yet
						</p>
					) : (
						<div className="space-y-3">
							{recentStudents.map((s) => (
								<div key={s.id} className="flex items-center gap-3">
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
										<span className="text-xs font-bold text-primary">
											{(s.name ?? "?").charAt(0).toUpperCase()}
										</span>
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-medium text-foreground">
											{s.name}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{s.email}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Recent Teachers */}
				<div className="rounded-lg border border-border bg-white p-5 lg:col-span-1">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-sm font-semibold text-foreground">
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
								<div key={i} className="flex animate-pulse items-center gap-3">
									<div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-100" />
									<div className="flex-1 space-y-1">
										<div className="h-3 w-3/4 rounded bg-gray-100" />
										<div className="h-2.5 w-1/2 rounded bg-gray-100" />
									</div>
								</div>
							))}
						</div>
					) : recentTeachers.length === 0 ? (
						<p className="py-6 text-center text-xs text-muted-foreground">
							No teachers yet
						</p>
					) : (
						<div className="space-y-3">
							{recentTeachers.map((t) => (
								<div key={t.id} className="flex items-center gap-3">
									<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-light">
										<span className="text-xs font-bold text-primary">
											{(t.name ?? "?").charAt(0).toUpperCase()}
										</span>
									</div>
									<div className="min-w-0">
										<p className="truncate text-sm font-medium text-foreground">
											{t.name}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{t.email}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Quick Links */}
				<div className="rounded-lg border border-border bg-white p-5 lg:col-span-1">
					<h2 className="mb-4 text-sm font-semibold text-foreground">
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
