// "use client";
// import {
// 	DragDropContext,
// 	Draggable,
// 	Droppable,
// 	type DropResult,
// } from "@hello-pangea/dnd";

// import type {
// 	TcreateLMSCourseSchema,
// } from "@prepexcellence/shared-validators";
// import {
// 	createLMSCourseSchema,
// } from "@prepexcellence/shared-validators";

// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import {
// 	BookOpen,
// 	ChevronDown,
// 	ChevronLeft,
// 	ChevronRight,
// 	Clock,
// 	GripVertical,
// 	Plus,
// 	Trash2,
// 	Video,
// 	ArrowUp,
// 	ArrowDown,
// 	Loader2,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { zodResolver } from "@hookform/resolvers/zod";
// import RichTextEditor from "@/components/jodit-editor";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
// 	Collapsible,
// 	CollapsibleContent,
// 	CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
// 	useCreateCourse,
// 	useCreateModule,
// 	useCreateLesson,
// 	useUpdateModule,
// 	useUpdateLesson,
// 	useDeleteModule,
// 	useDeleteLesson,
// 	useGetModules,
// 	useGetLessons,
// } from "@/hooks/lms-course";

// // Local types for state management
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
// 	contentType: "VIDEO_RECORDED" | "VIDEO_LIVE" | "VIDEO_SCHEDULED" | "QUIZ" | "ASSIGNMENT" | "TEST" | "READING_MATERIAL" | "DISCUSSION";
// 	content?: string;
// 	attachments: string[];
// 	moduleId: string;
// }

// export const Route = createFileRoute(
// 	"/dashboard/instructor-portal/create-course",
// )({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	const navigate = useNavigate();
// 	const [step, setStep] = useState<"tab1" | "tab2" | "modules">("tab1");
// 	const [courseId, setCourseId] = useState<string | null>(null);
// 	const [courseData, setCourseData] = useState<Partial<TcreateLMSCourseSchema> & {
// 		instructorId?: string;
// 		thumbnailPreview?: string;
// 		thumbnailFile?: File | null;
// 	}>({});

// 	// Form states for local module/lesson management
// 	const [expandedModules, setExpandedModules] = useState<string[]>([]);
// 	const moduleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
// 	const lessonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
// 	const [lastAddedModuleId, setLastAddedModuleId] = useState<string | null>(null);
// 	const [lastAddedLessonId, setLastAddedLessonId] = useState<string | null>(null);

// 	// Hooks
// 	const createCourseMutation = useCreateCourse();
// 	const createModuleMutation = useCreateModule();
// 	const createLessonMutation = useCreateLesson();
// 	const updateModuleMutation = useUpdateModule();
// 	const updateLessonMutation = useUpdateLesson();
// 	const deleteModuleMutation = useDeleteModule();
// 	const deleteLessonMutation = useDeleteLesson();

// 	// Fetch modules and lessons when courseId is available
// 	const { data: modulesData = [] } = useGetModules(courseId || "");
// 	const modules: LocalModule[] = modulesData;

// 	// Aggregate all lessons from all modules
// 	const allLessons: LocalLesson[] = modules.flatMap((module) => {
// 		const { data: lessonsData = [] } = useGetLessons(module.id);
// 		return lessonsData;
// 	});

// 	// Tab 1 form - Basic Info
// 	const tab1Form = useForm<{ title: string; thumbnail: FileList | null }>({
// 		defaultValues: { title: "", thumbnail: null },
// 	});

// 	// Tab 2 form - Course Details with Zod validation
// 	const tab2Form = useForm<
// 		Pick<
// 			TcreateLMSCourseSchema,
// 			| "description"
// 			| "price"
// 			| "discount"
// 			| "level"
// 			| "duration"
// 			| "category"
// 			| "tags"
// 			| "requirements"
// 			| "whatYouLearn"
// 		> & { instructorId: string }
// 	>({
// 		resolver: zodResolver(
// 			createLMSCourseSchema.pick({
// 				description: true,
// 				price: true,
// 				discount: true,
// 				level: true,
// 				duration: true,
// 				category: true,
// 				tags: true,
// 				requirements: true,
// 				whatYouLearn: true,
// 			}).extend({
// 				instructorId: createLMSCourseSchema.shape.instructorId,
// 			})
// 		),
// 		defaultValues: {
// 			instructorId: "",
// 			description: "",
// 			price: 0,
// 			discount: undefined,
// 			level: "BEGINNER",
// 			duration: undefined,
// 			category: "",
// 			tags: [],
// 			requirements: [],
// 			whatYouLearn: [],
// 		},
// 	});

