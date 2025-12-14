"use client";
import {
	DragDropContext,
	// Draggable,
	Droppable,
	type DropResult,
} from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createLMSCourseSchema,
	type TcreateLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	ChevronLeft,
	Clock,
	// ChevronDown,
	// ChevronRight,
	// FileText,
	// GripVertical,
	Plus,
	// Trash2,
	// Video,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import RichTextEditor from "@/components/jodit-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import {
// 	Collapsible,
// 	CollapsibleContent,
// 	CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// import { Textarea } from "@/components/ui/textarea";

type ModuleFormData = {
	id: string;
	title: string;
	description?: string;
	duration?: number;
	orderIndex: number;
};

type LessonFormData = {
	id: string;
	moduleId: string;
	title: string;
	description?: string;
	orderIndex: number;
	contentType: string;
	content?: string;
	attachments: File[]; // PDFs
	video?: File; // Video file
	duration?: number;
};

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-course",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const [step, setStep] = useState<"basic" | "details" | "modules">("basic");
	const [courseData, setCourseData] =
		useState<Partial<TcreateLMSCourseSchema> | null>(null);
	const [expandedModules, setExpandedModules] = useState<string[]>([]);

	// Refs for scrolling & focusing
	// const moduleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	// const lessonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	// const [lastAddedModuleId, setLastAddedModuleId] = useState<string | null>(
	// 	null,
	// );
	// const [lastAddedLessonId, setLastAddedLessonId] = useState<string | null>(
	// 	null,
	// );

	const stepsOrder = ["basic", "details", "modules"];
	const getStepClass = (stepName: typeof step) => {
		const currentIndex = stepsOrder.indexOf(step);
		const stepIndex = stepsOrder.indexOf(stepName);
		if (stepIndex < currentIndex) return "text-green-600 bg-green-100";
		if (stepIndex === currentIndex) return "text-blue-600 bg-blue-100";
		return "text-slate-400 bg-slate-100";
	};

	const basicForm = useForm<
		Pick<TcreateLMSCourseSchema, "title" | "slug" | "description">
	>({
		resolver: zodResolver(
			createLMSCourseSchema.pick({
				title: true,
				slug: true,
				description: true,
			}),
		),
		defaultValues: { title: "", slug: "", description: "" },
	});

	const detailsForm = useForm<TcreateLMSCourseSchema>({
		// resolver: zodResolver(createLMSCourseSchema),
		defaultValues: {
			title: courseData?.title ?? "",
			slug: courseData?.slug ?? "",
			description: courseData?.description ?? "",
			thumbnail: courseData?.thumbnail ?? "",
			price: courseData?.price ?? 0,
			discount: courseData?.discount ?? undefined,
			level: courseData?.level ?? "BEGINNER",
			duration: courseData?.duration ?? undefined,
			category: courseData?.category ?? "",
			tags: courseData?.tags ?? [],
			requirements: courseData?.requirements ?? [],
			whatYouLearn: courseData?.whatYouLearn ?? [],
		},
	});

	const [modules, setModules] = useState<ModuleFormData[]>([]);
	const [lessons, setLessons] = useState<LessonFormData[]>([]);

	const handleBasicSubmit = (
		data: Pick<TcreateLMSCourseSchema, "title" | "slug" | "description">,
	) => {
		setCourseData(data);
		setStep("details");
		toast.success("Course outline created! Now complete the details.");
	};

	const handleDetailsSubmit = (data: TcreateLMSCourseSchema) => {
		setCourseData(data);
		toast.success("Course created successfully! Now add modules and lessons.");
		setStep("modules");
	};

	const handleAddModule = () => {
		const newModule: ModuleFormData = {
			id: uuidv4(),
			title: "",
			description: "",
			orderIndex: modules.length,
			duration: undefined,
		};
		setModules([...modules, newModule]);
		// setLastAddedModuleId(newModule.id);
		setExpandedModules((prev) => [...prev, newModule.id]);
	};

	// const handleAddLesson = (moduleId: string) => {
	//   const newLesson: LessonFormData = {
	//     id: uuidv4(),
	//     moduleId,
	//     title: "",
	//     description: "",
	//     orderIndex: lessons.length, // Very high to appear at top
	//     contentType: "VIDEO_RECORDED",
	//     attachments: [],
	//     duration: undefined,
	//   };
	//   setLessons((prev) => [...prev, newLesson]);
	//   setLastAddedLessonId(newLesson.id);
	// };

	// Scroll to newly added module
	// useEffect(() => {
	// 	if (lastAddedModuleId && moduleRefs.current[lastAddedModuleId]) {
	// 		moduleRefs.current[lastAddedModuleId]?.scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "center",
	// 		});
	// 		setLastAddedModuleId(null);
	// 	}
	// }, [lastAddedModuleId, modules]);

	// Scroll to newly added lesson
	// useEffect(() => {
	// 	if (lastAddedLessonId && lessonRefs.current[lastAddedLessonId]) {
	// 		lessonRefs.current[lastAddedLessonId]?.scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "center",
	// 		});
	// 		setLastAddedLessonId(null);
	// 	}
	// }, [lastAddedLessonId, lessons]);

	//   const handleUpdateModule = (id: string, field: keyof ModuleFormData, value: any) => {
	//     setModules(modules.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
	//   };

	//   const handleDeleteModule = (id: string) => {
	//     setModules(modules.filter((m) => m.id !== id));
	//     setLessons(lessons.filter((l) => l.moduleId !== id));
	//     setExpandedModules(expandedModules.filter((mid) => mid !== id));
	//   };

	//   const handleUpdateLesson = (id: string, field: keyof LessonFormData, value: any) => {
	//     setLessons(lessons.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
	//   };

	//   const handleDeleteLesson = (id: string) => {
	//     setLessons(lessons.filter((l) => l.id !== id));
	//   };

	// const handleAddAttachment = (lessonId: string, file: File) => {
	//   setLessons((prev) =>
	//     prev.map((l) =>
	//       l.id === lessonId
	//         ? { ...l, attachments: [...l.attachments, file] }
	//         : l
	//     )
	//   )
	// }

	// const handleRemoveAttachment = (lessonId: string, index: number) => {
	//   setLessons((prev) =>
	//     prev.map((l) =>
	//       l.id === lessonId
	//         ? {
	//             ...l,
	//             attachments: l.attachments.filter((_, i) => i !== index),
	//           }
	//         : l
	//     )
	//   )
	// }

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) return;

		if (result.type === "MODULES") {
			const reordered = Array.from(modules);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);
			// reordered.forEach((m, i) => (m.orderIndex = i));
			setModules(reordered);
		} else if (result.type === "LESSONS") {
			const moduleId = result.destination.droppableId;
			const moduleLessons = lessons
				.filter((l) => l.moduleId === moduleId)
				.sort((a, b) => a.orderIndex - b.orderIndex); // newest on top
			const reordered = Array.from(moduleLessons);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);
			// reordered.forEach((l, i) => (l.orderIndex = reordered.length - 1 - i));
			const other = lessons.filter((l) => l.moduleId !== moduleId);
			setLessons([...other, ...reordered]);
		}
	};

	const handleSaveAll = () => {
		if (!courseData) return toast.error("Course data missing");
		const invalidModules = modules.filter((m) => !m.title.trim());
		if (invalidModules.length > 0)
			return toast.error("All modules need titles");
		const invalidLessons = lessons.filter((l) => !l.title.trim());
		if (invalidLessons.length > 0)
			return toast.error("All lessons need titles");

		toast.success("All content saved successfully!");
		setCourseData(null);
		setModules([]);
		setLessons([]);
		setExpandedModules([]);
		setStep("basic");
		basicForm.reset();
		detailsForm.reset();
	};

	// const toggleModuleExpansion = (moduleId: string) => {
	// 	setExpandedModules((prev) =>
	// 		prev.includes(moduleId)
	// 			? prev.filter((id) => id !== moduleId)
	// 			: [...prev, moduleId],
	// 	);
	// };

	return (
		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
			{/* Header & Progress */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
						{step === "basic"
							? "Create New Course - Basic Info"
							: step === "details"
								? "Course Details"
								: "Add Modules and Lessons"}
					</h1>
					<p className="text-slate-600">
						{step === "basic"
							? "Start with title and short description"
							: step === "details"
								? "Complete the course details"
								: `Organize content for "${courseData?.title}"`}
					</p>
				</div>
				<Link
					to={"/dashboard/" as "/"}
					className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					<ChevronLeft className="w-4 h-4 mr-2" />
					Back
				</Link>
			</div>

			<div className="mb-8">
				<div className="flex items-center">
					<div className="flex items-center">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass("basic")}`}
						>
							1
						</div>
						<span className="ml-2 font-medium">Basic Info</span>
					</div>
					<div className="flex-1 h-0.5 bg-slate-200 mx-4" />
					<div className="flex items-center">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass("details")}`}
						>
							2
						</div>
						<span className="ml-2 font-medium">Course Details</span>
					</div>
					<div className="flex-1 h-0.5 bg-slate-200 mx-4" />
					<div className="flex items-center">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepClass("modules")}`}
						>
							3
						</div>
						<span className="ml-2 font-medium">Modules & Lessons</span>
					</div>
				</div>
			</div>

			{/* Steps Content */}
			{/* {step === "basic" && ( */}
			<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
				<Form {...basicForm}>
					<form
						onSubmit={basicForm.handleSubmit(handleBasicSubmit)}
						className="space-y-6"
					>
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-900">
								Basic Information
							</h2>
							<FormField
								control={basicForm.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Course Title*</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Full Stack Web Development"
												{...field}
												className="h-10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex  items-center justify-baseline gap-4">
								<FormField
									control={basicForm.control}
									name="slug"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Slug*</FormLabel>
											<FormControl>
												<Input
													placeholder="full-stack-web-development"
													{...field}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Select>
									Instructor ID:
									<SelectTrigger className="h-10">
										Instructor ID
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ABC">1</SelectItem>
										<SelectItem value="XYZ">2</SelectItem>
										<SelectItem value="dsd">3</SelectItem>
										<SelectItem value="dfsc">4</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<FormField
								control={basicForm.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Short Description*</FormLabel>
										<FormControl>
											<RichTextEditor
												value={field.value}
												onChange={field.onChange}
												height="200px"
												minHeight="150px"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex justify-end pt-6 border-t">
							<Button type="submit" size="lg" className="px-8">
								Continue to Details
							</Button>
						</div>
					</form>
				</Form>
			</div>
			{/* )} */}

			{/* {step === "details" && ( */}
			<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
				<Form {...detailsForm}>
					<form
						onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)}
						className="space-y-6"
					>
						{/* Detail fields unchanged */}
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-900">
								Basic Information
							</h2>
							{/* ... (same as before) */}
						</div>
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-900">
								Additional Information
							</h2>
							{/* ... */}
						</div>
						<div className="space-y-6">
							<h2 className="text-xl font-semibold text-slate-900">
								Course Details
							</h2>
							{/* ... */}
						</div>
						<div className="flex justify-end pt-6 border-t">
							<Button type="submit" size="lg" className="px-8">
								Create Course & Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
			{/* // )} */}

			{/* {step === "modules" && ( */}
			<div className="space-y-8">
				{/* Course Summary */}
				<div className="bg-white rounded-xl border border-slate-200 p-6">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<BookOpen className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<h2 className="text-2xl font-bold text-slate-900">
									{courseData?.title}
								</h2>
								<p className="text-slate-600 mt-1 line-clamp-2">
									{courseData?.description
										?.replace(/<[^>]*>/g, "")
										.substring(0, 100)}
									...
								</p>
								<div className="flex items-center gap-3 mt-2">
									<Badge variant="outline" className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{courseData?.duration || 0} hours
									</Badge>
									<Badge variant="secondary">{courseData?.level}</Badge>
									<span className="text-slate-700 font-medium">
										{courseData?.discount
											? `$${courseData.discount}`
											: `$${courseData?.price}`}
										{courseData?.discount && (
											<span className="ml-2 text-sm text-slate-400 line-through">
												${courseData?.price}
											</span>
										)}
									</span>
								</div>
							</div>
						</div>
						<Button
							variant="outline"
							onClick={() => setStep("details")}
							className="h-10"
						>
							Edit Course
						</Button>
					</div>
				</div>

				<DragDropContext onDragEnd={handleDragEnd}>
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-xl font-semibold text-slate-900">
									Course Modules
								</h3>
								<p className="text-slate-600">
									Add modules and lessons to organize your course content
								</p>
							</div>
						</div>
						{/* {modules.length === 0 ? ( */}
						<div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
							<div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<BookOpen className="w-8 h-8 text-slate-400" />
							</div>
							<h3 className="text-lg font-semibold text-slate-900 mb-2">
								No modules yet
							</h3>
							<p className="text-slate-600 mb-4">
								Start by adding your first module
							</p>
							<Button
								onClick={handleAddModule}
								className="flex items-center gap-2"
							>
								<Plus className="w-4 h-4" />
								Add First Module
							</Button>
						</div>
						{/* ) : ( */}
						<Droppable droppableId="modules" type="MODULES">
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="space-y-6"
								>
									{modules
										.sort((a, b) => a.orderIndex - b.orderIndex)
										.map((module, _moduleIndex) => {
											const _moduleLessons = lessons
												.filter((l) => l.moduleId === module.id)
												.sort((a, b) => a.orderIndex - b.orderIndex); // newest on top
											const _isExpanded = expandedModules.includes(module.id);

											return (
												<div
													key={module.id}
													// ref={(el) => (moduleRefs.current[module.id] = el)}
													className="border-2 border-dashed border-transparent rounded-xl"
												>
													{/* <ModuleItem
                                module={module}
                                moduleIndex={moduleIndex}
                                isExpanded={isExpanded}
                                toggleModuleExpansion={toggleModuleExpansion}
                                handleUpdateModule={handleUpdateModule}
                                handleDeleteModule={handleDeleteModule}
                                handleAddLesson={handleAddLesson}
                                moduleLessons={moduleLessons}
                                handleDeleteLesson={handleDeleteLesson}
                                handleUpdateLesson={handleUpdateLesson}
                                // handleAddAttachment={handleAddAttachment}
                                handleRemoveAttachment={handleRemoveAttachment}
                                lessonRefs={lessonRefs}
                              /> */}
												</div>
											);
										})}
									{provided.placeholder}

									{/* Add Module Button at the very bottom */}
									<div className="flex justify-center py-4">
										<Button
											onClick={handleAddModule}
											variant="outline"
											className="flex items-center gap-2"
										>
											<Plus className="w-5 h-5" />
											Add New Module
										</Button>
									</div>
								</div>
							)}
						</Droppable>
						{/* )} */}
					</div>
				</DragDropContext>

				<div className="flex justify-end gap-4 pt-6 border-t">
					<Button
						variant="outline"
						onClick={() => setStep("details")}
						size="lg"
					>
						Back to Details
					</Button>
					<Button onClick={handleSaveAll} size="lg" className="px-8">
						Save All Content
					</Button>
				</div>
			</div>
			{/* )} */}
		</div>
	);
}

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
// 	lessonRefs,
// }: {
// 	module: ModuleFormData;
// 	moduleIndex: number;
// 	isExpanded: boolean;
// 	toggleModuleExpansion: (id: string) => void;
// 	handleUpdateModule: (
// 		id: string,
// 		field: keyof ModuleFormData,
// 		value: any,
// 	) => void;
// 	handleDeleteModule: (id: string) => void;
// 	handleAddLesson: (moduleId: string) => void;
// 	moduleLessons: LessonFormData[];
// 	handleDeleteLesson: (id: string) => void;
// 	handleUpdateLesson: (
// 		id: string,
// 		field: keyof LessonFormData,
// 		value: any,
// 	) => void;
// 	handleAddAttachment: (lessonId: string, url: string) => void;
// 	handleRemoveAttachment: (lessonId: string, index: number) => void;
// 	lessonRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
// }) {
// 	return (
// 		<Draggable draggableId={module.id} index={moduleIndex}>
// 			{(provided) => (
// 				<div
// 					ref={provided.innerRef}
// 					{...provided.draggableProps}
// 					className="bg-white rounded-xl border border-slate-300 shadow-sm"
// 				>
// 					<div className="p-6 border-b border-slate-200">
// 						<div className="flex items-start gap-3">
// 							<div
// 								{...provided.dragHandleProps}
// 								className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
// 							>
// 								<GripVertical className="w-5 h-5" />
// 							</div>
// 							<div className="flex-1">
// 								<div className="flex items-center justify-between mb-4">
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
// 											<div className="flex items-center gap-2">
// 												<h3 className="text-lg font-semibold text-slate-900">
// 													Module {moduleIndex + 1}:{" "}
// 													{module.title || "Untitled Module"}
// 												</h3>
// 												{!module.title && (
// 													<Badge variant="destructive" className="text-xs">
// 														Needs title
// 													</Badge>
// 												)}
// 											</div>
// 											<div className="flex items-center gap-3 mt-1">
// 												<span className="text-sm text-slate-600 flex items-center gap-1">
// 													<Video className="w-3 h-3" />
// 													{moduleLessons.length}{" "}
// 													{moduleLessons.length === 1 ? "lesson" : "lessons"}
// 												</span>
// 												{module.duration && (
// 													<span className="text-sm text-slate-600 flex items-center gap-1">
// 														<Clock className="w-3 h-3" />
// 														{module.duration} hours
// 													</span>
// 												)}
// 											</div>
// 										</div>
// 									</div>
// 								</div>

// 								<div className="space-y-4 mt-6">
// 									<div className="grid grid-cols-2 gap-4">
// 										<div>
// 											<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 												Module Title
// 											</Label>
// 											<Input
// 												placeholder="e.g., Introduction to React"
// 												value={module.title}
// 												onChange={(e) =>
// 													handleUpdateModule(module.id, "title", e.target.value)
// 												}
// 												className="h-10"
// 											/>
// 										</div>
// 										<div>
// 											<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 												Order Index
// 											</Label>
// 											<Input
// 												type="number"
// 												min={0}
// 												value={module.orderIndex}
// 												onChange={(e) =>
// 													handleUpdateModule(
// 														module.id,
// 														"orderIndex",
// 														Number(e.target.value),
// 													)
// 												}
// 												className="h-10"
// 											/>
// 										</div>
// 									</div>
// 									<div className="grid grid-cols-2 gap-4">
// 										<div>
// 											<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 												Description (optional)
// 											</Label>
// 											<Textarea
// 												placeholder="Module description..."
// 												value={module.description || ""}
// 												onChange={(e) =>
// 													handleUpdateModule(
// 														module.id,
// 														"description",
// 														e.target.value,
// 													)
// 												}
// 												rows={2}
// 											/>
// 										</div>
// 										<div>
// 											<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 												Duration (hours)
// 											</Label>
// 											<Input
// 												type="number"
// 												min={0}
// 												placeholder="e.g., 2"
// 												value={module.duration ?? ""}
// 												onChange={(e) =>
// 													handleUpdateModule(
// 														module.id,
// 														"duration",
// 														e.target.value ? Number(e.target.value) : undefined,
// 													)
// 												}
// 												className="h-10"
// 											/>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>

// 						<div className="p-4 flex justify-between items-center bg-slate-50">
// 							<Button
// 								variant="outline"
// 								size="sm"
// 								onClick={() => handleAddLesson(module.id)}
// 								className="flex items-center gap-2"
// 							>
// 								<Plus className="w-4 h-4" />
// 								Add Lesson
// 							</Button>
// 							<Button
// 								variant="ghost"
// 								size="sm"
// 								onClick={() => handleDeleteModule(module.id)}
// 								className="text-red-500 hover:text-red-600 hover:bg-red-50"
// 							>
// 								<Trash2 className="w-4 h-4" />
// 							</Button>
// 						</div>
// 					</div>

// 					<Collapsible open={isExpanded}>
// 						<CollapsibleContent>
// 							<div className="p-6 bg-slate-50 border-t-2 border-dashed border-slate-300">
// 								{moduleLessons.length === 0 ? (
// 									<div className="text-center py-8">
// 										<div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
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
// 														// ref={(el) => (lessonRefs.current[lesson.id] = el)}
// 														className="border-2 border-dashed border-transparent rounded-lg"
// 													>
// 														<LessonItem
// 															lesson={lesson}
// 															lessonNumber={lessonIndex + 1}
// 															handleDeleteLesson={handleDeleteLesson}
// 															handleUpdateLesson={handleUpdateLesson}
// 															handleAddAttachment={handleAddAttachment}
// 															handleRemoveAttachment={handleRemoveAttachment}
// 														/>
// 													</div>
// 												))}
// 												{provided.placeholder}

// 												{/* Add Lesson Button inside module, at bottom */}
// 												<div className="flex justify-center py-3">
// 													<Button
// 														variant="outline"
// 														size="sm"
// 														onClick={() => handleAddLesson(module.id)}
// 														className="flex items-center gap-2"
// 													>
// 														<Plus className="w-4 h-4" />
// 														Add Another Lesson
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
// 	handleDeleteLesson,
// 	handleUpdateLesson,
// 	handleAddAttachment,
// 	handleRemoveAttachment,
// }: {
// 	lesson: LessonFormData;
// 	lessonNumber: number;
// 	handleDeleteLesson: (id: string) => void;
// 	handleUpdateLesson: (
// 		id: string,
// 		field: keyof LessonFormData,
// 		value: any,
// 	) => void;
// 	handleAddAttachment: (lessonId: string, url: string) => void;
// 	handleRemoveAttachment: (lessonId: string, index: number) => void;
// }) {
// 	return (
// 		<Draggable draggableId={lesson.id} index={0}>
// 			{(provided) => (
// 				<div
// 					ref={provided.innerRef}
// 					{...provided.draggableProps}
// 					className="bg-white rounded-lg border border-slate-300 p-5 shadow-sm"
// 				>
// 					<div className="flex items-start gap-3">
// 						<div
// 							{...provided.dragHandleProps}
// 							className="cursor-move text-slate-400 hover:text-slate-600 mt-1"
// 						>
// 							<GripVertical className="w-5 h-5" />
// 						</div>
// 						<div className="flex-1 space-y-5">
// 							<div className="flex items-center justify-between">
// 								<div className="flex items-center gap-3">
// 									<div
// 										className={`w-7 h-7 rounded flex items-center justify-center ${
// 											lesson.contentType === "VIDEO_RECORDED"
// 												? "bg-blue-100"
// 												: lesson.contentType === "READING_MATERIAL"
// 													? "bg-green-100"
// 													: "bg-yellow-100"
// 										}`}
// 									>
// 										{lesson.contentType === "VIDEO_RECORDED" ? (
// 											<Video className="w-4 h-4 text-blue-600" />
// 										) : (
// 											<FileText className="w-4 h-4 text-green-600" />
// 										)}
// 									</div>
// 									<h5 className="font-semibold text-slate-900">
// 										Lesson {lessonNumber}: {lesson.title || "Untitled Lesson"}
// 									</h5>
// 									{!lesson.title && (
// 										<Badge variant="destructive" className="text-xs">
// 											Needs title
// 										</Badge>
// 									)}
// 								</div>
// 								<Button
// 									variant="ghost"
// 									size="sm"
// 									onClick={() => handleDeleteLesson(lesson.id)}
// 									className="text-red-500 hover:text-red-600 hover:bg-red-50"
// 								>
// 									<Trash2 className="w-4 h-4" />
// 								</Button>
// 							</div>

// 							<div className="grid grid-cols-4 gap-4">
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Lesson Title*
// 									</Label>
// 									<Input
// 										placeholder="e.g., Introduction to Components"
// 										value={lesson.title}
// 										onChange={(e) =>
// 											handleUpdateLesson(lesson.id, "title", e.target.value)
// 										}
// 										className="h-10"
// 									/>
// 								</div>
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Content Type
// 									</Label>
// 									<Select
// 										value={lesson.contentType}
// 										onValueChange={(v) =>
// 											handleUpdateLesson(lesson.id, "contentType", v)
// 										}
// 									>
// 										<SelectTrigger className="h-10">
// 											<SelectValue />
// 										</SelectTrigger>
// 										<SelectContent>
// 											<SelectItem value="VIDEO_RECORDED">Video</SelectItem>
// 											<SelectItem value="READING_MATERIAL">
// 												Reading Material
// 											</SelectItem>
// 											<SelectItem value="QUIZ">Quiz</SelectItem>
// 											<SelectItem value="ASSIGNMENT">Assignment</SelectItem>
// 										</SelectContent>
// 									</Select>
// 								</div>
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Order Index
// 									</Label>
// 									<Input
// 										type="number"
// 										min={0}
// 										value={lesson.orderIndex}
// 										onChange={(e) =>
// 											handleUpdateLesson(
// 												lesson.id,
// 												"orderIndex",
// 												Number(e.target.value),
// 											)
// 										}
// 										className="h-10"
// 									/>
// 								</div>
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Description
// 									</Label>
// 									<Textarea
// 										placeholder="Brief lesson description..."
// 										value={lesson.description || ""}
// 										onChange={(e) =>
// 											handleUpdateLesson(
// 												lesson.id,
// 												"description",
// 												e.target.value,
// 											)
// 										}
// 										rows={2}
// 									/>
// 								</div>
// 							</div>

// 							<div className="grid grid-cols-4 gap-4">
// 								{/* PDF Attachments */}
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Attachments (PDF)
// 									</Label>

// 									<input
// 										type="file"
// 										accept="application/pdf"
// 										className="block w-full text-sm file:mr-4 file:py-2 file:px-4
//                  file:rounded-md file:border-0
//                  file:text-sm file:font-medium
//                  file:bg-slate-100 file:text-slate-700
//                  hover:file:bg-slate-200"
// 										onChange={(e) => {
// 											const file = e.target.files?.[0];
// 											if (file) {
// 												// Assuming handleAddAttachment accepts File or url string
// 												// If it expects url, you may need to upload first or use URL.createObjectURL(file)
// 												handleAddAttachment(
// 													lesson.id,
// 													URL.createObjectURL(file),
// 												); // or file itself if backend handles
// 												e.target.value = "";
// 											}
// 										}}
// 									/>

// 									{/* Uploaded PDFs */}
// 									<div className="space-y-2 mt-2">
// 										{lesson.attachments.map((file, i) => (
// 											<div
// 												key={i}
// 												className="flex items-center justify-between bg-slate-100 rounded px-3 py-2"
// 											>
// 												<span className="text-sm truncate">{file.name}</span>
// 												<Button
// 													variant="ghost"
// 													size="sm"
// 													onClick={() => handleRemoveAttachment(lesson.id, i)}
// 													className="h-6 w-6 p-0 text-red-500"
// 												>
// 													×
// 												</Button>
// 											</div>
// 										))}
// 									</div>
// 								</div>

// 								{/* Video Upload */}
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Lesson Video
// 									</Label>

// 									<input
// 										type="file"
// 										accept="video/*"
// 										className="block w-full text-sm file:mr-4 file:py-2 file:px-4
//                  file:rounded-md file:border-0
//                  file:text-sm file:font-medium
//                  file:bg-slate-100 file:text-slate-700
//                  hover:file:bg-slate-200"
// 										onChange={(e) => {
// 											const file = e.target.files?.[0];
// 											if (file) {
// 												handleUpdateLesson(lesson.id, "video", file);
// 												e.target.value = "";
// 											}
// 										}}
// 									/>

// 									{lesson.video && (
// 										<p className="text-sm text-slate-600 mt-2 truncate">
// 											🎬 {lesson.video.name}
// 										</p>
// 									)}
// 								</div>

// 								{/* Duration */}
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Duration (minutes)
// 									</Label>
// 									<Input
// 										type="number"
// 										min={0}
// 										placeholder="45"
// 										value={lesson.duration ?? ""}
// 										onChange={(e) =>
// 											handleUpdateLesson(
// 												lesson.id,
// 												"duration",
// 												e.target.value ? Number(e.target.value) : undefined,
// 											)
// 										}
// 										className="h-10"
// 									/>
// 								</div>
// 							</div>
// 							{lesson.contentType === "READING_MATERIAL" && (
// 								<div>
// 									<Label className="text-sm font-medium text-slate-700 mb-1 block">
// 										Content
// 									</Label>
// 									<RichTextEditor
// 										value={lesson.content || ""}
// 										onChange={(v) =>
// 											handleUpdateLesson(lesson.id, "content", v)
// 										}
// 										height="180px"
// 									/>
// 								</div>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</Draggable>
// 	);
// }

export default RouteComponent;
