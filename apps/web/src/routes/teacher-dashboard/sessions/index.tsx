/**
 * Teacher Dashboard – 1-on-1 Sessions
 * Route: /teacher-dashboard/sessions
 *
 * Three tabs:
 *  - Upcoming  — join, start, end, cancel
 *  - Past       — watch recording, respond to review
 *  - Availability — manage bookable slots (recurring + one-time)
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	CalendarDays,
	CalendarPlus,
	CheckCircle2,
	Clock,
	Download,
	Loader2,
	MessageSquareReply,
	Play,
	Plus,
	RefreshCcw,
	Square,
	Star,
	Trash2,
	Video,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import SessionCallOverlay from "@/components/SessionCallOverlay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGetSessionRecording } from "@/hooks/onetoone";
import {
	type AvailabilitySlot,
	type DayOfWeek,
	type TeacherSession,
	useAddAvailability,
	useCancelTeacherSession,
	useDeleteAvailability,
	useEndSession,
	useGetOwnAvailability,
	useGetTeacherMe,
	useGetTeacherOwnSessions,
	useRespondToReview,
	useStartSession,
} from "@/hooks/teacher";

export const Route = createFileRoute("/teacher-dashboard/sessions/")({
	component: TeacherSessionsPage,
});

type SessionStatus = TeacherSession["status"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusConfig(status: SessionStatus) {
	const map: Record<
		SessionStatus,
		{ label: string; color: string; icon: React.ElementType }
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

function isJoinable(session: TeacherSession): boolean {
	if (session.status !== "SCHEDULED" && session.status !== "IN_PROGRESS")
		return false;
	return Date.now() >= new Date(session.scheduledAt).getTime() - 15 * 60 * 1000;
}

const DAYS: DayOfWeek[] = [
	"MONDAY",
	"TUESDAY",
	"WEDNESDAY",
	"THURSDAY",
	"FRIDAY",
	"SATURDAY",
	"SUNDAY",
];

const dayLabel = (d: DayOfWeek) => d.charAt(0) + d.slice(1).toLowerCase();

// ─── Recording Player ─────────────────────────────────────────────────────────

function RecordingPlayer({ sessionId }: { sessionId: string }) {
	const { data, isLoading } = useGetSessionRecording(sessionId);
	const rec = data?.data;

	if (isLoading)
		return (
			<div className="flex items-center gap-2 text-xs text-muted mt-3">
				<Loader2 size={12} className="animate-spin" /> Loading recording…
			</div>
		);

	if (!rec || rec.status !== "ready") {
		return (
			<p className="text-xs text-muted italic mt-3">
				{rec?.status === "processing"
					? "Recording is being processed…"
					: "Recording not available"}
			</p>
		);
	}

	const daysLeft = Math.max(
		0,
		Math.ceil((new Date(rec.expiresAt).getTime() - Date.now()) / 86400000),
	);

	return (
		<div className="space-y-2 mt-3">
			{rec.masterPlaylistUrl && (
				<div className="rounded-xl overflow-hidden bg-black">
					{/* biome-ignore lint/a11y/useMediaCaption: captions served via external track API */}
					<video
						src={rec.masterPlaylistUrl}
						controls
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

