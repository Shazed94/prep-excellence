// import { Draggable, Droppable } from "@hello-pangea/dnd";
// import {
// 	ChevronDown,
// 	ChevronRight,
// 	GripVertical,
// 	Loader2,
// 	Plus,
// 	Trash2,
// 	Video,
// } from "lucide-react";
// import { useCallback, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import {
// 	Collapsible,
// 	CollapsibleContent,
// 	CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { LessonItem } from "./lesson-item";

// interface LocalModule {
// 	id: string;
// 	title: string;
// 	description?: string;
// 	orderIndex: number;
// 	courseId?: string;
// }

// interface LocalLesson {
// 	id: string;
// 	title: string;
// 	description?: string;
// 	orderIndex: number;
// 	contentType:
// 		| "VIDEO_RECORDED"
// 		| "VIDEO_LIVE"
// 		| "VIDEO_SCHEDULED"
// 		| "QUIZ"
// 		| "ASSIGNMENT"
// 		| "TEST"
// 		| "READING_MATERIAL"
// 		| "DISCUSSION";
// 	content?: string;
// 	attachments: string[];
// 	moduleId: string;
// }

// interface ModuleItemProps {
// 	module: LocalModule;
// 	moduleIndex: number;
// 	isExpanded: boolean;
// 	toggleModuleExpansion: (id: string) => void;
// 	handleUpdateModule: (
// 		id: string,
// 		field: keyof Omit<LocalModule, "id" | "courseId">,
// 		value: any,
// 	) => Promise<void>;
// 	handleDeleteModule: (id: string) => Promise<void>;
// 	handleAddLesson: (moduleId: string) => void;
// 	moduleLessons: LocalLesson[];
// 	handleDeleteLesson: (id: string) => Promise<void>;
// 	handleUpdateLesson: (
// 		id: string,
// 		field: keyof Omit<LocalLesson, "id" | "moduleId">,
// 		value: any,
// 	) => Promise<void>;
// 	handleAddAttachment: (lessonId: string, filename: string) => void;
// 	handleRemoveAttachment: (lessonId: string, index: number) => void;
// 	handleNavigateToQuiz: (lessonId: string, moduleId: string) => void;
// 	handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
// 	handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
// 	handleContentTypeChange: (lessonId: string, value: string) => void;
// 	lessonRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
// 	courseTitle?: string;
// 	createLessonMutation: any;
// }

// export function ModuleItem({
// 	module,
// 	moduleIndex,
// 	isExpanded,
// 	toggleModuleExpansion,
// 	handleUpdateModule,
// 	handleDeleteModule,
// 	handleAddLesson,
// 	moduleLessons,
// 	handleDeleteLesson,
// 	handleUpdateLesson,
// 	handleAddAttachment,
// 	handleRemoveAttachment,
// 	handleNavigateToQuiz,
// 	handleMoveLessonUp,
// 	handleMoveLessonDown,
// 	handleContentTypeChange,
// 	lessonRefs,
// 	courseTitle,
// 	createLessonMutation,
// }: ModuleItemProps) {
// 	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// 	// Debounced update function
// 	const debouncedUpdate = useCallback(
// 		(field: keyof Omit<LocalModule, "id" | "courseId">, value: any) => {
// 			if (updateTimeoutRef.current) {
// 				clearTimeout(updateTimeoutRef.current);
// 			}
// 			updateTimeoutRef.current = setTimeout(() => {
// 				handleUpdateModule(module.id, field, value);
// 			}, 500);
// 		},
// 		[module.id, handleUpdateModule],
// 	);
// 	return (
// 		<Draggable draggableId={module.id} index={moduleIndex}>
// 			{(provided) => (
// 				<div
// 					ref={provided.innerRef}
// 					{...provided.draggableProps}
// 					className="bg-white rounded-xl border border-slate-300 shadow-sm"
// 				>
// 					<div className="p-4 border-b border-slate-200">
// 						<div className="flex items-start gap-3">
// 							<div
// 								{...provided.dragHandleProps}
// 								className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
// 							>
// 								<GripVertical className="w-5 h-5" />
// 							</div>

// 							<div className="flex-1">
// 								<div className="flex items-center justify-between mb-3">
// 									<div className="flex items-center gap-3">
// 										<Collapsible
// 											open={isExpanded}
// 											onOpenChange={() => toggleModuleExpansion(module.id)}
// 										>
// 											<CollapsibleTrigger asChild>
// 												<Button
// 													variant="ghost"
// 													size="sm"
// 													className="p-1 h-8 w-8"
// 												>
// 													{isExpanded ? (
// 														<ChevronDown className="w-4 h-4" />
// 													) : (
// 														<ChevronRight className="w-4 h-4" />
// 													)}
// 												</Button>
// 											</CollapsibleTrigger>
// 										</Collapsible>

// 										<div>
// 											<h3 className="text-lg font-semibold text-slate-900">
// 												Module {moduleIndex + 1}:{" "}
// 												{module.title || "Untitled Module"}
// 											</h3>
// 											<span className="text-sm text-slate-600 flex items-center gap-1 mt-1">
// 												<Video className="w-3 h-3" />
// 												{moduleLessons.length}{" "}
// 												{moduleLessons.length === 1 ? "lesson" : "lessons"}
// 											</span>
// 										</div>
// 									</div>
// 								</div>

