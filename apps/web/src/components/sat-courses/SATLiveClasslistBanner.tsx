export default function SATLiveClasslistBanner() {
	return (
		<section className="py-10 md:py-20 px-4 md:px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)]">
			<div className="container mx-auto">
				<div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
					{/* Left side - Title and description */}
					<div className="max-w-[750px] text-center lg:text-left">
						<h2 className="mb-4 text-2xl md:text-3xl font-bold">
							See the Courses Available and Register
						</h2>
						<p className="text-sm md:text-base leading-relaxed">
							Explore our full range of expertly designed courses and find the
							perfect match for your academic goals, learning style, and future
							ambitions. Each course is crafted to provide clear guidance,
							structured lessons, and practical strategies that help you improve
							your skills and achieve measurable results.
						</p>
					</div>

					{/* Right side - Images */}
					<div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 lg:justify-end">
						{/* Image 1 */}
						<img
							src="https://picsum.photos/200/300"
							alt="Team"
							className="w-full max-w-[260px] h-40 object-cover rounded-md shadow-2xl"
						/>

						{/* Image 2 */}
						<img
							src="https://picsum.photos/id/237/200/300"
							alt="Team"
							className="
						w-full max-w-[260px] h-40 object-cover rounded-md shadow-2xl
						md:-translate-x-12 md:translate-y-8
					"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
