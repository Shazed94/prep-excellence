// components/course-card.tsx
"use client";

import { Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface CourseCardProps {
	course: {
		id: number;
		title: string;
		description: string;
		duration: string;
		daily: string;
		category: string;
		image: string;
		price?: number;
		rating?: number;
		enrolledCount?: number;
	};
}

export function CourseCard({ course }: CourseCardProps) {
	return (
		<Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
			{/* Course Image */}
			<div className="h-48 relative" style={{ background: course.image }}>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center text-white p-6">
						<h3 className="text-2xl font-bold mb-2">
							{course.title.split(" ")[0]}
						</h3>
						<p className="text-sm opacity-90">{course.category}</p>
					</div>
				</div>
				<Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white">
					{course.category}
				</Badge>
			</div>

			{/* Course Content */}
			<CardHeader className="flex-1">
				<CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
					{course.title}
				</CardTitle>
				<CardDescription className="text-sm text-gray-600 line-clamp-3">
					{course.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Course Meta */}
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-1 text-[#0891b2] font-medium">
						<Clock className="w-4 h-4" />
						<span>{course.duration}</span>
					</div>
					<div className="text-gray-600 font-medium">Daily: {course.daily}</div>
				</div>

				{/* Additional Info */}
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					{course.rating && (
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
							<span>{course.rating.toFixed(1)}</span>
						</div>
					)}
					{course.enrolledCount && (
						<div className="flex items-center gap-1">
							<Users className="h-4 w-4" />
							<span>{course.enrolledCount} enrolled</span>
						</div>
					)}
				</div>

				{/* Price and CTA */}
				<div className="flex items-center justify-between pt-2">
					<div>
						{course.price ? (
							<span className="text-2xl font-bold">${course.price}</span>
						) : (
							<span className="text-lg font-semibold text-green-600">Free</span>
						)}
					</div>
					<a href={`/Course/${course.id}`}>
						<Button className="bg-[#0891b2] hover:bg-[#0e7490]">
							View Details
						</Button>
					</a>
				</div>
			</CardContent>
		</Card>
	);
}
