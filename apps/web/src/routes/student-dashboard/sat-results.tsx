import { createFileRoute } from "@tanstack/react-router";
import {
	Award,
	ChevronDown,
	ChevronUp,
	Loader2,
	TrendingUp,
	XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
	AttemptStatus,
	ResultDetail,
} from "@/components/student-dash/result-detail";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetMyAttempts } from "@/hooks/sat-attempt";
import { useGetStudentProfile } from "@/hooks/user-management";

export const Route = createFileRoute("/student-dashboard/sat-results")({
	component: SATResultsPage,
});

function statusBadge(status: string) {
	const map: Record<string, string> = {
		COMPLETED: "bg-emerald-100 text-emerald-700",
		IN_PROGRESS: "bg-amber-100 text-amber-700",
		ABANDONED: "bg-red-100 text-red-600",
	};
	return map[status] ?? "bg-muted/20 text-muted";
}

function ScoreRing({ score, max = 1600 }: { score: number; max?: number }) {
	const pct = Math.round((score / max) * 100);
	const r = 36;
	const circ = 2 * Math.PI * r;
	const dash = (pct / 100) * circ;

	return (
		<div className="relative w-24 h-24 mx-auto">
			<svg viewBox="0 0 88 88" className="w-full h-full -rotate-90" role="img">
				<title>SAT Score: {score}</title>
				<circle
					cx="44"
					cy="44"
					r={r}
					stroke="currentColor"
					strokeWidth="7"
					fill="none"
					className="text-muted/20"
				/>
				<circle
					cx="44"
					cy="44"
					r={r}
					stroke="currentColor"
					strokeWidth="7"
					fill="none"
					strokeDasharray={`${dash} ${circ - dash}`}
					strokeLinecap="round"
					className="text-primary transition-all duration-700"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-xl font-bold text-foreground">{score}</span>
				<span className="text-[10px] text-muted">/{max}</span>
			</div>
		</div>
	);
}

function AttemptRow({ attempt }: { attempt: any }) {
	const [open, setOpen] = useState(false);

	const rawStatus = attempt.status as string;
	const status =
		rawStatus === "ABANDONED"
			? AttemptStatus.NOT_STARTED
			: (rawStatus as AttemptStatus);
	const date = new Date(attempt.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className="w-full text-left p-4 hover:bg-muted/5 transition-colors"
			>
				<div className="flex items-center gap-4">
					{/* Score ring — compact */}
					<div className="relative w-12 h-12 shrink-0">
						<svg
							viewBox="0 0 48 48"
							className="w-full h-full -rotate-90"
							role="img"
						>
							<title>Score: {attempt.totalScore ?? "—"}</title>
							<circle
								cx="24"
								cy="24"
								r="18"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								className="text-muted/20"
							/>
							<circle
								cx="24"
								cy="24"
								r="18"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								strokeDasharray={`${((attempt.totalScore ?? 0) / 1600) * 113} 113`}
								strokeLinecap="round"
								className="text-primary"
							/>
						</svg>
						<span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">
							{attempt.totalScore ?? "—"}
						</span>
					</div>

					<div className="flex-1 min-w-0">
						<p className="font-semibold text-sm truncate">
							{attempt.satPractice?.name ?? "SAT Practice"}
						</p>
						<p className="text-xs text-muted mt-0.5">{date}</p>
					</div>

					<div className="flex items-center gap-3 shrink-0">
						{attempt.percentageScore != null && (
							<div className="text-right hidden sm:block">
								<p className="text-xs font-semibold text-foreground">
									{attempt.percentageScore}%
								</p>
								<p className="text-[10px] text-muted">score</p>
							</div>
						)}
						<Badge className={`text-[10px] border-0 ${statusBadge(rawStatus)}`}>
							{rawStatus}
						</Badge>
						{open ? (
							<ChevronUp size={15} className="text-muted" />
						) : (
							<ChevronDown size={15} className="text-muted" />
						)}
					</div>
				</div>
			</button>

			<AnimatePresence initial={false}>
				{open && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<Separator />
						<div className="p-4">
							<ResultDetail
								attemptId={attempt.id}
								meta={{
									testName: attempt.satPractice?.name ?? "SAT Practice",
									date: attempt.createdAt,
									status: status,
								}}
								onBack={() => setOpen(false)}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function SATResultsPage() {
	const { data: profileData } = useGetStudentProfile();
	const student = profileData?.data;
	const { data, isLoading, isError } = useGetMyAttempts(student?.id);
	const attempts: any[] = data?.data ?? [];
	const completed = attempts.filter((a) => a.status === "COMPLETED");
	const bestScore = completed.length
		? Math.max(...completed.map((a) => a.totalScore ?? 0))
		: null;
	const avgScore = completed.length
		? Math.round(
				completed.reduce((sum, a) => sum + (a.totalScore ?? 0), 0) /
					completed.length,
			)
		: null;

	return (
		<div className="space-y-6 max-w-4xl">
			<div>
				<h1 className="text-xl font-switzer font-bold text-foreground">
					SAT Results
				</h1>
				<p className="text-muted text-sm mt-0.5">
					Track your SAT practice performance over time
				</p>
			</div>

			{/* Summary cards */}
			{completed.length > 0 && (
				<div className="grid grid-cols-3 gap-4">
					<div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4 text-center">
						<ScoreRing score={bestScore ?? 0} />
						<p className="text-xs text-muted mt-2">Best Score</p>
					</div>
					<div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4 text-center">
						<ScoreRing score={avgScore ?? 0} />
						<p className="text-xs text-muted mt-2">Avg Score</p>
					</div>
					<div className="bg-linear-to-br from-[#f7b03f] to-[#ef782e] rounded-2xl p-4 text-center flex flex-col items-center justify-center">
						<Award size={28} className="text-white mb-1" />
						<p className="text-2xl font-bold text-white">{completed.length}</p>
						<p className="text-xs text-white/80">Completed</p>
					</div>
				</div>
			)}

			{/* Attempts list */}
			<div className="space-y-3">
				<h2 className="font-switzer font-semibold text-sm text-foreground">
					All Attempts
				</h2>
				{isLoading ? (
					<div className="flex justify-center py-12">
						<Loader2 size={24} className="animate-spin text-primary" />
					</div>
				) : isError ? (
					<div className="flex flex-col items-center py-12 text-muted gap-2">
						<XCircle size={32} className="opacity-30" />
						<p className="text-sm">Failed to load results</p>
					</div>
				) : attempts.length === 0 ? (
					<div className="flex flex-col items-center py-12 text-muted gap-2">
						<TrendingUp size={40} className="opacity-20" />
						<p className="text-sm">No attempts yet</p>
					</div>
				) : (
					attempts.map((attempt) => (
						<AttemptRow key={attempt.id} attempt={attempt} />
					))
				)}
			</div>
		</div>
	);
}