// 	const handleTab1Submit = (data: { title: string; thumbnail: FileList | null }) => {
// 		const thumbnailFile = data.thumbnail?.[0] || null;
// 		const thumbnailPreview = thumbnailFile ? URL.createObjectURL(thumbnailFile) : "";
// 		setCourseData({
// 			...courseData,
// 			title: data.title,
// 			thumbnail: thumbnailPreview,
// 			thumbnailFile,
// 		});
// 		setStep("tab2");
// 		toast.success("Basic info saved! Proceed to details.");
// 	};

// 	const handleTab2Submit = async (data: Pick<TcreateLMSCourseSchema, | "description" | "price" | "discount" | "level" | "duration" | "category" | "tags" | "requirements" | "whatYouLearn"> & { instructorId: string }) => {
// 		try {
// 			// Prepare full course data for API
// 			const fullCourseData: TcreateLMSCourseSchema = {
// 				title: courseData.title || "",
// 				description: data.description,
// 				price: data.price,
// 				discount: data.discount,
// 				level: data.level,
// 				duration: data.duration,
// 				category: data.category,
// 				tags: data.tags,
// 				requirements: data.requirements,
// 				whatYouLearn: data.whatYouLearn,
// 				instructorId: data.instructorId,
// 				thumbnail: courseData.thumbnailFile as any,
// 			};

// 			// Create course via mutation
// 			const response = await createCourseMutation.mutateAsync(fullCourseData);
// 			setCourseId(response.id);
// 			setCourseData({ ...courseData, ...data });
// 			setStep("modules");
// 		} catch (error: any) {
// 			console.error("Failed to create course:", error);
// 		}
// 	};

// 	const handleAddModule = async () => {
// 		if (!courseId) {
// 			toast.error("Course must be created first");
// 			return;
// 		}

// 		const newModuleData = {
// 			title: `Module ${modules.length + 1}`,
// 			description: "",
// 			orderIndex: modules.length,
// 		};

// 		try {
// 			const response = await createModuleMutation.mutateAsync({
// 				courseId,
// 				data: newModuleData,
// 			});

// 			setLastAddedModuleId(response.id);
// 			setExpandedModules((prev) => [...prev, response.id]);
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	};

// 	const handleAddLesson = async (moduleId: string) => {
// 		if (!courseId) {
// 			toast.error("Course must be created first");
// 			return;
// 		}

// 		const moduleLessons = allLessons.filter(l => l.moduleId === moduleId);
// 		const newLessonData = {
// 			title: `Lesson ${moduleLessons.length + 1}`,
// 			description: "",
// 			orderIndex: moduleLessons.length,
// 			contentType: "VIDEO_RECORDED" as const,
// 			content: undefined,
// 			attachments: [],
// 		};

// 		try {
// 			const response = await createLessonMutation.mutateAsync({
// 				moduleId,
// 				data: newLessonData,
// 			});

// 			setLastAddedLessonId(response.id);
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	};

// 	const handleNavigateToQuiz = (lessonId: string, moduleId: string) => {
// 		const lesson = allLessons.find(l => l.id === lessonId);
// 		const module = modules.find(m => m.id === moduleId);

// 		navigate({
// 			to: "/dashboard/instructor-portal/create-quiz",
// 			search: {
// 				lessonId,
// 				moduleId,
// 				courseTitle: courseData.title || "Untitled Course",
// 				lessonTitle: lesson?.title || "Untitled Lesson",
// 				moduleTitle: module?.title || "Untitled Module"
// 			}
// 		});
// 	};

// 	const handleContentTypeChange = (lessonId: string, value: string) => {
// 		handleUpdateLesson(lessonId, "contentType", value);
// 	};

// 	const handleMoveLessonUp = (lessonId: string, moduleId: string) => {
// 		const moduleLessons = allLessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);
// 		const currentIndex = moduleLessons.findIndex(l => l.id === lessonId);

// 		if (currentIndex > 0) {
// 			const currentLesson = moduleLessons[currentIndex];
// 			const previousLesson = moduleLessons[currentIndex - 1];

// 			// Swap order indices
// 			updateLessonMutation.mutateAsync({
// 				lessonId: currentLesson.id,
// 				data: { orderIndex: previousLesson.orderIndex }
// 			});

// 			updateLessonMutation.mutateAsync({
// 				lessonId: previousLesson.id,
// 				data: { orderIndex: currentLesson.orderIndex }
// 			});
// 		}
// 	};

