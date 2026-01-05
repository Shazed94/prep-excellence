"use client";

import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

interface CourseCardProps {
	course: {
		id: number;
		title: string;
		description: string;
		duration: string;
		daily: string;
		category: string;
		image: string; // full URL or /public/ img path
	};
}

export function CourseCard({ course }: CourseCardProps) {
	return (
		<Link to={`/course/${course.id}` as "/"}>
			<div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border">
				{/* Top Image */}
				<div className="h-44 w-full overflow-hidden">
					<img
						src={course.image}
						alt={course.title}
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Content */}
				<div className="p-4 space-y-2">
					<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
						{course.title}
					</h3>

					<p className="text-sm text-gray-600 line-clamp-2">
						{course.description}
					</p>

					{/* Duration + Daily */}
					<div className="flex items-center justify-between pt-2 text-sm font-medium text-gray-700">
						<span className="flex items-center gap-1">
							<Clock className="w-4 h-4 text-[#0891b2]" />
							Duration: {course.duration}
						</span>

						<span className="text-gray-600">Daily: {course.daily}</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
