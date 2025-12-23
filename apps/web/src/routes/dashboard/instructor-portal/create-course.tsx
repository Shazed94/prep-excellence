// "use client";
// import {
// 	DragDropContext,
// 	Draggable,
// 	Droppable,
// 	type DropResult,
// } from "@hello-pangea/dnd";

// import {
// 	type TcreateLMSCourseSchema,
// 	type TcreateLMSLessonSchema,
// 	type TcreateLMSModuleSchema,
// } from "@prepexcellence/shared-validators";

// import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// import {
// 	BookOpen,
// 	ChevronDown,
// 	ChevronLeft,
// 	ChevronRight,
// 	Clock,
// 	FileText,
// 	GripVertical,
// 	Plus,
// 	Trash2,
// 	Video,
// 	ArrowUp,
// 	ArrowDown,
// 	Edit,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { v4 as uuidv4 } from "uuid";
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

// export const Route = createFileRoute(
// 	"/dashboard/instructor-portal/create-course",
// )({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	const [step, setStep] = useState<"tab1" | "tab2" | "modules">("tab1");
// 	const [courseData, setCourseData] = useState<
// 		Partial<TcreateLMSCourseSchema> & {
// 			instructorId?: string;
// 			thumbnailPreview?: string;
// 		}
// 	>({});
// 	const [expandedModules, setExpandedModules] = useState<string[]>([]);
// 	const moduleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
// 	const lessonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
// 	const [lastAddedModuleId, setLastAddedModuleId] = useState<string | null>(null);
// 	const [lastAddedLessonId, setLastAddedLessonId] = useState<string | null>(null);
// 	const [modules, setModules] = useState<TcreateLMSModuleSchema[]>([]);
// 	const [lessons, setLessons] = useState<TcreateLMSLessonSchema[]>([]);

// 	const tab1Form = useForm<{ title: string; thumbnail: File | null }>({
// 		defaultValues: { title: "", thumbnail: null },
// 	});

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

// 	const handleTab1Submit = (data: { title: string; thumbnail: File | null }) => {
// 		const slug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
// 		const thumbnailPreview = data.thumbnail ? URL.createObjectURL(data.thumbnail) : "";
// 		setCourseData({
// 			...courseData,
// 			title: data.title,
// 			slug,
// 			thumbnail: thumbnailPreview,
// 			thumbnailFile: data.thumbnail,
// 		});
// 		setStep("tab2");
// 		toast.success("Basic info saved! Proceed to details.");
// 	};

// 	const handleTab2Submit = (data: Pick<TcreateLMSCourseSchema, | "description" | "price" | "discount" | "level" | "duration" | "category" | "tags" | "requirements" | "whatYouLearn"> & { instructorId: string }) => {
// 		setCourseData({ ...courseData, ...data });
// 		toast.success("Course details saved! Now add modules and lessons.");
// 		setStep("modules");
// 	};

// 	const handleAddModule = () => {
// 		const newModule: TcreateLMSModuleSchema = {
// 			id: uuidv4(),
// 			title: "",
// 			description: "",
// 			orderIndex: modules.length,
// 			duration: undefined,
// 		};
// 		setModules([...modules, newModule]);
// 		setLastAddedModuleId(newModule.id);
// 		setExpandedModules((prev) => [...prev, newModule.id]);
// 	};

// 	const handleAddLesson = (moduleId: string) => {
// 		const moduleLessons = lessons.filter(l => l.moduleId === moduleId);
// 		const newLesson: TcreateLMSLessonSchema = {
// 			id: uuidv4(),
// 			moduleId,
// 			title: "",
// 			description: "",
// 			orderIndex: moduleLessons.length,
// 			contentType: "VIDEO_RECORDED",
// 			attachments: [],
// 			duration: undefined,
// 		};
// 		setLessons((prev) => [...prev, newLesson]);
// 		setLastAddedLessonId(newLesson.id);
// 	};

// 	const handleNavigateToQuiz = (lessonId: string, moduleId: string) => {
// 		const lesson = lessons.find(l => l.id === lessonId);
// 		const module = modules.find(m => m.id === moduleId);

// 		navigate({
// 			to: "/dashboard/instructor-portal/quiz-create",
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
// 		const moduleLessons = lessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);
// 		const currentIndex = moduleLessons.findIndex(l => l.id === lessonId);

