export default function EssayReview() {
	return (
		<section className="bg-[#D9E6ED]/40 py-16 px-4 sm:px-28 ">
			<div className="max-w-7xl mx-auto bg-white border border-[#BEBEBE]/60 rounded p-8">
				<div className="flex flex-wrap items-center justify-between gap-6">
					{/* Left - Service Description */}
					<div className="min-w-[250px] max-w-[32%]">
						<h3 className="text-[18px] md:text-[24px] font-bold text-[#296582] mb-2">
							COLLEGE ESSAY REVIEW
						</h3>
						<p className="text-sm text-[#20404E] leading-relaxed">
							Receive expert guidance to craft a compelling, authentic, and
							polished college essay. Our reviewers help strengthen your story,
							refine structure and clarity.
						</p>
					</div>

					{/* Center - Turnaround Badge */}
					<div className="flex-shrink-0 flex-1 mx-20">
						<div className="bg-secondary text-white px-6 py-3 rounded font-bold text-sm md:text-[24px] min-w-max">
							Turnaround time: 72 hours
						</div>
					</div>

					{/* Right - Price and CTA */}
					<div className="flex flex-1 flex-col items-center gap-3">
						<div className="text-4xl font-bold text-accent">$399</div>
						<button
							type="button"
							className="bg-primary-dark text-white px-8 py-3 rounded font-semibold transition-colors"
						>
							Register Now
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
