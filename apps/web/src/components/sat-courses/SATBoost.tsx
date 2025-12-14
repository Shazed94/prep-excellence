export default function SATBoost() {
	return (
		<section className="py-12 md:py-20 bg-[#D9E6ED]/40">
			<div className="container mx-auto px-4">
				{/* Image */}
				<div className="mb-0">
					<div className="relative w-full md:w-[65%] h-[250px] md:h-[300px] mx-auto">
						<img
							src="/sat-boost.png"
							alt="Students studying together"
							className="w-full h-full md:h-auto object-cover"
						/>
					</div>
				</div>

				{/* Blue Banner with Three Columns */}
				<div className="bg-[#0095D9] text-white">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12 pt-10 md:pt-28 pb-12">
						{/* Column 1 */}
						<div>
							<h3 className="text-xl font-bold mb-4">
								Want to boost your SAT score?
							</h3>
							<p className="text-sm leading-relaxed">
								We provide the tools, guidance, and support you need to reach
								your highest SAT potential. Our program is designed to help you
								study smarter—not harder—so you can see real improvements
								without wasting time on methods that don't work.
							</p>
						</div>

						{/* Column 2 */}
						<div>
							<h3 className="text-xl font-bold mb-4">
								Coaches Who Care, Results That Show
							</h3>
							<p className="text-sm leading-relaxed">
								At the heart of your success is a team that truly cares. Our
								coaches don't just teach—you. They guide you, motivate you, and
								stand by you through every challenge. You'll receive one-on-one
								instruction with genuine support to help you reach your full
								potential.
							</p>
						</div>

						{/* Column 3 */}
						<div>
							<h3 className="text-xl font-bold mb-4">
								Smash the SAT — We Guarantee It
							</h3>
							<p className="text-sm leading-relaxed">
								We're confident in our process because it works. With the right
								coaching, the right strategy, and the right support, any student
								can achieve a breakthrough score. That's why we make sure that
								happens.
								<br />
								<br />
								We provide a results-driven program designed to help you master
								every section of the SAT.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