// 		if (currentIndex > 0) {
// 			const updatedLessons = [...moduleLessons];
// 			[updatedLessons[currentIndex - 1], updatedLessons[currentIndex]] = [updatedLessons[currentIndex], updatedLessons[currentIndex - 1]];
// 			const reindexed = updatedLessons.map((lesson, idx) => ({ ...lesson, orderIndex: idx }));
// 			const otherLessons = lessons.filter(l => l.moduleId !== moduleId);
// 			setLessons([...otherLessons, ...reindexed]);
// 			toast.success("Lesson moved up");
// 		}
// 	};

// 	const handleMoveLessonDown = (lessonId: string, moduleId: string) => {
// 		const moduleLessons = lessons.filter(l => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);
// 		const currentIndex = moduleLessons.findIndex(l => l.id === lessonId);

// 		if (currentIndex < moduleLessons.length - 1) {
// 			const updatedLessons = [...moduleLessons];
// 			[updatedLessons[currentIndex], updatedLessons[currentIndex + 1]] = [updatedLessons[currentIndex + 1], updatedLessons[currentIndex]];
// 			const reindexed = updatedLessons.map((lesson, idx) => ({ ...lesson, orderIndex: idx }));
// 			const otherLessons = lessons.filter(l => l.moduleId !== moduleId);
// 			setLessons([...otherLessons, ...reindexed]);
// 			toast.success("Lesson moved down");
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
// 	}, [lastAddedLessonId, lessons]);

// 	const handleUpdateModule = (id: string, field: keyof TcreateLMSModuleSchema, value: any) => {
// 		setModules(modules.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
// 	};

// 	const handleDeleteModule = (id: string) => {
// 		setModules(modules.filter((m) => m.id !== id));
// 		setLessons(lessons.filter((l) => l.moduleId !== id));
// 		setExpandedModules(expandedModules.filter((mid) => mid !== id));
// 		toast.success("Module deleted");
// 	};

// 	const handleUpdateLesson = (id: string, field: keyof TcreateLMSLessonSchema, value: any) => {
// 		setLessons(lessons.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
// 	};

// 	const handleDeleteLesson = (id: string) => {
// 		const lesson = lessons.find(l => l.id === id);
// 		if (lesson) {
// 			const moduleLessons = lessons.filter(l => l.moduleId === lesson.moduleId && l.id !== id).sort((a, b) => a.orderIndex - b.orderIndex).map((l, idx) => ({ ...l, orderIndex: idx }));
// 			const otherLessons = lessons.filter(l => l.moduleId !== lesson.moduleId && l.id !== id);
// 			setLessons([...otherLessons, ...moduleLessons]);
// 			toast.success("Lesson deleted");
// 		}
// 	};

// 	const handleAddAttachment = (lessonId: string, file: File) => {
// 		setLessons((prev) => prev.map((l) => l.id === lessonId ? { ...l, attachments: [...l.attachments, file] } : l));
// 	};

// 	const handleRemoveAttachment = (lessonId: string, index: number) => {
// 		setLessons((prev) => prev.map((l) => l.id === lessonId ? { ...l, attachments: l.attachments.filter((_, i) => i !== index) } : l));
// 	};

// 	const handleDragEnd = (result: DropResult) => {
// 		if (!result.destination) return;
// 		if (result.type === "MODULES") {
// 			const reordered = Array.from(modules);
// 			const [moved] = reordered.splice(result.source.index, 1);
// 			reordered.splice(result.destination.index, 0, moved);
// 			const reindexed = reordered.map((m, idx) => ({ ...m, orderIndex: idx }));
// 			setModules(reindexed);
// 			toast.success("Module order updated");
// 		} else if (result.type === "LESSONS") {
// 			const moduleId = result.destination.droppableId;
// 			const moduleLessons = lessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.orderIndex - b.orderIndex);
// 			const reordered = Array.from(moduleLessons);
// 			const [moved] = reordered.splice(result.source.index, 1);
// 			reordered.splice(result.destination.index, 0, moved);
// 			const reindexed = reordered.map((l, idx) => ({ ...l, orderIndex: idx }));
// 			const other = lessons.filter((l) => l.moduleId !== moduleId);
// 			setLessons([...other, ...reindexed]);
// 			toast.success("Lesson order updated");
// 		}
// 	};

