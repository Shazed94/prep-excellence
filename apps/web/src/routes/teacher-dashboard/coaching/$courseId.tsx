/**
 * Teacher Dashboard – Coaching Course Manager
 * Route: /teacher-dashboard/coaching/$courseId
 *
 * Manage modules → topics → content (VIDEO|LIVE|ASSIGNMENT|READING|QUIZ)
 * Grade student submissions, view attendance for live sessions.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	FileText,
	Loader2,
	Radio,
	Star,
	Users,
	Video,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useGetCourseModules,
	useGetModuleTopics,
	useGetTopicContents,
} from "@/hooks/coaching";
import {
	useGetContentAttendance,
	useGetSubmissions,
	useGradeSubmission,
	useStartLiveContent,
} from "@/hooks/teacher";

export const Route = createFileRoute("/teacher-dashboard/coaching/$courseId")({
	component: CoachingCourseManagerPage,
});

// ─── Submission Grader ────────────────────────────────────────────────────────

function SubmissionGrader({ contentId }: { contentId: string }) {
	const { data, isLoading } = useGetSubmissions(contentId);
	const { mutate: grade, isPending: grading } = useGradeSubmission();
	const submissions = data?.data ?? [];

	const [scores, setScores] = useState<Record<string, string>>({});
	const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

	if (isLoading)
		return (
			<div className="flex items-center gap-2 py-3 text-xs text-muted">
				<Loader2 size={12} className="animate-spin" /> Loading submissions…
			</div>
		);

	if (submissions.length === 0)
		return <p className="text-xs text-muted py-3">No submissions yet.</p>;

	return (
		<div className="space-y-3 mt-2">
			{submissions.map((sub) => (
				<div
					key={sub.id}
					className="bg-muted/5 rounded-xl border border-border/50 p-3 space-y-2"
				>
					<div className="flex items-center justify-between">
						<p className="text-xs font-semibold">
							{sub.student?.user?.name ?? "Student"}
						</p>
						{sub.score !== undefined ? (
							<Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
								<Star size={9} className="mr-0.5" /> {sub.score}/100
							</Badge>
						) : (
							<Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
								Ungraded
							</Badge>
						)}
					</div>
					{sub.textAnswer && (
						<p className="text-[11px] text-muted line-clamp-3 bg-white rounded-lg p-2 border border-border/50">
							{sub.textAnswer}
						</p>
					)}
					{sub.fileUrl && (
						<a
							href={sub.fileUrl}
							target="_blank"
							rel="noreferrer"
							className="text-[11px] text-primary underline"
						>
							View attached file
						</a>
					)}
					{/* Grading */}
					{sub.score === undefined && (
						<div className="flex gap-2 items-end">
							<div className="space-y-1 flex-1">
								<label
									htmlFor={`score-${sub.id}`}
									className="text-[11px] font-medium"
								>
									Score (0–100)
								</label>
								<Input
									id={`score-${sub.id}`}
									type="number"
									min={0}
									max={100}
									placeholder="85"
									className="h-8 text-xs"
									value={scores[sub.id] ?? ""}
									onChange={(e) =>
										setScores((p) => ({ ...p, [sub.id]: e.target.value }))
									}
								/>
							</div>
							<div className="space-y-1 flex-[2]">
								<label
									htmlFor={`fb-${sub.id}`}
									className="text-[11px] font-medium"
								>
									Feedback
								</label>
								<Input
									id={`fb-${sub.id}`}
									placeholder="Great work! Consider…"
									className="h-8 text-xs"
									value={feedbacks[sub.id] ?? ""}
									onChange={(e) =>
										setFeedbacks((p) => ({ ...p, [sub.id]: e.target.value }))
									}
								/>
							</div>
							<Button
								size="sm"
								className="bg-primary hover:bg-primary/90 text-xs h-8 shrink-0"
								disabled={!scores[sub.id] || grading}
								onClick={() =>
									grade({
										submissionId: sub.id,
										score: Number(scores[sub.id]),
										feedback: feedbacks[sub.id],
									})
								}
							>
								{grading ? (
									<Loader2 size={12} className="animate-spin" />
								) : (
									"Grade"
								)}
							</Button>
						</div>
					)}
					{sub.feedback && (
						<p className="text-[11px] text-muted italic">
							Feedback: {sub.feedback}
						</p>
					)}
				</div>
			))}
		</div>
	);
}

// ─── Attendance Viewer ────────────────────────────────────────────────────────

function AttendanceViewer({ contentId }: { contentId: string }) {
	const { data, isLoading } = useGetContentAttendance(contentId);
	const records = data?.data ?? [];

	if (isLoading)
		return (
			<div className="flex items-center gap-2 py-3 text-xs text-muted">
				<Loader2 size={12} className="animate-spin" /> Loading attendance…
			</div>
		);

	if (records.length === 0)
		return (
			<p className="text-xs text-muted py-3">No attendance recorded yet.</p>
		);

	return (
		<div className="space-y-1.5 mt-2">
			{records.map((rec) => (
				<div
					key={rec.id}
					className="flex items-center gap-2 text-xs px-2 py-1.5 bg-muted/5 rounded-lg"
				>
					<CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
					<span className="flex-1">{rec.student?.user?.name ?? "Student"}</span>
					{rec.duration && (
						<span className="text-muted">{Math.round(rec.duration / 60)}m</span>
					)}
				</div>
			))}
		</div>
	);
}