function SessionCard({
	session,
	teacherId,
}: {
	session: TeacherSession;
	teacherId: string;
}) {
	const id = useId();
	const [cancelOpen, setCancelOpen] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [callOpen, setCallOpen] = useState(false);
	const [showRecording, setShowRecording] = useState(false);
	const [respondOpen, setRespondOpen] = useState(false);
	const [responseText, setResponseText] = useState("");

	const { mutate: start, isPending: starting } = useStartSession(teacherId);
	const { mutate: end, isPending: ending } = useEndSession(teacherId);
	const { mutate: cancel, isPending: cancelling } =
		useCancelTeacherSession(teacherId);
	const { mutate: respond, isPending: responding } = useRespondToReview();

	const cfg = statusConfig(session.status);
	const student = session.student?.user;
	const joinable = isJoinable(session);

	const initials = (student?.name ?? "S")
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<>
			<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4">
				<div className="flex gap-3">
					<div className="shrink-0">
						{student?.image ? (
							<img
								src={student.image}
								alt={student.name}
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
									{student?.name ?? "Student"}
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

						<div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
							<span className="flex items-center gap-1">
								<CalendarDays size={11} />
								{new Date(session.scheduledAt).toLocaleDateString("en-US", {
									weekday: "short",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							<span className="flex items-center gap-1">
								<Clock size={11} />
								{session.duration} min
							</span>
						</div>

						{session.review && (
							<div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
								{Array.from({ length: session.review.rating }).map((_, i) => (
									<Star
										// biome-ignore lint/suspicious/noArrayIndexKey: static array
										key={i}
										size={11}
										className="fill-amber-400 text-amber-400"
									/>
								))}
								{session.review.comment && (
									<span className="text-muted ml-1 line-clamp-1">
										"{session.review.comment}"
									</span>
								)}
							</div>
						)}

						<div className="flex flex-wrap gap-2 mt-3">
							{session.status === "SCHEDULED" && joinable && (
								<>
									<Button
										size="sm"
										className="bg-red-500 hover:bg-red-600 text-white text-xs gap-1.5 animate-pulse"
										onClick={() => {
											start(session.id);
											setCallOpen(true);
										}}
										disabled={starting}
									>
										{starting ? (
											<Loader2 size={12} className="animate-spin" />
										) : (
											<Play size={12} />
										)}{" "}
										Start & Join
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
										onClick={() => setCancelOpen(true)}
									>
										Cancel
									</Button>
								</>
							)}

							{session.status === "SCHEDULED" && !joinable && (
								<>
									<Button
										size="sm"
										variant="outline"
										className="text-xs gap-1.5"
										disabled
									>
										<Clock size={12} /> Starts soon
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
										onClick={() => setCancelOpen(true)}
									>
										Cancel
									</Button>
								</>
							)}

							{session.status === "IN_PROGRESS" && (
								<>
									<Button
										size="sm"
										className="bg-primary hover:bg-primary/90 text-xs gap-1.5"
										onClick={() => setCallOpen(true)}
									>
										Rejoin Session
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="text-xs gap-1.5 text-amber-600 hover:bg-amber-50"
										onClick={() => end(session.id)}
										disabled={ending}
									>
										{ending ? (
											<Loader2 size={12} className="animate-spin" />
										) : (
											<Square size={12} />
										)}{" "}
										End Session
									</Button>
								</>
							)}

							{session.status === "COMPLETED" && (
								<>
									<Button
										size="sm"
										variant="outline"
										className="text-xs gap-1.5"
										onClick={() => setShowRecording((p) => !p)}
									>
										<Video size={12} />
										{showRecording ? "Hide" : "Watch"} Recording
									</Button>
									{session.review && (
										<Button
											size="sm"
											variant="outline"
											className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
											onClick={() => setRespondOpen(true)}
										>
											<MessageSquareReply size={12} />
											Reply to Review
										</Button>
									)}
								</>
							)}
						</div>

						{showRecording && session.status === "COMPLETED" && (
							<RecordingPlayer sessionId={session.id} />
						)}
					</div>
				</div>
			</div>
			{/* Cancel Dialog */}
			<Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">Cancel Session?</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-muted">
						The student will be notified. Please provide a reason.
					</p>
					<div className="space-y-1.5">
						<label
							htmlFor={`${id}-cancel-reason`}
							className="text-sm font-medium"
						>
							Reason
						</label>
						<Textarea
							id={`${id}-cancel-reason`}
							rows={3}
							placeholder="e.g. Emergency, reschedule needed…"
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCancelOpen(false)}
						>
							Back
						</Button>
						<Button
							size="sm"
							className="bg-red-500 hover:bg-red-600 text-white"
							onClick={() => {
								cancel({ sessionId: session.id, reason: cancelReason });
								setCancelOpen(false);
							}}
							disabled={cancelling}
						>
							{cancelling ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Cancel Session"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* Review Response Dialog */}
			<Dialog open={respondOpen} onOpenChange={setRespondOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">
							Reply to Student Review
						</DialogTitle>
					</DialogHeader>
					{session.review && (
						<div className="bg-amber-50 rounded-xl p-3 space-y-1 border border-amber-100">
							<div className="flex items-center gap-1">
								{Array.from({ length: session.review.rating }).map((_, i) => (
									<Star
										// biome-ignore lint/suspicious/noArrayIndexKey: static array
										key={i}
										size={12}
										className="fill-amber-400 text-amber-400"
									/>
								))}
								<span className="text-xs text-muted ml-1">
									{student?.name ?? "Student"}
								</span>
							</div>
							{session.review.comment && (
								<p className="text-xs text-muted italic">
									"{session.review.comment}"
								</p>
							)}
						</div>
					)}
					<div className="space-y-1.5">
						<label
							htmlFor={`${id}-review-response`}
							className="text-sm font-medium"
						>
							Your Response
						</label>
						<Textarea
							id={`${id}-review-response`}
							rows={4}
							placeholder="Thank the student, address their feedback…"
							value={responseText}
							onChange={(e) => setResponseText(e.target.value)}
						/>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRespondOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							disabled={responding || !responseText.trim()}
							onClick={() => {
								respond(
									{ sessionId: session.id, response: responseText },
									{ onSuccess: () => setRespondOpen(false) },
								);
							}}
						>
							{responding ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Submit Response"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* In-app LiveKit call */}
			{callOpen && (
				<SessionCallOverlay
					sessionId={session.id}
					title={
						student?.name ? `Session with ${student.name}` : "Live session"
					}
					onClose={() => setCallOpen(false)}
				/>
			)}
		</>
	);
}

// ─── Availability Tab ─────────────────────────────────────────────────────────

function AvailabilityTab({ teacherId }: { teacherId: string }) {
	const id = useId();
	const { data, isLoading } = useGetOwnAvailability(teacherId);
	const slots = data?.data ?? [];

	const { mutate: addSlot, isPending: adding } = useAddAvailability(teacherId);
	const { mutate: deleteSlot } = useDeleteAvailability();

	const [recurringOpen, setRecurringOpen] = useState(false);
	const [oneTimeOpen, setOneTimeOpen] = useState(false);

	const [rDay, setRDay] = useState<DayOfWeek>("MONDAY");
	const [rStart, setRStart] = useState("09:00");
	const [rEnd, setREnd] = useState("10:00");

	const [oDate, setODate] = useState("");
	const [oStart, setOStart] = useState("09:00");
	const [oEnd, setOEnd] = useState("10:00");

	const recurring = slots.filter(
		(s) => s.availabilityType === "RECURRING_WEEKLY",
	);
	const oneTime = slots.filter((s) => s.availabilityType === "ONE_TIME_SLOT");

	const handleAddRecurring = () => {
		addSlot(
			{
				availabilityType: "RECURRING_WEEKLY",
				dayOfWeek: rDay,
				startTime: rStart,
				endTime: rEnd,
			},
			{
				onSuccess: () => {
					setRecurringOpen(false);
					setRDay("MONDAY");
					setRStart("09:00");
					setREnd("10:00");
				},
			},
		);
	};

	const handleAddOneTime = () => {
		if (!oDate) return;
		addSlot(
			{
				availabilityType: "ONE_TIME_SLOT",
				specificDate: oDate,
				specificStartTime: oStart,
				specificEndTime: oEnd,
			},
			{
				onSuccess: () => {
					setOneTimeOpen(false);
					setODate("");
					setOStart("09:00");
					setOEnd("10:00");
				},
			},
		);
	};

	return (
		<div className="space-y-4">
			{/* Header row */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted">
					Set when students can book sessions with you
				</p>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						className="gap-1.5 text-xs"
						onClick={() => setRecurringOpen(true)}
					>
						<RefreshCcw size={13} /> Recurring
					</Button>
					<Button
						size="sm"
						className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
						onClick={() => setOneTimeOpen(true)}
					>
						<CalendarPlus size={13} /> One-time
					</Button>
				</div>
			</div>

			{/* Info banner */}
			<div className="bg-primary/5 rounded-xl border border-primary/10 p-4">
				<p className="text-xs text-muted leading-relaxed">
					<strong>Recurring slots</strong> repeat every week on the selected day
					and time. <strong>One-time slots</strong> are specific dates. Students
					see these as bookable times when browsing your profile.
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-12">
					<Loader2 size={24} className="animate-spin text-primary" />
				</div>
			) : slots.length === 0 ? (
				<div className="flex flex-col items-center py-16 gap-4">
					<div className="w-16 h-16 rounded-lg bg-primary/8 flex items-center justify-center">
						<Clock size={28} className="text-primary/40" />
					</div>
					<div className="text-center">
						<h3 className="font-switzer font-semibold text-sm">No slots set</h3>
						<p className="text-xs text-muted mt-1">
							Add recurring weekly slots or specific one-time dates.
						</p>
					</div>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							className="gap-1.5 text-xs"
							onClick={() => setRecurringOpen(true)}
						>
							<RefreshCcw size={13} /> Add Recurring
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90 gap-1.5 text-xs"
							onClick={() => setOneTimeOpen(true)}
						>
							<Plus size={13} /> Add One-time
						</Button>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{/* Recurring */}
					{recurring.length > 0 && (
						<div>
							<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
								Recurring Weekly ({recurring.length})
							</p>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{recurring.map((slot: AvailabilitySlot) => (
									<div
										key={slot.id}
										className="bg-white rounded-xl border border-border/60 shadow-sm p-4 flex items-center gap-3"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<Badge className="bg-primary/10 text-primary border-0 text-[10px]">
													{slot.dayOfWeek && dayLabel(slot.dayOfWeek)}
												</Badge>
												{slot.isBooked && (
													<Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
														Booked
													</Badge>
												)}
											</div>
											<p className="text-sm font-semibold mt-1.5 flex items-center gap-1.5">
												<Clock size={13} className="text-muted" />
												{slot.startTime} – {slot.endTime}
											</p>
										</div>
										{!slot.isBooked && (
											<button
												type="button"
												onClick={() => deleteSlot(slot.id)}
												className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
											>
												<Trash2 size={14} />
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* One-time */}
					{oneTime.length > 0 && (
						<div>
							<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
								One-time Slots ({oneTime.length})
							</p>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
								{oneTime.map((slot: AvailabilitySlot) => (
									<div
										key={slot.id}
										className="bg-white rounded-xl border border-border/60 shadow-sm p-4 flex items-center gap-3"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<Badge className="bg-violet-100 text-violet-700 border-0 text-[10px]">
													{slot.specificDate &&
														new Date(slot.specificDate).toLocaleDateString(
															"en-US",
															{
																month: "short",
																day: "numeric",
																year: "numeric",
															},
														)}
												</Badge>
												{slot.isBooked && (
													<Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">
														Booked
													</Badge>
												)}
											</div>
											<p className="text-sm font-semibold mt-1.5 flex items-center gap-1.5">
												<Clock size={13} className="text-muted" />
												{slot.specificStartTime} – {slot.specificEndTime}
											</p>
										</div>
										{!slot.isBooked && (
											<button
												type="button"
												onClick={() => deleteSlot(slot.id)}
												className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
											>
												<Trash2 size={14} />
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Recurring Dialog */}
			<Dialog open={recurringOpen} onOpenChange={setRecurringOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">
							Add Recurring Slot
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1.5">
							<label htmlFor={`${id}-r-day`} className="text-sm font-medium">
								Day of Week
							</label>
							<Select
								value={rDay}
								onValueChange={(v) => setRDay(v as DayOfWeek)}
							>
								<SelectTrigger id={`${id}-r-day`} className="text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{DAYS.map((d) => (
										<SelectItem key={d} value={d}>
											{dayLabel(d)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<label
									htmlFor={`${id}-r-start`}
									className="text-sm font-medium"
								>
									Start Time
								</label>
								<Input
									id={`${id}-r-start`}
									type="time"
									value={rStart}
									onChange={(e) => setRStart(e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor={`${id}-r-end`} className="text-sm font-medium">
									End Time
								</label>
								<Input
									id={`${id}-r-end`}
									type="time"
									value={rEnd}
									onChange={(e) => setREnd(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setRecurringOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleAddRecurring}
							disabled={adding}
						>
							{adding ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Add Slot"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* One-time Dialog */}
			<Dialog open={oneTimeOpen} onOpenChange={setOneTimeOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="font-switzer">
							Add One-time Slot
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<div className="space-y-1.5">
							<label htmlFor={`${id}-o-date`} className="text-sm font-medium">
								Date
							</label>
							<Input
								id={`${id}-o-date`}
								type="date"
								value={oDate}
								onChange={(e) => setODate(e.target.value)}
								min={new Date().toISOString().split("T")[0]}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<label
									htmlFor={`${id}-o-start`}
									className="text-sm font-medium"
								>
									Start Time
								</label>
								<Input
									id={`${id}-o-start`}
									type="time"
									value={oStart}
									onChange={(e) => setOStart(e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor={`${id}-o-end`} className="text-sm font-medium">
									End Time
								</label>
								<Input
									id={`${id}-o-end`}
									type="time"
									value={oEnd}
									onChange={(e) => setOEnd(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setOneTimeOpen(false)}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleAddOneTime}
							disabled={adding || !oDate}
						>
							{adding ? (
								<Loader2 size={14} className="animate-spin" />
							) : (
								"Add Slot"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function TeacherSessionsPage() {
	// onetoone endpoints are keyed by Teacher.id (NOT User.id) — resolve it.
	const { data: teacherMe } = useGetTeacherMe();
	const teacherId = teacherMe?.id ?? "";
	const { data, isLoading } = useGetTeacherOwnSessions(teacherId);
	const sessions = data?.data ?? [];

	const upcoming = sessions.filter(
		(s) => s.status === "SCHEDULED" || s.status === "IN_PROGRESS",
	);
	const past = sessions.filter(
		(s) => s.status === "COMPLETED" || s.status === "CANCELLED",
	);
	const totalCompleted = sessions.filter(
		(s) => s.status === "COMPLETED",
	).length;
	const totalCancelled = sessions.filter(
		(s) => s.status === "CANCELLED",
	).length;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row items-center justify-between">
				<div>
					<h1 className="text-xl font-switzer font-bold">1-on-1 Sessions</h1>
					<p className="text-muted text-sm mt-0.5">
						Manage your sessions and set your availability for student bookings.
					</p>
				</div>
				<Button>
					<Link to="/teacher-dashboard/sessions/schedule/">
						Manage Schedule
					</Link>
				</Button>
			</div>

			{/* Stats row */}
			{sessions.length > 0 && (
				<div className="grid grid-cols-3 gap-3">
					<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4 text-center">
						<p className="text-2xl font-bold font-switzer text-primary">
							{upcoming.length}
						</p>
						<p className="text-[11px] text-muted mt-0.5">Upcoming</p>
					</div>
					<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4 text-center">
						<p className="text-2xl font-bold font-switzer text-emerald-600">
							{totalCompleted}
						</p>
						<p className="text-[11px] text-muted mt-0.5">Completed</p>
					</div>
					<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4 text-center">
						<p className="text-2xl font-bold font-switzer text-red-500">
							{totalCancelled}
						</p>
						<p className="text-[11px] text-muted mt-0.5">Cancelled</p>
					</div>
				</div>
			)}

			<Tabs defaultValue="upcoming">
				<TabsList className="w-full max-w-sm">
					<TabsTrigger value="upcoming" className="flex-1">
						Upcoming ({upcoming.length})
					</TabsTrigger>
					<TabsTrigger value="past" className="flex-1">
						Past ({past.length})
					</TabsTrigger>
					<TabsTrigger value="availability" className="flex-1">
						Availability
					</TabsTrigger>
				</TabsList>

				{/* Upcoming */}
				<TabsContent value="upcoming" className="mt-4 space-y-3">
					{isLoading ? (
						<div className="flex justify-center py-16">
							<Loader2 size={28} className="animate-spin text-primary" />
						</div>
					) : upcoming.length === 0 ? (
						<div className="flex flex-col items-center py-20 gap-3 text-muted">
							<CalendarDays size={48} className="opacity-20" />
							<p className="text-sm">No upcoming sessions</p>
							<p className="text-xs text-center max-w-xs">
								Students will book sessions once you set your availability.
							</p>
						</div>
					) : (
						upcoming.map((s) => (
							<SessionCard key={s.id} session={s} teacherId={teacherId} />
						))
					)}
				</TabsContent>

				{/* Past */}
				<TabsContent value="past" className="mt-4 space-y-3">
					{isLoading ? (
						<div className="flex justify-center py-16">
							<Loader2 size={28} className="animate-spin text-primary" />
						</div>
					) : past.length === 0 ? (
						<p className="text-sm text-muted py-8 text-center">
							No past sessions yet
						</p>
					) : (
						past.map((s) => (
							<SessionCard key={s.id} session={s} teacherId={teacherId} />
						))
					)}
				</TabsContent>

				{/* Availability */}
				<TabsContent value="availability" className="mt-4">
					<AvailabilityTab teacherId={teacherId} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