// 	const handleMoveLessonDown = (lessonId: string, moduleId: string) => {
// 		const moduleLessons = allLessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);
// 		const currentIndex = moduleLessons.findIndex(l => l.id === lessonId);

// 		if (currentIndex < moduleLessons.length - 1) {
// 			const currentLesson = moduleLessons[currentIndex];
// 			const nextLesson = moduleLessons[currentIndex + 1];

// 			// Swap order indices
// 			updateLessonMutation.mutateAsync({
// 				lessonId: currentLesson.id,
// 				data: { orderIndex: nextLesson.orderIndex }
// 			});

// 			updateLessonMutation.mutateAsync({
// 				lessonId: nextLesson.id,
// 				data: { orderIndex: currentLesson.orderIndex }
// 			});
// 		}
// 	};

// 	useEffect(() => {
// 		if (lastAddedModuleId && moduleRefs.current[lastAddedModuleId]) {
// 			moduleRefs.current[lastAddedModuleId]?.scrollIntoView({ behavior: "smooth", block: "center" });
// 			setLastAddedModuleId(null);
// 		}
// 	}, [lastAddedModuleId, modules]);

// 	useEffect(() => {
// 		if (lastAddedLessonId && lessonRefs.current[lastAddedLessonId]) {
// 			lessonRefs.current[lastAddedLessonId]?.scrollIntoView({ behavior: "smooth", block: "center" });
// 			setLastAddedLessonId(null);
// 		}
// 	}, [lastAddedLessonId, allLessons]);

// 	const handleUpdateModule = async (id: string, field: keyof Omit<LocalModule, "id" | "courseId">, value: any) => {
// 		if (!courseId) return;

// 		try {
// 			await updateModuleMutation.mutateAsync({
// 				moduleId: id,
// 				courseId,
// 				data: { [field]: value },
// 			});
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	};

// 	const handleDeleteModule = async (id: string) => {
// 		try {
// 			await deleteModuleMutation.mutateAsync(id);
// 			setExpandedModules(expandedModules.filter((mid) => mid !== id));
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	};

// 	const handleUpdateLesson = async (id: string, field: keyof Omit<LocalLesson, "id" | "moduleId">, value: any) => {
// 		try {
// 			await updateLessonMutation.mutateAsync({
// 				lessonId: id,
// 				data: { [field]: value },
// 			});
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	};

// 	const handleDeleteLesson = async (id: string) => {
// 		try {
// 			await deleteLessonMutation.mutateAsync(id);
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	};

// 	const handleAddAttachment = (lessonId: string, filename: string) => {
// 		const lesson = allLessons.find(l => l.id === lessonId);
// 		if (lesson) {
// 			handleUpdateLesson(lessonId, "attachments", [...lesson.attachments, filename]);
// 		}
// 	};

// 	const handleRemoveAttachment = (lessonId: string, index: number) => {
// 		const lesson = allLessons.find(l => l.id === lessonId);
// 		if (lesson) {
// 			handleUpdateLesson(lessonId, "attachments", lesson.attachments.filter((_, i) => i !== index));
// 		}
// 	};

// 	const handleDragEnd = (result: DropResult) => {
// 		if (!result.destination || !courseId) return;

// 		if (result.type === "MODULES") {
// 			const reordered = Array.from(modules);
// 			const [moved] = reordered.splice(result.source.index, 1);
// 			reordered.splice(result.destination.index, 0, moved);

// 			// Update order indices for all affected modules
// 			reordered.forEach((module, idx) => {
// 				if (module.orderIndex !== idx) {
// 					updateModuleMutation.mutateAsync({
// 						moduleId: module.id,
// 						courseId,
// 						data: { orderIndex: idx },
// 					});
// 				}
// 			});

// 			toast.success("Module order updated");
// 		} else if (result.type === "LESSONS") {
// 			const moduleId = result.destination.droppableId;
// 			const moduleLessons = allLessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);

// 			const reordered = Array.from(moduleLessons);
// 			const [moved] = reordered.splice(result.source.index, 1);
// 			reordered.splice(result.destination.index, 0, moved);

// 			// Update order indices for all affected lessons
// 			reordered.forEach((lesson, idx) => {
// 				if (lesson.orderIndex !== idx) {
// 					updateLessonMutation.mutateAsync({
// 						lessonId: lesson.id,
// 						data: { orderIndex: idx },
// 					});
// 				}
// 			});

// 			toast.success("Lesson order updated");
// 		}
// 	};

// 	const toggleModuleExpansion = (moduleId: string) => {
// 		setExpandedModules((prev) => prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]);
// 	};

