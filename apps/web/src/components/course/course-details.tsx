// components/course-detail-page.tsx
"use client";

import { useRouter } from "@tanstack/react-router";
import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	MessageCircle,
	MessageSquare,
	Star,
	Users,
	Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { coursesData } from "@/data/course-data";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CourseDetailPageProps {
	courseId: string;
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
	const router = useRouter();
	const [course, setCourse] = useState<any>(null);
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [showChat, setShowChat] = useState(false);

	const handleEnroll = () => {
		router.navigate({ to: `/course/${courseId}/checkout` });
	};

	useEffect(() => {
		const found = coursesData.find((c) => String(c.id) === String(courseId));
		setCourse(found);
	}, [courseId]);

	if (!course) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Course not found</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Back Button */}
				<Button
					variant="ghost"
					size="sm"
					className="gap-2 mb-6"
					onClick={() => router.navigate({ to: "/" })}
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Courses
				</Button>

				{/* Rest of your component remains the same */}
				<div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						{/* Course Hero */}
						<div
							className="aspect-video rounded-lg mb-6"
							style={{ background: course.image }}
						>
							<div className="h-full w-full bg-black/40 flex items-center justify-center rounded-lg">
								<div className="text-white text-center p-6">
									<h1 className="text-3xl md:text-4xl font-bold mb-4">
										{course.title}
									</h1>
									<Badge className="bg-white text-gray-800 text-lg px-4 py-2">
										{course.category}
									</Badge>
								</div>
							</div>
						</div>

						{/* Course Stats */}
						<div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm mb-6">
							<div className="flex items-center gap-2">
								<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
								<span className="font-semibold">
									{course.rating?.toFixed(1) || "4.5"}
								</span>
								<span className="text-muted-foreground">rating</span>
							</div>
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-muted-foreground" />
								<span>{course.enrolledCount || 0} students</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-5 w-5 text-muted-foreground" />
								<span>{course.duration}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-5 w-5 text-muted-foreground" />
								<span>Daily: {course.daily}</span>
							</div>
						</div>

						{/* Course Description */}
						<div className="mb-8">
							<h2 className="text-2xl font-bold mb-4">About This Course</h2>
							<p className="text-lg text-muted-foreground">
								{course.description}
							</p>
						</div>

						{/* Tabs */}
						<Tabs defaultValue="curriculum" className="space-y-6">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="curriculum">Curriculum</TabsTrigger>
								<TabsTrigger value="instructor">Instructor</TabsTrigger>
							</TabsList>

							<TabsContent value="curriculum">
								<Card>
									<CardHeader>
										<CardTitle>Course Curriculum</CardTitle>
										<CardDescription>
											4 weeks • 12 modules • 36 lessons
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4 py-4">
											{[1, 2, 3, 4].map((week) => (
												<div key={week} className="border rounded-lg p-4">
													<div className="flex items-start justify-between mb-3">
														<div>
															<h3 className="font-semibold text-lg">
																Week {week}
															</h3>
															<p className="text-sm text-muted-foreground">
																Fundamental concepts and exercises
															</p>
														</div>
														<Badge variant="outline">3 modules</Badge>
													</div>
													<div className="space-y-2">
														{[1, 2, 3].map((lesson) => (
															<div
																key={lesson}
																className="flex items-center justify-between p-3 bg-gray-50 rounded"
															>
																<div className="flex items-center gap-3">
																	<div className="h-4 w-4 rounded-full border-2 border-gray-300" />
																	<Video className="h-4 w-4 text-blue-600" />
																	<div>
																		<p className="font-medium text-sm">
																			Lesson {lesson}
																		</p>
																	</div>
																</div>
																<span className="text-sm text-muted-foreground">
																	45 min
																</span>
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="instructor">
								<Card>
									<CardHeader>
										<CardTitle>About the Instructor</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col sm:flex-row items-start gap-4 py-3">
											<div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
											<div>
												<h3 className="font-semibold text-lg">
													Dr. Sarah Johnson
												</h3>
												<p className="text-muted-foreground">
													Expert in {course.category}
												</p>
												<p className="mt-2 text-sm">
													With over 10 years of teaching experience and multiple
													publications in educational research, Dr. Johnson
													brings a wealth of knowledge to this course.
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>

					{/* Enrollment Card */}
					<div className="lg:sticky lg:top-24 h-fit pb-2">
						<Card>
							<CardHeader>
								<CardTitle className="text-3xl">
									${course.price || 299}
								</CardTitle>
								<CardDescription>
									One-time payment, lifetime access
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{isEnrolled ? (
									<div className="space-y-4">
										<div>
											<div className="flex justify-between text-sm mb-2">
												<span className="text-muted-foreground">
													Your Progress
												</span>
												<span className="font-medium">0%</span>
											</div>
											<Progress value={0} className="h-2" />
										</div>
										<Button className="w-full" size="lg">
											Start Learning
										</Button>
										<Button variant="outline" className="w-full" size="lg">
											<MessageSquare className="h-4 w-4 mr-2" />
											Join Discussion
										</Button>
									</div>
								) : (
									<Button className="w-full" size="lg" onClick={handleEnroll}>
										Enroll Now
									</Button>
								)}

								<div className="space-y-3 text-sm py-3">
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span>Lifetime access</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span>Certificate of completion</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span>Access on mobile and desktop</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4 text-green-600" />
										<span>Daily {course.daily} sessions</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Live Chat Button */}
			{!showChat && (
				<Button
					onClick={() => setShowChat(true)}
					className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
					size="icon"
				>
					<MessageCircle className="h-6 w-6" />
				</Button>
			)}
		</div>
	);
}
