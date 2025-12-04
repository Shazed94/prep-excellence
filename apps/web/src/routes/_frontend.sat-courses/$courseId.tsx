import { createFileRoute } from "@tanstack/react-router";
import { Award, BookOpen, Clock, PlayCircle, Star, Users } from "lucide-react";
import CourseBanner from "@/components/sat-courses/singleCourse/CourseBanner";
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
						<div className="relative ">
							<div className="relative z-10 w-full">
								<img src="/sat-courses/hero.png" alt="" />
							</div>
						</div>

						{/* Tabs */}
						<div className="border-b">
							<div className="flex space-x-8">
								{[
									"Description",
									"Course Content",
									"Notice",
									"FAQ",
									"Review",
								].map((tab) => (
									<button
										type="button"
										key={tab}
										className="pb-4 border-b-2 border-transparent hover:border-blue-600 font-medium"
									>
										{tab}
									</button>
								))}
							</div>
						</div>

						{/* Description */}
						<div className="prose max-w-none">
							<h2 className="text-2xl font-bold mb-4">
								SAT Complete Preparation Course
							</h2>
							<p className="text-gray-700 leading-relaxed">
								The SAT Complete Preparation Course is a comprehensive,
								results-driven training program designed to equip students with
								the skills, strategies, and confidence they need to achieve a
								top score on the SAT exam. Whether you're aiming for a perfect
								score or simply looking to improve your academic standing, this
								course provides the perfect blend of expert instruction and
								practice.
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
						</div>
					</div>

					{/* Sidebar - Right 1/3 */}
					<div className="space-y-6">
						{/* About This Course */}
						<div className="pt-44">
							<h3 className="text-[14px] md:text-[24px] font-bold mb-4">
								About This Course
							</h3>
							<p className=" text-[13px] md:text-[17px] leading-relaxed mb-6">
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

				{/* Bottom Section - You May Like */}
				<div className="mt-16">
					<h2 className="text-2xl font-bold mb-8">Courses You May Like</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="bg-white rounded-xl shadow-sm overflow-hidden"
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
