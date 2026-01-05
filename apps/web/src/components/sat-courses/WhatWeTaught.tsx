//sat-courses/WhatWeTaught

import { Link } from "@tanstack/react-router";
import { BookOpen, Loader2, Star, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetCourses } from "@/hooks/lms-course";

const sortOptions = [
	{ value: "date-newest", label: "Release date (Newest first)" },
	{ value: "date-oldest", label: "Release date (Oldest first)" },
	{ value: "price-low", label: "Price (Low to High)" },
	{ value: "price-high", label: "Price (High to Low)" },
];

export default function WhatWeTaughtSection() {
	const { data: allCourses = [], isLoading, error } = useGetCourses();
	console.log("\nDAta::::::\n", allCourses);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [priceRange, setPriceRange] = useState("10000");
	const [maxDuration, setMaxDuration] = useState("500");
	const [sortBy, setSortBy] = useState("date-newest");
	const [courses, setCourses] = useState<any[]>([]);
	const [displayedCourses, setDisplayedCourses] = useState<any[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const ITEMS_PER_PAGE = 8;

	// Extract unique categories from courses
	const categories: string[] = [
		"All",
		...(Array.from(
			new Set(
				allCourses
					.filter((c: any) => c.isPublished === true)
					.map((c: any) => c.category),
			),
		).filter(Boolean) as string[]),
	];

	const isFilterActive =
		selectedCategory !== "All" ||
		priceRange !== "10000" ||
		maxDuration !== "500" ||
		sortBy !== "date-newest";

	// Filter and sort courses
	useEffect(() => {
		if (!allCourses || allCourses.length === 0) {
			setCourses([]);
			setDisplayedCourses([]);
			return;
		}

		let filtered = allCourses.filter(
			(course: any) => course.isPublished === true,
		);

		// Filter by category
		if (selectedCategory !== "All") {
			filtered = filtered.filter(
				(course: any) => course.category === selectedCategory,
			);
		}

		// Filter by price
		filtered = filtered.filter((course: any) => {
			const coursePrice = course.price || 0;
			return coursePrice <= parseInt(priceRange, 10);
		});

		// Filter by duration
		filtered = filtered.filter((course: any) => {
			const courseDuration = course.duration || 0;
			return courseDuration <= parseInt(maxDuration, 10);
		});

		// Sort courses
		const sorted = [...filtered].sort((a: any, b: any) => {
			switch (sortBy) {
				case "date-newest":
					return (
						new Date(b.createdAt || 0).getTime() -
						new Date(a.createdAt || 0).getTime()
					);
				case "date-oldest":
					return (
						new Date(a.createdAt || 0).getTime() -
						new Date(b.createdAt || 0).getTime()
					);
				case "price-low":
					return (a.price || 0) - (b.price || 0);
				case "price-high":
					return (b.price || 0) - (a.price || 0);
				default:
					return 0;
			}
		});

		setCourses(sorted);
		setPage(1);
		setDisplayedCourses(sorted.slice(0, ITEMS_PER_PAGE));
	}, [allCourses, selectedCategory, priceRange, maxDuration, sortBy]);

	const handleLoadMore = () => {
		setLoading(true);
		setTimeout(() => {
			const nextPage = page + 1;
			const startIndex = page * ITEMS_PER_PAGE;
			const endIndex = startIndex + ITEMS_PER_PAGE;
			const newCourses = courses.slice(startIndex, endIndex);

			setDisplayedCourses([...displayedCourses, ...newCourses]);
			setPage(nextPage);
			setLoading(false);
		}, 500);
	};

	const handleClearFilters = () => {
		setSelectedCategory("All");
		setPriceRange("10000");
		setMaxDuration("500");
		setSortBy("date-newest");
	};

	const hasMore = displayedCourses.length < courses.length;

	if (isLoading) {
		return (
			<section className="py-16 px-4 bg-white">
				<div className="container mx-auto max-w-7xl">
					<div className="flex items-center justify-center min-h-[400px]">
						<Loader2 className="w-8 h-8 animate-spin text-[#0891b2]" />
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="py-16 px-4 bg-white">
				<div className="container mx-auto max-w-7xl">
					<div className="text-center py-12">
						<p className="text-red-500 text-lg">
							Failed to load courses. Please try again later.
						</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-16 px-4 bg-white">
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<div className="text-center mb-10">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						What We've Taught
					</h2>
					<p className="text-gray-600 max-w-3xl mx-auto text-base">
						See our expert team has taught over the years — and why those
						lessons consistently translate into real, measurable score
						increases!
					</p>
				</div>

				{/* Category Tabs */}
				<div className="flex justify-center mb-8">
					<div className="inline-flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-lg">
						{categories.map((category: string) => (
							<button
								type="button"
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
									selectedCategory === category
										? "bg-white text-[#0891b2] shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* Filters and Controls */}
				<div className="flex items-center justify-between mb-8 flex-wrap gap-4">
					<div className="text-sm text-gray-600">
						Showing {displayedCourses.length} of {courses.length} courses
					</div>
					<div className="w-full px-2">
						<div
							className="
			grid
			grid-cols-1
			sm:grid-cols-2
			lg:grid-cols-4
			gap-2
			md:gap-3
		"
						>
							{/* Price */}
							<Select value={priceRange} onValueChange={setPriceRange}>
								<SelectTrigger className="h-9 text-sm w-full">
									<SelectValue placeholder="Price" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="500">Max Price($): 500</SelectItem>
									<SelectItem value="1000">Max Price($): 1000</SelectItem>
									<SelectItem value="5000">Max Price($): 5000</SelectItem>
									<SelectItem value="10000">Max Price($): 10000</SelectItem>
								</SelectContent>
							</Select>

							{/* Duration */}
							<Select value={maxDuration} onValueChange={setMaxDuration}>
								<SelectTrigger className="h-9 text-sm w-full">
									<SelectValue placeholder="Duration" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="50">Max Duration: 50 hours</SelectItem>
									<SelectItem value="100">Max Duration: 100 hours</SelectItem>
									<SelectItem value="500">Max Duration: 500 hours</SelectItem>
								</SelectContent>
							</Select>

							{/* Sort */}
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="h-9 text-sm w-full">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									{sortOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Clear Button */}
							<button
								type="button"
								onClick={handleClearFilters}
								disabled={!isFilterActive}
								className="
				h-9
				w-full
				rounded-md
				border
				border-gray-300
				text-sm
				font-medium
				transition
				hover:bg-gray-100
				disabled:opacity-50
				disabled:cursor-not-allowed
			"
							>
								Clear Filters
							</button>
						</div>
					</div>
				</div>
				{/* Courses Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<AnimatePresence mode="popLayout">
						{displayedCourses.map((course) => (
							<motion.div
								key={course.id}
								layout
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{
									layout: { duration: 0.4, ease: "easeInOut" },
									opacity: { duration: 0.3 },
									scale: { duration: 0.3 },
								}}
							>
								<Link
									to={`/sat-courses/$courseId` as "/"}
									params={{ courseId: course.id }}
									className="block h-full"
								>
									<div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer">
										{/* Course Image */}
										<div className="h-52 relative overflow-hidden bg-linear-to-br from-blue-500 to-purple-600">
											{course.thumbnail ? (
												<img
													src={course.thumbnail}
													alt={course.title}
													className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<BookOpen className="w-16 h-16 text-white/50" />
												</div>
											)}

											{/* Category Badge */}
											<div className="absolute top-3 left-3">
												<span className="text-xs font-medium text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
													{course.category || "Course"}
												</span>
											</div>
										</div>

										{/* Course Content */}
										<div className="p-5 flex-1 flex flex-col">
											<div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
												{course.category || "Course"}
											</div>

											<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
												{course.title}
											</h3>

											<p className="text-sm text-gray-600 mb-4 flex-1 leading-relaxed line-clamp-3">
												{course.description?.replace(/<[^>]*>/g, "")}
											</p>

											{/* Course Meta */}
											<div className="space-y-3">
												<div className="flex items-center justify-between text-sm">
													<span className="text-gray-600">
														Duration: {course.duration}h
													</span>
													<span className="text-xl font-bold text-[#0891b2]">
														${course.price || 0}
													</span>
												</div>

												<div className="flex items-center justify-between pt-3 border-t border-gray-100">
													<div className="flex items-center gap-1.5 text-sm text-gray-600">
														<Users className="w-4 h-4" />
														<span>
															{course.enrolledStudents?.length || 0} Students
														</span>
													</div>

													<div className="flex items-center gap-1.5">
														<div className="flex">
															{[...Array(5)].map((_, i) => (
																<Star
																	key={`star-${course.id}-${i}`}
																	className={`w-4 h-4 ${
																		i < 0
																			? "fill-yellow-400 text-yellow-400"
																			: "fill-gray-200 text-gray-200"
																	}`}
																/>
															))}
														</div>
														<span className="text-sm text-gray-600">(0)</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* No Results Message */}
				{displayedCourses.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No courses found matching your filters.
						</p>
					</div>
				)}

				{/* Load More Button */}
				{hasMore && (
					<div className="flex justify-center">
						<Button
							onClick={handleLoadMore}
							disabled={loading}
							className="bg-[#0891b2] hover:bg-[#0e7490] text-white px-8 py-2.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Loading..." : "Load More"}
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
