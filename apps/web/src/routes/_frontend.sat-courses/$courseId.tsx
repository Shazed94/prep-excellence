import { createFileRoute } from "@tanstack/react-router";
import CourseBanner from "@/components/sat-courses/singleCourse/CourseBanner";
import SATCoursePage from "@/components/sat-courses/singleCourse/Details";
// Import shadcn/ui Tabs

export const Route = createFileRoute("/_frontend/sat-courses/$courseId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<CourseBanner />
			<div>
				<SATCoursePage />
			</div>
		</div>
	);
}

// import type { LMSCourseResponse } from "@prepexcellence/shared-validators";
// import { createFileRoute, useParams } from "@tanstack/react-router";
// import { Award, BookOpen, Clock, PlayCircle, Star, Users } from "lucide-react";
// import { CourseContent } from "@/components/course/courseContent";
// import CourseBanner, {
// 	type Course,
// } from "@/components/sat-courses/singleCourse/CourseBanner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useGetCourse } from "@/hooks/lms-course";

// export const Route = createFileRoute("/_frontend/sat-courses/$courseId")({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	const { courseId } = useParams({ from: "/_frontend/sat-courses/$courseId" });
// 	const { data: course, isLoading, error } = useGetCourse(courseId);

// 	if (isLoading) {
// 		return (
// 			<div className="container mx-auto px-4 py-20 text-center">
// 				<p className="text-gray-600">Loading course...</p>
// 			</div>
// 		);
// 	}

// 	if (error || !course) {
// 		return (
// 			<div className="container mx-auto px-4 py-20 text-center">
// 				<p className="text-red-600">Failed to load course</p>
// 			</div>
// 		);
// 	}

// 	// Type assertion to ensure course matches Course interface
// 	const typedCourse = course as LMSCourseResponse & Course;

// 	return (
// 		<div className="min-h-screen bg-gray-50">
// 			<CourseBanner course={typedCourse} />

// 			<div className="container mx-auto px-4 sm:px-6 lg:px-20 py-6">
// 				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
// 					{/* Main Content - Left 2/3 */}
// 					<div className="lg:col-span-2 space-y-6 md:space-y-8">
// 						{/* Hero Image */}
// 						<div className="w-1/2 mx-auto xl:-mt-40">
// 							<img
// 								src={typedCourse.thumbnail || "/sat-courses/hero.png"}
// 								alt={typedCourse.title}
// 								className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-md"
// 							/>
// 						</div>

// 						{/* Mobile Sidebar Content - Shows only on mobile */}
// 						<div className="lg:hidden space-y-4">
// 							{/* Course Features Card */}
// 							<div className="bg-white rounded-xl shadow-md border p-5">
// 								<h3 className="text-lg font-bold mb-4">Course Features</h3>
// 								<div className="grid grid-cols-2 gap-4">
// 									<div className="flex items-center gap-2">
// 										<PlayCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 										<span className="text-xs sm:text-sm">Video Lessons</span>
// 									</div>
// 									<div className="flex items-center gap-2">
// 										<BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 										<span className="text-xs sm:text-sm">Assignments</span>
// 									</div>
// 									<div className="flex items-center gap-2">
// 										<Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 										<span className="text-xs sm:text-sm">
// 											{typedCourse._count?.enrollments || 0} Students
// 										</span>
// 									</div>
// 									<div className="flex items-center gap-2">
// 										<Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 										<span className="text-xs sm:text-sm">
// 											{typedCourse.duration} Months
// 										</span>
// 									</div>
// 									<div className="flex items-center gap-2 col-span-2">
// 										<Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 										<span className="text-xs sm:text-sm">
// 											Certificate Included
// 										</span>
// 									</div>
// 								</div>
// 							</div>

// 							{/* Price Card Mobile */}
// 							<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border p-5">
// 								<div className="mb-4">
// 									{typedCourse.discount &&
// 									parseFloat(typedCourse.discount) > 0 ? (
// 										<>
// 											<div className="flex items-baseline gap-3 mb-2">
// 												<span className="text-3xl font-bold text-gray-900">
// 													$
// 													{(
// 														parseFloat(typedCourse.price) *
// 														(1 - parseFloat(typedCourse.discount) / 100)
// 													).toFixed(2)}
// 												</span>
// 												<span className="text-lg text-gray-500 line-through">
// 													${parseFloat(typedCourse.price).toFixed(2)}
// 												</span>
// 											</div>
// 											<span className="inline-block text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
// 												Save {typedCourse.discount}%
// 											</span>
// 										</>
// 									) : (
// 										<span className="text-3xl font-bold text-gray-900">
// 											${parseFloat(typedCourse.price).toFixed(2)}
// 										</span>
// 									)}
// 								</div>
// 							</div>
// 						</div>

