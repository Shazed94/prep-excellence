import { Star, Users } from "lucide-react";
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

const coursesData = [
	{
		id: 1,
		title: "SAT Accelerator Program",
		description:
			"Accelerate your score with efficient lessons and rapid improvement drills.",
		duration: "45 mins",
		price: "$507",
		students: 47,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
		accent: "#fbbf24",
	},
	{
		id: 2,
		title: "SAT Elite Mastery",
		description:
			"Advanced training for students aiming for top-percentile results.",
		duration: "50 mins",
		price: "$507",
		students: 43,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
		accent: "#1e3a8a",
	},
	{
		id: 3,
		title: "SAT Power Prep",
		description:
			"Build the skills and strategies you need to achieve your highest score.",
		duration: "45 mins",
		price: "$507",
		students: 43,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #581c87 0%, #7c3aed 100%)",
		accent: "#f59e0b",
	},
	{
		id: 4,
		title: "SAT Foundations Course",
		description: "Improve accuracy, speed, and confidence before the real SAT.",
		duration: "45 mins",
		price: "$507",
		students: 43,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #0c4a6e 0%, #0891b2 100%)",
		accent: "#fbbf24",
	},
	{
		id: 5,
		title: "SAT Score Booster",
		description:
			"Learn the fundamentals that boost your score—and qualify you.",
		duration: "43 mins",
		price: "$507",
		students: 47,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)",
		accent: "#fbbf24",
	},
	{
		id: 6,
		title: "SAT Prep Essentials",
		description:
			"Develop test-taking techniques designed for fictional level result.",
		duration: "45 mins",
		price: "$507",
		students: 43,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #581c87 0%, #a855f7 100%)",
		accent: "#fbbf24",
	},
	{
		id: 7,
		title: "SAT Complete Prep",
		description: "Strengthen algebra, geometry, and problem-solving skills.",
		duration: "48 mins",
		price: "$507",
		students: 43,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
		accent: "#f59e0b",
	},
	{
		id: 8,
		title: "SAT Boost Workshop",
		description:
			"Improve comprehension, grammar, and essay-building strategies.",
		duration: "50 mins",
		price: "$507",
		students: 43,
		rating: 4.5,
		reviews: 38,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #78350f 0%, #d97706 100%)",
		accent: "#1e3a8a",
	},
	{
		id: 9,
		title: "Advanced Math Techniques",
		description: "Master advanced mathematical concepts for competitive exams.",
		duration: "55 mins",
		price: "$650",
		students: 52,
		rating: 4.8,
		reviews: 45,
		category: "MATH",
		bgColor: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
		accent: "#fbbf24",
	},
	{
		id: 10,
		title: "Physics Fundamentals",
		description:
			"Explore the core principles of physics with hands-on examples.",
		duration: "60 mins",
		price: "$720",
		students: 38,
		rating: 4.6,
		reviews: 32,
		category: "SCIENCE",
		bgColor: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
		accent: "#fbbf24",
	},
	{
		id: 11,
		title: "English Grammar Mastery",
		description:
			"Perfect your grammar and writing skills for academic success.",
		duration: "40 mins",
		price: "$450",
		students: 65,
		rating: 4.7,
		reviews: 58,
		category: "ENGLISH",
		bgColor: "linear-gradient(135deg, #be123c 0%, #f43f5e 100%)",
		accent: "#fbbf24",
	},
	{
		id: 12,
		title: "Python Programming Basics",
		description: "Start your coding journey with Python fundamentals.",
		duration: "70 mins",
		price: "$800",
		students: 89,
		rating: 4.9,
		reviews: 76,
		category: "COMPUTER SCIENCE/ CODING",
		bgColor: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
		accent: "#fbbf24",
	},
];

const categories = [
	"All",
	"COMPUTER SCIENCE/ CODING",
	"MATH",
	"SCIENCE",
	"ENGLISH",
];

const sortOptions = [
	{ value: "date-newest", label: "Release date (Newest first)" },
	{ value: "date-oldest", label: "Release date (Oldest first)" },
	{ value: "price-low", label: "Price (Low to High)" },
	{ value: "price-high", label: "Price (High to Low)" },
];

