// "use client"
// import { coursesData } from "@/data/course-data"
// import CourseHeader from "./courseHeader"
// import { LearningOutcomes } from "./courseOutcome"
// import { CourseContent } from "./courseContent"
// import { CourseIncludes } from "./courseInclude"
// import CourseTopics from "./courseTopics"
// interface CourseDetailsSectionProps {
//   courseId: number
// }

// export default function CourseDetailsSection({ courseId }: CourseDetailsSectionProps) {
// const course = coursesData.find(c => c.id === courseId) || coursesData[0]
// return (
// <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left column - Main content */}
//         <div className="lg:col-span-2 space-y-8">
//           <CourseHeader course={courseId} />
//           <LearningOutcomes />
//           <CourseContent />
//           <CourseTopics course={courseId} />
//         </div>

//         {/* Right column - Sidebar */}
//         <div className="space-y-8">
//           <CourseIncludes />

//           {/* Pricing Card */}
//           <div className="border rounded-xl overflow-hidden shadow-lg">
//             <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
//               <h3 className="text-2xl font-bold">Premium Access</h3>
//               <p className="text-blue-100 mt-2">Get full access to this course and all premium features</p>
//             </div>
//             <div className="p-6 bg-white dark:bg-gray-900">
//               <div className="flex items-baseline mb-4">
//                 <span className="text-3xl font-bold">${course.price}</span>
//                 <span className="text-gray-500 ml-2">one-time payment</span>
//               </div>

//               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 mb-4">
//                 Enroll Now
//               </button>

//               <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
//                 30-day money-back guarantee
//               </p>

//               <div className="space-y-3">
//                 <div className="flex items-center text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                   <span>Full lifetime access</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                   <span>Certificate of completion</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
//                   <span>Access on mobile and TV</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Instructor Card */}
//           <div className="border rounded-xl p-6 shadow-sm">
//             <h3 className="text-xl font-bold mb-4">Instructor</h3>
//             <div className="flex items-center mb-4">
//               <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mr-4"></div>
//               <div>
//                 <h4 className="font-semibold">Expert Instructor</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Data Science Specialist</p>
//               </div>
//             </div>
//             <p className="text-sm text-gray-700 dark:text-gray-300">
//               With over 10 years of experience in data science and AI product management, our instructor brings real-world expertise to this course.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client";

import { useRouter } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { coursesData } from "@/data/course-data";
import { CourseContent } from "./courseContent";
import CourseHeader from "./courseHeader";
import { CourseIncludes } from "./courseInclude";
import { LearningOutcomes } from "./courseOutcome";
import CourseTopics from "./courseTopics";
import { DiscussionBoard } from "./discussionBoard";

interface CourseDetailsSectionProps {
	courseId: string;
}

export default function CourseDetailsSection({
	courseId,
}: CourseDetailsSectionProps) {
	const router = useRouter();
	const [course, setCourse] = useState<any>(null);

	useEffect(() => {
		const found = coursesData.find((c) => String(c.id) === String(courseId));
		setCourse(found);
	}, [courseId]);

	const handleEnroll = () => {
		if (course) {
			router.navigate({ to: `/course/${courseId}/checkout` });
		}
	};

	// Show loading state or fallback if course not found
	if (!course) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-lg text-muted-foreground">
						Loading course details...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section with Gradient Background */}
			<div
				className="relative h-96 md:h-[500px] flex items-center justify-center text-white overflow-hidden"
				style={{ background: course.image }}
			>
				<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
				<div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
					<Badge className="mb-4 text-lg px-4 py-1">{course.category}</Badge>
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
						{course.title}
					</h1>
					<p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto mb-8 leading-relaxed">
						{course.description}
					</p>
					<div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
						<span className="bg-white/20 backdrop-blur px-5 py-2 rounded-full">
							{course.duration}
						</span>
						<span className="bg-white/20 backdrop-blur px-5 py-2 rounded-full">
							{course.daily} Daily
						</span>
						<span className="bg-white/20 backdrop-blur px-5 py-2 rounded-full flex items-center gap-2">
							<Star className="h-4 w-4 fill-yellow-400" />
							{course.rating} Rating
						</span>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-8 lg:pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Main Content */}
					<div className="lg:col-span-2 space-y-4">
						<CourseHeader course={course} />
						<CourseIncludes />
						<CourseTopics course={course} />
						<LearningOutcomes />
						<CourseContent />
					</div>

					{/* Right Column - Sticky Sidebar */}
					<div className="space-y-6 pt-2 lg:pt-20">
						<div className="sticky top-5 gap-6">
							{/* Sticky Enrollment Card */}
							<Card className="shadow-md border-0 overflow-hidden mb-4">
								<div className="bg-primary text-gray-700 p-6">
									<div className="text-center">
										<p className="text-5xl font-bold">${course.price}</p>
										<p className="text-blue-50 mt-1">
											One-time payment • Lifetime access
										</p>
									</div>
								</div>

								<div className="p-6 space-y-5 bg-card">
									<Button
										size="lg"
										className="w-full text-lg font-semibold"
										onClick={handleEnroll}
									>
										Enroll Now
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>

									<div className="pt-4 border-t space-y-3">
										{[
											"30-Day Money-Back Guarantee",
											"Full lifetime access",
											"Certificate of completion",
											"Access on mobile, tablet & TV",
											"Downloadable resources",
										].map((item) => (
											<div
												key={item}
												className="flex items-center gap-3 text-sm"
											>
												<CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
												<span>{item}</span>
											</div>
										))}
									</div>

									<div className="grid grid-cols-2 gap-4 pt-2 border-t text-center">
										<div>
											<div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-current" : ""}`}
													/>
												))}
											</div>
											<p className="text-2xl font-bold">{course.rating}</p>
											<p className="text-xs text-muted-foreground">
												Course Rating
											</p>
										</div>
										<div>
											<Users className="h-8 w-8 mx-auto text-primary mb-1" />
											<p className="text-2xl font-bold">
												{course.enrolledCount?.toLocaleString()}
											</p>
											<p className="text-xs text-muted-foreground">Students</p>
										</div>
									</div>
								</div>
							</Card>

							{/* Instructor Card */}
							<Card className="p-6 shadow-md ">
								<h3 className="text-xl font-bold mb-4">Your Instructor</h3>
								<div className="flex items-start gap-2">
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0" />
									<div>
										<h4 className="text-lg font-semibold">
											Elite SAT Mentor Team
										</h4>
										<p className="text-sm text-muted-foreground">
											99th Percentile Experts
										</p>
										<p className="mt-1 text-sm leading-relaxed">
											Our instructors have helped thousands of students achieve
											1500+ scores using proven strategies from real test
											experience.
										</p>
										<div className="flex items-center gap-1 mt-4 text-sm">
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4" />
												<span className="text-xs">10,000+ Students</span>
											</div>
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
												<span className="text-xs">4.9 Rating</span>
											</div>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<DiscussionBoard />
		</div>
	);
}
