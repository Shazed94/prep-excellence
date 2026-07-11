import type { DropResult } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCreateCourseSchema,
	ZCCoachingCourseSchema,
} from "@prepexcellence/shared-validators";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ChevronDownIcon,
	ChevronLeft,
	Plus,
	Trash2,
	Upload,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CourseModules } from "@/components/courses/course-modules";
import type {
	LocalLesson,
	LocalModule,
} from "@/components/courses/module-item";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
	useCreateLesson,
	useCreateModule,
	useDeleteLesson,
	useDeleteModule,
	useGetCategories,
	useGetCourse,
	useSubmitCourses,
	useUpdateCourse,
	useUpdateLesson,
	useUpdateModule,
} from "@/hooks/course-management";
import { useGetInstructors } from "@/hooks/instructor";
import { getUser } from "@/store/useAuth";
import { useNavigate } from "@tanstack/react-router";

// ---------- Route ----------
export const Route = createFileRoute("/teacher-dashboard/coaching/create")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => ({
		courseId: (search.courseId as string | undefined) || undefined,
	}),
});

// ---------- Helper: recursively find the first validation error message ----------
function getFirstErrorMessage(errors: Record<string, any>): string | null {
	for (const key in errors) {
		const err = errors[key];
		if (!err) continue;

		if (typeof err.message === "string" && err.message.length > 0) {
			return err.message;
		}

		if (Array.isArray(err)) {
			for (const item of err) {
				const nested = getFirstErrorMessage(item || {});
				if (nested) return nested;
			}
		} else if (typeof err === "object") {
			const nested = getFirstErrorMessage(err);
			if (nested) return nested;
		}
	}
	return null;
}

