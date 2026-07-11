/**
 * Phase 4 – Teacher Profile + Booking
 * Route: /student-dashboard/find-tutor/$teacherId
 *
 * Sections:
 *  1. Teacher profile hero (photo, bio, rating, hourly rate, subjects, total sessions)
 *  2. Intro video (if provided)
 *  3. Availability calendar – week view with bookable slots
 *  4. Booking dialog: slot → topic → notes → confirm → POST /onetoone/sessions/book
 *  5. Reviews section
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Globe,
	Loader2,
	Play,
	Star,
	Video,
} from "lucide-react";
import { useId, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
	type OneToOneReview,
	type TeacherAvailabilitySlot,
	useBookSession,
	useGetAvailableSlots,
	useGetTeacherProfile,
	useGetTeacherReviews,
} from "@/hooks/onetoone";

export const Route = createFileRoute(
	"/student-dashboard/find-tutor/$teacherId",
)({
	component: TeacherProfilePage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number): Date {
	const d = new Date(date);
	d.setDate(d.getDate() + days);
	return d;
}

function formatSlotTime(slot: TeacherAvailabilitySlot): string {
	if (
		slot.availabilityType === ("ONE_TIME_SLOT" as any) &&
		slot.specificStartTime
	) {
		return new Date(slot.specificStartTime).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	return slot.startTime ?? "—";
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					size={size}
					className={
						n <= Math.round(rating)
							? "text-amber-400 fill-amber-400"
							: "text-muted/30"
					}
				/>
			))}
			<span className="ml-1 text-xs text-muted">{rating.toFixed(1)}</span>
		</div>
	);
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: OneToOneReview }) {
	const user = review.student?.user;
	const initials = (user?.name ?? "S")
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div className="bg-muted/5 rounded-xl p-4 border border-border/60">
			<div className="flex items-start gap-3">
				<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
					{user?.image ? (
						<img
							src={user.image}
							alt={user.name}
							className="w-9 h-9 rounded-full object-cover"
						/>
					) : (
						<span className="text-primary text-xs font-bold">{initials}</span>
					)}
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between gap-2">
						<p className="text-xs font-semibold">{user?.name ?? "Student"}</p>
						<p className="text-[10px] text-muted">
							{new Date(review.createdAt).toLocaleDateString("en-US", {
								month: "short",
								year: "numeric",
							})}
						</p>
					</div>
					<div className="mt-0.5">
						<RatingStars rating={review.rating} size={11} />
					</div>
					{review.comment && (
						<p className="text-xs text-muted mt-2 leading-relaxed">
							{review.comment}
						</p>
					)}
					{review.response && (
						<div className="mt-2 pl-3 border-l-2 border-primary/30">
							<p className="text-[11px] text-primary font-medium">
								Teacher's response:
							</p>
							<p className="text-xs text-muted mt-0.5">{review.response}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// ─── Availability Calendar ────────────────────────────────────────────────────

function AvailabilityCalendar({
	teacherId,
	hourlyRate,
	onBook,
}: {
	teacherId: string;
	hourlyRate: number;
	onBook: (slot: TeacherAvailabilitySlot) => void;
}) {
	const [weekStart, setWeekStart] = useState(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		// Start from today
		return d;
	});

	const startDate = format(weekStart, "yyyy-MM-dd");
	const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd");

	const { data, isLoading } = useGetAvailableSlots(
		teacherId,
		startDate,
		endDate,
	);
	const slots: TeacherAvailabilitySlot[] = (data?.data ?? []).filter(
		(s) => !s.isBooked,
	);

	// Group slots by day
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
	const slotsByDay: Record<string, TeacherAvailabilitySlot[]> = {};
	for (const slot of slots) {
		const dayKey = slot.specificDate
			? format(new Date(slot.specificDate), "yyyy-MM-dd")
			: (slot.dayOfWeek ?? "UNKNOWN");
		if (!slotsByDay[dayKey]) slotsByDay[dayKey] = [];
		slotsByDay[dayKey].push(slot);
	}

	const prevWeek = () => setWeekStart((d) => addDays(d, -7));
	const nextWeek = () => setWeekStart((d) => addDays(d, 7));

	return (
		<div>
			{/* Week navigation */}
			<div className="flex items-center justify-between mb-4">
				<Button
					variant="outline"
					size="sm"
					className="gap-1 text-xs"
					onClick={prevWeek}
					disabled={weekStart <= new Date()}
				>
					<ChevronLeft size={13} /> Prev
				</Button>
				<span className="text-sm font-medium">
					{weekStart.toLocaleDateString("en-US", { month: "long" })}{" "}
					{weekStart.getDate()} –{" "}
					{addDays(weekStart, 6).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					})}
				</span>
				<Button
					variant="outline"
					size="sm"
					className="gap-1 text-xs"
					onClick={nextWeek}
				>
					Next <ChevronRight size={13} />
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 size={20} className="animate-spin text-primary" />
				</div>
			) : (
				<div className="grid grid-cols-7 gap-2">
					{weekDays.map((day) => {
						const dayKey = format(day, "yyyy-MM-dd");
						const dowKey = day
							.toLocaleDateString("en-US", { weekday: "long" })
							.toUpperCase();
						const daySlots = slotsByDay[dayKey] ?? slotsByDay[dowKey] ?? [];
						const isToday =
							format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

						return (
							<div key={dayKey} className="space-y-1.5">
								{/* Day header */}
								<div
									className={`text-center py-1.5 rounded-lg text-[11px] ${
										isToday
											? "bg-primary text-white font-bold"
											: "bg-muted/8 text-muted font-medium"
									}`}
								>
									<p>{day.toLocaleDateString("en-US", { weekday: "short" })}</p>
									<p>{day.getDate()}</p>
								</div>

								{/* Slot pills */}
								{daySlots.length === 0 ? (
									<div className="text-center py-2">
										<span className="text-[10px] text-muted/40">–</span>
									</div>
								) : (
									daySlots.map((slot) => (
										<button
											key={slot.id}
											type="button"
											onClick={() => onBook(slot)}
											className="w-full text-center text-[10px] py-1.5 px-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-medium"
										>
											{formatSlotTime(slot)}
										</button>
									))
								)}
							</div>
						);
					})}
				</div>
			)}

			{slots.length === 0 && !isLoading && (
				<p className="text-center text-xs text-muted py-4">
					No available slots this week — try next week
				</p>
			)}

			{/* Legend */}
			<div className="flex items-center gap-3 mt-3 text-[11px] text-muted">
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 rounded-sm bg-primary/10" />
					Available (≈ ${hourlyRate}/hr)
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 rounded-sm bg-muted/20" />
					No slots
				</div>
			</div>
		</div>
	);
}