// 	const handleAutoSave = () => {};

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
// 								<FormField control={tab1Form.control} name="title" render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Course Title*</FormLabel>
// 										<FormControl><Input placeholder="e.g., Full Stack Web Development" {...field} className="h-10" /></FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)} />
// 								<FormField control={tab1Form.control} name="thumbnail" render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Thumbnail*</FormLabel>
// 										<FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0] || null)} className="h-10" /></FormControl>
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
// 											<FormControl><Input type="number" min={0} placeholder="e.g., 99" {...field} className="h-10" /></FormControl>
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
// 											<FormLabel>Duration (hours)*</FormLabel>
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
// 								<Button type="submit" size="lg" className="px-8">Submit & Continue</Button>
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
// 									<Button onClick={handleAddModule} className="flex items-center gap-2"><Plus className="w-4 h-4" />Add First Module</Button>
// 								</div>
// 							) : (
// 								<Droppable droppableId="modules" type="MODULES">
// 									{(provided) => (
// 										<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
// 											{modules.sort((a, b) => a.orderIndex - b.orderIndex).map((module, moduleIndex) => {
// 												const moduleLessons = lessons.filter((l) => l.moduleId === module.id).sort((a, b) => a.orderIndex - b.orderIndex);
// 												const isExpanded = expandedModules.includes(module.id);

// 												return (
// 													<div key={module.id} ref={(el) => (moduleRefs.current[module.id] = el)} className="border border-slate-400 rounded-xl">
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
// 															handleAutoSave={handleAutoSave}
// 														/>
// 													</div>
// 												);
// 											})}
// 											{provided.placeholder}
// 											<div className="flex justify-center py-4">
// 												<Button onClick={handleAddModule} variant="outline" className="flex items-center gap-2"><Plus className="w-5 h-5" />Add New Module</Button>
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
// 	handleAutoSave,
// }: {
// 	module: TcreateLMSModuleSchema;
// 	moduleIndex: number;
// 	isExpanded: boolean;
// 	toggleModuleExpansion: (id: string) => void;
// 	handleUpdateModule: (id: string, field: keyof TcreateLMSModuleSchema, value: any) => void;
// 	handleDeleteModule: (id: string) => void;
// 	handleAddLesson: (moduleId: string) => void;
// 	moduleLessons: TcreateLMSLessonSchema[];
// 	handleDeleteLesson: (id: string) => void;
// 	handleUpdateLesson: (id: string, field: keyof TcreateLMSLessonSchema, value: any) => void;
// 	handleAddAttachment: (lessonId: string, file: File) => void;
// 	handleRemoveAttachment: (lessonId: string, index: number) => void;
// 	handleNavigateToQuiz: (lessonId: string, moduleId: string) => void;
// 	handleMoveLessonUp: (lessonId: string, moduleId: string) => void;
// 	handleMoveLessonDown: (lessonId: string, moduleId: string) => void;
// 	handleContentTypeChange: (lessonId: string, value: string) => void;
// 	lessonRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
// 	handleAutoSave: () => void;
// }) {
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
// 												{module.duration && <span className="text-sm text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3" />{module.duration} hours</span>}
// 											</div>
// 										</div>
// 									</div>
// 								</div>
// 								<div className="space-y-2 mt-1">
// 									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Module Title</Label>
// 											<Input placeholder="e.g., Introduction to React" value={module.title} onChange={(e) => handleUpdateModule(module.id, "title", e.target.value)} onBlur={handleAutoSave} />
// 										</div>
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Order Index</Label>
// 											<Input type="number" min={0} value={module.orderIndex} onChange={(e) => handleUpdateModule(module.id, "orderIndex", Number(e.target.value))} onBlur={handleAutoSave} />
// 										</div>
// 									</div>
// 									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Duration (hours)</Label>
// 											<Input type="number" min={0} placeholder="e.g., 2" value={module.duration ?? ""} onChange={(e) => handleUpdateModule(module.id, "duration", e.target.value ? Number(e.target.value) : undefined)} onBlur={handleAutoSave} />
// 										</div>
// 										<div>
// 											<Label className="text-xs font-medium text-slate-700 mb-1 block">Description (optional)</Label>
// 											<Textarea placeholder="Module description..." value={module.description || ""} onChange={(e) => handleUpdateModule(module.id, "description", e.target.value)} onBlur={handleAutoSave} rows={2} />
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 					<div className="p-2 flex justify-between items-center bg-slate-50">
// 						<Button variant="outline" size="sm" onClick={() => handleAddLesson(module.id)} className="flex items-center gap-2"><Plus className="w-4 h-4" />Add Lesson</Button>
// 						<Button variant="ghost" size="sm" onClick={() => handleDeleteModule(module.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
// 					</div>
// 					<Collapsible open={isExpanded}>
// 						<CollapsibleContent>
// 							<div className="p-2 bg-slate-50 border-t-1 border-dashed border-slate-300">
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
// 													<div key={lesson.id} ref={(el) => (lessonRefs.current[lesson.id] = el)} className="border-2 border-transparent rounded-lg">
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
// 															handleAutoSave={handleAutoSave}
// 														/>
// 													</div>
// 												))}
// 												{provided.placeholder}
// 												<div className="flex justify-center py-2">
// 													<Button variant="outline" size="sm" onClick={() => handleAddLesson(module.id)} className="flex items-center gap-2"><Plus className="w-4 h-4" />Add Another Lesson</Button>
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
// 	handleAutoSave,
// 	courseTitle,
// 	moduleTitle,
// }: LessonItemProps) {
// 	const [quizModalOpen, setQuizModalOpen] = useState(false);
// 	const [selectedLessonForQuiz, setSelectedLessonForQuiz] = useState<{
// 		id: string;
// 		moduleId: string;
// 		title?: string;
// 	} | null>(null);
//     const navigate = useNavigate()

