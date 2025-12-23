export default function ContactUsBanner() {
	return (
		<section className="py-8 md:py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)]">
			<div className="container mx-auto">
				<div className="flex flex-col md:flex-row items-center gap-10">
					{/* Left Side – Text (2/3) */}
					<div className="w-full md:w-2/3">
						<h2 className="text-[18px] md:text-[28px] font-bold text-[#191919] mb-6 leading-tight">
							We’d Love to Hear From You!
						</h2>

						<p className="text-muted text-[16px] md:text-[17px] leading-relaxed text-justify">
							Whether you have questions about our adaptive learning
							methodology, need technical support, or are ready to enroll in one
							of our score-guaranteed programs, our dedicated team is here for
							you. We aim to respond to all inquiries within one business day to
							ensure you get the guidance you need immediately.
						</p>
					</div>

					{/* Right Side – Images (1/3) */}
					<div className="relative w-full md:w-1/3 flex justify-center md:justify-end">
						<div className="relative">
							{/* Back Image */}
							<img
								src="/home/contact-us-banner-1.png"
								alt="Team"
								className="rounded-md shadow-2xl object-cover w-48 h-36 sm:w-56 sm:h-40"
							/>

							{/* Front Image */}
							<img
								src="/home/contact-us-banner-2.png"
								alt="Team"
								className="rounded-md shadow-2xl object-cover w-48 h-36 sm:w-56 sm:h-40
                       absolute top-8 -left-20 md:-left-30"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
