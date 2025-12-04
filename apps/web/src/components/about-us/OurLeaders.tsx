import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";

export default function OurLeaders() {
	return (
		<section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<SectionTitle accentClassName="w-20 left-1/2 -translate-x-1/2">
						Our Leaders
					</SectionTitle>
					<Subtitle>
						Meet the co-founders who blended academic excellence with
						cutting-edge technology to redefine test preparation. Their combined
						expertise ensures every student receives a world-class,
						results-driven learning.
					</Subtitle>
				</div>

				{/* Leader 1 - Dr. Kaisar Alam */}
				<div className="mb-20">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Image */}
						<div className="order-2 lg:order-1">
							<div className="rounded-lg overflow-hidden shadow-lg">
								<img
									src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=700&fit=crop"
									alt="Dr. Kaisar Alam"
									className="w-full h-full object-cover aspect-square"
								/>
							</div>
						</div>

						{/* Content */}
						<div className="order-1 lg:order-2">
							<h3 className="text-3xl font-bold text-gray-900 mb-6">
								Dr. Kaisar Alam
							</h3>

							<div className="space-y-4 text-gray-700 leading-relaxed">
								<p>
									Dr. Kaisar Alam is an educator and a biomedical engineer. He
									has a passion for teaching. In fact, he has been teaching
									since high school (starting with his own 9th-grade classmates
									and in college with his IIT, Kharagpur classmates).
								</p>

								<p>
									He has been teaching at Central Jersey schools and also at
									TCNJ and Rutgers. Dr. Alam has been working with high school
									students to help improve their SAT and ACT scores. Many of our
									students got top scores, made large score improvements, and
									received admission into top universities.
								</p>

								<p>
									He received his B.Tech. (Hons) from IIT, Kharagpur, India. He
									received his M.S. and Ph.D. from the University of Rochester,
									Rochester, NY. He has been a full-time researcher in
									biomedical imaging from 1989 to 2013. He still spends some of
									his own time in research and serves as a subject-matter-expert
									consultant.
								</p>

								<p>
									Dr. Alam is a Fellow of AIMJ, a Senior Member of IEEE, and a
									recipient of the prestigious Fulbright Scholar Award. Dr. Alam
									is the Founder and Chief Executive Officer of Prep Excellence.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Leader 2 - Andaleeb Mahmud */}
				<div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Content */}
						<div className="order-1">
							<h3 className="text-3xl font-bold text-gray-900 mb-6">
								Andaleeb Mahmud
							</h3>

							<div className="space-y-4 text-gray-700 leading-relaxed">
								<p>
									Andaleeb Mahmud is an IT management professional with
									experience in complex business problems and providing creative
									solutions. He is an Award-Winning Leader of product teams who
									has spearheaded substantial revenues for many companies.
								</p>

								<p>
									He excels in building organization, guiding enterprise level
									initiatives, guiding international programs and highly adept
									in managing the quality of the project as well as the
									resulting product.
								</p>

								<p>
									He has taught classes to train employees at all levels,
									including senior management, on Agile principles, enabling
									them to implement the process in their own work, which led to
									organization-wide adoption.
								</p>

								<p>
									He has earned a bachelor's and a Master's degree in Electrical
									and Manufacturing Engineering from the University of
									California at Los Angeles. He is the Chief Operating Officer
									at Prep Excellence.
								</p>
							</div>
						</div>

						{/* Image */}
						<div className="order-2">
							<div className="rounded-lg overflow-hidden shadow-lg">
								<img
									src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=700&fit=crop"
									alt="Andaleeb Mahmud"
									className="w-full h-full object-cover aspect-square"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
