"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
		image: "/courses/sat-elite.jpg",
	},
	{
		id: 2,
		title: "Digital SAT Essentials",
		description:
			"Comprehensive coverage of all test sections and foundational concepts.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "/courses/digital-sat.jpg",
	},
	{
		id: 3,
		title: "The Math Matrix",
		description:
			"Go beyond the basics with intensive focus on the core mathematics.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Math",
		image: "/courses/math-matrix.jpg",
	},
	{
		id: 4,
		title: "Reading & Writing",
		description: "Develop critical reading skills and a precise understanding.",
		duration: "1 month",
		daily: "3 Hours",
		category: "Science",
		image: "/courses/reading-writing.jpg",
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

	const filteredCourses =
		selectedCategory === "All"
			? coursesData
			: coursesData.filter((course) => course.category === selectedCategory);

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
	}, [emblaApi]);

	return (
		<section className="py-20 px-4 bg-[#D9E6ED66]">
			<div className="max-w-7xl mx-auto">
				{/* Heading */}
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-900">Upcoming Courses</h2>
					<p className="text-gray-600 max-w-3xl mx-auto mt-3">
						Explore our comprehensive catalog of upcoming courses.
					</p>
				</div>

				{/* Tabs */}
				<div className="flex flex-wrap justify-center gap-3 mb-12">
					<Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
						<TabsList className="flex gap-3 flex-wrap bg-transparent">
							{categories.map((cat) => (
								<TabsTrigger
									key={cat}
									value={cat}
									className="px-6 py-4 border rounded-md border-[#0086c5] data-[state=active]:bg-[#0086c5] data-[state=active]:text-white"
								>
									{cat}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>

				{/* Carousel */}
				<div className="relative">
					<div className="overflow-hidden" ref={emblaRef}>
						<div className="flex gap-6">
							{filteredCourses.map((course) => (
								<div
									key={course.id}
									className="flex-[0_0_calc(25%-12px)] md:flex-[0_0_calc(33.33%-12px)] sm:flex-[0_0_calc(50%-12px)] shrink-0"
								>
									<CourseCard course={course} />
								</div>
							))}
						</div>
					</div>

					{/* Arrows */}
					{canScrollPrev && (
						<Button
							className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center"
							onClick={scrollPrev}
						>
							<ChevronLeft />
						</Button>
					)}

					{canScrollNext && (
						<Button
							className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center"
							onClick={scrollNext}
						>
							<ChevronRight />
						</Button>
					)}
				</div>
			</div>
		</section>
	);
}