// 								<div className="space-y-2 mt-3">
// 									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-2 block">
// 												Module Title
// 											</Label>
// 											<Input
// 												placeholder="e.g., Introduction to React"
// 												value={module.title}
// 												onChange={(e) =>
// 													debouncedUpdate("title", e.target.value)
// 												}
// 												className="bg-blue-50 border-blue-200 focus:border-blue-400"
// 											/>
// 										</div>

// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-2 block">
// 												Order Index
// 											</Label>
// 											<Input
// 												type="number"
// 												min={0}
// 												value={module.orderIndex}
// 												onChange={(e) =>
// 													debouncedUpdate("orderIndex", Number(e.target.value))
// 												}
// 												className="bg-blue-50 border-blue-200 focus:border-blue-400"
// 											/>
// 										</div>
// 									</div>

// 									<div>
// 										<Label className="text-xs font-medium text-slate-700 mb-2 block">
// 											Description (optional)
// 										</Label>
// 										<Textarea
// 											placeholder="Module description..."
// 											value={module.description || ""}
// 											onChange={(e) =>
// 												debouncedUpdate("description", e.target.value)
// 											}
// 											rows={2}
// 											className="bg-blue-50 border-blue-200 focus:border-blue-400"
// 										/>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>

// 					<div className="p-3 flex justify-between items-center bg-slate-50 border-t">
// 						<Button
// 							variant="outline"
// 							size="sm"
// 							onClick={() => handleAddLesson(module.id)}
// 							className="flex items-center gap-2"
// 							disabled={createLessonMutation.isPending}
// 						>
// 							{createLessonMutation.isPending ? (
// 								<>
// 									<Loader2 className="w-4 h-4 animate-spin" />
// 									Adding...
// 								</>
// 							) : (
// 								<>
// 									<Plus className="w-4 h-4" />
// 									Add Lesson
// 								</>
// 							)}
// 						</Button>

// 						<Button
// 							variant="ghost"
// 							size="sm"
// 							onClick={() => handleDeleteModule(module.id)}
// 							className="text-red-500 hover:text-red-600 hover:bg-red-50"
// 						>
// 							<Trash2 className="w-4 h-4" />
// 						</Button>
// 					</div>

// 					<Collapsible open={isExpanded}>
// 						<CollapsibleContent>
// 							<div className="p-4 bg-slate-50 border-t border-dashed border-slate-300">
// 								{moduleLessons.length === 0 ? (
// 									<div className="text-center py-8">
// 										<div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
// 											<Video className="w-6 h-6 text-slate-400" />
// 										</div>
// 										<p className="text-sm text-slate-500">
// 											No lessons yet. Add one above.
// 										</p>
// 									</div>
// 								) : (
// 									<Droppable droppableId={module.id} type="LESSONS">
// 										{(provided) => (
// 											<div
// 												{...provided.droppableProps}
// 												ref={provided.innerRef}
// 												className="space-y-4"
// 											>
// 												{moduleLessons.map((lesson, lessonIndex) => (
// 													<div
// 														key={lesson.id}
// 														ref={(el) => {
// 															if (el) lessonRefs.current[lesson.id] = el;
// 														}}
// 														className="border-2 border-transparent rounded-lg"
// 													>
// 														<LessonItem
// 															lesson={lesson}
// 															lessonNumber={lessonIndex + 1}
// 															totalLessons={moduleLessons.length}
// 															handleDeleteLesson={handleDeleteLesson}
// 															handleUpdateLesson={handleUpdateLesson}
// 															handleAddAttachment={handleAddAttachment}
// 															handleRemoveAttachment={handleRemoveAttachment}
// 															handleNavigateToQuiz={handleNavigateToQuiz}
// 															handleMoveLessonUp={handleMoveLessonUp}
// 															handleMoveLessonDown={handleMoveLessonDown}
// 															handleContentTypeChange={handleContentTypeChange}
// 															courseTitle={courseTitle}
// 															moduleTitle={module.title}
// 														/>
// 													</div>
// 												))}
// 												{provided.placeholder}
// 												<div className="flex justify-center py-2">
// 													<Button
// 														variant="outline"
// 														size="sm"
// 														onClick={() => handleAddLesson(module.id)}
// 														className="flex items-center gap-2"
// 														disabled={createLessonMutation.isPending}
// 													>
// 														{createLessonMutation.isPending ? (
// 															<>
// 																<Loader2 className="w-4 h-4 animate-spin" />
// 																Adding...
// 															</>
// 														) : (
// 															<>
// 																<Plus className="w-4 h-4" />
// 																Add Another Lesson
// 															</>
// 														)}
// 													</Button>
// 												</div>
// 											</div>
// 										)}
// 									</Droppable>
// 								)}
// 							</div>
// 						</CollapsibleContent>
// 					</Collapsible>
// 				</div>
// 			)}
// 		</Draggable>
// 	);
// }

// export type { LocalModule, LocalLesson };
