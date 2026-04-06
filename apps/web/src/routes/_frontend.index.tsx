import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MoveRight } from "lucide-react";
import ArticlesSection from "@/components/homepage/ArticleSection";
// import ChooseProgramSection from "@/components/homepage/ChooseProgramSection";
import FAQSection from "@/components/homepage/FAQSection";
import FreeSeminarsSection from "@/components/homepage/Freeseminarssection";
import { InstructorsCarousel } from "@/components/homepage/InstructorCarousel";
import InstructorsSection from "@/components/homepage/InstructorsSection";
import SATStrategyCTA from "@/components/homepage/Newsletter";
import TestimonialCarousel from "@/components/homepage/Testimonials";
import UpcomingCourses from "@/components/homepage/UpcomingCourses";
import WhyPrepExcellence from "@/components/homepage/WhyPrepExcellence";
import { Subtitle } from "@/components/SectionSubtitle";
import { SectionTitle } from "@/components/SectionTitle";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_frontend/")({
	component: App,
	//   ssr: false,
});

function App() {
	const router = useRouter();
	return (
		<main>
			{/* Hero Section */}
			<section className=" ">
				<div className="container mx-auto  px-4 md:px-10 lg:px-16 py-14 md:py-[84px]">
					<h1 className="text-center h1 max-w-4xl mx-auto">
						Build stronger SAT scores with{" "}
						<span className="text-[#1552FD]">expert guidance</span>
					</h1>
					<Subtitle className="text-center p max-w-xl mx-auto">
						Live SAT courses, expert instructors, and a clear weekly plan that
						helps students improve scores with confidence.{" "}
					</Subtitle>
					<div className="flex items-center justify-center gap-[14px] h-[50px] mb-6">
						<Button variant="gradient" className="h-full">
							Explore SAT Program
						</Button>
						<Button variant="outline" className="h-full">
							Try a Mock Test
						</Button>
					</div>
					<div className="flex justify-center items-center  gap-4">
						<AvatarGroup className="w-fit">
							<Avatar>
								<AvatarImage
									src="https://github.com/shadcn.png"
									alt="@shadcn"
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<Avatar>
								<AvatarImage
									src="https://github.com/maxleiter.png"
									alt="@maxleiter"
								/>
								<AvatarFallback>LR</AvatarFallback>
							</Avatar>
							<Avatar>
								<AvatarImage
									src="https://github.com/evilrabbit.png"
									alt="@evilrabbit"
								/>
								<AvatarFallback>ER</AvatarFallback>
							</Avatar>
						</AvatarGroup>
						<Subtitle className="text-center mb-0">
							4.9 out of 5.00 by 14,000 people worldwide.
						</Subtitle>
					</div>
				</div>
				<div className="container mx-auto relative w-full ">
					<img
						src="https://picsum.photos/1400/600"
						alt=""
						className="w-full h-auto rounded-2xl "
					/>
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent rounded-2xl">
						{/* floating nav section */}
						<div className="">
							<div className="absolute left-1/2 top-6 -translate-x-1/2 z-30 w-[min(45%,1000px)]">
								<div className="bg-white/60 backdrop-blur-[30px] rounded-[16px] shadow-[0_4px_4px_0_rgb(0,0,0,0.25)] border border-[#EBEBEB] px-3 py-2 ">
									<nav className="w-full flex items-center justify-between gap-1 md:gap-4">
										<a
											href="#home"
											className="flex items-center gap-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
										>
											<span className="w-6 h-6 rounded-[6px] bg-white text-primary-dark flex items-center justify-center text-xs">
												🏠
											</span>
										</a>
										<a
											href="#programs"
											className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
										>
											<span className="hidden md:inline">Explore Programs</span>
										</a>

										<a
											href="#seminars"
											className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
										>
											<span className="hidden md:inline">Free Seminars</span>
										</a>

										<a
											href="#live-chat"
											className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
										>
											<span className="hidden md:inline">Live Chat</span>
										</a>
										<Button
											onClick={() =>
												router.navigate({
													to: "/test",
												})
											}
											size="sm"
											className="text-sm px-4 py-2 rounded-[6px] bg-white text-primary"
										>
											Free Mock Test
										</Button>
									</nav>
								</div>
							</div>
							<div className="absolute bottom-6 left-6 right-6 z-30 ">
								<div className="bg-white px-5 py-[18px] rounded-[6px]">
									<div className="flex justify-between items-center ">
										<div className="flex items-center">
											<span className="w-6 h-6 rounded-[6px] bg-white text-primary-dark flex items-center justify-center text-xs">
												🗓️
											</span>
											<div className="flex flex-col text-sm text-gray-700 ml-2">
												<span>Dr. Kaiser Alam</span>
												<span className="text-[#6C7179] text-[12px] leading-[18px] -tracking-[0.64]">
													Founder • Biomedical Engineer • 15+ Years of Teaching
													Experience
												</span>
											</div>
										</div>
										<Button variant={"outline"}>
											About Prep Excellence <MoveRight />
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 px-6 bg-white">
				<div className="max-w-6xl mx-auto">
					{/* Header */}
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold text-gray-900 mb-2">
							About Prep Excellence
						</h2>
						<Subtitle>
							Helping students improve scores with clarity and structure
						</Subtitle>
					</div>

					<div className="grid md:grid-cols-2 gap-12 items-cente mb-8">
						{/* Left Content */}
						<div className="space-y-8">
							<p className="text-[32px]  text-[#141B34] leading-[40px] -tracking-[1.5px]">
								Prep Excellence was built to remove confusion from SAT
								preparation. Too many students study without a plan, practice
								randomly, and don't see the results they're capable of.
							</p>

							<p className="text-[32px]  text-[#141B34] leading-[40px] -tracking-[1.5px]">
								We designed a system where students follow a clear path,
								practice consistently, and improve with confidence. Every week
								has a goal. Every session has a purpose.
							</p>
						</div>

						{/* Stats Card */}
						<div className="bg-blue-50 rounded-2xl p-5  md:p-[55px] h-full border border-blue-100">
							<div className="grid grid-cols-2 gap-10 h-full">
								{/* Stat 1 */}
								<div>
									<div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
										<span className="inline-block bg-primary size-3 rounded-full me-1.5" />
										Avg. Score Improvement
									</div>
									<div className="text-5xl font-bold text-primary">150+</div>
								</div>

								{/* Stat 2 */}
								<div>
									<div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
										<span className="inline-block bg-primary size-3 rounded-full me-1.5" />{" "}
										2000 Reviews
									</div>
									<div className="text-5xl font-bold text-primary">4.9</div>
								</div>

								{/* Stat 3 */}
								<div>
									<div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
										<span className="inline-block bg-primary size-3 rounded-full me-1.5" />
										Students Worldwide
									</div>
									<div className="text-5xl font-bold text-primary">2000+</div>
								</div>

								{/* Stat 4 */}
								<div>
									<div className="text-[#070420] text-[14px] leading-[20px] font-inter -tracking-[-0.5px] mb-6">
										<span className="inline-block bg-primary size-3 rounded-full me-1.5" />{" "}
										Expert Instructors
									</div>
									<div className="text-5xl font-bold text-primary">32+</div>
								</div>
							</div>
						</div>
					</div>
					<div className="block mx-auto">
						<Button
							variant="outline"
							className="group flex items-center justify-center gap-2 w-fit mx-auto"
						>
							Learn More About Us
							<MoveRight />
						</Button>
					</div>
				</div>
			</section>

			{/* Upcoming Courses Section */}
			<UpcomingCourses />
			{/* why prep excellence */}
			<WhyPrepExcellence />
			{/* Testimonials Section */}
			<TestimonialCarousel />
			{/* Choose Program Section */}
			{/* <ChooseProgramSection /> */}
			{/* Free seminar Section */}
			<FreeSeminarsSection />
			{/* Instructors Section */}
			<InstructorsSection />
			{/* FAQ Section */}
			<FAQSection />
		</main>
	);
}
