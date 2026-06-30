import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, Loader2, Search, Users } from "lucide-react";
import { useState } from "react";
import { useGetCourses } from "@/hooks/lms-course";

export const Route = createFileRoute("/dashboard/student/explorer/")({
	component: ExplorerPage,
});

const LEVELS = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LEVEL_LABEL: Record<string, string> = {
	BEGINNER: "Beginner",
	INTERMEDIATE: "Intermediate",
	ADVANCED: "Advanced",
};
const LEVEL_COLOR: Record<string, string> = {
	BEGINNER: "bg-emerald-50 text-emerald-600 border-emerald-200",
	INTERMEDIATE: "bg-amber-50 text-amber-600 border-amber-200",
	ADVANCED: "bg-red-50 text-red-600 border-red-200",
};

function CourseCard({ course }: { course: any }) {
	const level = course.level ?? "";
	const enrolled = course._count?.enrollments ?? 0;
	const durationHrs = course.duration ? Math.ceil(course.duration / 60) : null;

	return (
		<div className="bg-white rounded-2xl border border-[#EBEBEB] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
			{/* Thumbnail */}
			<div className="relative h-40 bg-primary-light flex items-center justify-center overflow-hidden flex-shrink-0">
				{course.thumbnail ? (
					<img
						src={course.thumbnail}
						alt={course.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<BookOpen className="w-10 h-10 text-primary/40" />
				)}
				{level && (
					<span
						className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[level] ?? "bg-gray-100 text-gray-500"}`}
					>
						{LEVEL_LABEL[level] ?? level}
					</span>
				)}
			</div>

			{/* Body */}
			<div className="p-4 flex flex-col flex-1 gap-3">
				<div className="flex-1">
					<h3 className="text-sm font-bold text-[#141B34] line-clamp-2 leading-snug mb-1">
						{course.title}
					</h3>
					{course.description && (
						<p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
							{course.description}
						</p>
					)}
				</div>

				{/* Meta row */}
				<div className="flex items-center gap-3 text-xs text-muted-foreground">
					{durationHrs && (
						<span className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							{durationHrs}h
						</span>
					)}
					{enrolled > 0 && (
						<span className="flex items-center gap-1">
							<Users className="w-3 h-3" />
							{enrolled.toLocaleString()} enrolled
						</span>
					)}
				</div>

				{/* Price + CTA */}
				<div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
					<div>
						{Number(course.price) > 0 ? (
							<span className="text-sm font-bold text-[#141B34]">
								${Number(course.price).toFixed(0)}
							</span>
						) : (
							<span className="text-sm font-bold text-emerald-600">Free</span>
						)}
					</div>
					<Link
						to="/_frontend/sat-courses/$courseId"
						params={{ courseId: course.id }}
					>
						<button
							type="button"
							className="text-xs font-semibold text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-lg transition-colors"
						>
							View Details
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

function ExplorerPage() {
	const [search, setSearch] = useState("");
	const [level, setLevel] = useState("All");

	const { data: courses, isLoading } = useGetCourses();
	const allCourses: any[] = Array.isArray(courses) ? courses : [];

	// Only show published courses to students
	const published = allCourses.filter((c) => c.isPublished !== false);

	const filtered = published.filter((c) => {
		const matchesSearch =
			!search ||
			c.title?.toLowerCase().includes(search.toLowerCase()) ||
			c.description?.toLowerCase().includes(search.toLowerCase()) ||
			c.category?.toLowerCase().includes(search.toLowerCase());
		const matchesLevel = level === "All" || c.level === level;
		return matchesSearch && matchesLevel;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-xl font-bold text-[#141B34]">Explore Courses</h1>
				<p className="text-sm text-muted-foreground mt-0.5">
					Discover courses tailored for your learning goals
				</p>
			</div>

			{/* Search + level filter */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
					<input
						type="text"
						placeholder="Search courses…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-9 pr-4 py-2 text-sm border border-[#EBEBEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					{LEVELS.map((l) => (
						<button
							key={l}
							type="button"
							onClick={() => setLevel(l)}
							className={`text-xs font-medium px-3 py-2 rounded-xl border transition-colors ${
								level === l
									? "bg-primary text-white border-primary"
									: "bg-white text-[#141B34] border-[#EBEBEB] hover:border-primary"
							}`}
						>
							{l === "All" ? "All Levels" : (LEVEL_LABEL[l] ?? l)}
						</button>
					))}
				</div>
			</div>

			{/* Results count */}
			{!isLoading && (
				<p className="text-xs text-muted-foreground">
					{filtered.length} course{filtered.length !== 1 ? "s" : ""} available
					{search && ` for "${search}"`}
				</p>
			)}

			{/* Grid */}
			{isLoading ? (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
					<BookOpen className="w-12 h-12 opacity-15" />
					<p className="text-sm font-medium">No courses found</p>
					{(search || level !== "All") && (
						<button
							type="button"
							className="text-xs text-primary underline"
							onClick={() => {
								setSearch("");
								setLevel("All");
							}}
						>
							Clear filters
						</button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{filtered.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			)}
		</div>
	);
}
