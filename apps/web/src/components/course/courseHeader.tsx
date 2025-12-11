import { Clock, Globe, StarIcon, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CourseHeaderProps {
	course: any;
}

export default function CourseHeader({ course }: CourseHeaderProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-4 pt-20">
				<div className="flex items-center gap-3">
					<span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
						{course.category}
					</span>
					<span className="text-sm text-muted-foreground">
						{course.duration} • {course.daily} daily
					</span>
				</div>

				<div className="flex flex-wrap items-center gap-4 text-sm">
					<div className="flex items-center gap-1.5">
						<Clock className="h-4 w-4" />
						<span>Last updated 12/2025</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Globe className="h-4 w-4" />
						<span>English + Auto CC</span>
					</div>
				</div>
			</div>

			<Card className="overflow-hidden border-2">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
					<div className="flex items-center gap-8">
						<div className="text-center">
							<div className="text-3xl font-bold">{course.rating}</div>
							<div className="flex items-center justify-center gap-1 text-amber-500 my-1">
								{[...Array(5)].map((_, i) => (
									<StarIcon
										className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-current" : ""}`}
									/>
								))}
							</div>
							<p className="text-xs text-muted-foreground">Student Rating</p>
						</div>

						<div className="flex items-center gap-3">
							<Users className="h-8 w-8 text-primary" />
							<div>
								<div className="text-2xl font-bold">
									{course.enrolledCount.toLocaleString()}
								</div>
								<div className="text-sm text-muted-foreground">
									Students Enrolled
								</div>
							</div>
						</div>
					</div>

					<div className="bg-primary/10 rounded-lg p-4 text-center">
						<p className="text-xs font-medium text-primary">Bestseller</p>
						<p className="text-xs text-muted-foreground">
							Top in {course.category}
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
