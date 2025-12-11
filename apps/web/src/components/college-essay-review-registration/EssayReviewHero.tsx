export default function EssayReviewHero() {
	return (
		<div className="flex items-center gap-[5%] container mx-auto px-4 md:px-24 py-12 md:py-24 ">
			<div className="flex-1 pr-5">
				<h1 className="text-accent text-[40px] font-bold mb-4">$399</h1>
				<h2 className="text-[#296582] text-2xl font-bold mb-3">
					COLLEGE ESSAY REVIEW
				</h2>
				<p className="text-[#20404E] text-[17px] mb-7">
					Receive expert guidance to craft a compelling, authentic, and polished
					college essay. Our reviewers help strengthen your story, refine
					structure and clarity.
				</p>
				<button
					type="button"
					className="bg-secondary text-white border-none rounded px-5 py-2.5 text-[17px] md:text-[24px] cursor-pointer"
				>
					Turnaround Time: 72 hours
				</button>
			</div>
			<div className="flex-1 ps-20 text-right">
				{/* Replace with actual image URL or import; for demo, using a placeholder */}
				<img
					src="/essay-review-registration/hero.png"
					alt="Smiling student holding books on campus"
					className="max-w-full h-auto rounded-lg"
				/>
			</div>
		</div>
	);
}
