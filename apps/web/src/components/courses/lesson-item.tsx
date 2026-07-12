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
	BookOpen,
	Brain,
	FileText,
	GripVertical,
	Loader2,
	Save,
	Trash2,
	Video,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
export type LocalLesson = Omit<TcreateLMSLessonSchema, "moduleId"> & {
	id: string;
	courseModuleId: string;
	contentId?: string;
	assignment?: { id: string; title: string; totalPoints: number } | null;
	exam?: { id: string; title: string; passingScore: number } | null;
	lessonAttachments?: {
		id: string;
		title: string;
		fileUrl?: string;
		fileType?: string;
	}[];
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
	courseId?: string;
	createLessonMutation: any;
	updateLessonMutation: any;
	onOpenAssignmentDialog?: (
		lessonId: string,
		moduleTitle?: string,
		lessonTitle?: string,
	) => void;
	onOpenReadingDialog?: (
		lessonId: string,
		moduleTitle?: string,
		lessonTitle?: string,
	) => void;
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
	courseId,
	createLessonMutation,
	updateLessonMutation,
	onOpenAssignmentDialog,
	onOpenReadingDialog,
}: LessonItemProps) {
	const navigate = useNavigate();

	const form = useForm<TcreateLMSLessonSchema>({
		resolver: zodResolver(createLMSLessonSchema as any),
		defaultValues: {
			title: lesson.title,
			description: lesson.description || "",
			orderIndex: lesson.orderIndex,
			isPublished: lesson.isPublished ?? false,
			content: lesson.content || "",
			lessonType: lesson.lessonType || "EXAM",
		},
	});

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

	const lessonType = form.watch("lessonType");
	const isPublished = form.watch("isPublished");

	const onSubmit = async (values: TcreateLMSLessonSchema) => {
		try {
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

			await handleSaveLesson(lesson.id);
			form.reset(values);
		} catch (error) {
			console.error("Failed to save lesson:", error);
		}
	};

	const isSaved = !lesson.id.startsWith("temp-") && !form.formState.isDirty;

	const handleNavigateToExam = () => {
		const isTempId = lesson.id.startsWith("temp-");

		if (isTempId || form.formState.isDirty) {
			alert("Please save the lesson before managing the exam.");
			return;
		}

		// Preserve course creation state in URL so it can be restored on navigation back
		if (courseId) {
			window.history.replaceState(
				window.history.state,
				"",
				`/dashboard/coaching-management/create?courseId=${courseId}&tab=modules`,
			);
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

	const handleOpenReadingDialog = () => {
		const isTempId = lesson.id.startsWith("temp-");
		const isModuleTempId = lesson.courseModuleId?.startsWith("temp-");

		if (isTempId || isModuleTempId || form.formState.isDirty) {
			alert(
				"Please save the lesson (and its module) before managing reading material.",
			);
			return;
		}

		onOpenReadingDialog?.(
			lesson.id,
			moduleTitle,
			form.getValues("title") || undefined,
		);
	};

	const handleOpenAssignmentDialog = () => {
		const isTempId = lesson.id.startsWith("temp-");
		const isModuleTempId = lesson.courseModuleId?.startsWith("temp-");

		if (isTempId || isModuleTempId || form.formState.isDirty) {
			alert(
				"Please save the lesson (and its module) before managing assignment.",
			);
			return;
		}

		onOpenAssignmentDialog?.(
			lesson.id,
			moduleTitle,
			form.getValues("title") || undefined,
		);
	};

	// const handleNavigateToLiveClass = () => {
	// 	const isTempId = lesson.id.startsWith("temp-");
	// 	const isModuleTempId = lesson.courseModuleId?.startsWith("temp-");

	// 	if (isTempId || isModuleTempId || form.formState.isDirty) {
	// 		alert(
	// 			"Please save the lesson (and its module) before managing the live class.",
	// 		);
	// 		return;
	// 	}

	// 	// Preserve course creation state in URL so it can be restored on navigation back
	// 	if (courseId) {
	// 		window.history.replaceState(
	// 			window.history.state,
	// 			"",
	// 			`/dashboard/coaching-management/create?courseId=${courseId}&tab=modules`,
	// 		);
	// 	}

	// 	navigate({
	// 		to: "/dashboard/coaching-management/create-live-class" as const,
	// 		search: {
	// 			lessonId: lesson.id,
	// 			courseTitle: courseTitle || undefined,
	// 			moduleTitle: moduleTitle || undefined,
	// 			lessonTitle: form.getValues("title") || undefined,
	// 		},
	// 	});
	// };

	// const isLiveClass = lessonType === "LIVE_CLASS";
	const isReading = lessonType === "READING_MATERIAL";
	const isAssignment = lessonType === "ASSIGNMENT";
	const isExam = lessonType === "EXAM";
	const isSaving =
		createLessonMutation.isPending || updateLessonMutation.isPending;

	const cardStyle = (type: string) => {
		switch (type) {
			case "LIVE_CLASS":
				return "p-4 border rounded-lg bg-orange-50 border-orange-200";
			case "ASSIGNMENT":
				return "p-4 border rounded-lg bg-blue-50 border-blue-200";
			case "READING_MATERIAL":
				return "p-4 border rounded-lg bg-green-50 border-green-200";
			case "EXAM":
				return "p-4 border rounded-lg bg-purple-50 border-purple-200";
			default:
				return "p-4 border rounded-lg bg-amber-50 border-amber-200";
		}
	};

	const textColor = (type: string) => {
		switch (type) {
			case "LIVE_CLASS":
				return "text-orange-900";
			case "ASSIGNMENT":
				return "text-blue-900";
			case "READING_MATERIAL":
				return "text-green-900";
			case "EXAM":
				return "text-purple-900";
			default:
				return "text-amber-900";
		}
	};

	const subTextColor = (type: string) => {
		switch (type) {
			case "LIVE_CLASS":
				return "text-orange-700";
			case "ASSIGNMENT":
				return "text-blue-700";
			case "READING_MATERIAL":
				return "text-green-700";
			case "EXAM":
				return "text-purple-700";
			default:
				return "text-amber-700";
		}
	};

	const typeIcon = (type: string) => {
		switch (type) {
			case "LIVE_CLASS":
				return <Video className="w-5 h-5" />;
			case "ASSIGNMENT":
				return <FileText className="w-5 h-5" />;
			case "READING_MATERIAL":
				return <BookOpen className="w-5 h-5" />;
			case "EXAM":
				return <Brain className="w-5 h-5" />;
			default:
				return null;
		}
	};

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

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
																key={lesson.id}
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
																	<SelectItem
																		value={
																			isLiveCourseModule
																				? "LIVE_CLASS"
																				: "VIDEO_CONTENT"
																		}
																	>
																		{isLiveCourseModule
																			? "Live Class"
																			: "Video Content"}
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

										{isPublished && (
											<FormItem>
												<FormLabel className="text-xs font-medium">
													Status
												</FormLabel>
												<div className="flex items-center h-10 px-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
													Published
												</div>
											</FormItem>
										)}
									</div>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-xs font-medium">
													Description (optional)
												</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Lesson description..."
														rows={2}
														className="bg-green-50 border-green-200 focus:border-green-400"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Assignment Management */}
									{isAssignment && (
										<div
											className={`${cardStyle("ASSIGNMENT")} flex justify-between items-center`}
										>
											<div className="flex items-start gap-3">
												<div className="mt-0.5 text-blue-600">
													{typeIcon("ASSIGNMENT")}
												</div>
												<div>
													<div className="flex items-center gap-2">
														<h4
															className={`font-medium ${textColor("ASSIGNMENT")}`}
														>
															Assignment
														</h4>
														{lesson.assignment && (
															<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
																{lesson.assignment.totalPoints} pts
															</span>
														)}
													</div>
													<p
														className={`text-xs ${subTextColor("ASSIGNMENT")} mt-1`}
													>
														{!isSaved
															? "Save the lesson first to manage assignments."
															: lesson.assignment
																? "Assignment already created. Click to edit."
																: "No assignment yet. Click to create one."}
													</p>
												</div>
											</div>
											<Button
												type="button"
												size="sm"
												onClick={handleOpenAssignmentDialog}
												disabled={!isSaved}
												className="whitespace-nowrap"
											>
												{lesson.assignment
													? "Edit Assignment"
													: "Create Assignment"}
											</Button>
										</div>
									)}

									{/* Reading Material Management */}
									{isReading && (
										<div
											className={`${cardStyle("READING_MATERIAL")} flex justify-between items-center`}
										>
											<div className="flex items-start gap-3">
												<div className="mt-0.5 text-green-600">
													{typeIcon("READING_MATERIAL")}
												</div>
												<div>
													<div className="flex items-center gap-2">
														<h4
															className={`font-medium ${textColor("READING_MATERIAL")}`}
														>
															Reading Material
														</h4>
														{lesson.lessonAttachments &&
															lesson.lessonAttachments.length > 0 && (
																<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
																	{lesson.lessonAttachments.length} file
																	{lesson.lessonAttachments.length !== 1
																		? "s"
																		: ""}
																</span>
															)}
													</div>
													<p
														className={`text-xs ${subTextColor("READING_MATERIAL")} mt-1`}
													>
														{!isSaved
															? "Save the lesson first to manage reading material"
															: lesson.lessonAttachments &&
																	lesson.lessonAttachments.length > 0
																? "Files already uploaded. Click to manage."
																: "No files yet. Click to upload."}
													</p>
												</div>
											</div>
											<Button
												type="button"
												size="sm"
												onClick={handleOpenReadingDialog}
												disabled={!isSaved}
												className="whitespace-nowrap"
											>
												{lesson.lessonAttachments &&
												lesson.lessonAttachments.length > 0
													? "Manage Files"
													: "Upload Files"}
											</Button>
										</div>
									)}

									{/* Exam Management */}
									{isExam && (
										<div
											className={`${cardStyle("EXAM")} flex justify-between items-center`}
										>
											<div className="flex items-start gap-3">
												<div className="mt-0.5 text-purple-600">
													{typeIcon("EXAM")}
												</div>
												<div>
													<div className="flex items-center gap-2">
														<h4 className={`font-medium ${textColor("EXAM")}`}>
															Exam Assessment
														</h4>
														{lesson.exam && (
															<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
																Pass: {lesson.exam.passingScore}%
															</span>
														)}
													</div>
													<p className={`text-xs ${subTextColor("EXAM")} mt-1`}>
														{!isSaved
															? "Save the lesson first to manage exam questions"
															: lesson.exam
																? "Exam already created. Click to edit."
																: "No exam yet. Click to create one."}
													</p>
												</div>
											</div>
											<Button
												type="button"
												size="sm"
												onClick={handleNavigateToExam}
												disabled={!isSaved}
												className="whitespace-nowrap"
											>
												{lesson.exam ? "Edit Exam" : "Create Exam"}
											</Button>
										</div>
									)}

									{/* Save Lesson Button (now at the bottom) */}
									<div className="flex justify-end pt-2 border-t border-border">
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
								</form>
							</Form>
						</div>
					</div>
				</div>
			)}
		</Draggable>
	);
}