// ─── Booking Dialog ───────────────────────────────────────────────────────────

function BookingDialog({
	slot,
	hourlyRate,
	teacherName,
	onClose,
}: {
	slot: TeacherAvailabilitySlot;
	hourlyRate: number;
	teacherName: string;
	onClose: () => void;
}) {
	const bookingTopicId = useId();
	const bookingNotesId = useId();
	const [topic, setTopic] = useState("");
	const [notes, setNotes] = useState("");
	const { mutate: bookSession, isPending, isSuccess } = useBookSession();
	console.log("slottttttttttttttttt", slot);
	const slotDate = format(
		slot.specificDate ? new Date(slot.specificDate) : new Date(),
		"EEE, MMM d",
	);
	const startTime = format(
		slot.specificStartTime ? new Date(slot.specificStartTime) : new Date(),
		"h:mm a",
	);
	const endTime = format(
		slot.specificEndTime ? new Date(slot.specificEndTime) : new Date(),
		"h:mm a",
	);

	// Approximate duration (60 min default)
	const duration = 60;
	const price = (hourlyRate * duration) / 60;

	const [paymentMethod, setPaymentMethod] = useState<
		"card" | "bank_transfer" | "paypal"
	>("card");

	const handleBook = () => {
		bookSession(
			{
				teacherAvailabilityId: slot.id,
				topic: topic || undefined,
				notes: notes || undefined,
				paymentMethod,
				paymentProvider: "STRIPE",
			},
			{ onSuccess: onClose },
		);
	};

	if (isSuccess) {
		return (
			<DialogContent>
				<div className="flex flex-col items-center py-6 gap-4 text-center">
					<div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
						<CheckCircle2 size={32} className="text-emerald-600" />
					</div>
					<div>
						<h3 className="font-switzer font-bold text-base">
							Session Booked!
						</h3>
						<p className="text-sm text-muted mt-1">
							Your session with {teacherName} has been confirmed. You'll receive
							a Jitsi join link shortly.
						</p>
					</div>
					<Link to="/student-dashboard/sessions">
						<Button className="bg-primary" onClick={onClose}>
							View My Sessions
						</Button>
					</Link>
				</div>
			</DialogContent>
		);
	}

	return (
		<DialogContent className="max-w-md">
			<DialogHeader>
				<DialogTitle className="font-switzer">Book a Session</DialogTitle>
			</DialogHeader>

			<div className="space-y-4 py-2">
				{/* Slot summary */}
				<div className="bg-primary/5 rounded-xl p-4 space-y-2">
					<div className="flex items-center gap-2 text-sm">
						<Calendar size={14} className="text-primary" />
						<span className="font-medium">{slotDate}</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<Clock size={14} className="text-primary" />
						<span>
							{startTime} – {endTime}
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm font-bold text-primary">
						<Video size={14} />
						<span>Jitsi Video Call ({duration} min)</span>
					</div>
				</div>

				{/* Session topic */}
				<div>
					<label
						htmlFor="booking-topic"
						className="text-xs font-medium text-foreground mb-1.5 block"
					>
						Session Topic (optional)
					</label>
					<Input
						id={bookingTopicId}
						placeholder="e.g. SAT Math - Quadratics"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						className="text-sm"
					/>
				</div>

				{/* Notes */}
				<div>
					<label
						htmlFor="booking-notes"
						className="text-xs font-medium text-foreground mb-1.5 block"
					>
						Additional Notes (optional)
					</label>
					<Textarea
						id={bookingNotesId}
						placeholder="Any specific topics you'd like to cover, questions, or context for the tutor…"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						rows={3}
						className="text-sm"
					/>
				</div>

				{/* Payment Method */}
				<div>
					<p className="text-xs font-medium text-foreground mb-2">
						Payment Method
					</p>
					<div className="flex gap-2">
						{(["card", "bank_transfer", "paypal"] as const).map((method) => (
							<button
								key={method}
								type="button"
								onClick={() => setPaymentMethod(method)}
								className={`flex-1 text-xs py-2 px-3 rounded-lg border transition-colors capitalize ${
									paymentMethod === method
										? "bg-primary text-white border-primary"
										: "border-border/60 text-muted hover:border-primary/40"
								}`}
							>
								{method === "card" && "💳 Card"}
								{method === "bank_transfer" && "🏦 Bank Transfer"}
								{method === "paypal" && "🅿️ PayPal"}
							</button>
						))}
					</div>
				</div>

				{/* Price */}
				<div className="flex items-center justify-between py-3 border-t border-border/60">
					<span className="text-sm text-muted">Session Fee</span>
					<span className="font-bold text-foreground">
						${price.toLocaleString()}
					</span>
				</div>

				<p className="text-[11px] text-muted text-center">
					Payment will be processed after booking confirmation
				</p>
			</div>

			<DialogFooter>
				<Button variant="ghost" onClick={onClose} disabled={isPending}>
					Cancel
				</Button>
				<Button
					className="bg-primary"
					onClick={handleBook}
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 size={14} className="animate-spin mr-1" />
					) : null}
					Confirm Booking
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function TeacherProfilePage() {
	const { teacherId } = Route.useParams();
	const [bookingSlot, setBookingSlot] =
		useState<TeacherAvailabilitySlot | null>(null);

	const { data: profileRes, isLoading } = useGetTeacherProfile(teacherId);
	const { data: reviewsRes } = useGetTeacherReviews(teacherId);

	const teacher = profileRes?.data;
	const reviews: OneToOneReview[] = reviewsRes?.data ?? [];
	const user = teacher?.teacher?.user;

	const initials = (user?.name ?? "T")
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	// Check if teacher has upcoming available slots
	const hasUpcomingSlots = (): boolean => {
		if (!teacher?.availabilities?.length) return false;
		const now = new Date();
		return teacher.availabilities.some((slot) => {
			if (!slot.isActive || slot.isBooked) return false;
			if (slot.specificDate) {
				const slotDateTime = slot.specificStartTime
					? new Date(slot.specificStartTime)
					: new Date(slot.specificDate);
				return slotDateTime > now;
			}
			if (slot.dayOfWeek) return true;
			return false;
		});
	};

	if (isLoading) {
		return (
			<div className="flex justify-center py-20">
				<Loader2 size={28} className="animate-spin text-primary" />
			</div>
		);
	}

	if (!teacher) {
		return (
			<div className="flex flex-col items-center py-20 gap-3 text-muted">
				<p className="text-sm">Teacher not found</p>
				<Link to="/student-dashboard/find-tutor">
					<Button variant="outline" size="sm">
						Back to Tutors
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-4xl">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-xs">
				<Link to="/student-dashboard/find-tutor">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 text-muted text-xs h-7 px-2"
					>
						<ArrowLeft size={13} /> Find Tutors
					</Button>
				</Link>
				<ChevronRight size={12} className="text-muted" />
				<span className="font-medium truncate">{user?.name}</span>
			</div>

			{/* Hero */}
			<div className="bg-white rounded-lg border border-border/60 shadow-sm overflow-hidden">
				{/* Blue banner */}
				<div className="h-24 bg-primary" />

				<div className="px-6 pb-6">
					{/* Avatar row */}
					<div className="flex items-end justify-between -mt-10 mb-4">
						<div className="relative">
							{user?.image ? (
								<img
									src={user.image}
									alt={user.name}
									className="w-20 h-20 rounded-lg object-cover border-4 border-white shadow-sm"
								/>
							) : (
								<div className="w-20 h-20 rounded-lg bg-primary-light border-4 border-white flex items-center justify-center shadow-sm">
									<span className="text-primary font-bold text-2xl">
										{initials}
									</span>
								</div>
							)}
							{teacher.isAvailable && (
								<div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
									<span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
									AVAILABLE
								</div>
							)}
						</div>

						<div className="flex flex-col items-end gap-0.5 mt-10">
							<p className="text-2xl font-bold text-foreground">
								${Number(teacher.onlineHourlyRate).toLocaleString()}
							</p>
							<p className="text-[10px] text-muted">online / hour</p>
							{teacher.offlineHourlyRate && (
								<>
									<p className="text-lg font-semibold text-foreground mt-1">
										${Number(teacher.offlineHourlyRate).toLocaleString()}
									</p>
									<p className="text-[10px] text-muted">offline / hour</p>
								</>
							)}
						</div>
					</div>

					{/* Name + info */}
					<div className="space-y-2">
						<div>
							<h1 className="font-switzer font-bold text-xl">{user?.name}</h1>
							<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
								{user?.email && (
									<p className="text-xs text-muted">{user.email}</p>
								)}
								{user?.phone && (
									<p className="text-xs text-muted">{user.phone}</p>
								)}
								{teacher.timezone && (
									<p className="text-xs text-muted flex items-center gap-1">
										<Globe size={11} /> {teacher.timezone}
									</p>
								)}
							</div>
						</div>

						{/* Stats */}
						<div className="flex flex-wrap gap-4 text-sm">
							<div className="flex items-center gap-1.5">
								<Video size={14} className="text-primary" />
								<span className="font-semibold">{teacher.totalSessions}</span>
								<span className="text-muted text-xs">sessions</span>
							</div>
							<div className="flex items-center gap-1.5">
								{teacher.rating > 0 && <RatingStars rating={teacher.rating} />}
								<span className="text-muted text-xs">
									({teacher.totalReviews} reviews)
								</span>
							</div>
							{teacher.responseTime && (
								<div className="flex items-center gap-1.5">
									<Clock size={14} className="text-muted" />
									<span className="text-xs text-muted">
										~{teacher.responseTime}h response
									</span>
								</div>
							)}
						</div>

						{/* Qualifications & Experience */}
						{(teacher.teacher?.qualifications ||
							teacher.teacher?.experienceYears != null) && (
							<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
								{teacher.teacher?.qualifications && (
									<div className="flex items-center gap-1.5">
										<span className="text-xs text-muted font-medium">🎓</span>
										<span className="text-xs text-muted">
											{String(teacher.teacher.qualifications)}
										</span>
									</div>
								)}
								{teacher.teacher?.experienceYears != null && (
									<div className="flex items-center gap-1.5">
										<span className="text-xs text-muted font-medium">📅</span>
										<span className="text-xs text-muted">
											{teacher.teacher.experienceYears} years of experience
										</span>
									</div>
								)}
							</div>
						)}

						{/* Bio */}
						{teacher.teacher?.bio && (
							<p className="text-sm text-muted leading-relaxed">
								{teacher.teacher.bio}
							</p>
						)}

						{/* Subjects (general) */}
						{teacher.teacher?.subjects &&
							teacher.teacher.subjects.length > 0 && (
								<div>
									<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
										Subjects
									</p>
									<div className="flex flex-wrap gap-2">
										{teacher.teacher.subjects.map((s) => (
											<Badge
												key={s}
												variant="secondary"
												className="text-xs font-normal"
											>
												{s}
											</Badge>
										))}
									</div>
								</div>
							)}

						{/* Specializations */}
						{teacher.specializations?.length > 0 && (
							<div>
								<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
									Specializations
								</p>
								<div className="flex flex-wrap gap-2">
									{teacher.specializations.map((s) => (
										<Badge
											key={s.id}
											variant="outline"
											className="text-xs font-normal gap-1 border-border/60"
										>
											{s.subject}
											{s.level && (
												<span className="text-muted/70">· {s.level}</span>
											)}
											{s.yearsExp && (
												<span className="text-muted/70">· {s.yearsExp}yr</span>
											)}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Certifications */}
						{teacher.teacher?.certifications &&
							teacher.teacher.certifications.length > 0 && (
								<div>
									<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
										Certifications
									</p>
									<div className="flex flex-wrap gap-2">
										{teacher.teacher.certifications.map((cert, i) => (
											<Badge
												key={i}
												variant="outline"
												className="text-xs font-normal border-primary/30 text-primary/80 bg-primary/5"
											>
												{cert}
											</Badge>
										))}
									</div>
								</div>
							)}
					</div>
				</div>
			</div>

			{/* Intro Video */}
			{"videoUrl" in teacher && teacher.videoUrl && (
				<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
					<h2 className="font-switzer font-semibold text-sm mb-3 flex items-center gap-2">
						<Play size={14} className="text-primary" /> Introduction Video
					</h2>
					{/* biome-ignore lint/a11y/useMediaCaption: captions optional for intro video */}
					<video
						src={(teacher as any).videoUrl}
						controls
						className="w-full aspect-video rounded-xl bg-black"
					/>
				</div>
			)}

			{/* Availability + Booking */}
			<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5">
				<h2 className="font-switzer font-semibold text-sm mb-4 flex items-center gap-2">
					<Calendar size={14} className="text-primary" /> Available Slots
				</h2>
				<AvailabilityCalendar
					teacherId={teacherId}
					hourlyRate={Number(teacher.onlineHourlyRate)}
					onBook={setBookingSlot}
				/>
			</div>

			{/* Reviews */}
			{reviews.length > 0 && (
				<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-switzer font-semibold text-sm flex items-center gap-2">
							<Star size={14} className="text-amber-400 fill-amber-400" />{" "}
							Student Reviews
						</h2>
						<span className="text-xs text-muted">
							{reviews.length} review{reviews.length !== 1 ? "s" : ""}
						</span>
					</div>

					{teacher.rating > 0 && (
						<div className="flex items-center gap-3 pb-4 border-b border-border/60">
							<span className="text-4xl font-bold font-switzer">
								{teacher.rating.toFixed(1)}
							</span>
							<div>
								<RatingStars rating={teacher.rating} size={16} />
								<p className="text-xs text-muted mt-0.5">
									Based on {teacher.totalReviews} session
									{teacher.totalReviews !== 1 ? "s" : ""}
								</p>
							</div>
						</div>
					)}

					<div className="space-y-3">
						{reviews.slice(0, 5).map((r) => (
							<ReviewCard key={r.id} review={r} />
						))}
						{reviews.length > 5 && (
							<p className="text-xs text-muted text-center pt-2">
								+ {reviews.length - 5} more reviews
							</p>
						)}
					</div>
				</div>
			)}

			{/* Floating Book Button (mobile) */}
			<div className="lg:hidden sticky bottom-4 flex justify-center">
				<button
					type="button"
					className="bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-sm hover:bg-primary/90 transition-colors text-sm flex items-center gap-2"
					onClick={() => {
						document
							.getElementById("availability-section")
							?.scrollIntoView({ behavior: "smooth" });
					}}
				>
					<Calendar size={15} /> Check Availability
				</button>
			</div>

			{/* Booking Dialog */}
			<Dialog open={!!bookingSlot} onOpenChange={() => setBookingSlot(null)}>
				{bookingSlot && (
					<BookingDialog
						slot={bookingSlot}
						hourlyRate={Number(teacher.onlineHourlyRate)}
						teacherName={user?.name ?? "Tutor"}
						onClose={() => setBookingSlot(null)}
					/>
				)}
			</Dialog>
		</div>
	);
}
