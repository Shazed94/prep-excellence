import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CheckCircle,
	ChevronDown,
	Clock,
	Loader2,
	RotateCcw,
	Search,
	SlidersHorizontal,
	Star,
	Users,
	Video,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/SectionSubtitle";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type TeacherProfile, useGetTeachers } from "@/hooks/onetoone";

export const Route = createFileRoute("/_frontend/tutoring/")({
	component: RouteComponent,
});

const PAGE_SIZE = 6;

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
	label,
	options,
	onSelect,
}: {
	label: string;
	options: string[];
	onSelect?: (val: string) => void;
}) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(label);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50/40 transition-all"
			>
				{selected}
				<ChevronDown className="w-3.5 h-3.5 text-gray-400" />
			</button>
			{open && (
				<div className="absolute top-full mt-2 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 min-w-[160px]">
					{options.map((opt) => (
						<button
							type="button"
							key={opt}
							onClick={() => {
								setSelected(opt);
								setOpen(false);
								onSelect?.(opt);
							}}
							className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
						>
							{opt}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Tutor Card ───────────────────────────────────────────────────────────────

export function TutorProfileCard({ tutor }: { tutor: TeacherProfile }) {
	const user = tutor.teacher?.user;
	const name = user?.name ?? "Tutor";
	const image = user?.image;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="w-full bg-white rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
		>
			<div className="flex flex-col md:flex-row items-stretch gap-4 h-full">
				{/* Left: Profile Image */}
				<div className="w-full md:w-[220px] h-[192px] flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl">
					{image ? (
						<img
							src={image}
							alt={name}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full bg-primary-light flex items-center justify-center">
							<span className="text-primary font-bold text-5xl">
								{name.charAt(0)}
							</span>
						</div>
					)}
				</div>

				{/* Middle: Bio & Info */}
				<div className="flex-1 py-2 flex flex-col justify-center bg-white min-w-0">
					<h6 className="h6 mb-1">{name}</h6>

					{tutor.bio && (
						<p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
							{tutor.bio}
						</p>
					)}

					{/* Rating */}
					<div className="flex items-center gap-2 mb-2">
						<div className="flex items-center gap-1">
							<Star className="w-4 h-4 text-amber-400 fill-amber-400" />
							<span className="text-sm font-semibold text-slate-900">
								{tutor.rating.toFixed(1)}
							</span>
						</div>
						<span className="text-sm text-slate-500">
							({tutor.totalReviews} reviews)
						</span>
					</div>

					{/* Specializations */}
					{tutor.specializations?.length > 0 && (
						<div className="flex flex-wrap gap-1.5 mb-3">
							{tutor.specializations.slice(0, 3).map((s) => (
								<span
									key={s.id}
									className="text-[11px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium"
								>
									{s.subject}
								</span>
							))}
							{tutor.specializations.length > 3 && (
								<span className="text-[11px] text-muted-foreground px-1">
									+{tutor.specializations.length - 3} more
								</span>
							)}
						</div>
					)}

					{/* Availability */}
					<div className="flex items-center gap-2 text-sm font-medium">
						<CheckCircle
							className={`w-4 h-4 ${tutor.isAvailable ? "text-emerald-500" : "text-gray-300"}`}
						/>
						<span
							className={
								tutor.isAvailable ? "text-emerald-600" : "text-gray-400"
							}
						>
							{tutor.isAvailable ? "Available Now" : "Not Available"}
						</span>
					</div>
				</div>

				{/* Middle-Right: Stats */}
				<div className="flex-1 flex-shrink-0 px-6 py-2 flex flex-col justify-center gap-3 rounded-[6px] bg-[#F8F8F9]">
					<h4 className="p text-center mb-0! font-semibold">Details</h4>
					{[
						{
							icon: Users,
							label: `${tutor.totalSessions} sessions done`,
						},
						{
							icon: Clock,
							label: tutor.responseTime
								? `~${tutor.responseTime}h response`
								: "Fast response",
						},
						{
							icon: Video,
							label: tutor.timezone || "Flexible timezone",
						},
					].map(({ icon: Icon, label }) => (
						<div key={label} className="flex items-center gap-2 text-sm">
							<div className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0">
								<Icon className="w-4 h-4 text-primary" />
							</div>
							<span className="f14 text-slate-600">{label}</span>
						</div>
					))}
					<div className="mt-1 pt-2 border-t border-gray-200">
						<span className="text-base font-bold text-primary">
							${Number(tutor.hourlyRate).toLocaleString()}
						</span>
						<span className="text-sm text-slate-500">/hr</span>
					</div>
				</div>

				{/* Right: Actions */}
				<div className="flex-1 flex-shrink-0 px-6 py-2 flex flex-col items-center justify-center gap-4 rounded-[6px] bg-[#EBF3FF]">
					<div className="w-full text-center bg-white p-4 rounded-[6px]">
						<Link
							to="/tutoring/$teacherId"
							params={{ teacherId: tutor.teacherId }}
							className="block text-sm font-semibold text-[#1552FD] hover:text-blue-700 hover:underline transition-colors mb-2"
						>
							View Profile →
						</Link>
						<Link
							to="/tutoring/$teacherId"
							params={{ teacherId: tutor.teacherId }}
							className="block text-sm font-semibold text-[#1552FD] hover:text-blue-700 hover:underline transition-colors"
						>
							View Availability →
						</Link>
					</div>
					<Link
						to="/tutoring/$teacherId"
						params={{ teacherId: tutor.teacherId }}
						className="w-full"
					>
						<Button
							type="button"
							variant="gradient"
							className="w-full mt-2 h-[42px]"
						>
							Book Session
						</Button>
					</Link>
				</div>
			</div>
		</motion.div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [availabilityFilter, setAvailabilityFilter] = useState("All");
	const [sortOrder, setSortOrder] = useState("Featured");

	const { data, isLoading, isError } = useGetTeachers({ limit: 50 });
	const teachers: TeacherProfile[] = data?.data ?? [];

	// Filter
	const filtered = teachers.filter((t) => {
		const name = t.teacher?.user?.name?.toLowerCase() ?? "";
		const bio = t.bio?.toLowerCase() ?? "";
		const q = search.toLowerCase();
		const matchSearch = !q || name.includes(q) || bio.includes(q);

		const matchAvail =
			availabilityFilter === "All" ||
			(availabilityFilter === "Available" && t.isAvailable) ||
			(availabilityFilter === "Unavailable" && !t.isAvailable);

		return matchSearch && matchAvail;
	});

	// Sort
	const sorted = [...filtered].sort((a, b) => {
		if (sortOrder === "Rating") return b.rating - a.rating;
		if (sortOrder === "Price: Low")
			return Number(a.hourlyRate) - Number(b.hourlyRate);
		if (sortOrder === "Price: High")
			return Number(b.hourlyRate) - Number(a.hourlyRate);
		return 0;
	});

	const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
	const paginated = sorted.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const handleSearch = (val: string) => {
		setSearch(val);
		setCurrentPage(1);
	};

	return (
		<div>
			{/* ── Hero ── */}
			<section className="relative overflow-hidden px-4 md:px-0">
				<div className="relative z-10 container mx-auto py-16 flex items-center gap-8 md:gap-32 flex-col lg:flex-row">
					{/* Left */}
					<div className="flex-1 min-w-0 space-y-4">
						<Breadcrumb alignment="left">
							Home /{" "}
							<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
								Private Tutoring
							</span>
						</Breadcrumb>

						<motion.h2
							className="h2 text-5xl! leading-[56px]!"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						>
							1-On-1 Private Tutoring
							<br />
							for students
						</motion.h2>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.55,
								delay: 0.15,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<Subtitle alignment="left">
								Private 1-On-1 tutoring, expert instructors, and a clear weekly
								plan that helps students improve scores with confidence.
							</Subtitle>
						</motion.div>

						<motion.div
							className="flex flex-col sm:flex-row justify-start items-center gap-1 sm:gap-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<AvatarGroup className="w-fit *:data-[slot=avatar]:ring-[2.5px]">
								<Avatar className="size-[30px]">
									<AvatarImage src="home/avatar-group-1.png" alt="" />
									<AvatarFallback>A</AvatarFallback>
								</Avatar>
								<Avatar className="size-[30px]">
									<AvatarImage src="home/avatar-group-2.png" alt="" />
									<AvatarFallback>B</AvatarFallback>
								</Avatar>
								<Avatar className="size-[30px]">
									<AvatarImage src="home/avatar-group-3.png" alt="" />
									<AvatarFallback>C</AvatarFallback>
								</Avatar>
							</AvatarGroup>
							<Subtitle className="text-center mb-0! w-fit mx-0">
								4.9 out of 5.00 by 14,000 people worldwide.
							</Subtitle>
						</motion.div>
					</div>

					{/* Stats card */}
					<motion.div
						className="flex-shrink-0 bg-primary rounded-2xl p-8 grid grid-cols-2"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
					>
						{[
							{ label: "Avg. Score Improvement", sub: "150+" },
							{ label: "2000 Reviews", sub: "4.9" },
							{
								label: "Expert Instructors",
								sub: isLoading ? "—" : `${teachers.length}+`,
							},
							{ label: "Students Worldwide", sub: "2000+" },
						].map(({ label, sub }, i) => (
							<div
								key={label}
								className={`${i < 2 ? "pb-6" : "pt-6"} ${i % 2 === 0 ? "pr-6" : "pl-6"}`}
							>
								<p className="f14 text-white! tracking-[0.5px]! flex items-center gap-2 mb-3">
									<span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
									{label}
								</p>
								<div className="h-0.5 bg-white/30 mb-2.5" />
								<p className="h2 text-white! leading-[48px]! -tracking-[2px]!">
									{sub}
								</p>
							</div>
						))}
					</motion.div>
				</div>

				{/* bg */}
				<img
					src="/bg.png"
					alt=""
					className="absolute inset-0 w-full h-full object-cover z-0"
				/>
				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.2) 60%, rgba(236,241,254,0.2) 83%, rgba(21,82,253,0.3) 100%)",
					}}
				/>
			</section>

			{/* ── Listing ── */}
			<section className="py-16 px-6 md:px-0 bg-white min-h-screen">
				<div className="container mx-auto">
					{/* Header */}
					<div className="text-center mb-10">
						<h2 className="h2">Choose Your Tutor</h2>
						<Subtitle alignment="center">
							Find the right tutor based on your schedule and exam date
						</Subtitle>
					</div>

					{/* Toolbar */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
							<input
								type="text"
								placeholder="Search tutors by name or subject…"
								value={search}
								onChange={(e) => handleSearch(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white f14 text-[#7B7B7B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
							/>
						</div>

						<div className="flex items-center gap-2 ml-auto">
							<FilterDropdown
								label="Featured"
								options={["Featured", "Rating", "Price: Low", "Price: High"]}
								onSelect={setSortOrder}
							/>
							<FilterDropdown
								label="All"
								options={["All", "Available", "Unavailable"]}
								onSelect={setAvailabilityFilter}
							/>
							<button
								type="button"
								onClick={() => {
									setSearch("");
									setCurrentPage(1);
									setAvailabilityFilter("All");
									setSortOrder("Featured");
								}}
								className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all"
							>
								<RotateCcw className="w-4 h-4 text-blue-500" />
							</button>
							<button
								type="button"
								className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark transition-colors"
							>
								<SlidersHorizontal className="w-4 h-4 text-white" />
							</button>
						</div>
					</div>

					{/* Results count */}
					{!isLoading && (
						<p className="f14 text-muted-foreground mb-4">
							{sorted.length} tutor{sorted.length !== 1 ? "s" : ""} found
						</p>
					)}

					{/* List */}
					{isLoading ? (
						<div className="flex justify-center py-24">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
						</div>
					) : isError ? (
						<div className="text-center py-20 text-slate-400">
							<p className="text-sm">
								Failed to load tutors. Please try again later.
							</p>
						</div>
					) : paginated.length > 0 ? (
						<div className="flex flex-col gap-4 mb-10">
							{paginated.map((tutor) => (
								<TutorProfileCard key={tutor.id} tutor={tutor} />
							))}
						</div>
					) : (
						<div className="text-center py-20 text-slate-400">
							<Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
							<p className="text-sm">No tutors match your search.</p>
							<button
								type="button"
								className="text-xs text-primary underline mt-2"
								onClick={() => {
									setSearch("");
									setAvailabilityFilter("All");
								}}
							>
								Clear filters
							</button>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
								onNext={() =>
									setCurrentPage((p) => Math.min(totalPages, p + 1))
								}
								onPageChange={setCurrentPage}
							/>
						</div>
					)}
				</div>
			</section>

			<FAQSectionTwo />
			<FooterTwo />
		</div>
	);
}
