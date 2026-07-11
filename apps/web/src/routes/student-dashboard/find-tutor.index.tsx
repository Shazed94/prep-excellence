/**
 * Phase 4 – Find a Tutor
 * Route: /student-dashboard/find-tutor
 *
 * Browse and search for one-to-one tutors.
 * Filter by subject, price range.
 * Click → teacher profile page with booking flow.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Clock,
	Loader2,
	Search,
	SlidersHorizontal,
	Star,
	UserCheck,
	Users,
	Video,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type TeacherProfile, useGetTeachers } from "@/hooks/onetoone";

export const Route = createFileRoute("/student-dashboard/find-tutor/")({
	component: FindTutorPage,
});

// ─── Star display ─────────────────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map((n) => (
				<Star
					key={n}
					size={12}
					className={
						n <= Math.round(rating)
							? "text-amber-400 fill-amber-400"
							: "text-muted/30"
					}
				/>
			))}
			<span className="text-[11px] text-muted ml-1">{rating.toFixed(1)}</span>
		</div>
	);
}

// ─── Available-now check ──────────────────────────────────────────────────────

function hasUpcomingSlots(teacher: TeacherProfile): boolean {
	if (!teacher.availabilities?.length) return false;
	const now = new Date();
	return teacher.availabilities.some((slot) => {
		if (!slot.isActive || slot.isBooked) return false;
		// Check if the slot has a future specific date/time
		if (slot.specificDate) {
			const slotDateTime = slot.specificStartTime
				? new Date(slot.specificStartTime)
				: new Date(slot.specificDate);
			return slotDateTime > now;
		}
		// Weekly recurring slots are considered available if active & not booked
		if (slot.dayOfWeek) return true;
		return false;
	});
}

// ─── Teacher Card ─────────────────────────────────────────────────────────────

function TeacherCard({ teacher }: { teacher: TeacherProfile }) {
	const user = teacher.teacher?.user;
	const initials = (user?.name ?? "T")
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	const subjects = teacher.specializations?.slice(0, 3) ?? [];

	return (
		<div className="bg-white rounded-lg border border-border/60 shadow-sm p-5 transition-shadow flex flex-col gap-4">
			{/* Header: avatar + name + available badge */}
			<div className="flex items-start gap-3">
				<div className="relative shrink-0">
					{user?.image ? (
						<img
							src={user.image}
							alt={user.name}
							className="w-14 h-14 rounded-lg object-cover"
						/>
					) : (
						<div className="w-14 h-14 rounded-lg bg-primary-light flex items-center justify-center">
							<span className="text-primary font-bold text-lg">{initials}</span>
						</div>
					)}
					{teacher.isAvailable && (
						<span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
					)}
				</div>

				<div className="flex-1 min-w-0">
					<p className="font-switzer font-bold text-sm truncate">
						{user?.name}
					</p>
					{teacher.rating > 0 && <RatingStars rating={teacher.rating} />}
					<div className="flex items-center gap-2 mt-1">
						<span className="text-[11px] text-muted flex items-center gap-1">
							<Video size={10} /> {teacher.totalSessions} sessions
						</span>
						<span className="text-[11px] text-muted flex items-center gap-1">
							<Star size={10} className="text-amber-400" />{" "}
							{teacher.totalReviews} reviews
						</span>
						{teacher.responseTime && (
							<span className="text-[11px] text-muted flex items-center gap-1">
								<Clock size={10} /> ~{teacher.responseTime}h response
							</span>
						)}
					</div>
				</div>

				<div className="text-right shrink-0">
					<p className="font-bold text-base text-foreground">
						${Number(teacher.onlineHourlyRate).toLocaleString()}
					</p>
					<p className="text-[10px] text-muted">/hour online</p>
					{teacher.offlineHourlyRate && (
						<>
							<p className="font-semibold text-sm text-foreground mt-1">
								${Number(teacher.offlineHourlyRate).toLocaleString()}
							</p>
							<p className="text-[10px] text-muted">/hour offline</p>
						</>
					)}
				</div>
			</div>

			{/* Bio */}
			{teacher?.teacher?.bio && (
				<p className="text-xs text-muted line-clamp-2 leading-relaxed">
					{teacher?.teacher?.bio}
				</p>
			)}

			{/* Qualifications & Experience */}
			{(teacher.teacher?.qualifications ||
				teacher.teacher?.experienceYears != null) && (
				<div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
					{teacher.teacher?.qualifications && (
						<span className="flex items-center gap-1">
							<span className="font-medium text-foreground/70">🎓</span>{" "}
							{String(teacher.teacher.qualifications)}
						</span>
					)}
					{teacher.teacher?.experienceYears != null && (
						<span className="flex items-center gap-1">
							<span className="font-medium text-foreground/70">📅</span>{" "}
							{teacher.teacher.experienceYears} years exp.
						</span>
					)}
				</div>
			)}

			{/* Subjects */}
			{(subjects.length > 0 || teacher.teacher?.subjects?.length) && (
				<div className="flex flex-wrap gap-1.5">
					{teacher.teacher?.subjects?.map((s) => (
						<Badge
							key={s}
							variant="secondary"
							className="text-[10px] font-normal"
						>
							{s}
						</Badge>
					))}
					{teacher.teacher?.subjects &&
						subjects
							.filter(
								(spec) => !teacher.teacher?.subjects?.includes(spec.subject),
							)
							.slice(0, 2)
							.map((s) => (
								<Badge
									key={s.id}
									variant="outline"
									className="text-[10px] font-normal border-border/60"
								>
									{s.subject}
								</Badge>
							))}
					{teacher.specializations.length > 0 && !teacher.teacher?.subjects && (
						<>
							{subjects.map((s) => (
								<Badge
									key={s.id}
									variant="outline"
									className="text-[10px] font-normal border-border/60"
								>
									{s.subject}
								</Badge>
							))}
							{teacher.specializations.length > 3 && (
								<Badge
									variant="outline"
									className="text-[10px] text-muted border-border/60"
								>
									+{teacher.specializations.length - 3} more
								</Badge>
							)}
						</>
					)}
				</div>
			)}

			{/* Certifications */}
			{teacher.teacher?.certifications &&
				teacher.teacher.certifications.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{teacher.teacher.certifications.slice(0, 3).map((cert, i) => (
							<Badge
								key={i}
								variant="outline"
								className="text-[10px] font-normal border-primary/30 text-primary/80 bg-primary/5"
							>
								{cert}
							</Badge>
						))}
						{teacher.teacher.certifications.length > 3 && (
							<Badge
								variant="outline"
								className="text-[10px] text-muted border-border/60"
							>
								+{teacher.teacher.certifications.length - 3} more
							</Badge>
						)}
					</div>
				)}

			{/* Availability */}
			<div className="flex items-center justify-between pt-1">
				<div className="flex items-center gap-1.5">
					<div
						className={`w-2 h-2 rounded-full ${hasUpcomingSlots(teacher) ? "bg-emerald-500" : "bg-muted/40"}`}
					/>
					<span
						className={`text-xs font-medium ${hasUpcomingSlots(teacher) ? "text-emerald-600" : "text-muted"}`}
					>
						{hasUpcomingSlots(teacher) ? "Available now" : "Not available"}
					</span>
				</div>

				<Link
					to="/student-dashboard/find-tutor/$teacherId"
					params={{ teacherId: teacher.teacherId }}
				>
					<Button
						size="sm"
						className={`text-xs gap-1 ${hasUpcomingSlots(teacher) ? "bg-primary hover:bg-primary/90" : ""}`}
						variant={hasUpcomingSlots(teacher) ? "default" : "outline"}
					>
						<UserCheck size={12} /> View Profile
					</Button>
				</Link>
			</div>
		</div>
	);
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const SUBJECTS = [
	"All Subjects",
	"Mathematics",
	"English",
	"Science",
	"SAT Prep",
	"Physics",
	"Chemistry",
	"Biology",
	"Computer Science",
	"Economics",
];

