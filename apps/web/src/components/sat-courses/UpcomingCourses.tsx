import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const coursesData = [
	{
		id: 1,
		title: "SAT 1500+ Elite Coaching",
		description:
			"Focused on advanced strategies for top-tier scores. Master the challenges.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #a8b5a0 0%, #c9d4c1 100%)",
	},
	{
		id: 2,
		title: "Digital SAT Essentials",
		description:
			"Comprehensive coverage of all test sections and foundational concepts.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #d4d8e8 0%, #e8eaf6 100%)",
	},
	{
		id: 3,
		title: "The Math Matrix",
		description:
			"Go beyond the basics with intensive focus on the core mathematics.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #4a9b8e 0%, #6fb5a8 100%)",
	},
	{
		id: 4,
		title: "Reading & Writing",
		description: "Develop critical reading skills and a precise understanding.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Science",
		image: "linear-gradient(135deg, #2980b9 0%, #3d9ed9 100%)",
	},
	{
		id: 5,
		title: "Adaptive 1550+ Mastery Cohort",
		description:
			"Focused on advanced strategies for top-tier scores. Master the challenges.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Technology",
		image: "linear-gradient(135deg, #34495e 0%, #5d6d7e 100%)",
	},
	{
		id: 6,
		title: "Digital SAT Strategy Sprint",
		description:
			"Comprehensive coverage of all test sections and foundational concepts.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Science",
		image: "linear-gradient(135deg, #1e8b7e 0%, #2ca896 100%)",
	},
	{
		id: 7,
		title: "Math Conqueror Workshop",
		description:
			"Go beyond the basics with intensive focus on the core mathematics.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
	},
	{
		id: 8,
		title: "Reading & Rhetoric Accelerator",
		description: "Develop critical reading skills and a precise understanding.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Machine learning",
		image: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
	},
];

const categories = [
	"All",
	"Science",
	"Machine learning",
	"Marketing",
	"Technology",
	"Math",
];

export default function UpcomingCoursesSection() {
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		containScroll: "trimSnaps",
		slidesToScroll: 1,
	});

	const filteredCourses =
		selectedCategory === "All"
			? coursesData
			: coursesData.filter((course) => course.category === selectedCategory);

	const scrollPrev = React.useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = React.useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	return (
		<section className="py-16 px-4 bg-[#FAFAFA]">
			<div className="container mx-auto max-w-7xl">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Upcoming Courses
					</h2>
					<p className="text-gray-600 max-w-3xl mx-auto text-base">
						Explore our comprehensive catalog of upcoming courses, designed to
						equip you with the most in-demand skills across technology, science,
						and business.
					</p>
				</div>

				{/* Category Tabs */}
				<div className="flex justify-center">
					<Tabs
						value={selectedCategory}
						onValueChange={setSelectedCategory}
						className="w-auto"
					>
						<TabsList className="bg-transparent gap-[10px]">
							{categories.map((category) => (
								<TabsTrigger
									key={category}
									value={category}
									className="data-[state=active]:bg-[#0891b2] data-[state=active]:text-white text-base font-normal  px-6 py-4 rounded-md transition-all border-primary-dark"
								>
									{category}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{/* Carousel Container */}
				<div className="relative ">
					<div className="overflow-hidden" ref={emblaRef}>
						<div className="flex gap-6 h-[500px] py-12">
							<AnimatePresence mode="sync">
								{filteredCourses.map((course) => (
									<motion.div
										key={course.id}
										layout
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{
											layout: { duration: 0.3 },
											opacity: { duration: 0.3 },
											scale: { duration: 0.3 },
										}}
										className="flex-[0_0_calc(25%-18px)] min-w-0"
									>
										<div className="bg-white rounded-md shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
											{/* Course Image */}
											<div
												className="h-48 relative"
												style={{ background: course.image }}
											>
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="text-center text-white p-6">
														<h3 className="text-2xl font-bold mb-2">
															{course.title.split(" ")[0]}
														</h3>
														<p className="text-sm opacity-90">
															{course.category}
														</p>
													</div>
												</div>
											</div>

											{/* Course Content */}
											<div className="p-6 flex-1 flex flex-col">
												<h3 className="text-lg font-bold text-gray-900 mb-3">
													{course.title}
												</h3>
												<p className="text-sm text-gray-600 mb-4 flex-1">
													{course.description}
												</p>

												{/* Course Meta */}
												<div className="flex items-center justify-between text-sm">
													<div className="flex items-center gap-1 text-[#0891b2] font-medium">
														<Clock className="w-4 h-4" />
														<span>Duration: {course.duration}</span>
													</div>
													<div className="text-gray-600 font-medium">
														Daily: {course.daily}
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>
					{/* Navigation Buttons */}
					<button
						type="button"
						onClick={scrollPrev}
						className="absolute right-10 bottom-2  w-8 h-8 rounded-md bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
						aria-label="Previous"
					>
						<ChevronLeft className="w-6 h-6 text-gray-700" />
					</button>
					<button
						type="button"
						onClick={scrollNext}
						className="absolute right-0 bottom-2 w-8 h-8 rounded-md bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
						aria-label="Next"
					>
						<ChevronRight className="w-6 h-6 text-gray-700" />
					</button>
				</div>
			</div>
		</section>
	);
}
