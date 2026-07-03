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
import {
	EmptyState,
	PageHeader,
	StatusBadge,
} from "@/components/dashboard/primitives";
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
	useGetMyLMSCourses,
	usePublishCourse,
} from "@/hooks/lms-course";

export const Route = createFileRoute("/teacher-dashboard/lms-courses/")({
	component: TeacherLmsCoursesPage,
});

function TeacherLmsCoursesPage() {
	const { data, isLoading } = useGetMyLMSCourses();
	const courses = (Array.isArray(data) ? data : data?.data) ?? [];

	const { mutate: publishCourse } = usePublishCourse();
	const { mutate: deleteCourse } = useDeleteCourse();

	const [deleteId, setDeleteId] = useState<string | null>(null);

	return (
		<div className="space-y-6">
			<PageHeader
				title="LMS Courses"
				subtitle="Manage your online self-paced courses"
				actions={
					<Link
						to="/teacher-dashboard/lms-courses/create"
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
						icon={BookOpen}
						title="No courses yet"
						description="Create your first LMS course to get started."
						action={
							<Link
								to="/teacher-dashboard/lms-courses/create"
								search={{ courseId: undefined }}
							>
								<Button size="sm" className="gap-1.5">
									<Plus size={14} /> Create Course
								</Button>
							</Link>
						}
					/>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{courses.map((course: any) => (
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
										<BookOpen size={22} className="text-primary/50" />
									)}
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<h3 className="line-clamp-1 font-switzer text-sm font-semibold text-foreground">
											{course.title}
										</h3>
										{course.isPublished ? (
											<StatusBadge tone="success">
												<Globe size={9} className="mr-1" /> Live
											</StatusBadge>
										) : (
											<StatusBadge tone="neutral">
												<Lock size={9} className="mr-1" /> Draft
											</StatusBadge>
										)}
									</div>
									{course.description && (
										<p className="mt-0.5 line-clamp-2 text-xs text-muted">
											{course.description}
										</p>
									)}
									<div className="mt-1.5 flex items-center gap-1 text-xs text-muted">
										<Users size={11} />
										<span>{course.enrollmentCount ?? 0} enrolled</span>
									</div>
								</div>
							</div>

							<div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
								<Link
									to="/teacher-dashboard/lms-courses/$courseId"
									params={{ courseId: course.id }}
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
									title={course.isPublished ? "Unpublish" : "Publish"}
									onClick={() =>
										publishCourse({
											courseId: course.id,
											isPublished: !course.isPublished,
										})
									}
								>
									{course.isPublished ? <Lock size={13} /> : <Eye size={13} />}
								</Button>
								<Button
									size="sm"
									variant="ghost"
									className="px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
									title="Delete"
									onClick={() => setDeleteId(course.id)}
								>
									<Trash2 size={13} />
								</Button>
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
							className="bg-red-500 text-white hover:bg-red-600"
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
