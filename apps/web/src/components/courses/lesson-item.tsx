import { Draggable } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createLMSLessonSchema,
	type TcreateLMSLessonSchema,
} from "@prepexcellence/shared-validators";
import { useNavigate } from "@tanstack/react-router";
import {
	ArrowDown,
	ArrowUp,
	GripVertical,
	Loader2,
	Save,
	Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
export type LocalLesson = Omit<TcreateLMSLessonSchema, "moduleId"> & {
	id: string;
	courseModuleId: string;
	contentId?: string;
};

interface LessonItemProps {
	lesson: LocalLesson;
	lessonNumber: number;
	totalLessons: number;
	isLiveCourseModule?: boolean;
	handleDeleteLesson: (id: string) => Promise<void>;
	handleUpdateLesson: (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "courseModuleId">,
		value: any,
	) => Promise<void>;
	handleSaveLesson: (lessonId: string) => Promise<void>;
	handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
	handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
	courseTitle?: string;
	moduleTitle?: string;
	createLessonMutation: any;
	updateLessonMutation: any;
}

export function LessonItem({
	lesson,
	lessonNumber,
	totalLessons,
	isLiveCourseModule,
	handleDeleteLesson,
	handleUpdateLesson,
	handleSaveLesson,
	handleMoveLessonUp,
	handleMoveLessonDown,
	courseTitle,
	moduleTitle,
	createLessonMutation,
	updateLessonMutation,
}: LessonItemProps) {
	const navigate = useNavigate();

	// Initialize form with React Hook Form and Zod
	const form = useForm<TcreateLMSLessonSchema>({
		resolver: zodResolver(createLMSLessonSchema) as any,
		defaultValues: {
			title: lesson.title,
			description: lesson.description || "",
			orderIndex: lesson.orderIndex,
			isPublished: lesson.isPublished ?? false,
			content: lesson.content || "",
			lessonType: lesson.lessonType || "EXAM",
		},
	});

	// Sync form when lesson prop changes
	useEffect(() => {
		form.reset({
			title: lesson.title,
			description: lesson.description || "",
			orderIndex: lesson.orderIndex,
			isPublished: lesson.isPublished ?? false,
			content: lesson.content || "",
			lessonType: lesson.lessonType || "EXAM",
		});
	}, [lesson, form]);

	// Watch lessonType for conditional UI rendering
	const lessonType = form.watch("lessonType");

	// Save form data
	const onSubmit = async (values: TcreateLMSLessonSchema) => {
		try {
			// Update each field that changed
			if (values.title !== lesson.title) {
				await handleUpdateLesson(lesson.id, "title", values.title);
			}
			if (values.description !== (lesson.description || "")) {
				await handleUpdateLesson(lesson.id, "description", values.description);
			}
			if (values.orderIndex !== lesson.orderIndex) {
				await handleUpdateLesson(lesson.id, "orderIndex", values.orderIndex);
			}
			if (values.isPublished !== lesson.isPublished) {
				await handleUpdateLesson(lesson.id, "isPublished", values.isPublished);
			}
			if (values.lessonType !== lesson.lessonType) {
				await handleUpdateLesson(lesson.id, "lessonType", values.lessonType);
			}
			if (values.content !== (lesson.content || "")) {
				await handleUpdateLesson(lesson.id, "content", values.content);
			}

			// Call the save handler (will create if temp ID, update if real ID)
			await handleSaveLesson(lesson.id);
			form.reset(values);
		} catch (error) {
			console.error("Failed to save lesson:", error);
		}
	};

	// Navigate to exam creation/management
	const handleNavigateToExam = () => {
		const isTempId = lesson.id.startsWith("temp-");

		if (isTempId || form.formState.isDirty) {
			alert("Please save the lesson before managing the exam.");
			return;
		}

		navigate({
			to: "/dashboard/coaching-management/create-quiz" as const,
			search: {
				moduleId: lesson.courseModuleId,
				lessonId: lesson.id,
				courseTitle: courseTitle || undefined,
				moduleTitle: moduleTitle || undefined,
				lessonTitle: form.getValues("title") || undefined,
			},
		});
	};

	// Navigate to reading material creation/management
	const handleNavigateToReadingMaterial = () => {
		const isTempId = lesson.id.startsWith("temp-");
		const isModuleTempId = lesson.courseModuleId?.startsWith("temp-");

		if (isTempId || isModuleTempId || form.formState.isDirty) {
			alert(
				"Please save the lesson (and its module) before managing reading material.",
			);
			return;
		}

		navigate({
			to: "/dashboard/coaching-management/create-reading-material" as const,
			search: {
				moduleId: lesson.courseModuleId,
				lessonId: lesson.id,
				courseTitle: courseTitle || undefined,
				moduleTitle: moduleTitle || undefined,
				lessonTitle: form.getValues("title") || undefined,
			},
		});
	};

	
		const handleNavigateToAssignments = () => {
		const isTempId = lesson.id.startsWith("temp-");
		const isModuleTempId = lesson.courseModuleId?.startsWith("temp-");

		if (isTempId || isModuleTempId || form.formState.isDirty) {
			alert(
				"Please save the lesson (and its module) before managing reading material.",
			);
			return;
		}

		navigate({
			to: "/dashboard/coaching-management/create-assignment" as const,
			search: {
				moduleId: lesson.courseModuleId,
				lessonId: lesson.id,
				courseTitle: courseTitle || undefined,
				moduleTitle: moduleTitle || undefined,
				lessonTitle: form.getValues("title") || undefined,
			},
		});
	};
	const isLiveClass = lessonType === "LIVE_CLASS";
	const isReading = lessonType === "READING_MATERIAL";
	const isAssignment = lessonType === "ASSIGNMENT";
	const isExam = lessonType === "EXAM";
	const isSaving =
		createLessonMutation.isPending || updateLessonMutation.isPending;

	return (
		<Draggable draggableId={lesson.id} index={lesson.orderIndex}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					className="bg-white rounded-lg border border-border p-4 shadow-sm"
				>
					<div className="flex items-start gap-3">
						<div
							{...provided.dragHandleProps}
							className="cursor-move text-border hover:text-muted mt-1"
						>
							<GripVertical className="w-5 h-5" />
						</div>

						<div className="flex-1 space-y-4">
							<div className="flex items-center justify-between">
								<h5 className="font-semibold text-foreground">
									Lesson {lessonNumber}:{" "}
									{form.watch("title") || "Untitled Lesson"}
								</h5>

								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="sm"
										onClick={() =>
											handleMoveLessonUp(lesson.id, lesson.courseModuleId)
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
											handleMoveLessonDown(lesson.id, lesson.courseModuleId)
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

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-4"
								>
									{/* Main Fields Row */}
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium">
														Lesson Title *
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="e.g., Introduction to Components"
															className="bg-green-50 border-green-200 focus:border-green-400"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{isLiveCourseModule ? (
											<FormField
												control={form.control}
												name="lessonType"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs font-medium">
															Lesson Type *
														</FormLabel>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
																key={lesson.id} // Ensure the Select resets when lesson changes
															>
																<SelectTrigger className="h-10">
																	<SelectValue placeholder="Select Lesson type" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="LIVE_CLASS">
																		Live Class
																	</SelectItem>
																	<SelectItem value="ASSIGNMENT">
																		Assignment
																	</SelectItem>
																	<SelectItem value="READING_MATERIAL">
																		Reading Material
																	</SelectItem>
																	<SelectItem value="EXAM">Exam</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										) : (
											<FormField
												control={form.control}
												name="lessonType"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs font-medium">
															Lesson Type *
														</FormLabel>
														<FormControl>
															<Select
																value={field.value}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="h-10">
																	<SelectValue placeholder="Select Lesson type" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="LIVE_CLASS">
																		Live Class
																	</SelectItem>
																	<SelectItem value="READING_MATERIAL">
																		Reading Material
																	</SelectItem>
																	<SelectItem value="ASSIGNMENT">
																		Assignment
																	</SelectItem>
																	<SelectItem value="EXAM">Exam</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}

										<FormField
											control={form.control}
											name="orderIndex"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-medium">
														Order Index
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															{...field}
															onChange={(e) =>
																field.onChange(Number(e.target.value))
															}
															className="bg-green-50 border-green-200 focus:border-green-400"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{isLiveClass && (
											<FormItem>
												<FormLabel className="text-xs font-medium">
													Duration (minutes)
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														disabled
														placeholder="Set during scheduling"
														className="bg-muted/10"
													/>
												</FormControl>
											</FormItem>
										)}
									</div>

									{/* Content Editor for Reading & Assignment */}
									{isAssignment && (
											<div className="p-4 border rounded-lg bg-amber-50 border-amber-200 flex justify-between items-center">
											<div>
												<h4 className="font-medium text-amber-900">
													Assignment
												</h4>
												<p className="text-xs text-amber-700 mt-1">
													{form.formState.isDirty ||
													lesson.id.startsWith("temp-")
														? "Save the lesson first to manage assignments."
														: "Add or manage assignments for this lesson"}
												</p>
											</div>
											<Button
												type="button"
												size="sm"
												onClick={handleNavigateToAssignments}
												disabled={
													form.formState.isDirty ||
													lesson.id.startsWith("temp-")
												}
												className="whitespace-nowrap"
											>
												Manage Assignments
											</Button>
										</div>
									)}

									{/* Save Lesson Button */}
									<div className="flex justify-end">
										<Button
											type="submit"
											size="sm"
											disabled={!form.formState.isDirty || isSaving}
											className="flex items-center gap-2"
										>
											{isSaving ? (
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

									{/* Exam Management */}
									{isExam && (
										<div className="p-4 border rounded-lg bg-amber-50 border-amber-200 flex justify-between items-center">
											<div>
												<h4 className="font-medium text-amber-900">
													Exam Assessment
												</h4>
												<p className="text-xs text-amber-700 mt-1">
													{form.formState.isDirty ||
													lesson.id.startsWith("temp-")
														? "Save the lesson first to manage exam questions"
														: "Add or manage exam questions for this lesson"}
												</p>
											</div>
											<Button
												type="button"
												size="sm"
												onClick={handleNavigateToExam}
												disabled={
													form.formState.isDirty ||
													lesson.id.startsWith("temp-")
												}
												className="whitespace-nowrap"
											>
												Manage Exam
											</Button>
										</div>
									)}

									{isReading && (
										<div className="p-4 border rounded-lg bg-amber-50 border-amber-200 flex justify-between items-center">
											<div>
												<h4 className="font-medium text-amber-900">
													Reading Material
												</h4>
												<p className="text-xs text-amber-700 mt-1">
													{form.formState.isDirty ||
													lesson.id.startsWith("temp-")
														? "Save the lesson first to manage reading material"
														: "Add or manage reading material for this lesson"}
												</p>
											</div>
											<Button
												type="button"
												size="sm"
												onClick={handleNavigateToReadingMaterial}
												disabled={
													form.formState.isDirty ||
													lesson.id.startsWith("temp-")
												}
												className="whitespace-nowrap"
											>
												Manage Reading Material
											</Button>
										</div>
									)}
								</form>
							</Form>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