// 	const isVideo = lesson.contentType === "VIDEO_RECORDED";
// 	const isReading = lesson.contentType === "READING_MATERIAL";
// 	const isAssignment = lesson.contentType === "ASSIGNMENT";
// 	const isQuiz = lesson.contentType === "QUIZ";

// 	const handleSelectChange = (value: string) => {
// 		handleContentTypeChange(lesson.id, value);
// 	};

// const handleManageQuiz = () => {
//   navigate({
//     to: "/dashboard/instructor-portal/create-quiz",
//     search: {
//       lessonId: lesson.id,
//       moduleId: lesson.moduleId,
//       lessonTitle: lesson.title,
//       courseTitle,
//       moduleTitle,
//     },
//   })
// }

// 	return (
// 		<>
// 			<Draggable draggableId={lesson.id} index={lesson.orderIndex}>
// 				{(provided) => (
// 					<div
// 						ref={provided.innerRef}
// 						{...provided.draggableProps}
// 						className="bg-white rounded-lg border border-slate-300 p-3 shadow-sm"
// 					>
// 						<div className="flex items-start gap-3">
// 							<div
// 								{...provided.dragHandleProps}
// 								className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
// 							>
// 								<GripVertical className="w-5 h-5" />
// 							</div>

// 							<div className="flex-1 space-y-4">
// 								{/* Header */}
// 								<div className="flex items-center justify-between">
// 									<h5 className="font-semibold text-slate-900">
// 										Lesson {lessonNumber}: {lesson.title || "Untitled Lesson"}
// 									</h5>

// 									<div className="flex items-center gap-1">
// 										<Button
// 											variant="ghost"
// 											size="sm"
// 											onClick={() =>
// 												handleMoveLessonUp(lesson.id, lesson.moduleId)
// 											}
// 											disabled={lessonNumber === 1}
// 										>
// 											<ArrowUp className="w-4 h-4" />
// 										</Button>

// 										<Button
// 											variant="ghost"
// 											size="sm"
// 											onClick={() =>
// 												handleMoveLessonDown(lesson.id, lesson.moduleId)
// 											}
// 											disabled={lessonNumber === totalLessons}
// 										>
// 											<ArrowDown className="w-4 h-4" />
// 										</Button>

// 										<Button
// 											variant="ghost"
// 											size="sm"
// 											onClick={() => handleDeleteLesson(lesson.id)}
// 											className="text-red-500"
// 										>
// 											<Trash2 className="w-4 h-4" />
// 										</Button>
// 									</div>
// 								</div>

