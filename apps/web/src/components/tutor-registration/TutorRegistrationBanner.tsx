import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";

export default function TutorRegistrationBanner() {
	return (
		<section className="py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40/30 from-0% to-[#FFFFFF] to-53%  shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="mx-auto container">
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
					{/* Left side - Title and description */}
					<div className="max-w-[750px]">
						<SectionTitle accentClassName="hidden">
							Start Your Teaching Journey
						</SectionTitle>
						<Subtitle className="text-left">
							Sign up as a tutor and connect with students who truly need your
							guidance and support. Build a complete professional profile,
							showcase your expertise, select the subjects you’re passionate
							about, and begin empowering learners from all backgrounds. Whether
							you’re teaching academic topics or sharing specialized skills,
							this is your opportunity to inspire, motivate, and make a
							meaningful difference in every student’s learning.
						</Subtitle>
					</div>

					{/* Right side - Stats */}
					<div className="relative flex justify-center lg:justify-end">
						{/* Left Image (slightly higher + left) */}
						<img
							src="https://picsum.photos/200/300"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40"
						/>

						{/* Right Image (main, slightly lower + right) */}
						<img
							src="https://picsum.photos/id/237/200/300"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40 transform -translate-x-12 translate-y-8"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
