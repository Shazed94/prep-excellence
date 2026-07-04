/**
 * Teacher Dashboard – My Coaching Courses
 * Route: /teacher-dashboard/coaching
 *
 * Lists all coaching courses. "New Course" navigates to the full create wizard.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	Eye,
	GraduationCap,
	Loader2,
	Lock,
	Pencil,
	Plus,
	Users,
} from "lucide-react";
import {
	EmptyState,
	PageHeader,
	StatusBadge,
} from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";
import {
	useGetMyCoachingCourses,
	usePublishCoachingCourse,
} from "@/hooks/teacher";

export const Route = createFileRoute("/teacher-dashboard/coaching/")({
	component: TeacherCoachingPage,
});

function TeacherCoachingPage() {
	const { data, isLoading } = useGetMyCoachingCourses();
	const courses = data?.data ?? [];

	const { mutate: publishCourse } = usePublishCoachingCourse();

	const levelTone = (level: string) => {
		const map: Record<string, "success" | "warning" | "danger" | "neutral"> = {
			BEGINNER: "success",
			INTERMEDIATE: "warning",
			ADVANCED: "danger",
		};
		return map[level] ?? "neutral";
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Coaching Courses"
				subtitle="Instructor-led programs with live sessions"
				actions={
					<Link
						to="/teacher-dashboard/coaching/create"
						search={{ courseId: undefined }}
					>
						<Button size="sm" className="gap-1.5">
							<Plus size={14} /> New Course
						</Button>
					</Link>
				}
			/>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : courses.length === 0 ? (
				<div className="rounded-lg border border-border bg-white">
					<EmptyState
						icon={GraduationCap}
						title="No coaching courses yet"
						description="Create your first coaching program."
						action={
							<Link
								to="/teacher-dashboard/coaching/create"
								search={{ courseId: undefined }}
							>
								<Button size="sm" className="gap-1.5">
									<Plus size={14} /> Create Program
								</Button>
							</Link>
						}
					/>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{courses.map((course) => (
						<div
							key={course.id}
							className="flex flex-col rounded-lg border border-border bg-white p-4 transition-colors hover:border-primary/40"
						>
							<div className="flex gap-3">
								<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-light">
									{course.thumbnail ? (
										<img
											src={course.thumbnail}
											alt={course.title}
											className="h-full w-full object-cover"
										/>
									) : (
										<GraduationCap size={22} className="text-primary/50" />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<h3 className="line-clamp-1 font-switzer text-sm font-semibold text-foreground">
											{course.title}
										</h3>
										{course.status === "PUBLISHED" ? (
											<StatusBadge tone="success">Live</StatusBadge>
										) : (
											<StatusBadge tone="neutral">Draft</StatusBadge>
										)}
									</div>
									<div className="mt-1 flex flex-wrap items-center gap-2">
										{course.level && (
											<StatusBadge tone={levelTone(course.level)}>
												{course.level}
											</StatusBadge>
										)}
										<span className="text-sm font-bold text-foreground">
											{course.price
												? `৳${course.price.toLocaleString()}`
												: "Price TBD"}
										</span>
									</div>
									<div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-muted">
										{course.enrollmentCount !== undefined && (
											<span className="flex items-center gap-1">
												<Users size={11} /> {course.enrollmentCount} enrolled
											</span>
										)}
										{course.capacity && (
											<span className="flex items-center gap-1">
												<BookOpen size={11} /> {course.capacity} seats
											</span>
										)}
									</div>
								</div>
							</div>

							<div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
								<Link
									to="/teacher-dashboard/coaching/create"
									search={{ courseId: course.id }}
									className="flex-1"
								>
									<Button
										size="sm"
										variant="outline"
										className="w-full gap-1 text-xs"
									>
										<Pencil size={11} /> Edit
									</Button>
								</Link>
								<Button
									size="sm"
									variant="ghost"
									className="gap-1 px-2 text-xs text-primary hover:bg-primary-light"
									title={
										course.status === "PUBLISHED" ? "Unpublish" : "Publish"
									}
									onClick={() =>
										publishCourse({
											courseId: course.id,
											publish: course.status !== "PUBLISHED",
										})
									}
								>
									{course.status === "PUBLISHED" ? (
										<Lock size={13} />
									) : (
										<Eye size={13} />
									)}
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
