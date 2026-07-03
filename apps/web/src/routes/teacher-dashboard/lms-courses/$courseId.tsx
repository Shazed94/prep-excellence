/**
 * Teacher Dashboard – LMS Course Editor
 * Route: /teacher-dashboard/lms-courses/$courseId
 *
 * Manage modules and lessons for an LMS course.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	ChevronDown,
	ChevronUp,
	FileText,
	Loader2,
	Pencil,
	Plus,
	Save,
	Trash2,
	Upload,
	Video,
} from "lucide-react";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateLesson,
	useCreateModule,
	useDeleteLesson,
	useDeleteModule,
	useGetCourse,
	useUpdateCourse,
} from "@/hooks/lms-course";

export const Route = createFileRoute(
	"/teacher-dashboard/lms-courses/$courseId",
)({
	component: LmsCourseEditorPage,
});

function LmsCourseEditorPage() {
	const id = useId();
	const { courseId } = Route.useParams();
	const { data, isLoading } = useGetCourse(courseId);
	const course = data;

	const { mutate: updateCourse, isPending: savingCourse } = useUpdateCourse();
	const { mutate: createModule, isPending: creatingModule } = useCreateModule();
	const { mutate: deleteModule } = useDeleteModule();
	const { mutate: createLesson, isPending: creatingLesson } = useCreateLesson();
	const { mutate: deleteLesson } = useDeleteLesson();

	// Edit course fields
	const [courseTitle, setCourseTitle] = useState("");
	const [courseDesc, setCourseDesc] = useState("");
	const [editingCourse, setEditingCourse] = useState(false);

	// Module dialog
	const [moduleDialog, setModuleDialog] = useState(false);
	const [moduleTitle, setModuleTitle] = useState("");
	const [moduleDesc, setModuleDesc] = useState("");

	// Lesson dialog
	const [lessonDialog, setLessonDialog] = useState<{
		open: boolean;
		moduleId: string;
	}>({ open: false, moduleId: "" });
	const [lessonTitle, setLessonTitle] = useState("");
	const [lessonContent, setLessonContent] = useState("");

	// Expanded modules
	const [expanded, setExpanded] = useState<Record<string, boolean>>({});

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Loader2 size={28} className="animate-spin text-primary" />
			</div>
		);
	}

	if (!course) {
		return (
			<div className="flex flex-col items-center py-20 text-muted gap-2">
				<p>Course not found.</p>
				<Link to="/teacher-dashboard/lms-courses">
					<Button variant="outline" size="sm">
						Back to Courses
					</Button>
				</Link>
			</div>
		);
	}

	const modules: any[] = course.modules ?? [];

	const handleSaveCourse = () => {
		updateCourse(
			{
				courseId,
				data: {
					title: courseTitle || course.title,
					description: courseDesc || course.description,
				},
			},
			{ onSuccess: () => setEditingCourse(false) },
		);
	};

	const handleCreateModule = () => {
		if (!moduleTitle.trim()) return;
		createModule(
			{
				courseId,
				data: {
					title: moduleTitle,
					description: moduleDesc,
					orderIndex: modules.length,
				},
			},
			{
				onSuccess: () => {
					setModuleDialog(false);
					setModuleTitle("");
					setModuleDesc("");
				},
			},
		);
	};

	const handleCreateLesson = () => {
		if (!lessonTitle.trim()) return;
		createLesson(
			{
				moduleId: lessonDialog.moduleId,
				courseId,
				data: {
					title: lessonTitle,
					content: lessonContent,
					orderIndex: 0,
					contentType: "VIDEO_RECORDED" as const,
					attachments: [],
				},
			},
			{
				onSuccess: () => {
					setLessonDialog({ open: false, moduleId: "" });
					setLessonTitle("");
					setLessonContent("");
				},
			},
		);
	};

	return (
		<div className="space-y-6">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2">
				<Link to="/teacher-dashboard/lms-courses">
					<Button variant="ghost" size="sm" className="gap-1.5 text-xs px-2">
						<ArrowLeft size={13} /> LMS Courses
					</Button>
				</Link>
			</div>

			{/* Course Header */}
			<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
				{editingCourse ? (
					<div className="space-y-3">
						<Input
							value={courseTitle || course.title}
							onChange={(e) => setCourseTitle(e.target.value)}
							className="font-switzer font-bold text-base"
						/>
						<Textarea
							value={
								courseDesc !== undefined
									? courseDesc
									: (course.description ?? "")
							}
							onChange={(e) => setCourseDesc(e.target.value)}
							rows={2}
							placeholder="Course description…"
						/>
						<div className="flex gap-2">
							<Button
								size="sm"
								className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
								onClick={handleSaveCourse}
								disabled={savingCourse}
							>
								{savingCourse ? (
									<Loader2 size={12} className="animate-spin" />
								) : (
									<Save size={12} />
								)}{" "}
								Save
							</Button>
							<Button
								size="sm"
								variant="outline"
								className="text-xs"
								onClick={() => setEditingCourse(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<div className="flex items-start justify-between gap-3">
						<div>
							<h1 className="text-xl font-switzer font-bold">{course.title}</h1>
							{course.description && (
								<p className="text-sm text-muted mt-1">{course.description}</p>
							)}
							<div className="flex gap-2 mt-2">
								{course.isPublished ? (
									<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
										Published
									</Badge>
								) : (
									<Badge className="bg-muted/20 text-muted border-0 text-[10px]">
										Draft
									</Badge>
								)}
								<Badge className="bg-primary/10 text-primary border-0 text-[10px]">
									{modules.length} module{modules.length !== 1 ? "s" : ""}
								</Badge>
							</div>
						</div>
						<Button
							size="sm"
							variant="outline"
							className="gap-1.5 text-xs shrink-0"
							onClick={() => {
								setCourseTitle(course.title);
								setCourseDesc(course.description ?? "");
								setEditingCourse(true);
							}}
						>
							<Pencil size={12} /> Edit
						</Button>
					</div>
				)}
			</div>

			{/* Modules */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h2 className="font-switzer font-semibold text-sm">
						Modules & Lessons
					</h2>
					<Button
						size="sm"
						className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
						onClick={() => setModuleDialog(true)}
					>
						<Plus size={13} /> Add Module
					</Button>
				</div>

				{modules.length === 0 ? (
					<div className="bg-white rounded-lg border border-border/60 shadow-sm flex flex-col items-center py-12 gap-3 text-muted">
						<FileText size={36} className="opacity-20" />
						<p className="text-sm">No modules yet — add your first module</p>
					</div>
				) : (
					<div className="space-y-3">
						{modules.map((mod: any, idx: number) => (
							<div
								key={mod.id}
								className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden"
							>
								{/* Module header */}
								<div className="flex items-center gap-3 px-4 py-3">
									<span className="text-xs font-bold text-muted w-5 shrink-0">
										{idx + 1}
									</span>
									<div className="flex-1 min-w-0">
										<p className="font-semibold text-sm truncate">
											{mod.title}
										</p>
										{mod.description && (
											<p className="text-xs text-muted truncate">
												{mod.description}
											</p>
										)}
									</div>
									<Badge className="bg-primary/10 text-primary border-0 text-[10px] shrink-0">
										{(mod.lessons ?? []).length} lessons
									</Badge>
									<Button
										size="sm"
										variant="ghost"
										className="text-xs px-2 gap-1 text-primary"
										onClick={() =>
											setLessonDialog({ open: true, moduleId: mod.id })
										}
									>
										<Plus size={12} /> Lesson
									</Button>
									<button
										type="button"
										onClick={() =>
											setExpanded((p) => ({ ...p, [mod.id]: !p[mod.id] }))
										}
										className="p-1 text-muted hover:text-foreground"
									>
										{expanded[mod.id] ? (
											<ChevronUp size={15} />
										) : (
											<ChevronDown size={15} />
										)}
									</button>
									<button
										type="button"
										onClick={() => deleteModule(mod.id)}
										className="p-1 text-red-400 hover:text-red-600"
									>
										<Trash2 size={14} />
									</button>
								</div>

								{/* Lessons */}
								{expanded[mod.id] && (
									<div className="border-t border-border/50">
										{(mod.lessons ?? []).length === 0 ? (
											<p className="text-xs text-muted px-6 py-3">
												No lessons yet
											</p>
										) : (
											(mod.lessons ?? []).map((lesson: any, li: number) => (
												<div
													key={lesson.id}
													className="flex items-center gap-3 px-6 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/3 group"
												>
													<span className="text-[11px] text-muted w-4 shrink-0">
														{li + 1}
													</span>
													{lesson.videoUrl ? (
														<Video
															size={12}
															className="text-primary shrink-0"
														/>
													) : (
														<FileText
															size={12}
															className="text-muted shrink-0"
														/>
													)}
													<span className="flex-1 text-xs truncate">
														{lesson.title}
													</span>
													{lesson.duration && (
														<span className="text-[11px] text-muted shrink-0">
															{lesson.duration}m
														</span>
													)}
													{lesson.videoUrl ? (
														<Badge className="bg-primary/10 text-primary border-0 text-[10px] shrink-0">
															<Upload size={9} className="mr-0.5" /> Video
														</Badge>
													) : (
														<Badge className="bg-muted/10 text-muted border-0 text-[10px] shrink-0">
															No video
														</Badge>
													)}
													<button
														type="button"
														onClick={() => deleteLesson(lesson.id)}
														className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
													>
														<Trash2 size={12} />
													</button>
												</div>
											))
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Add Module Dialog */}
			<Dialog open={moduleDialog} onOpenChange={setModuleDialog}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="font-switzer">Add Module</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1.5">
							<label
								htmlFor={`${id}-mod-title`}
								className="text-sm font-medium"
							>
								Module Title *
							</label>
							<Input
								id={`${id}-mod-title`}
								placeholder="e.g. Module 1: Algebra Fundamentals"
								value={moduleTitle}
								onChange={(e) => setModuleTitle(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<label htmlFor={`${id}-mod-desc`} className="text-sm font-medium">
								Description
							</label>
							<Textarea
								id={`${id}-mod-desc`}
								rows={2}
								placeholder="What will students learn in this module?"
								value={moduleDesc}
								onChange={(e) => setModuleDesc(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setModuleDialog(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleCreateModule}
							disabled={!moduleTitle.trim() || creatingModule}
						>
							{creatingModule ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Add Module"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Lesson Dialog */}
			<Dialog
				open={lessonDialog.open}
				onOpenChange={(o) => setLessonDialog((p) => ({ ...p, open: o }))}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="font-switzer">Add Lesson</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1.5">
							<label
								htmlFor={`${id}-lesson-title`}
								className="text-sm font-medium"
							>
								Lesson Title *
							</label>
							<Input
								id={`${id}-lesson-title`}
								placeholder="e.g. Solving Linear Equations"
								value={lessonTitle}
								onChange={(e) => setLessonTitle(e.target.value)}
							/>
						</div>
						<div className="space-y-1.5">
							<label
								htmlFor={`${id}-lesson-content`}
								className="text-sm font-medium"
							>
								Content / Notes
							</label>
							<Textarea
								id={`${id}-lesson-content`}
								rows={4}
								placeholder="Lesson notes or description…"
								value={lessonContent}
								onChange={(e) => setLessonContent(e.target.value)}
							/>
						</div>
						<p className="text-[11px] text-muted">
							Upload video after creating the lesson from the lesson detail
							view.
						</p>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setLessonDialog({ open: false, moduleId: "" })}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleCreateLesson}
							disabled={!lessonTitle.trim() || creatingLesson}
						>
							{creatingLesson ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Add Lesson"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
