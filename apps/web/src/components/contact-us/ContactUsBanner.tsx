export default function ContactUsBanner() {
	return (
		<section className="py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40 to-[#FFFFFF] to-50% shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="container mx-auto ">
				<div className="flex flex-col md:flex-row gap-8 items-center ">
					{/* Left Side – Text */}
					<div className="w-full md:w-2/3  text-left">
						<h2 className="text-[18px] md:text-[28px] font-bold text-[#191919] mb-6 leading-tight">
							We’d Love to Hear From You!
						</h2>

						<p className="text-muted text-[17px]">
							Whether you have questions about our adaptive learning
							methodology, need technical support, or are ready to enroll in one
							of our score-guaranteed programs, our dedicated team is here for
							you. We aim to respond to all inquiries within one business day to
							ensure you get the guidance you need immediately.{" "}
						</p>
					</div>

					{/* Right Side – Image */}
					<div className="relative flex justify-center lg:justify-end">
						{/* Left Image (slightly higher + left) */}
						<img
							src="/home/contact-us-banner-1.png"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40"
						/>

						{/* Right Image (main, slightly lower + right) */}
						<img
							src="/home/contact-us-banner-2.png"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40 transform -translate-x-12 translate-y-8"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