// 						{/* Tabs */}
// 						<Tabs defaultValue="description" className="w-full">
// 							<TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-gray-50 border rounded-md h-auto p-1 gap-1">
// 								<TabsTrigger
// 									value="description"
// 									className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm py-2"
// 								>
// 									Description
// 								</TabsTrigger>
// 								<TabsTrigger
// 									value="content"
// 									className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm py-2"
// 								>
// 									Content
// 								</TabsTrigger>
// 								<TabsTrigger
// 									value="notice"
// 									className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm py-2"
// 								>
// 									Notice
// 								</TabsTrigger>
// 								<TabsTrigger
// 									value="faq"
// 									className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm py-2"
// 								>
// 									FAQ
// 								</TabsTrigger>
// 								<TabsTrigger
// 									value="review"
// 									className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm py-2"
// 								>
// 									Review
// 								</TabsTrigger>
// 							</TabsList>

// 							{/* Description Tab */}
// 							<TabsContent
// 								value="description"
// 								className="mt-6 focus-visible:outline-none"
// 							>
// 								<h2 className="text-xl md:text-2xl font-bold mb-4">
// 									{typedCourse.title}
// 								</h2>
// 								{/* biome-ignore lint/security/noDangerouslySetInnerHtml: Trusted content from backend */}
// 								<div
// 									className="text-gray-700 leading-relaxed prose prose-sm sm:prose max-w-none"
// 									dangerouslySetInnerHTML={{ __html: typedCourse.description }}
// 								/>

// 								{typedCourse.whatYouLearn &&
// 									typedCourse.whatYouLearn.length > 0 && (
// 										<div className="mt-6 md:mt-8 bg-blue-50 rounded-lg p-4 md:p-6">
// 											<h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
// 												What You'll Learn
// 											</h3>
// 											<ul className="space-y-2 md:space-y-3">
// 												{typedCourse.whatYouLearn.map((item, idx) => (
// 													<li
// 														key={idx}
// 														className="flex items-start gap-2 text-sm md:text-base text-gray-700"
// 													>
// 														<span className="text-blue-600 mt-1 flex-shrink-0">
// 															✓
// 														</span>
// 														<span>{item}</span>
// 													</li>
// 												))}
// 											</ul>
// 										</div>
// 									)}

// 								{typedCourse.requirements &&
// 									typedCourse.requirements.length > 0 && (
// 										<div className="mt-6 md:mt-8">
// 											<h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
// 												Requirements
// 											</h3>
// 											<ul className="space-y-2 bg-gray-50 rounded-lg p-4 md:p-6">
// 												{typedCourse.requirements.map((item, idx) => (
// 													<li
// 														key={idx}
// 														className="flex items-start gap-2 text-sm md:text-base text-gray-700"
// 													>
// 														<span className="text-gray-400 flex-shrink-0">
// 															•
// 														</span>
// 														<span>{item}</span>
// 													</li>
// 												))}
// 											</ul>
// 										</div>
// 									)}
// 							</TabsContent>

// 							{/* Course Content Tab */}
// 							<TabsContent
// 								value="content"
// 								className="mt-6 focus-visible:outline-none"
// 							>
// 								<CourseContent modules={typedCourse.modules || ([] as any)} />
// 							</TabsContent>

