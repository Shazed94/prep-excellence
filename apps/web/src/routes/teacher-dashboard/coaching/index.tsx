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
import { Badge } from "@/components/ui/badge";
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

	const levelColor = (level: string) => {
		const map: Record<string, string> = {
			BEGINNER: "bg-emerald-100 text-emerald-700",
			INTERMEDIATE: "bg-amber-100 text-amber-700",
			ADVANCED: "bg-red-100 text-red-600",
		};
		return map[level] ?? "bg-muted/20 text-muted";
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold">Coaching Courses</h1>
					<p className="text-muted text-sm mt-0.5">
						Instructor-led programs with live sessions
					</p>
				</div>
				<Link to="/teacher-dashboard/coaching/create">
					<Button
						size="sm"
						className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
					>
						<Plus size={14} /> New Course
					</Button>
				</Link>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : courses.length === 0 ? (
				<div className="flex flex-col items-center py-20 gap-4">
					<div className="w-20 h-20 rounded-2xl bg-primary/8 flex items-center justify-center">
						<GraduationCap size={36} className="text-primary/40" />
					</div>
					<div className="text-center">
						<h3 className="font-switzer font-semibold">
							No coaching courses yet
						</h3>
						<p className="text-sm text-muted mt-1">
							Create your first coaching program.
						</p>
					</div>
					<Link to="/teacher-dashboard/coaching/create">
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90 gap-1.5"
						>
							<Plus size={14} /> Create Program
						</Button>
					</Link>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{courses.map((course) => (
						<div
							key={course.id}
							className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
						>
							<div className="relative aspect-video bg-gradient-to-br from-violet-50 to-violet-100/50 overflow-hidden">
								{course.thumbnail ? (
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<GraduationCap size={36} className="text-violet-300" />
									</div>
								)}
								<div className="absolute top-2 left-2 flex gap-1">
									{course.status === "PUBLISHED" ? (
										<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
											Published
										</Badge>
									) : (
										<Badge className="bg-muted/20 text-muted border-0 text-[10px]">
											Draft
										</Badge>
									)}
									{course.level && (
										<Badge
											className={`border-0 text-[10px] ${levelColor(course.level)}`}
										>
											{course.level}
										</Badge>
									)}
								</div>
							</div>

							<div className="p-4 space-y-3">
								<div>
									<h3 className="font-switzer font-bold text-sm line-clamp-2">
										{course.title}
									</h3>
								</div>

								<div className="flex flex-wrap gap-3 text-[11px] text-muted">
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

								<div className="flex items-center justify-between">
									{course.price ? (
										<span className="font-bold text-sm">
											৳{course.price.toLocaleString()}
										</span>
									) : (
										<span className="text-xs text-muted">Price TBD</span>
									)}
								</div>

								<div className="flex gap-2 pt-1">
									<Link
										to="/teacher-dashboard/coaching/$courseId"
										params={{ courseId: course.id }}
										className="flex-1"
									>
										<Button
											size="sm"
											className="w-full bg-primary hover:bg-primary/90 text-xs gap-1"
										>
											<Pencil size={11} /> Manage
										</Button>
									</Link>
									<Button
										size="sm"
										variant="outline"
										className="text-xs gap-1"
										onClick={() =>
											publishCourse({
												courseId: course.id,
												publish: course.status !== "PUBLISHED",
											})
										}
									>
										{course.status === "PUBLISHED" ? (
											<>
												<Lock size={11} /> Unpublish
											</>
										) : (
											<>
												<Eye size={11} /> Publish
											</>
										)}
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
