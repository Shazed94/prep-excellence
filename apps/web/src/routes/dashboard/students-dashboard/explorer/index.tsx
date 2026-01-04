"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/students-dashboard/explorer/")(
	{
		component: ExplorerPage,
	},
);

function ExplorerPage() {
	const courses = [
		{
			id: "1",
			title: "SAT Math Mastery",
			level: "Intermediate",
			duration: "6 Weeks",
			tag: "Popular",
		},
		{
			id: "2",
			title: "SAT Reading & Writing",
			level: "Beginner",
			duration: "4 Weeks",
			tag: "Recommended",
		},
		{
			id: "3",
			title: "Full-Length Practice Tests",
			level: "Advanced",
			duration: "10 Tests",
			tag: "New",
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Explore Learning</h1>
				<p className="text-muted-foreground">
					Discover courses and practice resources tailored for you
				</p>
			</div>

			{/* Explorer Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{courses.map((course) => (
					<Card key={course.id} className="hover:shadow-md transition">
						<CardHeader>
							<div className="flex justify-between items-center">
								<CardTitle className="text-lg">{course.title}</CardTitle>
								<Badge variant="secondary">{course.tag}</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<p className="text-sm text-muted-foreground">
								Level: {course.level}
							</p>
							<p className="text-sm text-muted-foreground">
								Duration: {course.duration}
							</p>
							<Button className="w-full">View Details</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