// 							{/* Notice Tab */}
// 							<TabsContent
// 								value="notice"
// 								className="mt-6 focus-visible:outline-none"
// 							>
// 								<h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
// 									Important Notice
// 								</h2>
// 								<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6">
// 									<ul className="space-y-2 md:space-y-3 text-sm md:text-base text-gray-800">
// 										<li className="flex items-start gap-2">
// 											<span className="text-amber-600 flex-shrink-0">•</span>
// 											<span>
// 												Course access valid for {typedCourse.duration} months
// 												from enrollment date
// 											</span>
// 										</li>
// 										<li className="flex items-start gap-2">
// 											<span className="text-amber-600 flex-shrink-0">•</span>
// 											<span>
// 												All videos are on-demand with lifetime access to updates
// 											</span>
// 										</li>
// 										<li className="flex items-start gap-2">
// 											<span className="text-amber-600 flex-shrink-0">•</span>
// 											<span>Weekly live doubt-clearing sessions included</span>
// 										</li>
// 										<li className="flex items-start gap-2">
// 											<span className="text-amber-600 flex-shrink-0">•</span>
// 											<span>No refunds after 7 days of purchase</span>
// 										</li>
// 										<li className="flex items-start gap-2">
// 											<span className="text-amber-600 flex-shrink-0">•</span>
// 											<span>Certificate awarded upon course completion</span>
// 										</li>
// 									</ul>
// 								</div>
// 							</TabsContent>

// 							{/* FAQ Tab */}
// 							<TabsContent
// 								value="faq"
// 								className="mt-6 focus-visible:outline-none"
// 							>
// 								<h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
// 									Frequently Asked Questions
// 								</h2>
// 								<div className="space-y-4 md:space-y-6">
// 									<div className="border-b pb-4 md:pb-6">
// 										<h3 className="font-semibold text-base md:text-lg mb-2">
// 											Is this course suitable for beginners?
// 										</h3>
// 										<p className="text-sm md:text-base text-gray-600">
// 											{typedCourse.level === "BEGINNER"
// 												? "Yes, this course is designed for beginners and starts from the basics."
// 												: typedCourse.level === "INTERMEDIATE"
// 													? "This course is suitable for those with some prior knowledge."
// 													: "This is an advanced course requiring solid foundational knowledge."}
// 										</p>
// 									</div>
// 									<div className="border-b pb-4 md:pb-6">
// 										<h3 className="font-semibold text-base md:text-lg mb-2">
// 											Do you provide practice tests?
// 										</h3>
// 										<p className="text-sm md:text-base text-gray-600">
// 											Yes, practice exercises and assessments are included
// 											throughout the course.
// 										</p>
// 									</div>
// 									<div className="pb-4 md:pb-6">
// 										<h3 className="font-semibold text-base md:text-lg mb-2">
// 											Will I get a certificate?
// 										</h3>
// 										<p className="text-sm md:text-base text-gray-600">
// 											Yes, a Certificate of Completion is issued after finishing
// 											the course.
// 										</p>
// 									</div>
// 								</div>
// 							</TabsContent>

// 							{/* Review Tab */}
// 							<TabsContent
// 								value="review"
// 								className="mt-6 focus-visible:outline-none"
// 							>
// 								<h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
// 									Student Reviews
// 								</h2>
// 								<div className="mb-6 md:mb-8 bg-gray-50 rounded-lg p-4 md:p-6">
// 									<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
// 										<div className="flex">
// 											{[...Array(5)].map((_, idx) => (
// 												<Star
// 													key={idx}
// 													className={`w-5 h-5 md:w-6 md:h-6 ${
// 														idx < Math.floor(typedCourse.averageRating)
// 															? "text-yellow-500 fill-yellow-500"
// 															: "text-gray-300"
// 													}`}
// 												/>
// 											))}
// 										</div>
// 										<span className="text-2xl md:text-3xl font-bold">
// 											{typedCourse.averageRating.toFixed(1)}
// 										</span>
// 										<span className="text-sm md:text-base text-gray-500">
// 											(
// 											{typedCourse._count?.reviews ||
// 												typedCourse.totalReviews ||
// 												0}{" "}
// 											reviews)
// 										</span>
// 									</div>
// 								</div>
// 								{(!typedCourse._count?.reviews && !typedCourse.totalReviews) ||
// 								typedCourse.totalReviews === 0 ? (
// 									<div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg">
// 										<p className="text-sm md:text-base text-gray-500 italic px-4">
// 											No reviews yet. Be the first to review this course!
// 										</p>
// 									</div>
// 								) : (
// 									<div className="space-y-6 md:space-y-8">
// 										<p className="text-sm md:text-base text-gray-500">
// 											Reviews will be displayed here once available.
// 										</p>
// 									</div>
// 								)}
// 							</TabsContent>
// 						</Tabs>
// 					</div>

