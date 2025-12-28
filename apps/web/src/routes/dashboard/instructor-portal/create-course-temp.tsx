// "use client";
// import type { DropResult } from "@hello-pangea/dnd";
// import type { TcreateLMSCourseSchema } from "@prepexcellence/shared-validators";
// import { createFileRoute } from "@tanstack/react-router";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// import { CourseBasicInfo } from "@/components/courses/course-basic-info";
// import { CourseDetails } from "@/components/courses/course-details";
// import { CourseModules } from "@/components/courses/course-modules";
// import type {
// 	LocalLesson,
// 	LocalModule,
// } from "@/components/courses/module-item";

// import {
// 	useCreateCourse,
// 	useCreateLesson,
// 	useCreateModule,
// 	useDeleteLesson,
// 	useDeleteModule,
// 	useGetLessons,
// 	useGetModules,
// 	useUpdateLesson,
// 	useUpdateModule,
// } from "@/hooks/lms-course";

// export const Route = createFileRoute(
// 	"/dashboard/instructor-portal/create-course-temp",
// )({
// 	component: RouteComponent,
// });

// type Step = "basic" | "details" | "modules";

// interface CourseState {
// 	title: string;
// 	thumbnailFile: File | null;
// 	thumbnailPreview: string;
// }

// function RouteComponent() {
// 	const [step, setStep] = useState<Step>("basic");
// 	const [courseId, setCourseId] = useState<string | null>(null);
// 	const [courseState, setCourseState] = useState<CourseState>({
// 		title: "",
// 		thumbnailFile: null,
// 		thumbnailPreview: "",
// 	})
// 	const [courseDataForModules, setCourseDataForModules] = useState<
// 		Partial<TcreateLMSCourseSchema>
// 	>({});

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
// 	})

// 	// ============ STEP 1: Basic Info ============
// 	const handleBasicInfoNext = (data: {
// 		title: string;
// 		thumbnail: File | null;
// 	}) => {
// 		const thumbnailPreview = data.thumbnail
// 			? URL.createObjectURL(data.thumbnail)
// 			: ""
// 		setCourseState({
// 			title: data.title,
// 			thumbnailFile: data.thumbnail,
// 			thumbnailPreview,
// 		})
// 		setStep("details");
// 		toast.success("Basic info saved!");
// 	}

// 	// ============ STEP 2: Course Details ============
// 	const handleDetailsNext = async (data: TcreateLMSCourseSchema) => {
// 		try {
// 			const response = await createCourseMutation.mutateAsync(data);
// 			setCourseId(response.id);
// 			setCourseDataForModules(data);
// 			setStep("modules");
// 		} catch (error: any) {
// 			console.error("Failed to create course:", error);
// 			throw error;
// 		}
// 	}

// 	const handleDetailsBack = () => {
// 		setStep("basic");
// 	}

// 	// ============ STEP 3: Modules & Lessons ============
// 	const handleAddModule = async () => {
// 		if (!courseId) {
// 			toast.error("Course must be created first");
// 			return
// 		}

// 		const newModuleData = {
// 			title: `Module ${modules.length + 1}`,
// 			description: "",
// 			orderIndex: modules.length,
// 		}

// 		try {
// 			await createModuleMutation.mutateAsync({
// 				courseId,
// 				data: newModuleData,
// 			})
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	}

// 	const handleAddLesson = async (moduleId: string) => {
// 		if (!courseId) {
// 			toast.error("Course must be created first");
// 			return
// 		}

// 		const moduleLessons = allLessons.filter((l) => l.moduleId === moduleId);
// 		const newLessonData = {
// 			title: `Lesson ${moduleLessons.length + 1}`,
// 			description: "",
// 			orderIndex: moduleLessons.length,
// 			contentType: "VIDEO_RECORDED" as const,
// 			content: undefined,
// 			attachments: [],
// 		}

// 		try {
// 			await createLessonMutation.mutateAsync({
// 				moduleId,
// 				data: newLessonData,
// 			})
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	}

// 	const handleUpdateModule = async (
// 		id: string,
// 		field: keyof Omit<LocalModule, "id" | "courseId">,
// 		value: any,
// 	) => {
// 		if (!courseId) return;

