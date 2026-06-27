/**
 * Phase 4 – My Sessions (One-to-One)
 * Route: /student-dashboard/sessions
 *
 * Enhanced with:
 *  - Jitsi "Join Now" button for SCHEDULED sessions close to start time
 *  - HLS recording player for COMPLETED sessions
 *  - Review dialog for COMPLETED sessions
 *  - Cancel dialog for SCHEDULED sessions
 *  - "Book New Session" CTA → /student-dashboard/find-tutor
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	CalendarDays,
	CheckCircle2,
	Clock,
	Download,
	ExternalLink,
	Loader2,
	Play,
	Star,
	UserSearch,
	Video,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	type OneToOneSession,
	type SessionStatus,
	useCancelSession,
	useCreateSessionReview,
	useGetMyStudentSessions,
	useGetSessionRecording,
} from "@/hooks/onetoone";
import { useGetStudentProfile } from "@/hooks/user-management";

export const Route = createFileRoute("/student-dashboard/sessions")({
	component: SessionsPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusConfig(status: SessionStatus) {
	const map: Record<
		SessionStatus,
		{ label: string; color: string; icon: any }
	> = {
		SCHEDULED: {
			label: "Upcoming",
			color: "bg-primary/10 text-primary",
			icon: CalendarDays,
		},
		IN_PROGRESS: {
			label: "In Progress",
			color: "bg-amber-100 text-amber-700",
			icon: Clock,
		},
		COMPLETED: {
			label: "Completed",
			color: "bg-emerald-100 text-emerald-700",
			icon: CheckCircle2,
		},
		CANCELLED: {
			label: "Cancelled",
			color: "bg-red-100 text-red-600",
			icon: XCircle,
		},
	};
	return (
		map[status] ?? {
			label: status,
			color: "bg-muted/20 text-muted",
			icon: AlertCircle,
		}
	);
}

function isJoinable(session: OneToOneSession): boolean {
	if (session.status !== "SCHEDULED" && session.status !== "IN_PROGRESS")
		return false;
	const scheduled = new Date(session.scheduledAt);
	const now = Date.now();
	// Allow joining 15 minutes before start
	return now >= scheduled.getTime() - 15 * 60 * 1000;
}

function formatScheduled(session: OneToOneSession): string {
	return new Date(session.scheduledAt).toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({
	value,
	onChange,
}: {
	value: number;
	onChange: (n: number) => void;
}) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((n) => (
				<button
					key={n}
					type="button"
					onClick={() => onChange(n)}
					className="p-0.5"
				>
					<Star
						size={22}
						className={
							n <= value ? "text-amber-400 fill-amber-400" : "text-muted/30"
						}
					/>
				</button>
			))}
		</div>
	);
}

// ─── Recording Player ─────────────────────────────────────────────────────────

function RecordingPlayer({ sessionId }: { sessionId: string }) {
	const { data, isLoading } = useGetSessionRecording(sessionId);
	const rec = data?.data;

	if (isLoading)
		return (
			<div className="flex items-center gap-2 text-xs text-muted">
				<Loader2 size={12} className="animate-spin" /> Loading recording…
			</div>
		);

	if (!rec || rec.status !== "ready") {
		return (
			<p className="text-xs text-muted italic">
				{rec?.status === "processing"
					? "Recording is being processed…"
					: "Recording not available"}
			</p>
		);
	}

	const expiryDate = new Date(rec.expiresAt);
	const daysLeft = Math.max(
		0,
		Math.ceil((expiryDate.getTime() - Date.now()) / 86400000),
	);

	return (
		<div className="space-y-2 mt-3">
			{rec.masterPlaylistUrl && (
				<div className="rounded-xl overflow-hidden bg-black">
					{/* biome-ignore lint/a11y/useMediaCaption: captions served via external track API */}
					<video
						src={rec.masterPlaylistUrl}
						controls
						poster={rec.thumbnailUrl}
						className="w-full aspect-video"
					/>
				</div>
			)}
			<div className="flex items-center justify-between text-[11px] text-muted">
				<span className="flex items-center gap-1">
					<Clock size={11} />
					Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
				</span>
				{rec.downloadUrl && rec.isDownloadEnabled && (
					<a
						href={rec.downloadUrl}
						target="_blank"
						rel="noreferrer"
						className="flex items-center gap-1 text-primary hover:text-primary/80"
					>
						<Download size={11} /> Download
					</a>
				)}
			</div>
		</div>
	);
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session }: { session: OneToOneSession }) {
	const [cancelOpen, setCancelOpen] = useState(false);
	const [reviewOpen, setReviewOpen] = useState(false);
	const [showRecording, setShowRecording] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");

	const { mutate: cancel, isPending: cancelling } = useCancelSession();
	const { mutate: review, isPending: reviewing } = useCreateSessionReview();

	const status = session.status;
	const cfg = statusConfig(status);
	const avail = session.teacherAvailability;
	const teacher = avail?.profile?.teacher?.user;
	const joinable = isJoinable(session);

	const initials = (teacher?.name ?? "T")
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<>
			<div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4">
				<div className="flex gap-3">
					{/* Teacher avatar */}
					<div className="shrink-0">
						{teacher?.image ? (
							<img
								src={teacher.image}
								alt={teacher.name}
								className="w-11 h-11 rounded-xl object-cover"
							/>
						) : (
							<div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
								<span className="text-primary font-bold text-sm">
									{initials}
								</span>
							</div>
						)}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between gap-2">
							<div>
								<p className="font-semibold text-sm">
									{teacher?.name ?? "Tutor"}
								</p>
								{session.topic && (
									<p className="text-xs text-muted mt-0.5">{session.topic}</p>
								)}
							</div>
							<Badge className={`text-[10px] border-0 shrink-0 ${cfg.color}`}>
								<cfg.icon size={10} className="mr-1" />
								{cfg.label}
							</Badge>
						</div>

						{/* Date/time */}
						<div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
							<span className="flex items-center gap-1">
								<CalendarDays size={11} />
								{formatScheduled(session)}
							</span>
							<span className="flex items-center gap-1">
								<Clock size={11} />
								{session.duration} min
							</span>
						</div>

						{session.notes && (
							<p className="text-xs text-muted mt-2 line-clamp-2 italic">
								"{session.notes}"
							</p>
						)}

						{/* Actions */}
						<div className="flex gap-2 mt-3 flex-wrap">
							{/* Join Live — available 15min before */}
							{session.jitsiStartUrl &&
								(status === "SCHEDULED" || status === "IN_PROGRESS") && (
									<a
										href={session.jitsiStartUrl}
										target="_blank"
										rel="noreferrer"
									>
										<Button
											size="sm"
											className={`text-xs gap-1 h-7 ${
												joinable
													? "bg-red-500 hover:bg-red-600 text-white"
													: "bg-primary/10 text-primary hover:bg-primary/20 border-0"
											}`}
										>
											{joinable ? (
												<>
													<span className="w-2 h-2 rounded-full bg-white animate-pulse" />
													Join Now
												</>
											) : (
												<>
													<ExternalLink size={12} /> Join Session
												</>
											)}
										</Button>
									</a>
								)}

							{/* Recording */}
							{status === "COMPLETED" && (
								<Button
									size="sm"
									variant="outline"
									className="text-xs gap-1 h-7"
									onClick={() => setShowRecording((p) => !p)}
								>
									<Video size={12} /> {showRecording ? "Hide" : "Watch"}{" "}
									Recording
								</Button>
							)}

							{/* Review */}
							{status === "COMPLETED" && !session.review && (
								<Button
									size="sm"
									variant="outline"
									className="text-xs gap-1 h-7 border-amber-300 text-amber-700 hover:bg-amber-50"
									onClick={() => setReviewOpen(true)}
								>
									<Star size={12} /> Leave Review
								</Button>
							)}

							{/* Review badge if already submitted */}
							{status === "COMPLETED" && session.review && (
								<div className="flex items-center gap-1 text-xs text-amber-600">
									<Star size={11} className="fill-amber-400 text-amber-400" />
									<span>{session.review.rating}/5 reviewed</span>
								</div>
							)}

							{/* Cancel */}
							{status === "SCHEDULED" && (
								<Button
									size="sm"
									variant="outline"
									className="text-xs gap-1 h-7 border-red-200 text-red-600 hover:bg-red-50"
									onClick={() => setCancelOpen(true)}
								>
									<XCircle size={12} /> Cancel
								</Button>
							)}
						</div>

						{/* Recording player (inline) */}
						{showRecording && status === "COMPLETED" && (
							<RecordingPlayer sessionId={session.id} />
						)}
					</div>
				</div>
			</div>

			{/* Cancel Dialog */}
			<Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Session</DialogTitle>
					</DialogHeader>
					<div className="space-y-3 py-2">
						<p className="text-sm text-muted">
							Are you sure you want to cancel this session with{" "}
							{teacher?.name ?? "your tutor"}?
						</p>
						<Textarea
							placeholder="Reason for cancellation (optional)"
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							rows={3}
						/>
					</div>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setCancelOpen(false)}>
							Keep Session
						</Button>
						<Button
							variant="destructive"
							disabled={cancelling}
							onClick={() =>
								cancel(
									{
										sessionId: session.id,
										cancellationReason: cancelReason || undefined,
									},
									{ onSuccess: () => setCancelOpen(false) },
								)
							}
						>
							{cancelling ? (
								<Loader2 size={14} className="animate-spin mr-1" />
							) : null}
							Cancel Session
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Review Dialog */}
			<Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Rate Your Session</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<p className="text-sm text-muted">
							How was your session with {teacher?.name ?? "your tutor"}?
						</p>
						<div>
							<p className="text-sm font-medium mb-2">Overall Rating</p>
							<StarRating value={rating} onChange={setRating} />
						</div>
						<div>
							<p className="text-sm font-medium mb-2">Comments (optional)</p>
							<Textarea
								placeholder="Share your experience to help other students…"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setReviewOpen(false)}>
							Skip
						</Button>
						<Button
							disabled={reviewing}
							className="bg-primary"
							onClick={() =>
								review(
									{
										sessionId: session.id,
										rating,
										comment: comment || undefined,
									},
									{ onSuccess: () => setReviewOpen(false) },
								)
							}
						>
							{reviewing ? (
								<Loader2 size={14} className="animate-spin mr-1" />
							) : null}
							Submit Review
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function SessionsPage() {
	const { data: profileData } = useGetStudentProfile();
	const studentId = profileData?.data?.id;

	const { data, isLoading } = useGetMyStudentSessions(studentId);
	const sessions: OneToOneSession[] = (data?.data ?? []) as OneToOneSession[];

	const upcoming = sessions.filter(
		(s) => s.status === "SCHEDULED" || s.status === "IN_PROGRESS",
	);
	const past = sessions.filter(
		(s) => s.status === "COMPLETED" || s.status === "CANCELLED",
	);

	const nextSession = upcoming.sort(
		(a, b) =>
			new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
	)[0];

	return (
		<div className="space-y-6 max-w-3xl">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold text-foreground">
						My Sessions
					</h1>
					<p className="text-muted text-sm mt-0.5">
						Your 1-on-1 tutoring sessions
					</p>
				</div>
				<Link to="/student-dashboard/find-tutor">
					<Button
						className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
						size="sm"
					>
						<UserSearch size={13} /> Find a Tutor
					</Button>
				</Link>
			</div>

			{/* Next session banner */}
			{nextSession && (
				<div className="bg-gradient-to-br from-[#1552fd] to-[#0d3197] rounded-2xl p-4 text-white">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs text-white/60 font-medium uppercase tracking-wide">
								Next Session
							</p>
							<p className="font-switzer font-bold text-sm mt-1">
								{nextSession.teacherAvailability?.profile?.teacher?.user
									?.name ?? "Tutor"}
							</p>
							<p className="text-xs text-white/70 mt-0.5 flex items-center gap-1">
								<CalendarDays size={11} />
								{formatScheduled(nextSession)}
								<span>· {nextSession.duration} min</span>
							</p>
						</div>
						{nextSession.jitsiStartUrl && (
							<a
								href={nextSession.jitsiStartUrl}
								target="_blank"
								rel="noreferrer"
							>
								<Button
									size="sm"
									className={`gap-1.5 text-xs shrink-0 ${
										isJoinable(nextSession)
											? "bg-white text-primary hover:bg-white/90"
											: "bg-white/15 text-white hover:bg-white/25 border-0"
									}`}
								>
									{isJoinable(nextSession) ? (
										<>
											<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
											Join Now
										</>
									) : (
										<>
											<Play size={12} /> Join Room
										</>
									)}
								</Button>
							</a>
						)}
					</div>
					{nextSession.topic && (
						<p className="text-xs text-white/60 mt-2 border-t border-white/10 pt-2">
							Topic: {nextSession.topic}
						</p>
					)}
				</div>
			)}

			{/* Session tabs */}
			<Tabs defaultValue="upcoming">
				<TabsList className="bg-white border border-border/60 rounded-xl p-1">
					{[
						{ value: "upcoming", label: "Upcoming", count: upcoming.length },
						{ value: "past", label: "Past", count: past.length },
						{ value: "all", label: "All", count: sessions.length },
					].map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="rounded-lg text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
						>
							{tab.label} ({tab.count})
						</TabsTrigger>
					))}
				</TabsList>

				{isLoading ? (
					<div className="flex justify-center py-12">
						<Loader2 size={24} className="animate-spin text-primary" />
					</div>
				) : (
					(["upcoming", "past", "all"] as const).map((tab) => {
						const list =
							tab === "upcoming" ? upcoming : tab === "past" ? past : sessions;
						return (
							<TabsContent key={tab} value={tab} className="mt-4 space-y-3">
								{list.length === 0 ? (
									<div className="flex flex-col items-center py-12 gap-3">
										<CalendarDays size={40} className="text-muted/20" />
										<p className="text-sm text-muted">No sessions found</p>
										{tab === "upcoming" && (
											<Link to="/student-dashboard/find-tutor">
												<Button
													variant="outline"
													size="sm"
													className="gap-1.5 text-xs"
												>
													<UserSearch size={13} /> Book a Session
												</Button>
											</Link>
										)}
									</div>
								) : (
									list.map((s) => <SessionCard key={s.id} session={s} />)
								)}
							</TabsContent>
						);
					})
				)}
			</Tabs>
		</div>
	);
}
