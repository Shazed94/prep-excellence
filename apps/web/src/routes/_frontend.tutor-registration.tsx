import { createFileRoute } from "@tanstack/react-router";
import TutorRegistrationBanner from "@/components/tutor-registration/TutorRegistrationBanner";
import TutorRegistrationForm from "@/components/tutor-registration/TutorRegistrationForm";

export const Route = createFileRoute("/_frontend/tutor-registration")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<TutorRegistrationBanner />

			{/* Instructor Application Section */}
			<section className="bg-white py-12 md:py-24">
				<div className="mx-auto container px-4 md:px-16">
					<h1 className="mb-6 text-2xl font-bold text-gray-900">
						Want to be an instructor for Prep Excellence?
					</h1>

					<div className="mb-8 space-y-4 leading-relaxed text-gray-700">
						<p>
							We pride ourself in our instructors and tutors and are looking for
							top instructors and tutors. If you have been a good student and
							test taker, and have teaching experience, we would be interested
							in you! Our instructors and tutors offer our classes, using Zoom
							or another video conferencing platform, to students in New Jersey
							and have flexible schedules, a great hourly rate, and
							training/mentoring to make sure that all our instructors/tutors
							offer the best possible services.
						</p>
						<p>
							If you are interested in becoming an instructor or tutor for us,
							please fill out the form below. Please answer the questions in
							detail to help our selection process. (We require documentation to
							anyone we interview.) If you have questions about the form, please
							email us at instructors@prepexcellence.com.
						</p>
					</div>

					<div className="mb-8">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">
							Qualifications
						</h2>

						<div className="mb-3 leading-relaxed">
							<span className="font-semibold text-blue-600">Test scores:</span>
							<span className="text-gray-700">
								{" "}
								SAT 1520 (instructors), 1450 (tutors). ACT 34 (instructors), 32
								(tutors)
							</span>
						</div>

						<div className="mb-3 leading-relaxed">
							<span className="font-semibold text-blue-600">Grades:</span>
							<span className="text-gray-700">
								{" "}
								An overall GPA of 3.5 or more and at least A- in each subject
								you want to teach
							</span>
						</div>

						<div className="leading-relaxed">
							<span className="font-semibold text-blue-600">Availability:</span>
							<span className="text-gray-700"> 10 hours or more a week</span>
						</div>
					</div>

					<div>
						<h2 className="mb-4 text-xl font-bold text-red-600">Note</h2>
						<ul className="space-y-3 text-gray-700">
							<li className="leading-relaxed">
								• Please make ABSOLUTELY SURE that your EMAIL ADDRESS, PHONE
								NUMBER, and ADDRESS are CORRECT and CURRENT. Otherwise, we will
								NOT be able to CONTACT YOU when we need a tutor.
							</li>
							<li className="leading-relaxed">
								• Please provide as detailed information as possible. Your
								answers will help us pair you with appropriate students.
							</li>
							<li className="leading-relaxed">
								• Please note that we will verify whether you are authorized to
								work in the US and we are unable to sponsor any work visa. If
								you select other for immigration status, please include a brief
								explanation.
							</li>
							<li className="leading-relaxed">
								• We MIGHT require a background check for the teachers/tutors we
								hire. (For example, approximate cost in New Jersey is $66.06)
							</li>
							<li className="leading-relaxed">
								• Please let us know if you can help with blog writing, videos,
								social media, marketing, and/or college essay review.
							</li>
							<li className="leading-relaxed">
								• For the website, we will need a professional photo and a
								summary of your profile. Please email your resume and a
								professional photo (e.g., LinkedIn photo) to
								kolsar.alom@prepexcellence.com and Cc: info@prepexcellence.com.
							</li>
						</ul>
					</div>
				</div>
			</section>

			<TutorRegistrationForm />
		</div>
	);
}
