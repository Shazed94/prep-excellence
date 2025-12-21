import {
	ConsultingSVGFive,
	ConsultingSVGFour,
	ConsultingSVGOne,
	ConsultingSVGSix,
	ConsultingSVGThree,
	ConsultingSVGTwo,
} from "../SvgComponents";

export default function ConsultingService() {
	return (
		<section className="container mx-auto px-4 py-16">
			{/* Section Header */}
			<div className="text-center mb-16">
				<h2 className="text-3xl font-bold text-gray-900 mb-4">
					Admissions Consulting Services
				</h2>
				<p className="text-gray-600 max-w-3xl mx-auto">
					We can help you with your complete college application package,
					guiding you through every requirement with clarity and confidence.
				</p>
			</div>
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
				{/* Service 1 - Initial Planning */}
				<div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
							<ConsultingSVGOne />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 mb-2">Initial Planning</h3>
						<p className="text-sm text-gray-600 leading-relaxed">
							It is important to accentuate strengths and emphasize weaknesses.
							We help with choosing the right high school subjects,
							extracurricular activities, summer activities, internships,
							testing, campus visits, and more.
						</p>
					</div>
				</div>

				{/* Service 2 - Find & Apply */}
				<div className="bg-white flex-col md:flex-row items-center rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
							<ConsultingSVGTwo />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 mb-2">
							Find & Apply to the right school
						</h3>
						<p className="text-sm text-gray-600 leading-relaxed">
							You should apply to schools that fit your academic interests and
							personality. In the top schools, grades, test scores, and
							recommendation letters are not enough. Your application should
							help you stand out.
						</p>
					</div>
				</div>

				{/* Service 3 - Admissions Test Prep */}
				<div className="bg-white flex-col md:flex-row items-center rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
							<ConsultingSVGThree />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 mb-2">
							Admissions Test Prep
						</h3>
						<p className="text-sm text-gray-600 leading-relaxed">
							We provide industry-leading test prep programs and will help you
							prepare for the test. Select from instructor-led classes or
							individual tutoring. Work with the best instructors and tutors for
							SAT, ACT, and other exams.
						</p>
					</div>
				</div>

				{/* Service 4 - College Essay Review */}
				<div className="bg-white flex-col md:flex-row items-center rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
							<ConsultingSVGFour />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 mb-2">
							College Essay Review
						</h3>
						<p className="text-sm text-gray-600 leading-relaxed">
							We teach you how to write essays that truly work. With the right
							guidance, you can avoid the common mistakes that weaken an essay
							and instead create a strong, clear, and compelling piece that
							represents you at your best.
						</p>
					</div>
				</div>

				{/* Service 5 - Scholarship Sources */}
				<div className="bg-white flex-col md:flex-row items-center rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
							<ConsultingSVGFive />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 mb-2">
							Scholarship Sources
						</h3>
						<p className="text-sm text-gray-600 leading-relaxed">
							We offer expert instructors and expert tutors for the SAT, ACT,
							and other exams. Get high-quality prep and enjoy special discounts
							when you pair your courses with our Admissions Consulting
							packages.
						</p>
					</div>
				</div>

				{/* Service 6 - Actions after Applying */}
				<div className="bg-white flex-col md:flex-row items-center rounded-lg p-6 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
					<div className="flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
							<ConsultingSVGSix />
						</div>
					</div>
					<div>
						<h3 className="font-bold text-gray-900 mb-2">
							Actions after Applying
						</h3>
						<p className="text-sm text-gray-600 leading-relaxed">
							We help you with all steps after submitting your
							application—confirming everything is complete, preparing you for
							interviews, and guiding you on how to respond to waitlist
							decisions.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