// 	return (
// 		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
// 			<div className="mb-8 flex items-center justify-between">
// 				<div>
// 					<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
// 						{step === "tab1" ? "Create New Course - Title & Thumbnail" : step === "tab2" ? "Course Details" : "Add Modules and Lessons"}
// 					</h1>
// 					<p className="text-slate-600">
// 						{step === "tab1" ? "Start with title and thumbnail" : step === "tab2" ? "Complete the course details" : `Organize content for "${courseData?.title}"`}
// 					</p>
// 				</div>
// 				<Link to={"/dashboard/" as "/"} className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
// 					<ChevronLeft className="w-4 h-4 mr-2" />
// 					Back
// 				</Link>
// 			</div>

// 			{step === "tab1" && (
// 				<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
// 					<Form {...tab1Form}>
// 						<form onSubmit={tab1Form.handleSubmit(handleTab1Submit)} className="space-y-6">
// 							<div className="space-y-4">
// 								<h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
// 								<FormField control={tab1Form.control} name="title" rules={{ required: "Title is required" }} render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Course Title*</FormLabel>
// 										<FormControl><Input placeholder="e.g., Full Stack Web Development" {...field} className="h-10" /></FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)} />
// 								<FormField control={tab1Form.control} name="thumbnail" rules={{ required: "Thumbnail is required" }} render={({ field: { onChange, value, ...field } }) => (
// 									<FormItem>
// 										<FormLabel>Thumbnail*</FormLabel>
// 										<FormControl><Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...field} className="h-10" /></FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)} />
// 							</div>
// 							<div className="flex justify-end pt-6 border-t">
// 								<Button type="submit" size="lg" className="px-8">Next</Button>
// 							</div>
// 						</form>
// 					</Form>
// 				</div>
// 			)}

// 			{step === "tab2" && (
// 				<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
// 					<Form {...tab2Form}>
// 						<form onSubmit={tab2Form.handleSubmit(handleTab2Submit)} className="space-y-6">
// 							<div className="space-y-4">
// 								<h2 className="text-xl font-semibold text-slate-900">Course Details</h2>
// 								<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
// 									<FormField control={tab2Form.control} name="instructorId" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Instructor ID*</FormLabel>
// 											<FormControl>
// 												<Select value={field.value} onValueChange={field.onChange}>
// 													<SelectTrigger className="h-10"><SelectValue placeholder="Select Instructor ID" /></SelectTrigger>
// 													<SelectContent>
// 														<SelectItem value="1">1</SelectItem>
// 														<SelectItem value="2">2</SelectItem>
// 														<SelectItem value="3">3</SelectItem>
// 														<SelectItem value="4">4</SelectItem>
// 													</SelectContent>
// 												</Select>
// 											</FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="price" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Price*</FormLabel>
// 											<FormControl><Input type="number" min={0} placeholder="e.g., 99" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="discount" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Discount (optional)</FormLabel>
// 											<FormControl><Input type="number" min={0} placeholder="e.g., 79" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="level" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Level*</FormLabel>
// 											<FormControl>
// 												<Select value={field.value} onValueChange={field.onChange}>
// 													<SelectTrigger className="h-10"><SelectValue placeholder="Select Level" /></SelectTrigger>
// 													<SelectContent>
// 														<SelectItem value="BEGINNER">Beginner</SelectItem>
// 														<SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
// 														<SelectItem value="ADVANCED">Advanced</SelectItem>
// 													</SelectContent>
// 												</Select>
// 											</FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="duration" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Duration (hours)</FormLabel>
// 											<FormControl><Input type="number" min={0} placeholder="e.g., 10" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="category" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Category*</FormLabel>
// 											<FormControl><Input placeholder="e.g., Web Development" {...field} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="tags" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Tags (comma-separated)*</FormLabel>
// 											<FormControl><Input placeholder="e.g., react, javascript, web" value={field.value?.join(", ") || ""} onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="requirements" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>Requirements (comma-separated)*</FormLabel>
// 											<FormControl><Input placeholder="e.g., Basic HTML, Computer access" value={field.value?.join(", ") || ""} onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 									<FormField control={tab2Form.control} name="whatYouLearn" render={({ field }) => (
// 										<FormItem>
// 											<FormLabel>What You Learn (comma-separated)*</FormLabel>
// 											<FormControl><Input placeholder="e.g., Build apps, Learn React" value={field.value?.join(", ") || ""} onChange={(e) => field.onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="h-10" /></FormControl>
// 											<FormMessage />
// 										</FormItem>
// 									)} />
// 								</div>
// 								<FormField control={tab2Form.control} name="description" render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Short Description*</FormLabel>
// 										<FormControl><RichTextEditor value={field.value} onChange={field.onChange} height="200px" minHeight="150px" /></FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)} />
// 							</div>
// 							<div className="flex justify-between pt-6 border-t">
// 								<Button variant="outline" onClick={() => setStep("tab1")} size="lg">Back to Title</Button>
// 								<Button
// 									type="submit"
// 									size="lg"
// 									className="px-8"
// 									disabled={createCourseMutation.isPending}
// 								>
// 									{createCourseMutation.isPending ? (
// 										<>
// 											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
// 											Creating...
// 										</>
// 									) : (
// 										"Submit & Continue"
// 									)}
// 								</Button>
// 							</div>
// 						</form>
// 					</Form>
// 				</div>
// 			)}

