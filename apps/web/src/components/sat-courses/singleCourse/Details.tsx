import {
	ArrowRightIcon,
	CalendarIcon,
	CheckCircle2Icon,
	Clock,
	ClockIcon,
	DollarSignIcon,
	Play,
	User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CalenderSVG, PlayBtnSvg } from "@/components/SvgComponents";
import { Button } from "@/components/ui/button";

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

const BookIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<title>Book</title>
		<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
		<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
	</svg>
);

const VideoIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<title>Video</title>
		<polygon points="23,7 16,12 23,17" />
		<rect x="1" y="5" width="15" height="14" rx="2" />
	</svg>
);

const AwardIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<title>Award</title>
		<circle cx="12" cy="8" r="6" />
		<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
	</svg>
);

const TvIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
	>
		<title>TV</title>
		<rect x="2" y="7" width="20" height="15" rx="2" />
		<polyline points="17,2 12,7 7,2" />
	</svg>
);

// ── Data ──────────────────────────────────────────────────────────────────
const scheduleData = [
	{
		date: "Tue, April 7th",
		time: "9:00AM–10:00AM",
		activity: "Introductory Session",
	},
	{
		date: "Wed, April 8th",
		time: "10:00AM–12:00PM",
		activity: "Group Activity",
	},
	{ date: "Thu, April 9th", time: "2:00PM–5:00PM", activity: "Guest lecture" },
	{
		date: "Fri, April 10th",
		time: "9:00AM–11:00AM",
		activity: "Mock in Workshop",
	},
];

const whatIncluded = [
	{ icon: "/icons/video-replay.png", label: "5 hours on-demand video" },
	{ icon: "/icons/file.png", label: "Assignments" },
	{ icon: "/icons/clipboard.png", label: "1 article" },
	{ icon: "/icons/tv-smart.png", label: "Access on mobile and TV" },
	{ icon: "/icons/doc.png", label: "7 downloadable resources" },
	{ icon: "/icons/closed-caption.png", label: "Closed captions" },
	{ icon: "/icons/certificate.png", label: "Certificate of completion" },
];

const whatYouLearn = [
	"This course provides a comprehensive content that fits the time of introductory time available.",
	"You learn the fundamentals of design in a real company project with a career design specialist.",
	"During this course, you will collaborate with creative writers and help build products and brand",
	"Design at Scale! Effects of design in everyday learning.",
	"Focusing on design for human behavior with new digital design concepts.",
];

const guestMentors = [
	{ name: "Amy Hernandez", role: "Sr.Mentor", avatar: "AH", color: "#e0f2fe" },
	{ name: "Jelly Hamm", role: "Sr.Mentor", avatar: "JH", color: "#fef3c7" },
	{ name: "Alex Ross", role: "Jr.Mentor", avatar: "AR", color: "#f3e8ff" },
	{ name: "Joseph Kim", role: "Jr.Mentor", avatar: "JK", color: "#dcfce7" },
];

