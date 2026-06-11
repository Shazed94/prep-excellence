import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Dot, MoveRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import FooterTwo from "@/components/FooterTwo";
import { AboutAnimatedText } from "@/components/homepage/two/AnimatedParagraph";
import ChooseProgramSection from "@/components/homepage/two/ChooseProgramSection";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import FreeSeminarsSection from "@/components/homepage/two/Freeseminarssection";
import InstructorsSection from "@/components/homepage/two/InstructorsSection";
import TestimonialCarousel from "@/components/homepage/two/Testimonials";
import UpcomingCoursesSectionTwo from "@/components/homepage/two/UpcomingCoursesTwo";
import WhyPrepExcellence from "@/components/homepage/two/WhyPrepExcellence";
import { Subtitle } from "@/components/SectionSubtitle";
import { HeroHomeSvg, PlayBtnSvg } from "@/components/SvgComponents";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	fadeLeft,
	fadeRight,
	fadeUp,
	staggerContainer,
	viewportOnce,
} from "@/lib/animations";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export const Route = createFileRoute("/_frontend/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { openLoginPopup } = useLoginPopupStore();
	const navSentinelRef = useRef<HTMLDivElement>(null);
	const [navSticky, setNavSticky] = useState(false);
	const [videoOpen, setVideoOpen] = useState(false);

	useEffect(() => {
		const sentinel = navSentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			([entry]) => setNavSticky(!entry.isIntersecting),
			{ threshold: 0, rootMargin: "0px" },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, []);
	return (
		<>
			{/* Hero Section */}
			<section className=" relative pb-10 md:pb-20">
				<div className="container mx-auto px-4 md:px-10 lg:px-16 pt-10 md:pt-14 pb-[24px] md:pt-[84px] md:pb-[32px] z-20 relative">
					<motion.h1
						className="text-center h1 max-w-4xl mx-auto"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					>
						Build stronger SAT scores with{" "}
						<span className="text-[#1552FD]">expert guidance</span>
					</motion.h1>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.2,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<Subtitle className="max-w-xl ">
							Live SAT courses, expert instructors, and a clear weekly plan that
							helps students improve scores with confidence.{" "}
						</Subtitle>
					</motion.div>
					<motion.div
						className="flex items-center justify-center gap-[14px] md:h-[50px] mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.55,
							delay: 0.35,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<div className="flex flex-col md:flex-row w-auto justify-center gap-4">
							<Button
								variant="gradient"
								className="h-full px-12 md:px-[48px] py-[15px]"
							>
								Explore SAT Program
							</Button>
							<Button
								onClick={() => {
									if (user?.role === "Student") {
										navigate({ to: "/sat-practice" });
									} else {
										if (!user) {
											openLoginPopup("/sat-practice");
											return;
										}
										toast("You must be a student to access this page", {
											style: {
												background: "#fff",
												position: "relative",
												zIndex: 9999,
											},
										});
									}
								}}
								variant="outline"
								className="h-full w-44 mx-auto md:w-unset md:px-[48px] py-[15px]"
							>
								Try a Mock Test
							</Button>
						</div>
					</motion.div>
					<motion.div
						className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-4 "
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<AvatarGroup className="w-fit *:data-[slot=avatar]:ring-[2.5px]">
							<Avatar className="size-[30px]">
								<AvatarImage
									src="home/avatar-group-1.png"
									alt="@shadcn"
									className=""
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<Avatar className="size-[30px]">
								<AvatarImage src="home/avatar-group-2.png" alt="@maxleiter" />
								<AvatarFallback>LR</AvatarFallback>
							</Avatar>
							<Avatar className="size-[30px]">
								<AvatarImage src="home/avatar-group-3.png" alt="@evilrabbit" />
								<AvatarFallback>ER</AvatarFallback>
							</Avatar>
						</AvatarGroup>
						<Subtitle className="text-center mb-0! w-fit mx-0">
							4.9 out of 5.00 by 14,000 people worldwide.
						</Subtitle>
					</motion.div>
				</div>
				<motion.div
					className="container mx-auto relative w-full  px-4 md:px-0 z-20"
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.8,
						delay: 0.45,
						ease: [0.22, 1, 0.36, 1],
					}}
				>
					{videoOpen ? (
						<video
							src="/home/hero-video.mp4"
							className="w-full h-[450px] sm:h-[500px] lg:h-[620px] rounded-2xl object-cover object-top cursor-pointer"
							autoPlay
							muted
							loop
							playsInline
						/>
					) : (
						<img
							src="/leader-bg.png"
							alt="Play intro video"
							className="w-full h-[450px] sm:h-[500px] lg:h-[620px] rounded-2xl object-cover object-top cursor-pointer"
							onClick={() => setVideoOpen(true)}
							onKeyDown={(e) => e.key === "Enter" && setVideoOpen(true)}
						/>
					)}
					<div className="absolute top-0 left-0 w-full h-full rounded-2xl">
						{/* floating nav section */}
						<div className="">
							{/* Sentinel — marks the original position of the nav */}
							<div
								ref={navSentinelRef}
								className="absolute left-1/2 top-6 -translate-x-1/2 w-full sm:w-[min(80%,1200px)] lg:w-[min(630px,1000px)] h-[64px] pointer-events-none"
							/>

							{/* Desktop floating nav */}
							<motion.div
								key={navSticky ? "fixed" : "absolute"}
								className={`hidden md:block z-50 px-4 sm:px-0 w-full sm:w-[min(80%,1200px)] lg:w-[min(630px,1000px)] ${
									navSticky
										? "fixed top-4 left-1/2 -translate-x-1/2"
										: "absolute left-1/2 top-6 -translate-x-1/2"
								}`}
								initial={
									navSticky ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }
								}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
							>
								<div className="bg-white/60 backdrop-blur-[30px] rounded-[16px] shadow-[inset_0px_4px_4px_0px_#FFFFFF40] border border-[#EBEBEB] px-3 py-[10px]">
									<nav className="w-full flex items-center justify-between gap-1 md:gap-4 lg:gap-[28px]">
										<a
											href="#home"
											className="flex items-center rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
										>
											<span className="w-10 h-10 rounded-[6px] bg-white text-primary-dark flex items-center justify-center text-xs">
												<HeroHomeSvg width="21" height="21" />
											</span>
										</a>
										<a
											href="#programs"
											className="flex items-center text-[16px] leading-[22px] -tracking-[0.64px] text-[#141B34] font-medium"
										>
											Explore Programs
										</a>
										<a
											href="#seminars"
											className="flex items-center text-[16px] leading-[22px] -tracking-[0.64px] text-[#141B34] font-medium"
										>
											Free Seminars
										</a>
										<a
											href="#live-chat"
											className="flex items-center text-[16px] leading-[22px] -tracking-[0.64px] text-[#141B34] font-medium"
										>
											Live Chat
										</a>
										<Button
											onClick={() => {
												if (user?.role === "Student") {
													navigate({ to: "/sat-practice" });
												} else {
													if (!user) {
														openLoginPopup("/sat-practice");
														return;
													}
													toast("You must be a student to access this page", {
														style: {
															background: "#fff",
															position: "relative",
															zIndex: 9999,
														},
													});
												}
											}}
											size="sm"
											className="text-[16px] leading-[22px] -tracking-[0.64px] px-[19px]! py-[11px] rounded-[6px] bg-white hover:bg-white! text-primary h-[44px] cursor-pointer"
										>
											Free Mock Test{" "}
											<ArrowRight
												strokeWidth={2.5}
												className="ms-1 size-[18px]"
											/>
										</Button>
									</nav>
								</div>
							</motion.div>

							{/* Mobile sticky scrollable nav */}
							<motion.div
								key={navSticky ? "mobile-fixed" : "mobile-fixed"}
								className={`block md:hidden z-50 w-full px-3.5 absolute top-0 left-0 right-0 `}
								initial={
									navSticky ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }
								}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
							>
								<div className="bg-white/60 backdrop-blur-[30px] rounded-[16px] shadow-[inset_0px_4px_4px_0px_#FFFFFF40] border border-[#EBEBEB] px-3 py-[10px]">
									<nav className="flex items-center justify-between gap-3 overflow-x-auto scrollbar-hide w-full py-1">
										<a
											href="#programs"
											className="flex-shrink-0 text-[14px] leading-[20px] -tracking-[0.5px] text-[#141B34] flex flex-1 flex-col justify-center items-center font-medium whitespace-nowrap  py-2 rounded-[6px] bg-[#EBF3FF] hover:bg-gray-100 transition"
										>
											<img src="/course.png" alt="" />
											<span>Programs</span>
										</a>

										<a
											href="#seminars"
											className="flex-shrink-0 text-[14px] leading-[20px] -tracking-[0.5px] text-[#141B34] flex flex-1 flex-col justify-center items-center font-medium whitespace-nowrap  py-2 rounded-[6px] bg-[#EBF3FF] hover:bg-gray-100 transition"
										>
											<img src="/whiteboard.png" alt="" />
											<span>Seminars</span>
										</a>

										<a
											href="#chat"
											className="flex-shrink-0 text-[14px] leading-[20px] -tracking-[0.5px] text-[#141B34] flex flex-1 flex-col justify-center items-center font-medium whitespace-nowrap  py-2 rounded-[6px] bg-[#EBF3FF] hover:bg-gray-100 transition"
										>
											<img src="/chat-feedback.png" alt="" />
											<span>Chat</span>
										</a>

										<a
											href="#mock-test"
											// onClick={() => {
											//   if (user?.role === "Student") {
											//     navigate({ to: "/sat-practice" });
											//   } else {
											//     if (!user) {
											//       openLoginPopup("/sat-practice");
											//       return;
											//     }
											//     toast("You must be a student to access this page", {
											//       style: {
											//         background: "#fff",
											//         position: "relative",
											//         zIndex: 9999,
											//       },
											//     });
											//   }
											// }}
											className="flex-shrink-0 text-[14px] leading-[20px] -tracking-[0.5px] text-[#141B34] flex flex-1 flex-col justify-center items-center font-medium whitespace-nowrap  py-2 rounded-[6px] bg-[#EBF3FF] hover:bg-gray-100 transition"
										>
											<img
												src="/notebook.png"
												alt=""
												className="w-[22px] h-auto"
											/>
											<span> Mock Test </span>
										</a>
									</nav>
								</div>
							</motion.div>

							<div className="absolute bottom-6 left-6 right-6 z-30 ">
								<div className="bg-white px-5 py-[18px] rounded-[6px]">
									<div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
										<div className="flex items-center">
											<button
												type="button"
												aria-label={
													videoOpen ? "Pause intro video" : "Play intro video"
												}
												onClick={() => setVideoOpen((s) => !s)}
												className="w-[48px] h-[48px] rounded-[6px] bg-[#F8F8F9] text-primary-dark flex items-center justify-center text-xs hover:bg-blue-50 transition-colors cursor-pointer"
											>
												<PlayBtnSvg />
											</button>
											<div className="flex flex-col ml-2">
												<span className="p mb-1! font-semibold!">
													Dr. Kaiser Alam
												</span>
												<span className="text-[#6C7179] text-[12px] leading-[18px] -tracking-[0.64px]">
													Founder{" "}
													<Dot
														size={11}
														strokeWidth={7}
														className="inline-block mx-0 px-0"
													/>
													Biomedical Engineer{" "}
													<Dot
														size={11}
														strokeWidth={7}
														className="inline-block mx-0 px-0"
													/>{" "}
													15+ Years of Teaching Experience
												</span>
											</div>
										</div>
										<Button
											variant={"outline"}
											className="h-[44px] w-full md:w-fit"
										>
											About Prep Excellence <MoveRight />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
				<img
					src="/bg.png"
					alt=""
					className="absolute inset-0 w-full h-full object-cover z-0"
				/>
				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.6) 60%, #ECF1FE 85%, rgba(21,82,253,0.35) 100%)",
					}}
				/>
			</section>

			{/* About Section */}
			<section className="py-8 md:py-16 px-4 bg-white">
				<div className="container mx-auto">
					{/* Header */}
					<motion.div
						className="text-center mb-12"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<h2 className="h2">About Prep Excellence</h2>
						<Subtitle>
							Helping students improve scores with clarity and structure
						</Subtitle>
					</motion.div>

					<div className="flex flex-col md:flex-row gap-12 items-cente mb-10 justify-between">
						{/* Left Content */}
						<motion.div
							className="space-y-8 w-full md:w-[58%]"
							variants={fadeLeft}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							<AboutAnimatedText />
						</motion.div>

						{/* Stats Card */}
						<motion.div
							className="bg-blue-50 rounded-2xl p-3 sm:p-5 lg:p-[55px] h-full border border-blue-100"
							variants={fadeRight}
							initial="hidden"
							whileInView="visible"
							viewport={viewportOnce}
						>
							<motion.div
								className="grid grid-cols-2 gap-10 h-full"
								variants={staggerContainer}
								initial="hidden"
								whileInView="visible"
								viewport={viewportOnce}
							>
								{[
									{ label: "Avg. Score Improvement", value: "150+" },
									{ label: "2000 Reviews", value: "4.9" },
									{ label: "Students Worldwide", value: "2000+" },
									{ label: "Expert Instructors", value: "32+" },
								].map((stat) => (
									<motion.div key={stat.label} variants={fadeUp}>
										<div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
											<span className="inline-block bg-primary size-1.5 rounded-full me-1.5" />
											<span className="f14 -tracking-[0.5px]! font-medium text-[#141B34] pb-2  border-b border-b-[#EBEBEB]">
												{stat.label}
											</span>
										</div>
										<div className="text-[48px] leading-[56px] -tracking-[2px] font-semibold text-primary">
											{stat.value}
										</div>
									</motion.div>
								))}
							</motion.div>
						</motion.div>
					</div>
					<motion.div
						className="block mx-auto"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						viewport={viewportOnce}
					>
						<Button
							variant="outline"
							className="group flex items-center justify-center gap-2 w-fit h-[44px] mx-auto"
						>
							Learn More About Us
							<MoveRight />
						</Button>
					</motion.div>
				</div>
			</section>

			{/* Upcoming Courses Section */}
			<UpcomingCoursesSectionTwo />
			{/* why prep excellence */}
			<WhyPrepExcellence />
			{/* Testimonials Section */}
			<TestimonialCarousel />
			{/* Choose Program Section */}
			<ChooseProgramSection />

			{/* Free seminar Section */}
			<FreeSeminarsSection />
			{/* Instructors Section */}
			<InstructorsSection />
			{/* FAQ Section */}
			<FAQSectionTwo />

			<FooterTwo showCta />
		</>
	);
}
