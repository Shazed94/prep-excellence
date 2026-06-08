"use client";

import {
	Calendar,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Play,
	RotateCcw,
	Search,
	SlidersHorizontal,
	Timer,
	User,
} from "lucide-react";
import { useState } from "react";
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

function CourseCard({ course }: { course: Course }) {
	return (
		<div className="flex items-stretch gap-0 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
			{/* Thumbnail */}
			<div className="relative w-[260px] flex-shrink-0 overflow-hidden group">
				<img
					src={course.image}
					alt={course.title}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
				{/* overlay */}
				<div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

				{/* Badge */}
				{course.badge && (
					<span className="absolute top-3 left-3 bg-emerald-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
						{course.badge}
					</span>
				)}

				{/* Play button */}
				<button type="button" className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-sm">
					<Play className="w-3.5 h-3.5 text-blue-700 fill-blue-700 ml-0.5" />
				</button>
			</div>

			{/* Info */}
			<div className="flex-1 px-6 py-5 flex flex-col justify-center border-r border-gray-100">
				<h3 className="text-[17px] font-bold text-slate-900 mb-2 leading-snug">
					{course.title}
				</h3>
				<p className="text-sm text-slate-500 leading-relaxed">
					{course.description}
				</p>
			</div>

			{/* Schedule meta */}
			<div className="w-[230px] flex-shrink-0 px-6 py-5 flex flex-col justify-center gap-2.5 bg-gray-50/60 border-r border-gray-100">
				{[
					{ icon: Calendar, text: course.startDate },
					{ icon: Timer, text: course.duration },
					{ icon: Clock, text: course.schedule },
					{ icon: User, text: course.instructor },
				].map(({ icon: Icon, text }) => (
					<div key={text} className="flex items-center gap-2.5">
						<Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
						<span className="text-sm text-slate-600">{text}</span>
					</div>
				))}
			</div>

			{/* Pricing */}
			<div className="w-[220px] flex-shrink-0 px-6 py-5 flex flex-col items-center justify-center gap-3 bg-blue-50/40">
				<div className="text-center">
					<span className="text-3xl font-extrabold text-slate-900 tracking-tight">
						${course.price}{" "}
						<span className="text-base font-semibold text-slate-400">USD</span>
					</span>
					<span className="ml-2 text-sm text-slate-400 line-through">
						${course.originalPrice} USD
					</span>
				</div>

				<button type="button" className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-blue-200">
					Book Your Seat
				</button>

				<p className="text-sm text-slate-500 font-medium">
					{String(course.seatsLeft).padStart(2, "0")} Seats Left.
				</p>
			</div>
		</div>
	);
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
	page,
	total,
	onPrev,
	onNext,
}: {
	page: number;
	total: number;
	onPrev: () => void;
	onNext: () => void;
}) {
	return (
		<div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2 py-1.5 shadow-sm">
			<button
				type="button"
				onClick={onPrev}
				disabled={page === 1}
				className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
			>
				<ChevronLeft className="w-4 h-4 text-gray-600" />
			</button>

			<span className="px-3 text-sm font-semibold text-slate-700 min-w-[56px] text-center">
				{page} / {total}
			</span>

			<button
				type="button"
				onClick={onNext}
				disabled={page === total}
				className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
			>
				<ChevronRight className="w-4 h-4 text-gray-600" />
			</button>
		</div>
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
				<div className="text-center mb-10">
					<h2 className="h2">Choose SAT Courses</h2>
					<Subtitle alignment="center">
						Choose a course based on your schedule and exam date
					</Subtitle>
				</div>

				{/* Toolbar */}
				<div className="flex items-center gap-3 mb-8">
					{/* Search */}
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
						<input
							type="text"
							placeholder="Search Courses"
							value={search}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-gray-200 bg-white f14 text-[#7B7B7B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
						/>
					</div>

					<div className="flex items-center gap-2 ml-auto">
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
						<button
							type="button"
							onClick={() => {
								setSearch("");
								setPage(1);
							}}
							className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
						>
							<RotateCcw className="w-4 h-4 text-blue-500" />
						</button>

						{/* Filters */}
						<button
							type="button"
							className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
						>
							<SlidersHorizontal className="w-4 h-4 text-white" />
						</button>
					</div>
				</div>

				{/* Course list */}
				<div className="flex flex-col gap-4 mb-10">
					{paginated.length > 0 ? (
						paginated.map((course) => (
							<CourseCard key={course.id} course={course} />
						))
					) : (
						<div className="text-center py-20 text-slate-400 text-sm">
							No courses match your search.
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center">
						<Pagination
							page={page}
							total={totalPages}
							onPrev={() => setPage((p) => Math.max(1, p - 1))}
							onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
