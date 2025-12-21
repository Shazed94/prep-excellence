export default function GuidanceBanner() {
	return (
		<section className="py-10 md:py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="mx-auto container">
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
					{/* Left side - Title and description */}
					<div className="max-w-[750px]">
						<h2 className="mb-4 text-3xl font-bold text-gray-900">
							Expert Guidance for Your College Journey
						</h2>
						<p className="text-sm leading-relaxed text-gray-600">
							Get the clarity, confidence, and step-by-step direction you need
							to navigate every stage of the college admissions process. From
							choosing the right courses and building a strong academic profile
							to preparing for standardized tests, crafting standout
							applications, and discovering your best-fit schools, our
							expert-driven insights help you make smarter decisions at every
							turn.
						</p>
					</div>

					{/* Right side - Stats */}
					<div className="relative flex flex-col md:flex-row justify-center lg:justify-end">
						{/* Left Image (slightly higher + left) */}
						<img
							src="/home/expert-guidance-banner-1.png"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40"
						/>

						{/* Right Image (main, slightly lower + right) */}
						<img
							src="/home/expert-guidance-banner-2.png"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40 transform md:-translate-x-12 translate-y-8"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
