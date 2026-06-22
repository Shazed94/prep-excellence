import { addDays, format, parse, parseISO } from "date-fns";
import { ArrowRightIcon, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { formatSchedule } from "@/components/homepage/two/UpcomingCoursesTwo";
import { CalenderSVG } from "@/components/SvgComponents";
import { Button } from "@/components/ui/button";
import { useGetPopularCourses } from "@/hooks/course-management";
import { useCart } from "@/hooks/useCart";
import type { Course } from "../sat_courses";

const StarIcon = ({
	filled = true,
	size = 12,
}: {
	filled?: boolean;
	size?: number;
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill={filled ? "#f59e0b" : "none"}
		stroke="#f59e0b"
		strokeWidth="2"
	>
		<title>Star</title>
		<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
	</svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const guestMentors = [
	{ name: "Amy Hernandez", role: "Sr.Mentor", avatar: "AH", color: "#e0f2fe" },
	{ name: "Jelly Hamm", role: "Sr.Mentor", avatar: "JH", color: "#fef3c7" },
	{ name: "Alex Ross", role: "Jr.Mentor", avatar: "AR", color: "#f3e8ff" },
	{ name: "Joseph Kim", role: "Jr.Mentor", avatar: "JK", color: "#dcfce7" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h5 className="text-[24px] font-semibold text-[#141B34] mb-4 font-switzer leading-8 tracking-[-1px]">
			{children}
		</h5>
	);
}

function PopularCourseCard({
	course,
	index,
}: {
	index: number;
	course: Course;
}) {
	const regular = Number(course.regular_price);
	const offer = Number(course.offer_price);
	const discount =
		regular > 0 ? Math.round(((regular - offer) / regular) * 100) : 0;
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{
				delay: index * 0.1,
				duration: 0.6,
				ease: [0.22, 1, 0.36, 1],
			}}
			whileHover={{ y: -4 }}
			className="flex gap-4 pb-4 last:pb-0 border-b border-[#EBEBEB] last:border-b-0 mb-4 last:mb-0"
		>
			<div className="relative w-[215px] h-[172px] rounded-[3px] overflow-hidden shrink-0">
				<motion.img
					src={course.thumbnail}
					alt={course.title}
					className="w-full h-full object-cover"
					whileHover={{ scale: 1.06 }}
					transition={{ duration: 0.4 }}
				/>
				<span className="absolute top-3 left-3 bg-[#1BA75C] text-white! small font-medium px-2.5 py-1 rounded-sm">
					{discount}% Off
				</span>

				{/* {course.isVideo && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="absolute bottom-3 left-3 w-8 h-8 rounded-sm bg-white flex items-center justify-center shadow-sm"
          >
            <Play className="w-4 h-4 text-primary ml-0.5" />
          </motion.button>
        )} */}
			</div>

			<div className="flex-1 min-w-0">
				<div className="text-[13px] font-semibold text-gray-900 leading-tight mb-3 line-clamp-2">
					{course.title}
				</div>
				<div className="flex flex-col gap-2">
					{[
						{
							icon: "dollar-circle.png",
							text: course.offer_price,
							strike: course.regular_price,
						},
						{ icon: "calendar.png", text: formatDate(course.startDate) },
						{
							icon: "hourglass.png",
							text: `${Math.floor(Number(course.duration) / 7)
								.toString()
								.padStart(2, "0")} weeks`,
						},
						{ icon: "clock-icon.png", text: formatSchedule(course.schedule) },
						{ icon: "user-circle-icon.png", text: course.createdBy.name },
					].map((item, i) => (
						<motion.div
							key={i}
							className="flex items-center gap-1.5"
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 + i * 0.05 }}
						>
							<img
								src={`/icons/${item.icon}`}
								alt={item.text}
								className="w-5 h-5"
							/>
							<span className="body_sm">
								{item.text} USD
								{item.strike && (
									<span className="line-through xxs_font text-[#A3A3A3]! ml-1">
										{item.strike} USD
									</span>
								)}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	);
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function getDurationLabel(days: number): string {
	if (days >= 7) {
		const weeks = Math.round(days / 7);
		return `${weeks.toString().padStart(2, "0")} ${weeks === 1 ? "week" : "weeks"}`;
	}
	return `${days} ${days === 1 ? "day" : "days"}`;
}
interface ScheduleItem {
	day: string;
	endTime: string;
	startTime: string;
	title: string;
	activity?: string;
	note?: string;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function SATCoursePage({ data }: { data: any }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const { addToCart, refetch } = useCart();

	const { data: popularCourses } = useGetPopularCourses();
	console.log("popularCourses", data);
	const weekdayMap: Record<string, number> = {
		sunday: 0,
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6,
	};

	const scheduleRows = useMemo(() => {
		if (!data?.schedule?.length || !data?.startDate) return [];

		const baseDate = parseISO(data.startDate);

		return data.schedule.map((s: ScheduleItem) => {
			const targetDayIndex = weekdayMap[s.day.toLowerCase()];

			// start of week based on course start date
			const baseDayIndex = baseDate.getDay();

			let diff = targetDayIndex - baseDayIndex;
			if (diff < 0) diff += 7; // move to next week if needed

			const classDate = addDays(baseDate, diff);

			return {
				day: format(classDate, "EEE, MMMM do"), // 👉 Tue, April 7th
				time: `${format(
					parse(s.startTime, "HH:mm", new Date()),
					"h:mm a",
				)} - ${format(parse(s.endTime, "HH:mm", new Date()), "h:mm a")}`,
				title: s.title,
				activity: s.activity,
				note: s.note,
			};
		});
	}, [data?.schedule, data?.startDate]);

	const scheduleText = useMemo(() => {
		if (!data?.schedule?.length) return "";

		const days = (data.schedule as ScheduleItem[])
			.map((s: ScheduleItem) => s.day.slice(0, 3))
			.map((d: string) => d.charAt(0).toUpperCase() + d.slice(1))
			.join(", ");

		const startTime = format(
			parse(data.schedule[0].startTime, "HH:mm", new Date()),
			"h:mm a",
		);

		return `${days} — ${startTime}`;
	}, [data?.schedule]);

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
			{ courseId: data.id },
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
	const subjects =
		data?.instructor?.subjects?.flatMap((s: string) => {
			try {
				const parsed = JSON.parse(s);
				return Array.isArray(parsed) ? parsed : [parsed];
			} catch {
				return [s]; // plain string like "Eng"
			}
		}) ?? [];

	return (
		<div>
			<div className="container mx-auto pb-20">
				<div className="flex flex-col md:flex-row gap-10">
					{/* LEFT COLUMN */}
					<div className="flex-1 min-w-0 md:w-[58.7%]">
						{/* Video Thumbnail */}
						<motion.div
							className="relative w-full px-4 md:px-0 z-20"
							initial={{ opacity: 0, scale: 0.96 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
						>
							{
								<video
									ref={videoRef}
									src={data?.video}
									poster={data?.thumbnail}
									className="w-full h-[450px] sm:h-[500px] lg:h-[512px] rounded-sm object-cover object-top"
									onPlay={() => setIsPlaying(true)}
									onPause={() => setIsPlaying(false)}
								>
									<track kind="captions" />
								</video>
							}

							<div className="absolute top-0 left-0 w-full h-full rounded-sm">
								<div className="absolute bottom-6 left-6 right-6 z-30">
									<div className="bg-white px-5 py-[18px] rounded-sm">
										<div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
											<div className="flex items-center">
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.95 }}
													onClick={handlePlayPause}
													className="w-12 h-12 rounded-sm bg-[#F8F8F9] text-primary-dark flex items-center justify-center hover:bg-blue-50 transition-colors"
												>
													{isPlaying ? (
														<Pause className="size-5 text-primary" />
													) : (
														<Play className="size-5 text-primary" />
													)}
												</motion.button>
												<div className="flex flex-col ml-6">
													<span className="p mb-1 font-semibold">
														Watch Course Preview
													</span>
													<span className="text-[#6C7179] text-[12px] leading-[18px] -tracking-[0.64px]">
														{data?.video ? "Course Video" : "01m 20s"}
													</span>
												</div>
											</div>
											<Button
												variant="outline"
												onClick={handleAddToCart}
												className="h-11 w-full md:w-fit border-primary text-primary flex items-center gap-3"
											>
												Book Your Seat <ArrowRightIcon />
											</Button>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Course Details */}
						<div className="px-4 md:px-0">
							{/* Badges row */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="my-5 flex flex-wrap gap-2"
							>
								<span className="rounded-sm px-5 py-2 bg-[#EBF3FF] text-primary! body_lg">
									{data?.level || "Group Course"}
								</span>
								{data?.tags?.map((tag: string) => (
									<span
										key={tag}
										className="rounded-sm px-5 py-2 bg-gray-100 text-gray-700! body_lg"
									>
										{tag}
									</span>
								))}
							</motion.div>

							{/* Title */}
							<motion.h1
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="h3"
							>
								{data?.title || "Course Title"}
							</motion.h1>

							{/* Meta row */}
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 }}
								className="flex flex-wrap items-center gap-4 mt-5 py-[5px]"
							>
								{data?.startDate && (
									<span className="flex items-center gap-1.5">
										<CalenderSVG width="24" height="24" />{" "}
										<span className="body_sm">
											{formatDate(data.startDate)}
										</span>
									</span>
								)}
								{data?.duration && (
									<span className="flex items-center gap-1.5">
										<img src="/icons/hourglass.png" alt="" />{" "}
										<span className="body_sm">
											{getDurationLabel(data.duration)}
										</span>
									</span>
								)}
								{scheduleRows.length > 0 && (
									<span className="flex items-center gap-1.5">
										<img src="/icons/clock-icon.png" alt="" />
										<span className="body_sm">{scheduleText}</span>
									</span>
								)}
							</motion.div>

							{/* Sort Description */}
							{data?.sortDescription && (
								<>
									<div className="border-t border-[#EBEBEB] my-5" />
									<motion.div
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										className="mb-5"
									>
										<p className="body_lg">{data.sortDescription}</p>
									</motion.div>
								</>
							)}

							{/* Long Description (rendered as HTML) */}
							{data?.longDescription && (
								<>
									<div className="border-t border-[#EBEBEB] my-5" />
									<motion.div
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										className="mb-5 course-long-description [&_span]:font-inter! [&_br]:content-['']"
										// biome-ignore lint/security/noDangerouslySetInnerHtml: longDescription contains trusted HTML content from the CMS
										dangerouslySetInnerHTML={{ __html: data.longDescription }}
									/>
									{/* {parser(data.longDescription)} */}
								</>
							)}

							{/* Course Schedule */}
							{scheduleRows.length > 0 && (
								<>
									<div className="border-t border-[#EBEBEB] my-5" />
									<motion.div
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										className="mb-6"
									>
										<SectionTitle>Course Schedule</SectionTitle>
										<div className="border-[#EBEBEB] rounded-tl-sm rounded-tr-sm border overflow-x-auto">
											<table className="w-full text-sm border-collapse border">
												<thead>
													<tr className="bg-[#F8F8F9] text-center p-1.5">
														{["Date", "Time", "Activity"].map((col) => (
															<th
																key={col}
																className="px-3 py-2 body_lg font-bold border-b border-gray-200"
															>
																{col}
															</th>
														))}
													</tr>
												</thead>
												<tbody>
													{scheduleRows.map(
														(
															row: {
																day: string;
																time: string;
																title: string;
																activity?: string;
																note?: string;
															},
															i: number,
														) => (
															<motion.tr
																key={i}
																initial={{ opacity: 0, y: 20 }}
																whileInView={{ opacity: 1, y: 0 }}
																viewport={{ once: true }}
																transition={{ delay: i * 0.08 }}
																className={
																	i % 2 === 0 ? "bg-white" : "bg-[#F8F8F9]"
																}
															>
																<td className="px-3 py-4 border-b border-[#EBEBEB] body_lg text-center font-semibold">
																	{row.day}
																</td>
																<td className="px-3 py-4 border-b border-[#EBEBEB]">
																	<div className="flex flex-col items-center">
																		<span className="body_lg text-center font-normal">
																			{row.time}
																		</span>
																		<span className="body_sm text-center font-normal">
																			{row.title}
																		</span>
																	</div>
																</td>

																<td className="px-3 py-4 border-b border-[#EBEBEB]">
																	<div className="flex flex-col items-center">
																		<span className="body_lg text-center font-normal">
																			{row.activity}
																		</span>
																		<span className="body_sm text-[#6C7179]! text-center font-normal">
																			{row.note}
																		</span>
																	</div>
																</td>
															</motion.tr>
														),
													)}
												</tbody>
											</table>
										</div>
									</motion.div>
								</>
							)}
						</div>
					</div>

					{/* RIGHT COLUMN */}
					<div className="min-w-0 md:w-[38.2%] shrink-0 px-4 md:px-0">
						{/* Instructor Card */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="bg-[#EBF3FF] border border-[#EBEBEB] rounded-[12px] p-6 mb-5"
						>
							<div className="bg-primary p-6 rounded-sm mb-4">
								<div className="body_lg text-white! mb-[17px]">Key Mentor</div>
								<div className="flex gap-3 items-center mb-4">
									<img
										src={data?.instructor?.user?.image || "/home/faq.png"}
										alt={data?.instructor?.user?.name || "Mentor"}
										className="w-[76px] h-[76px] rounded-full object-cover"
									/>
									<div>
										<div className="body_lg text-white! font-semibold">
											{data?.instructor?.user?.name || "Course Instructor"}
										</div>
										<div className="xxs_font">{subjects.join(", ")}</div>
										<div className="flex items-center gap-1.5 mt-1">
											<StarIcon size={16} />
											<span className="xxs_font text-[12px]">0</span>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h4 className="f14 font-semibold mb-2">Expert Mentor Panel</h4>
								<div className="space-y-3">
									{guestMentors.map((m, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: -30 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.1 }}
											className="flex items-center gap-4"
										>
											<img
												src="/home/tutor-1.png"
												alt={m.name}
												className="w-9 h-12 object-cover bg-white"
											/>
											<div>
												<div className="body_sm">{m.name}</div>
												<div className="flex items-center gap-1.5 mt-1">
													<StarIcon size={20} />
													<span className="xxs_font text-[12px] text-[#141B34]">
														4.5 Stars
													</span>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>

						{/* Popular SAT Courses */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="bg-white border border-[#EBEBEB] rounded-[12px] p-6"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="body_xl">Popular SAT Courses</div>
								<button
									type="button"
									className="body_md text-primary flex items-center gap-1"
								>
									View All <ArrowRightIcon size={20} />
								</button>
							</div>

							{popularCourses
								?.filter((course) => course.id !== data.id)
								?.map((course, i) => (
									<PopularCourseCard key={i} course={course} index={i} />
								))}
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
