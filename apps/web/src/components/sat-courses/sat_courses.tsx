"use client";

import { Link } from "@tanstack/react-router";
import {
	Calendar,
	ChevronDown,
	Clock,
	Play,
	RotateCcw,
	Search,
	SlidersHorizontal,
	Timer,
	User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Pagination } from "../Pagination";
import { Subtitle } from "../SectionSubtitle";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
	id: number;
	title: string;
	description: string;
	image: string;
	badge?: string;
	startDate: string;
	duration: string;
	schedule: string;
	instructor: string;
	price: number;
	originalPrice: number;
	seatsLeft: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const COURSES: Course[] = Array.from({ length: 21 }, (_, i) => ({
	id: i + 1,
	title: "SAT Comprehensive — Summer 2026",
	description:
		"Full-length preparation covering all SAT sections with weekly mock tests and personalized feedback.",
	image: `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=260&fit=crop&q=80`,
	badge: "15% Off",
	startDate: "June 15, 2026",
	duration: "08 weeks",
	schedule: "Mon, Wed, Fri — 6:00 PM",
	instructor: "Sara Mitchel",
	price: 125,
	originalPrice: 150,
	seatsLeft: 2,
}));

const PAGE_SIZE = 3;

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

export function FilterDropdown({
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
				className="rounded-md border border-[#EBEBEB] bg-white px-4 py-3 f14 text-[#03030B] flex items-center gap-1 "
			>
				{selected}
				<ChevronDown className="w-4 h-4 text-[#03030B]" />
			</button>

			{open && (
				<div className="absolute top-full mt-2 left-0 z-50 bg-white border border-[#EBEBEB] rounded-md shadow-lg py-1.5 min-w-40">
					{options.map((opt) => (
						<button
							type="button"
							key={opt}
							onClick={() => {
								setSelected(opt);
								setOpen(false);
							}}
							className="w-full text-left px-4 py-2 text-sm text-[#03030B] hover:bg-blue-50 hover:text-blue-700 transition-colors"
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

function CourseCard({ course, index }: { course: Course; index: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1],
				delay: Math.min(index * 0.08, 0.4),
			}}
			whileHover={{ y: -4 }}
			className="bg-white p-4 rounded-[12px] border border-[#EBEBEB] overflow-hidden transition-all duration-300 flex flex-col md:flex-row items-stretch gap-4 md:gap-0"
		>
			<div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0 w-full h-full">
				{/* Thumbnail */}
				<div className="relative min-w-[279px] shrink-0 overflow-hidden group">
					<motion.img
						src={course.image}
						alt={course.title}
						className="w-full h-40 object-cover rounded-sm"
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.4 }}
					/>

					{/* Badge */}
					{course.badge && (
						<motion.span
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.3 }}
							className="absolute top-3 left-3 bg-[#1BA75C] text-white! small font-medium! px-3 py-1.5 rounded-sm"
						>
							{course.badge}
						</motion.span>
					)}
					{/* Play button */}
					<motion.button
						whileHover={{ scale: 1.15 }}
						whileTap={{ scale: 0.95 }}
						type="button"
						className="absolute bottom-3 left-3 w-8 h-8 rounded-sm bg-white flex items-center justify-center hover:scale-110 transition-all shadow-sm"
					>
						<Play className="w-4 h-4 text-primary ml-0.5" />
					</motion.button>
				</div>

				{/* Info */}
				<div className="flex-1 px-0 md:px-5 flex flex-col justify-center">
					<motion.h3
						className="h6_class"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
					>
						{course.title}
					</motion.h3>
					<motion.p
						className="body_lg"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
					>
						{course.description}
					</motion.p>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 w-full ">
				{/* Schedule meta */}
				<div className="min-w-full md:min-w-[283px]   h-full shrink-0 p-4 flex flex-col justify-center gap-2 bg-[#F8F8F9] rounded-sm">
					{[
						{ icon: Calendar, text: course.startDate },
						{ icon: Timer, text: course.duration },
						{ icon: Clock, text: course.schedule },
						{ icon: User, text: course.instructor },
					].map(({ icon: Icon, text }, i) => (
						<motion.div
							key={text}
							className="flex items-center gap-1.5 body_lg"
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 + i * 0.05 }}
						>
							<Icon className="w-5 h-5  shrink-0" />
							<span className="">{text}</span>
						</motion.div>
					))}
				</div>

				{/* Pricing */}
				<div className="w-full h-full flex-1 px-5 flex flex-col items-center justify-center gap-4 bg-[#EBF3FF] rounded-sm">
					<div className="text-center">
						<motion.span
							className="bold_h4"
							initial={{ scale: 0.9 }}
							whileInView={{ scale: 1 }}
							viewport={{ once: true }}
						>
							${course.price} <span>USD</span>
						</motion.span>
						<span className="ml-2 mt-1 body_lg text-[#A3A3A3]!">
							${course.originalPrice} USD
						</span>
					</div>

					<Link
						to={`/sat-courses/${course.id}` as any}
						className="w-full py-3 rounded-sm gradient f14 text-white! text-center hover:brightness-95 transition-all"
					>
						Book Your Seat
					</Link>

					<p className="text-sm text-slate-500 font-medium">
						{String(course.seatsLeft).padStart(2, "0")} Seats Left.
					</p>
				</div>
			</div>
		</motion.div>
	);
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function ChooseSATCourses() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = COURSES.filter(
		(c) =>
			c.title.toLowerCase().includes(search.toLowerCase()) ||
			c.instructor.toLowerCase().includes(search.toLowerCase()),
	);

	const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
	const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const handleSearch = (val: string) => {
		setSearch(val);
		setPage(1);
	};

	return (
		<section className="py-16 px-6 md:px-0 bg-white min-h-screen">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-10"
					initial={{ opacity: 0, y: -30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					<h2 className="h2">Choose SAT Courses</h2>
					<Subtitle alignment="center">
						Choose a course based on your schedule and exam date
					</Subtitle>
				</motion.div>

				{/* Toolbar */}
				<div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
					{/* Search */}
					<div className="relative flex-1 max-w-md">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="relative"
						>
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
							<input
								type="text"
								placeholder="Search Courses"
								value={search}
								onChange={(e) => handleSearch(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-md border border-[#EBEBEB] bg-white f14 text-[#7B7B7B] placeholder-[#7B7B7B] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
							/>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex flex-wrap items-center gap-2 ml-auto"
					>
						<FilterDropdown
							label="Featured"
							options={["Featured", "Newest", "Oldest", "Popular"]}
						/>
						<FilterDropdown
							label="On Sale"
							options={["On Sale", "All", "Discounted"]}
						/>
						<FilterDropdown
							label="All Categories"
							options={[
								"All Categories",
								"SAT Math",
								"SAT Reading",
								"SAT Writing",
							]}
						/>
						<FilterDropdown
							label="Price Range"
							options={["Price Range", "Under $100", "$100–$150", "Over $150"]}
						/>

						{/* Reset */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={() => {
								setSearch("");
								setPage(1);
							}}
							className="py-3 px-4 flex items-center justify-center rounded-md border border-[#EBEBEB] bg-[#EBF3FF] hover:bg-[#EBEBEB] hover:border-[#EBEBEB] transition-all"
						>
							<RotateCcw className="w-5 h-5 text-primary" />
						</motion.button>

						{/* Filters */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className="py-3 px-4 flex items-center justify-center rounded-md bg-primary hover:bg-blue-700 transition-colors"
						>
							<SlidersHorizontal className="w-5 h-5 text-white" />
						</motion.button>
					</motion.div>
				</div>

				{/* Course list */}
				<div className="flex flex-col gap-4 mb-10">
					<AnimatePresence mode="wait">
						{paginated.length > 0 ? (
							paginated.map((course, idx) => (
								<CourseCard
									key={`${course.id}-${page}`} // force re-animate on page change
									course={course}
									index={idx}
								/>
							))
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-20 text-slate-400 text-sm"
							>
								No courses match your search.
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex justify-center"
					>
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPrevious={() => setPage((p) => Math.max(1, p - 1))}
							onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
							onPageChange={(p) => setPage(p)}
						/>
					</motion.div>
				)}
			</div>
		</section>
	);
}
