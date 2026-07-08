import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import parse from "html-react-parser";
import {
	BookOpen,
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	GraduationCap,
	Loader2,
	Lock,
	Play,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import FooterTwo from "@/components/FooterTwo";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Button } from "@/components/ui/button";
import { useGetPublishedCoachingCourse } from "@/hooks/course-management";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export const Route = createFileRoute("/_frontend/coaching/$courseId")({
	component: RouteComponent,
});

function levelColor(level: string) {
	const map: Record<string, string> = {
		BEGINNER: "bg-emerald-100 text-emerald-700",
		INTERMEDIATE: "bg-amber-100 text-amber-700",
		ADVANCED: "bg-red-100 text-red-600",
	};
	return map[level] ?? "bg-primary-light text-primary";
}

function levelLabel(level: string) {
	return level.charAt(0) + level.slice(1).toLowerCase();
}

// ─── Module Accordion ─────────────────────────────────────────────────────────

function ModuleAccordion({
	module: mod,
	index,
}: {
	module: {
		id: string;
		title: string;
		description?: string;
		unlockAtPercent: number;
		lessons?: {
			id: string;
			title: string;
			description?: string;
			lessonType: string;
		}[];
		teacher?: {
			experienceYears?: number;
			subjects?: string[];
			user: { name: string; image?: string };
		};
	};
	index: number;
}) {
	const [open, setOpen] = useState(index === 0);
	const isLocked = mod.unlockAtPercent > 0;

	return (
		<motion.div
			variants={fadeUp}
			className="border border-[#EBEBEB] rounded-xl overflow-hidden"
		>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="w-full flex items-center justify-between p-5 bg-white hover:bg-[#FAFAFA] transition-colors text-left"
			>
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
						{isLocked ? (
							<Lock className="w-4 h-4 text-primary" />
						) : (
							<span className="f14 font-bold text-primary">{index + 1}</span>
						)}
					</div>
					<div className="text-left">
						<p className="p font-semibold">{mod.title}</p>
						{mod.teacher && (
							<p className="f14 text-muted-foreground mt-0.5">
								by {mod.teacher.user.name}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-3 flex-shrink-0">
					{isLocked && (
						<span className="f14 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
							Unlocks at {mod.unlockAtPercent}% payment
						</span>
					)}
					{mod.lessons && (
						<span className="f14 text-muted-foreground hidden sm:block">
							{mod.lessons.length} lessons
						</span>
					)}
					{open ? (
						<ChevronUp className="w-4 h-4 text-gray-400" />
					) : (
						<ChevronDown className="w-4 h-4 text-gray-400" />
					)}
				</div>
			</button>

			{open && mod.lessons && mod.lessons.length > 0 && (
				<div className="border-t border-[#EBEBEB] bg-[#FAFAFA] divide-y divide-[#EBEBEB]">
					{mod.lessons.map((lesson) => (
						<div key={lesson.id} className="px-5 py-3 flex items-center gap-3">
							<Play className="w-3.5 h-3.5 text-primary flex-shrink-0" />
							<span className="f14 text-[#334155]">{lesson.title}</span>
							<span className="f14 text-muted-foreground ml-auto">
								{lesson.lessonType === "LIVE_CLASS"
									? "Live"
									: lesson.lessonType === "ASSIGNMENT"
										? "Assignment"
										: "Lesson"}
							</span>
						</div>
					))}
				</div>
			)}

			{open && mod.description && (
				<div className="border-t border-[#EBEBEB] bg-[#FAFAFA] px-5 py-3">
					<p className="f14 text-muted-foreground">{mod.description}</p>
				</div>
			)}
		</motion.div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RouteComponent() {
	const { courseId } = Route.useParams();
	const { data: course, isLoading } = useGetPublishedCoachingCourse(courseId);
	const modules = (course?.courseModules ?? []) as any[];
	const modulesLoading = isLoading;
	const { user } = useAuth();
	const navigate = useNavigate();
	const { openLoginPopup } = useLoginPopupStore();

	const price = Number(course?.discount ?? course?.price);
	const hasDiscount =
		Number(course?.discount) > 0 &&
		Number(course?.price) > 0 &&
		Number(course?.discount) < Number(course?.price);

	const handleEnroll = () => {
		if (!user) {
			openLoginPopup(`/coaching/${courseId}`);
			return;
		}
		navigate({ to: "/student-dashboard/coaching/browse" });
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!course) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-4">
				<BookOpen className="w-12 h-12 text-gray-200" />
				<p className="h4 text-muted-foreground">Program not found</p>
				<Link to="/coaching">
					<Button variant="outline">Browse all programs</Button>
				</Link>
			</div>
		);
	}

	return (
		<div>
			{/* ── Hero ── */}
			<section className="relative overflow-hidden px-4 md:px-0">
				<div className="relative z-10 container mx-auto py-16">
					<Breadcrumb alignment="left" className="mb-6">
						<Link to="/coaching" className="hover:underline">
							Coaching
						</Link>
						{" / "}
						<span className="text-primary! font-medium!">{course.title}</span>
					</Breadcrumb>

					<div className="flex flex-col lg:flex-row gap-10 items-start">
						{/* Left: Info */}
						<div className="flex-1 min-w-0">
							{/* Level + Tags */}
							<div className="flex flex-wrap items-center gap-2 mb-4">
								<span
									className={`text-xs font-semibold px-3 py-1 rounded-full ${levelColor(course.level)}`}
								>
									{levelLabel(course.level)}
								</span>
								{course.tags?.slice(0, 3).map((tag) => (
									<span
										key={tag}
										className="text-xs bg-primary-light text-primary px-2.5 py-0.5 rounded-full font-medium"
									>
										{tag}
									</span>
								))}
							</div>

							<motion.h1
								className="h2 text-5xl! leading-[56px]! mb-4"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
							>
								{course.title}
							</motion.h1>

							{parse(course.shortDescription ?? "")}

							{/* Stats row */}
							<div className="flex flex-wrap gap-5 mb-6">
								{modules.length > 0 && (
									<div className="flex items-center gap-2 f14 text-muted-foreground">
										<BookOpen className="w-4 h-4 text-primary" />
										<span>
											{modules.length} module{modules.length !== 1 ? "s" : ""}
										</span>
									</div>
								)}
								{course.duration && (
									<div className="flex items-center gap-2 f14 text-muted-foreground">
										<Clock className="w-4 h-4 text-primary" />
										<span>{course.duration} weeks</span>
									</div>
								)}
								{course._count?.enrollments !== undefined && (
									<div className="flex items-center gap-2 f14 text-muted-foreground">
										<Users className="w-4 h-4 text-primary" />
										<span>{course._count.enrollments} enrolled</span>
									</div>
								)}
								{course.startDate && (
									<div className="flex items-center gap-2 f14 text-muted-foreground">
										<Calendar className="w-4 h-4 text-primary" />
										<span>
											Starts{" "}
											{new Date(course.startDate).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</span>
									</div>
								)}
							</div>

							{/* Thumbnail */}
							{course.thumbnail && (
								<div className="rounded-2xl overflow-hidden h-64 md:h-80">
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-full object-cover"
									/>
								</div>
							)}
						</div>

						{/* Right: Enrollment Card */}
						<div className="w-full lg:w-[340px] flex-shrink-0 sticky top-6">
							<div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-lg overflow-hidden">
								{/* Price */}
								<div className="bg-primary p-6 text-white">
									<div className="flex items-end gap-2 mb-1">
										<span className="text-[36px] font-bold leading-none">
											${price?.toLocaleString() ?? "0"}
										</span>
										{hasDiscount && (
											<span className="text-white/60 line-through text-lg mb-1">
												${Number(course.price ?? 0).toLocaleString()}
											</span>
										)}
									</div>
									{hasDiscount && (
										<p className="text-white/80 f14">
											Save $
											{(
												Number(course.price ?? 0) - Number(course.discount ?? 0)
											).toLocaleString()}
										</p>
									)}
								</div>

								{/* Details */}
								<div className="p-6 space-y-3 border-b border-[#EBEBEB]">
									{[
										{
											icon: BookOpen,
											label: "Modules",
											value: `${modules.length || "—"}`,
										},
										{
											icon: Clock,
											label: "Duration",
											value: course.duration ? `${course.duration} weeks` : "—",
										},
										{
											icon: Users,
											label: "Capacity",
											value: course.capacity
												? `${course.capacity} students`
												: "Unlimited",
										},
										{
											icon: GraduationCap,
											label: "Level",
											value: levelLabel(course.level),
										},
									].map(({ icon: Icon, label, value }) => (
										<div
											key={label}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2 f14 text-muted-foreground">
												<Icon className="w-4 h-4" />
												<span>{label}</span>
											</div>
											<span className="f14 font-semibold text-[#1e293b]">
												{value}
											</span>
										</div>
									))}
								</div>

								{/* CTA */}
								<div className="p-6">
									<Button
										variant="gradient"
										className="w-full h-[46px] text-base"
										onClick={handleEnroll}
									>
										Enroll Now
									</Button>
									<p className="f14 text-muted-foreground text-center mt-3">
										30-day money-back guarantee
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* bg */}
				<img
					src="/bg.png"
					alt=""
					className="absolute inset-0 w-full h-full object-cover z-0"
				/>
				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.2) 60%, rgba(236,241,254,0.2) 83%, rgba(21,82,253,0.15) 100%)",
					}}
				/>
			</section>

			{/* ── About & Modules ── */}
			<section className="py-16 px-6 md:px-0 bg-white">
				<div className="container mx-auto max-w-4xl">
					{/* About */}
					{course.longDescription && (
						<motion.div
							className="mb-14"
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							<h2 className="h2 mb-4">About This Program</h2>
							<div className="text-muted-foreground leading-relaxed whitespace-pre-line">
								{course.longDescription}
							</div>
						</motion.div>
					)}

					{/* Modules */}
					<motion.div
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="h2 mb-0!">
								Course Modules{" "}
								{modules.length > 0 && (
									<span className="text-muted-foreground text-2xl font-normal">
										({modules.length})
									</span>
								)}
							</h2>
						</div>

						{isLoading ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
							</div>
						) : modules.length > 0 ? (
							<motion.div
								className="space-y-3"
								variants={staggerContainer}
								initial="hidden"
								animate="visible"
							>
								{modules
									.sort((a, b) => a.orderIndex - b.orderIndex)
									.map((mod, i) => (
										<ModuleAccordion key={mod.id} module={mod} index={i} />
									))}
							</motion.div>
						) : (
							<div className="text-center py-12 bg-[#FAFAFA] rounded-2xl border border-[#EBEBEB]">
								<BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
								<p className="f14 text-muted-foreground">Modules coming soon</p>
							</div>
						)}
					</motion.div>
				</div>
			</section>

			<FAQSectionTwo isGetDiscount />
			<FooterTwo />
		</div>
	);
}
