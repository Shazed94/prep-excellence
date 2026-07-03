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
	courseTeacherId?: string;
	teachersData?: any[];
	setTeacherSearch?: (value: string) => void;
	teacherSearch?: string;
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
	courseTeacherId,
	modules,
	allLessons,
	teachersData,
	setTeacherSearch,
	teacherSearch,
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

	// Auto-expand modules that already have lessons
	useEffect(() => {
		setExpandedModules((prev) => {
			const moduleIdsWithLessons = modules
				.filter((m) => allLessons.some((l) => l.moduleId === m.id))
				.map((m) => m.id);
			const newExpanded = [...prev];
			let changed = false;
			for (const id of moduleIdsWithLessons) {
				if (!newExpanded.includes(id)) {
					newExpanded.push(id);
					changed = true;
				}
			}
			return changed ? newExpanded : prev;
		});
	}, [modules, allLessons]);
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
		<div className="w-full bg-muted/5 py-8 px-4  min-h-screen">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-foreground mb-2">
					{isEditMode ? "Edit" : "Course"} Modules & Lessons
				</h1>
				<p className="text-muted">
					Step 3: Organize your course content with modules and lessons
				</p>
			</div>

			{/* Course Overview Card */}
			<div className=" mb-8">
				<div className="bg-white rounded-xl border border-border p-6 shadow-sm">
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"></div>

						<div className="flex-1">
							<h2 className="text-2xl font-bold text-foreground">
								{courseData.title || "Untitled Course"}
							</h2>
							{descriptionText && (
								<p className="text-muted mt-2 line-clamp-2">
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
									<span className="text-foreground font-medium">
										{courseData?.discount && courseData?.discount > 0
											? `$${courseData.discount} USD`
											: `$${courseData.price} USD`}
										{courseData?.discount && courseData?.discount > 0 && (
											<span className="ml-2 text-sm text-muted/70 line-through">
												${courseData.price} USD
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
						<h3 className="text-xl font-semibold text-foreground mb-2">
							Course Modules
						</h3>
						<p className="text-muted">
							Add modules and lessons to organize your course content
						</p>
					</div>

					{modules.length === 0 ? (
						<div className="bg-white rounded-xl border border-border p-12 text-center shadow-sm">
							<div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="w-8 h-8 text-muted/70" />
							</div>
							<h3 className="text-lg font-semibold text-foreground mb-2">
								No modules yet
							</h3>
							<p className="text-muted mb-6">
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
													className="border border-border rounded-xl"
												>
													<ModuleItem
														module={module}
														moduleIndex={moduleIndex}
														isExpanded={isExpanded}
														isLiveCourseModule={isLiveCourseModule}
														courseTeacherId={courseTeacherId || ""}
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
														teachersData={teachersData || []}
														setTeacherSearch={setTeacherSearch || (() => {})}
														teacherSearch={teacherSearch || ""}
														handleMoveLessonUp={handleMoveLessonUp}
														handleMoveLessonDown={handleMoveLessonDown}
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
