import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import ArticlesSection from "@/components/homepage/ArticleSection";
import FAQSection from "@/components/homepage/FAQSection";
import { InstructorsCarousel } from "@/components/homepage/InstructorCarousel";
import SATStrategyCTA from "@/components/homepage/Newsletter";
import TestimonialCarousel from "@/components/homepage/Testimonials";
import UpcomingCourses from "@/components/homepage/UpcomingCourses";
import { SectionTitle } from "@/components/SectionTitle";
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
			<section className="relative min-h-[calc(100dvh-102px)] ">
				<div className="container mx-auto px-6 md:px-10 lg:px-16 xl:px-24 py-14 md:py-24">
					<div className="absolute left-10 top-8 size-40 blur-[180px] bg-[#9BFF00] -z-10" />
					<div className="absolute left-[40%] top-[40%] size-40 blur-[200px] bg-[#6965EB] -z-10" />
					<div className="absolute left-28 bottom-10 size-40 blur-[200px] bg-[#FF0030] -z-10" />

					<div className="flex flex-col md:flex-row gap-14 md:gap-10 items-center ">
						{/* Left Content */}
						<div className="space-y-6 w-full md:w-2/3 ">
							{/* Small Header */}
							<div className="flex items-center gap-2 relative">
								<motion.img
									src="/home/book.png"
									alt="Student Avatar"
									className="w-16 h-16 absolute -left-5 md:-left-10 -top-[70px] md:-top-20 "
									animate={{ y: [0, 20, 0] }} // moves down 20px and back
									transition={{
										duration: 3,
										repeat: Infinity,
										repeatType: "loop",
										ease: "easeInOut",
									}}
								/>{" "}
								<span className="text-sm font-medium text-black uppercase tracking-wide">
									YOUR ALL-IN-ONE LEARNING PLATFORM
								</span>
							</div>

							{/* Main Heading */}
							<h1 className="text-3xl lg:text-[59px] font-bold leading-tight">
								<span className="text-primary">High-Quality </span>
								<span className="text-secondary">SAT </span>{" "}
								<span className="text-primary">Courses </span>
								<br className="hidden md:block" />
								<span className="text-primary">Designed To Help You </span>
								<br className="hidden md:block" />
								<span className="text-primary">Score Higher</span>
							</h1>

							{/* Description */}
							<p className="text-[#191919] text-[14px] md:text-lg leading-relaxed max-w-2xl">
								Our platform offers SAT prep, K–12 tutoring, and coaching for
								SAT, ACT, and AP subjects. We also assist students with college
								applications and essay reviews. We focus on clear instruction
								and structured guidance to support students in their academic
								progress.
							</p>

							{/* CTA Buttons */}
							<div className="flex flex-wrap items-center gap-4">
								<Link to="/register-sat">
									<Button className=" hover:bg-[#0086c5]/90 text-white px-4 md:px-8 py-5 text-[11px] md:text-[14px] md:text-base cursor-pointer">
										Register SAT Classes
									</Button>
								</Link>
								<Link to="/tutor-request">
									<Button className="bg-accent hover:bg-[#ef782e]/90 text-white px-4 md:px-8 py-5 text-[11px] md:text-[14px] md:text-base cursor-pointer">
										Request 1-On-1 Tutor
									</Button>
								</Link>
								{/* Decorative Badge - Bottom Left */}
								<motion.img
									src="/home/pencil.gif"
									alt="Student Avatar"
									className="w-8 h-8 ms-5 -mt-10 hidden md:block"
									animate={{ y: [0, 20, 0] }} // moves down 20px and back
									transition={{
										duration: 3,
										repeat: Infinity,
										repeatType: "loop",
										ease: "easeInOut",
									}}
								/>
							</div>

							{/* Rating */}
							<div className="flex items-center gap-3 pt-4">
								<div className="flex items-center gap-1">
									{[1, 2, 3, 4].map((i) => (
										<Star
											key={i}
											className="w-5 h-5 fill-[#f7b03f] text-[#f7b03f]"
										/>
									))}
									<Star className="w-5 h-5 text-[#f7b03f]" />
								</div>
								<span className="text-[#191919] font-semibold">4/5</span>
								<span className="text-[#848484] text-sm">
									From 2000+ reviews
								</span>
							</div>
						</div>

						{/* Right Illustration */}
						<div className="relative  w-full md:w-1/3 border-[#65C0EB] border rounded-lg pr-2">
							{/* Main Illustration */}
							<div className="z-10 w-full ">
								<img
									src="/home/hero-banner.png"
									alt="Students climbing books illustration"
									width={600}
									height={600}
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="hidden z-10 md:absolute top-6 -left-28 h-20 object-contain ">
								<div className="bg-white p-2 rounded-tl-[20px] rounded-bl-[20px] rounded-tr-[20px] rounded-br-0 overflow-hidden">
									<img
										src="/home/banner-box-1.png"
										alt=""
										width={400}
										height={300}
										className="w-full h-20 object-contain"
									/>
									<div className="flex flex-col gap-1 absolute top-2 inset-x-2">
										<div className="flex items-center gap-0.5 px-2.5 pt-2.5">
											<img
												src="/home/students-images.png"
												alt=""
												width={400}
												height={300}
												className="w-full object-contain h-9"
											/>
											<span className="text-black font-bold">30k+</span>
										</div>
										<span className="text-[12px] text-muted px-1">
											{" "}
											Students enrolled for classes
										</span>
									</div>
								</div>
							</div>

							<div className="absolute bottom-0 left-0 rounded-lg overflow-hidden">
								<img
									src={`/home/self-improvement.gif`}
									alt={"Student Avatar"}
									className="w-20  h-20"
								/>
							</div>
							{/* Decorative Lightning Icon */}
							<div className="absolute -top-14 md:-top-20 -right-0 md:-right-8 rounded-lg bg-white overflow-hidden">
								<img
									src={"/home/thunder.gif"}
									alt={"Student Avatar"}
									className="w-12 h-12 md:w-16 md:h-16 rotate-15"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Upcoming Courses Section */}
			<UpcomingCourses />
			{/* Testimonials Section */}
			<TestimonialCarousel />

			<section className="relative">
				{/* Statistics */}
				<section className="bg-[#d9e6ed]/40 flex items-center justify-center py-8 md: py-8 md:py-20 ">
					<span
						className="bg-[#9BFF00] size-32 rounded-full blur-[120px] 
        absolute right-0 -translate-x-1/2 top-[40%] -translate-y-1/2 z-0"
					/>
					<div className="w-full container mx-auto bg-primary-dark rounded-2xl p-12">
						<div className="text-center mb-12">
							<h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
								Achieve your Goals with PrepExcellence
							</h1>
							<p className="text-white text-lg md:text-xl">
								98% of Prep Excellence students achieve a 100+ point score
								improvement within six weeks
							</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-0 md:divide-x md:divide-white/30">
							<div className="text-center">
								<div className="text-white text-3xl md:text-4xl font-bold mb-1">
									350+
								</div>
								<div className="text-white text-base md:text-lg">Events</div>
							</div>

							<div className="text-center">
								<div className="text-white text-3xl md:text-4xl font-bold mb-1">
									1300+
								</div>
								<div className="text-white text-base md:text-lg">Teachers</div>
							</div>

							<div className="text-center">
								<div className="text-white text-3xl md:text-4xl font-bold mb-1">
									35k+
								</div>
								<div className="text-white text-base md:text-lg">Students</div>
							</div>

							<div className="text-center">
								<div className="text-white text-3xl md:text-4xl font-bold mb-1">
									3211
								</div>
								<div className="text-white text-base md:text-lg">Courses</div>
							</div>

							{/* Countries - centered on mobile */}
							<div className="text-center col-span-2 md:col-span-1">
								<div className="text-white text-3xl md:text-4xl font-bold mb-1">
									13
								</div>
								<div className="text-white text-base md:text-lg">Countries</div>
							</div>
						</div>
					</div>
				</section>

				{/* Leader Note Section */}
				<section className="bg-[#FAFAFA] py-8 md:py-20 relative">
					<span
						className="bg-[#FF0030] size-32 rounded-full blur-[120px] 
        absolute -left-14 top-[50%] -translate-y-1/2 z-0"
					/>
					<div className="container mx-auto px-6">
						<div className="grid lg:grid-cols-2 gap-12 items-center ">
							{/* Left Content */}
							<div className="space-y-6 ">
								<h2 className="text-3xl font-bold text-[#191919] mb-6">
									A Note From Our Leader
								</h2>

								<p className="text-[#191919] leading-relaxed">
									What if one course could change the entire direction of a
									student's future? At Prepexcellence, we believe it can. Every
									year, we help students raise their SAT scores, strengthen
									their academic foundation, and open doors to universities and
									scholarships they once thought were out of reach. With a
									curriculum built by experts and taught by top-performing
									instructors, our programs give students the clarity, strategy,
									and confidence they need to excel. In a time when test scores
									once again influence admissions and scholarship opportunities,
									the right preparation matters more than ever.
								</p>

								<p className="text-[#191919] leading-relaxed">
									<span className="font-semibold">Our mission is simple:</span>{" "}
									to empower every student to achieve results they can be proud
									of—and futures they can be excited about. We're here to guide
									your child every step of the way.
								</p>

								{/* Name and Title */}
								<div className="pt-6">
									<h3 className="text-xl font-bold text-[#191919]">
										Dr. Kaisar Alam
									</h3>
									<p className="text-[#848484]">Biomedical Engineer</p>
								</div>
							</div>

							{/* Right Image */}
							<div className="flex justify-center lg:justify-end">
								<div className="relative w-full max-w-md">
									<img
										src="https://fastly.picsum.photos/id/232/200/300.jpg?hmac=gKjjTzgze6zNtZ18auID-rFWicbAFye1rka78Q8DeDE"
										alt="Dr. Kaisar Alam"
										width={500}
										height={600}
										className="w-full h-auto object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</section>

			{/* programs */}
			<section className="bg-[#D9E6ED]/40 py-16 lg:py-24 relative">
				<span className="bg-[#6965EB] size-40 blur-[200px] absolute right-0 bottom-20" />
				<div className="container mx-auto px-6">
					<div className="grid lg:grid-cols-2 gap-4 md:gap-12 items-center container mx-auto">
						{/* Left: Promo Card */}
						<div className=" overflow-hidden border border-gray-100">
							<div className="">
								<div className="flex justify-center mb-6">
									<img
										src="/home/programs.png"
										alt="Students preparing for SAT"
										className="w-full h-full object-contain"
									/>
								</div>
							</div>
						</div>

						{/* Right: Text + CTA */}
						<div className="flex flex-col justify-center space-y-8">
							<h2 className="text-[28px] font-bold text-primary-light leading-tight">
								Explore Our Programs & Upcoming Opportunities
							</h2>
							<p className="text-[19px] text-gray-700 leading-relaxed">
								Discover our latest offers, courses, and exclusive opportunities
								showcased below. Each poster highlights a carefully designed
								program created to support students at every stage of their
								academic journey.
							</p>
							<p className="text-[19px] text-gray-700 leading-relaxed">
								Whether it’s a new SAT preparation batch, special discounts on
								tutoring packages, or unique options for personalized academic
								support, our offerings are built to help students learn smarter
								and achieve better results. Take a moment to explore the
								featured updates, understand what each program provides, and
								register instantly for the options that best match your academic
								goals and learning needs.
							</p>

							<div className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
								<div className=" pt-2 md:pt-6">
									<Button
										size="lg"
										className=" text-white bg-primary-dark font-semibold rounded-sm px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
									>
										Register for Classes
									</Button>
								</div>
								<div className="pt-2 md:pt-6">
									<Button
										size="lg"
										className=" text-white bg-accent font-semibold rounded-sm px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
									>
										Request Admission Consulting
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Seminar Section */}
			<section className="bg-[#FAFAFA] py-10 md:py-40 relative">
				<span
					className="bg-[#9BFF00] size-32 rounded-full blur-[120px] 
        absolute left-0 top-[20%] -translate-y-1/2 z-0"
				/>
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center bg-accent">
						{/* Left - Seminar Poster */}
						<div className="flex justify-center lg:justify-end md:pe-16">
							<div className="max-w-md">
								<img
									src="/home/seminar.png"
									alt="Free SAT Seminar Poster"
									width={450}
									height={550}
									className="w-full h-auto scale-110 md:scale-125"
								/>
							</div>
						</div>

						{/* Right - CTA Content */}
						<div className="rounded-3xl px-5 py-12 text-primary-light">
							<div className="space-y-6 text-center md:text-left">
								<p className="text-[20px] md:text-[24px] font-bold">
									Join Our Upcoming{" "}
									<span className="font-bold text-white">FREE</span> Seminar
								</p>

								<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
									Proven Strategies to Boost Your SAT Score
								</h2>

								<p className="text-[16px] md:text-[19px] text-white leading-relaxed max-w-[520px] mx-auto md:mx-0">
									Covers test-taking strategies, time management, and score
									improvement techniques.
								</p>

								{/* Button center on mobile */}
								<div className="flex justify-center md:justify-start">
									<Button
										onClick={() =>
											router.navigate({
												to: "/free-seminar-registration",
											})
										}
										type="button"
										className="bg-primary-dark text-[16px] md:text-[18px] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105"
									>
										Register for Seminar
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Latest News & Articles Section */}
			<section className="bg-[#D9E6ED]/40 py-10 md:py-20">
				<div className="container mx-auto px-4 md:px-6">
					{/* Section Header */}
					<div className="text-center mb-16">
						<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
							{" "}
							Latest News & Articles
						</SectionTitle>
						<p className="text-muted text-[17px] max-w-[900px] mx-auto">
							If you are going to use a passage of Lorem Ipsum, you need to be
							sure there isn't anything embarrassing hidden in the middle of
							text
						</p>
					</div>

					{/* Articles Grid with Navigation */}
					<ArticlesSection />
				</div>
			</section>

			{/* Our Top Instructors Section */}
			<section className="py-10 md: py-8 md:py-20 px-4 bg-white">
				<div className="container mx-auto">
					{/* Section Header */}
					<div className="text-center mb-16">
						<SectionTitle accentClassName="left-1/2 -translate-x-1/2">
							Our Top Instructors
						</SectionTitle>
						<p className="text-muted text-[17px] max-w-[950px] mx-auto mt-6 leading-relaxed">
							Our instructors are the heart of Prep Excellence. They are not
							just teachers; they are verified experts who have scored in the
							top 1% of the SAT. They bring passion, deep subject knowledge, and
							the strategic edge you need.
						</p>
					</div>

					{/* Instructors Carousel */}
					<InstructorsCarousel />
				</div>
			</section>

			{/* CTA */}
			<SATStrategyCTA />

			{/* Trusted By Section */}
			{/* <TrustedByCarousel /> */}

			{/* FAQ Section */}
			<FAQSection />
		</main>
	);
}