// ─── Content Row ──────────────────────────────────────────────────────────────

function ContentRow({ content }: { content: any }) {
	const [open, setOpen] = useState(false);
	const { mutate: startLive } = useStartLiveContent();

	const iconMap: Record<string, React.ReactElement> = {
		VIDEO: <Video size={12} className="text-primary" />,
		LIVE: <Radio size={12} className="text-red-500" />,
		ASSIGNMENT: <FileText size={12} className="text-amber-600" />,
		READING: <FileText size={12} className="text-emerald-600" />,
		QUIZ: <FileText size={12} className="text-violet-600" />,
	};

	return (
		<div className="border-b border-border/30 last:border-0">
			<div className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted/3">
				<span className="shrink-0">
					{iconMap[content.contentType] ?? <FileText size={12} />}
				</span>
				<span className="flex-1 text-xs truncate">{content.title}</span>
				<Badge className="border-0 text-[10px] bg-muted/10 text-muted shrink-0">
					{content.contentType}
				</Badge>
				{content.contentType === "LIVE" && (
					<Button
						size="sm"
						className="bg-red-500 hover:bg-red-600 text-white text-[11px] h-6 px-2 shrink-0"
						onClick={() => startLive(content.id)}
					>
						Start Live
					</Button>
				)}
				{(content.contentType === "ASSIGNMENT" ||
					content.contentType === "LIVE") && (
					<button
						type="button"
						onClick={() => setOpen((p) => !p)}
						className="text-xs text-primary hover:underline shrink-0"
					>
						{content.contentType === "ASSIGNMENT"
							? "Submissions"
							: "Attendance"}
					</button>
				)}
			</div>
			{open && (
				<div className="px-6 pb-3">
					{content.contentType === "ASSIGNMENT" ? (
						<SubmissionGrader contentId={content.id} />
					) : (
						<AttendanceViewer contentId={content.id} />
					)}
				</div>
			)}
		</div>
	);
}

// ─── Topic Section ────────────────────────────────────────────────────────────

function TopicSection({ topic }: { topic: any }) {
	const [open, setOpen] = useState(false);
	const { data, isLoading } = useGetTopicContents(open ? topic.id : undefined);
	const contents = data?.data ?? [];

	return (
		<div>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/5 text-xs text-muted"
			>
				{open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
				<span className="flex-1 text-left font-medium text-foreground/80">
					{topic.title}
				</span>
				{isLoading && open && (
					<Loader2 size={10} className="animate-spin shrink-0" />
				)}
			</button>
			{open && (
				<div className="ml-4 border-l border-border/50">
					{contents.length === 0 && !isLoading ? (
						<p className="text-[11px] text-muted pl-3 py-1">No content yet</p>
					) : (
						contents.map((c: any) => <ContentRow key={c.id} content={c} />)
					)}
				</div>
			)}
		</div>
	);
}

// ─── Module Section ───────────────────────────────────────────────────────────

function ModuleSection({ mod }: { mod: any }) {
	const [open, setOpen] = useState(false);
	const { data, isLoading } = useGetModuleTopics(open ? mod.id : undefined);
	const topics = data?.data ?? [];

	return (
		<div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden">
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/5 text-sm font-semibold"
			>
				{open ? (
					<ChevronUp size={14} className="shrink-0" />
				) : (
					<ChevronDown size={14} className="shrink-0" />
				)}
				<span className="flex-1 text-left">{mod.title}</span>
				{mod.unlockAtPercent > 0 && (
					<Badge className="bg-amber-100 text-amber-700 border-0 text-[10px] shrink-0">
						Unlocks at {mod.unlockAtPercent}%
					</Badge>
				)}
				{isLoading && <Loader2 size={12} className="animate-spin shrink-0" />}
			</button>

			{open && (
				<div className="border-t border-border/50">
					{topics.length === 0 && !isLoading ? (
						<p className="text-xs text-muted px-4 py-3">No topics yet</p>
					) : (
						topics.map((t: any) => <TopicSection key={t.id} topic={t} />)
					)}
				</div>
			)}
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function CoachingCourseManagerPage() {
	const { courseId } = Route.useParams();
	const { data, isLoading } = useGetCourseModules(courseId);
	const modules = data?.data ?? [];

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2">
				<Link to="/teacher-dashboard/coaching">
					<Button variant="ghost" size="sm" className="gap-1.5 text-xs px-2">
						<ArrowLeft size={13} /> Coaching
					</Button>
				</Link>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold">Course Content</h1>
					<p className="text-muted text-sm mt-0.5">
						Manage modules, topics, and content. Grade submissions below.
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : modules.length === 0 ? (
				<div className="flex flex-col items-center py-20 gap-3 text-muted">
					<Users size={48} className="opacity-20" />
					<p className="text-sm">No modules yet for this course.</p>
					<p className="text-xs text-center max-w-xs">
						Modules and content are managed via the admin panel. This view shows
						enrolled student submissions and live session attendance.
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{modules.map((mod: any) => (
						<ModuleSection key={mod.id} mod={mod} />
					))}
				</div>
			)}
		</div>
	);
}
