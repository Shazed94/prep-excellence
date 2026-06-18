import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { MoveRight, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { CalenderSVG } from "@/components/SvgComponents";
import { useGetPublishedCourses } from "@/hooks/course-management";
import {
	fadeUp,
	scaleIn,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { Subtitle } from "../../SectionSubtitle";
import { Button } from "../../ui/button";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// corsedata type
type CourseData = {
	id: string;
	title: string;
	sortDescription: string;
	longDescription: string;
	offer_price: string;
	regular_price: string;
	date: string;
	duration: string;
	instructor: string;
	capacity: number;
	discount: string;
	thumbnail: string;
	video: string;
	startDate: string;
	createdBy?: {
		name: string;
		image: string;
	};
	schedule: {
		day: string;
		startTime: string;
		endTime: string;
	}[];
	_count: {
		enrollments: number;
	};
};

function CourseCard({ course }: { course: CourseData }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const { addToCart, refetch } = useCart();

	const hasSeats = course.capacity - course?._count?.enrollments > 0;
	const regular = Number(course.regular_price);
	const offer = Number(course.offer_price);
	const discount =
		regular > 0 ? Math.round(((regular - offer) / regular) * 100) : 0;

	const weeks = Math.floor(Number(course.duration) / 7);

	const dayMap: Record<string, string> = {
		sunday: "Sun",
		monday: "Mon",
		tuesday: "Tue",
		wednesday: "Wed",
		thursday: "Thu",
		friday: "Fri",
		saturday: "Sat",
	};

	const formatTime = (time: string) => {
		const [hour, minute] = time.split(":").map(Number);

		const period = hour >= 12 ? "PM" : "AM";
		const adjustedHour = hour % 12 || 12;

		return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
	};

	const formatSchedule = (schedule: any[]) => {
		const days = schedule.map((s) => dayMap[s.day.toLowerCase()]).join(", ");

		// assuming same time range for all
		const first = schedule[0];

		return `${days} — ${formatTime(first.startTime)}`;
	};

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

	const handleAddToCart = () => {
		addToCart(
			{ courseId: course.id },
			{
				onSuccess: (res) => {
					toast.success(res.data.message || "Course added to cart");
					refetch();
				},
				// onError: (error) => {
				//   toast.error(error?.message || "Failed to add course to cart");
				// },
			},
		);
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
					{discount > 0 ? `${discount}% Off` : course.discount}
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
			<div className="py-4  flex flex-col flex-1">
				<h3 className="font-semibold text-[#0d1b2a] text-[20px]  leading-[28px] -tracking-[1px] mb-[5px]">
					{course.title}
				</h3>
				<p className="font-inter text-[14px] text-[#141B34] leading-[20px] -tracking-[0.64px] mb-3">
					{course.sortDescription}
				</p>

				<div className="flex flex-col gap-2 mb-4">
					<div className="flex items-center gap-2 text-sm text-[#141B34]">
						<img
							src="/icons/dollar-circle.png"
							alt=""
							className="size-6  shrink-0"
						/>

						<span className="text-[#0d1b2a]">${course.offer_price} USD</span>
						<span className="text-[#A3A3A3] line-through text-xs">
							${course.regular_price} USD
						</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-[#141B34]">
						<CalenderSVG width="24" height="24" />
						<span>{format(new Date(course.startDate), "MMM dd, yyyy")}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-[#141B34]">
						<img
							src="/icons/hourglass.png"
							alt=""
							className="size-6  shrink-0"
						/>
						<span>{weeks} Weeks</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-[#141B34]">
						<img
							src="/icons/clock-icon.png"
							alt=""
							className="size-6  shrink-0"
						/>
						<span>{formatSchedule(course.schedule)}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-[#141B34]">
						<img
							src="/icons/user-circle-icon.png"
							alt=""
							className="size-6  shrink-0"
						/>
						<span>{course.createdBy?.name}</span>
					</div>
				</div>

				<div
					className={`text-center text-xs font-semibold rounded-md py-2 mb-3 ${
						hasSeats
							? "bg-primary-light text-primary"
							: "bg-red-50 text-red-500"
					}`}
				>
					{hasSeats
						? `${course.capacity - course?._count?.enrollments} Seats Remaining`
						: "No Seats Remaining"}
				</div>

				<Button
					variant="gradient"
					onClick={handleAddToCart}
					disabled={!hasSeats}
					className={`w-full py-3 rounded-[6px] text-[14px] leading-[20px] -tracking-[0.5px] transition-all duration-200 ${
						hasSeats
							? ""
							: "bg-[#EBEBEB] text-[#A3A3A3] disabled:cursor-not-allowed"
					}`}
				>
					Book Your Seat
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
					{coursesData?.data?.map((course: CourseData) => (
						<motion.div key={course.id} variants={scaleIn}>
							<CourseCard course={course} />
						</motion.div>
					))}
				</motion.div>

				{/* View More */}
				<motion.div
					className="flex justify-center"
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
							className="group flex items-center justify-center gap-2 border bg-transparent shadow-xs cursor-pointer text-[#141B34] w-fit h-[44px] mx-auto"
						>
							View More Courses <MoveRight />
						</Button>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
