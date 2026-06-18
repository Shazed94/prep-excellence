import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetMyOrders } from "@/hooks/order";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/student/my-course/")({
	component: MyCoursePage,
});

function MyCoursePage() {
	const { data: orders, isLoading } = useGetMyOrders();

	// Flatten orders to get all courses
	const allCourses =
		orders?.flatMap((order) =>
			order.items.map((item) => ({
				id: item.courseId,
				itemId: item.id,
				title: item.course.title,
				unitPrice: item.unitPrice,
				orderStatus: order.status,
				progress: 0, // Default progress - update based on your actual data
			})),
		) || [];

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "COMPLETED":
				return "default";
			case "PENDING":
				return "secondary";
			case "ACTIVE":
				return "default";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">My Courses</h1>
				<p className="text-muted-foreground">Continue where you left off</p>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}

			{/* Empty State */}
			{!isLoading && allCourses.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<p className="text-muted-foreground mb-4">No courses yet</p>
						<Button>Browse Courses</Button>
					</CardContent>
				</Card>
			)}

			{/* Course List */}
			{!isLoading && allCourses.length > 0 && (
				<div className="space-y-4">
					{allCourses.map((course) => (
						<Card
							key={course.itemId}
							className="hover:shadow-md transition-shadow"
						>
							<CardHeader className="flex flex-row items-start justify-between space-y-0">
								<div className="flex-1">
									<CardTitle className="text-xl">{course.title}</CardTitle>
								</div>
								<Badge variant={getStatusBadgeVariant(course.orderStatus)}>
									{course.orderStatus}
								</Badge>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm text-muted-foreground">
											Progress
										</span>
										<span className="text-sm font-medium">
											{course.progress}% completed
										</span>
									</div>
									<Progress value={course.progress} className="h-2" />
								</div>

								<div className="flex justify-between items-center pt-2">
									<span className="text-sm text-muted-foreground">
										Price: ${course.unitPrice}
									</span>
									<Button size="sm" disabled={course.orderStatus === "PENDING"}>
										{course.orderStatus === "PENDING"
											? "Awaiting Activation"
											: "Resume"}
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
