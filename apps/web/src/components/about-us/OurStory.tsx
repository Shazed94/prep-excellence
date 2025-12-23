export default function StorySection() {
	return (
		<section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Image Section */}
					<div className="order-2 lg:order-1">
						<div className="relative rounded-lg overflow-hidden shadow-xl">
							<img
								src="/about-us/our-story.png"
								alt="Students gathering in front of educational building"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Content Section */}
					<div className="order-1 lg:order-2">
						<h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6">
							The Story Behind Our Journey
						</h2>

						<div className="space-y-4 text-gray-700 leading-relaxed text-justify">
							<p className="text-lg">
								<span className="font-semibold">Prep Excellence</span> was
								founded on a frustrating truth: generic test prep fails most
								students.
							</p>

							<p>
								Our founders—a small team of high-achieving educators and a data
								scientist—watched countless talented students waste time and
								money on standardized books and classes that didn't address
								their unique needs. The traditional system was rigid,
								inefficient, and lacked personalized accountability.
							</p>

							<p>
								We decided to build the solution ourselves. Our journey began
								with the idea of creating a platform that mirrored a top-tier
								private tutor, but scaled it using adaptive learning technology.
								We recruited only instructors who had achieved the top 1%
								scores, ensuring our curriculum was developed by true masters of
								the test. From a garage project focused on personalized
								strategy, Prep Excellence has grown into a leading online
								platform, dedicated to democratizing elite test preparation.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