// 					{/* Desktop Sidebar - Right 1/3 - Hidden on mobile */}
// 					<div className="hidden lg:block space-y-6">
// 						{/* PRICE CARD – Sticky */}
// 						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border p-6 sticky top-4 z-10">
// 							<div className="mb-4">
// 								{typedCourse.discount &&
// 								parseFloat(typedCourse.discount) > 0 ? (
// 									<>
// 										<div className="flex items-baseline gap-3 mb-2">
// 											<span className="text-4xl font-bold text-gray-900">
// 												$
// 												{(
// 													parseFloat(typedCourse.price) *
// 													(1 - parseFloat(typedCourse.discount) / 100)
// 												).toFixed(2)}
// 											</span>
// 											<span className="text-xl text-gray-500 line-through">
// 												${parseFloat(typedCourse.price).toFixed(2)}
// 											</span>
// 										</div>
// 										<span className="inline-block text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
// 											Save {typedCourse.discount}%
// 										</span>
// 									</>
// 								) : (
// 									<span className="text-4xl font-bold text-gray-900">
// 										${parseFloat(typedCourse.price).toFixed(2)}
// 									</span>
// 								)}
// 							</div>
// 						</div>

// 						{/* COURSE FEATURES – Sticky */}
// 						<div className="bg-white rounded-xl shadow-lg border p-6 sticky top-[220px]">
// 							<h3 className="text-xl font-bold mb-4">Course Features</h3>

// 							<div className="space-y-4 mb-6">
// 								<div className="flex items-center gap-3">
// 									<PlayCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 									<span className="text-sm">Video Lessons Included</span>
// 								</div>

// 								<div className="flex items-center gap-3">
// 									<BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 									<span className="text-sm">Assignments & Exercises</span>
// 								</div>

// 								<div className="flex items-center gap-3">
// 									<Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 									<span className="text-sm">
// 										{typedCourse._count?.enrollments || 0} Students Enrolled
// 									</span>
// 								</div>

// 								<div className="flex items-center gap-3">
// 									<Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 									<span className="text-sm">
// 										{typedCourse.duration} Months Access
// 									</span>
// 								</div>

// 								<div className="flex items-center gap-3">
// 									<Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
// 									<span className="text-sm">Certificate of Completion</span>
// 								</div>
// 							</div>

// 							{typedCourse.whatYouLearn &&
// 								typedCourse.whatYouLearn.length > 0 && (
// 									<div className="border-t pt-6">
// 										<h4 className="font-semibold mb-3">What You'll Learn</h4>
// 										<ul className="space-y-2 text-sm text-gray-600">
// 											{typedCourse.whatYouLearn.slice(0, 5).map((item, idx) => (
// 												<li key={idx} className="flex items-start gap-2">
// 													<span className="text-blue-600 mt-0.5">✓</span>
// 													<span>{item}</span>
// 												</li>
// 											))}
// 										</ul>
// 									</div>
// 								)}
// 						</div>
// 					</div>
// 				</div>

// 				{/* Courses You May Like */}
// 				<div className="mt-12 md:mt-16 lg:mt-20">
// 					<h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
// 						Courses You May Like
// 					</h2>
// 					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
// 						{[1, 2, 3, 4].map((i) => (
// 							<div
// 								key={i}
// 								className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
// 							>
// 								<div className="bg-gradient-to-br from-gray-200 to-gray-300 w-full h-40 sm:h-48 flex items-center justify-center">
// 									<span className="text-gray-400 text-sm">Course Image</span>
// 								</div>
// 								<div className="p-4">
// 									<h3 className="font-semibold text-base md:text-lg mb-1 line-clamp-2">
// 										Course Title {i}
// 									</h3>
// 									<p className="text-xs md:text-sm text-gray-600 mb-3">
// 										Instructor Name
// 									</p>
// 									<div className="flex items-center justify-between">
// 										<div className="flex items-center gap-1">
// 											<Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
// 											<span className="text-sm font-medium">4.8</span>
// 										</div>
// 										<span className="font-bold text-blue-600 text-base md:text-lg">
// 											$97
// 										</span>
// 									</div>
// 								</div>
// 							</div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
