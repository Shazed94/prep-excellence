/**
 * Teacher Dashboard – LMS Courses
 * Route: /teacher-dashboard/lms-courses
 *
 * Lists all LMS courses created by this teacher.
 * "New Course" navigates to the full create-course wizard.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	Eye,
	Globe,
	Loader2,
	Lock,
	Pencil,
	Plus,
	Trash2,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useDeleteCourse,
	useGetCourses,
	usePublishCourse,
} from "@/hooks/lms-course";

export const Route = createFileRoute("/teacher-dashboard/lms-courses/")({
	component: TeacherLmsCoursesPage,
});

function TeacherLmsCoursesPage() {
	const { data, isLoading } = useGetCourses();
	const courses = (Array.isArray(data) ? data : data?.data) ?? [];

	const { mutate: publishCourse } = usePublishCourse();
	const { mutate: deleteCourse } = useDeleteCourse();

	const [deleteId, setDeleteId] = useState<string | null>(null);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold">LMS Courses</h1>
					<p className="text-muted text-sm mt-0.5">
						Manage your online self-paced courses
					</p>
				</div>
				<Link
					to="/teacher-dashboard/lms-courses/create"
					search={{ courseId: undefined }}
				>
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
						<BookOpen size={36} className="text-primary/40" />
					</div>
					<div className="text-center">
						<h3 className="font-switzer font-semibold">No courses yet</h3>
						<p className="text-sm text-muted mt-1">
							Create your first LMS course to get started.
						</p>
					</div>
					<Link
						to="/teacher-dashboard/lms-courses/create"
						search={{ courseId: undefined }}
					>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90 gap-1.5"
						>
							<Plus size={14} /> Create Course
						</Button>
					</Link>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{courses.map((course: any) => (
						<div
							key={course.id}
							className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
						>
							<div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
								{course.thumbnail ? (
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<BookOpen size={36} className="text-primary/30" />
									</div>
								)}
								<div className="absolute top-2 left-2">
									{course.isPublished ? (
										<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] gap-1">
											<Globe size={9} /> Published
										</Badge>
									) : (
										<Badge className="bg-muted/20 text-muted border-0 text-[10px] gap-1">
											<Lock size={9} /> Draft
										</Badge>
									)}
								</div>
							</div>

							<div className="p-4 space-y-3">
								<div>
									<h3 className="font-switzer font-bold text-sm line-clamp-2">
										{course.title}
									</h3>
									{course.description && (
										<p className="text-xs text-muted mt-1 line-clamp-2">
											{course.description}
										</p>
									)}
								</div>

								{course.enrollmentCount !== undefined && (
									<div className="flex items-center gap-1 text-xs text-muted">
										<Users size={11} />
										<span>{course.enrollmentCount ?? 0} enrolled</span>
									</div>
								)}

								<div className="flex gap-2 pt-1">
									<Link
										to="/teacher-dashboard/lms-courses/$courseId"
										params={{ courseId: course.id }}
										className="flex-1"
									>
										<Button
											size="sm"
											className="w-full bg-primary hover:bg-primary/90 text-xs gap-1"
										>
											<Pencil size={11} /> Edit
										</Button>
									</Link>
									<Button
										size="sm"
										variant="outline"
										className="text-xs gap-1"
										onClick={() =>
											publishCourse({
												courseId: course.id,
												isPublished: !course.isPublished,
											})
										}
									>
										{course.isPublished ? (
											<>
												<Lock size={11} /> Unpublish
											</>
										) : (
											<>
												<Eye size={11} /> Publish
											</>
										)}
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
										onClick={() => setDeleteId(course.id)}
									>
										<Trash2 size={13} />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Delete Confirm Dialog */}
			<Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">Delete Course?</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-muted">
						This will permanently delete the course and all its modules and
						lessons. This cannot be undone.
					</p>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setDeleteId(null)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-red-500 hover:bg-red-600 text-white"
							onClick={() => {
								if (deleteId) {
									deleteCourse(deleteId);
									setDeleteId(null);
								}
							}}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
