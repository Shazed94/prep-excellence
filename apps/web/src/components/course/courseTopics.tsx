import { Badge } from "@/components/ui/badge";

interface CourseTopicsProps {
	course: any;
}

export default function CourseTopics({ course }: CourseTopicsProps) {
	const topics = [
		course.category,
		"Test Prep",
		"Exam Strategy",
		"High-Score Techniques",
	];

	return (
		<div className="py-10">
			<h2 className="text-2xl font-bold mb-6">Explore related topics</h2>
			<div className="flex flex-wrap gap-3">
				{topics.map((topic) => (
					<Badge
						key={topic}
						variant="secondary"
						className="px-5 py-2 text-sm font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
					>
						{topic}
					</Badge>
				))}
			</div>
		</div>
	);
}
