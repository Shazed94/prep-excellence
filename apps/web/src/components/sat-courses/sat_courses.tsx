import type { CoachingCourse as Course } from "@prepexcellence/shared-types";
export type { Course };
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ChevronDown,
	Loader,
	Pause,
	Play,
	RotateCcw,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
	useGetActiveCategories, useGetPublishedCourses
} from "@/hooks/course-management";
import { useCart } from "@/hooks/useCart";
import { useDebounce } from "@/hooks/useDebounce";
import { dayMap, formatTime } from "@/lib/utils";
import { Pagination } from "../Pagination";
import { Subtitle } from "../SectionSubtitle";
import { CalenderSVG } from "../SvgComponents";
import { Button } from "../ui/button";

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

export function FilterDropdown({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: string[];
	value: string;
	onChange: (value: string) => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="rounded-md border border-[#EBEBEB] bg-white px-4 py-3 f14 text-[#03030B] flex items-center gap-1 whitespace-nowrap"
			>
				{label}: {value}
				<ChevronDown className="w-4 h-4 text-[#03030B]" />
			</button>

			{open && (
				<div className="absolute top-full mt-2 left-0 z-50 bg-white border border-[#EBEBEB] rounded-md shadow-lg py-1.5 min-w-40">
					{options.map((opt) => (
						<button
							type="button"
							key={opt}
							onClick={() => {
								onChange(opt);
								setOpen(false);
							}}
							className={`w-full text-left px-4 py-2 text-sm transition-colors ${
								value === opt
									? "bg-blue-50 text-blue-700 font-medium"
									: "text-[#03030B] hover:bg-blue-50 hover:text-blue-700"
							}`}
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
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	// Format schedule display
	const formatSchedule = (schedules: any[]) => {
		const days = schedules.map((s) => dayMap[s.dayOfWeek.toLowerCase()]).join(", ");

		// assuming same time range for all
		const first = schedules[0];

		return `${days} — ${formatTime(first.startTime)}`;
	};

	const hasSeats = course.capacity! - (course?._count?.enrollments || 0) > 0;
	const regular = Number(course.price);
	const offer = Number(course.discount);
	const discount =
		regular > 0 ? Math.round(((regular - offer) / regular) * 100) : 0;

	const weeks = Math.floor(Number(course.duration) / 7);
	const { addToCart, refetch } = useCart();

	const handleAddToCart = () => {
		const data = {
			id: course.id,
			title: course.title,
			price: course.price,
			discount: course.discount,
			thumbnail: course.thumbnail,
		};
		addToCart({ courseId: course.id }, data, {
			onSuccess: (res) => {
				toast.success(res.data.message || "Course added to cart");
				refetch();
			},
			// onError: (error) => {
			//   toast.error(error?.message || "Failed to add course to cart");
			// },
		});
	};
	const handlePlayPause = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1],
				delay: Math.min(index * 0.08, 0.4),
			}}
			//   whileHover={{ y: -4 }}
			className="bg-white p-4 rounded-[12px] border border-[#EBEBEB] overflow-hidden transition-all duration-300 flex flex-col md:flex-row items-stretch gap-4 md:gap-0"
		>
			<div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0 w-full h-full">
				{/* Image */}
				<div className="relative h-48 overflow-hidden">
					{/* Video */}
					<div className="relative h-48 overflow-hidden bg-black rounded-[6px] group">
						<video
							ref={videoRef}
							src={course.video}
							poster={course.thumbnail}
							className="w-full max-w-[280px] h-full object-cover"
							onPlay={() => setIsPlaying(true)}
							onPause={() => setIsPlaying(false)}
						>
							<track kind="captions" />
						</video>
					</div>

					<span className="absolute top-3 left-3 bg-[#1BA75C] text-white text-xs leading-[18px] -tracking-[0.3px] font-medium px-2.5 py-1 rounded-md">
						{discount > 0 ? `${discount}% Off` : course.discount}
					</span>
					<div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 rounded-[6px] flex items-center justify-center cursor-pointer shadow-md">
						<button type="button" onClick={handlePlayPause}>
							{isPlaying ? (
								<Pause className="size-5 text-primary" />
							) : (
								<Play className="size-5 text-primary" />
							)}
						</button>
					</div>
				</div>

				{/* Info */}
				<Link
					to={`/sat-courses/${course.id}` as "/"}
					className="flex-1 px-0 md:px-5 flex flex-col justify-center"
				>
					<motion.h3
						className="h6_class line-clamp-2 drop-shadow-[0px_4px_1.5px_rgba(0,0,0,0.2)]"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
					>
						{course.title}
					</motion.h3>
					<motion.p
						className="body_lg text-[#7B7B7B] line-clamp-3"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
					>
						{course.shortDescription}
					</motion.p>
					{/* <div className="mt-2 flex flex-wrap gap-2">
            {course.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div> */}
				</Link>
			</div>

			<div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 w-full">
				{/* Schedule meta */}
				<div className="min-w-full md:min-w-[283px] h-full shrink-0 p-4 flex flex-col justify-center gap-2 bg-[#F8F8F9] rounded-sm">
					<motion.div
						className="flex items-center gap-1.5 body_lg"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
					>
						<CalenderSVG width="24" height="24" />
						<span>{format(new Date(course.startDate), "MMM dd, yyyy")}</span>
					</motion.div>

					<motion.div
						className="flex items-center gap-1.5 body_lg text-[#7B7B7B] text-sm line-clamp-1"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.35 }}
					>
						<img
							src="/icons/hourglass.png"
							alt=""
							className="size-6  shrink-0"
						/>
						<span>{weeks} Weeks</span>
					</motion.div>

					<motion.div
						className="flex items-center gap-1.5 body_lg"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4 }}
					>
						<img
							src="/icons/clock-icon.png"
							alt=""
							className="size-6  shrink-0"
						/>
						<span>{formatSchedule(course?.schedules)}</span>
					</motion.div>
					<motion.div
						className="flex items-center gap-1.5 body_lg"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.45 }}
					>
						<img
							src="/icons/user-circle-icon.png"
							alt=""
							className="size-6  shrink-0"
						/>
						<span>{course.createdBy?.name}</span>
					</motion.div>
				</div>

				{/* Pricing */}
				<div className="w-full h-full flex-1 px-5 flex flex-col items-center justify-center gap-4 bg-[#EBF3FF] rounded-sm">
					<div className="text-center">
						<motion.span
							className=""
							initial={{ scale: 0.9 }}
							whileInView={{ scale: 1 }}
							viewport={{ once: true }}
						>
							(
								<span className="text-[#0d1b2a] bold_h4 me-2">
									${course.price} USD
								</span>
							)
						</motion.span>
					</div>

					<Button
						variant="gradient"
						onClick={handleAddToCart}
						disabled={!hasSeats}
						className="w-full py-3 rounded-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white! f14 text-center hover:brightness-95 transition-all"
					>
						Book Your Seat
					</Button>

					<p className="text-sm text-slate-500 font-medium">
						{String(
							Math.max(0, course.capacity! - (course?._count?.enrollments || 0)),
						).padStart(2, "0")}{" "}
						Seats Left
					</p>
				</div>
			</div>
		</motion.div>
	);
}

