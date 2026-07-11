import type { DropResult } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createLMSCourseSchema,
	type TcreateLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Image, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CourseModules } from "@/components/courses/course-modules";
import type { LocalLesson } from "@/components/courses/lesson-item";
import type { LocalModule } from "@/components/courses/module-item";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/hooks/course-management";
import { useGetInstructors } from "@/hooks/instructor";
import {
	useCreateCourse,
	useCreateLesson,
	useCreateModule,
	useDeleteLesson,
	useDeleteModule,
	useGetCourse,
	useUpdateCourse,
	useUpdateLesson,
	useUpdateModule,
} from "@/hooks/lms-course";

export const Route = createFileRoute("/dashboard/course-management/create")({
	component: RouteComponent,
});

type CreateTab = "basic" | "details" | "modules";

function RouteComponent() {
	const queryClient = useQueryClient();
	const createCourseMutation = useCreateCourse();
	const updateCourseMutation = useUpdateCourse();
	const { data: categories } = useGetCategories();

	const [courseId, setCourseId] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<CreateTab>("basic");

	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
	const thumbnailId = useId();

	// Modules/lessons mutations
	const createModuleMutation = useCreateModule();
	const createLessonMutation = useCreateLesson();
	const updateModuleMutation = useUpdateModule();
	const updateLessonMutation = useUpdateLesson();
	const deleteModuleMutation = useDeleteModule();
	const deleteLessonMutation = useDeleteLesson();

	// ========== Fetch course data (for modules tab) ==========
	const { data: course, isLoading: isCourseLoading } = useGetCourse(
		courseId || "",
	);

	// ========== Teachers ==========
	const [teacherSearch, setTeacherSearch] = useState("");
	const { data: teachersData } = useGetInstructors({
		search: teacherSearch,
		limit: 50,
	});

	// ========== Form ==========
	const form = useForm<TcreateLMSCourseSchema>({
		resolver: zodResolver(createLMSCourseSchema) as any,
		defaultValues: {
			title: "",
			shortDescription: "",
			longDescription: "",
			categoryId: "",
			teacherId: "",
			level: "BEGINNER",
			price: 0,
			discount: undefined,
			duration: undefined,
			tags: [],
			requirements: [],
			whatYouLearn: [],
		},
	});

	const watchedTeacherId = form.watch("teacherId");
	const tags = form.watch("tags");

	// ========== Derive modules and lessons from course data ==========
	const modules: LocalModule[] = useMemo(() => {
		return (course?.courseModules || []).map((m: any) => ({
			id: m.id,
			title: m.title || "",
			description: m.description || "",
			orderIndex: m.orderIndex,
			courseId: m.courseId || courseId || "",
			teacherId: m.teacherId || "",
		}));
	}, [course, courseId]);

	const allLessons: LocalLesson[] = useMemo(() => {
		return (course?.courseModules || []).flatMap((m: any) =>
			(m.lessons || []).map((l: any) => ({
				id: l.id,
				title: l.title || "",
				description: l.description || "",
				orderIndex: l.orderIndex,
				isPublished: l.isPublished ?? false,
				lessonType: l.lessonType || "VIDEO_CONTENT",
				content: l.content || "",
				courseModuleId: m.id,
				contentId: l.contents?.[0]?.id || "",
			})),
		);
	}, [course]);

	const refetchCourse = () => {
		queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
	};

	// ========== Handlers ==========
	const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Thumbnail must be less than 5MB");
			return;
		}
		setThumbnailFile(file);
		const reader = new FileReader();
		reader.onloadend = () => setThumbnailPreview(reader.result as string);
		reader.readAsDataURL(file);
	};

	const handleRemoveThumbnail = () => {
		setThumbnailPreview(null);
		setThumbnailFile(null);
		form.setValue("thumbnail", undefined);
	};

	const handleSubmit = async (data: TcreateLMSCourseSchema) => {
		try {
			const payload: any = { ...data };
			if (thumbnailFile) {
				payload.thumbnail = thumbnailFile;
			}

			if (courseId) {
				// Update existing course
				await updateCourseMutation.mutateAsync({ courseId, data: payload });
				toast.success("Course updated successfully!");
			} else {
				// Create new course
				const response = await createCourseMutation.mutateAsync(payload);
				setCourseId(response.id);
				form.reset(data);
				setActiveTab("modules");
				toast.success("Course created successfully!");
			}
		} catch (error: any) {
			toast.error(error?.message || "Failed to save course");
		}
	};

	// ========== Modules CRUD ==========
	const handleAddModule = async () => {
		if (!courseId) return;
		try {
			await createModuleMutation.mutateAsync({
				courseId,
				data: {
					title: `Module ${modules.length + 1}`,
					description: "",
					orderIndex: modules.length,
					teacherId: watchedTeacherId,
				},
			});
			toast.success("Module added successfully!");
		} catch {
			/* handled by mutation */
		}
	};

	const handleAddLesson = async (moduleId: string) => {
		if (!courseId) return;
		const moduleLessons = allLessons.filter(
			(l) => l.courseModuleId === moduleId,
		);
		try {
			await createLessonMutation.mutateAsync({
				moduleId,
				courseId,
				data: {
					title: `Lesson ${moduleLessons.length + 1}`,
					description: "",
					orderIndex: moduleLessons.length,
					lessonType: "VIDEO_CONTENT",
					isPublished: false,
				},
			});
			toast.success("Lesson added successfully!");
		} catch {
			/* handled by mutation */
		}
	};

	const handleUpdateModule = async (
		id: string,
		field: keyof Omit<LocalModule, "id" | "courseId">,
		value: any,
	) => {
		if (!courseId) return;
		try {
			await updateModuleMutation.mutateAsync({
				moduleId: id,
				courseId,
				data: { [field]: value },
			});
		} catch {
			/* handled by mutation */
		}
	};

	const handleUpdateLesson = async (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "courseModuleId">,
		value: any,
	) => {
		if (!courseId) return;
		try {
			await updateLessonMutation.mutateAsync({
				lessonId: id,
				courseId,
				data: { [field]: value },
			});
		} catch {
			/* handled by mutation */
		}
	};

	const handleSaveModule = async (_moduleId: string) => {
		refetchCourse();
	};

	const handleSaveLesson = async (_lessonId: string) => {
		return;
	};

	const handleDeleteModule = async (id: string) => {
		if (!courseId) return;
		try {
			await deleteModuleMutation.mutateAsync({ moduleId: id, courseId });
		} catch {
			/* handled by mutation */
		}
	};

	const handleDeleteLesson = async (id: string) => {
		if (!courseId) return;
		try {
			await deleteLessonMutation.mutateAsync({ lessonId: id, courseId });
		} catch {
			/* handled by mutation */
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination || !courseId) return;

		if (result.type === "MODULES") {
			const reordered = Array.from(modules);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);

			const itemsToUpdate = reordered
				.map((module, idx) => ({ module, newIndex: idx }))
				.filter(({ module, newIndex }) => module.orderIndex !== newIndex);

			if (itemsToUpdate.length > 0) {
				try {
					const tempOffset = 10000;
					for (let i = 0; i < itemsToUpdate.length; i++) {
						const { module } = itemsToUpdate[i];
						await updateModuleMutation.mutateAsync({
							moduleId: module.id,
							courseId,
							data: { orderIndex: tempOffset + i },
						});
					}
					for (const { module, newIndex } of itemsToUpdate) {
						await updateModuleMutation.mutateAsync({
							moduleId: module.id,
							courseId,
							data: { orderIndex: newIndex },
						});
					}
					toast.success("Module order updated");
					refetchCourse();
				} catch {
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
			const itemsToUpdate = reordered
				.map((lesson, idx) => ({ lesson, newIndex: idx }))
				.filter(({ lesson, newIndex }) => lesson.orderIndex !== newIndex);
			if (itemsToUpdate.length > 0) {
				try {
					const tempOffset = 10000;
					for (let i = 0; i < itemsToUpdate.length; i++) {
						const { lesson } = itemsToUpdate[i];
						await updateLessonMutation.mutateAsync({
							lessonId: lesson.id,
							courseId,
							data: { orderIndex: tempOffset + i },
						});
					}
					for (const { lesson, newIndex } of itemsToUpdate) {
						await updateLessonMutation.mutateAsync({
							lessonId: lesson.id,
							courseId,
							data: { orderIndex: newIndex },
						});
					}
					refetchCourse();
				} catch {
					toast.error("Failed to update lesson order");
				}
			}
		}
	};

	const handleModulesBack = () => setActiveTab("details");

	// ========== Loading ==========
	if (courseId && isCourseLoading) {
		return (
			<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
				<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
					<div className="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full" />
					<p className="text-slate-600 mt-4">Loading course data...</p>
				</div>
			</div>
		);
	}

	// ========== UI ==========
	return (
		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
						Create Course
					</h1>
					<p className="text-slate-600">
						Fill in the details to create a new course.
					</p>
				</div>
			</div>

			{/* Tabs Navigation */}
			<div className="mb-6 border-b border-slate-200">
				<div className="flex gap-6">
					<button
						type="button"
						onClick={() => setActiveTab("basic")}
						className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
							activeTab === "basic"
								? "border-blue-600 text-blue-600"
								: "border-transparent text-slate-600 hover:text-slate-900"
						}`}
					>
						Basic Info
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("details")}
						className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
							activeTab === "details"
								? "border-blue-600 text-blue-600"
								: "border-transparent text-slate-600 hover:text-slate-900"
						}`}
					>
						Details
					</button>
					<button
						type="button"
						onClick={() => {
							if (!courseId) {
								toast.error(
									"Please create the course first before adding modules",
								);
								return;
							}
							setActiveTab("modules");
						}}
						className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
							activeTab === "modules"
								? "border-blue-600 text-blue-600"
								: "border-transparent text-slate-600 hover:text-slate-900"
						}`}
					>
						Modules
					</button>
				</div>
			</div>

			{/* Main Content */}
			{activeTab !== "modules" ? (
				<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-8"
						>
							{/* TAB 1: Basic Info */}
							{activeTab === "basic" && (
								<div className="space-y-6">
									<div>
										<h2 className="text-2xl font-semibold text-slate-900 mb-1">
											Basic Information
										</h2>
										<p className="text-slate-600">
											Enter your course title, thumbnail, and teacher.
										</p>
									</div>

									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Course Title
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., Full Stack Web Development (Beginner to Advanced)"
														{...field}
														className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500 text-base"
													/>
												</FormControl>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									{/* Teacher Selection */}
									<FormField
										control={form.control}
										name="teacherId"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Course Teacher
												</FormLabel>
												<FormControl>
													<SearchableSelect
														value={field.value || ""}
														onValueChange={field.onChange}
														options={(() => {
															if (!teachersData) return [];
															const data = teachersData?.data || teachersData;
															return Array.isArray(data)
																? data.map((inst: any) => ({
																		value: inst.id || inst._id,
																		label:
																			inst.name || inst.fullName || "Unnamed",
																		prefix: (
																			<>
																				<img
																					src={inst.image || ""}
																					alt={
																						inst.name ||
																						inst.fullName ||
																						"Unnamed"
																					}
																					className="w-6 h-6 rounded-full"
																				/>
																			</>
																		),
																	}))
																: [];
														})()}
														onSearchChange={setTeacherSearch}
														emptyText="No teacher found."
														placeholder="Select course teacher..."
														searchPlaceholder="Search teachers..."
													/>
												</FormControl>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									{/* Thumbnail */}
									<div>
										<FormLabel className="text-slate-800 text-base">
											Course Thumbnail
										</FormLabel>
										<div className="mt-2 space-y-4">
											<div className="flex items-center gap-4">
												<Label
													htmlFor={thumbnailId}
													className="flex h-32 w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 transition-colors hover:border-blue-500 hover:bg-blue-50"
												>
													<div className="flex flex-col items-center justify-center pt-5 pb-6">
														<Image className="mb-2 h-8 w-8 text-primary/50" />
														<p className="text-sm text-muted">
															<span className="font-semibold text-foreground">
																Click to upload
															</span>{" "}
															or drag and drop
														</p>
														<p className="text-xs text-muted/70">
															PNG, JPG, GIF up to 5MB
														</p>
													</div>
													<Input
														id={thumbnailId}
														type="file"
														accept="image/*"
														className="hidden"
														onChange={handleThumbnailUpload}
													/>
												</Label>
											</div>
											{thumbnailPreview && (
												<div className="relative inline-block">
													<img
														src={thumbnailPreview}
														alt="Thumbnail preview"
														className="w-full max-w-xs h-auto object-cover rounded-lg border border-slate-200 shadow-sm"
													/>
													<button
														type="button"
														onClick={handleRemoveThumbnail}
														className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-slate-100"
													>
														<X className="w-4 h-4" />
													</button>
												</div>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
										<FormField
											control={form.control}
											name="categoryId"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-800 text-base">
														Category
													</FormLabel>
													<FormControl>
														<Select
															key={`cat-select-${categories?.length}-${field.value}`}
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger className="w-full h-11! border-2 border-slate-200">
																<SelectValue placeholder="Select category" />
															</SelectTrigger>
															<SelectContent>
																{categories?.map((cat: any) => (
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
													<FormLabel className="text-slate-800 text-base">
														Level
													</FormLabel>
													<FormControl>
														<select
															{...field}
															className="h-11 w-full rounded-lg border-2 border-slate-200 bg-white px-3 text-base focus-visible:outline-none focus-visible:ring-0 focus-visible:border-blue-500"
														>
															<option value="BEGINNER">Beginner</option>
															<option value="INTERMEDIATE">Intermediate</option>
															<option value="ADVANCED">Advanced</option>
															<option value="EXPERT">Expert</option>
														</select>
													</FormControl>
													<FormDescription className="text-slate-500">
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
													<FormLabel className="text-slate-800 text-base">
														Tags
													</FormLabel>
													<FormControl>
														<div>
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
																className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
															/>
															{tags && tags.length > 0 && (
																<div className="flex flex-wrap gap-2 mt-2">
																	{tags.map((tag, index) => (
																		<div
																			key={index}
																			className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
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
																				className="text-blue-600 hover:text-blue-800 font-bold ml-1 cursor-pointer"
																			>
																				×
																			</button>
																		</div>
																	))}
																</div>
															)}
														</div>
													</FormControl>
													<FormDescription className="text-slate-500">
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

							{/* TAB 2: Details */}
							{activeTab === "details" && (
								<div className="space-y-8">
									<div>
										<h2 className="text-2xl font-semibold text-slate-900 mb-1">
											Course Details
										</h2>
										<p className="text-slate-600">
											Set descriptions, pricing, and learning materials.
										</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
										<FormField
											control={form.control}
											name="price"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-800 text-base">
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
															className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
														/>
													</FormControl>
													<FormDescription className="text-slate-500">
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
													<FormLabel className="text-slate-800 text-base">
														Discount
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={0}
															placeholder="e.g., 79"
															value={field.value ?? ""}
															onChange={(e) => {
																const val = e.target.value;
																field.onChange(
																	val === "" ? undefined : Number(val),
																);
															}}
															className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
														/>
													</FormControl>
													<FormDescription className="text-slate-500">
														Discounted price (leave empty if no discount).
													</FormDescription>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="duration"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-800 text-base">
														Duration (hours)
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															min={0}
															placeholder="e.g., 10"
															value={field.value ?? ""}
															onChange={(e) => {
																const val = e.target.value;
																field.onChange(
																	val === "" ? undefined : Number(val),
																);
															}}
															className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
														/>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
									</div>

									{/* Short Description */}
									<FormField
										control={form.control}
										name="shortDescription"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Short Description
												</FormLabel>
												<FormControl>
													<RichTextEditor
														value={field.value}
														onChange={field.onChange}
														height="200px"
														minHeight="150px"
													/>
												</FormControl>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									{/* Long Description */}
									<FormField
										control={form.control}
										name="longDescription"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Detailed Description
												</FormLabel>
												<FormControl>
													<RichTextEditor
														value={field.value}
														onChange={field.onChange}
														height="300px"
														minHeight="200px"
													/>
												</FormControl>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
										<FormField
											control={form.control}
											name="requirements"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-800 text-base">
														Requirements
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Basic HTML, CSS knowledge"
															value={field.value?.join(", ") || ""}
															onChange={(e) =>
																field.onChange(
																	e.target.value
																		.split(",")
																		.map((t) => t.trim())
																		.filter(Boolean),
																)
															}
															className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
														/>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="whatYouLearn"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-800 text-base">
														What You'll Learn
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Build React apps, Master JavaScript"
															value={field.value?.join(", ") || ""}
															onChange={(e) =>
																field.onChange(
																	e.target.value
																		.split(",")
																		.map((t) => t.trim())
																		.filter(Boolean),
																)
															}
															className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
														/>
													</FormControl>
													<FormMessage className="text-red-500 text-sm" />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className="flex flex-col md:flex-row gap-3 justify-between pt-6 border-t border-slate-200">
								{activeTab === "basic" ? (
									<div className="w-full flex justify-end">
										<Button
											type="button"
											className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg font-medium transition-colors"
											onClick={() => setActiveTab("details")}
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
											className="h-11 rounded-lg border-2 border-slate-300 font-medium transition-colors"
										>
											Previous
										</Button>
										<div className="flex gap-3">
											<Button
												type="button"
												variant="outline"
												onClick={() => {
													if (!courseId) {
														toast.error(
															"Please create the course first before adding modules",
														);
														return;
													}
													setActiveTab("modules");
												}}
												className="h-11 rounded-lg border-2 border-slate-300 font-medium transition-colors"
											>
												Next: Modules
											</Button>
											<Button
												type="submit"
												disabled={
													createCourseMutation.isPending ||
													updateCourseMutation.isPending
												}
												className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg font-medium transition-colors cursor-pointer"
											>
												{createCourseMutation.isPending
													? "Creating..."
													: updateCourseMutation.isPending
														? "Saving..."
														: courseId
															? "Update Course"
															: "Create Course"}
											</Button>
										</div>
									</>
								)}
							</div>
						</form>
					</Form>
				</div>
			) : (
				/* ---------- MODULES TAB (outside form) ---------- */
				<div className="w-full">
					{courseId ? (
						<CourseModules
							courseId={courseId}
							courseData={course as any}
							courseTeacherId={watchedTeacherId}
							modules={modules as any}
							allLessons={allLessons as any}
							isLiveCourseModule={false}
							teachersData={teachersData}
							setTeacherSearch={setTeacherSearch}
							teacherSearch={teacherSearch}
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
							onPublish={() => toast.success("Course is ready!")}
							isEditMode={true}
						/>
					) : (
						<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
							<p className="text-slate-600 mb-4">
								Please create the course first before adding modules.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default RouteComponent;
