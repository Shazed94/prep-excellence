// components/courses-grid.tsx

import { Search } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useGetPublishedCourses } from "@/hooks/course-management";
import { CourseCard } from "./course-card";

const categories = [
	"All",
	"Science",
	"Machine learning",
	"Marketing",
	"Technology",
	"Math",
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export function CoursesGrid() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedLevel, setSelectedLevel] = useState("All");

	// const {data} = usecoursecategory

	const { data: publishedCourses } = useGetPublishedCourses();

	const filteredCourses = (publishedCourses?.data || []).filter(
		(course: any) => {
			const matchesSearch =
				course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "All" || course.category === selectedCategory;
			return matchesSearch && matchesCategory;
		},
	);

	console.log("filteredCourses", filteredCourses);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
				<p className="text-muted-foreground">
					Discover your next learning adventure
				</p>
			</div>

			{/* Filters */}
			<Card className="mb-8">
				<CardContent className="pt-6">
					<div className="grid md:grid-cols-4 gap-4">
						{/* Search */}
						<div className="relative md:col-span-2">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search courses..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Category Filter */}
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category} value={category}>
										{category}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Level Filter */}
						<Select value={selectedLevel} onValueChange={setSelectedLevel}>
							<SelectTrigger>
								<SelectValue placeholder="Select level" />
							</SelectTrigger>
							<SelectContent>
								{levels.map((level) => (
									<SelectItem key={level} value={level}>
										{level}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Results Count */}
			<div className="mb-4">
				<p className="text-muted-foreground">
					Showing {filteredCourses.length}{" "}
					{filteredCourses.length === 1 ? "course" : "courses"}
				</p>
			</div>

			{/* Courses Grid */}
			{filteredCourses.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<Search className="h-16 w-16 text-muted-foreground mb-4" />
						<h3 className="text-xl font-semibold mb-2">No courses found</h3>
						<p className="text-muted-foreground">
							Try adjusting your filters or search query
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{filteredCourses.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
				</div>
			)}
		</div>
	);
}
