import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { BookOpen, Clock, Loader2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LocalLesson } from "./lesson-item";
import { type LocalModule, ModuleItem } from "./module-item";

interface CourseModulesProps {
	courseId: string;
	courseData: {
		title?: string;
		description?: string;
		level?: string;
		price?: number;
		discount?: number;
		duration?: number;
	};
	instructorsData?: any[];
	instructorsLoading?: boolean;
	setInstructorSearch?: (value: string) => void;
	instructorSearch?: string;
	modules: LocalModule[];
	allLessons: LocalLesson[];
	isLiveCourseModule?: boolean;
	createModuleMutation: any;
	createLessonMutation: any;
	updateModuleMutation: any;
	updateLessonMutation: any;
	onAddModule: () => Promise<void>;
	onAddLesson: (moduleId: string) => Promise<void>;
	onUpdateModule: (
		id: string,
		field: keyof Omit<LocalModule, "id" | "courseId">,
		value: any,
	) => Promise<void>;
	onUpdateLesson: (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "moduleId">,
		value: any,
	) => Promise<void>;
	onSaveModule: (moduleId: string) => Promise<void>;
	onSaveLesson: (lessonId: string) => Promise<void>;
	onDeleteModule: (id: string) => Promise<void>;
	onDeleteLesson: (id: string) => Promise<void>;
	onDragEnd: (result: DropResult) => void;
	onBack: () => void;
	isEditMode?: boolean;
}