// 			{step === "modules" && (
// 				<div className="space-y-8">
// 					<div className="bg-white rounded-xl border border-slate-200 p-6">
// 						<div className="flex items-start justify-between">
// 							<div className="flex items-center gap-3">
// 								<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
// 									<BookOpen className="w-6 h-6 text-blue-600" />
// 								</div>
// 								<div>
// 									<h2 className="text-2xl font-bold text-slate-900">{courseData?.title}</h2>
// 									<p className="text-slate-600 mt-1 line-clamp-2">{courseData?.description?.replace(/<[^>]*>/g, "").substring(0, 100)}...</p>
// 									<div className="flex items-center gap-3 mt-2">
// 										<Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" />{courseData?.duration || 0} hours</Badge>
// 										<Badge variant="secondary">{courseData?.level}</Badge>
// 										<span className="text-slate-700 font-medium">{courseData?.discount ? `$${courseData.discount}` : `$${courseData?.price}`}{courseData?.discount && <span className="ml-2 text-sm text-slate-400 line-through">${courseData?.price}</span>}</span>
// 									</div>
// 								</div>
// 							</div>
// 							<Button variant="outline" onClick={() => setStep("tab2")} className="h-10">Edit Details</Button>
// 						</div>
// 					</div>

// 					<DragDropContext onDragEnd={handleDragEnd}>
// 						<div className="space-y-6">
// 							<div className="flex items-center justify-between">
// 								<div>
// 									<h3 className="text-xl font-semibold text-slate-900">Course Modules</h3>
// 									<p className="text-slate-600">Add modules and lessons to organize your course content</p>
// 								</div>
// 							</div>

// 							{modules.length === 0 ? (
// 								<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
// 									<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
// 										<BookOpen className="w-8 h-8 text-slate-400" />
// 									</div>
// 									<h3 className="text-lg font-semibold text-slate-900 mb-2">No modules yet</h3>
// 									<p className="text-slate-600 mb-4">Start by adding your first module</p>
// 									<Button
// 										onClick={handleAddModule}
// 										className="flex items-center gap-2"
// 										disabled={createModuleMutation.isPending || !courseId}
// 									>
// 										{createModuleMutation.isPending ? (
// 											<>
// 												<Loader2 className="w-4 h-4 animate-spin" />
// 												Adding...
// 											</>
// 										) : (
// 											<>
// 												<Plus className="w-4 h-4" />
// 												Add First Module
// 											</>
// 										)}
// 									</Button>
// 								</div>
// 							) : (
// 								<Droppable droppableId="modules" type="MODULES">
// 									{(provided) => (
// 										<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
// 											{modules.sort((a, b) => a.orderIndex - b.orderIndex).map((module, moduleIndex) => {
// 												const moduleLessons = allLessons.filter((l) => l.moduleId === module.id).sort((a, b) => a.orderIndex - b.orderIndex);
// 												const isExpanded = expandedModules.includes(module.id);

