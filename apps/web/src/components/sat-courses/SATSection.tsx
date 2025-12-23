export default function SATSection() {
	const stats = [
		{ label: "Total Courses", value: "1423" },
		{ label: "Enrolled Students", value: "35346" },
		{ label: "Average Rating", value: "4.8" },
		{ label: "Instructors", value: "42" },
		{ label: "Events", value: "56" },
	];

	return (
		<section className="py-8 md:py-20 px-6 bg-gradient-to-r from-[#BBDEEF]/40 to-[#FFFFFF] shadow-[0_0_31px_0_rgba(0,0,0,0.10)]">
			<div className="mx-auto container flex flex-col items-center gap-8">
				{/* Title & Description */}
				<div className="max-w-[650px] text-center">
					<h2 className="mb-4 text-2xl lg:text-3xl font-bold text-gray-900">
						Explore All Our SAT Programs
					</h2>
					<p className="text-sm md:text-base leading-relaxed text-gray-600">
						The Digital SAT requires a strategic, adaptive approach. We offer a
						comprehensive suite of courses, from core content mastery to elite
						1:1 coaching, all designed around our proven, data-driven
						methodology to maximize score in the shortest time possible.
						Discover the perfect study plan that meets your target.
					</p>
				</div>

				{/* Stats Section */}
				<div className="w-full max-w-4xl">
					<div className="grid grid-cols-2 md:grid-cols-2 gap-6 lg:flex lg:justify-between lg:text-center">
						{stats.map((stat, index) => (
							<div
								key={stat.label}
								className={`flex flex-col items-center
                  ${index === stats.length - 1 ? "col-span-2" : ""} lg:col-span-1`}
							>
								<span className="mb-1 text-sm font-medium text-gray-600 text-center">
									{stat.label}
								</span>
								<span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
									{stat.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
