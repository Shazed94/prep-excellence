export default function SATLiveClasslistBanner() {
	return (
		<section className="py-10 md:py-20 px-4 md:px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)]">
			<div className="container mx-auto">
				<div className="flex flex-col lg:flex-row items-center gap-10">
					{/* Left side – Text (2/3) */}
					<div className="w-full lg:w-2/3 max-w-none text-center lg:text-left">
						<h2 className="mb-4 text-2xl md:text-3xl font-bold text-[#191919]">
							See the Courses Available and Register
						</h2>

						<p className="text-sm md:text-base leading-relaxed text-justify text-[#191919]">
							Explore our full range of expertly designed courses and find the
							perfect match for your academic goals, learning style, and future
							ambitions. Each course is crafted to provide clear guidance,
							structured lessons, and practical strategies that help you improve
							your skills and achieve measurable results.
						</p>
					</div>

					{/* Right side – Images (1/3) */}
					<div className="relative w-full lg:w-1/3 flex justify-center lg:justify-end">
						<div className="relative">
							{/* Back Image */}
							<img
								src="https://picsum.photos/200/300"
								alt="Team"
								className="rounded-md shadow-2xl object-cover
                       w-48 h-36 sm:w-56 sm:h-40 xl:w-[300px]"
							/>

							{/* Front Image */}
							<img
								src="https://picsum.photos/200/300"
								alt="Team"
								className="rounded-md shadow-2xl object-cover
                       w-48 h-36 sm:w-56 sm:h-40 xl:w-[300px]
                       absolute top-10 -left-16 md:-left-30"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