// 												return (
// 													<div key={module.id} ref={(el) => { if (el) moduleRefs.current[module.id] = el; }} className="border border-slate-400 rounded-xl">
// 														<ModuleItem
// 															module={module}
// 															moduleIndex={moduleIndex}
// 															isExpanded={isExpanded}
// 															toggleModuleExpansion={toggleModuleExpansion}
// 															handleUpdateModule={handleUpdateModule}
// 															handleDeleteModule={handleDeleteModule}
// 															handleAddLesson={handleAddLesson}
// 															moduleLessons={moduleLessons}
// 															handleDeleteLesson={handleDeleteLesson}
// 															handleUpdateLesson={handleUpdateLesson}
// 															handleAddAttachment={handleAddAttachment}
// 															handleRemoveAttachment={handleRemoveAttachment}
// 															handleNavigateToQuiz={handleNavigateToQuiz}
// 															handleMoveLessonUp={handleMoveLessonUp}
// 															handleMoveLessonDown={handleMoveLessonDown}
// 															handleContentTypeChange={handleContentTypeChange}
// 															lessonRefs={lessonRefs}
// 															courseTitle={courseData.title}
// 															createLessonMutation={createLessonMutation}
// 														/>
// 													</div>
// 												);
// 											})}
// 											{provided.placeholder}
// 											<div className="flex justify-center py-4">
// 												<Button
// 													onClick={handleAddModule}
// 													variant="outline"
// 													className="flex items-center gap-2"
// 													disabled={createModuleMutation.isPending}
// 												>
// 													{createModuleMutation.isPending ? (
// 														<>
// 															<Loader2 className="w-4 h-4 animate-spin" />
// 															Adding...
// 														</>
// 													) : (
// 														<>
// 															<Plus className="w-5 h-5" />
// 															Add New Module
// 														</>
// 													)}
// 												</Button>
// 											</div>
// 										</div>
// 									)}
// 								</Droppable>
// 							)}
// 						</div>
// 					</DragDropContext>

// 					<div className="flex justify-end gap-4 pt-6 border-t">
// 						<Button variant="outline" onClick={() => setStep("tab2")} size="lg">Back to Details</Button>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// interface ModuleItemProps {
// 	module: LocalModule;
// 	moduleIndex: number;
// 	isExpanded: boolean;
// 	toggleModuleExpansion: (id: string) => void;
// 	handleUpdateModule: (id: string, field: keyof Omit<LocalModule, "id" | "courseId">, value: any) => Promise<void>;
// 	handleDeleteModule: (id: string) => Promise<void>;
// 	handleAddLesson: (moduleId: string) => void;
// 	moduleLessons: LocalLesson[];
// 	handleDeleteLesson: (id: string) => Promise<void>;
// 	handleUpdateLesson: (id: string, field: keyof Omit<LocalLesson, "id" | "moduleId">, value: any) => Promise<void>;
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

// interface ModuleItemLessonProps {
// 	lesson: LocalLesson;
// 	lessonNumber: number;
// 	totalLessons: number;
// 	handleDeleteLesson: (id: string) => Promise<void>;
// 	handleUpdateLesson: (id: string, field: keyof Omit<LocalLesson, "id" | "moduleId">, value: any) => Promise<void>;
// 	handleAddAttachment: (lessonId: string, filename: string) => void;
// 	handleRemoveAttachment: (lessonId: string, index: number) => void;
// 	handleNavigateToQuiz: (lessonId: string, moduleId: string) => void;
// 	handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
// 	handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
// 	handleContentTypeChange: (lessonId: string, value: string) => void;
// 	courseTitle?: string;
// 	moduleTitle?: string;
// }

