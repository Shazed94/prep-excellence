// app/about/our-passion-section.tsx   (or wherever you want to place it)

import { Link } from "@tanstack/react-router";
import { Dot, MoveRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Breadcrumb } from "../breadcrumb";
import { Subtitle } from "../SectionSubtitle";
import { PauseButtonSvg, PlayBtnSvg } from "../SvgComponents";
import { Button } from "../ui/button";

// ↑ replace with your actual images or use placeholders

export const AboutHero = () => {
	const [videoOpen, setVideoOpen] = useState(false);

	return (
		<section className=" py-8 md:py-16 relative">
			<div className="">
				<Breadcrumb alignment="center">
					Home /{" "}
					<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
						About
					</span>
				</Breadcrumb>

				<div className="text-center mb-10">
					<h2 className="h2">About Prep Excellence</h2>
					<Subtitle alignment="center" className=" max-w-xl">
						Prep Excellence helps students improve SAT performance through
						structured learning, expert instruction, and consistent practice.
					</Subtitle>
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
							<div className="absolute bottom-6 left-6 right-6 z-30 ">
								<div className="bg-white px-5 py-[18px] rounded-[6px]">
									<div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
										<div className="flex items-center">
											<button
												type="button"
												aria-label={
													videoOpen ? "Pause intro video" : "Play intro video"
												}
												onClick={() => setVideoOpen((prev) => !prev)}
												className="w-[48px] h-[48px] rounded-[6px] bg-[#F8F8F9] text-primary-dark flex items-center justify-center text-xs hover:bg-blue-50 transition-colors cursor-pointer"
											>
												{videoOpen ? <PauseButtonSvg /> : <PlayBtnSvg />}
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
										<Link to="/about-us" className="h-[44px] w-full md:w-fit">
											<Button
												variant={"outline"}
												className="h-[44px] w-full md:w-fit"
											>
												About Prep Excellence <MoveRight />
											</Button>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
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
	);
};
