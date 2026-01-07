export default function EssayReviewBanner() {
	return (
		<section className=" py-8 md:py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="mx-auto container">
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
					{/* Left side - Title and description */}
					<div className="max-w-[750px]">
						<h2 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900">
							Complete Your College Essay Review Registration
						</h2>
						<p className="text-sm leading-relaxed text-gray-600 text-justify">
							You’ve chosen our College Essay Review service — now finalize your
							spot by submitting the form below. Review your selected package
							details and provide the required information so our expert editors
							can begin preparing personalized, high-impact feedback for your
							essays. Once you register, our team will reach out with next steps
							to help you refine your story and elevate your application.
						</p>
					</div>

					{/* Right side - Stats */}
					<div className="relative flex justify-center lg:justify-end">
						{/* Left Image (slightly higher + left) */}
						<img
							src="/essay-review-registration/banner1.png"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-50 2xl:w-full h-40 sm:w-60 sm:h-40"
						/>

						{/* Right Image (main, slightly lower + right) */}
						<img
							src="/essay-review-registration/banner2.png"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-50 2xl:w-full h-40 sm:w-60 sm:h-40 transform -translate-x-8 md:-translate-x-12 translate-y-8"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
