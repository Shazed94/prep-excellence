/**
 * Teacher Dashboard – My Students
 * Route: /teacher-dashboard/students
 *
 * Aggregated view of all students across LMS + Coaching enrollments.
 */

import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	GraduationCap,
	Loader2,
	Mail,
	Search,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetCourses } from "@/hooks/lms-course";
import { useGetMyCoachingCourses } from "@/hooks/teacher";

export const Route = createFileRoute("/teacher-dashboard/students")({
	component: TeacherStudentsPage,
});

function CourseRow({
	title,
	level,
	enrollmentCount,
	isPublished,
	type,
}: {
	title: string;
	level?: string;
	enrollmentCount: number;
	isPublished: boolean;
	type: "lms" | "coaching";
}) {
	return (
		<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
			<div className="flex items-center gap-3">
				<div
					className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
						type === "lms"
							? "bg-primary/8 text-primary"
							: "bg-violet-50 text-violet-600"
					}`}
				>
					{type === "lms" ? (
						<BookOpen size={18} />
					) : (
						<GraduationCap size={18} />
					)}
				</div>
				<div className="flex-1 min-w-0">
					<p className="font-switzer font-semibold text-sm truncate">{title}</p>
					<div className="flex items-center gap-1.5 mt-0.5">
						<Badge
							className={`border-0 text-[10px] ${
								type === "lms"
									? "bg-primary/10 text-primary"
									: "bg-violet-100 text-violet-600"
							}`}
						>
							{type === "lms" ? "LMS" : "Coaching"}
						</Badge>
						{level && (
							<span className="text-[11px] text-muted capitalize">
								{level.toLowerCase()}
							</span>
						)}
					</div>
				</div>
				<div className="text-right shrink-0">
					<div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
						<Users size={13} className="text-muted" />
						{enrollmentCount}
					</div>
					<p className="text-[11px] text-muted">enrolled</p>
				</div>
				{isPublished ? (
					<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] shrink-0">
						Live
					</Badge>
				) : (
					<Badge className="bg-muted/20 text-muted border-0 text-[10px] shrink-0">
						Draft
					</Badge>
				)}
			</div>
		</div>
	);
}

function TeacherStudentsPage() {
	const { data: coachingData, isLoading: coachingLoading } =
		useGetMyCoachingCourses();
	const { data: lmsData, isLoading: lmsLoading } = useGetCourses();

	const coachingCourses = coachingData?.data ?? [];
	const lmsCourses: any[] = lmsData?.data ?? [];

	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "lms" | "coaching">(
		"all",
	);

	const isLoading = coachingLoading || lmsLoading;

	const totalStudentsLms = lmsCourses.reduce(
		(acc, c) => acc + (c.enrollmentCount ?? 0),
		0,
	);
	const totalStudentsCoaching = coachingCourses.reduce(
		(acc, c) => acc + (c.enrollmentCount ?? 0),
		0,
	);
	const totalStudents = totalStudentsLms + totalStudentsCoaching;

	// Build unified course list
	const allCourses = [
		...lmsCourses.map((c) => ({
			id: c.id,
			title: c.title,
			level: c.level,
			enrollmentCount: c.enrollmentCount ?? 0,
			isPublished: c.isPublished ?? false,
			type: "lms" as const,
		})),
		...coachingCourses.map((c) => ({
			id: c.id,
			title: c.title,
			level: c.level,
			enrollmentCount: c.enrollmentCount ?? 0,
			isPublished: c.status === "PUBLISHED",
			type: "coaching" as const,
		})),
	];

	const filtered = allCourses.filter((c) => {
		const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
		const matchesType = typeFilter === "all" || c.type === typeFilter;
		return matchesSearch && matchesType;
	});

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-xl font-switzer font-bold">My Students</h1>
				<p className="text-muted text-sm mt-0.5">
					Students enrolled across your LMS courses and coaching programs
				</p>
			</div>

			{/* Stats Row */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<div className="bg-primary rounded-lg p-4 text-white">
					<p className="text-xs text-white/70">Total Students</p>
					<p className="text-3xl font-bold font-switzer mt-1">
						{totalStudents}
					</p>
				</div>
				<div className="bg-primary rounded-lg p-4 text-white">
					<p className="text-xs text-white/70">LMS Students</p>
					<p className="text-3xl font-bold font-switzer mt-1">
						{totalStudentsLms}
					</p>
					<p className="text-[10px] text-white/60 mt-0.5">
						{lmsCourses.length} courses
					</p>
				</div>
				<div className="bg-primary rounded-lg p-4 text-white">
					<p className="text-xs text-white/70">Coaching Students</p>
					<p className="text-3xl font-bold font-switzer mt-1">
						{totalStudentsCoaching}
					</p>
					<p className="text-[10px] text-white/60 mt-0.5">
						{coachingCourses.length} programs
					</p>
				</div>
				<div className="bg-primary rounded-lg p-4 text-white">
					<p className="text-xs text-white/70">Total Courses</p>
					<p className="text-3xl font-bold font-switzer mt-1">
						{lmsCourses.length + coachingCourses.length}
					</p>
					<p className="text-[10px] text-white/60 mt-0.5">LMS + Coaching</p>
				</div>
			</div>

			{/* Search + Filter */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1 max-w-sm">
					<Search
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
					/>
					<Input
						placeholder="Search by course name…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 text-sm"
					/>
				</div>
				<div className="flex gap-1.5">
					{(["all", "lms", "coaching"] as const).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setTypeFilter(t)}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
								typeFilter === t
									? "bg-primary text-white"
									: "bg-muted/10 text-muted hover:bg-muted/20"
							}`}
						>
							{t === "all" ? "All" : t === "lms" ? "LMS" : "Coaching"}
						</button>
					))}
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : allCourses.length === 0 ? (
				<div className="flex flex-col items-center py-20 gap-3 text-muted">
					<Users size={48} className="opacity-20" />
					<p className="text-sm">No students yet</p>
					<p className="text-xs text-center max-w-xs">
						Students will appear here once they enroll in your courses or
						coaching programs.
					</p>
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center py-12 gap-3 text-muted">
					<Search size={32} className="opacity-20" />
					<p className="text-sm">No results for "{search}"</p>
				</div>
			) : (
				<div className="space-y-3">
					{filtered.map((course) => (
						<CourseRow
							key={`${course.type}-${course.id}`}
							title={course.title}
							level={course.level}
							enrollmentCount={course.enrollmentCount}
							isPublished={course.isPublished}
							type={course.type}
						/>
					))}
				</div>
			)}

			{/* Note about per-student details */}
			<div className="bg-primary/5 rounded-xl border border-primary/10 p-4">
				<div className="flex items-start gap-2">
					<Mail size={14} className="text-primary mt-0.5 shrink-0" />
					<p className="text-xs text-muted leading-relaxed">
						Individual student details (name, progress, contact) require backend
						support. The backend team should add{" "}
						<code className="bg-white px-1 rounded text-[11px]">
							GET /coaching/courses/:courseId/students
						</code>{" "}
						and{" "}
						<code className="bg-white px-1 rounded text-[11px]">
							GET /lms/courses/:courseId/students
						</code>{" "}
						to enable per-student views here.
					</p>
				</div>
			</div>
		</div>
	);
}
