import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Calendar,
	Clock,
	Loader2,
	Play,
	TrendingUp,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGetStudentEnrolledCourses } from "@/hooks/course-management";

export const Route = createFileRoute("/dashboard/student/my-course/")({
	component: MyCoursesPage,
});

function MyCoursesPage() {
	const { data: courses, isLoading } = useGetStudentEnrolledCourses();
	const navigate = useNavigate();

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	//   const getStatusConfig = (status: string) => {
	//     const configs = {
	//       COMPLETED: {
	//         color: "bg-emerald-50 text-emerald-700 border-emerald-200",
	//         bgColor: "bg-emerald-500",
	//         label: "Completed",
	//       },
	//       ACTIVE: {
	//         color: "bg-blue-50 text-blue-700 border-blue-200",
	//         bgColor: "bg-blue-500",
	//         label: "In Progress",
	//       },
	//       PENDING: {
	//         color: "bg-amber-50 text-amber-700 border-amber-200",
	//         bgColor: "bg-amber-500",
	//         label: "Pending Activation",
	//       },
	//     };
	//     return configs[status as keyof typeof configs] || configs.ACTIVE;
	//   };

	const isLiveClass = (course: any) => {
		const now = new Date();
		const startDate = new Date(course.startDate);
		const endDate = course.endDate ? new Date(course.endDate) : null;
		return startDate <= now && (!endDate || now <= endDate);
	};

	const getNextSchedule = (schedule: any[]) => {
		if (!schedule || !Array.isArray(schedule)) return null;
		// In a real app, calculate next schedule based on current time
		return schedule[0];
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="relative overflow-hidden border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-40"
			>
				<div className="px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
								My Courses
							</h1>
							<p className="text-slate-600 mt-2 text-base">
								{courses?.length} course{courses?.length !== 1 ? "s" : ""} —
								Keep learning and growing
							</p>
						</div>
						{/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate({ to: "/courses" })}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse More Courses
              </Button>
            </motion.div> */}
					</div>
				</div>

				{/* Decorative gradient line */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-transparent" />
			</motion.div>

			{/* Main Content */}
			<div className="px-4 sm:px-6 lg:px-8 py-12">
				{/* Loading State */}
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex items-center justify-center py-24"
					>
						<div className="text-center">
							<Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
							<p className="text-slate-600">Loading your courses...</p>
						</div>
					</motion.div>
				)}

				{/* Empty State */}
				{!isLoading && courses.length === 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Card className="border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50">
							<div className="flex flex-col items-center justify-center py-20 px-6">
								<div className="rounded-full bg-blue-100 p-4 mb-4">
									<BookOpen className="h-8 w-8 text-blue-600" />
								</div>
								<h3 className="text-xl font-semibold text-slate-900 mb-2">
									No Courses Yet
								</h3>
								<p className="text-slate-600 text-center mb-6 max-w-sm">
									Start your learning journey by exploring and enrolling in a
									course that matches your goals.
								</p>
								<Button
									onClick={() => navigate({ to: "/courses" })}
									className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
								>
									<ArrowRight className="w-4 h-4 mr-2" />
									Explore Courses
								</Button>
							</div>
						</Card>
					</motion.div>
				)}

				{/* Course Grid */}
				{!isLoading && courses?.length > 0 && (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
					>
						{courses?.map((course, index) => {
							//   const statusConfig = getStatusConfig(course.);
							const isLive = isLiveClass(course);
							const nextSchedule = getNextSchedule(course.schedule);

							return (
								<motion.div key={course.itemId} variants={itemVariants}>
									<Card
										className="group h-full overflow-hidden border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-white"
										onClick={() =>
											navigate({
												to: `/dashboard/student/my-course/${course.id}`,
											})
										}
									>
										{/* Course Thumbnail */}
										<div className="relative h-72 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
											{course.thumbnail ? (
												<img
													src={course.thumbnail}
													alt={course.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
													<BookOpen className="h-12 w-12 text-blue-200 opacity-50" />
												</div>
											)}

											{/* Status Badge */}
											{/* <div className="absolute top-3 right-3">
                        <Badge className={`${statusConfig.color} border`}>
                          {statusConfig.label}
                        </Badge>
                      </div> */}

											{/* Live Badge */}
											{isLive && (
												<motion.div
													animate={{ scale: [1, 1.05, 1] }}
													transition={{ duration: 2, repeat: Infinity }}
													className="absolute top-3 left-3"
												>
													<div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
														<span className="w-2 h-2 bg-white rounded-full animate-pulse" />
														Live Now
													</div>
												</motion.div>
											)}
										</div>

										{/* Content */}
										<div className="p-5 flex flex-col h-full">
											{/* Title */}
											<h3 className="font-bold text-slate-900 text-lg line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
												{course.title}
											</h3>

											{/* Meta Info */}
											<div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-600">
												{course.level && (
													<div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
														<TrendingUp className="w-3 h-3" />
														{course.level}
													</div>
												)}
												{course.duration && (
													<div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded">
														<Clock className="w-3 h-3" />
														{course.duration} hrs
													</div>
												)}
												{course._count?.enrollments > 0 && (
													<div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
														<Users className="w-3 h-3" />
														{course._count.enrollments}
													</div>
												)}
											</div>

											{/* Schedule Info */}
											{isLive && nextSchedule && (
												<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm">
													<div className="flex items-center gap-2 text-amber-900 font-medium">
														<Calendar className="w-4 h-4" />
														Next Class: {nextSchedule.day}
													</div>
													<div className="text-amber-800 text-xs mt-1">
														{nextSchedule.startTime} - {nextSchedule.endTime}
													</div>
												</div>
											)}

											{/* Progress */}
											<div className="mb-4">
												<div className="flex justify-between items-center mb-2">
													<span className="text-xs font-medium text-slate-700">
														Progress
													</span>
													<span className="text-xs font-bold text-blue-600">
														{course.progress}%
													</span>
												</div>
												<Progress value={course.progress} className="h-2" />
											</div>

											{/* CTA Button */}
											<Button
												className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white mt-auto"
												disabled={course.orderStatus === "PENDING"}
											>
												{isLive ? (
													<>
														<Play className="w-4 h-4 mr-2" />
														Join Live Class
													</>
												) : course.orderStatus === "PENDING" ? (
													"Awaiting Activation"
												) : (
													<>
														<ArrowRight className="w-4 h-4 mr-2" />
														Continue Learning
													</>
												)}
											</Button>
										</div>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				)}
			</div>
		</div>
	);
}