// ---------- Component ----------
function RouteComponent() {
	const user = getUser();
	const { courseId: editCourseId } = Route.useSearch();
	const isEditMode = !!editCourseId;
	const [openStartDate, setOpenStartDate] = useState(false);
	const [openEndDate, setOpenEndDate] = useState(false);
	const [activeTab, setActiveTab] = useState<"basic" | "details" | "modules">(
		"basic",
	);
	const thumbnailId = useId();
	const videoId = useId();
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	const [videoPreview, setVideoPreview] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [tempModules, setTempModules] = useState<LocalModule[]>([]);

	const navigate = useNavigate();

	const coachingCourseMutation = useSubmitCourses();
	const updateCourseMutation = useUpdateCourse();
	const [instructorSearch, setInstructorSearch] = useState("");
	const { data: instructorsData, isLoading: instructorsLoading } =
		useGetInstructors({ search: instructorSearch, limit: 50 });
	const instructorsOptions = useMemo(() => {
		if (instructorsLoading) return [];
		return (
			instructorsData?.data?.map(
				(instructor: { id: string; name: string }) => ({
					label: instructor.name,
					id: instructor.id,
				}),
			) || []
		);
	}, [instructorsData, instructorsLoading]);

	const queryClient = useQueryClient();

	// Helper to refetch coaching course data after module/lesson changes
	const refetchCourseModules = () => {
		if (courseId) {
			queryClient.invalidateQueries({
				queryKey: ["coaching-course", courseId],
			});
		}
	};
	const handlePublishCourse = () => {
		toast.success("Course is ready!");
		navigate({ to: "/teacher-dashboard/coaching" });
	};

	// ========== Modules State ==========
	// In edit mode the course id comes from the URL so all fields load for editing.
	const [courseId, setCourseId] = useState<string | null>(editCourseId ?? null);
	const [prefilled, setPrefilled] = useState(false);
	const [courseDataForModules, setCourseDataForModules] = useState<
		Partial<TCreateCourseSchema>
	>({});

	const { data: categoriesData } = useGetCategories();

	const createModuleMutation = useCreateModule();
	const createLessonMutation = useCreateLesson();
	const updateModuleMutation = useUpdateModule();
	const updateLessonMutation = useUpdateLesson();
	const deleteModuleMutation = useDeleteModule();
	const deleteLessonMutation = useDeleteLesson();

	// ========== Fetch course data with modules ==========
	const { data: courseData, isLoading: isCourseLoading } = useGetCourse(
		courseId || "",
	);
	// Derive modules and lessons from course data (coaching API returns modules with topics)
	const modules: LocalModule[] = useMemo(() => {
		const apiModules = (courseData?.courseModules || []).map((m: any) => ({
			id: m.id,
			title: m.title || "",
			description: m.description || "",
			orderIndex: m.orderIndex,
			courseId: m.courseId || courseId,
			instructorId: m.instructorId || "",
		}));
		return [...apiModules, ...tempModules].sort(
			(a, b) => a.orderIndex - b.orderIndex,
		);
	}, [courseData, courseId, tempModules]);

	// Map coaching topics as lessons for the CourseModules component
	const allLessons: LocalLesson[] = useMemo(() => {
		return (courseData?.courseModules || []).flatMap((m: any) =>
			(m.lessons || []).map((t: any) => ({
				id: t.id,
				title: t.title || "",
				description: t.description || "",
				orderIndex: t.orderIndex,
				isPublished: false,
				lessonType: "READING_MATERIAL" as const,
				content: "",
				attachments: [],
				moduleId: m.id,
			})),
		);
	}, [courseData]);

	const form = useForm<TCreateCourseSchema>({
		resolver: zodResolver(ZCCoachingCourseSchema),
		defaultValues: {
			title: "",
			shortDescription: "",
			longDescription: "",
			startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
			endDate: undefined,
			capacity: 30,
			price: 0,
			discount: 0,
			thumbnail: "",
			video: "",
			categoryId: "",
			// FIX: teacherId is required by the schema and must have a default,
			// otherwise the very first validation run fails silently.
			teacherId: "",
			level: "BEGINNER",
			tags: [],
			schedules: [
				{
					dayOfWeek: "SUNDAY",
					startTime: "13:00",
					endTime: "14:00",
				},
			],
		},
	});

	// Pre-fill teacher as the instructor.
	// FIX: was previously calling form.setValue("instructorId", ...) which does not
	// exist on the schema. The schema requires "teacherId", so that's what must be set.
	useEffect(() => {
		if (user?.id) {
			form.setValue("teacherId", user.id, { shouldValidate: true });
		}
	}, [user?.id, form]);

	// In edit mode, pre-populate every field from the existing course once loaded.
	useEffect(() => {
		if (!isEditMode || prefilled) return;
		const c: any = courseData;
		if (!c) return;
		form.reset({
			title: c.title ?? "",
			shortDescription: c.shortDescription ?? c.sortDescription ?? "",
			longDescription: c.longDescription ?? "",
			startDate: c.startDate ? new Date(c.startDate) : new Date(),
			endDate: c.endDate ? new Date(c.endDate) : undefined,
			capacity: c.capacity ?? 30,
			price: c.price ?? 0,
			discount: c.discount ?? 0,
			thumbnail: c.thumbnail ?? "",
			video: c.video ?? "",
			categoryId: c.categoryId ?? c.category?.id ?? "",
			// Keep teacherId in sync when editing an existing course.
			teacherId: c.teacherId ?? c.instructorId ?? user?.id ?? "",
			level: c.level ?? "BEGINNER",
			tags: c.tags ?? [],
			schedules:
				c.schedules?.length || c.courseSchedules?.length
					? (c.schedules ?? c.courseSchedules).map((s: any) => ({
							dayOfWeek: s.dayOfWeek,
							startTime: s.startTime,
							endTime: s.endTime,
						}))
					: [{ dayOfWeek: "SUNDAY", startTime: "13:00", endTime: "14:00" }],
		} as any);
		if (c.thumbnail) setThumbnailPreview(c.thumbnail);
		if (c.video) setVideoPreview(c.video);
		setPrefilled(true);
	}, [isEditMode, prefilled, courseData, form, user?.id]);

	const { control } = form;

	const {
		fields: sessionFields,
		append,
		remove,
	} = useFieldArray({
		control,
		name: "schedules",
	});

	// ---------- Duration / sessions logic ----------

	// Watch tags to display them reactively
	const tags = form.watch("tags");

	// Can add only if:
	//  - duration is valid
	//  - number of sessions is less than duration
	const canAddSession = sessionFields.length < 7;

	// Update thumbnail handler
	const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Thumbnail must be less than 5MB");
			return;
		}

		// Store the actual file
		setThumbnailFile(file);

		// Still create preview for UI
		const reader = new FileReader();
		reader.onloadend = () => {
			setThumbnailPreview(reader.result as string);
			// FIX: keep the RHF field in sync so validation (if ever made required) passes,
			// and so form.getValues()/watch() reflects the actual selection.
			form.setValue("thumbnail", file.name, { shouldValidate: true });
		};
		reader.readAsDataURL(file);
	};

	// Update video handler
	const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size (500MB)
		if (file.size > 500 * 1024 * 1024) {
			toast.error("Video must be less than 500MB");
			return;
		}

		// Store the actual file
		setVideoFile(file);

		// Still create preview for UI
		const reader = new FileReader();
		reader.onloadend = () => {
			setVideoPreview(reader.result as string);
			form.setValue("video", file.name, { shouldValidate: true });
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (data: TCreateCourseSchema) => {
		// Create FormData
		const formData = new FormData();

		// Append all text fields
		formData.append("title", data.title);
		formData.append("shortDescription", data.shortDescription);
		formData.append("longDescription", data.longDescription);
		formData.append("startDate", data.startDate.toISOString());
		formData.append("endDate", data?.endDate?.toISOString() ?? "");
		formData.append("capacity", data.capacity.toString());
		formData.append("price", data.price.toString());
		formData.append("discount", data.discount.toString());
		formData.append("categoryId", data.categoryId ?? "");
		// FIX: teacherId was being validated but never sent to the backend.
		formData.append("teacherId", (data as any).teacherId ?? "");
		formData.append("level", data.level);
		formData.append("tags", JSON.stringify(data.tags));
		formData.append("schedules", JSON.stringify(data.schedules));

		// Append files if they exist
		if (thumbnailFile) {
			formData.append("thumbnail", thumbnailFile);
		}
		if (videoFile) {
			formData.append("video", videoFile);
		}

		// Edit mode → update the existing course, keep the wizard on the current tab.
		if (isEditMode && editCourseId) {
			updateCourseMutation.mutate(
				{ courseId: editCourseId, data: formData },
				{
					onSuccess: () => {
						setCourseDataForModules(data);
						toast.success("Course updated successfully.");
						setActiveTab("modules");
					},
					onError: (error: any) => {
						toast.error(error?.message || "Failed to update the course.");
					},
				},
			);
			return;
		}

		coachingCourseMutation.mutate(formData, {
			onSuccess: (response: any) => {
				const newCourseId =
					response?.data?.data?.id || response?.data?.id || response?.id;
				if (newCourseId) {
					setCourseId(newCourseId);
					setCourseDataForModules(data);
					setActiveTab("modules");
					toast.success(
						"Course created successfully! Now add modules and lessons.",
					);
				} else {
					toast.success("Course created successfully!");
					form.reset();
					setThumbnailPreview(null);
					setVideoPreview(null);
				}
			},
			onError: (error) => {
				toast.error(
					error?.message || "An error occurred while submitting the form.",
				);
			},
		});
	};

	// ============ STEP 3: Modules & Lessons ============
	const handleAddModule = async () => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		const tempId = `temp-${Date.now()}`;
		const newModule: LocalModule = {
			id: tempId,
			title: `Module ${modules.length + 1}`,
			description: "",
			orderIndex: modules.length,
			courseId,
			teacherId: "",
		};

		setTempModules((prev) => [...prev, newModule]);
	};

	const handleAddLesson = async (moduleId: string) => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		// Don't allow adding lessons to temp (unsaved) modules
		if (tempModules.some((m) => m.id === moduleId)) {
			toast.error("Please save the module first before adding lessons");
			return;
		}

		const moduleLessons = allLessons.filter(
			(l) => l.courseModuleId === moduleId,
		);

		try {
			// Immediately create lesson with default values
			await createLessonMutation.mutateAsync({
				moduleId,
				courseId,
				data: {
					title: `Lesson ${moduleLessons.length + 1}`,
					description: "",
					orderIndex: moduleLessons.length,
					isPublished: false,
					content: "",
					lessonType: "LIVE_CLASS",
				},
			});

			refetchCourseModules();
		} catch (error) {
			console.error("Failed to add lesson:", error);
			// Error handled by mutation
		}
	};

	const handleUpdateModule = async (
		id: string,
		field: keyof Omit<LocalModule, "id" | "courseId">,
		value: any,
	) => {
		// If it's a temp (unsaved) module, just update local state
		if (tempModules.some((m) => m.id === id)) {
			setTempModules((prev) =>
				prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
			);
			return;
		}

		if (!courseId) return;

		try {
			await updateModuleMutation.mutateAsync({
				moduleId: id,
				courseId,
				data: { [field]: value },
			});
			refetchCourseModules();
		} catch {
			// Error handled by mutation
		}
	};

	const handleUpdateLesson = async (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "moduleId">,
		value: any,
	) => {
		// Always call API since all lessons are saved
		if (!courseId) return;

		try {
			await updateLessonMutation.mutateAsync({
				lessonId: id,
				courseId, // CRITICAL: Pass courseId to trigger refetch
				data: { [field]: value },
			});
			refetchCourseModules();
		} catch {
			// Error handled by mutation
		}
	};

	const handleSaveLesson = async (_lessonId: string) => {
		// This function is no longer needed - lessons are saved immediately
		// Kept for backward compatibility if the component still calls it
		return;
	};

	const handleSaveModule = async (moduleId: string) => {
		// Temp modules are created directly in module-item.tsx;
		// just clean up local state and refetch
		if (moduleId.startsWith("temp-")) {
			setTempModules((prev) => prev.filter((m) => m.id !== moduleId));
			setTimeout(() => refetchCourseModules(), 300);
		}
	};

	const handleDeleteModule = async (id: string) => {
		// If it's a temp (unsaved) module, just remove from local state
		if (tempModules.some((m) => m.id === id)) {
			setTempModules((prev) => prev.filter((m) => m.id !== id));
			return;
		}

		if (!courseId) return;

		try {
			await deleteModuleMutation.mutateAsync({ moduleId: id, courseId });
			refetchCourseModules();
		} catch {
			// Error handled by mutation
		}
	};

	const handleDeleteLesson = async (id: string) => {
		if (!courseId) return;

		try {
			await deleteLessonMutation.mutateAsync({ lessonId: id, courseId });
			refetchCourseModules();
		} catch {
			// Error handled by mutation
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination || !courseId) return;

		const refetchAfterDrag = () => {
			setTimeout(() => refetchCourseModules(), 500);
		};

		if (result.type === "MODULES") {
			const reordered = Array.from(modules);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);

			// Build list of items that need updating (skip temp/unsaved modules)
			const itemsToUpdate = reordered
				.filter((module) => !module.id.startsWith("temp-"))
				.map((module, idx) => ({ module, newIndex: idx }))
				.filter(({ module, newIndex }) => module.orderIndex !== newIndex);

			if (itemsToUpdate.length > 0) {
				try {
					// PHASE 1: Set all items to temporary high values to avoid conflicts
					const tempOffset = 10000;
					for (let i = 0; i < itemsToUpdate.length; i++) {
						const { module } = itemsToUpdate[i];
						await updateModuleMutation.mutateAsync({
							moduleId: module.id,
							courseId,
							data: { orderIndex: tempOffset + i },
						});
					}

					// PHASE 2: Set items to their final positions
					for (const { module, newIndex } of itemsToUpdate) {
						await updateModuleMutation.mutateAsync({
							moduleId: module.id,
							courseId,
							data: { orderIndex: newIndex },
						});
					}

					toast.success("Module order updated");
					refetchAfterDrag();
				} catch (error) {
					console.error("Failed to update module order:", error);
					toast.error("Failed to update module order");
				}
			}
		} else if (result.type === "LESSONS") {
			const moduleId = result.destination.droppableId;
			const moduleLessons = allLessons
				.filter((l) => l.courseModuleId === moduleId)
				.sort((a, b) => a.orderIndex - b.orderIndex);

			const reordered = Array.from(moduleLessons);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);

			// Build list of items that need updating (all lessons are saved now)
			const itemsToUpdate = reordered
				.map((lesson, idx) => ({ lesson, newIndex: idx }))
				.filter(({ lesson, newIndex }) => lesson.orderIndex !== newIndex);

			if (itemsToUpdate.length > 0) {
				try {
					// PHASE 1: Set all items to temporary high values to avoid conflicts
					const tempOffset = 10000;
					for (let i = 0; i < itemsToUpdate.length; i++) {
						const { lesson } = itemsToUpdate[i];
						await updateLessonMutation.mutateAsync({
							lessonId: lesson.id,
							courseId,
							data: { orderIndex: tempOffset + i },
						});
					}

					// PHASE 2: Set items to their final positions
					for (const { lesson, newIndex } of itemsToUpdate) {
						await updateLessonMutation.mutateAsync({
							lessonId: lesson.id,
							courseId,
							data: { orderIndex: newIndex },
						});
					}

					toast.success("Lesson order updated");
					refetchAfterDrag();
				} catch (error) {
					console.error("Failed to update lesson order:", error);
					toast.error("Failed to update lesson order");
				}
			}
		}
	};

	const handleModulesBack = () => {
		setActiveTab("details");
	};

	// ---------- UI ----------
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-switzer text-xl font-semibold text-foreground md:text-2xl">
						{isEditMode ? "Edit Course" : "Create Course"}
					</h1>
					<p className="mt-1 text-sm text-muted">
						Define the course structure, schedule, and details your students
						will see.
					</p>
				</div>
				<Link
					to="/teacher-dashboard/coaching"
					className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/5"
				>
					<ChevronLeft className="mr-1.5 h-4 w-4" />
					Back
				</Link>
			</div>
			{/* Tabs Navigation */}
			<div className="border-b border-border">
				<div className="flex gap-6">
					{(
						[
							["basic", "Basic Info"],
							["details", "Details & Schedule"],
							["modules", "Modules"],
						] as const
					).map(([key, label]) => (
						<button
							key={key}
							type="button"
							onClick={() => setActiveTab(key)}
							className={`-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
								activeTab === key
									? "border-primary text-primary"
									: "border-transparent text-muted hover:text-foreground"
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>
			{/* Main Content */}
			{activeTab !== "modules" ? (
				<div className="w-full rounded-lg border border-border bg-white p-6 md:p-8">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit, (errors) => {
								// FIX: recursive error lookup so nested/array field errors
								// (e.g. schedules.0.startTime, teacherId) are never silently swallowed.
								console.log("Validation errors:", errors);
								const message =
									getFirstErrorMessage(errors) ??
									"Please fix the highlighted fields.";
								toast.error(message);
							})}
							className="space-y-8"
						>
							{/* TAB 1: Basic Info */}
							{activeTab === "basic" && (
								<div className="space-y-6">
									<div>
										<h2 className="text-2xl font-semibold text-foreground mb-1">
											Basic Information
										</h2>
										<p className="text-muted">
											Enter your course title and basic details.
										</p>
									</div>

									{/* Course Title */}
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground text-base">
													Course Title
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Full Stack Web Development (Beginner to Advanced)"
														{...field}
														className="h-11 border border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary text-base"
													/>
												</FormControl>
												<FormDescription className="text-muted">
													This will be shown in the course catalog and on the
													course page.
												</FormDescription>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									{/* Short Description */}
									<FormField
										control={form.control}
										name="shortDescription"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground text-base">
													Short Description
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder="Describe what students will learn, prerequisites, outcomes, and any projects included..."
														{...field}
														rows={6}
														className="py-3 px-4 border border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary resize-none text-base"
													/>
												</FormControl>
												<FormDescription className="text-muted">
													Use clear language and structure to describe the
													course content.
												</FormDescription>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									{/* Category, Level & Tags */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
										<FormField
											control={form.control}
											name="categoryId"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Category
													</FormLabel>
													<FormControl>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger className="h-11 border border-border">
																<SelectValue placeholder="Select category" />
															</SelectTrigger>
															<SelectContent>
																{categoriesData?.map((cat) => (
																	<SelectItem key={cat.id} value={cat.id}>
																		{cat.name}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="level"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Level
													</FormLabel>
													<FormControl>
														<select
															{...field}
															className="h-11 w-full rounded-lg border border-border bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary"
														>
															<option value="BEGINNER">Beginner</option>
															<option value="INTERMEDIATE">Intermediate</option>
															<option value="ADVANCED">Advanced</option>
															<option value="EXPERT">Expert</option>
														</select>
													</FormControl>
													<FormDescription className="text-muted">
														Course difficulty level.
													</FormDescription>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="tags"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Tags
													</FormLabel>
													<FormControl>
														<div>
															{/* Tag Input */}
															<Input
																placeholder="Type a tag and press Enter"
																onKeyDown={(e) => {
																	if (e.key === "Enter") {
																		e.preventDefault();
																		const inputValue =
																			e.currentTarget.value.trim();
																		if (
																			inputValue.length > 0 &&
																			!tags?.includes(inputValue)
																		) {
																			field.onChange([
																				...(tags || []),
																				inputValue,
																			]);
																			e.currentTarget.value = "";
																		}
																	}
																}}
																className="h-11 border border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary"
															/>

															{/* Tag Display - Only show when tags exist */}
															{tags && tags.length > 0 && (
																<div className="flex flex-wrap gap-2 mt-2">
																	{tags.map((tag, index) => (
																		<div
																			key={index}
																			className="flex items-center gap-1 bg-primary-light text-primary-dark px-3 py-1 rounded-full text-sm"
																		>
																			<span>{tag}</span>
																			<button
																				type="button"
																				onClick={() => {
																					const updatedTags = tags.filter(
																						(_, i) => i !== index,
																					);
																					field.onChange(updatedTags);
																				}}
																				className="text-primary hover:text-primary-dark font-bold ml-1 cursor-pointer"
																			>
																				×
																			</button>
																		</div>
																	))}
																</div>
															)}
														</div>
													</FormControl>
													<FormDescription className="text-muted">
														Type a tag and press Enter to add. Click × to
														remove.
													</FormDescription>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}

							{/* TAB 2: Details & Schedule */}
							{activeTab === "details" && (
								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-semibold text-foreground mb-1">
											Details & Schedule
										</h2>
										<p className="text-muted">
											Add course description, dates, pricing, and schedule.
										</p>
									</div>

									{/* Long Description (Jodit) */}
									<FormField
										control={form.control}
										name="longDescription"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground text-base">
													Long Description
												</FormLabel>
												<FormControl>
													<RichTextEditor
														value={field.value}
														onChange={field.onChange}
														height="400px"
														minHeight="200px"
													/>
												</FormControl>

												<FormDescription className="text-muted">
													Use clear language and structure to describe the
													course content.
												</FormDescription>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									{/* Duration & Pricing Grid */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
										{/* Start Date */}
										<FormField
											control={form.control}
											name="startDate"
											render={({ field }) => {
												const dateValue = field.value
													? new Date(field.value)
													: undefined;
												return (
													<FormItem>
														<FormLabel className="text-foreground text-base">
															Start Date
														</FormLabel>
														<FormControl>
															<Popover
																open={openStartDate}
																onOpenChange={setOpenStartDate}
															>
																<PopoverTrigger asChild>
																	<Button
																		type="button"
																		variant="outline"
																		className="w-full h-11 justify-between font-normal"
																	>
																		{dateValue
																			? dateValue.toLocaleDateString()
																			: "Select date"}
																		<ChevronDownIcon />
																	</Button>
																</PopoverTrigger>
																<PopoverContent
																	className="w-auto overflow-hidden p-0"
																	align="start"
																>
																	<Calendar
																		mode="single"
																		selected={dateValue}
																		onSelect={(date) => {
																			if (date) {
																				field.onChange(date);
																				setOpenStartDate(false);
																			}
																		}}
																		className="rounded-md border shadow-sm"
																		captionLayout="dropdown"
																	/>
																</PopoverContent>
															</Popover>
														</FormControl>
														<FormDescription className="text-muted">
															First day of the course.
														</FormDescription>
														<FormMessage className="text-red-500 text-sm" />
													</FormItem>
												);
											}}
										/>

										{/* End Date */}
										<FormField
											control={form.control}
											name="endDate"
											render={({ field }) => {
												const dateValue = field.value
													? new Date(field.value)
													: undefined;
												return (
													<FormItem>
														<FormLabel className="text-foreground text-base">
															End Date
														</FormLabel>
														<FormControl>
															<Popover
																open={openEndDate}
																onOpenChange={setOpenEndDate}
															>
																<PopoverTrigger asChild>
																	<Button
																		type="button"
																		variant="outline"
																		className="w-full h-11 justify-between font-normal"
																	>
																		{dateValue
																			? dateValue.toLocaleDateString()
																			: "Select date"}
																		<ChevronDownIcon />
																	</Button>
																</PopoverTrigger>
																<PopoverContent
																	className="w-auto overflow-hidden p-0"
																	align="start"
																>
																	<Calendar
																		mode="single"
																		selected={dateValue}
																		onSelect={(date) => {
																			if (date) {
																				field.onChange(date);
																				setOpenEndDate(false);
																			}
																		}}
																		disabled={(date) => {
																			const start = form.getValues("startDate");
																			return start ? date < new Date(start) : false;
																		}}
																		className="rounded-md border shadow-sm"
																		captionLayout="dropdown"
																	/>
																</PopoverContent>
															</Popover>
														</FormControl>
														<FormDescription className="text-muted">
															Last day of the course. (Optional)
														</FormDescription>
														<FormMessage className="text-red-500 text-sm" />
													</FormItem>
												);
											}}
										/>
										<FormField
											control={form.control}
											name="capacity"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Max Students
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={1}
															placeholder="e.g., 50"
															{...field}
															value={field.value === 0 ? "" : field.value}
															onChange={(e) => {
																const val = e.target.value;
																field.onChange(val === "" ? 0 : Number(val));
															}}
															className="h-11 border border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary"
														/>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
									</div>

									{/* Pricing Grid */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
										<FormField
											control={form.control}
											name="price"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Price
													</FormLabel>

													<FormControl>
														<Input
															type="number"
															min={0}
															placeholder="e.g., 99"
															value={field.value === 0 ? "" : field.value}
															onChange={(e) => {
																const val = e.target.value;
																field.onChange(val === "" ? 0 : Number(val));
															}}
															className="h-11 border border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary"
														/>
													</FormControl>

													<FormDescription className="text-muted">
														Set 0 for a free course.
													</FormDescription>

													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="discount"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Discount
													</FormLabel>

													<FormControl>
														<Input
															type="number"
															min={0}
															placeholder="e.g., 99"
															value={field.value === 0 ? "" : field.value}
															onChange={(e) => {
																const val = e.target.value;
																field.onChange(val === "" ? 0 : Number(val));
															}}
															className="h-11 border border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary"
														/>
													</FormControl>

													<FormDescription className="text-muted">
														Discounted price (leave empty if no discount).
													</FormDescription>

													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
									</div>

									{/* Media Uploads */}
									<div className="space-y-6">
										{/* Thumbnail Upload */}
										<FormField
											control={form.control}
											name="thumbnail"
											render={() => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Course Thumbnail
													</FormLabel>
													<FormControl>
														<div className="space-y-4">
															<label htmlFor={thumbnailId}>
																<div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary hover:bg-primary-light transition-all cursor-pointer">
																	<div className="flex items-center gap-4">
																		<div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center shrink-0">
																			<Upload className="w-6 h-6 text-muted" />
																		</div>
																		<div>
																			<p className="font-medium text-foreground">
																				{thumbnailPreview
																					? "Change thumbnail"
																					: "Upload thumbnail"}
																			</p>
																			<p className="text-sm text-muted">
																				PNG, JPG up to 5MB. Recommended ratio
																				16:9.
																			</p>
																		</div>
																	</div>
																</div>
															</label>
															<Input
																id={thumbnailId}
																type="file"
																accept="image/*"
																className="hidden"
																onChange={handleThumbnailUpload}
															/>

															{thumbnailPreview && (
																<div>
																	<p className="text-sm font-medium text-foreground mb-2">
																		Preview:
																	</p>
																	<img
																		src={thumbnailPreview}
																		alt="Thumbnail preview"
																		className="w-full max-w-xs h-auto object-cover rounded-lg border border-border shadow-sm"
																	/>
																</div>
															)}
														</div>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>

										{/* Video Upload */}
										<FormField
											control={form.control}
											name="video"
											render={() => (
												<FormItem>
													<FormLabel className="text-foreground text-base">
														Course Intro Video
													</FormLabel>
													<FormControl>
														<div className="space-y-4">
															<label htmlFor={videoId}>
																<div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary hover:bg-primary-light transition-all cursor-pointer">
																	<div className="flex items-center gap-4">
																		<div className="w-12 h-12 rounded-full bg-muted/10 flex items-center justify-center shrink-0">
																			<Upload className="w-6 h-6 text-muted" />
																		</div>
																		<div>
																			<p className="font-medium text-foreground">
																				{videoPreview
																					? "Change video"
																					: "Upload video"}
																			</p>
																			<p className="text-sm text-muted">
																				MP4, WebM up to 500MB. Recommended ratio
																				16:9.
																			</p>
																		</div>
																	</div>
																</div>
															</label>
															<input
																id={videoId}
																type="file"
																accept="video/*"
																className="hidden"
																onChange={handleVideoUpload}
															/>

															{videoPreview && (
																<div>
																	<p className="text-sm font-medium text-foreground mb-2">
																		Preview:
																	</p>
																	<video
																		src={videoPreview}
																		controls
																		className="w-full max-w-xs h-auto rounded-lg border border-border shadow-sm bg-foreground"
																	>
																		<track
																			kind="captions"
																			src="/captions/video-en.vtt"
																			srcLang="en"
																			label="English"
																			default
																		/>
																	</video>
																</div>
															)}
														</div>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
									</div>

									{/* Weekly Sessions */}
									<div className="space-y-4">
										<div className="flex items-center justify-between gap-3">
											<div>
												<h3 className="text-lg font-semibold text-foreground">
													Weekly Class Schedule
												</h3>
												<p className="text-sm text-muted">
													Example: Sunday 1:00 PM - 2:00 PM, Monday 1:00 PM -
													2:00 PM (repeats weekly).
												</p>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => {
													if (!canAddSession) return;
													append({
														dayOfWeek: "SUNDAY",
														startTime: "13:00",
														endTime: "14:00",
													});
												}}
												disabled={!canAddSession}
												className="flex items-center gap-2 whitespace-nowrap"
											>
												<Plus className="w-4 h-4" />
												Add Day
											</Button>
										</div>

										{/* Helper / warning messages */}
										{sessionFields.length >= 7 && (
											<p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
												⚠️ You&apos;ve reached the maximum weekly sessions for
												this course duration (7).
											</p>
										)}

										<div className="space-y-3">
											{sessionFields.map((session, index) => (
												<div
													key={session.id}
													className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-muted/5 border border-border rounded-lg p-4"
												>
													<FormField
														control={form.control}
														name={`schedules.${index}.dayOfWeek`}
														render={({ field }) => (
															<FormItem className="">
																<FormLabel className="text-foreground text-sm">
																	Day of Week
																</FormLabel>
																<FormControl>
																	<select
																		{...field}
																		className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
																	>
																		<option value="">Select day</option>
																		<option value="MONDAY">Monday</option>
																		<option value="TUESDAY">Tuesday</option>
																		<option value="WEDNESDAY">Wednesday</option>
																		<option value="THURSDAY">Thursday</option>
																		<option value="FRIDAY">Friday</option>
																		<option value="SATURDAY">Saturday</option>
																		{/* FIX: was "sunday" (lowercase) which does not
																		    match the zod enum "SUNDAY" and always failed validation. */}
																		<option value="SUNDAY">Sunday</option>
																	</select>
																</FormControl>
																<FormMessage className="text-red-500 text-xs" />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`schedules.${index}.startTime`}
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-foreground text-sm">
																	Start Time
																</FormLabel>
																<FormControl>
																	<Input
																		type="time"
																		{...field}
																		className="h-10 border border-border rounded-md text-sm focus-visible:ring-2 focus-visible:ring-primary"
																	/>
																</FormControl>
																<FormMessage className="text-red-500 text-xs" />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`schedules.${index}.endTime`}
														render={({ field }) => (
															<FormItem>
																<FormLabel className="text-foreground text-sm">
																	End Time
																</FormLabel>
																<FormControl>
																	<Input
																		type="time"
																		{...field}
																		className="h-10 border border-border rounded-md text-sm focus-visible:ring-2 focus-visible:ring-primary"
																	/>
																</FormControl>
																<FormMessage className="text-red-500 text-xs" />
															</FormItem>
														)}
													/>

													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => remove(index)}
														className="self-center text-muted hover:text-red-500 hover:bg-red-50 md:mt-0"
														disabled={sessionFields.length === 1}
														title="Delete this session"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											))}
										</div>

										<FormMessage className="text-red-500 text-sm">
											{form.formState.errors.schedules?.message?.toString()}
										</FormMessage>
									</div>
								</div>
							)}
							{/* Form Actions */}
							<div className="flex flex-col md:flex-row gap-3 justify-between pt-6 border-t border-border">
								{activeTab === "basic" ? (
									<div className="w-full flex justify-end">
										<Button
											type="button"
											className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 h-11 rounded-lg font-medium transition-colors"
											onClick={async () => {
												const valid = await form.trigger([
													"title",
													"shortDescription",
												]);
												if (valid) {
													setActiveTab("details");
												}
											}}
										>
											Next
										</Button>
									</div>
								) : (
									<>
										<Button
											type="button"
											variant="outline"
											onClick={() => setActiveTab("basic")}
											className="h-11 rounded-lg border border-border font-medium transition-colors"
										>
											Previous
										</Button>
										<Button
											type="submit"
											className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 h-11 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
											disabled={coachingCourseMutation.isPending}
										>
											{coachingCourseMutation.isPending
												? "Creating..."
												: "Save & Continue"}
										</Button>
									</>
								)}
							</div>
						</form>
					</Form>
				</div>
			) : (
				/* ---------- MODULES TAB (outside form) ---------- */
				<div className="w-full">
					{!courseId ? (
						<div className="w-full rounded-xl border border-border bg-white shadow-sm p-12 text-center">
							<h2 className="text-xl font-semibold text-foreground mb-2">
								Create your course first
							</h2>
							<p className="text-muted mb-6">
								Please fill in the Basic Info and Details tabs to create the
								course before adding modules.
							</p>
							<Button
								type="button"
								onClick={() => setActiveTab("details")}
								className="bg-primary hover:bg-primary-dark text-white"
							>
								Go to Details
							</Button>
						</div>
					) : isCourseLoading ? (
						<div className="w-full rounded-xl border border-border bg-white shadow-sm p-12 text-center">
							<div className="animate-spin inline-block w-8 h-8 border-4 border-border border-t-foreground rounded-full" />
							<p className="text-muted mt-4">Loading course data...</p>
						</div>
					) : (
						<CourseModules
							courseId={courseId}
							courseData={courseDataForModules}
							modules={modules as any}
							allLessons={allLessons as any}
							isLiveCourseModule={true}
							instructorsData={instructorsData}
							instructorsLoading={instructorsLoading}
							setInstructorSearch={setInstructorSearch}
							instructorSearch={instructorSearch}
							createModuleMutation={createModuleMutation}
							createLessonMutation={createLessonMutation}
							updateModuleMutation={updateModuleMutation}
							updateLessonMutation={updateLessonMutation}
							onAddModule={handleAddModule}
							onAddLesson={handleAddLesson}
							onUpdateModule={handleUpdateModule}
							onUpdateLesson={handleUpdateLesson}
							onSaveModule={handleSaveModule}
							onSaveLesson={handleSaveLesson}
							onDeleteModule={handleDeleteModule}
							onDeleteLesson={handleDeleteLesson}
							onDragEnd={handleDragEnd}
							onBack={handleModulesBack}
							isEditMode={true}
							onPublish={handlePublishCourse}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default RouteComponent;
