import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/SectionTitle";

export const Route = createFileRoute("/_frontend/free-seminar-registration")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<section className="py-20 px-4 md:px-6 bg-linear-to-r from-[#BBDEEF]/40/30 from-0% to-[#FFFFFF] to-53%  shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
				<div className="mx-auto container ">
					<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
						{/* Left side - Title and description */}
						<div className="max-w-[750px]">
							<h2 className="mb-4 text-3xl font-bold">
								Join Our Free Seminar — Register Now
							</h2>
							<p className="text-sm leading-relaxed text-muted">
								Join our free seminar and take the first step toward mastering
								your exam preparation with confidence. Learn how to study
								smarter, manage your time effectively, and maximize your scores
								while gaining insights that can make a real difference in your
								academic performance. Don’t miss this opportunity to interact
								with top educators, ask your questions, and get actionable
								advice that can help you achieve your goals.
							</p>
						</div>

						{/* Right side - Stats / Images */}
						<div className="relative flex flex-col md:flex-row justify-center lg:justify-end gap-4 w-full md:w-auto">
							{/* Left Image */}
							<img
								src="/home/free-seminar-banner-1.png"
								alt="Team"
								className="rounded-md shadow-2xl object-cover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
							/>

							{/* Right Image */}
							<img
								src="/home/free-seminar-banner-2.png"
								alt="Team"
								className="rounded-md shadow-2xl object-cover w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transform md:-translate-x-12 md:translate-y-8 mt-4 md:mt-0"
							/>
						</div>
					</div>
				</div>
			</section>
			{/* Webinar Section */}

			<section className=" relative">
				<span className="size-32 rounded-full bg-[#6965EB] blur-[120px] absolute right-0 top-0 -z-10" />

				<div className="container mx-auto w-full">
					<div className="px-4 md:px-16 py-12 md:py-24">
						<SectionTitle accentClassName="hidden">
							Register Now for the Free Webinar
						</SectionTitle>

						<p className="mb-6 md:mb-12 text-[12px] md:text-[19px]">
							Are test-optional policies making you question the importance of
							the SAT/PSAT? Join Dr. Alam, a top SAT Coach and College
							Admissions Expert, to uncover why these scores remain a powerful
							tool for college acceptance and scholarships!
						</p>

						<p className="mb-6 md:mb-12 text-gray-700">
							Prep Excellence, MPS, and NSBE present a{" "}
							<span className="font-semibold">FREE webinar: </span>{" "}
							<span className="bg-primary-dark text-white font-semibold text-[12px] md:text-[22px] px-2 py-0.5">
								{" "}
								"Beyond Talks–Optional: Why the SAT/PSAT Still Matters for
								College"
							</span>
						</p>

						<div className="space-y-1 font-semibold  mb-6 md:mb-12">
							<div className="flex items-center gap-2">
								📅 Saturday, August 23rd —{" "}
								<span className="text-destructive">
									Please note the DATE CHANGE
								</span>{" "}
							</div>
							<div className="flex items-center gap-2">
								🕐 12:00 – 1:30 PM EDT / 11:00 AM – 12:30 PM CDT / 9 AM - 10:30
								AM PDT
							</div>
							<div className="flex items-center gap-2">
								📍 Venue: Online (Zoom) -{" "}
								<span className="text-destructive">
									IA the link will be sent to the registrants before the webinar
								</span>{" "}
							</div>
						</div>

						<div className="space-y-6  mb-6 md:mb-12">
							<h4 className="text-primary-dark text-[24px] font-bold mb-6 md:mb-12">
								✅ Why You Should Attend:
							</h4>
							<p>
								💡 Navigate the true role of SAT/PSAT scores in today's college
								admissions landscape.
							</p>
							<p>
								📝 Discover how strong scores can set you apart, even at
								test-optional institutions.
							</p>
							<p>
								💰 Uncover strategies for maximizing scholarship opportunities
								through standardized tests.
							</p>
							<p>
								🏅 Understand the path to National Merit recognition via the
								PSAT.
							</p>
							<p>
								🛠️ PLUS! Get exclusive SAT prep tips from a student who aced the
								exam! 
							</p>
							<p>➕ And more</p>
						</div>

						<h5 className="text-accent text-[23px] font-bold mb-6 md:mb-12">
							This webinar is a must-attend for high school students (Grades
							9-12) and parents preparing for college!
						</h5>

						<h4 className="text-primary-dark text-[24px] font-bold mb-6 md:mb-12">
							✅  Organizer(s) and Presenter(s):
						</h4>

						<div className="ps-5">
							<p className="text-[19px] mb-6 md:mb-12">
								<span className="font-semibold">
									1. Professor Saira Chaudhry, 
								</span>
								<br />
								<span className="ps-2"> Career Coach</span>
								<br />
								<span className="ps-2">
									 Co-Organizer, Webinar Co-Presenter
								</span>
							</p>
							<p className="text-[19px] mb-6 md:mb-12">
								<span className="font-semibold">
									2. Dr. Kaisar Alam, SAT Coach, 
								</span>
								<br />
								<span className="ps-2"> Educator / Scientist / Author</span>
								<br />
								<span className="ps-2"> Organizer, Webinar Presenter</span>
							</p>

							<p className="text-[19px] mb-6 md:mb-12">
								Please answer the questions below so that the presenters have a
								good idea about what to cover.
							</p>

							<p className="text-[19px]">
								<span className="text-destructive ">Note:</span> By registering,
								you consent to receive emails from Prep Excellence, including
								webinar follow-ups, valuable college admissions content, and
								updates on our related offerings. You retain full control and
								can unsubscribe easily via any email's link or by contacting
								unsubscribe@prepexcellence.com. Your attendance is not
								conditional on this consent.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
