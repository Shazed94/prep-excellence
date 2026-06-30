import type { DropResult } from "@hello-pangea/dnd";
import type {
	LMSLessonResponse,
	LMSModuleResponse,
	TcreateLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
	useUpdateCourse,
	useUpdateLesson,
	useUpdateModule,
} from "@/hooks/lms-course";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-course",
)({
	component: RouteComponent,
	validateSearch: (search: Record<string, any>) => ({
		courseId: search.courseId as string | undefined,
	}),
});

type Step = "basic" | "details" | "modules";

interface CourseState {
	title: string;
	thumbnailFile: File | null;
	thumbnailPreview: string;
}

function RouteComponent() {
	const searchParams = useSearch({ from: Route.id });
	const editCourseId = searchParams.courseId;
	const isEditMode = !!editCourseId;

	const [step, setStep] = useState<Step>("basic");
	const [courseId, setCourseId] = useState<string | null>(editCourseId || null);
	const [courseState, setCourseState] = useState<CourseState>({
		title: "",
		thumbnailFile: null,
		thumbnailPreview: "",
	});
	const [courseDataForModules, setCourseDataForModules] = useState<
		Partial<TcreateLMSCourseSchema>
	>({});

	// Hooks
	const createCourseMutation = useCreateCourse();
	const updateCourseMutation = useUpdateCourse();
	const createModuleMutation = useCreateModule();
	const createLessonMutation = useCreateLesson();
	const updateModuleMutation = useUpdateModule();
	const updateLessonMutation = useUpdateLesson();
	const deleteModuleMutation = useDeleteModule();
	const deleteLessonMutation = useDeleteLesson();

	// ========== SINGLE SOURCE OF TRUTH ==========
	// Fetch full course data (includes modules with lessons)
	const { data: courseData, isLoading: isCourseLoading } = useGetCourse(
		courseId || "",
	);

	// In edit mode, pre-populate form with existing data
	useEffect(() => {
		if (isEditMode && courseData && !courseState.title) {
			setCourseState({
				title: courseData.title || "",
				thumbnailFile: null, // File objects can't be persisted
				thumbnailPreview: courseData.thumbnail || "",
			});

			// Pre-populate course data for details form
			setCourseDataForModules({
				title: courseData.title,
				description: courseData.description,
				category: courseData.category,
				level: courseData.level,
				instructorId: courseData.instructorId,
				price: courseData.price,
				discount: courseData.discount ?? undefined,
				duration: courseData.duration ?? undefined,
				tags: courseData.tags,
				requirements: courseData.requirements,
				whatYouLearn: courseData.whatYouLearn,
			});

			// Skip to modules step since we already have the course
			setStep("modules");
		}
	}, [isEditMode, courseData, courseState.title]);

	// Extract saved modules and lessons from course data
	const savedModules: LMSModuleResponse[] = useMemo(() => {
		return courseData?.modules || [];
	}, [courseData]);

	// Flatten all saved lessons from all modules
	const savedLessons: LMSLessonResponse[] = useMemo(() => {
		return savedModules.flatMap((module) => module.lessons || []);
	}, [savedModules]);

	// Use saved modules and lessons directly (all data comes from API now)
	const modules = savedModules;
	const allLessons = savedLessons;
	// Show loading when editing and fetching course data
	if (isEditMode && isCourseLoading) {
		return (
			<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10 min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full"></div>
					<p className="text-slate-600 mt-4">Loading course data...</p>
				</div>
			</div>
		);
	}
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
			if (isEditMode && courseId) {
				// Update existing course
				await updateCourseMutation.mutateAsync({
					courseId,
					data,
				});
				setCourseDataForModules(data);
				setStep("modules");
			} else {
				// Create new course
				const response = await createCourseMutation.mutateAsync(data);
				setCourseId(response.id);
				setCourseDataForModules(data);
				setStep("modules");
			}
		} catch (error) {
			console.error("Failed to save course:", error);
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

		try {
			// Immediately create module with default values
			await createModuleMutation.mutateAsync({
				courseId,
				data: {
					title: `Module ${modules.length + 1}`,
					description: "",
					orderIndex: modules.length,
				},
			});

			toast.success("Module added successfully!");
		} catch (error) {
			console.error("Failed to add module:", error);
			// Error handled by mutation
		}
	};

	const handleAddLesson = async (moduleId: string) => {
		if (!courseId) {
			toast.error("Course must be created first");
			return;
		}

		const moduleLessons = allLessons.filter((l) => l.moduleId === moduleId);

		try {
			// Immediately create lesson with default values
			await createLessonMutation.mutateAsync({
				moduleId,
				courseId,
				data: {
					title: `Lesson ${moduleLessons.length + 1}`,
					description: "",
					orderIndex: moduleLessons.length,
					contentType: "VIDEO_RECORDED" as const,
					content: "",
					attachments: [],
				},
			});

			toast.success("Lesson added successfully!");
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
		if (!courseId) return;

		// Always call API since all modules are saved
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
		// Always call API since all lessons are saved
		if (!courseId) return;

		// Map frontend field names to API field names
		const apiField = field === "lessonType" ? "contentType" : field;

		try {
			await updateLessonMutation.mutateAsync({
				lessonId: id,
				courseId, // CRITICAL: Pass courseId to trigger refetch
				data: { [apiField]: value },
			});
		} catch {
			// Error handled by mutation
		}
	};

	const handleSaveLesson = async (_lessonId: string) => {
		// This function is no longer needed - lessons are saved immediately
		// Kept for backward compatibility if the component still calls it
		return;
	};

	const handleSaveModule = async (_moduleId: string) => {
		// This function is no longer needed - modules are saved immediately
		// Kept for backward compatibility if the component still calls it
		return;
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

			// Build list of items that need updating (all modules are saved now)
			const itemsToUpdate = reordered
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
				isLoading={
					createCourseMutation.isPending || updateCourseMutation.isPending
				}
				isEditMode={isEditMode}
				initialTitle={courseState.title}
				initialThumbnailPreview={courseState.thumbnailPreview}
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
				isLoading={
					createCourseMutation.isPending || updateCourseMutation.isPending
				}
				isEditMode={isEditMode}
				initialData={courseDataForModules}
			/>
		);
	}

	if (step === "modules") {
		return (
			<CourseModules
				courseId={courseId!}
				courseData={courseDataForModules}
				modules={modules as any}
				allLessons={allLessons as any}
				isLiveCourseModule={false}
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
				isEditMode={isEditMode}
			/>
		);
	}

	return null;
}

export default RouteComponent;
