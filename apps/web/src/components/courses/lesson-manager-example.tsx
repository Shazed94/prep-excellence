/**
 * Example: Complete Lesson Management Component
 *
 * This is a production-ready example showing:
 * - Type-safe lesson CRUD operations
 * - Local state management for unsaved lessons
 * - Automatic UI sync after backend mutations
 * - Video upload with encoding status tracking
 */

import type {
	LMSLessonResponse,
	TcreateLMSLessonSchema,
} from "@prepexcellence/shared-validators";
import { Edit2, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { LessonVideoUpload } from "@/components/courses/lesson-video-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
	useDeleteLesson,
	useGetCourse,
	useUpdateLesson,
} from "@/hooks/lms-course";

// Local lesson type (for unsaved lessons)
interface LocalLesson extends Partial<LMSLessonResponse> {
	id: string; // temp-xxx or real ID
	title: string;
	courseModuleId: string;
	orderIndex: number;
	lessonType: "VIDEO_CONTENT" | "LIVE_CLASS" | "EXAM" | "READING_MATERIAL";
}

interface LessonManagerProps {
	courseId: string;
	moduleId: string;
}

export function LessonManager({ courseId, moduleId }: LessonManagerProps) {
	// ========== STATE ==========
	const [localLessons, setLocalLessons] = useState<LocalLesson[]>([]);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [tempIdCounter, setTempIdCounter] = useState(0);

	// ========== HOOKS ==========
	// Single source of truth - includes all modules and lessons
	const { data: courseData, isLoading } = useGetCourse(courseId);

	const createLessonMutation = useCreateLesson();
	const updateLessonMutation = useUpdateLesson();
	const deleteLessonMutation = useDeleteLesson();

	// ========== DERIVED STATE ==========
	// Extract saved lessons from course data
	const savedLessons: LMSLessonResponse[] = useMemo(() => {
		const modules = courseData?.courseModules || [];
		const module = modules.find((m) => m.id === moduleId);
		return module?.lessons || [];
	}, [courseData, moduleId]);

	// Combine saved and local (unsaved) lessons
	const allLessons = useMemo(() => {
		return [...savedLessons, ...localLessons];
	}, [savedLessons, localLessons]);

	// Filter lessons for this module
	const moduleLessons = useMemo(() => {
		return allLessons
			.filter((l) => (l as LocalLesson).courseModuleId === moduleId)
			.sort((a, b) => a.orderIndex - b.orderIndex);
	}, [allLessons, moduleId]);

	// ========== HANDLERS ==========

	// Add new lesson (local state only)
	const handleAddLesson = () => {
		const tempId = `temp-lesson-${tempIdCounter}`;
		setTempIdCounter((prev) => prev + 1);

		const newLesson: LocalLesson = {
			id: tempId,
			title: `New Lesson ${moduleLessons.length + 1}`,
			description: "",
			orderIndex: moduleLessons.length,
			lessonType: "VIDEO_CONTENT",
			courseModuleId: moduleId,
		};

		setLocalLessons((prev) => [...prev, newLesson]);
		setEditingId(tempId);
	};

	// Update lesson (local or backend)
	const handleUpdateLesson = async (
		lessonId: string,
		updates: Partial<LocalLesson>,
	) => {
		// If it's a temp lesson, update local state
		if (lessonId.startsWith("temp-")) {
			setLocalLessons((prev) =>
				prev.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
			);
			return;
		}

		// If it's a saved lesson, call API
		try {
			await updateLessonMutation.mutateAsync({
				lessonId,
				courseId,
				data: updates as Partial<Omit<TcreateLMSLessonSchema, "moduleId">>,
			});
			// UI updates automatically via query invalidation
		} catch (error) {
			console.error("Failed to update lesson:", error);
		}
	};

	// Save lesson to backend
	const handleSaveLesson = async (lessonId: string) => {
		const lesson = localLessons.find((l) => l.id === lessonId);
		if (!lesson) return;

		// Validate
		if (!lesson.title?.trim()) {
			alert("Lesson title is required");
			return;
		}

		try {
			// Create lesson in backend
			await createLessonMutation.mutateAsync({
				moduleId,
				courseId, // CRITICAL: Triggers refetch
				data: {
					title: lesson.title,
					description: lesson.description || "",
					orderIndex: lesson.orderIndex,
					lessonType: (lesson as LocalLesson).lessonType,
					content: lesson.content || "",
					isPublished: false,
				},
			});

			// Remove from local state - backend is now source of truth
			setLocalLessons((prev) => prev.filter((l) => l.id !== lessonId));
			setEditingId(null);

			// ✅ UI updates automatically - no manual refetch needed!
		} catch (error) {
			console.error("Failed to save lesson:", error);
		}
	};

	// Delete lesson
	const handleDeleteLesson = async (lessonId: string) => {
		// If temp lesson, just remove from local state
		if (lessonId.startsWith("temp-")) {
			setLocalLessons((prev) => prev.filter((l) => l.id !== lessonId));
			return;
		}

		// If saved lesson, call API
		if (!confirm("Delete this lesson?")) return;

		try {
			await deleteLessonMutation.mutateAsync({
				lessonId,
				courseId, // CRITICAL: Triggers refetch
			});
			// UI updates automatically
		} catch (error) {
			console.error("Failed to delete lesson:", error);
		}
	};

	// ========== RENDER ==========
	if (isLoading) {
		return <div>Loading lessons...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">
					Lessons ({moduleLessons.length})
				</h3>
				<Button onClick={handleAddLesson} size="sm">
					<Plus className="h-4 w-4 mr-2" />
					Add Lesson
				</Button>
			</div>

			{/* Lesson List */}
			<div className="space-y-3">
				{moduleLessons.map((lesson) => {
					const isTemp = lesson.id.startsWith("temp-");
					const isEditing = editingId === lesson.id;

					return (
						<Card key={lesson.id}>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="flex-1">
										{isEditing ? (
											<Input
												value={lesson.title}
												onChange={(e) =>
													handleUpdateLesson(lesson.id, {
														title: e.target.value,
													})
												}
												placeholder="Lesson title"
												className="font-semibold"
											/>
										) : (
											<CardTitle className="flex items-center gap-2">
												{lesson.title}
												{isTemp && (
													<span className="text-xs text-yellow-500 font-normal">
														(Unsaved)
													</span>
												)}
											</CardTitle>
										)}
									</div>

									<div className="flex items-center gap-2">
										{isTemp ? (
											<Button
												size="sm"
												onClick={() => handleSaveLesson(lesson.id)}
												disabled={createLessonMutation.isPending}
											>
												<Save className="h-4 w-4 mr-2" />
												Save
											</Button>
										) : (
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													setEditingId(isEditing ? null : lesson.id)
												}
											>
												<Edit2 className="h-4 w-4" />
											</Button>
										)}

										<Button
											size="sm"
											variant="destructive"
											onClick={() => handleDeleteLesson(lesson.id)}
											disabled={deleteLessonMutation.isPending}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardHeader>

							<CardContent className="space-y-4">
								{/* Description */}
								{isEditing ? (
									<Textarea
										value={lesson.description || ""}
										onChange={(e) =>
											handleUpdateLesson(lesson.id, {
												description: e.target.value,
											})
										}
										placeholder="Lesson description"
										rows={3}
									/>
								) : (
									lesson.description && (
										<p className="text-sm text-muted-foreground">
											{lesson.description}
										</p>
									)
								)}

								{/* Content Type */}
								{isEditing && (
									<Select
										value={(lesson as LocalLesson).lessonType}
										onValueChange={(value) =>
											handleUpdateLesson(lesson.id, {
												lessonType: value as LocalLesson["lessonType"],
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="VIDEO_RECORDED">
												Recorded Video
											</SelectItem>
											<SelectItem value="VIDEO_LIVE">Live Video</SelectItem>
											<SelectItem value="QUIZ">Quiz</SelectItem>
											<SelectItem value="READING_MATERIAL">
												Reading Material
											</SelectItem>
										</SelectContent>
									</Select>
								)}

								{/* Video Upload (only for saved lessons) */}
								{!isTemp &&
									(lesson as LocalLesson).lessonType === "VIDEO_CONTENT" && (
										<LessonVideoUpload
											lessonId={lesson.id}
											courseId={courseId}
											currentVideoUrl={lesson.videoUrl}
											encodingStatus={lesson.videoEncodingStatus}
										/>
									)}

								{/* Lesson Metadata */}
								{!isTemp && (
									<div className="text-xs text-muted-foreground space-y-1">
										<p>Order: {lesson.orderIndex + 1}</p>
										<p>Type: {(lesson as LocalLesson).lessonType}</p>
										{lesson.videoDuration && (
											<p>
												Duration: {Math.floor(lesson.videoDuration / 60)} min
											</p>
										)}
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}

				{moduleLessons.length === 0 && (
					<div className="text-center py-12 text-muted-foreground">
						No lessons yet. Click "Add Lesson" to get started.
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Usage Example:
 *
 * <LessonManager
 *   courseId="clxyz123abc"
 *   moduleId="clmno456def"
 * />
 *
 * Features:
 * ✅ Type-safe (all types from Zod validators)
 * ✅ Automatic UI sync after mutations
 * ✅ Local state for unsaved lessons
 * ✅ Video upload with encoding status
 * ✅ Inline editing
 * ✅ Loading states
 * ✅ Error handling
 */
