"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCard } from "../course/course-card";
import { Button } from "../ui/button";

const coursesData = [
	{
		id: 1,
		title: "SAT 1500+ Elite Coaching",
		description:
			"Focused on advanced strategies for top-tier scores. Master the challenges.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "https://picsum.photos/seed/picsum/200/300 ",
	},
	{
		id: 2,
		title: "Digital SAT Essentials",
		description:
			"Comprehensive coverage of all test sections and foundational concepts.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "https://picsum.photos/seed/picsum/200/300 ",
	},
	{
		id: 3,
		title: "The Math Matrix",
		description:
			"Go beyond the basics with intensive focus on the core mathematics.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "https://picsum.photos/seed/picsum/200/300 ",
	},
	{
		id: 4,
		title: "Reading & Writing",
		description: "Develop critical reading skills and a precise understanding.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Science",
		image: "https://picsum.photos/seed/picsum/200/300 ",
	},
];

const categories = [
	"All",
	"Science",
	"Machine Learning",
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

	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const getFilteredCourses = (category: string) => {
		return category === "All"
			? coursesData
			: coursesData.filter((course) => course.category === category);
	};

	const scrollPrev = () => emblaApi?.scrollPrev();
	const scrollNext = () => emblaApi?.scrollNext();

	useEffect(() => {
		if (!emblaApi) return;

		const updateButtons = () => {
			setCanScrollPrev(emblaApi.canScrollPrev());
			setCanScrollNext(emblaApi.canScrollNext());
		};

		updateButtons();
		emblaApi.on("select", updateButtons);
		emblaApi.on("reInit", updateButtons);

		return () => {
			emblaApi.off("select", updateButtons);
			emblaApi.off("reInit", updateButtons);
		};
	}, [emblaApi]);

	// Reset carousel when category changes
	useEffect(() => {
		if (emblaApi) {
			emblaApi.reInit();
		}
	}, [emblaApi]);

	return (
		<section className=" py-8 md:py-20 px-4 bg-[#D9E6ED66]">
			<div className="max-w-7xl mx-auto">
				{/* Heading */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl font-bold text-gray-900">Upcoming Courses</h2>
					<p className="text-gray-600 max-w-3xl mx-auto mt-3">
						Explore our comprehensive catalog of upcoming courses.
					</p>
				</motion.div>

				{/* Tabs */}
				<Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="flex justify-center mb-12 w-full"
					>
						<LayoutGroup>
							<TabsList className="flex gap-2 sm:gap-3 flex-wrap bg-transparent justify-center items-center w-full max-w-4xl mx-auto px-2">
								{categories.map((cat, index) => (
									<motion.div
										key={cat}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
										layout
									>
										<TabsTrigger
											value={cat}
											className="relative px-4 py-1.5 sm:px-6 sm:py-1.5 border rounded-md border-[#0086c5] transition-all duration-300 hover:bg-[#0086c5]/10 data-[state=active]:bg-[#0086c5] data-[state=active]:text-white data-[state=active]:shadow-lg text-sm sm:text-base whitespace-nowrap"
										>
											{selectedCategory === cat && (
												<motion.div
													layoutId="activeTab"
													className="absolute inset-0 bg-[#0086c5] rounded-md -z-10"
													transition={{
														type: "spring",
														bounce: 0.01,
														duration: 0.4,
													}}
												/>
											)}
											<span className="relative z-10">{cat}</span>
										</TabsTrigger>
									</motion.div>
								))}
							</TabsList>
						</LayoutGroup>
					</motion.div>

					{/* Tab Contents */}
					{categories.map((category) => (
						<TabsContent key={category} value={category} className="mt-0">
							<AnimatePresence mode="popLayout">
								<div key={category} className="relative">
									<div className="overflow-hidden" ref={emblaRef}>
										<motion.div className="flex gap-6 sm:gap-6" layout>
											{getFilteredCourses(category).map((course, index) => (
												<motion.div
													key={course.id}
													initial={{ opacity: 0, scale: 0.9 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.9 }}
													transition={{ duration: 0.4, delay: index * 0.1 }}
													layout
													className="flex-[0_0_calc(100%-16px)] sm:flex-[0_0_calc(50%-16px)] md:flex-[0_0_calc(33.33%-16px)] lg:flex-[0_0_calc(25%-16px)] shrink-0 min-w-0"
												>
													<CourseCard course={course} />
												</motion.div>
											))}
										</motion.div>
									</div>

									{/* Arrows */}
									<AnimatePresence>
										{canScrollPrev && (
											<motion.div
												initial={{ opacity: 0, x: 20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: 20 }}
												transition={{ duration: 0.3 }}
												className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10"
											>
												<Button
													className=" shadow-lg rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-50 transition-colors p-0"
													onClick={scrollPrev}
												>
													<ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
												</Button>
											</motion.div>
										)}

										{canScrollNext && (
											<motion.div
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: -20 }}
												transition={{ duration: 0.3 }}
												className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10"
											>
												<Button
													className=" shadow-lg rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-50 transition-colors p-0"
													onClick={scrollNext}
												>
													<ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
												</Button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</AnimatePresence>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
}
