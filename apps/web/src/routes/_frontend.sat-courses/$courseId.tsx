import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, Clock, PlayCircle, Star, Users } from "lucide-react";
import { CourseContent } from "@/components/course/courseContent";
import CourseBanner from "@/components/sat-courses/singleCourse/CourseBanner";
// Import shadcn/ui Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_frontend/sat-courses/$courseId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<CourseBanner />
			<div className="container mx-auto px-4 sm:px-6 md:px-20 py-8 md:py-14">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-22">
					{/* Main Content - Left 2/3 */}
					<div className="lg:col-span-2 space-y-8">
						{/* Hero Section */}
						<div className="relative">
							<div className="relative z-10 w-full">
								<img
									src="/sat-courses/hero.png"
									alt="SAT Course Hero"
									className="w-full rounded-lg object-cover"
								/>
							</div>
						</div>

						{/* shadcn Tabs */}
						<Tabs defaultValue="description" className="w-full">
							<TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-transparent border-b rounded-none h-auto p-2 py-4">
								<TabsTrigger value="description">Description</TabsTrigger>
								<TabsTrigger value="content">Course Content</TabsTrigger>
								<TabsTrigger value="notice">Notice</TabsTrigger>
								<TabsTrigger value="faq">FAQ</TabsTrigger>
								<TabsTrigger value="review">Review</TabsTrigger>
							</TabsList>

							{/* Description Tab */}
							<TabsContent
								value="description"
								className="mt-8 prose max-w-none focus-visible:ring-0"
							>
								<h2 className="text-2xl font-bold mb-4">
									SAT Complete Preparation Course
								</h2>
								<p className="text-gray-700 leading-relaxed">
									The SAT Complete Preparation Course is a comprehensive,
									results-driven training program designed to equip students
									with the skills, strategies, and confidence they need to
									achieve a top score on the SAT exam. Whether you're aiming for
									a perfect score or simply looking to improve your academic
									standing, this course provides the perfect blend of expert
									instruction and practice.
								</p>
								<div className="bg-gray-300 border-2 border-dashed rounded-xl w-full h-64 my-8" />
								<p className="text-gray-700 leading-relaxed">
									This course covers all four major SAT components — Reading,
									Writing & Language, Mathematics (No Calculator and Calculator
									sections), and the optional SAT Essay. Students will learn
									essential test-taking strategies, time management techniques,
									and subject-specific approaches to tackle even the most
									challenging problems...
								</p>
							</TabsContent>

							{/* Course Content Tab */}
							<TabsContent value="content" className="mt-8">
								<CourseContent />
							</TabsContent>

							{/* Notice Tab */}
							<TabsContent value="notice" className="mt-8">
								<h2 className="text-2xl font-bold mb-6">Important Notice</h2>
								<div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
									<ul className="list-disc space-y-2 text-gray-800">
										<li>
											Course access valid for 6 months from enrollment date
										</li>
										<li>
											All videos are on-demand with lifetime access to updates
										</li>
										<li>Weekly live doubt-clearing sessions included</li>
										<li>No refunds after 7 days of purchase</li>
										<li>Certificate awarded upon course completion</li>
									</ul>
								</div>
							</TabsContent>

							{/* FAQ Tab */}
							<TabsContent value="faq" className="mt-8">
								<h2 className="text-2xl font-bold mb-6">
									Frequently Asked Questions
								</h2>
								<div className="space-y-6">
									<div className="border-b pb-6">
										<h3 className="font-semibold mb-2">
											Is this course suitable for beginners?
										</h3>
										<p className="text-gray-600">
											Yes, we start from basics and build up gradually.
										</p>
									</div>
									<div className="border-b pb-6">
										<h3 className="font-semibold mb-2">
											Do you provide practice tests?
										</h3>
										<p className="text-gray-600">
											Yes, 8 full-length timed practice tests with detailed
											reviews.
										</p>
									</div>
									<div className="pb-6">
										<h3 className="font-semibold mb-2">
											Will I get a certificate?
										</h3>
										<p className="text-gray-600">
											Yes, a Certificate of Completion is issued after finishing
											the course.
										</p>
									</div>
								</div>
							</TabsContent>

							{/* Review Tab */}
							<TabsContent value="review" className="mt-8">
								<h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
								<div className="space-y-8">
									{[1, 2, 3].map((i) => (
										<div key={i} className="border-b pb-8 last:border-none">
											<div className="flex items-center gap-3 mb-3">
												<div className="flex">
													{[...Array(5)].map((_, idx) => (
														<Star
															key={idx}
															className="w-5 h-5 text-yellow-500 fill-current"
														/>
													))}
												</div>
												<span className="font-semibold">Student Name {i}</span>
												<span className="text-sm text-gray-500">
													Verified Buyer
												</span>
											</div>
											<p className="text-gray-700">
												Excellent course! Improved my score by 220 points. The
												strategies taught here are game-changers.
											</p>
										</div>
									))}
								</div>
							</TabsContent>
						</Tabs>
					</div>

					{/* Sidebar - Right 1/3 (unchanged) */}
					<div className="space-y-6">
						<div className="pt-8">
							<h3 className="text-[14px] md:text-[24px] font-bold mb-4">
								About This Course
							</h3>
							<p className="text-[13px] md:text-[17px] leading-relaxed mb-6">
								The SAT Complete Preparation Course is fully structured to help
								you achieve your target score...
							</p>

							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<PlayCircle className="w-5 h-5 text-blue-600" /> 120+ Video
									Lessons
								</div>
								<div className="flex items-center gap-3">
									<BookOpen className="w-5 h-5 text-blue-600" /> 8 Assignments
								</div>
								<div className="flex items-center gap-3">
									<Users className="w-5 h-5 text-blue-600" /> 1.2k+ Enrolled
								</div>
								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-blue-600" /> 6 Months Access
								</div>
								<div className="flex items-center gap-3">
									<Award className="w-5 h-5 text-blue-600" /> Certificate of
									Completion
								</div>
							</div>

							<div className="mt-8">
								<h4 className="font-semibold mb-3">What You'll Learn</h4>
								<ul className="space-y-2 text-sm text-gray-600">
									<li>• Master Reading Comprehension strategies</li>
									<li>• Advanced Grammar & Writing techniques</li>
									<li>• Proven Math problem-solving methods</li>
									<li>• Time management and test anxiety reduction</li>
									<li>• Full-length practice tests with detailed reviews</li>
								</ul>
							</div>
						</div>

						{/* Students Also Bought */}
						<div className="bg-white rounded-xl shadow-sm p-6">
							<h3 className="text-xl font-bold mb-4">Students Also Bought</h3>
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex gap-4">
										<div className="bg-gray-300 border-2 border-dashed rounded-lg w-20 h-20 flex-shrink-0" />
										<div>
											<h4 className="font-medium text-sm">
												Course Title Goes Here {i}
											</h4>
											<p className="text-xs text-gray-500">
												By Instructor Name
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Star className="w-4 h-4 text-yellow-500 fill-current" />
												<span className="text-sm">4.9</span>
												<span className="text-sm font-bold text-blue-600">
													$67
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Courses You May Like */}
				<div className="mt-16">
					<h2 className="text-2xl font-bold mb-8">Courses You May Like</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
							>
								<div className="bg-gray-300 border-2 border-dashed w-full h-48" />
								<div className="p-4">
									<h3 className="font-semibold">Course Title {i}</h3>
									<p className="text-sm text-gray-600 mt-1">Instructor Name</p>
									<div className="flex items-center justify-between mt-3">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 text-yellow-500 fill-current" />
											<span className="text-sm">4.8</span>
										</div>
										<span className="font-bold text-blue-600">$97</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