// function ModuleItem({
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
// 	return (
// 		<Draggable draggableId={module.id} index={moduleIndex}>
// 			{(provided) => (
// 				<div ref={provided.innerRef} {...provided.draggableProps} className="bg-white rounded-xl border border-slate-300 shadow-sm">
// 					<div className="p-2 border-b border-slate-200">
// 						<div className="flex items-start gap-3">
// 							<div {...provided.dragHandleProps} className="cursor-move text-slate-400 hover:text-slate-600 mt-1">
// 								<GripVertical className="w-5 h-5" />
// 							</div>
// 							<div className="flex-1">
// 								<div className="flex items-center justify-between mb-1">
// 									<div className="flex items-center gap-3">
// 										<Collapsible open={isExpanded} onOpenChange={() => toggleModuleExpansion(module.id)}>
// 											<CollapsibleTrigger asChild>
// 												<Button variant="ghost" size="sm" className="p-1 h-8 w-8">
// 													{isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
// 												</Button>
// 											</CollapsibleTrigger>
// 										</Collapsible>
// 										<div>
// 											<div className="flex items-center gap-2">
// 												<h3 className="text-lg font-semibold text-slate-900">Module {moduleIndex + 1}: {module.title || "Untitled Module"}</h3>
// 												{!module.title && <Badge variant="destructive" className="text-xs">Needs title</Badge>}
// 											</div>
// 											<div className="flex items-center gap-3 -mt-1">
// 												<span className="text-sm text-slate-600 flex items-center gap-1"><Video className="w-3 h-3" />{moduleLessons.length} {moduleLessons.length === 1 ? "lesson" : "lessons"}</span>
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 								<div className="space-y-2 mt-1">
// 									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Module Title</Label>
// 											<Input placeholder="e.g., Introduction to React" value={module.title} onChange={(e) => handleUpdateModule(module.id, "title", e.target.value)} />
// 										</div>
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Order Index</Label>
// 											<Input type="number" min={0} value={module.orderIndex} onChange={(e) => handleUpdateModule(module.id, "orderIndex", Number(e.target.value))} />
// 										</div>
// 									</div>
// 									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Description (optional)</Label>
// 											<Textarea placeholder="Module description..." value={module.description || ""} onChange={(e) => handleUpdateModule(module.id, "description", e.target.value)} rows={2} />
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 					<div className="p-2 flex justify-between items-center bg-slate-50">
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
// 						<Button variant="ghost" size="sm" onClick={() => handleDeleteModule(module.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
// 					</div>
// 					<Collapsible open={isExpanded}>
// 						<CollapsibleContent>
// 							<div className="p-2 bg-slate-50 border-t border-dashed border-slate-300">
// 								{moduleLessons.length === 0 ? (
// 									<div className="text-center py-8">
// 										<div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-1">
// 											<Video className="w-6 h-6 text-slate-400" />
// 										</div>
// 										<p className="text-sm text-slate-500">No lessons yet. Add one above.</p>
// 									</div>
// 								) : (
// 									<Droppable droppableId={module.id} type="LESSONS">
// 										{(provided) => (
// 											<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
// 												{moduleLessons.map((lesson, lessonIndex) => (
// 													<div key={lesson.id} ref={(el) => { if (el) lessonRefs.current[lesson.id] = el; }} className="border-2 border-transparent rounded-lg">
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

// function LessonItem({
// 	lesson,
// 	lessonNumber,
// 	totalLessons,
// 	handleDeleteLesson,
// 	handleUpdateLesson,
// 	handleAddAttachment,
// 	handleRemoveAttachment,
// 	handleMoveLessonUp,
// 	handleMoveLessonDown,
// 	handleContentTypeChange,
// 	courseTitle,
// 	moduleTitle,
// }: ModuleItemLessonProps) {
// 	const navigate = useNavigate();

// 	const isVideo = lesson.contentType === "VIDEO_RECORDED";
// 	const isReading = lesson.contentType === "READING_MATERIAL";
// 	const isAssignment = lesson.contentType === "ASSIGNMENT";
// 	const isQuiz = lesson.contentType === "QUIZ";

// 	const handleSelectChange = (value: string) => {
// 		handleContentTypeChange(lesson.id, value);
// 	};

// 	const handleManageQuiz = () => {
// 		navigate({
// 			to: "/dashboard/instructor-portal/create-quiz",
// 			search: {
// 				lessonId: lesson.id,
// 				moduleId: lesson.moduleId,
// 				lessonTitle: lesson.title,
// 				courseTitle,
// 				moduleTitle,
// 			},
// 		});
// 	};

// 	return (
// 		<Draggable draggableId={lesson.id} index={lesson.orderIndex}>
// 			{(provided) => (
// 				<div
// 					ref={provided.innerRef}
// 					{...provided.draggableProps}
// 					className="bg-white rounded-lg border border-slate-300 p-3 shadow-sm"
// 				>
// 					<div className="flex items-start gap-3">
// 						<div
// 							{...provided.dragHandleProps}
// 							className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
// 						>
// 							<GripVertical className="w-5 h-5" />
// 						</div>

// 						<div className="flex-1 space-y-4">
// 							<div className="flex items-center justify-between">
// 								<h5 className="font-semibold text-slate-900">
// 									Lesson {lessonNumber}: {lesson.title || "Untitled Lesson"}
// 								</h5>

// 								<div className="flex items-center gap-1">
// 									<Button
// 										variant="ghost"
// 										size="sm"
// 										onClick={() =>
// 											handleMoveLessonUp(lesson.id, lesson.moduleId)
// 										}
// 										disabled={lessonNumber === 1}
// 									>
// 										<ArrowUp className="w-4 h-4" />
// 									</Button>

// 									<Button
// 										variant="ghost"
// 										size="sm"
// 										onClick={() =>
// 											handleMoveLessonDown(lesson.id, lesson.moduleId)
// 										}
// 										disabled={lessonNumber === totalLessons}
// 									>
// 										<ArrowDown className="w-4 h-4" />
// 									</Button>

