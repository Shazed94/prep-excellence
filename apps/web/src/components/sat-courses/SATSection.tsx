export default function SATSection() {
	const stats = [
		{ label: "Total Courses", value: "1423" },
		{ label: "Enrolled Students", value: "35346" },
		{ label: "Average Rating", value: "4.8" },
		{ label: "Instructors", value: "42" },
		{ label: "Events", value: "56" },
	];
	return (
		<section className="py-10 md:py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="mx-auto container">
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
					{/* Left side - Title and description */}
					<div className="max-w-[750px]">
						<h2 className="mb-4 text-3xl font-bold text-gray-900">
							Explore All Our SAT Programs
						</h2>
						<p className="text-sm leading-relaxed text-gray-600">
							The Digital SAT requires a strategic, adaptive approach. We offer
							a comprehensive suite of courses, from core content mastery to
							elite 1:1 coaching, all designed around our proven, data-driven
							methodology to maximize score in the shortest time possible.
							Discover the perfect study plan that meets your target.
						</p>
					</div>

					{/* Right side - Stats */}
					<div className="flex w-full flex-wrap gap-x-8 gap-y-6 lg:w-auto lg:justify-end">
						{stats.map((stat, _index) => (
							<div key={stat.label} className="flex flex-col">
								<span className="mb-1 text-xs font-medium text-gray-600">
									{stat.label}
								</span>
								<span className="text-3xl font-bold text-gray-900">
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
