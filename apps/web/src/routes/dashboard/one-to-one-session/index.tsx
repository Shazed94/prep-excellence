import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Calendar,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Loader2,
	Search,
	Star,
	Users,
	Video,
	VideoOff,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type OneToOneSession,
	type SessionStatus,
	useGetSessionsByStudent,
	useGetTeachers,
} from "@/hooks/onetoone";

export const Route = createFileRoute("/dashboard/one-to-one-session/")({
	component: RouteComponent,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: SessionStatus) {
	const map: Record<SessionStatus, { label: string; className: string }> = {
		SCHEDULED: {
			label: "Scheduled",
			className: "bg-blue-50 text-blue-600 border-blue-200",
		},
		IN_PROGRESS: {
			label: "In Progress",
			className: "bg-amber-50 text-amber-600 border-amber-200",
		},
		COMPLETED: {
			label: "Completed",
			className: "bg-emerald-50 text-emerald-600 border-emerald-200",
		},
		CANCELLED: {
			label: "Cancelled",
			className: "bg-red-50 text-red-600 border-red-200",
		},
	};
	const { label, className } = map[status] ?? {
		label: status,
		className: "bg-gray-50 text-gray-500",
	};
	return (
		<span
			className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${className}`}
		>
			{label}
		</span>
	);
}

function formatDate(dateStr?: string) {
	if (!dateStr) return "—";
	return new Date(dateStr).toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
	label,
	value,
	icon: Icon,
	color,
}: {
	label: string;
	value: string | number;
	icon: React.ElementType;
	color: string;
}) {
	return (
		<div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
			<div
				className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
			>
				<Icon className="w-5 h-5" />
			</div>
			<p className="text-[28px] font-bold text-[#141B34] leading-none mb-1">
				{value}
			</p>
			<p className="text-sm text-muted-foreground">{label}</p>
		</div>
	);
}

// ─── Session Row ──────────────────────────────────────────────────────────────

function SessionRow({ session }: { session: OneToOneSession }) {
	const teacher =
		session.teacherAvailability?.profile?.teacher?.user?.name ?? "—";
	const teacherImage =
		session.teacherAvailability?.profile?.teacher?.user?.image;
	const hourlyRate = session.teacherAvailability?.profile?.hourlyRate;

	const initials = teacher
		.split(" ")
		.map((w: string) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<tr className="border-b border-[#F1F5F9] hover:bg-[#FAFAFA] transition-colors">
			{/* Teacher */}
			<td className="py-3 px-4">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 overflow-hidden">
						{teacherImage ? (
							<img
								src={teacherImage}
								alt={teacher}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-xs font-bold text-primary">{initials}</span>
						)}
					</div>
					<div>
						<p className="text-sm font-medium text-[#141B34]">{teacher}</p>
						{hourlyRate && (
							<p className="text-xs text-muted-foreground">
								${Number(hourlyRate).toFixed(0)}/hr
							</p>
						)}
					</div>
				</div>
			</td>

			{/* Topic */}
			<td className="py-3 px-4">
				<p className="text-sm text-[#141B34] truncate max-w-[180px]">
					{session.topic ?? (
						<span className="text-muted-foreground italic">No topic</span>
					)}
				</p>
			</td>

			{/* Scheduled */}
			<td className="py-3 px-4 whitespace-nowrap">
				<p className="text-sm text-[#141B34]">
					{formatDate(session.scheduledAt)}
				</p>
				<p className="text-xs text-muted-foreground">{session.duration} min</p>
			</td>

			{/* Status */}
			<td className="py-3 px-4">{statusBadge(session.status)}</td>

			{/* Review */}
			<td className="py-3 px-4">
				{session.review ? (
					<div className="flex items-center gap-1">
						<Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
						<span className="text-sm font-medium">{session.review.rating}</span>
					</div>
				) : (
					<span className="text-xs text-muted-foreground">—</span>
				)}
			</td>
		</tr>
	);
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
	page,
	totalPages,
	onPage,
}: {
	page: number;
	totalPages: number;
	onPage: (p: number) => void;
}) {
	if (totalPages <= 1) return null;
	return (
		<div className="flex items-center justify-end gap-2 pt-3">
			<button
				type="button"
				onClick={() => onPage(page - 1)}
				disabled={page <= 1}
				className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EBEBEB] disabled:opacity-40 hover:border-primary transition-colors"
			>
				<ChevronLeft className="w-4 h-4" />
			</button>
			<span className="text-sm text-muted-foreground">
				{page} / {totalPages}
			</span>
			<button
				type="button"
				onClick={() => onPage(page + 1)}
				disabled={page >= totalPages}
				className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EBEBEB] disabled:opacity-40 hover:border-primary transition-colors"
			>
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
}

// ─── Session Table ────────────────────────────────────────────────────────────

function SessionTable({
	sessions,
	isLoading,
	statusFilter,
}: {
	sessions: OneToOneSession[];
	isLoading: boolean;
	statusFilter?: SessionStatus;
}) {
	const filtered = statusFilter
		? sessions.filter((s) => s.status === statusFilter)
		: sessions;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="w-6 h-6 animate-spin text-primary" />
			</div>
		);
	}

	if (filtered.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
				<Video className="w-10 h-10 opacity-20" />
				<p className="text-sm">No sessions found</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left">
				<thead>
					<tr className="border-b border-[#EBEBEB]">
						{["Teacher", "Topic", "Scheduled", "Status", "Rating"].map((h) => (
							<th
								key={h}
								className="py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{filtered.map((s) => (
						<SessionRow key={s.id} session={s} />
					))}
				</tbody>
			</table>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

function RouteComponent() {
	const [studentIdInput, setStudentIdInput] = useState("");
	const [activeStudentId, setActiveStudentId] = useState<string | undefined>();
	const [page, setPage] = useState(1);

	// Teacher count for stats
	const { data: teachersData, isLoading: teachersLoading } = useGetTeachers({
		limit: 50,
	});
	const totalTutors = teachersData?.data?.length ?? 0;

	// Sessions search (requires studentId)
	const {
		data: sessionsData,
		isLoading: sessionsLoading,
		isFetching,
	} = useGetSessionsByStudent(activeStudentId, page, PAGE_SIZE);

	const sessions: OneToOneSession[] = sessionsData?.data ?? [];
	const pagination = sessionsData?.pagination;

	// Derived stats from loaded sessions
	const scheduled = sessions.filter((s) => s.status === "SCHEDULED");
	const inProgress = sessions.filter((s) => s.status === "IN_PROGRESS");
	const completed = sessions.filter((s) => s.status === "COMPLETED");
	const cancelled = sessions.filter((s) => s.status === "CANCELLED");
	const totalMinutes = completed.reduce((acc, s) => acc + (s.duration ?? 0), 0);
	const totalHours = Math.round(totalMinutes / 60);

	function handleSearch() {
		const trimmed = studentIdInput.trim();
		if (!trimmed) return;
		setActiveStudentId(trimmed);
		setPage(1);
	}

	function handleClear() {
		setStudentIdInput("");
		setActiveStudentId(undefined);
		setPage(1);
	}

	return (
		<div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
			{/* ── Header ── */}
			<div>
				<h1 className="text-2xl font-bold text-[#141B34]">1-on-1 Sessions</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Search sessions by student ID and review tutoring activity.
				</p>
			</div>

			{/* ── KPI Cards ── */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
				<StatCard
					label="Active Tutors"
					value={teachersLoading ? "—" : totalTutors}
					icon={Users}
					color="bg-blue-50 text-blue-600"
				/>
				<StatCard
					label="Scheduled"
					value={activeStudentId ? scheduled.length : "—"}
					icon={Calendar}
					color="bg-violet-50 text-violet-600"
				/>
				<StatCard
					label="Completed"
					value={activeStudentId ? completed.length : "—"}
					icon={CheckCircle2}
					color="bg-emerald-50 text-emerald-600"
				/>
				<StatCard
					label="Total Hours"
					value={activeStudentId ? totalHours : "—"}
					icon={Clock}
					color="bg-amber-50 text-amber-600"
				/>
			</div>

			{/* ── Search by student ── */}
			<div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
				<p className="text-sm font-semibold text-[#141B34] mb-3">
					Look up sessions by student ID
				</p>
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
						<Input
							placeholder="Enter student ID (cuid)…"
							value={studentIdInput}
							onChange={(e) => setStudentIdInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							className="pl-9 font-mono text-sm"
						/>
					</div>
					<Button onClick={handleSearch} disabled={!studentIdInput.trim()}>
						Search
					</Button>
					{activeStudentId && (
						<Button variant="outline" onClick={handleClear}>
							Clear
						</Button>
					)}
				</div>

				{activeStudentId && (
					<p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
						{isFetching && <Loader2 className="w-3 h-3 animate-spin" />}
						Showing sessions for:{" "}
						<code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
							{activeStudentId}
						</code>
						{pagination && (
							<span>
								· {pagination.total} total session
								{pagination.total !== 1 ? "s" : ""}
							</span>
						)}
					</p>
				)}
			</div>

			{/* ── Tabs ── */}
			<div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
				<Tabs defaultValue="all">
					<div className="flex items-center justify-between mb-5 flex-wrap gap-3">
						<TabsList className="bg-[#F8F8F9] border border-[#EBEBEB] p-1 rounded-xl h-auto gap-1">
							{(
								[
									{ value: "all", label: "All", count: sessions.length },
									{
										value: "scheduled",
										label: "Scheduled",
										count: scheduled.length,
									},
									{
										value: "in-progress",
										label: "In Progress",
										count: inProgress.length,
									},
									{
										value: "completed",
										label: "Completed",
										count: completed.length,
									},
									{
										value: "cancelled",
										label: "Cancelled",
										count: cancelled.length,
									},
								] as const
							).map((tab) => (
								<TabsTrigger
									key={tab.value}
									value={tab.value}
									className="text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-3 py-1.5 h-auto"
								>
									{tab.label}
									{activeStudentId && tab.count > 0 && (
										<span className="ml-1.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center">
											{tab.count}
										</span>
									)}
								</TabsTrigger>
							))}
						</TabsList>

						<Link to="/dashboard/user-management/students">
							<Button variant="outline" size="sm" className="text-xs gap-1.5">
								<Users className="w-3.5 h-3.5" />
								Browse Students
							</Button>
						</Link>
					</div>

					{/* Empty state when no search yet */}
					{!activeStudentId && (
						<div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
							<VideoOff className="w-12 h-12 opacity-15" />
							<p className="text-sm font-medium">Search to view sessions</p>
							<p className="text-xs text-center max-w-xs">
								Enter a student ID above to load their 1-on-1 session history.
								You can find student IDs in the{" "}
								<Link
									to="/dashboard/user-management/students"
									className="text-primary underline"
								>
									student management
								</Link>{" "}
								page.
							</p>
						</div>
					)}

					{activeStudentId && (
						<>
							<TabsContent value="all" className="m-0">
								<SessionTable sessions={sessions} isLoading={sessionsLoading} />
								<Pagination
									page={page}
									totalPages={pagination?.totalPages ?? 1}
									onPage={setPage}
								/>
							</TabsContent>

							<TabsContent value="scheduled" className="m-0">
								<SessionTable
									sessions={sessions}
									isLoading={sessionsLoading}
									statusFilter="SCHEDULED"
								/>
							</TabsContent>

							<TabsContent value="in-progress" className="m-0">
								<SessionTable
									sessions={sessions}
									isLoading={sessionsLoading}
									statusFilter="IN_PROGRESS"
								/>
							</TabsContent>

							<TabsContent value="completed" className="m-0">
								<SessionTable
									sessions={sessions}
									isLoading={sessionsLoading}
									statusFilter="COMPLETED"
								/>
							</TabsContent>

							<TabsContent value="cancelled" className="m-0">
								<SessionTable
									sessions={sessions}
									isLoading={sessionsLoading}
									statusFilter="CANCELLED"
								/>
							</TabsContent>
						</>
					)}
				</Tabs>
			</div>

			{/* ── Active tutors strip ── */}
			<div className="bg-white rounded-2xl border border-[#EBEBEB] p-5">
				<div className="flex items-center justify-between mb-4">
					<h2 className="font-semibold text-sm text-[#141B34]">
						Available Tutors
					</h2>
					<Link to="/tutoring" className="text-xs text-primary hover:underline">
						View public listing →
					</Link>
				</div>
				{teachersLoading ? (
					<div className="flex gap-3">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 animate-pulse"
							>
								<div className="w-7 h-7 rounded-full bg-gray-200" />
								<div className="w-20 h-3 bg-gray-200 rounded" />
							</div>
						))}
					</div>
				) : !teachersData?.data?.length ? (
					<p className="text-sm text-muted-foreground">
						No tutors registered yet.
					</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{(teachersData.data ?? []).slice(0, 12).map((t) => {
							const name = t.teacher?.user?.name ?? "Tutor";
							const image = t.teacher?.user?.image;
							const initials = name
								.split(" ")
								.map((w: string) => w[0])
								.join("")
								.slice(0, 2)
								.toUpperCase();
							return (
								<div
									key={t.id}
									className="flex items-center gap-2 bg-[#F8F8F9] border border-[#EBEBEB] rounded-xl px-3 py-2"
								>
									<div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center overflow-hidden flex-shrink-0">
										{image ? (
											<img
												src={image}
												alt={name}
												className="w-full h-full object-cover"
											/>
										) : (
											<span className="text-[9px] font-bold text-primary">
												{initials}
											</span>
										)}
									</div>
									<span className="text-xs font-medium text-[#141B34]">
										{name}
									</span>
									{t.isAvailable && (
										<span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
									)}
								</div>
							);
						})}
						{(teachersData?.data?.length ?? 0) > 12 && (
							<div className="flex items-center px-3 py-2 text-xs text-muted-foreground">
								+{(teachersData?.data?.length ?? 0) - 12} more
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