// 									<Button
// 										variant="ghost"
// 										size="sm"
// 										onClick={() => handleDeleteLesson(lesson.id)}
// 										className="text-red-500"
// 									>
// 										<Trash2 className="w-4 h-4" />
// 									</Button>
// 								</div>
// 							</div>

// 							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// 								<div>
// 									<Label>Lesson Title*</Label>
// 									<Input
// 										value={lesson.title}
// 										onChange={(e) =>
// 											handleUpdateLesson(lesson.id, "title", e.target.value)
// 										}
// 									/>
// 								</div>

// 								<div>
// 									<Label>Content Type</Label>
// 									<Select
// 										value={lesson.contentType}
// 										onValueChange={handleSelectChange}
// 									>
// 										<SelectTrigger>
// 											<SelectValue />
// 										</SelectTrigger>
// 										<SelectContent>
// 											<SelectItem value="VIDEO_RECORDED">Video</SelectItem>
// 											<SelectItem value="READING_MATERIAL">
// 												Reading Material
// 											</SelectItem>
// 											<SelectItem value="ASSIGNMENT">Assignment</SelectItem>
// 											<SelectItem value="QUIZ">Quiz</SelectItem>
// 										</SelectContent>
// 									</Select>
// 								</div>

// 								<div>
// 									<Label>Order Index</Label>
// 									<Input
// 										type="number"
// 										value={lesson.orderIndex}
// 										onChange={(e) =>
// 											handleUpdateLesson(
// 												lesson.id,
// 												"orderIndex",
// 												Number(e.target.value)
// 											)
// 										}
// 									/>
// 								</div>

// 								{isVideo && (
// 									<div>
// 										<Label>Duration (minutes)</Label>
// 										<Input
// 											type="number"
// 											value=""
// 											onChange={() => {}}
// 											disabled
// 											placeholder="Tracked with video file"
// 										/>
// 									</div>
// 								)}
// 							</div>

// 							<div className="flex justify-between gap-4 px-2 items-center">
// 								<div>
// 									<Label>Attachments (PDF)</Label>
// 									<input
// 										type="file"
// 										accept="application/pdf"
// 										onChange={(e) => {
// 											const file = e.target.files?.[0];
// 											if (file) {
// 												handleAddAttachment(lesson.id, file.name);
// 												e.target.value = "";
// 											}
// 										}}
// 									/>

// 									<div className="mt-2 space-y-1">
// 										{lesson.attachments.map((file: string, i: number) => (
// 											<div
// 												key={i}
// 												className="flex justify-between bg-slate-100 px-2 py-1 rounded"
// 											>
// 												<span className="text-xs truncate">{file}</span>
// 												<Button
// 													variant="ghost"
// 													size="sm"
// 													onClick={() =>
// 														handleRemoveAttachment(lesson.id, i)
// 													}
// 												>
// 													×
// 												</Button>
// 											</div>
// 										))}
// 									</div>
// 								</div>

// 								{isVideo && (
// 									<div>
// 										<Label>Lesson Video</Label>
// 										<input
// 											type="file"
// 											accept="video/*"
// 											onChange={(e) => {
// 												const file = e.target.files?.[0];
// 												if (file) {
// 													handleAddAttachment(lesson.id, file.name);
// 													e.target.value = "";
// 												}
// 											}}
// 										/>
// 									</div>
// 								)}

// 								<div className="flex-1">
// 									<Label>Description</Label>
// 									<Textarea
// 										rows={2}
// 										value={lesson.description || ""}
// 										onChange={(e) =>
// 											handleUpdateLesson(
// 												lesson.id,
// 												"description",
// 												e.target.value
// 											)
// 										}
// 									/>
// 								</div>
// 							</div>

// 							{(isReading || isAssignment) && (
// 								<div>
// 									<Label>Content</Label>
// 									<RichTextEditor
// 										value={lesson.content || ""}
// 										onChange={(v) => {
// 											handleUpdateLesson(lesson.id, "content", v);
// 										}}
// 										height="180px"
// 									/>
// 								</div>
// 							)}

// 							{isQuiz && (
// 								<div className="p-3 border rounded bg-amber-50 flex justify-between items-center">
// 									<div>
// 										<h4 className="font-medium text-amber-900">
// 											Quiz Assessment
// 										</h4>
// 										<p className="text-xs text-amber-700">
// 											Add or manage quiz questions
// 										</p>
// 									</div>
// 									<Button size="sm" onClick={handleManageQuiz}>
// 										Manage Quiz
// 									</Button>
// 								</div>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</Draggable>
// 	);
// }

// export { LessonItem };

// export default RouteComponent;
