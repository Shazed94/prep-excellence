// app/about/our-passion-section.tsx   (or wherever you want to place it)

// ↑ replace with your actual images or use placeholders

export const OurPassion = () => {
	return (
		<section className="bg-white py-14 md:py-20">
			<div className="container mx-auto px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Left column - Text */}
					<div className="space-y-12">
						<h2 className="text-[18px] md:text-[28px] font-bold  mb-8">
							Our Passion, Your Experience
						</h2>
						<p className="text-[19px] text-black pe-16">
							We don't just teach—we transform scores. Prep Excellence delivers
							the most advanced, personalized, and effective test preparation
							available, built on years of success and data-driven insights. Our
							curriculum is constantly updated to reflect the latest changes.
						</p>
						{/* Elite Expertise */}
						<div>
							<h3 className="text-[19px] font-semibold mb-4">
								Elite Expertise
							</h3>
							<p className="text-primary-light text-[17px]">
								Our instructors aren't just great teachers—they are confirmed
								top 1% scorers on the SAT. They've mastered the test and are
								passionate about teaching.
							</p>
						</div>

						{/* Adaptive Technology */}
						<div>
							<h3 className="text-[19px] font-semibold mb-4">
								Adaptive Technology
							</h3>
							<p className="text-primary-light text-[17px]">
								Our platform uses AI-driven diagnostics to create
								hyper-personalized study plans, ensuring every minute you spend
								studying is targeted at improving your weaknesses.
							</p>
						</div>

						{/* Measurable Success */}
						<div>
							<h3 className="text-[19px] font-semibold mb-4">
								Measurable Success
							</h3>
							<p className="text-primary-light text-[17px]">
								Our commitment is simple: guaranteed score improvement. We have
								the data and the track record to prove our methodology works.
							</p>
						</div>
					</div>

					<div className="">
						<div
							className={`
                 
                `}
						>
							<img
								src={"/about-us/banner.png"}
								alt={`Students learning `}
								className="w-full object-cover hover:scale-105 transition-transform duration-500"
								sizes="(max-width: 768px) 33vw, 20vw"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
