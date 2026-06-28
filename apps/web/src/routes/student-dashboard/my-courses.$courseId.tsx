import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	BookOpen,
	CheckCircle2,
	ChevronRight,
	FileText,
	Loader2,
	MessageSquare,
	Play,
	Star,
} from "lucide-react";
import { useState } from "react";
import { DiscussionList } from "@/components/lms/discussion-list";
import { ReviewList } from "@/components/lms/review-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useGetEnrollmentProgress,
	useUpdateLessonProgress,
} from "@/hooks/lms-enrollment";

export const Route = createFileRoute("/student-dashboard/my-courses/$courseId")(
	{
		component: CoursePlayerPage,
	},
);

function CoursePlayerPage() {
	const { courseId: enrollmentId } = Route.useParams();
	const [expandedModules, setExpandedModules] = useState<Set<string>>(
		new Set(["0"]),
	);
	const [selectedLesson, setSelectedLesson] = useState<any>(null);

	// We use enrollmentId to get progress; course data comes from the course inside enrollment
	const { data: progressData, isLoading: progressLoading } =
		useGetEnrollmentProgress(enrollmentId);

	// The enrollment has courseId — we get the full course from the LMS API
	// For now we use what's available inside the progress response
	const completedLessonIds = new Set(
		(progressData?.lessons ?? [])
			.filter((l: any) => l.isCompleted)
			.map((l: any) => l.lessonId),
	);

	const { mutate: updateProgress } = useUpdateLessonProgress();

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => {
			const next = new Set(prev);
			next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
			return next;
		});
	};

	const handleLessonComplete = (lessonId: string) => {
		updateProgress({
			enrollmentId,
			lessonId,
			isCompleted: true,
			completionPercent: 100,
		});
	};

	// Extract course structure from progress data if available
	const enrollment = progressData?.enrollment;
	const overallProgress = enrollment?.progress ?? 0;

	if (progressLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="animate-spin text-primary" size={28} />
			</div>
		);
	}

	return (
		<div className="space-y-4 max-w-7xl">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Link to="/student-dashboard/my-courses">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted text-xs"
					>
						<ArrowLeft size={14} /> My Courses
					</Button>
				</Link>
				<ChevronRight size={13} className="text-muted" />
				<span className="text-sm font-medium text-foreground truncate">
					Course Player
				</span>
			</div>

			{/* Overall progress banner */}
			<div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-sm font-medium">Overall Progress</span>
							<span className="text-sm font-bold text-primary">
								{overallProgress}%
							</span>
						</div>
						<Progress value={overallProgress} className="h-2" />
					</div>
					<div className="text-right text-xs text-muted shrink-0">
						<p className="font-semibold text-foreground">
							{progressData?.completedLessons ?? 0} /{" "}
							{progressData?.totalLessons ?? 0}
						</p>
						<p>lessons done</p>
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-3 gap-5">
				{/* Video Player / Content */}
				<div className="lg:col-span-2 space-y-4">
					{/* Video Area */}
					<div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
						{selectedLesson?.videoUrl ? (
							// biome-ignore lint/a11y/useMediaCaption: captions served via external API
							<video
								key={selectedLesson.id}
								src={selectedLesson.videoUrl}
								controls
								className="w-full aspect-video bg-black"
								onTimeUpdate={(e) => {
									const el = e.currentTarget;
									const pct = Math.floor((el.currentTime / el.duration) * 100);
									if (pct > 0 && pct % 10 === 0) {
										updateProgress({
											enrollmentId,
											lessonId: selectedLesson.id,
											completionPercent: pct,
											watchTime: Math.floor(el.currentTime),
										});
									}
								}}
								onEnded={() => handleLessonComplete(selectedLesson.id)}
							/>
						) : (
							<div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col items-center justify-center gap-3">
								{selectedLesson ? (
									<>
										<div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
											<FileText size={24} className="text-primary" />
										</div>
										<p className="text-sm font-medium">
											{selectedLesson.title}
										</p>
										<p className="text-xs text-muted">
											Text / PDF content lesson
										</p>
										{!completedLessonIds.has(selectedLesson.id) && (
											<Button
												size="sm"
												className="mt-2 bg-primary text-xs"
												onClick={() => handleLessonComplete(selectedLesson.id)}
											>
												<CheckCircle2 size={13} className="mr-1" /> Mark as
												Complete
											</Button>
										)}
									</>
								) : (
									<>
										<div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
											<Play size={24} className="text-primary ml-1" />
										</div>
										<p className="text-sm text-muted">
											Select a lesson to start watching
										</p>
									</>
								)}
							</div>
						)}
					</div>

					{/* Lesson title & actions */}
					{selectedLesson && (
						<div className="flex items-start justify-between gap-3">
							<div>
								<h2 className="font-switzer font-bold text-base">
									{selectedLesson.title}
								</h2>
								{selectedLesson.description && (
									<p className="text-xs text-muted mt-1 line-clamp-2">
										{selectedLesson.description}
									</p>
								)}
							</div>
							{!completedLessonIds.has(selectedLesson.id) && (
								<Button
									size="sm"
									variant="outline"
									className="shrink-0 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
									onClick={() => handleLessonComplete(selectedLesson.id)}
								>
									<CheckCircle2 size={13} className="mr-1" /> Mark Complete
								</Button>
							)}
							{completedLessonIds.has(selectedLesson.id) && (
								<Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs shrink-0">
									✓ Completed
								</Badge>
							)}
						</div>
					)}

					{/* Tabs: Discussions / Reviews */}
					<Tabs defaultValue="discussions">
						<TabsList>
							<TabsTrigger value="discussions" className="gap-1 text-xs">
								<MessageSquare size={13} /> Discussions
							</TabsTrigger>
							<TabsTrigger value="reviews" className="gap-1 text-xs">
								<Star size={13} /> Reviews
							</TabsTrigger>
						</TabsList>
						<TabsContent value="discussions" className="mt-4">
							{selectedLesson?.id ? (
								<DiscussionList lessonId={selectedLesson.id} />
							) : (
								<p className="text-xs text-muted py-4 text-center">
									Select a lesson to view discussions.
								</p>
							)}
						</TabsContent>
						<TabsContent value="reviews" className="mt-4">
							<ReviewList courseId={selectedLesson?.courseId ?? ""} />
						</TabsContent>
					</Tabs>
				</div>

				{/* Lesson Sidebar */}
				<div className="bg-white rounded-2xl border border-border/60 shadow-sm h-fit sticky top-4 overflow-hidden">
					<div className="p-4 border-b">
						<h3 className="font-semibold text-sm">Course Content</h3>
					</div>
					<div className="overflow-y-auto max-h-[calc(100vh-220px)]">
						{progressData ? (
							<p className="text-xs text-muted text-center py-8">
								Loading course structure...
							</p>
						) : (
							<CourseSidebarPlaceholder
								completedLessonIds={completedLessonIds}
								selectedLesson={selectedLesson}
								onSelectLesson={setSelectedLesson}
								expandedModules={expandedModules}
								onToggleModule={toggleModule}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Placeholder sidebar — driven by course modules API once wired up
function CourseSidebarPlaceholder(_props: {
	completedLessonIds: Set<string>;
	selectedLesson: any;
	onSelectLesson: (lesson: any) => void;
	expandedModules: Set<string>;
	onToggleModule: (id: string) => void;
}) {
	return (
		<div className="p-4 text-xs text-muted text-center py-8">
			<BookOpen size={24} className="mx-auto mb-2 opacity-30" />
			<p>Course modules will appear here once the enrollment is loaded.</p>
			<p className="mt-1 opacity-70">
				Select a lesson from the list to start learning.
			</p>
		</div>
	);
}
