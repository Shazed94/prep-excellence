export default function SATLiveClasslistBanner() {
	return (
		<section className="py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="mx-auto container">
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
					{/* Left side - Title and description */}
					<div className="max-w-[750px]">
						<h2 className="mb-4 text-3xl font-bold ">
							See the Courses Available and Register
						</h2>
						<p className="text-sm leading-relaxed ">
							Explore our full range of expertly designed courses and find the
							perfect match for your academic goals, learning style, and future
							ambitions. Each course is crafted to provide clear guidance,
							structured lessons, and practical strategies that help you improve
							your skills and achieve measurable results. Browse the options,
							compare what fits you best, and register with confidence.
						</p>
					</div>

					{/* Right side - Stats */}
					<div className="relative flex justify-center lg:justify-end">
						{/* Left Image (slightly higher + left) */}
						<img
							src="https://picsum.photos/200/300"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-auto md:h-40 sm:w-72 sm:h-40"
						/>

						{/* Right Image (main, slightly lower + right) */}
						<img
							src="https://picsum.photos/id/237/200/300"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-auto md:h-40 sm:w-72 sm:h-40 transform -translate-x-12 translate-y-8"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
