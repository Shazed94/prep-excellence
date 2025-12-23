import { Subtitle } from "../SectionSubtitle";
import { SectionTitle } from "../SectionTitle";

export default function OurAdvisors() {
	return (
		<section className="bg-[#D9E6ED]/40 py-16 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto">
				{/* Header */}
				<div className="text-center mb-8 md:mb-16">
					<SectionTitle accentClassName="w-20 left-1/2 -translate-x-1/2">
						Our Advisors
					</SectionTitle>
					<Subtitle>
						Our advisors are experienced professionals dedicated to guiding
						students through every step of their academic and college journey.
						They provide personalized insights, practical strategies &
						recommendations.
					</Subtitle>
				</div>

				{/* Leader 1 - Dr. Kaisar Alam */}
				<div className="mb-10 md:mb-8 md:mb-20">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Image */}
						<div className="order-2 lg:order-1">
							<div className="rounded-lg overflow-hidden shadow-lg">
								<img
									src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=700&fit=crop"
									alt="Dr. Kaisar Alam"
									className="w-full h-full object-cover aspect-square "
								/>
							</div>
						</div>

						{/* Content */}
						<div className="order-1 lg:order-2">
							<h3 className="text-2xl lg:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
								Dr. Javed Iqbal Khan
							</h3>

							<div className="space-y-4 text-gray-700 leading-relaxed">
								<p>
									Dr. Javed Iqbal Khan is a full professor of Computer Science
									at Kent State University, Kent, Ohio, USA. He received his PhD
									from the University of Hawaii at Manoa in 1995.  Dr. Khan has
									regularly taught undergraduate and graduate courses in the
									areas of Internet engineering, peer-to-peer systems,
									artificial intelligence, algorithms and networking. He has
									published over 100 articles in refereed international
									conferences and journals. His research has been funded by the
									World Bank, NSF, DARPA and NASA. 
								</p>

								<p>
									Dr. Khan has served on NSF panels, many program committees,
									and the executive committee of IEEE Internet Engineering. He
									is an associate editor of International Journal of Computer
									Networks and Applications. He also led a team that designed
									and implemented two national educational networks as a part of
									a UN-funded project. Dr. Khan has been a Fulbright scholar and
									has served as a senior specialist on high performance
									education networking in the Fulbright National Roster of
									experts.
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
							<h3 className="text-2xl lg:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
								Professor Ziaul Huq
							</h3>

							<div className="space-y-4 text-gray-700 leading-relaxed">
								<p>
									Professor Ziaul Huq is a Professor of Management in the school
									of business at Omaha Nebraska and has 30 years of teaching and
									research experience in the field. He received his PhD from the
									University of Kentucky in Lexington. Before academia, he was a
									project research specialist for the Agency for International
									Development (USAID). Dr. Huq teaches Operations Management,
									Quality Management, and Supply Chain Management. Professor
									Huq’s research interests include quality systems, business
									process reengineering (BPR), lean systems, and change
									management. He has published his work in top international
									journals, has served as a reviewer for a number of
									international journals, has chaired sessions at academic
									conferences, and has organized several international
									conferences in developing countries.
								</p>

								<p>
									Dr. Huq is the recipient of two competitive US Fulbright
									Scholar grants. He is the founding President of GBMF and the
									chief editor of the Global Business and Management Journal. He
									has served two 3-year terms on the Fulbright Peer Review
									committee. He serves on a number of university committees,
									including the Faculty Senate, University Committee on
									Assessment, UNO Goals & Direction Committee, Undergraduate
									Program Council, the Faculty Development Council, and CBA
									technology committee.
								</p>
							</div>
						</div>

						{/* Image */}
						<div className="order-2">
							<div className="rounded-lg overflow-hidden shadow-lg">
								<img
									src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=600&h=700&fit=crop"
									alt="Andaleeb Mahmud"
									className="w-full h-full object-cover aspect-square "
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