// 		try {
// 			await updateModuleMutation.mutateAsync({
// 				moduleId: id,
// 				courseId,
// 				data: { [field]: value },
// 			})
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	}

// 	const handleUpdateLesson = async (
// 		id: string,
// 		field: keyof Omit<LocalLesson, "id" | "moduleId">,
// 		value: any,
// 	) => {
// 		try {
// 			await updateLessonMutation.mutateAsync({
// 				lessonId: id,
// 				data: { [field]: value },
// 			})
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	}

// 	const handleDeleteModule = async (id: string) => {
// 		try {
// 			await deleteModuleMutation.mutateAsync(id);
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	}

// 	const handleDeleteLesson = async (id: string) => {
// 		try {
// 			await deleteLessonMutation.mutateAsync(id);
// 		} catch (error) {
// 			// Error handled by mutation
// 		}
// 	}

// 	const handleDragEnd = (result: DropResult) => {
// 		if (!result.destination || !courseId) return;

// 		if (result.type === "MODULES") {
// 			const reordered = Array.from(modules);
// 			const [moved] = reordered.splice(result.source.index, 1);
// 			reordered.splice(result.destination.index, 0, moved);

// 			reordered.forEach((module, idx) => {
// 				if (module.orderIndex !== idx) {
// 					updateModuleMutation.mutateAsync({
// 						moduleId: module.id,
// 						courseId,
// 						data: { orderIndex: idx },
// 					})
// 				}
// 			})

// 			toast.success("Module order updated");
// 		} else if (result.type === "LESSONS") {
// 			const moduleId = result.destination.droppableId;
// 			const moduleLessons = allLessons
// 				.filter((l) => l.moduleId === moduleId)
// 				.sort((a, b) => a.orderIndex - b.orderIndex);

// 			const reordered = Array.from(moduleLessons);
// 			const [moved] = reordered.splice(result.source.index, 1);
// 			reordered.splice(result.destination.index, 0, moved);

// 			reordered.forEach((lesson, idx) => {
// 				if (lesson.orderIndex !== idx) {
// 					updateLessonMutation.mutateAsync({
// 						lessonId: lesson.id,
// 						data: { orderIndex: idx },
// 					})
// 				}
// 			})

// 			toast.success("Lesson order updated");
// 		}
// 	}

// 	const handleModulesBack = () => {
// 		setStep("details");
// 	}

// 	// Render based on current step
// 	if (step === "basic") {
// 		return (
// 			<CourseBasicInfo
// 				onNext={handleBasicInfoNext}
// 				isLoading={createCourseMutation.isPending}
// 			/>
// 		)
// 	}

// 	if (step === "details") {
// 		return (
// 			<CourseDetails
// 				courseTitle={courseState.title}
// 				thumbnailFile={courseState.thumbnailFile}
// 				onNext={handleDetailsNext}
// 				onBack={handleDetailsBack}
// 				isLoading={createCourseMutation.isPending}
// 			/>
// 		)
// 	}

// 	if (step === "modules") {
// 		return (
// 			<CourseModules
// 				courseId={courseId!}
// 				courseData={courseDataForModules}
// 				modules={modules}
// 				allLessons={allLessons}
// 				createModuleMutation={createModuleMutation}
// 				createLessonMutation={createLessonMutation}
// 				updateModuleMutation={updateModuleMutation}
// 				updateLessonMutation={updateLessonMutation}
// 				deleteModuleMutation={deleteModuleMutation}
// 				deleteLessonMutation={deleteLessonMutation}
// 				onAddModule={handleAddModule}
// 				onAddLesson={handleAddLesson}
// 				onUpdateModule={handleUpdateModule}
// 				onUpdateLesson={handleUpdateLesson}
// 				onDeleteModule={handleDeleteModule}
// 				onDeleteLesson={handleDeleteLesson}
// 				onDragEnd={handleDragEnd}
// 				onBack={handleModulesBack}
// 			/>
// 		)
// 	}

// 	return null;
// }

// export default RouteComponent;
