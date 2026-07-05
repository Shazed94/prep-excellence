/**
 * Phase 3 – Coaching Course Player
 * Route: /student-dashboard/coaching/$enrollmentId/
 *
 * Left sidebar: collapsible module/topic/content tree
 *   - Module locked if unlockAtPercent > enrollment.progressPercent
 * Main area: renders content based on contentType
 *   - VIDEO    → HLS video player
 *   - LIVE     → countdown + Jitsi join button / recording after session
 *   - ASSIGNMENT → submission form (text + file attach)
 *   - READING  → rendered HTML content + attachment downloads
 */

import type {
	CoachingContent,
	ContentType,
} from "@prepexcellence/shared-types";
import { createFileRoute, Link } from "@tanstack/react-router";
import parse from "html-react-parser";
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Clock,
	ExternalLink,
	FileText,
	Loader2,
	Lock,
	Paperclip,
	Radio,
	Send,
	Star,
	TrendingUp,
	Upload,
	Users,
	Video,
} from "lucide-react";
import type React from "react";
import { useId, useRef, useState } from "react";
import { CoachingNav } from "@/components/CoachingNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	useGetCoachingCourse,
	useRecordAttendance,
	useSubmitAssignment,
} from "@/hooks/coaching";

export const Route = createFileRoute(
	"/student-dashboard/coaching/$enrollmentId/",
)({
	component: CoachingPlayerPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function contentTypeIcon(type: ContentType): React.ReactElement {
	const map: Record<ContentType, React.ReactElement> = {
		VIDEO: <Video size={12} className="text-primary" />,
		LIVE: <Radio size={12} className="text-red-500" />,
		ASSIGNMENT: <FileText size={12} className="text-amber-600" />,
		READING: <FileText size={12} className="text-emerald-600" />,
		QUIZ: <FileText size={12} className="text-violet-600" />,
	};
	return map[type] ?? <FileText size={12} />;
}

function contentTypeLabel(type: ContentType) {
	const map: Record<ContentType, string> = {
		VIDEO: "Video",
		LIVE: "Live",
		ASSIGNMENT: "Assignment",
		READING: "Reading",
		QUIZ: "Quiz",
	};
	return map[type] ?? type;
}

function formatCountdown(scheduledAt: string): string {
	const diff = new Date(scheduledAt).getTime() - Date.now();
	if (diff <= 0) return "Live now";
	const days = Math.floor(diff / 86400000);
	const hrs = Math.floor((diff % 86400000) / 3600000);
	const mins = Math.floor((diff % 3600000) / 60000);
	if (days > 0) return `Starts in ${days}d ${hrs}h`;
	if (hrs > 0) return `Starts in ${hrs}h ${mins}m`;
	return `Starts in ${mins}m`;
}

// ─── Lesson type → Content type mapping ─────────────────────────────────────

function lessonTypeToContentType(
	lessonType: string | null | undefined,
): ContentType {
	const map: Record<string, ContentType> = {
		LIVE_CLASS: "LIVE",
		READING_MATERIAL: "READING",
		ASSIGNMENT: "ASSIGNMENT",
		EXAM: "QUIZ",
	};
	return map[lessonType ?? ""] ?? "READING";
}

// ─── Lesson Item (clickable content row) ─────────────────────────────────────

function LessonItem({
	lesson,
	selectedContent,
	onSelect,
}: {
	lesson: {
		id: string;
		title: string;
		duration?: number;
		lessonType?: string;
		isCompleted?: boolean;
	};
	selectedContent: CoachingContent | null;
	onSelect: (c: CoachingContent) => void;
}) {
	const isSelected = selectedContent?.id === lesson.id;
	const isDone = lesson.isCompleted;
	const ct = lessonTypeToContentType(lesson.lessonType);

	return (
		<button
			type="button"
			onClick={() =>
				onSelect({
					id: lesson.id,
					title: lesson.title,
					contentType: ct,
					content: undefined,
					description: undefined,
					orderIndex: 0,
					topicId: lesson.id,
				} as CoachingContent)
			}
			className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] rounded-lg transition-colors text-left ${
				isSelected
					? "bg-primary/10 text-primary"
					: "hover:bg-muted/8 text-foreground/70"
			}`}
		>
			{isDone ? (
				<CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
			) : (
				<span className="shrink-0">{contentTypeIcon(ct)}</span>
			)}
			<span className="flex-1 truncate">{lesson.title}</span>
			{lesson.duration && (
				<span className="text-muted text-[10px] shrink-0">
					{lesson.duration}m
				</span>
			)}
		</button>
	);
}

// ─── Module Accordion ────────────────────────────────────────────────────────

function ModuleSection({
	mod,
	enrollmentProgress,
	selectedContent,
	onSelect,
	defaultOpen,
}: {
	mod: { id: string; title: string; unlockAtPercent: number; lessons?: any[] };
	enrollmentProgress: number;
	selectedContent: CoachingContent | null;
	onSelect: (c: CoachingContent) => void;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen ?? false);
	const isLocked = mod.unlockAtPercent > enrollmentProgress;
	const lessons = mod?.lessons ?? [];

	return (
		<div className="border-b border-border/50 last:border-0">
			<button
				type="button"
				onClick={() => !isLocked && setOpen((p) => !p)}
				className={`w-full flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors ${
					isLocked
						? "text-muted cursor-not-allowed"
						: "hover:bg-muted/5 text-foreground"
				}`}
			>
				{isLocked ? (
					<Lock size={13} className="shrink-0 text-muted" />
				) : open ? (
					<ChevronUp size={13} className="shrink-0" />
				) : (
					<ChevronDown size={13} className="shrink-0" />
				)}
				<span className="flex-1 text-left">{mod.title}</span>
				{isLocked && (
					<span className="text-[10px] text-muted font-normal">
						{mod.unlockAtPercent}% payment
					</span>
				)}
			</button>

			{open && !isLocked && (
				<div className="pb-2 px-4 space-y-0.5">
					{lessons.length === 0 ? (
						<p className="text-[10px] text-muted py-1">No lessons yet</p>
					) : (
						lessons.map((lesson: any) => (
							<LessonItem
								key={lesson.id}
								lesson={lesson}
								selectedContent={selectedContent}
								onSelect={onSelect}
							/>
						))
					)}
				</div>
			)}
		</div>
	);
}

// ─── Content Renderers ────────────────────────────────────────────────────────

function VideoContent({ content }: { content: CoachingContent }) {
	const videoRef = useRef<HTMLVideoElement>(null);

	if (content.videoStatus === "processing") {
		return (
			<div className="aspect-video bg-primary-light flex flex-col items-center justify-center gap-3 rounded-xl">
				<Loader2 size={32} className="animate-spin text-primary/40" />
				<p className="text-sm text-muted">Video is being processed…</p>
			</div>
		);
	}

	const src = content.masterPlaylistUrl || content.recordingUrl;
	if (!src) {
		return (
			<div className="aspect-video bg-muted/10 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed">
				<Video size={32} className="text-muted/40" />
				<p className="text-sm text-muted">Video not available yet</p>
			</div>
		);
	}

	return (
		<div className="rounded-xl overflow-hidden bg-black">
			{/* HLS video — native playback in Safari; Chrome/Firefox need HLS.js */}
			{/* biome-ignore lint/a11y/useMediaCaption: captions served separately via external CDN */}
			<video
				ref={videoRef}
				src={src}
				controls
				className="w-full aspect-video"
				poster={content.thumbnailUrl}
			/>
			{/* Backend dev note: HLS.js should be integrated for Chrome/Firefox */}
		</div>
	);
}

function LiveContent({
	content,
	onJoin,
}: {
	content: CoachingContent;
	onJoin: () => void;
}) {
	const now = new Date();
	const scheduled = content.scheduledAt ? new Date(content.scheduledAt) : null;
	const hasStarted = scheduled && now >= scheduled;
	const hasEnded = !!content.actualEndTime;
	const hasRecording = !!content.masterPlaylistUrl || !!content.recordingUrl;

	if (hasEnded && hasRecording) {
		return (
			<div className="space-y-3">
				<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
					<CheckCircle2 className="text-emerald-600 shrink-0" />
					<div>
						<p className="text-sm font-semibold text-emerald-700">
							Session Completed
						</p>
						<p className="text-xs text-emerald-600 mt-0.5">
							Recording is available below
						</p>
					</div>
				</div>
				<VideoContent content={content} />
			</div>
		);
	}

	return (
		<div className="rounded-xl overflow-hidden">
			{/* Live session card */}
			<div
				className={`p-6 text-center space-y-4 ${
					hasStarted
						? "bg-red-50 border border-red-200"
						: "bg-primary-light border border-primary/20"
				} rounded-xl`}
			>
				{/* Live indicator */}
				<div className="flex justify-center">
					{hasStarted ? (
						<div className="flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
							<span className="w-2 h-2 rounded-full bg-white animate-pulse" />
							LIVE NOW
						</div>
					) : (
						<div className="flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
							<Radio size={12} />
							UPCOMING LIVE
						</div>
					)}
				</div>

				<div>
					<h3 className="font-switzer font-bold text-base">{content.title}</h3>
					{scheduled && (
						<p className="text-sm text-muted mt-1">
							{new Date(content.scheduledAt!).toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					)}
				</div>

				{!hasStarted && scheduled && (
					<div className="text-2xl font-bold text-primary font-switzer">
						{formatCountdown(content.scheduledAt!)}
					</div>
				)}

				{content.duration && (
					<p className="text-xs text-muted flex items-center justify-center gap-1">
						<Clock size={12} /> Duration: {content.duration} minutes
					</p>
				)}

				{/* Join button */}
				{content.jitsiStartUrl && (
					<Button
						onClick={onJoin}
						className={`gap-2 ${
							hasStarted
								? "bg-red-500 hover:bg-red-600"
								: "bg-primary hover:bg-primary/90"
						}`}
					>
						<ExternalLink size={14} />
						{hasStarted ? "Join Live Session" : "Join When Live"}
					</Button>
				)}

				{!content.jitsiStartUrl && (
					<p className="text-xs text-muted italic">
						Session link will be available when the class starts
					</p>
				)}
			</div>
		</div>
	);
}

function AssignmentContent({ content }: { content: CoachingContent }) {
	const [textAnswer, setTextAnswer] = useState("");
	const assignmentId = useId();
	const [files, setFiles] = useState<File[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);
	const { mutate: submit, isPending } = useSubmitAssignment();

	const hasSubmission = !!content.progress?.isCompleted;
	const dueDate = content.dueDate
		? new Date(content.dueDate).toLocaleDateString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
			})
		: null;

	const handleSubmit = () => {
		submit({
			contentId: content.id,
			textAnswer: textAnswer || undefined,
			files, // real multipart upload
		});
	};

	return (
		<div className="space-y-4">
			{/* Assignment header */}
			<div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="text-sm font-semibold text-amber-700">
							Assignment — {content.title}
						</p>
						{dueDate && (
							<p className="text-xs text-amber-600 mt-0.5">Due: {dueDate}</p>
						)}
					</div>
					{content.totalPoints && (
						<div className="text-right">
							<p className="text-lg font-bold text-amber-700">
								{content.totalPoints}
							</p>
							<p className="text-[10px] text-amber-600">points</p>
						</div>
					)}
				</div>

				{/* Grading feedback */}
				{content.progress?.score !== undefined && (
					<div className="mt-3 pt-3 border-t border-amber-200">
						<p className="text-xs font-semibold text-amber-700">
							Score: {content.progress.score}/{content.totalPoints ?? "—"}{" "}
							{content.progress.grade && `(${content.progress.grade})`}
						</p>
						{content.progress.feedback && (
							<p className="text-xs text-amber-600 mt-1 italic">
								"{content.progress.feedback}"
							</p>
						)}
					</div>
				)}
			</div>

			{/* Instructions */}
			{content.description && (
				<div className="prose prose-sm max-w-none text-foreground/80 text-sm leading-relaxed">
					<p>{content.description}</p>
				</div>
			)}

			{/* Assignment data */}
			{content.assignmentData && (
				<div className="bg-muted/5 rounded-xl p-4 border border-border/60">
					<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
						Assignment Details
					</p>
					<pre className="text-xs text-foreground/70 whitespace-pre-wrap">
						{JSON.stringify(content.assignmentData, null, 2)}
					</pre>
				</div>
			)}

			{/* Submission form */}
			{!hasSubmission ? (
				<div className="space-y-3">
					<div>
						<label
							htmlFor={assignmentId}
							className="text-xs font-medium text-foreground mb-1.5 block"
						>
							Your Answer
						</label>
						<Textarea
							id={assignmentId}
							placeholder="Write your answer here…"
							value={textAnswer}
							onChange={(e) => setTextAnswer(e.target.value)}
							rows={6}
							className="text-sm"
						/>
					</div>

					{/* File attachment */}
					<div>
						<button
							type="button"
							onClick={() => fileRef.current?.click()}
							className="flex items-center gap-2 text-xs text-muted hover:text-primary border border-dashed border-border/60 hover:border-primary/40 rounded-xl px-4 py-3 w-full justify-center transition-colors"
						>
							<Upload size={14} />
							Attach files (PDF, images, docs)
						</button>
						<input
							ref={fileRef}
							type="file"
							multiple
							className="hidden"
							onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
						/>
						{files.length > 0 && (
							<div className="mt-2 space-y-1">
								{files.map((f) => (
									<div
										key={f.name}
										className="flex items-center gap-2 text-xs text-muted"
									>
										<Paperclip size={11} />
										<span className="truncate">{f.name}</span>
										<span>({(f.size / 1024).toFixed(0)} KB)</span>
									</div>
								))}
							</div>
						)}
					</div>

					<Button
						onClick={handleSubmit}
						disabled={isPending || (!textAnswer && files.length === 0)}
						className="w-full bg-primary hover:bg-primary/90 gap-2 text-sm"
					>
						{isPending ? (
							<Loader2 size={14} className="animate-spin" />
						) : (
							<Send size={14} />
						)}
						Submit Assignment
					</Button>
				</div>
			) : (
				<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
					<CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
					<div>
						<p className="text-sm font-semibold text-emerald-700">
							Submitted Successfully
						</p>
						<p className="text-xs text-emerald-600 mt-0.5">
							Your assignment is under review
						</p>
					</div>
				</div>
			)}
		</div>
	);
}

function ReadingContent({ content }: { content: CoachingContent }) {
	return (
		<div className="space-y-4">
			{/* Article body */}
			{content.content ? (
				<div
					className="prose prose-sm max-w-none text-foreground/80 leading-relaxed"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: trusted API content
					dangerouslySetInnerHTML={{ __html: content.content }}
				/>
			) : (
				<p className="text-sm text-muted italic">
					Reading content will appear here.
				</p>
			)}

			{/* Attachments */}
			{content.attachments && content.attachments.length > 0 && (
				<div>
					<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
						Attachments
					</p>
					<div className="space-y-2">
						{content.attachments.map((url, i) => (
							<a
								key={url}
								href={url}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 rounded-lg px-3 py-2 transition-colors"
							>
								<Paperclip size={12} />
								<span>Attachment {i + 1}</span>
								<ExternalLink size={11} className="ml-auto" />
							</a>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function CoachingPlayerPage() {
	const { enrollmentId } = Route.useParams();
	const [selectedContent, setSelectedContent] =
		useState<CoachingContent | null>(null);

	const { data: courseData, isLoading: loadingEnrollments } =
		useGetCoachingCourse(enrollmentId);
	const course = courseData?.data ?? null;

	// Transform API courseModules → modules with lessons for the sidebar
	const modules = (course?.courseModules ?? []).map((mod: any) => ({
		...mod,
		lessons: mod.lessons ?? [],
	}));

	const { mutate: recordAttendance } = useRecordAttendance();

	const handleJoinLive = (content: CoachingContent) => {
		if (content.jitsiStartUrl) {
			recordAttendance({
				contentId: content.id,
				joinTime: new Date().toISOString(),
			});
			window.open(content.jitsiStartUrl, "_blank", "noopener,noreferrer");
		}
	};

	const isLoading = loadingEnrollments;
	const progress = course?.progressPercent ?? 0;

	if (loadingEnrollments) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 size={28} className="animate-spin text-primary" />
			</div>
		);
	}

	if (!course) {
		return (
			<div className="flex flex-col items-center py-20 gap-3">
				<Lock size={40} className="text-muted/30" />
				<p className="text-muted">Course not found</p>
				<Link to="/student-dashboard/coaching">
					<Button variant="outline" size="sm">
						Back to Coaching
					</Button>
				</Link>
			</div>
		);
	}

	const renderContentArea = () => {
		switch (selectedContent!.contentType) {
			case "VIDEO":
				return <VideoContent content={selectedContent!} />;
			case "LIVE":
				return (
					<LiveContent
						content={selectedContent!}
						onJoin={() => handleJoinLive(selectedContent!)}
					/>
				);
			case "ASSIGNMENT":
				return <AssignmentContent content={selectedContent!} />;
			default:
				return <ReadingContent content={selectedContent!} />;
		}
	};

	return (
		<div className="space-y-4 ">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-xs">
				<Link to="/student-dashboard/coaching">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted text-xs h-7 px-2"
					>
						<ArrowLeft size={13} /> My Coaching
					</Button>
				</Link>
				<ChevronRight size={12} className="text-muted" />
				<span className="font-medium truncate max-w-xs">{course?.title}</span>
			</div>

			{/* Coaching Nav tabs */}
			<CoachingNav
				enrollmentId={enrollmentId}
				courseName={course?.title ?? ""}
			/>

			{/* Progress header */}
			<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4 space-y-4">
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<div className="flex items-center justify-between mb-1.5">
							<span className="text-xs font-medium text-muted">
								Course Progress
							</span>
							<span className="text-sm font-bold text-primary">
								{progress}%
							</span>
						</div>
						<Progress value={progress} className="h-2" />
					</div>
					<div className="flex items-center gap-3 shrink-0">
						{course.status === "COMPLETED" && (
							<Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
								<CheckCircle2 size={11} className="mr-1" /> Completed
							</Badge>
						)}
						{course?.level && (
							<Badge className="bg-primary/10 text-primary border-0 text-xs">
								{course.level}
							</Badge>
						)}
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
							<Clock className="w-4 h-4 text-blue-600" />
						</div>
						<div>
							<p className="text-[11px] text-muted">Duration</p>
							<p className="text-sm font-semibold text-foreground">
								{course?.duration ?? "—"} days
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
							<TrendingUp className="w-4 h-4 text-emerald-600" />
						</div>
						<div>
							<p className="text-[11px] text-muted">Level</p>
							<p className="text-sm font-semibold text-foreground">
								{course?.level ?? "—"}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
							<Users className="w-4 h-4 text-violet-600" />
						</div>
						<div>
							<p className="text-[11px] text-muted">Enrolled</p>
							<p className="text-sm font-semibold text-foreground">
								{course?._count?.enrollments ?? 0} students
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
							<BookOpen className="w-4 h-4 text-amber-600" />
						</div>
						<div>
							<p className="text-[11px] text-muted">Modules</p>
							<p className="text-sm font-semibold text-foreground">
								{modules.length ?? 0}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-[320px_1fr] gap-5">
				{/* Left Column — Curriculum + Cards */}
				<div className="space-y-5">
					{/* Curriculum Sidebar */}
					<div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden">
						<div className="p-4 border-b">
							<h3 className="font-switzer font-semibold text-sm">Curriculum</h3>
							{course?.duration && (
								<p className="text-[11px] text-muted mt-0.5">
									{course.duration} day program · {modules.length} modules
								</p>
							)}
						</div>

						<div className="overflow-y-auto max-h-[calc(100vh-400px)]">
							{isLoading ? (
								<div className="flex justify-center py-8">
									<Loader2 size={20} className="animate-spin text-primary" />
								</div>
							) : modules.length === 0 ? (
								<p className="text-xs text-muted text-center py-8">
									No modules available yet
								</p>
							) : (
								modules.map((mod: any, idx: number) => (
									<ModuleSection
										key={mod.id}
										mod={mod}
										enrollmentProgress={progress}
										selectedContent={selectedContent}
										onSelect={setSelectedContent}
										defaultOpen={idx === 0}
									/>
								))
							)}
						</div>
					</div>

					{/* Schedule Card */}
					{course?.schedules && course.schedules.length > 0 && (
						<div className="bg-white rounded-lg border border-blue-200 p-5 space-y-4">
							<h3 className="font-switzer font-bold text-sm text-foreground flex items-center gap-2">
								<Calendar className="w-4 h-4 text-blue-600" />
								Class Schedule
							</h3>
							<div className="space-y-2">
								{course.schedules.map((s: any, idx: number) => (
									<div
										key={idx}
										className="bg-white rounded-lg p-3 border border-blue-100"
									>
										<div className="font-semibold text-foreground text-xs mb-0.5">
											{s.dayOfWeek
												? s.dayOfWeek.charAt(0).toUpperCase() +
													s.dayOfWeek.slice(1).toLowerCase()
												: ""}
										</div>
										<div className="text-[11px] text-muted mb-1">Session</div>
										<div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600">
											<Clock className="w-3 h-3" />
											{s.startTime} - {s.endTime}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Instructor Card */}
					{(() => {
						const instructor =
							modules.find((m: any) => m.teacher)?.teacher ?? null;
						if (!instructor) return null;
						return (
							<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5 space-y-4">
								<h3 className="font-switzer font-bold text-xs text-muted uppercase tracking-wide">
									Your Instructor
								</h3>
								<div className="flex gap-3">
									<img
										src={instructor.user?.image || "/placeholder-avatar.png"}
										alt={instructor.user?.name || "Instructor"}
										className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
									/>
									<div className="flex-1 min-w-0">
										<h4 className="font-switzer font-bold text-sm text-foreground truncate">
											{instructor.user?.name || "Instructor"}
										</h4>
										<div className="flex items-center gap-1 mt-0.5">
											<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
											<span className="text-[11px] text-muted">
												Course Instructor
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})()}
				</div>

				{/* Content Area */}
				<div className="space-y-4">
					{selectedContent ? (
						<>
							{/* Content Renderer — video / assignment / reading / live */}
							<div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden">
								{renderContentArea()}
							</div>

							{/* Content meta title & badge */}
							<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0 flex-1">
										<h2 className="font-switzer font-bold text-base">
											{selectedContent.title}
										</h2>
										{selectedContent.description && (
											<p className="text-xs text-muted mt-1 leading-relaxed">
												{selectedContent.description}
											</p>
										)}
									</div>
									<div className="flex items-center gap-2 shrink-0">
										<Badge
											variant="outline"
											className="text-[10px] flex items-center gap-1"
										>
											{contentTypeIcon(selectedContent.contentType)}
											{contentTypeLabel(selectedContent.contentType)}
										</Badge>
										{selectedContent.progress?.isCompleted && (
											<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
												✓ Done
											</Badge>
										)}
									</div>
								</div>
							</div>

							{/* Course Overview & Resources Tabs — below content */}
							<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
								<Tabs defaultValue="overview" className="w-full">
									<TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100">
										<TabsTrigger value="overview" className="gap-2 text-xs">
											<BookOpen className="w-4 h-4" />
											Overview
										</TabsTrigger>
										<TabsTrigger value="resources" className="gap-2 text-xs">
											<FileText className="w-4 h-4" />
											Resources
										</TabsTrigger>
									</TabsList>

									<TabsContent value="overview" className="space-y-4">
										<div>
											<h2 className="font-switzer font-bold text-base text-foreground mb-2">
												About This Course
											</h2>
											{course?.longDescription ? (
												<div className="text-sm text-muted leading-relaxed">
													{parse(course.longDescription)}
												</div>
											) : (
												<p className="text-sm text-muted italic">
													No description available.
												</p>
											)}
										</div>

										<Separator />

										<div className="grid grid-cols-2 gap-4">
											<div className="bg-blue-50 rounded-lg p-4">
												<div className="text-[11px] text-muted mb-1">
													Category
												</div>
												<div className="font-semibold text-sm text-foreground">
													{course?.category?.name ||
														course?.tags?.[0] ||
														"General"}
												</div>
											</div>
											<div className="bg-emerald-50 rounded-lg p-4">
												<div className="text-[11px] text-muted mb-1">
													Capacity
												</div>
												<div className="font-semibold text-sm text-foreground">
													{course?.capacity ?? "—"} students
												</div>
											</div>
										</div>

										{course?.discount != null && (
											<>
												<Separator />
												<div className="bg-primary-light rounded-lg p-4">
													<h3 className="font-switzer font-bold text-sm text-foreground mb-2">
														Course Investment
													</h3>
													<div className="flex items-baseline gap-2">
														{course.discount ? (
															<>
																<span className="text-2xl font-bold text-blue-600">
																	{course.discount} USD
																</span>
																<span className="text-sm text-muted line-through">
																	{course.price} USD
																</span>
															</>
														) : (
															course.price && (
																<span className="text-sm text-muted line-through">
																	{course.price} USD
																</span>
															)
														)}
													</div>
												</div>
											</>
										)}
									</TabsContent>

									<TabsContent value="resources">
										<div className="space-y-2">
											{[...Array(4)].map((_, idx) => (
												<div
													key={idx}
													className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
												>
													<div className="flex items-center gap-3">
														<FileText className="w-4 h-4 text-blue-600" />
														<div>
															<div className="text-sm font-medium text-foreground">
																{
																	[
																		"SAT Math Formulas Cheat Sheet",
																		"Practice Test - Full Length",
																		"Solution Keys & Explanations",
																		"Supplementary Reading Materials",
																	][idx]
																}
															</div>
															<div className="text-[11px] text-muted">
																{["PDF", "PDF", "ZIP", "PDF"][idx]} •{" "}
																{["2.4 MB", "8.1 MB", "12.5 MB", "5.3 MB"][idx]}
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</TabsContent>
								</Tabs>
							</div>
						</>
					) : (
						/* No content selected → show Overview & Resources as the default view */
						<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
							<Tabs defaultValue="overview" className="w-full">
								<TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100">
									<TabsTrigger value="overview" className="gap-2 text-xs">
										<BookOpen className="w-4 h-4" />
										Overview
									</TabsTrigger>
									<TabsTrigger value="resources" className="gap-2 text-xs">
										<FileText className="w-4 h-4" />
										Resources
									</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="space-y-4">
									<div>
										<h2 className="font-switzer font-bold text-base text-foreground mb-2">
											About This Course
										</h2>
										{course?.longDescription ? (
											<div className="text-sm text-muted leading-relaxed">
												{parse(course.longDescription)}
											</div>
										) : (
											<p className="text-sm text-muted italic">
												No description available.
											</p>
										)}
									</div>

									<Separator />

									<div className="grid grid-cols-2 gap-4">
										<div className="bg-blue-50 rounded-lg p-4">
											<div className="text-[11px] text-muted mb-1">
												Category
											</div>
											<div className="font-semibold text-sm text-foreground">
												{course?.category?.name ||
													course?.tags?.[0] ||
													"General"}
											</div>
										</div>
										<div className="bg-emerald-50 rounded-lg p-4">
											<div className="text-[11px] text-muted mb-1">
												Capacity
											</div>
											<div className="font-semibold text-sm text-foreground">
												{course?.capacity ?? "—"} students
											</div>
										</div>
									</div>

									{course?.discount != null && (
										<>
											<Separator />
											<div className="bg-primary-light rounded-lg p-4">
												<h3 className="font-switzer font-bold text-sm text-foreground mb-2">
													Course Investment
												</h3>
												<div className="flex items-baseline gap-2">
													{course.discount ? (
														<>
															<span className="text-2xl font-bold text-blue-600">
																{course.discount} USD
															</span>
															<span className="text-sm text-muted line-through">
																{course.price} USD
															</span>
														</>
													) : (
														course.price && (
															<span className="text-sm text-muted line-through">
																{course.price} USD
															</span>
														)
													)}
												</div>
											</div>
										</>
									)}
								</TabsContent>

								<TabsContent value="resources">
									<div className="space-y-2">
										{[...Array(4)].map((_, idx) => (
											<div
												key={idx}
												className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
											>
												<div className="flex items-center gap-3">
													<FileText className="w-4 h-4 text-blue-600" />
													<div>
														<div className="text-sm font-medium text-foreground">
															{
																[
																	"SAT Math Formulas Cheat Sheet",
																	"Practice Test - Full Length",
																	"Solution Keys & Explanations",
																	"Supplementary Reading Materials",
																][idx]
															}
														</div>
														<div className="text-[11px] text-muted">
															{["PDF", "PDF", "ZIP", "PDF"][idx]} •{" "}
															{["2.4 MB", "8.1 MB", "12.5 MB", "5.3 MB"][idx]}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</TabsContent>
							</Tabs>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