export default function WhatWeTaughtSection() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [priceRange, setPriceRange] = useState("1000");
	const [maxDuration, setMaxDuration] = useState("500");
	const [sortBy, setSortBy] = useState("date-newest");
	const [courses, setCourses] = useState(coursesData);
	const [displayedCourses, setDisplayedCourses] = useState(
		coursesData.slice(0, 8),
	);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const ITEMS_PER_PAGE = 8;

	// Filter and sort courses
	useEffect(() => {
		let filtered = coursesData;

		// Filter by category
		if (selectedCategory !== "All") {
			filtered = filtered.filter(
				(course) => course.category === selectedCategory,
			);
		}

		// Filter by price (convert price string to number)
		filtered = filtered.filter((course) => {
			const coursePrice = parseInt(course.price.replace("$", ""), 10);
			return coursePrice <= parseInt(priceRange, 10);
		});

		// Filter by duration (convert duration to number)
		filtered = filtered.filter((course) => {
			const courseDuration = parseInt(course.duration.split(" ")[0], 10);
			return courseDuration <= parseInt(maxDuration, 10);
		});

		// Sort courses
		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "date-newest":
					return b.id - a.id;
				case "date-oldest":
					return a.id - b.id;
				case "price-low":
					return (
						parseInt(a.price.replace("$", ""), 10) -
						parseInt(b.price.replace("$", ""), 10)
					);
				case "price-high":
					return (
						parseInt(b.price.replace("$", ""), 10) -
						parseInt(a.price.replace("$", ""), 10)
					);
				default:
					return 0;
			}
		});

		setCourses(sorted);
		setPage(1);
		setDisplayedCourses(sorted.slice(0, ITEMS_PER_PAGE));
	}, [selectedCategory, priceRange, maxDuration, sortBy]);

	const handleLoadMore = () => {
		setLoading(true);
		// Simulate API call delay
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

	const hasMore = displayedCourses.length < courses.length;

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
						{categories.map((category) => (
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

					<div className="flex items-center gap-3 flex-wrap">
						<Select value={priceRange} onValueChange={setPriceRange}>
							<SelectTrigger className="w-40 h-9 text-sm">
								<SelectValue placeholder="Price" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="200">Max Price($): 200</SelectItem>
								<SelectItem value="500">Max Price($): 500</SelectItem>
								<SelectItem value="1000">Max Price($): 1000</SelectItem>
							</SelectContent>
						</Select>

						<Select value={maxDuration} onValueChange={setMaxDuration}>
							<SelectTrigger className="w-40 h-9 text-sm">
								<SelectValue placeholder="Duration" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="40">Max Duration: 40 mins</SelectItem>
								<SelectItem value="50">Max Duration: 50 mins</SelectItem>
								<SelectItem value="500">Max Duration: 500 mins</SelectItem>
							</SelectContent>
						</Select>

						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-56 h-9 text-sm">
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
									layout: {
										duration: 0.4,
										ease: "easeInOut",
									},
									opacity: { duration: 0.3 },
									scale: { duration: 0.3 },
								}}
							>
								<div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border border-gray-100">
									{/* Course Image */}
									<div
										className="h-52 relative"
										style={{ background: course.bgColor }}
									>
										<div className="absolute top-3 left-3">
											<div className="text-xs font-medium text-white/90 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
												{course.category}
											</div>
										</div>
									</div>

									{/* Course Content */}
									<div className="p-5 flex-1 flex flex-col">
										<div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
											{course.category}
										</div>

										<h3 className="text-lg font-bold text-gray-900 mb-2">
											{course.title}
										</h3>

										<p className="text-sm text-gray-600 mb-4 flex-1 leading-relaxed">
											{course.description}
										</p>

										{/* Course Meta */}
										<div className="space-y-3">
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-600">
													Duration: {course.duration}
												</span>
												<span className="text-xl font-bold text-[#0891b2]">
													{course.price}
												</span>
											</div>

											<div className="flex items-center justify-between pt-3 border-t border-gray-100">
												<div className="flex items-center gap-1.5 text-sm text-gray-600">
													<Users className="w-4 h-4" />
													<span>{course.students} Students</span>
												</div>

												<div className="flex items-center gap-1.5">
													<div className="flex">
														{[...Array(5)].map((_, i) => (
															<Star
																key={`star-${course.id}-${i}`}
																className={`w-4 h-4 ${
																	i < Math.floor(course.rating)
																		? "fill-yellow-400 text-yellow-400"
																		: "fill-gray-200 text-gray-200"
																}`}
															/>
														))}
													</div>
													<span className="text-sm text-gray-600">
														({course.reviews})
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
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
