import { Draggable, Droppable } from "@hello-pangea/dnd";
import {
	ChevronDown,
	ChevronRight,
	GripVertical,
	Loader2,
	Plus,
	Save,
	Trash2,
	Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import { LessonItem } from "./lesson-item";

interface LocalModule {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	courseId?: string;
	teacherId?: string;
}

interface LocalLesson {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	isPublished: boolean;
	lessonType: "LIVE_CLASS" | "READING_MATERIAL" | "ASSIGNMENT" | "EXAM";
	content?: string;
	attachments: string[];
	moduleId: string;
	contentId?: string;
}

interface ModuleItemProps {
	module: LocalModule;
	moduleIndex: number;
	isExpanded: boolean;
	isLiveCourseModule?: boolean;
	teachersData: any[];
	setTeacherSearch: (search: string) => void;
	teacherSearch: string;
	toggleModuleExpansion: (id: string) => void;
	handleUpdateModule: (
		id: string,
		field: keyof Omit<LocalModule, "id" | "courseId">,
		value: any,
	) => Promise<void>;
	handleSaveModule: (moduleId: string) => Promise<void>;
	handleDeleteModule: (id: string) => Promise<void>;
	handleAddLesson: (moduleId: string) => void;
	moduleLessons: LocalLesson[];
	handleDeleteLesson: (id: string) => Promise<void>;
	handleUpdateLesson: (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "moduleId">,
		value: any,
	) => Promise<void>;
	handleSaveLesson: (lessonId: string) => Promise<void>;
	handleAddAttachment: (lessonId: string, filename: string) => void;
	handleRemoveAttachment: (lessonId: string, index: number) => void;
	handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
	handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
	handleLessonTypeChange: (lessonId: string, value: string) => void;
	lessonRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
	courseTitle?: string;
	createModuleMutation: any;
	createLessonMutation: any;
	updateModuleMutation: any;
	updateLessonMutation: any;
	courseId: string;
}

export function ModuleItem({
	module,
	moduleIndex,
	isExpanded,
	isLiveCourseModule,
	teachersData,
	setTeacherSearch,
	teacherSearch,
	toggleModuleExpansion,
	handleUpdateModule,
	handleSaveModule,
	handleDeleteModule,
	handleAddLesson,
	moduleLessons,
	handleDeleteLesson,
	handleUpdateLesson,
	handleSaveLesson,
	handleAddAttachment,
	handleRemoveAttachment,
	handleMoveLessonUp,
	handleMoveLessonDown,
	handleLessonTypeChange,
	lessonRefs,
	courseTitle,
	courseId,
	createModuleMutation,
	createLessonMutation,
	updateModuleMutation,
	updateLessonMutation,
}: ModuleItemProps) {
	// Local state for form fields
	const [localTitle, setLocalTitle] = useState(module.title);
	const [localDescription, setLocalDescription] = useState(
		module.description || "",
	);
	const [localOrderIndex, setLocalOrderIndex] = useState(module.orderIndex);
	const [localTeacherId, setLocalTeacherId] = useState(
		module.teacherId,
	);
	const [_hasChanges, setHasChanges] = useState(false);

	// Sync with prop changes (e.g., when module data reloads)
	useEffect(() => {
		setLocalTitle(module.title);
		setLocalDescription(module.description || "");
		setLocalOrderIndex(module.orderIndex);
		setLocalTeacherId(module.teacherId);
		setHasChanges(false);
	}, [module]);

	// Track changes
	const handleFieldChange = (
		field: "title" | "description" | "orderIndex" | "teacherId",
		value: any,
	) => {
		if (field === "title") setLocalTitle(value);
		if (field === "description") setLocalDescription(value);
		if (field === "orderIndex") setLocalOrderIndex(value);
		if (field === "teacherId") setLocalTeacherId(value);
		setHasChanges(true);
	};

	// Save changes
	const saveModule = async () => {
		// Handle temp (unsaved) modules directly — create in API with latest form data
		if (module.id.startsWith("temp-")) {
			if (!localTeacherId) {
				toast.error("Please select a teacher before saving the module");
				return;
			}
			try {
				await createModuleMutation.mutateAsync({
					courseId,
					data: {
						title: localTitle,
						description: localDescription,
						orderIndex: localOrderIndex,
						teacherId: localTeacherId,
						unlockAtPercent: 0,
					},
				});
				// Let parent clean up the temp module from local state
				await handleSaveModule(module.id);
				setHasChanges(false);
			} catch {
				// Error handled by mutation's onError
			}
			return;
		}

		// For saved modules, update each changed field via the API
		if (localTitle !== module.title) {
			await handleUpdateModule(module.id, "title", localTitle);
		}
		if (localDescription !== (module.description || "")) {
			await handleUpdateModule(module.id, "description", localDescription);
		}
		if (localOrderIndex !== module.orderIndex) {
			await handleUpdateModule(module.id, "orderIndex", localOrderIndex);
		}
		if (localTeacherId !== module.teacherId) {
			await handleUpdateModule(module.id, "teacherId", localTeacherId);
		}

		// Call the save handler (will refetch if real ID)
		await handleSaveModule(module.id);
		setHasChanges(false);
	};

	return (
		<Draggable draggableId={module.id} index={moduleIndex}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="bg-white rounded-xl border border-slate-300 shadow-sm"
				>
					<div className="p-4 border-b border-slate-200">
						<div className="flex items-start gap-3">
							<div
								{...provided.dragHandleProps}
								className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
							>
								<GripVertical className="w-5 h-5" />
							</div>

							<div className="flex-1">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-3">
										<Collapsible
											open={isExpanded}
											onOpenChange={() => toggleModuleExpansion(module.id)}
										>
											<CollapsibleTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="p-1 h-8 w-8"
												>
													{isExpanded ? (
														<ChevronDown className="w-4 h-4" />
													) : (
														<ChevronRight className="w-4 h-4" />
													)}
												</Button>
											</CollapsibleTrigger>
										</Collapsible>

										<div>
											<h3 className="text-lg font-semibold text-slate-900">
												Module {moduleIndex + 1}:{" "}
												{module.title || "Untitled Module"}
											</h3>
											<span className="text-sm text-slate-600 flex items-center gap-1 mt-1">
												<Video className="w-3 h-3" />
												{moduleLessons.length}{" "}
												{moduleLessons.length === 1 ? "lesson" : "lessons"}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-2 mt-3">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div>
											<Label className="text-xs font-medium text-slate-700 mb-2 block">
												Module Title
											</Label>
											<Input
												placeholder="e.g., Introduction to React"
												value={localTitle}
												onChange={(e) =>
													handleFieldChange("title", e.target.value)
												}
												className="bg-blue-50 border-blue-200 focus:border-blue-400"
											/>
										</div>

										<div>
											<Label className="text-xs font-medium text-slate-700 mb-2 block">
												Order Index
											</Label>
											<Input
												type="number"
												min={0}
												value={localOrderIndex}
												onChange={(e) =>
													handleFieldChange(
														"orderIndex",
														Number(e.target.value),
													)
												}
												className="bg-blue-50 border-blue-200 focus:border-blue-400"
											/>
										</div>
									</div>

									<div>
										<Label className="text-xs font-medium text-slate-700 mb-2 block">
											Description (optional)
										</Label>
										<Textarea
											placeholder="Module description..."
											value={localDescription}
											onChange={(e) =>
												handleFieldChange("description", e.target.value)
											}
											rows={2}
											className="bg-blue-50 border-blue-200 focus:border-blue-400"
										/>
									</div>

									{/* Teacher Selection */}
									<div>
										<Label className="text-xs font-medium text-slate-700 mb-2 block">
											Module Teacher
										</Label>
										<SearchableSelect
											value={module.teacherId || ""}
											onValueChange={(val) =>
												handleUpdateModule(
													module.id,
													"teacherId" as any,
													val,
												)
											}
											options={(() => {
												if (!teachersData) return [];
												const data = teachersData?.data || teachersData;
												return Array.isArray(data)
													? data.map((inst: any) => ({
															value: inst.id || inst._id,
															label: `${inst.name}`,
															prefix: (
																<>
																	<img
																		src={inst.image || ""}
																		alt={inst.name}
																		className="w-6 h-6 rounded-full"
																	/>
																</>
															),
														}))
													: [];
											})()}
											onSearchChange={setTeacherSearch}
											emptyText="No teacher found."
											placeholder="Select module teacher..."
											searchPlaceholder="Search teachers..."
										/>
									</div>

									{/* Save Module Button */}
									<div className="flex justify-end">
										<Button
											size="sm"
											onClick={saveModule}
											disabled={
												createModuleMutation.isPending ||
												updateModuleMutation.isPending
											}
											className="flex items-center gap-2"
										>
											{createModuleMutation.isPending ||
											updateModuleMutation.isPending ? (
												<>
													<Loader2 className="w-4 h-4 animate-spin" />
													Saving...
												</>
											) : (
												<>
													<Save className="w-4 h-4" />
													Save Module
												</>
											)}
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="p-3 flex justify-between items-center bg-slate-50 border-t">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleAddLesson(module.id)}
							className="flex items-center gap-2"
							disabled={createLessonMutation.isPending}
						>
							{createLessonMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Adding...
								</>
							) : (
								<>
									<Plus className="w-4 h-4" />
									Add Lesson
								</>
							)}
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => handleDeleteModule(module.id)}
							className="text-red-500 hover:text-red-600 hover:bg-red-50"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>

					<Collapsible open={isExpanded}>
						<CollapsibleContent>
							<div className="p-4 bg-slate-50 border-t border-dashed border-slate-300">
								{moduleLessons.length === 0 ? (
									<div className="text-center py-8">
										<div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
											<Video className="w-6 h-6 text-slate-400" />
										</div>
										<p className="text-sm text-slate-500">
											No lessons yet. Add one above.
										</p>
									</div>
								) : (
									<Droppable droppableId={module.id} type="LESSONS">
										{(provided) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className="space-y-4"
											>
												{moduleLessons.map((lesson, lessonIndex) => (
													<div
														key={lesson.id}
														ref={(el) => {
															if (el) lessonRefs.current[lesson.id] = el;
														}}
														className="border-2 border-transparent rounded-lg"
													>
														<LessonItem
															lesson={lesson}
															lessonNumber={lessonIndex + 1}
															totalLessons={moduleLessons.length}
															isLiveCourseModule={isLiveCourseModule}
															handleDeleteLesson={handleDeleteLesson}
															handleUpdateLesson={handleUpdateLesson}
															handleSaveLesson={handleSaveLesson}
															handleAddAttachment={handleAddAttachment}
															handleRemoveAttachment={handleRemoveAttachment}
															handleMoveLessonUp={handleMoveLessonUp}
															handleMoveLessonDown={handleMoveLessonDown}
															handleLessonTypeChange={handleLessonTypeChange}
															courseTitle={courseTitle}
															moduleTitle={module.title}
															createLessonMutation={createLessonMutation}
															updateLessonMutation={updateLessonMutation}
														/>
													</div>
												))}
												{provided.placeholder}
												<div className="flex justify-center py-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleAddLesson(module.id)}
														className="flex items-center gap-2"
														disabled={createLessonMutation.isPending}
													>
														{createLessonMutation.isPending ? (
															<>
																<Loader2 className="w-4 h-4 animate-spin" />
																Adding...
															</>
														) : (
															<>
																<Plus className="w-4 h-4" />
																Add Another Lesson
															</>
														)}
													</Button>
												</div>
											</div>
										)}
									</Droppable>
								)}
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>
			)}
		</Draggable>
	);
}

export type { LocalModule, LocalLesson };