const popularCourses = [
	{
		title: "SAT Comprehensive",
		tag: "SAT",
		price: "$125 USD",
		main_price: "$150 USD",
		discount: "15% Off",
		date: "June 15, 2026",
		time: "08 weeks",
		weeks: "Mon, Wed, Fri — 6:00 PM",
		person: "Sara Mitchel",
		isVideo: false,
		img: "/home/course-1.jpg",
	},
	{
		title: "SAT Comprehensive",
		tag: "SAT",
		price: "$125 USD",
		main_price: "$150 USD",
		discount: "15% Off",
		date: "June 15, 2026",
		time: "08 weeks",
		weeks: "Mon, Wed, Fri — 6:00 PM",
		person: "Sara Mitchel",
		isVideo: true,
		img: "/home/course-2.jpg",
	},
	{
		title: "SAT Comprehensive",
		tag: "SAT",
		price: "$125 USD",
		main_price: "$150 USD",
		discount: "15% Off",
		date: "June 15, 2026",
		time: "08 weeks",
		weeks: "Mon, Wed, Fri — 6:00 PM",
		person: "Sara Mitchel",
		isVideo: true,
		img: "/home/course-3.jpg",
	},
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
	course: (typeof popularCourses)[0];
	index: number;
}) {
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
					src={course.img}
					alt={course.title}
					className="w-full h-full object-cover"
					whileHover={{ scale: 1.06 }}
					transition={{ duration: 0.4 }}
				/>
				<span className="absolute top-3 left-3 bg-[#1BA75C] text-white small font-medium px-3 py-1.5 rounded-sm">
					{course.discount}
				</span>

				{course.isVideo && (
					<motion.button
						whileHover={{ scale: 1.15 }}
						whileTap={{ scale: 0.95 }}
						type="button"
						className="absolute bottom-3 left-3 w-8 h-8 rounded-sm bg-white flex items-center justify-center shadow-sm"
					>
						<Play className="w-4 h-4 text-primary ml-0.5" />
					</motion.button>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<div className="text-[13px] font-semibold text-gray-900 leading-tight mb-3 line-clamp-2">
					{course.title}
				</div>
				<div className="flex flex-col gap-2">
					{[
						{
							icon: "dollar-circle.png",
							text: course.price,
							strike: course.main_price,
						},
						{ icon: "calendar.png", text: course.date },
						{ icon: "hourglass.png", text: course.time },
						{ icon: "clock-icon.png", text: course.weeks },
						{ icon: "user-circle-icon.png", text: course.person },
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
								{item.text}
								{item.strike && (
									<span className="line-through xxs_font text-[#A3A3A3] ml-1">
										{item.strike}
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

// ── Main Component ───────────────────────────────────────────────────────────
export default function SATCoursePage() {
	const [videoOpen, setVideoOpen] = useState(false);

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
							{videoOpen ? (
								<video
									src="/home/hero-video.mp4"
									className="w-full h-[450px] sm:h-[500px] lg:h-[512px] rounded-sm object-cover object-top"
									autoPlay
									muted
									loop
									playsInline
								/>
							) : (
								<img
									src="/leader-bg.png"
									alt="Play intro video"
									className="w-full h-[450px] sm:h-[500px] lg:h-[512px] rounded-sm object-cover object-top cursor-pointer"
									onClick={() => setVideoOpen(true)}
									onKeyDown={(e) => e.key === "Enter" && setVideoOpen(true)}
								/>
							)}

							<div className="absolute top-0 left-0 w-full h-full rounded-sm">
								<div className="absolute bottom-6 left-6 right-6 z-30">
									<div className="bg-white px-5 py-[18px] rounded-sm">
										<div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
											<div className="flex items-center">
												<motion.button
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.95 }}
													onClick={() => setVideoOpen((s) => !s)}
													className="w-12 h-12 rounded-sm bg-[#F8F8F9] text-primary-dark flex items-center justify-center hover:bg-blue-50 transition-colors"
												>
													<PlayBtnSvg />
												</motion.button>
												<div className="flex flex-col ml-6">
													<span className="p mb-1 font-semibold">
														Watch Course Preview
													</span>
													<span className="text-[#6C7179] text-[12px] leading-[18px] -tracking-[0.64px]">
														01m 20s
													</span>
												</div>
											</div>
											<Button
												variant="outline"
												className="h-[44px] w-full md:w-fit border-primary text-primary flex items-center gap-3"
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
							{/* Group Course badge */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="my-5"
							>
								<span className="rounded-sm px-5 py-2 bg-[#EBF3FF] text-primary! body_lg">
									Group Course
								</span>
							</motion.div>

							{/* Title */}
							<motion.h1
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="h3"
							>
								SAT Comprehensive Special Course for Summer
							</motion.h1>

							{/* Meta row */}
							<motion.div
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 }}
								className="flex flex-wrap items-center gap-4 mt-5 py-[5px]"
							>
								<span className="flex items-center gap-1.5">
									<CalenderSVG width="24" height="24" />{" "}
									<span className="body_sm">May 25, 2023</span>
								</span>
								<span className="flex items-center gap-1.5">
									<img src="/icons/hourglass.png" alt="" />{" "}
									<span className="body_sm">06 weeks</span>
								</span>
								<span className="flex items-center gap-1.5">
									<img src="/icons/clock-icon.png" alt="" />
									<span className="body_sm">Est. 10hr / Week</span>
								</span>
							</motion.div>

							<div className="border-t border-[#EBEBEB] my-5" />

							{/* Overview */}
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="mb-5"
							>
								<SectionTitle>Overview</SectionTitle>
								<p className="body_lg">
									This course is perfect for beginners looking to step into the
									world of visual design...
								</p>
								<p className="body_lg mt-2">
									Whether you're aiming to become a graphic designer or simply
									advance your creative skills...
								</p>
							</motion.div>

							<div className="border-t border-[#EBEBEB] my-5" />

							{/* What's Included */}
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="mb-5"
							>
								<SectionTitle>What's Included</SectionTitle>
								<div className="grid grid-cols-2 gap-y-2 gap-x-4">
									{whatIncluded.map((item, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: -30 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.08 }}
											className="flex items-center gap-2 text-sm text-gray-700"
										>
											<img
												src={item.icon}
												alt={item.label}
												className="text-black"
											/>
											<span className="body_sm">{item.label}</span>
										</motion.div>
									))}
								</div>
							</motion.div>

							<div className="border-t border-[#EBEBEB] my-5" />

							{/* What You'll Learn */}
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="mb-5"
							>
								<SectionTitle>What You'll Learn</SectionTitle>
								<div className="flex flex-col gap-2">
									{whatYouLearn.map((item, i) => (
										<motion.div
											key={i}
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											viewport={{ once: true }}
											transition={{ delay: i * 0.07 }}
											className="flex items-center gap-1"
										>
											<span className="mt-0.5 flex-shrink-0">
												<img
													src="/icons/checkmark-badge.png"
													alt="Check"
													className="w-5 h-5"
												/>
											</span>
											<span className="body_sm">{item}</span>
										</motion.div>
									))}
								</div>
							</motion.div>

							<div className="border-t border-gray-200 my-5" />

							{/* Certifications */}
							<motion.div
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="mb-5"
							>
								<SectionTitle>Certifications</SectionTitle>
								<p className="body_lg">
									This course is perfect for beginners...
								</p>
								<p className="body_lg mt-2">
									Whether you're aiming to become a graphic designer...
								</p>
							</motion.div>

							{/* Course Schedule */}
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
											{scheduleData.map((row, i) => (
												<motion.tr
													key={i}
													initial={{ opacity: 0, y: 20 }}
													whileInView={{ opacity: 1, y: 0 }}
													viewport={{ once: true }}
													transition={{ delay: i * 0.08 }}
													className={i % 2 === 0 ? "bg-white" : "bg-[#F8F8F9]"}
												>
													<td className="px-3 py-4 border-b border-[#EBEBEB] body_lg text-center font-semibold">
														{row.date}
													</td>
													<td className="px-3 py-4 border-b border-[#EBEBEB]">
														<div className="flex flex-col items-center">
															<span className="body_lg text-center font-normal">
																{row.time}
															</span>
															<span className="body_sm text-center font-normal">
																Creative Writing Workshop
															</span>
														</div>
													</td>
													<td className="px-3 py-4 border-b border-[#EBEBEB]">
														<div className="flex flex-col items-center">
															<span className="body_lg text-center font-normal">
																{row.activity}
															</span>
															<span className="body_sm text-center font-normal text-[#6C7179]">
																Creative Writing Workshop
															</span>
														</div>
													</td>
												</motion.tr>
											))}
										</tbody>
									</table>
								</div>
							</motion.div>
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
							{/* ... Instructor Card content remains the same ... */}
							<div className="bg-primary p-6 rounded-sm mb-4">
								<div className="body_lg text-white! mb-[17px]">Key Mentor</div>
								<div className="flex gap-3 items-center mb-4">
									<img
										src="/home/faq.png"
										alt="Kaiser Alam"
										className="w-[76px] h-[76px] rounded-full object-cover"
									/>
									<div>
										<div className="body_lg text-white! font-semibold">
											Dr. Kaiser Alam
										</div>
										<div className="xxs_font">
											Biomedical Engineer • 15+ Years of Teaching Experience
										</div>
										<div className="flex items-center gap-1.5 mt-1">
											<StarIcon size={16} />
											<span className="xxs_font text-[12px]">4.5/5</span>
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

							{popularCourses.map((course, i) => (
								<PopularCourseCard key={i} course={course} index={i} />
							))}
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