function FindTutorPage() {
	const [search, setSearch] = useState("");
	const [subject, setSubject] = useState("");
	const [maxRate, setMaxRate] = useState<number | undefined>();
	const [showFilters, setShowFilters] = useState(false);

	const filters = {
		subject: subject || undefined,
		maxRate,
		limit: 20,
	};

	const { data, isLoading } = useGetTeachers(filters);
	const teachers: TeacherProfile[] = data?.data ?? [];

	const filtered = teachers.filter((t) => {
		if (!search) return true;
		const name = t.teacher?.user?.name?.toLowerCase() ?? "";
		const bio = t.teacher?.bio?.toLowerCase() ?? "";
		const q = search.toLowerCase();
		return name.includes(q) || bio.includes(q);
	});

	const available = filtered.filter((t) => hasUpcomingSlots(t));
	const unavailable = filtered.filter((t) => !hasUpcomingSlots(t));

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-xl font-switzer font-bold text-foreground">
					Find a Tutor
				</h1>
				<p className="text-muted text-sm mt-0.5">
					Book 1-on-1 sessions with expert tutors
				</p>
			</div>

			{/* Hero Banner */}
			<div className="bg-primary rounded-lg p-5 text-white">
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<h3 className="font-switzer font-bold text-base">
							Personalized Learning, Just for You
						</h3>
						<p className="text-xs text-white/70 mt-1 leading-relaxed">
							Choose from expert tutors, pick a time that works for you, and
							join a Jitsi-powered session — no downloads needed. Sessions are
							recorded for 7 days.
						</p>
					</div>
					<div className="hidden sm:flex flex-col items-center gap-1 shrink-0 text-center">
						<Users size={28} className="text-white/60" />
						<span className="text-2xl font-bold">{teachers.length}</span>
						<span className="text-[10px] text-white/60">tutors</span>
					</div>
				</div>
			</div>

			{/* Search + Filter */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
					/>
					<Input
						placeholder="Search by name or subject…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9 text-sm"
					/>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="gap-2 text-xs shrink-0"
					onClick={() => setShowFilters((p) => !p)}
				>
					<SlidersHorizontal size={13} />
					Filters
					{(subject || maxRate) && (
						<span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">
							{(subject ? 1 : 0) + (maxRate ? 1 : 0)}
						</span>
					)}
				</Button>
			</div>

			{/* Filter Panel */}
			{showFilters && (
				<div className="bg-white rounded-lg border border-border/60 shadow-sm p-4 space-y-4">
					<div>
						<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
							Subject
						</p>
						<div className="flex flex-wrap gap-2">
							{SUBJECTS.map((s) => (
								<button
									key={s}
									type="button"
									onClick={() => setSubject(s === "All Subjects" ? "" : s)}
									className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
										subject === s || (s === "All Subjects" && !subject)
											? "bg-primary text-white border-primary"
											: "border-border/60 text-muted hover:border-primary/40"
									}`}
								>
									{s}
								</button>
							))}
						</div>
					</div>

					<div>
						<p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
							Max Hourly Rate ($)
						</p>
						<div className="flex gap-2">
							{[500, 1000, 2000, 5000].map((rate) => (
								<button
									key={rate}
									type="button"
									onClick={() =>
										setMaxRate(maxRate === rate ? undefined : rate)
									}
									className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
										maxRate === rate
											? "bg-primary text-white border-primary"
											: "border-border/60 text-muted hover:border-primary/40"
									}`}
								>
									Under ${rate.toLocaleString()}
								</button>
							))}
						</div>
					</div>

					{(subject || maxRate) && (
						<button
							type="button"
							className="text-xs text-muted hover:text-primary"
							onClick={() => {
								setSubject("");
								setMaxRate(undefined);
							}}
						>
							Clear filters
						</button>
					)}
				</div>
			)}

			{/* Results */}
			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center py-20 gap-3 text-muted">
					<Search size={48} className="opacity-20" />
					<p className="text-sm">No tutors found matching your criteria</p>
					<button
						type="button"
						className="text-xs text-primary underline"
						onClick={() => {
							setSearch("");
							setSubject("");
							setMaxRate(undefined);
						}}
					>
						Clear search
					</button>
				</div>
			) : (
				<div className="space-y-6">
					{/* Available now */}
					{available.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-3">
								<h2 className="font-switzer font-semibold text-sm">
									Available Now
								</h2>
								<div className="w-2 h-2 rounded-full bg-emerald-500" />
								<span className="text-xs text-muted">{available.length}</span>
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{available.map((t) => (
									<TeacherCard key={t.id} teacher={t} />
								))}
							</div>
						</div>
					)}

					{/* Other tutors */}
					{unavailable.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-3">
								<h2 className="font-switzer font-semibold text-sm text-muted">
									Other Tutors
								</h2>
								<span className="text-xs text-muted">{unavailable.length}</span>
							</div>
							<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{unavailable.map((t) => (
									<TeacherCard key={t.id} teacher={t} />
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