// ─── Main Section ─────────────────────────────────────────────────────────────

const SORT_OPTIONS = ["Newest", "Oldest", "Popular"];

const LEVEL_OPTIONS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function ChooseSATCourses() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState<"Newest" | "Oldest" | "Popular">(
		"Newest",
	);
	const [category, setCategory] = useState("All Categories");
	const { data: categories } = useGetActiveCategories();
	const [level, setLevel] = useState("All Levels");

	// Debounced search
	const debouncedQuery = useDebounce(search, 500);

	// Map sort display to backend sortBy field
	const sortByField =
		sortBy === "Newest"
			? "createdAt"
			: sortBy === "Popular"
				? "_count"
				: "createdAt";

	const orderBy =
		sortBy === "Oldest" ? "asc" : sortBy === "Popular" ? "desc" : "desc";

	const filters = {
		categoryId:
			category !== "All Categories"
				? categories?.find((c) => c.name === category)?.id
				: undefined,
		level: level !== "All Levels" ? level : undefined,
	};

	const {
		data: coursesData,
		isLoading,
		isError,
	} = useGetPublishedCourses({
		page,
		limit: 6,
		search: debouncedQuery,
		sortBy: sortByField,
		orderBy: orderBy as "asc" | "desc",
		filters,
	});

	// Reset page when search or filters change
	useEffect(() => {
		setPage(1);
	}, []);

	const handleReset = () => {
		setSearch("");
		setPage(1);
		setSortBy("Newest");
		setCategory("All Categories");
		setLevel("All Levels");
	};

	if (isError) {
		return (
			<section className="py-16 px-6 md:px-0 bg-white min-h-screen">
				<div className="container mx-auto">
					<motion.div
						className="text-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<h2 className="h2 text-red-600">Error Loading Courses</h2>
						<p className="body_lg text-[#7B7B7B] mt-4">
							Failed to load courses. Please try again later.
						</p>
					</motion.div>
				</div>
			</section>
		);
	}

	const courses = coursesData?.data || [];
	const pagination = coursesData?.pagination;
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
				<div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
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
								onChange={(e) => setSearch(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-md border border-[#EBEBEB] bg-white f14 text-[#7B7B7B] placeholder-[#7B7B7B] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
							/>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="flex flex-wrap items-center gap-2 w-full md:w-auto"
					>
						<FilterDropdown
							label="Sort"
							options={SORT_OPTIONS}
							value={sortBy}
							onChange={(val) => setSortBy(val as typeof sortBy)}
						/>
						<FilterDropdown
							key={`category-${categories?.length ?? 0}-${(categories ?? []).map((c) => c.name).join(",")}`}
							label="Category"
							options={[
								"All Categories",
								...(categories?.map((c) => c.name) || []),
							]}
							value={category}
							onChange={setCategory}
						/>
						<FilterDropdown
							label="Level"
							options={LEVEL_OPTIONS}
							value={level}
							onChange={setLevel}
						/>

						{/* Reset */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							onClick={handleReset}
							className="py-3 px-4 flex items-center justify-center rounded-md border border-[#EBEBEB] bg-[#EBF3FF] hover:bg-[#EBEBEB] hover:border-[#EBEBEB] transition-all"
							title="Reset all filters"
						>
							<RotateCcw className="w-5 h-5 text-primary" />
						</motion.button>

						{/* Filters */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type="button"
							className="py-3 px-4 flex items-center justify-center rounded-md bg-primary hover:bg-blue-700 transition-colors"
							title="Advanced filters"
						>
							<SlidersHorizontal className="w-5 h-5 text-white" />
						</motion.button>
					</motion.div>
				</div>

				{/* Results count */}
				{pagination && (
					<p className="text-sm text-[#7B7B7B] mb-4">
						Showing {courses.length > 0 ? (page - 1) * 6 + 1 : 0}-
						{Math.min(page * 6, pagination.total)} of {pagination.total} courses
					</p>
				)}

				{/* Course list */}
				<div className="flex flex-col gap-4 mb-10">
					{isLoading ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex items-center justify-center py-20"
						>
							<Loader className="w-6 h-6 text-primary animate-spin" />
						</motion.div>
					) : (
						<AnimatePresence mode="wait">
							{courses.length > 0 ? (
								courses?.map((course, idx) => (
									<CourseCard
										key={`${course.id}-${page}`}
										course={course}
										index={idx}
									/>
								))
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-center py-20"
								>
									<p className="text-slate-400 text-sm">
										No courses match your search.
									</p>
									<button
										type="button"
										onClick={handleReset}
										className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
									>
										Reset filters
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					)}
				</div>

				{/* Pagination */}
				{pagination && pagination.totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex justify-center"
					>
						<Pagination
							currentPage={page}
							totalPages={pagination.totalPages}
							onPrevious={() => setPage((p) => Math.max(1, p - 1))}
							onNext={() =>
								setPage((p) => Math.min(pagination.totalPages, p + 1))
							}
							onPageChange={(p) => setPage(p)}
						/>
					</motion.div>
				)}
			</div>
		</section>
	);
}