// 								{/* Core Fields */}
// 								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// 									<div>
// 										<Label>Lesson Title*</Label>
// 										<Input
// 											value={lesson.title}
// 											onChange={(e) =>
// 												handleUpdateLesson(lesson.id, "title", e.target.value)
// 											}
// 											onBlur={handleAutoSave}
// 										/>
// 									</div>

// 									<div>
// 										<Label>Content Type</Label>
// 										<Select
// 											value={lesson.contentType}
// 											onValueChange={handleSelectChange}
// 										>
// 											<SelectTrigger>
// 												<SelectValue />
// 											</SelectTrigger>
// 											<SelectContent>
// 												<SelectItem value="VIDEO_RECORDED">Video</SelectItem>
// 												<SelectItem value="READING_MATERIAL">
// 													Reading Material
// 												</SelectItem>
// 												<SelectItem value="ASSIGNMENT">Assignment</SelectItem>
// 												<SelectItem value="QUIZ">Quiz</SelectItem>
// 											</SelectContent>
// 										</Select>
// 									</div>

// 									<div>
// 										<Label>Order Index</Label>
// 										<Input
// 											type="number"
// 											value={lesson.orderIndex}
// 											onChange={(e) =>
// 												handleUpdateLesson(
// 													lesson.id,
// 													"orderIndex",
// 													Number(e.target.value)
// 												)
// 											}
// 											onBlur={handleAutoSave}
// 										/>
// 									</div>

// 									{isVideo && (
// 										<div>
// 											<Label>Duration (minutes)</Label>
// 											<Input
// 												type="number"
// 												value={lesson.duration ?? ""}
// 												onChange={(e) =>
// 													handleUpdateLesson(
// 														lesson.id,
// 														"duration",
// 														Number(e.target.value)
// 													)
// 												}
// 												onBlur={handleAutoSave}
// 											/>
// 										</div>
// 									)}
// 								</div>

// 								{/* Description (ALL) */}
// 								<div className="flex justify-between gap-4 px-2 items-center">

// 								{/* Attachments (ALL) */}
// 								<div>
// 									<Label>Attachments (PDF)</Label>
// 									<input
// 										type="file"
// 										accept="application/pdf"
// 										onChange={(e) => {
// 											const file = e.target.files?.[0];
// 											if (file) {
// 												handleAddAttachment(lesson.id, file);
// 												e.target.value = "";
// 											}
// 										}}
// 									/>

// 									<div className="mt-2 space-y-1">
// 										{lesson.attachments.map((file, i) => (
// 											<div
// 												key={i}
// 												className="flex justify-between bg-slate-100 px-2 py-1 rounded"
// 											>
// 												<span className="text-xs truncate">{file.name}</span>
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

// 								{/* Video Upload */}
// 								{isVideo && (
// 									<div>
// 										<Label>Lesson Video</Label>
// 										<input
// 											type="file"
// 											accept="video/*"
// 											onChange={(e) => {
// 												const file = e.target.files?.[0];
// 												if (file) {
// 													handleUpdateLesson(lesson.id, "video", file);
// 													e.target.value = "";
// 												}
// 											}}
// 										/>
// 									</div>
// 								)}
//                                 								<Label>Description</Label>
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
// 										onBlur={handleAutoSave}
// 									/>

//                                </div>
// 								{/* Rich Text (Reading + Assignment) */}
// 								{(isReading || isAssignment) && (
// 									<div>
// 										<Label>Content</Label>
// 										<RichTextEditor
// 											value={lesson.content || ""}
// 											onChange={(v) =>
// 												handleUpdateLesson(lesson.id, "content", v)
// 											}
// 											onBlur={handleAutoSave}
// 											height="180px"
// 										/>
// 									</div>
// 								)}

// 								{/* Quiz */}
// 								{isQuiz && (
// 									<div className="p-3 border rounded bg-amber-50 flex justify-between items-center">
// 										<div>
// 											<h4 className="font-medium text-amber-900">
// 												Quiz Assessment
// 											</h4>
// 											<p className="text-xs text-amber-700">
// 												Add or manage quiz questions
// 											</p>
// 										</div>
// 							<Button size="sm" onClick={handleManageQuiz}>
//                                 Manage Quiz
//                              </Button>

// 									</div>
// 								)}
// 							</div>
// 						</div>
// 					</div>
// 				)}
// 			</Draggable>

// 		</>
// 	);
// }

// export { LessonItem };

// export default RouteComponent;