export function CourseModules({
	courseId,
	courseData,
	modules,
	allLessons,
	instructorsData,
	instructorsLoading,
	setInstructorSearch,
	instructorSearch,
	isLiveCourseModule,
	createModuleMutation,
	createLessonMutation,
	updateModuleMutation,
	updateLessonMutation,
	onAddModule,
	onAddLesson,
	onUpdateModule,
	onUpdateLesson,
	onSaveModule,
	onSaveLesson,
	onDeleteModule,
	onDeleteLesson,
	onDragEnd,
	onBack,
	isEditMode,
}: CourseModulesProps) {
	const [expandedModules, setExpandedModules] = useState<string[]>([]);
	const moduleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const lessonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const [lastAddedModuleId, setLastAddedModuleId] = useState<string | null>(
		null,
	);
	const [lastAddedLessonId, setLastAddedLessonId] = useState<string | null>(
		null,
	);

	// Scroll to newly added module
	useEffect(() => {
		if (lastAddedModuleId && moduleRefs.current[lastAddedModuleId]) {
			moduleRefs.current[lastAddedModuleId]?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			setLastAddedModuleId(null);
		}
	}, [lastAddedModuleId]);

	// Scroll to newly added lesson
	useEffect(() => {
		if (lastAddedLessonId && lessonRefs.current[lastAddedLessonId]) {
			lessonRefs.current[lastAddedLessonId]?.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
			setLastAddedLessonId(null);
		}
	}, [lastAddedLessonId]);

	const handleAddModule = async () => {
		try {
			await onAddModule();
			// The new module ID will be set by parent component
		} catch (_error) {
			toast.error("Failed to add module");
		}
	};

	const handleAddLesson = async (moduleId: string) => {
		try {
			await onAddLesson(moduleId);
			// Auto-expand the module to show the new lesson
			if (!expandedModules.includes(moduleId)) {
				setExpandedModules((prev) => [...prev, moduleId]);
			}
		} catch (_error) {
			toast.error("Failed to add lesson");
		}
	};

	const handleContentTypeChange = (lessonId: string, value: string) => {
		onUpdateLesson(lessonId, "contentType", value as any);
	};

	// const handleNavigateToQuiz = (lessonId: string, moduleId: string) => {
	// 	// TODO: Implement quiz creation route
	// 	const lesson = allLessons.find((l) => l.id === lessonId);
	// 	const module = modules.find((m) => m.id === moduleId);

	// 	toast.info(
	// 		`Quiz management for lesson "${lesson?.title || "Untitled"}" in module "${module?.title || "Untitled"}" - Coming soon!`,
	// 	);

	// 	// When route is created, uncomment:
	// 	// navigate({
	// 	// 	to: "/dashboard/instructor-portal/create-quiz",
	// 	// 	search: {
	// 	// 		lessonId,
	// 	// 		moduleId,
	// 	// 		courseTitle: courseData.title || "Untitled Course",
	// 	// 		lessonTitle: lesson?.title || "Untitled Lesson",
	// 	// 		moduleTitle: module?.title || "Untitled Module",
	// 	// 	},
	// 	// });
	// };

	const handleMoveLessonUp = (lessonId: string, moduleId: string) => {
		const moduleLessons = allLessons
			.filter((l) => l.moduleId === moduleId)
			.sort((a, b) => a.orderIndex - b.orderIndex);
		const currentIndex = moduleLessons.findIndex((l) => l.id === lessonId);

		if (currentIndex > 0) {
			const currentLesson = moduleLessons[currentIndex];
			const previousLesson = moduleLessons[currentIndex - 1];

			updateLessonMutation.mutateAsync({
				lessonId: currentLesson.id,
				data: { orderIndex: previousLesson.orderIndex },
			});

			updateLessonMutation.mutateAsync({
				lessonId: previousLesson.id,
				data: { orderIndex: currentLesson.orderIndex },
			});
		}
	};

	const handleMoveLessonDown = (lessonId: string, moduleId: string) => {
		const moduleLessons = allLessons
			.filter((l) => l.moduleId === moduleId)
			.sort((a, b) => a.orderIndex - b.orderIndex);
		const currentIndex = moduleLessons.findIndex((l) => l.id === lessonId);

		if (currentIndex < moduleLessons.length - 1) {
			const currentLesson = moduleLessons[currentIndex];
			const nextLesson = moduleLessons[currentIndex + 1];

			updateLessonMutation.mutateAsync({
				lessonId: currentLesson.id,
				data: { orderIndex: nextLesson.orderIndex },
			});

			updateLessonMutation.mutateAsync({
				lessonId: nextLesson.id,
				data: { orderIndex: currentLesson.orderIndex },
			});
		}
	};

	const handleAddAttachment = (lessonId: string, filename: string) => {
		const lesson = allLessons.find((l) => l.id === lessonId);
		if (lesson) {
			onUpdateLesson(lessonId, "attachments", [
				...lesson.attachments,
				filename,
			]);
		}
	};

	const handleRemoveAttachment = (lessonId: string, index: number) => {
		const lesson = allLessons.find((l) => l.id === lessonId);
		if (lesson) {
			onUpdateLesson(
				lessonId,
				"attachments",
				lesson.attachments.filter((_att: string, i: number) => i !== index),
			);
		}
	};

	const toggleModuleExpansion = (moduleId: string) => {
		setExpandedModules((prev) =>
			prev.includes(moduleId)
				? prev.filter((id) => id !== moduleId)
				: [...prev, moduleId],
		);
	};

	const descriptionText =
		courseData.description?.replace(/<[^>]*>/g, "").substring(0, 100) || "";

	return (
		<div className="w-full bg-slate-50 py-8 px-4  min-h-screen">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 mb-2">
					{isEditMode ? "Edit" : "Course"} Modules & Lessons
				</h1>
				<p className="text-slate-600">
					Step 3: Organize your course content with modules and lessons
				</p>
			</div>

			{/* Course Overview Card */}
			<div className=" mb-8">
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"></div>

						<div className="flex-1">
							<h2 className="text-2xl font-bold text-slate-900">
								{courseData.title || "Untitled Course"}
							</h2>
							{descriptionText && (
								<p className="text-slate-600 mt-2 line-clamp-2">
									{descriptionText}...
								</p>
							)}

							<div className="flex items-center gap-3 mt-3 flex-wrap">
								{courseData.duration && (
									<Badge variant="outline" className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{courseData.duration}{" "}
										{isLiveCourseModule ? "days" : "hours"}
									</Badge>
								)}
								{courseData.level && (
									<Badge variant="secondary">{courseData.level}</Badge>
								)}
								{courseData.price && (
									<span className="text-slate-700 font-medium">
										{courseData.discount
											? `$${courseData.discount}`
											: `$${courseData.price}`}
										{courseData.discount && (
											<span className="ml-2 text-sm text-slate-400 line-through">
												${courseData.price}
											</span>
										)}
									</span>
								)}
							</div>
						</div>

						<Button
							variant="outline"
							onClick={onBack}
							className="whitespace-nowrap"
						>
							Edit Details
						</Button>
					</div>
				</div>
			</div>

			{/* Modules Section */}
			<DragDropContext onDragEnd={onDragEnd}>
				<div className=" space-y-6">
					<div>
						<h3 className="text-xl font-semibold text-slate-900 mb-2">
							Course Modules
						</h3>
						<p className="text-slate-600">
							Add modules and lessons to organize your course content
						</p>
					</div>

					{modules.length === 0 ? (
						<div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
							<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="w-8 h-8 text-slate-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 mb-2">
								No modules yet
							</h3>
							<p className="text-slate-600 mb-6">
								Start by adding your first module to organize your course
								content
							</p>
							<Button
								onClick={handleAddModule}
								className="flex items-center gap-2 mx-auto"
								disabled={createModuleMutation.isPending}
							>
								{createModuleMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin" />
										Adding...
									</>
								) : (
									<>
										<Plus className="w-4 h-4" />
										Add First Module
									</>
								)}
							</Button>
						</div>
					) : (
						<Droppable droppableId="modules" type="MODULES">
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="space-y-6"
								>
									{modules
										.sort((a, b) => a.orderIndex - b.orderIndex)
										.map((module, moduleIndex) => {
											const moduleLessons = allLessons
												.filter((l) => l.moduleId === module.id)
												.sort((a, b) => a.orderIndex - b.orderIndex);
											const isExpanded = expandedModules.includes(module.id);

											return (
												<div
													key={module.id}
													ref={(el) => {
														if (el) moduleRefs.current[module.id] = el;
													}}
													className="border border-slate-400 rounded-xl"
												>
													<ModuleItem
														module={module}
														moduleIndex={moduleIndex}
														isExpanded={isExpanded}
														isLiveCourseModule={isLiveCourseModule}
														toggleModuleExpansion={toggleModuleExpansion}
														handleUpdateModule={onUpdateModule}
														handleSaveModule={onSaveModule}
														handleDeleteModule={onDeleteModule}
														handleAddLesson={handleAddLesson}
														moduleLessons={moduleLessons}
														handleDeleteLesson={onDeleteLesson}
														handleUpdateLesson={onUpdateLesson}
														handleSaveLesson={onSaveLesson}
														handleAddAttachment={handleAddAttachment}
														handleRemoveAttachment={handleRemoveAttachment}
														// handleNavigateToQuiz={handleNavigateToQuiz}
														instructorsData={instructorsData || []}
														setInstructorSearch={
															setInstructorSearch || (() => {})
														}
														instructorSearch={instructorSearch || ""}
														handleMoveLessonUp={handleMoveLessonUp}
														handleMoveLessonDown={handleMoveLessonDown}
														handleContentTypeChange={handleContentTypeChange}
														lessonRefs={lessonRefs}
														courseTitle={courseData.title}
														createModuleMutation={createModuleMutation}
														createLessonMutation={createLessonMutation}
														updateModuleMutation={updateModuleMutation}
														updateLessonMutation={updateLessonMutation}
														courseId={courseId}
													/>
												</div>
											);
										})}
									{provided.placeholder}

									<div className="flex justify-center py-6">
										<Button
											onClick={handleAddModule}
											variant="outline"
											className="flex items-center gap-2"
											disabled={createModuleMutation.isPending}
										>
											{createModuleMutation.isPending ? (
												<>
													<Loader2 className="w-4 h-4 animate-spin" />
													Adding...
												</>
											) : (
												<>
													<Plus className="w-5 h-5" />
													Add New Module
												</>
											)}
										</Button>
									</div>
								</div>
							)}
						</Droppable>
					)}
				</div>
			</DragDropContext>

			{/* Footer Navigation */}
			<div className=" mt-12 flex justify-between gap-4 pt-6 border-t">
				<Button variant="outline" onClick={onBack} size="lg">
					Back to Details
				</Button>
				<Button
					variant="default"
					size="lg"
					className="px-8"
					disabled={modules.length === 0}
				>
					Course Ready!
				</Button>
			</div>
		</div>
	);
}
