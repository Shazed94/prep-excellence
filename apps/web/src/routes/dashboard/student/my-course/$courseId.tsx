import { createFileRoute, useNavigate } from "@tanstack/react-router";
import parse from "html-react-parser";
import {
	ArrowLeft,
	Award,
	Bookmark,
	BookOpen,
	Calendar,
	CheckCircle2,
	ChevronDown,
	Circle,
	Clock,
	FileText,
	Loader2,
	Lock,
	Play,
	Share2,
	Star,
	TrendingUp,
	Users,
	Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetStudentEnrolledCourse } from "@/hooks/course-management";

export const Route = createFileRoute("/dashboard/student/my-course/$courseId")({
	component: CourseDetailPage,
});

function CourseDetailPage() {
	const navigate = useNavigate();
	const { courseId } = Route.useParams();

	const [expandedModules, setExpandedModules] = useState<{
		[key: string]: boolean;
	}>({ "0": true });
	const [_selectedTopic, setSelectedTopic] = useState<any>(null);

	const {
		data: courseData,
		isLoading,
		isError,
	} = useGetStudentEnrolledCourse(courseId);

	console.log("courseData", courseData);

	const course = courseData
		? {
				...courseData,
				id: courseData.id || courseId,
				description: courseData.shortDescription || "",
				category_s:
					courseData.category?.name || courseData.category_s || "General",
				status: "ACTIVE",
				progress: 0,
				instructor:
					courseData.instructor || courseData.modules?.[0]?.instructor || null,
				_count: courseData._count || { enrollments: 0 },
			}
		: null;

	const isLiveClass = () => {
		const now = new Date();
		const startDate = new Date(course.startDate);
		return startDate <= now;
	};

	const getNextClass = () => {
		if (!course?.schedule?.length) return null;
		const dayOrder = [
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
			"Sunday",
		];
		const today = new Date();
		const currentDay = dayOrder[today.getDay()];

		// Normalize day names for case-insensitive comparison
		const normalizeDay = (day: string) =>
			day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

		// Find next class
		const nextClass = course.schedules.find((s: any) => {
			const normalizedDay = normalizeDay(s.day);
			return dayOrder.indexOf(normalizedDay) >= dayOrder.indexOf(currentDay);
		});
		return nextClass || course.schedules[0];
	};

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => ({
			...prev,
			[moduleId]: !prev[moduleId],
		}));
	};

	const calculateModuleProgress = (moduleIndex: number) => {
		return Math.min(100, Math.max(0, course.progress - moduleIndex * 15));
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
					<p className="text-slate-600">Loading course...</p>
				</div>
			</div>
		);
	}

	if (isError || !course) {
		return (
			<div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
				<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
					<p className="text-red-500 mb-4">Error loading course.</p>
					<Button
						variant="outline"
						onClick={() =>
							navigate({ to: "/dashboard/student/my-course/" as "/" })
						}
					>
						Back to My Courses
					</Button>
				</div>
			</div>
		);
	}

	const nextClass = getNextClass();

	return (
		<div className="min-h-screen bg-[#FAFAFA]">
			{/* Header Navigation */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm"
			>
				<div className=" px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<Button
						variant="ghost"
						size="sm"
						onClick={() =>
							navigate({ to: "/dashboard/student/my-course/" as "/" })
						}
						className="gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Courses
					</Button>

					<div className="flex items-center gap-3">
						<Button variant="outline" size="sm" className="gap-2">
							<Share2 className="w-4 h-4" />
							Share
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<Bookmark className="w-4 h-4" />
							Save
						</Button>
					</div>
				</div>
			</motion.div>

			<div className="">
				{/* Course Hero */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6 }}
					className="relative h-96 overflow-hidden rounded-xl shadow-sm mx-4 sm:mx-6 lg:mx-8 mt-8 group"
				>
					<img
						src={course.thumbnail}
						alt={course.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

					{/* Live Badge */}
					{isLiveClass() && (
						<motion.div
							animate={{ scale: [1, 1.05, 1] }}
							transition={{ duration: 2, repeat: Infinity }}
							className="absolute top-6 left-6"
						>
							<div className="flex items-center gap-2 bg-red-500/95 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
								<span className="w-2 h-2 bg-white rounded-full animate-pulse" />
								Live Course
							</div>
						</motion.div>
					)}

					{/* Hero Content */}
					<div className="absolute bottom-0 left-0 right-0 p-8">
						<h1 className="text-4xl font-bold text-white mb-4 line-clamp-2">
							{course.title}
						</h1>
						<div className="flex flex-wrap gap-3">
							{(course.tags || []).slice(0, 3).map((tag: string, i: number) => (
								<Badge
									key={i}
									className="bg-blue-500/80 hover:bg-blue-600 backdrop-blur-sm"
								>
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</motion.div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-12">
					{/* Left Column - Course Info & Schedule */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="lg:col-span-1 space-y-6"
					>
						{/* Quick Stats */}
						<Card className="border border-slate-200 p-6 space-y-4">
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-slate-600 text-sm font-medium">
										Progress
									</span>
									<span className="text-blue-600 font-bold">
										{course.progress}%
									</span>
								</div>
								<Progress value={course.progress} className="h-3" />
							</div>

							<Separator />

							<div className="space-y-3 text-sm">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-slate-600">
										<Clock className="w-4 h-4" />
										Duration
									</div>
									<span className="font-semibold text-slate-900">
										{course.duration} hours
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-slate-600">
										<TrendingUp className="w-4 h-4" />
										Level
									</div>
									<span className="font-semibold text-slate-900">
										{course.level}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-slate-600">
										<Users className="w-4 h-4" />
										Enrolled
									</div>
									<span className="font-semibold text-slate-900">
										{course._count.enrollments} students
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-slate-600">
										<BookOpen className="w-4 h-4" />
										Modules
									</div>
									<span className="font-semibold text-slate-900">
										{course.modules?.length}
									</span>
								</div>
							</div>
						</Card>

						{/* Schedule Card */}
						<Card className="border border-blue-200 bg-primary-light p-6 space-y-4">
							<h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
								<Calendar className="w-5 h-5 text-blue-600" />
								Class Schedule
							</h3>

							<div className="space-y-3">
								{(course.schedules || []).map((session: any, idx: number) => (
									<div
										key={idx}
										className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-300 transition-all"
									>
										<div className="font-semibold text-slate-900 text-sm mb-1">
											{session.day.charAt(0).toUpperCase() +
												session.day.slice(1)}
										</div>
										<div className="text-xs text-slate-600 mb-2">
											{session.title}
										</div>
										<div className="flex items-center gap-2 text-xs font-medium text-blue-600">
											<Clock className="w-3 h-3" />
											{session.startTime} - {session.endTime}
										</div>
									</div>
								))}
							</div>

							{nextClass && (
								<>
									<Separator />
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button className="w-full bg-primary hover:bg-primary-dark text-white">
											<Play className="w-4 h-4 mr-2" />
											Join Live Class
										</Button>
									</motion.div>
								</>
							)}
						</Card>

						{/* Instructor Card */}
						<Card className="border border-slate-200 p-6 space-y-4">
							<h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
								Your Instructor
							</h3>

							<div className="flex gap-4">
								<img
									src={
										course.instructor?.user?.image || "/placeholder-avatar.png"
									}
									alt={course.instructor?.user?.name || "Instructor"}
									className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
								/>
								<div className="flex-1">
									<h4 className="font-bold text-slate-900">
										{course.instructor?.user?.name || "Instructor"}
									</h4>
									<p className="text-xs text-slate-600 mb-2">
										{course.instructor?.role || ""}
									</p>
									<div className="flex items-center gap-1">
										<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
										<span className="text-xs font-medium text-slate-700">
											{course.instructor?.experienceYears || 0}+ years
											experience
										</span>
									</div>
								</div>
							</div>

							{course.instructor?.subjects?.length > 0 && (
								<div className="bg-blue-50 rounded-lg p-3 text-xs space-y-1">
									<div className="font-medium text-slate-900 mb-2">
										Specializations:
									</div>
									<div className="flex flex-wrap gap-1">
										{course.instructor.subjects.map(
											(subject: string, idx: number) => (
												<Badge
													key={idx}
													variant="secondary"
													className="text-xs"
												>
													{subject}
												</Badge>
											),
										)}
									</div>
								</div>
							)}
						</Card>
					</motion.div>

					{/* Right Column - Course Content */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="lg:col-span-2"
					>
						<Tabs defaultValue="overview" className="w-full">
							<TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100">
								<TabsTrigger value="overview" className="gap-2">
									<BookOpen className="w-4 h-4" />
									<span className="hidden sm:inline">Overview</span>
								</TabsTrigger>
								<TabsTrigger value="modules" className="gap-2">
									<Video className="w-4 h-4" />
									<span className="hidden sm:inline">Content</span>
								</TabsTrigger>
								<TabsTrigger value="resources" className="gap-2">
									<FileText className="w-4 h-4" />
									<span className="hidden sm:inline">Resources</span>
								</TabsTrigger>
							</TabsList>

							{/* Overview Tab */}
							<TabsContent value="overview" className="space-y-6">
								<Card className="border border-slate-200 p-6 space-y-4">
									<h2 className="text-2xl font-bold text-slate-900">
										About This Course
									</h2>
									<div className="text-slate-700 leading-relaxed prose prose-sm max-w-none">
										{parse(course.longDescription)}
									</div>

									<Separator />

									<div className="grid grid-cols-2 gap-4">
										<div className="bg-blue-50 rounded-lg p-4">
											<div className="text-sm text-slate-600 mb-1">
												Category
											</div>
											<div className="font-bold text-slate-900">
												{course.category_s}
											</div>
										</div>
										<div className="bg-emerald-50 rounded-lg p-4">
											<div className="text-sm text-slate-600 mb-1">
												Capacity
											</div>
											<div className="font-bold text-slate-900">
												{course.capacity} students
											</div>
										</div>
									</div>
								</Card>

								{/* Pricing */}
								<Card className="border border-slate-200 p-6 bg-primary-light space-y-4">
									<h3 className="font-bold text-slate-900">
										Course Investment
									</h3>
									<div className="flex items-baseline gap-2">
										<span className="text-3xl font-bold text-blue-600">
											{course.discount}
										</span>
										<span className="text-lg text-slate-500 line-through">
											{course.price}
										</span>
										{/* <Badge className="bg-red-500 text-white">
											{Math.round(
												((parseInt(course.price) -
													parseInt(course.discount)) /
													parseInt(course.price)) *
													100,
											)}
											% OFF
										</Badge> */}
									</div>
									<p className="text-sm text-slate-600">
										✓ Lifetime access to all materials
										<br />✓ Certificate of completion
										<br />✓ Live support from instructors
									</p>
								</Card>
							</TabsContent>

							{/* Modules/Content Tab */}
							<TabsContent value="modules" className="space-y-3">
								{(course.modules || []).map(
									(module: any, moduleIdx: number) => {
										const isExpanded = expandedModules[module.id];
										const isLocked =
											module.unlockAtPercent > 0 &&
											course.progress < module.unlockAtPercent;
										const moduleProgress = calculateModuleProgress(moduleIdx);

										return (
											<motion.div
												key={module.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: moduleIdx * 0.05 }}
											>
												<Card className="border border-slate-200 overflow-hidden hover:border-blue-300 transition-colors">
													{/* Module Header */}
													<motion.button
														onClick={() => toggleModule(module.id)}
														className="w-full p-6 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
														whileHover={{ x: 4 }}
													>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-3 mb-2">
																{isLocked ? (
																	<Lock className="w-5 h-5 text-slate-400" />
																) : (
																	<BookOpen className="w-5 h-5 text-blue-600" />
																)}
																<h3 className="font-bold text-slate-900">
																	Module {moduleIdx + 1}: {module.title}
																</h3>
															</div>
															<p className="text-sm text-slate-600 mb-3">
																{module.description}
															</p>
															<div className="flex items-center gap-2">
																<Progress
																	value={moduleProgress}
																	className="h-2 flex-1 max-w-xs"
																/>
																<span className="text-xs font-medium text-slate-600 ml-2">
																	{Math.round(moduleProgress)}%
																</span>
															</div>
														</div>
														<motion.div
															animate={{
																rotate: isExpanded ? 180 : 0,
															}}
															className="ml-4"
														>
															<ChevronDown className="w-5 h-5 text-slate-400" />
														</motion.div>
													</motion.button>

													{/* Topics */}
													<AnimatePresence>
														{isExpanded && (
															<motion.div
																initial={{ height: 0, opacity: 0 }}
																animate={{ height: "auto", opacity: 1 }}
																exit={{ height: 0, opacity: 0 }}
																transition={{ duration: 0.3 }}
																className="border-t border-slate-200 bg-slate-50"
															>
																<div className="p-4 space-y-2">
																	{module.topics.map((topic: any) => (
																		<motion.button
																			key={topic.id}
																			onClick={() => setSelectedTopic(topic)}
																			className="w-full p-4 bg-white rounded-lg text-left hover:border-blue-300 border border-slate-200 transition-all group"
																			whileHover={{ x: 4 }}
																		>
																			<div className="flex items-start gap-3">
																				<div className="mt-1">
																					{topic.contents &&
																					topic.contents.length > 0 ? (
																						<CheckCircle2 className="w-5 h-5 text-emerald-600" />
																					) : (
																						<Circle className="w-5 h-5 text-slate-300" />
																					)}
																				</div>
																				<div className="flex-1">
																					<h4 className="font-semibold text-slate-900 group-hover:text-blue-600">
																						{topic.title}
																					</h4>
																					<p className="text-xs text-slate-600 mt-1">
																						{topic.description}
																					</p>
																					{topic.contents && (
																						<div className="text-xs text-slate-500 mt-2 flex gap-3">
																							{topic.contents.map(
																								(content: any, idx: number) => (
																									<span
																										key={idx}
																										className="flex items-center gap-1"
																									>
																										{content.type ===
																										"video" ? (
																											<>
																												<Video className="w-3 h-3" />
																												{content.duration} min
																											</>
																										) : content.type ===
																											"quiz" ? (
																											<>
																												<Award className="w-3 h-3" />
																												{content.questions}{" "}
																												questions
																											</>
																										) : (
																											<>
																												<FileText className="w-3 h-3" />
																												{content.count}{" "}
																												exercises
																											</>
																										)}
																									</span>
																								),
																							)}
																						</div>
																					)}
																				</div>
																			</div>
																		</motion.button>
																	))}
																</div>
															</motion.div>
														)}
													</AnimatePresence>
												</Card>
											</motion.div>
										);
									},
								)}
							</TabsContent>

							{/* Resources Tab */}
							<TabsContent value="resources">
								<Card className="border border-slate-200 p-6">
									<h3 className="font-bold text-slate-900 mb-4">
										Course Resources
									</h3>
									<div className="space-y-3">
										{[
											{
												title: "SAT Math Formulas Cheat Sheet",
												type: "PDF",
												size: "2.4 MB",
											},
											{
												title: "Practice Test - Full Length",
												type: "PDF",
												size: "8.1 MB",
											},
											{
												title: "Solution Keys & Explanations",
												type: "ZIP",
												size: "12.5 MB",
											},
											{
												title: "Supplementary Reading Materials",
												type: "PDF",
												size: "5.3 MB",
											},
										].map((resource, idx) => (
											<motion.div
												key={idx}
												className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
												whileHover={{ x: 4 }}
											>
												<div className="flex items-center gap-3">
													<FileText className="w-5 h-5 text-blue-600" />
													<div>
														<div className="font-medium text-slate-900">
															{resource.title}
														</div>
														<div className="text-xs text-slate-600">
															{resource.type} • {resource.size}
														</div>
													</div>
												</div>
												<motion.div whileHover={{ scale: 1.1 }}>
													<Button
														variant="ghost"
														size="sm"
														className="opacity-0 group-hover:opacity-100"
													>
														Download
													</Button>
												</motion.div>
											</motion.div>
										))}
									</div>
								</Card>
							</TabsContent>
						</Tabs>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
