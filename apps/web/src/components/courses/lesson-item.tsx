import { Draggable } from "@hello-pangea/dnd";
import {
	ArrowDown,
	ArrowUp,
	GripVertical,
	Loader2,
	Save,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface LocalLesson {
	id: string;
	title: string;
	description?: string;
	orderIndex: number;
	contentType:
		| "VIDEO_RECORDED"
		| "VIDEO_LIVE"
		| "VIDEO_SCHEDULED"
		| "QUIZ"
		| "ASSIGNMENT"
		| "TEST"
		| "READING_MATERIAL"
		| "DISCUSSION";
	content?: string;
	attachments: string[];
	moduleId: string;
}

interface LessonItemProps {
	lesson: LocalLesson;
	lessonNumber: number;
	totalLessons: number;
	handleDeleteLesson: (id: string) => Promise<void>;
	handleUpdateLesson: (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "moduleId">,
		value: any,
	) => Promise<void>;
	handleSaveLesson: (lessonId: string) => Promise<void>;
	handleAddAttachment: (lessonId: string, filename: string) => void;
	handleRemoveAttachment: (lessonId: string, index: number) => void;
	handleNavigateToQuiz: (lessonId: string, moduleId: string) => void;
	handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
	handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
	handleContentTypeChange: (lessonId: string, value: string) => void;
	courseTitle?: string;
	moduleTitle?: string;
	createLessonMutation: any;
	updateLessonMutation: any;
}

export function LessonItem({
	lesson,
	lessonNumber,
	totalLessons,
	handleDeleteLesson,
	handleUpdateLesson,
	handleSaveLesson,
	handleAddAttachment,
	handleRemoveAttachment,
	handleNavigateToQuiz,
	handleMoveLessonUp,
	handleMoveLessonDown,
	handleContentTypeChange,
	createLessonMutation,
	updateLessonMutation,
}: LessonItemProps) {
	// Local state for form fields
	const [localTitle, setLocalTitle] = useState(lesson.title);
	const [localDescription, setLocalDescription] = useState(
		lesson.description || "",
	);
	const [localOrderIndex, setLocalOrderIndex] = useState(lesson.orderIndex);
	const [localContent, setLocalContent] = useState(lesson.content || "");
	const [hasChanges, setHasChanges] = useState(false);

	// Sync with prop changes
	useEffect(() => {
		setLocalTitle(lesson.title);
		setLocalDescription(lesson.description || "");
		setLocalOrderIndex(lesson.orderIndex);
		setLocalContent(lesson.content || "");
		setHasChanges(false);
	}, [lesson]);

	// Track changes
	const handleFieldChange = (field: string, value: any) => {
		if (field === "title") setLocalTitle(value);
		if (field === "description") setLocalDescription(value);
		if (field === "orderIndex") setLocalOrderIndex(value);
		if (field === "content") setLocalContent(value);
		setHasChanges(true);
	};

	// Save changes
	const saveLesson = async () => {
		// Update local state with changes
		if (localTitle !== lesson.title) {
			await handleUpdateLesson(lesson.id, "title", localTitle);
		}
		if (localDescription !== (lesson.description || "")) {
			await handleUpdateLesson(lesson.id, "description", localDescription);
		}
		if (localOrderIndex !== lesson.orderIndex) {
			await handleUpdateLesson(lesson.id, "orderIndex", localOrderIndex);
		}
		if (localContent !== (lesson.content || "")) {
			await handleUpdateLesson(lesson.id, "content", localContent);
		}

		// Call the save handler (will create if temp ID, update if real ID)
		await handleSaveLesson(lesson.id);
		setHasChanges(false);
	};

	const isVideo = lesson.contentType === "VIDEO_RECORDED";
	const isReading = lesson.contentType === "READING_MATERIAL";
	const isAssignment = lesson.contentType === "ASSIGNMENT";
	const isQuiz = lesson.contentType === "QUIZ";

	return (
		<Draggable draggableId={lesson.id} index={lesson.orderIndex}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="bg-white rounded-lg border border-slate-300 p-4 shadow-sm"
				>
					<div className="flex items-start gap-3">
						<div
							{...provided.dragHandleProps}
							className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
						>
							<GripVertical className="w-5 h-5" />
						</div>

						<div className="flex-1 space-y-4">
							<div className="flex items-center justify-between">
								<h5 className="font-semibold text-slate-900">
									Lesson {lessonNumber}: {lesson.title || "Untitled Lesson"}
								</h5>

								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											handleMoveLessonUp(lesson.id, lesson.moduleId)
										}
										disabled={lessonNumber === 1}
										title="Move lesson up"
									>
										<ArrowUp className="w-4 h-4" />
									</Button>

									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											handleMoveLessonDown(lesson.id, lesson.moduleId)
										}
										disabled={lessonNumber === totalLessons}
										title="Move lesson down"
									>
										<ArrowDown className="w-4 h-4" />
									</Button>

									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDeleteLesson(lesson.id)}
										className="text-red-500 hover:text-red-600 hover:bg-red-50"
										title="Delete lesson"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{/* Main Fields Row */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div>
									<Label className="text-xs font-medium mb-2 block">
										Lesson Title *
									</Label>
									<Input
										value={localTitle}
										onChange={(e) => handleFieldChange("title", e.target.value)}
										placeholder="e.g., Introduction to Components"
										className="bg-green-50 border-green-200 focus:border-green-400"
									/>
								</div>

								<div>
									<Label className="text-xs font-medium mb-2 block">
										Content Type *
									</Label>
									<Select
										value={lesson.contentType}
										onValueChange={(value) =>
											handleContentTypeChange(lesson.id, value)
										}
									>
										<SelectTrigger className="h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="VIDEO_RECORDED">Video</SelectItem>
											<SelectItem value="READING_MATERIAL">
												Reading Material
											</SelectItem>
											<SelectItem value="ASSIGNMENT">Assignment</SelectItem>
											<SelectItem value="QUIZ">Quiz</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label className="text-xs font-medium mb-2 block">
										Order Index
									</Label>
									<Input
										type="number"
										value={localOrderIndex}
										onChange={(e) =>
											handleFieldChange("orderIndex", Number(e.target.value))
										}
										className="bg-green-50 border-green-200 focus:border-green-400"
									/>
								</div>

								{isVideo && (
									<div>
										<Label className="text-xs font-medium mb-2 block">
											Duration (minutes)
										</Label>
										<Input
											type="number"
											disabled
											placeholder="Tracked with video"
											className="bg-slate-100"
										/>
									</div>
								)}
							</div>

							{/* Attachments and Video */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label className="text-xs font-medium mb-2 block">
										Attachments (PDF)
									</Label>
									<input
										type="file"
										accept="application/pdf"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												handleAddAttachment(lesson.id, file.name);
												e.target.value = "";
											}
										}}
										className="block w-full text-sm text-slate-500
											file:mr-4 file:py-2 file:px-4
											file:rounded-md file:border-0
											file:text-sm file:font-semibold
											file:bg-blue-50 file:text-blue-700
											hover:file:bg-blue-100"
									/>

									{lesson.attachments.length > 0 && (
										<div className="mt-2 space-y-1">
											{lesson.attachments.map((file: string, i: number) => (
												<div
													key={i}
													className="flex justify-between items-center bg-slate-100 px-3 py-2 rounded text-sm"
												>
													<span className="text-xs truncate">{file}</span>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleRemoveAttachment(lesson.id, i)}
														className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
													>
														×
													</Button>
												</div>
											))}
										</div>
									)}
								</div>

								{isVideo && (
									<div>
										<Label className="text-xs font-medium mb-2 block">
											Lesson Video
										</Label>
										<input
											type="file"
											accept="video/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													handleAddAttachment(lesson.id, file.name);
													e.target.value = "";
												}
											}}
											className="block w-full text-sm text-slate-500
												file:mr-4 file:py-2 file:px-4
												file:rounded-md file:border-0
												file:text-sm file:font-semibold
												file:bg-green-50 file:text-green-700
												hover:file:bg-green-100"
										/>
									</div>
								)}
							</div>

							{/* Description */}
							<div>
								<Label className="text-xs font-medium mb-2 block">
									Description
								</Label>
								<Textarea
									rows={2}
									value={localDescription}
									onChange={(e) =>
										handleFieldChange("description", e.target.value)
									}
									placeholder="Add lesson description..."
									className="bg-green-50 border-green-200 focus:border-green-400"
								/>
							</div>

							{/* Content Editor for Reading & Assignment */}
							{(isReading || isAssignment) && (
								<div>
									<Label className="text-xs font-medium mb-2 block">
										Content
									</Label>
									<RichTextEditor
										value={localContent}
										onChange={(v) => handleFieldChange("content", v)}
										height="180px"
									/>
								</div>
							)}

							{/* Save Lesson Button */}
							<div className="flex justify-end">
								<Button
									size="sm"
									onClick={saveLesson}
									disabled={
										!hasChanges ||
										createLessonMutation.isPending ||
										updateLessonMutation.isPending
									}
									className="flex items-center gap-2"
								>
									{createLessonMutation.isPending ||
									updateLessonMutation.isPending ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" />
											Saving...
										</>
									) : (
										<>
											<Save className="w-4 h-4" />
											Save Lesson
										</>
									)}
								</Button>
							</div>

							{/* Quiz Management */}
							{isQuiz && (
								<div className="p-4 border rounded-lg bg-amber-50 border-amber-200 flex justify-between items-center">
									<div>
										<h4 className="font-medium text-amber-900">
											Quiz Assessment
										</h4>
										<p className="text-xs text-amber-700 mt-1">
											Add or manage quiz questions for this lesson
										</p>
									</div>
									<Button
										size="sm"
										onClick={() =>
											handleNavigateToQuiz(lesson.id, lesson.moduleId)
										}
										className="whitespace-nowrap"
									>
										Manage Quiz
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
