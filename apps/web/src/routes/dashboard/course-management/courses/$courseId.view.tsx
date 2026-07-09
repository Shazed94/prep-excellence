import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import {
	ArrowLeft,
	BookOpen,
	Clock,
	Edit,
	Loader2,
	Tag,
	Target,
	Users,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	useDeleteCourse,
	useGetCourse,
	usePublishCourse,
} from "@/hooks/lms-course";

export const Route = createFileRoute(
	"/dashboard/course-management/courses/$courseId/view",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();
	const courseId = (params as any).courseId as string;
	const { data: course, isLoading, error } = useGetCourse(courseId);
	const publishMutation = usePublishCourse();
	const deleteMutation = useDeleteCourse();
	const [confirmOpen, setConfirmOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error || !course) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<p className="text-lg text-slate-700">Failed to load course</p>
					<p className="text-sm text-slate-500">Please try again later</p>
				</div>
			</div>
		);
	}

	const handlePublishToggle = async () => {
		try {
			await publishMutation.mutateAsync({
				courseId: course.id,
				isPublished: !course.isPublished,
			});
		} catch (err: any) {
			console.error(err);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync(course.id);
			setConfirmOpen(false);
		} catch (err: any) {
			console.error(err);
		}
	};

	const lessonTypeLabel = (type: string) => {
		const labels: Record<string, string> = {
			VIDEO_CONTENT: "Video",
			VIDEO_RECORDED: "Recorded",
			VIDEO_LIVE: "Live",
			VIDEO_SCHEDULED: "Scheduled",
			QUIZ: "Quiz",
			TEXT: "Text",
		};
		return labels[type] || type;
	};

	return (
		<div className="w-full bg-slate-50 min-h-screen py-8 px-4 md:px-8 lg:px-10">
			{/* Back button */}
			<Link
				to="/dashboard/course-management"
				className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to all courses
			</Link>

			{/* Header */}
			<div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
					<p className="text-slate-500 text-sm mt-1">
						Created {format(new Date(course.createdAt), "MMM dd, yyyy")}
						{course.category && (
							<>
								{" "}
								&middot;{" "}
								<span className="text-primary">{course.category.name}</span>
							</>
						)}
					</p>
				</div>
				<div className="flex items-center gap-2 flex-wrap">
					<Button variant="outline" size="sm" asChild>
						<Link
							to={
								`/dashboard/course-management/courses/${course.id}/edit` as "/"
							}
						>
							<Edit className="w-4 h-4 mr-1.5" /> Edit
						</Link>
					</Button>
					<Button
						variant={course.isPublished ? "outline" : "default"}
						size="sm"
						onClick={handlePublishToggle}
						disabled={publishMutation.isPending}
					>
						{publishMutation.isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : course.isPublished ? (
							"Unpublish"
						) : (
							"Publish"
						)}
					</Button>
					<Button
						variant="destructive"
						size="sm"
						onClick={() => setConfirmOpen(true)}
					>
						Delete
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Description card */}
					<Card className="gap-1">
						<CardHeader className="pb-0">
							<CardTitle className="text-lg">Description</CardTitle>
						</CardHeader>
						<CardContent>
							{course.shortDescription && (
								<div className="text-sm text-slate-500 mb-3 italic">
									{parse(DOMPurify.sanitize(course.shortDescription))}
								</div>
							)}
							{course.longDescription ? (
								<div className="prose max-w-none text-sm text-slate-700">
									{parse(DOMPurify.sanitize(course.longDescription))}
								</div>
							) : (
								<p className="text-sm text-slate-400">
									No description provided.
								</p>
							)}
						</CardContent>
					</Card>

					{/* What You'll Learn */}
					{course.whatYouLearn && course.whatYouLearn.length > 0 && (
						<Card className="gap-1">
							<CardHeader className="pb-0">
								<CardTitle className="text-lg flex items-center gap-2">
									<Target className="w-5 h-5 text-primary" />
									What You'll Learn
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
									{course.whatYouLearn.map((item: string, i: number) => (
										<li key={i}>{item}</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}

					{/* Requirements */}
					{course.requirements && course.requirements.length > 0 && (
						<Card className="gap-1">
							<CardHeader className="pb-0">
								<CardTitle className="text-lg">Requirements</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
									{course.requirements.map((item: string, i: number) => (
										<li key={i}>{item}</li>
									))}
								</ul>
							</CardContent>
						</Card>
					)}

					{/* Modules & Lessons */}
					{course.courseModules && course.courseModules.length > 0 && (
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-900">
								Course Content ({course.courseModules.length} modules)
							</h2>
							{course.courseModules.map((m: any, mi: number) => (
								<Card key={m.id}>
									<CardHeader className="pb-3">
										<CardTitle className="text-base flex items-center gap-2">
											<span className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
												{mi + 1}
											</span>
											{m.title}
											{m.lessons && (
												<span className="text-xs font-normal text-slate-400 ml-auto">
													{m.lessons.length} lesson
													{m.lessons.length !== 1 ? "s" : ""}
												</span>
											)}
										</CardTitle>
									</CardHeader>
									{m.lessons && m.lessons.length > 0 && (
										<CardContent>
											<div className="divide-y rounded border">
												{m.lessons.map((l: any, li: number) => (
													<div
														key={l.id}
														className="flex items-center justify-between px-4 py-3 text-sm"
													>
														<div className="flex items-center gap-3 min-w-0">
															<span className="text-slate-400 font-mono text-xs w-5 shrink-0">
																{li + 1}
															</span>
															<span className="font-medium truncate">
																{l.title}
															</span>
														</div>
														<div className="flex items-center gap-2 shrink-0">
															<Badge
																variant="outline"
																className="text-[10px] px-1.5 py-0"
															>
																{lessonTypeLabel(l.lessonType)}
															</Badge>
															{l.isPublished ? (
																<Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 hover:bg-green-100">
																	Published
																</Badge>
															) : (
																<Badge
																	variant="secondary"
																	className="text-[10px] px-1.5 py-0"
																>
																	Draft
																</Badge>
															)}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									)}
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Thumbnail */}
					<Card>
						<CardContent className="p-4">
							{course.thumbnail ? (
								<img
									src={course.thumbnail}
									alt={course.title}
									className="w-full aspect-video object-cover rounded-lg"
								/>
							) : (
								<div className="w-full aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
									<BookOpen className="w-10 h-10 text-slate-300" />
								</div>
							)}
						</CardContent>
					</Card>

					{/* Info card */}
					<Card className="gap-1">
						<CardHeader className="pb-0">
							<CardTitle className="text-base">Course Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Status</span>
								<Badge
									variant={course.isPublished ? "default" : "secondary"}
									className="text-xs"
								>
									{course.isPublished ? "Published" : "Draft"}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Level</span>
								<span className="font-medium capitalize">
									{course.level.toLowerCase()}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Price</span>
								<span className="font-semibold">
									${Number(course.price).toFixed(2)}
								</span>
							</div>
							{course.discount && Number(course.discount) > 0 && (
								<div className="flex items-center justify-between">
									<span className="text-slate-500">Discount</span>
									<span className="font-semibold text-green-600">
										-${Number(course.discount).toFixed(2)}
									</span>
								</div>
							)}
							{course.duration && (
								<div className="flex items-center justify-between">
									<span className="text-slate-500 flex items-center gap-1.5">
										<Clock className="w-3.5 h-3.5" /> Duration
									</span>
									<span className="font-medium">{course.duration} min</span>
								</div>
							)}
							<div className="flex items-center justify-between">
								<span className="text-slate-500 flex items-center gap-1.5">
									<Users className="w-3.5 h-3.5" /> Students
								</span>
								<span className="font-medium">
									{course._count?.enrollments || 0}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Modules</span>
								<span className="font-medium">
									{course.courseModules?.length || 0}
								</span>
							</div>
							{(course as any).averageRating > 0 && (
								<div className="flex items-center justify-between">
									<span className="text-slate-500">Rating</span>
									<span className="font-medium">
										{(course as any).averageRating.toFixed(1)} (
										{(course as any).totalReviews})
									</span>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Tags */}
					{course.tags && course.tags.length > 0 && (
						<Card className="gap-1">
							<CardHeader className="pb-0">
								<CardTitle className="text-base flex items-center gap-2">
									<Tag className="w-4 h-4 text-primary" />
									Tags
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-1.5">
									{course.tags.map((tag: string, i: number) => (
										<Badge key={i} variant="secondary" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Created by */}
					{course.createdBy && (
						<Card className="gap-1">
							<CardHeader className="pb-0">
								<CardTitle className="text-base">Created By</CardTitle>
							</CardHeader>
							<CardContent className="text-sm">
								<div className="flex items-center gap-3">
									{course.createdBy.image ? (
										<img
											src={course.createdBy.image}
											alt={course.createdBy.name}
											className="w-9 h-9 rounded-full object-cover"
										/>
									) : (
										<div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
											{course.createdBy.name?.charAt(0) || "?"}
										</div>
									)}
									<span className="font-medium">{course.createdBy.name}</span>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Course</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete <strong>{course.title}</strong>?
							This action cannot be undone. All modules, lessons, and student
							progress will be permanently removed.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setConfirmOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								"Delete Course"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
