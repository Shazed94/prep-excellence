export default function OnetoOneTutorBanner() {
	return (
		<section className="py-10 md:py-20 px-6 bg-linear-to-r from-[#BBDEEF]/40/30 from-0% to-[#FFFFFF] to-53% shadow-[0_0_31px_0_rgba(0,0,0,0.10)] ">
			<div className="container mx-auto ">
				<div className="flex flex-col md:flex-row gap-8 items-center ">
					{/* Left Side – Text */}
					<div className="w-full md:w-2/3  text-left">
						<h2 className="text-[18px] md:text-[28px] font-bold text-[#191919] mb-6 leading-tight">
							Request expert 1-On-1 Tutoring for Your Child
						</h2>

						<p className="text-muted text-[17px]">
							Give your child the personalized academic support they deserve
							with our expert 1-on-1 tutoring. Each session is tailored to their
							learning style, subject needs, and academic goals—whether they’re
							preparing for the SAT, catching up in class, or striving for top
							grades. Our top-rated tutors provide focused guidance,
							step-by-step instruction, and ongoing progress support to help
							your child learn faster, gain confidence, and achieve success.
						</p>
					</div>

					{/* Right Side – Image */}
					<div className="relative flex justify-center lg:justify-end mb-6 md:mb-0">
						{/* Left Image (slightly higher + left) */}
						<img
							src="https://picsum.photos/200/300"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40"
						/>

						{/* Right Image (main, slightly lower + right) */}
						<img
							src="https://picsum.photos/id/237/200/300"
							alt="Team"
							className="rounded-md shadow-2xl object-cover border-white w-full h-40 sm:w-72 sm:h-40 transform -translate-x-12 translate-y-8"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
