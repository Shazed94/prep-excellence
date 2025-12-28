"use client";
import type { DropResult } from "@hello-pangea/dnd";
import type {
	LMSLessonResponse,
	LMSModuleResponse,
	TcreateLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CourseBasicInfo } from "@/components/courses/course-basic-info";
import { CourseDetails } from "@/components/courses/course-details";
import { CourseModules } from "@/components/courses/course-modules";
import type {
	LocalLesson,
	LocalModule,
} from "@/components/courses/module-item";

import {
	useCreateCourse,
	useCreateLesson,
	useCreateModule,
	useDeleteLesson,
	useDeleteModule,
	useGetCourse, // SINGLE SOURCE OF TRUTH
	useUpdateLesson,
	useUpdateModule,
} from "@/hooks/lms-course";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-course",
)({
	component: RouteComponent,
});

type Step = "basic" | "details" | "modules";

interface CourseState {
	title: string;
	thumbnailFile: File | null;
	thumbnailPreview: string;
}

function RouteComponent() {
	const [step, setStep] = useState<Step>("basic");
	const [courseId, setCourseId] = useState<string | null>(null);
	const [courseState, setCourseState] = useState<CourseState>({
		title: "",
		thumbnailFile: null,
		thumbnailPreview: "",
	});
	const [courseDataForModules, setCourseDataForModules] = useState<
		Partial<TcreateLMSCourseSchema>
	>({});

	// Local state for modules and lessons (before saving to backend)
	const [localModules, setLocalModules] = useState<LocalModule[]>([]);
	const [localLessons, setLocalLessons] = useState<LocalLesson[]>([]);
	const [tempIdCounter, setTempIdCounter] = useState<number>(0);

	// Hooks
	const createCourseMutation = useCreateCourse();
	const createModuleMutation = useCreateModule();
	const createLessonMutation = useCreateLesson();
	const updateModuleMutation = useUpdateModule();
	const updateLessonMutation = useUpdateLesson();
	const deleteModuleMutation = useDeleteModule();
	const deleteLessonMutation = useDeleteLesson();

	// ========== SINGLE SOURCE OF TRUTH ==========
	// Fetch full course data (includes modules with lessons)
	const { data: courseData, isLoading: _isCourseLoading } = useGetCourse(
		courseId || "",
	);

	// Extract saved modules and lessons from course data
	const savedModules: LMSModuleResponse[] = useMemo(() => {
		return courseData?.modules || [];
	}, [courseData]);

	// Flatten all saved lessons from all modules
	const savedLessons: LMSLessonResponse[] = useMemo(() => {
		return savedModules.flatMap((module) => module.lessons || []);
	}, [savedModules]);

	// Combine saved and local (unsaved) modules
	const modules = useMemo(() => {
		return [...savedModules, ...localModules];
	}, [savedModules, localModules]);

	// Combine saved and local (unsaved) lessons
	const allLessons = useMemo(() => {
		return [...savedLessons, ...localLessons];
	}, [savedLessons, localLessons]);

	// ============ STEP 1: Basic Info ============
	const handleBasicInfoNext = (data: {
		title: string;
		thumbnail: File | null;
	}) => {
		const thumbnailPreview = data.thumbnail
			? URL.createObjectURL(data.thumbnail)
			: "";
		setCourseState({
			title: data.title,
			thumbnailFile: data.thumbnail,
			thumbnailPreview,
		});
		setStep("details");
		toast.success("Basic info saved!");
	};

	// ============ STEP 2: Course Details ============
	const handleDetailsNext = async (data: TcreateLMSCourseSchema) => {
		try {
			const response = await createCourseMutation.mutateAsync(data);
			setCourseId(response.id);
			setCourseDataForModules(data);
			setStep("modules");
		} catch (error) {
			console.error("Failed to create course:", error);
			throw error;
		}
	};

	const handleDetailsBack = () => {
		setStep("basic");
	};

	// ============ STEP 3: Modules & Lessons ============
	const handleAddModule = async () => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		// Create module locally with temporary ID
		const tempId = `temp-module-${tempIdCounter}`;
		setTempIdCounter((prev) => prev + 1);

		const newModule: LocalModule = {
			id: tempId,
			title: `Module ${modules.length + 1} (Unsaved)`,
			description: "",
			orderIndex: modules.length,
			courseId,
		};

		setLocalModules((prev) => [...prev, newModule]);
		toast.success(
			"Module added! Fill in the details and click Save Module to persist.",
		);
	};

	const handleAddLesson = async (moduleId: string) => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		// Create lesson locally with temporary ID
		const tempId = `temp-lesson-${tempIdCounter}`;
		setTempIdCounter((prev) => prev + 1);

		const moduleLessons = allLessons.filter((l) => l.moduleId === moduleId);

		const newLesson: LocalLesson = {
			id: tempId,
			title: `Lesson ${moduleLessons.length + 1} (Unsaved)`,
			description: undefined,
			orderIndex: moduleLessons.length,
			contentType: "VIDEO_RECORDED" as const,
			content: undefined,
			attachments: [],
			moduleId,
		};

		setLocalLessons((prev) => [...prev, newLesson]);
		toast.success(
			"Lesson added! Fill in the details and click Save Lesson to persist.",
		);
	};

	const handleUpdateModule = async (
		id: string,
		field: keyof Omit<LocalModule, "id" | "courseId">,
		value: any,
	) => {
		if (!courseId) return;

		// Check if it's a temporary (unsaved) module
		if (id.startsWith("temp-")) {
			// Update locally
			setLocalModules((prev) =>
				prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
			);
			return;
		}

		// It's a saved module - call API
		try {
			await updateModuleMutation.mutateAsync({
				moduleId: id,
				courseId,
				data: { [field]: value },
			});
		} catch {
			// Error handled by mutation
		}
	};

	const handleUpdateLesson = async (
		id: string,
		field: keyof Omit<LocalLesson, "id" | "moduleId">,
		value: any,
	) => {
		// Check if it's a temporary (unsaved) lesson
		if (id.startsWith("temp-")) {
			// Update locally
			setLocalLessons((prev) =>
				prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
			);
			return;
		}

		// It's a saved lesson - call API with courseId for refetch
		if (!courseId) return;

		try {
			await updateLessonMutation.mutateAsync({
				lessonId: id,
				courseId, // CRITICAL: Pass courseId to trigger refetch
				data: { [field]: value },
			});
		} catch {
			// Error handled by mutation
		}
	};

	const handleSaveLesson = async (lessonId: string) => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		// Find the lesson in local state
		const lesson = localLessons.find((l) => l.id === lessonId);
		if (!lesson) {
			toast.error("Lesson not found");
			return;
		}

		// Validate lesson data
		if (!lesson.title?.trim()) {
			toast.error("Lesson title is required");
			return;
		}

		try {
			// Call API to create lesson - includes courseId for query invalidation
			await createLessonMutation.mutateAsync({
				moduleId: lesson.moduleId,
				courseId, // CRITICAL: Pass courseId to trigger refetch
				data: {
					title: lesson.title,
					description: lesson.description || "", // Ensure description is always included
					orderIndex: lesson.orderIndex,
					contentType: lesson.contentType,
					content: lesson.content || "",
					attachments: lesson.attachments || [],
				},
			});

			// Remove from local state after successful save
			// The course data will be refetched automatically via query invalidation
			setLocalLessons((prev) => prev.filter((l) => l.id !== lessonId));

			toast.success("Lesson saved successfully!");
		} catch (error) {
			console.error("Failed to save lesson:", error);
			// Error handled by mutation
		}
	};

	const handleSaveModule = async (moduleId: string) => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		// Find the module in local state
		const module = localModules.find((m) => m.id === moduleId);
		if (!module) {
			toast.error("Module not found");
			return;
		}

		// Validate module data
		if (!module.title?.trim()) {
			toast.error("Module title is required");
			return;
		}

		try {
			// Call API to create module
			await createModuleMutation.mutateAsync({
				courseId,
				data: {
					title: module.title,
					description: module.description || "", // Ensure description is always included
					orderIndex: module.orderIndex,
				},
			});

			// Remove from local state after successful save
			setLocalModules((prev) => prev.filter((m) => m.id !== moduleId));

			toast.success("Module saved successfully!");
		} catch (error) {
			console.error("Failed to save module:", error);
			// Error handled by mutation
		}
	};

	const handleDeleteModule = async (id: string) => {
		if (!courseId) return;

		try {
			await deleteModuleMutation.mutateAsync({ moduleId: id, courseId });
		} catch {
			// Error handled by mutation
		}
	};

	const handleDeleteLesson = async (id: string) => {
		if (!courseId) return;

		try {
			await deleteLessonMutation.mutateAsync({ lessonId: id, courseId });
		} catch {
			// Error handled by mutation
		}
	};

	const handleDragEnd = async (result: DropResult) => {
		if (!result.destination || !courseId) return;

		if (result.type === "MODULES") {
			const reordered = Array.from(modules);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);

			// Build list of items that need updating (only saved modules)
			const itemsToUpdate = reordered
				.map((module, idx) => ({ module, newIndex: idx }))
				.filter(
					({ module, newIndex }) =>
						module.orderIndex !== newIndex && !module.id.startsWith("temp-"),
				);

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
				} catch (error) {
					console.error("Failed to update module order:", error);
					toast.error("Failed to update module order");
				}
			}
		} else if (result.type === "LESSONS") {
			const moduleId = result.destination.droppableId;
			const moduleLessons = allLessons
				.filter((l) => l.moduleId === moduleId)
				.sort((a, b) => a.orderIndex - b.orderIndex);

			const reordered = Array.from(moduleLessons);
			const [moved] = reordered.splice(result.source.index, 1);
			reordered.splice(result.destination.index, 0, moved);

			// Build list of items that need updating (only saved lessons)
			const itemsToUpdate = reordered
				.map((lesson, idx) => ({ lesson, newIndex: idx }))
				.filter(
					({ lesson, newIndex }) =>
						lesson.orderIndex !== newIndex && !lesson.id.startsWith("temp-"),
				);

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
				} catch (error) {
					console.error("Failed to update lesson order:", error);
					toast.error("Failed to update lesson order");
				}
			}
		}
	};

	const handleModulesBack = () => {
		setStep("details");
	};

	// Render based on current step
	if (step === "basic") {
		return (
			<CourseBasicInfo
				onNext={handleBasicInfoNext}
				isLoading={createCourseMutation.isPending}
			/>
		);
	}

	if (step === "details") {
		return (
			<CourseDetails
				courseTitle={courseState.title}
				thumbnailFile={courseState.thumbnailFile}
				onNext={handleDetailsNext}
				onBack={handleDetailsBack}
				isLoading={createCourseMutation.isPending}
			/>
		);
	}

	if (step === "modules") {
		return (
			<CourseModules
				courseId={courseId!}
				courseData={courseDataForModules}
				modules={modules}
				allLessons={allLessons}
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
			/>
		);
	}

	return null;
}

export default RouteComponent;
