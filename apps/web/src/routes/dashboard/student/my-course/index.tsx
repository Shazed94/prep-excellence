"use client";

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard/student/my-course/")({
	component: MyCoursePage,
});

function MyCoursePage() {
	const myCourses = [
		{
			id: "1",
			title: "SAT Math Mastery",
			progress: 72,
		},
		{
			id: "2",
			title: "SAT Reading & Writing",
			progress: 45,
		},
	];

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">My Courses</h1>
				<p className="text-muted-foreground">Continue where you left off</p>
			</div>

			{/* Course List */}
			<div className="space-y-4">
				{myCourses.map((course) => (
					<Card key={course.id}>
						<CardHeader>
							<CardTitle>{course.title}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<Progress value={course.progress} />
							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground">
									{course.progress}% completed
								</span>
								<Button size="sm">Resume</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
