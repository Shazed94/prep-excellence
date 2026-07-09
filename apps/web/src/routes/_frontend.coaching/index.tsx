import type { CoachingCourse } from "@prepexcellence/shared-types";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpen,
	ChevronDown,
	Clock,
	RotateCcw,
	Search,
	SlidersHorizontal,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Subtitle } from "@/components/SectionSubtitle";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetPublishedCoachingCourses } from "@/hooks/course-management";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export const Route = createFileRoute("/_frontend/coaching/")({
	component: RouteComponent,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function levelColor(level: string) {
	const map: Record<string, string> = {
		BEGINNER: "bg-emerald-100 text-emerald-700",
		INTERMEDIATE: "bg-amber-100 text-amber-700",
		ADVANCED: "bg-red-100 text-red-600",
	};
	return map[level] ?? "bg-muted/20 text-muted";
}

function levelLabel(level: string) {
	return level.charAt(0) + level.slice(1).toLowerCase();
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
	label,
	options,
}: {
	label: string;
	options: string[];
}) {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(label);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-2 px-4 py-2.5 rounded border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50/40 transition-all"
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

// ─── Course Card ──────────────────────────────────────────────────────────────

function CoachingCourseCard({ course }: { course: CoachingCourse }) {
	const price = course.discount ?? course.price;
	const hasDiscount =
		course.discount && course.price && course.discount < course.price;

	return (
		<motion.div
			variants={fadeUp}
			className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
		>
			{/* Thumbnail */}
			<div className="relative h-48 bg-primary-light overflow-hidden">
				{course.thumbnail ? (
					<img
						src={course.thumbnail}
						alt={course.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<BookOpen className="w-12 h-12 text-primary/30" />
					</div>
				)}
				<div className="absolute top-3 left-3">
					<span
						className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor(course.level)}`}
					>
						{levelLabel(course.level)}
					</span>
				</div>
				{hasDiscount && (
					<div className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-md">
						Sale
					</div>
				)}
			</div>

			{/* Body */}
			<div className="p-5 flex flex-col flex-1">
				<h3 className="h4 mb-2 line-clamp-2">{course.title}</h3>
				<p className="f14 text-muted-foreground mb-4 line-clamp-2 flex-1">
					{course.shortDescription}
				</p>

				{/* Meta */}
				<div className="flex items-center gap-4 mb-4 text-muted-foreground">
					{course.courseModules && (
						<div className="flex items-center gap-1.5 f14">
							<BookOpen className="w-3.5 h-3.5" />
							<span>{course.courseModules.length} modules</span>
						</div>
					)}
					{course.duration && (
						<div className="flex items-center gap-1.5 f14">
							<Clock className="w-3.5 h-3.5" />
							<span>{course.duration}w</span>
						</div>
					)}
					{course._count?.enrollments !== undefined && (
						<div className="flex items-center gap-1.5 f14">
							<Users className="w-3.5 h-3.5" />
							<span>{course._count.enrollments}</span>
						</div>
					)}
				</div>

				{/* Tags */}
				{course.tags?.length > 0 && (
					<div className="flex flex-wrap gap-1.5 mb-4">
						{course.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="text-[11px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Footer */}
				<div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
					<div>
						<span className="h4 text-primary">
							${price?.toLocaleString() ?? "0"}
						</span>
						{hasDiscount && (
							<span className="f14 text-muted-foreground line-through ml-2">
								${course.price?.toLocaleString()}
							</span>
						)}
					</div>
					<Link to={`/coaching/${course.id}` as "/"}>
						<Button variant="gradient" size="sm" className="px-5">
							View Program
						</Button>
					</Link>
				</div>
			</div>
		</motion.div>
	);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CourseCardSkeleton() {
	return (
		<div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden animate-pulse">
			<div className="h-48 bg-gray-100" />
			<div className="p-5 space-y-3">
				<div className="h-5 bg-gray-100 rounded w-3/4" />
				<div className="h-4 bg-gray-100 rounded w-full" />
				<div className="h-4 bg-gray-100 rounded w-2/3" />
				<div className="flex gap-3 pt-2">
					<div className="h-4 bg-gray-100 rounded w-20" />
					<div className="h-4 bg-gray-100 rounded w-16" />
				</div>
				<div className="flex justify-between items-center pt-4 border-t border-gray-100">
					<div className="h-6 bg-gray-100 rounded w-16" />
					<div className="h-8 bg-gray-100 rounded w-24" />
				</div>
			</div>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const { data, isLoading, isError } = useGetPublishedCoachingCourses();
	const courses = data?.data ?? [];

	const [search, setSearch] = useState("");
	const [levelFilter, setLevelFilter] = useState("All Levels");

	const filtered = courses.filter((c) => {
		const matchSearch =
			c.title.toLowerCase().includes(search.toLowerCase()) ||
			c.shortDescription?.toLowerCase().includes(search.toLowerCase());
		const matchLevel =
			levelFilter === "All Levels" || c.level === levelFilter.toUpperCase();
		return matchSearch && matchLevel;
	});

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
								Coaching Programs
							</span>
						</Breadcrumb>

						<motion.h2
							className="h2 text-5xl! leading-[56px]!"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
						>
							Expert-Led Group
							<br />
							Coaching Programs
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
								Structured, instructor-led programs with progressive module
								unlocking. Learn at your pace with expert guidance every step.
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
							{ label: "Coaching Programs", sub: `${courses.length || "10"}+` },
							{ label: "Avg. Completion Rate", sub: "92%" },
							{ label: "Students Enrolled", sub: "2000+" },
							{ label: "Expert Coaches", sub: "15+" },
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

			{/* ── Course Listing ── */}
			<section className="py-16 px-6 md:px-0 bg-white min-h-screen">
				<div className="container mx-auto">
					{/* Header */}
					<motion.div
						className="text-center mb-10"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<h2 className="h2">Browse All Programs</h2>
						<Subtitle alignment="center">
							Choose the coaching program that fits your goals and schedule
						</Subtitle>
					</motion.div>

					{/* Toolbar */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
							<input
								type="text"
								placeholder="Search programs..."
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
								}}
								className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white f14 text-[#7B7B7B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
							/>
						</div>
						<div className="flex items-center gap-2 ml-auto">
							<FilterDropdown
								label="All Levels"
								options={["All Levels", "Beginner", "Intermediate", "Advanced"]}
							/>
							<FilterDropdown
								label="All Durations"
								options={[
									"All Durations",
									"1-4 Weeks",
									"5-8 Weeks",
									"8+ Weeks",
								]}
							/>
							<button
								type="button"
								onClick={() => {
									setSearch("");
									setLevelFilter("All Levels");
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

					{/* Grid */}
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 6 }).map((_, i) => (
								<CourseCardSkeleton key={i} />
							))}
						</div>
					) : isError ? (
						<div className="text-center py-20 text-slate-400">
							<p className="text-sm">
								Failed to load courses. Please try again later.
							</p>
						</div>
					) : filtered.length > 0 ? (
						<motion.div
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
							variants={staggerContainer}
							initial="hidden"
							animate="visible"
						>
							{filtered.map((course) => (
								<CoachingCourseCard key={course.id} course={course} />
							))}
						</motion.div>
					) : (
						<div className="text-center py-24">
							<BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
							<p className="h4 text-muted-foreground">No programs found</p>
							<p className="f14 text-muted-foreground mt-1">
								Try adjusting your search or filters
							</p>
						</div>
					)}
				</div>
			</section>

			<FAQSectionTwo />
			<FooterTwo />
		</div>
	);
}
