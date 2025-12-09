import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function CourseCard({
	course,
}: {
	course: { id: number; image: string };
}) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="p-6">
				<div className="grid grid-cols-[1fr_1fr_1fr] gap-6 items-start">
					{/* Left Section - Course Info */}
					<div className="space-y-2">
						<div>
							<h3 className="text-xs font-bold text-blue-500 mb-1">
								SAT PREMIUM STRATEGIES PREP
							</h3>
							<p className="text-[10px] text-gray-500">Designed by Dr. Amen</p>
						</div>

						<p className="text-[11px] text-gray-600 leading-relaxed">
							Master advanced SAT strategies through a structured,
							results-driven course built to boost confidence, accuracy, and
							speed.
						</p>

						<div className="flex items-center gap-1">
							<span className="text-[10px] text-gray-600">
								Instructor Rating:
							</span>
							<div className="flex items-center">
								{[...Array(4)].map((_, i) => (
									<Star
										key={i}
										className="w-3 h-3 fill-amber-400 text-amber-400"
									/>
								))}
								<Star className="w-3 h-3 fill-amber-400 text-amber-400" />
							</div>
						</div>
					</div>

					{/* Middle Section - Instructor & Schedule */}
					<div className="flex gap-4 h-full ">
						<div className="w-[140px] h-full shrink-0">
							<img
								src={course.image}
								alt="Instructor"
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="flex flex-1 flex-col justify-center items-center space-y-1 bg-[#0086C512]">
							<h4 className="text-xl font-bold text-primary-dark">
								10th Nov – 10th Jan
							</h4>
							<div className="text-[11px] text-accent space-y-0">
								<p>6:00 PM – 9:00 PM EST</p>
								<p>6:00 PM – 9:00 PM EST</p>
								<p>6:00 PM – 9:00 PM EST</p>
							</div>
							<p className="text-xs font-semibold text-gray-700 pt-1">
								Monday & Tuesday
							</p>
						</div>
					</div>

					{/* Right Section - Price & CTA */}
					<div className="flex flex-col items-end space-y-3">
						<div className="text-4xl font-bold text-orange-500">$499</div>

						<Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-5">
							Register Course
						</Button>

						<div className="w-full space-y-2">
							<div className="flex items-center justify-between  rounded ">
								<span className="bg-secondary text-[17px] px-2 py-0.5 min-w-max">
									Target SAT: Oct 1 – 31, 2025
								</span>
								<span className="font-semibold text-[18px] min-w-max">
									2 Tests
								</span>
							</div>

							<div className="flex items-center justify-between text-xs">
								<span className="text-orange-500 font-semibold">4 Classes</span>
								<span className="text-blue-500 font-semibold">
									3 hours per class
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default function SATLiveClasslistSection() {
	const [visibleCourses, setVisibleCourses] = useState(6);

	const courses = [
		{
			id: 1,
			image:
				"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
		},
		{
			id: 2,
			image:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
		},
		{
			id: 3,
			image:
				"https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop",
		},
		{
			id: 4,
			image:
				"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
		},
		{
			id: 5,
			image:
				"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
		},
		{
			id: 6,
			image:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
		},
		{
			id: 7,
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
		},
		{
			id: 8,
			image:
				"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
		},
		{
			id: 9,
			image:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
		},
		{
			id: 10,
			image:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
		},
	];

	const handleLoadMore = () => {
		setVisibleCourses((prev) => Math.min(prev + 3, courses.length));
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="space-y-4">
					{courses.slice(0, visibleCourses).map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>

				{visibleCourses < courses.length && (
					<div className="flex justify-center mt-6">
						<Button
							onClick={handleLoadMore}
							className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-5 text-sm font-semibold"
						>
							Load More
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
