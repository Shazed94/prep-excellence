import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { MoveRight, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CalenderSVG } from "@/components/SvgComponents";
import type { Course } from "@/components/sat-courses/sat_courses";
import { useGetPublishedCourses } from "@/hooks/course-management";
import { useCart } from "@/hooks/useCart";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { dayMap, formatTime } from "@/lib/utils";
import { Subtitle } from "../../SectionSubtitle";
import { Button } from "../../ui/button";

export const formatSchedule = (schedules: any[]) => {
	if (!schedules || schedules.length === 0) return "";
	const days = schedules
		.map((s) => dayMap[s.dayOfWeek.toLowerCase()])
		.join(", ");
	const first = schedules[0];
	return `${days} — ${formatTime(first.startTime)}`;
};

export function CourseCard({ course }: { course: Course }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const { addToCart } = useCart();

	const hasSeats = course.capacity! - (course?._count?.enrollments || 0) > 0;
	const discount = Number(course.discount);

	const weeks = Math.floor(Number(course.duration) / 7);

	const handlePlayPause = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleAddToCart = async () => {
		setIsAddingToCart(true);
		try {
			// Prepare course data for localStorage (if guest)
			const courseData = {
				id: course.id,
				title: course.title,
				price: course.price,
				discount: course.discount,
				thumbnail: course.thumbnail,
			};

			addToCart({ courseId: course.id }, courseData, {
				onSuccess: (res: any) => {
					toast.success(res?.data?.message || "Course added to cart");
				},
				onError: (error: any) => {
					toast.error(error?.message || "Failed to add course to cart");
				},
			});
		} finally {
			setIsAddingToCart(false);
		}
	};

	return (
		<div className="bg-white p-4 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
			{/* Image */}
			<div className="relative h-60 overflow-hidden">
				{/* Video */}
				<div className="relative h-60 overflow-hidden bg-black rounded-[6px] group">
					<video
						ref={videoRef}
						src={course.video}
						poster={course.thumbnail}
						className="w-full h-full object-cover"
						onPlay={() => setIsPlaying(true)}
						onPause={() => setIsPlaying(false)}
					>
						<track kind="captions" />
					</video>
				</div>

				<span className="absolute top-3 left-3 bg-[#1BA75C] text-white text-xs leading-[18px] -tracking-[0.3px] font-medium px-2.5 py-1 rounded-md">
					{discount > 0 ? `${discount}% Off` : course.discount || ""}
				</span>
				<div className="absolute bottom-3 left-3 w-8 h-8 bg-white/90 rounded-[6px] flex items-center justify-center cursor-pointer shadow-md">
					<button type="button" onClick={handlePlayPause}>
						{isPlaying ? (
							<Pause className="size-5 text-primary" />
						) : (
							<Play className="size-5 text-primary" />
						)}
					</button>
				</div>
			</div>

			{/* Body */}
			<div className="py-4 flex flex-col flex-1">
				<Link to={`/sat-courses/${course.id}` as "/"} className="flex-1">
					<h3 className="font-semibold text-[#0d1b2a] text-[20px] leading-[28px] -tracking-[1px] mb-[5px]">
						{course.title}
					</h3>
					<p className="font-inter text-[14px] text-[#141B34] leading-[20px] -tracking-[0.64px] line-clamp-2 mb-3">
						{course.shortDescription}
					</p>

					<div className="flex flex-col gap-2 mb-4">
						<div className="flex items-center gap-2 text-sm text-[#141B34]">
							<img
								src="/icons/dollar-circle.png"
								alt=""
								className="size-6 shrink-0"
							/>
							<span className="text-[#0d1b2a]">${course.price} USD</span>
							<span className="text-[#A3A3A3] line-through text-xs">
								${course.discount} USD
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-[#141B34]">
							<img
								src="/icons/calendar.png"
								alt="calendar"
								className="size-6 shrink-0"
							/>
							<span>{format(new Date(course.startDate), "MMM dd, yyyy")}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-[#141B34]">
							<img
								src="/icons/hourglass.png"
								alt="duration"
								className="size-6 shrink-0"
							/>
							<span>{weeks} Weeks</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-[#141B34]">
							<img
								src="/icons/clock-icon.png"
								alt="schedule"
								className="size-6 shrink-0"
							/>
							<span>{formatSchedule(course.schedules)}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-[#141B34]">
							<img
								src="/icons/user-circle-icon.png"
								alt="instructor"
								className="size-6 shrink-0"
							/>
							<span>{course?.createdBy?.name}</span>
						</div>
					</div>
				</Link>

				<div
					className={`text-center text-xs font-semibold rounded-md py-2 mb-3 ${
						hasSeats
							? "bg-primary-light text-primary"
							: "bg-red-50 text-red-500"
					}`}
				>
					{hasSeats
						? `${course.capacity! - (course?._count?.enrollments || 0)} Seats Remaining`
						: "No Seats Remaining"}
				</div>

				<Button
					variant="gradient"
					onClick={handleAddToCart}
					disabled={!hasSeats || isAddingToCart}
					className={`w-full py-3 rounded-[6px] text-[14px] leading-[20px] -tracking-[0.5px] transition-all duration-200 ${
						hasSeats
							? ""
							: "bg-[#EBEBEB] text-[#A3A3A3] disabled:cursor-not-allowed"
					}`}
				>
					{isAddingToCart ? "Adding..." : "Book Your Seat"}
				</Button>
			</div>
		</div>
	);
}

export default function UpcomingCoursesSectionTwo() {
	const { data: coursesData } = useGetPublishedCourses();

	return (
		<section className="bg-[#F8F8F9] py-8 md:py-16 px-4">
			<div className="container mx-auto">
				{/* Header */}
				<motion.div
					className="text-center mb-10"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					<h2 className="h2">Upcoming SAT Courses</h2>
					<Subtitle className="mx-auto max-w-[600px] ">
						Choose a cohort based on your schedule and target exam date. Seats
						are limited to maintain small group quality.
					</Subtitle>
				</motion.div>

				{/* Cards Grid */}
				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
					variants={staggerContainer}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOnce}
				>
					{coursesData?.data?.map((course: Course) => (
						<motion.div key={course.id} variants={scaleIn}>
							<CourseCard course={course} />
						</motion.div>
					))}
				</motion.div>

				{/* View More */}
				<motion.div
					className="block w-fit mx-auto"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					viewport={viewportOnce}
				>
					<Link to="/sat-courses">
						<Button
							variant="outline"
							className="group gap-2 border bg-transparent shadow-xs cursor-pointer text-[#141B34] w-fit h-[44px] mx-auto"
						>
							View More Courses <MoveRight />
						</Button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
