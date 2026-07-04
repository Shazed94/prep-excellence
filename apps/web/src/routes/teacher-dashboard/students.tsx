/**
 * Teacher Dashboard – My Students
 * Route: /teacher-dashboard/students
 *
 * Actual students enrolled across this teacher's LMS + coaching courses.
 */

import { createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	ChevronRight,
	GraduationCap,
	Loader2,
	Mail,
	Search,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
	EmptyState,
	PageHeader,
	StatCard,
	StatusBadge,
} from "@/components/dashboard/primitives";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { type TeacherStudent, useGetMyStudents } from "@/hooks/analytics";

export const Route = createFileRoute("/teacher-dashboard/students")({
	component: TeacherStudentsPage,
});

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function StudentRow({
	student,
	onOpen,
}: {
	student: TeacherStudent;
	onOpen: () => void;
}) {
	const lmsCount = student.courses.filter((c) => c.type === "LMS").length;
	const coachingCount = student.courses.filter(
		(c) => c.type === "COACHING",
	).length;

	return (
		<button
			type="button"
			onClick={onOpen}
			className="flex w-full items-center gap-3 rounded-lg border border-border bg-white p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/5"
		>
			<div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light">
				{student.image ? (
					<img
						src={student.image}
						alt={student.name}
						className="h-full w-full object-cover"
					/>
				) : (
					<span className="text-xs font-bold text-primary">
						{initials(student.name)}
					</span>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-semibold text-foreground">
					{student.name}
				</p>
				<p className="truncate text-xs text-muted">{student.email}</p>
			</div>

			<div className="hidden flex-wrap items-center justify-end gap-1.5 sm:flex">
				{student.courses.slice(0, 3).map((c) => (
					<span
						key={c.id}
						className="max-w-[10rem] truncate rounded-md bg-muted/10 px-2 py-0.5 text-[11px] text-muted"
						title={c.title}
					>
						{c.title}
					</span>
				))}
				{student.courses.length > 3 && (
					<span className="text-[11px] text-muted">
						+{student.courses.length - 3}
					</span>
				)}
			</div>

			<div className="flex shrink-0 items-center gap-1.5">
				{lmsCount > 0 && (
					<StatusBadge tone="primary">
						<BookOpen size={9} className="mr-1" /> {lmsCount}
					</StatusBadge>
				)}
				{coachingCount > 0 && (
					<StatusBadge tone="primary">
						<GraduationCap size={9} className="mr-1" /> {coachingCount}
					</StatusBadge>
				)}
				<ChevronRight size={16} className="text-muted" />
			</div>
		</button>
	);
}

function StudentDetailDialog({
	student,
	onClose,
}: {
	student: TeacherStudent | null;
	onClose: () => void;
}) {
	return (
		<Dialog open={!!student} onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="max-w-lg">
				{student && (
					<>
						<DialogHeader>
							<DialogTitle className="font-switzer">
								Student details
							</DialogTitle>
						</DialogHeader>

						<div className="flex items-center gap-3">
							<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light">
								{student.image ? (
									<img
										src={student.image}
										alt={student.name}
										className="h-full w-full object-cover"
									/>
								) : (
									<span className="text-sm font-bold text-primary">
										{initials(student.name)}
									</span>
								)}
							</div>
							<div className="min-w-0">
								<p className="font-switzer text-base font-semibold text-foreground">
									{student.name}
								</p>
								<a
									href={`mailto:${student.email}`}
									className="mt-0.5 flex items-center gap-1 text-xs text-primary hover:underline"
								>
									<Mail size={11} /> {student.email}
								</a>
							</div>
						</div>

						<div className="mt-2">
							<p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
								Learning with you ({student.courses.length})
							</p>
							<div className="max-h-72 space-y-2 overflow-y-auto">
								{student.courses.map((c) => (
									<div
										key={c.id}
										className="flex items-center gap-3 rounded-lg border border-border p-3"
									>
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
											{c.type === "LMS" ? (
												<BookOpen size={16} className="text-primary" />
											) : (
												<GraduationCap size={16} className="text-primary" />
											)}
										</div>
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-foreground">
												{c.title}
											</p>
											<p className="text-[11px] text-muted">
												{c.type === "LMS" ? "LMS course" : "Coaching program"}
											</p>
										</div>
										<StatusBadge
											tone={c.status === "ACTIVE" ? "success" : "neutral"}
										>
											{c.status}
										</StatusBadge>
									</div>
								))}
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

function TeacherStudentsPage() {
	const { data, isLoading } = useGetMyStudents();
	const students = data?.data ?? [];
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState<TeacherStudent | null>(null);

	const totalLmsSeats = students.reduce(
		(acc, s) => acc + s.courses.filter((c) => c.type === "LMS").length,
		0,
	);
	const totalCoachingSeats = students.reduce(
		(acc, s) => acc + s.courses.filter((c) => c.type === "COACHING").length,
		0,
	);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return students;
		return students.filter(
			(s) =>
				s.name.toLowerCase().includes(q) ||
				s.email.toLowerCase().includes(q) ||
				s.courses.some((c) => c.title.toLowerCase().includes(q)),
		);
	}, [students, search]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="My Students"
				subtitle="Everyone enrolled across your LMS courses and coaching programs"
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard label="Total Students" value={students.length} icon={Users} />
				<StatCard
					label="LMS Enrollments"
					value={totalLmsSeats}
					icon={BookOpen}
				/>
				<StatCard
					label="Coaching Enrollments"
					value={totalCoachingSeats}
					icon={GraduationCap}
				/>
			</div>

			<div className="relative max-w-sm">
				<Search
					size={14}
					className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
				/>
				<Input
					placeholder="Search by student, email or course…"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-9 text-sm"
				/>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-16">
					<Loader2 size={28} className="animate-spin text-primary" />
				</div>
			) : students.length === 0 ? (
				<div className="rounded-lg border border-border bg-white">
					<EmptyState
						icon={Users}
						title="No students yet"
						description="Students appear here once they enroll in your courses or coaching programs."
					/>
				</div>
			) : filtered.length === 0 ? (
				<div className="rounded-lg border border-border bg-white">
					<EmptyState
						icon={Search}
						title={`No results for "${search}"`}
						description="Try a different name, email or course."
					/>
				</div>
			) : (
				<div className="space-y-2">
					{filtered.map((s) => (
						<StudentRow key={s.id} student={s} onOpen={() => setSelected(s)} />
					))}
				</div>
			)}

			<StudentDetailDialog
				student={selected}
				onClose={() => setSelected(null)}
			/>
		</div>
	);
}
