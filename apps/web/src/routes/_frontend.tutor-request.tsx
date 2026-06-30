import { createFileRoute } from "@tanstack/react-router";
import TutorRegistrationBanner from "@/components/tutor-registration/TutorRegistrationBanner";
import TutorRegistrationForm from "@/components/tutor-registration/TutorRegistrationForm";

export const Route = createFileRoute("/_frontend/tutor-request")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<TutorRegistrationBanner />
			<section className="relative py-12 md:py-24">
				<span className="size-32 rounded-full bg-[#6965EB] blur-[120px] absolute right-3 top-0 -z-10" />

				<div className="container mx-auto px-4 md:px-0">
					<h2 className="text-[18px] md:text-[28px] font-bold mb-6">
						About Our 1-On-1 Tutoring Programs
					</h2>
					<p className="text-[14px] md:text-[19px] mb-6">
						99th percentile tutors for SAT, ACT, K-12 (regular and honors), and
						AP classes. We can also help college students. We will match you
						with the best possible tutor for you from our amazing pool of
						tutors. Our tutors are top performers in the subjects they teach and
						have teaching/tutoring experience. They also receive continuous
						training and feedback to ensure best performance. Our elite tutors
						will ensure that you are completely satisfied with our tutoring
						services. Our tutoring supervisors will follow up with you and the
						student to maximize satisfaction. We are proud of our excellent
						tutoring services and have kept our prices competitive. As always,
						your complete satisfaction is our goal.
					</p>
					<li className="list-disc mb-6 ml-6">
						One-size-fits-all does not work well for 1-on-1 tutoring. Our tutors
						will create a customized tutoring program that would help you
						perform your best.
					</li>

					{/* Cost Breakdown */}
					<section className="mb-12">
						<h2 className="text-[18px] md:text-[28px] font-bold mb-6">
							Cost Breakdown
						</h2>

						<div className="space-y-4">
							{/* Item */}
							<div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium flex text-primary-dark">
									• High school:
									<span className="font-semibold text-gray-900 pl-2">
										$60/hr
									</span>
								</span>
								<span className="text-gray-700">
									(10+ hours only, regularly $65).
									<span className="block md:inline">
										$35/hr if you prepay 4 hours or more
									</span>
								</span>
							</div>

							<div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium flex text-primary-dark">
									• Middle school:
									<span className="font-semibold text-gray-900 pl-2">
										$55/hr
									</span>
								</span>
								<span className="text-gray-700">
									(10+ hours only, regularly $75).
									<span className="block md:inline">
										$40/hr if you prepay 4 hours or more
									</span>
								</span>
							</div>

							<div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium flex text-primary-dark">
									• Elementary:
									<span className="font-semibold text-gray-900 pl-2">
										$45/hr
									</span>
								</span>
								<span className="text-gray-700">
									(10+ hours only, regularly $50).
									<span className="block md:inline">
										$30/hr if you prepay 4 hours or more
									</span>
								</span>
							</div>

							<div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium flex text-primary-dark">
									• Test prep (SAT/ACT/GRE):
									<span className="font-semibold text-gray-900 pl-2">
										$80/hr
									</span>
								</span>
								<span className="text-gray-700">
									(10+ hours only, regularly $95).
									<span className="block md:inline">
										$50/hr if you prepay 4 hours or more
									</span>
								</span>
							</div>

							<div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium flex text-primary-dark">
									• College subjects:
									<span className="font-semibold text-gray-900 pl-2">
										$65/hr
									</span>
								</span>
								<span className="text-gray-700">
									(10+ hours only, regularly $70).
									<span className="block md:inline">
										$45/hr if you prepay 4 hours or more
									</span>
								</span>
							</div>

							<div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium flex text-primary-dark">
									• College-specific / Major subjects:
									<span className="font-semibold text-gray-900 pl-2">
										$75/hr
									</span>
								</span>
								<span className="text-gray-700">
									(10+ hours only, regularly $100).
									<span className="block md:inline">
										$55/hr if you prepay 4 hours or more
									</span>
								</span>
							</div>

							{/* Discount */}
							<div className="mt-4 flex flex-col md:flex-row gap-1 md:gap-2 text-[14px] md:text-[19px]">
								<span className="font-semibold text-green-600">Save 15%</span>
								<span className="text-gray-700">
									(discount if you order 4 or more hours at once)
								</span>
							</div>
						</div>

						{/* Notes */}
						<p className="mt-6 leading-relaxed text-[14px] md:text-[19px] text-gray-700">
							If you prefer earlier, faster, or priority tutor matching, you may
							request it below. These sessions typically cost about $25/hr more.
							Availability cannot be guaranteed with limited scheduling time.
						</p>

						<p className="mt-4 leading-relaxed text-[14px] md:text-[19px] text-gray-700">
							Know Aliyah’s Prep Guidance usually has a full schedule but offers
							limited 1-on-1 tutoring. His rate is $70/hr (regularly $75) and
							requires a 4-hour prepayment. If unavailable, an SAT prep tutor
							may be assigned at no extra cost.
						</p>
					</section>

					{/* Billing & Prepay Discounts */}
					<section className="mb-12">
						<h2 className="text-[18px] md:text-[28px] font-bold mb-6">
							Billing & Prepay Discounts
						</h2>
						<p className="leading-relaxed text-[14px] md:text-[19px]">
							It's all set if you have{" "}
							<a
								href="mailto:prepayment@test.com"
								className="text-blue-600 underline"
							>
								prepayment@test.com
							</a>
							!
						</p>
						<p className="mt-2 leading-relaxed text-[14px] md:text-[19px]">
							For reaching the prepay discount, you can pay for 4 hours{" "}
							<span className="font-semibold">AFTER</span> we confirm a tutor.
						</p>
						<p className="mt-4 leading-relaxed text-[14px] md:text-[19px]">
							<span className="font-semibold">Payment:</span> Payment is due
							after we bill you.
						</p>
					</section>

					{/* Program Terms */}
					<section>
						<h2 className="text-[18px] md:text-[28px] font-bold mb-6">
							Program Terms, Policies & Agreements
						</h2>
						<div className="space-y-4 text-[14px] md:text-[19px]">
							<p className="leading-relaxed">
								<span className="">1)</span> Participants in 1-on-1 must be
								student (active, overseas, inc(luding), special, or undergrad)
								managed (resulting from your start liability) to the student who
								signs up. Unless you or 1 cannot participate(s) for the purpose
								of the program(s), the student is free to cancel under the
								cancellation/transfer/refund policies. All student rights and
								policies below will apply.
							</p>
							<p className="leading-relaxed">
								<span className="">2)</span> All members in additional weeks,
								releases, receipt, holidays, discharge, court document(s) will
								be free per student. (Prep Excellence LLC) from any bill
								actions, claims, discharges, and services, and any and all legal
								bills, legal charges, court costs, attorneys' fees, judgment(s),
								rights or personal property rights(s), or personal property
								legal rights, including all rights to privacy for medical
								test(s).
							</p>
							<p className="leading-relaxed">
								<span className="">3)</span> Transfer is permitted for
								oneself/or others or to participate in this activity and assume
								the risk thereof and discharge for modifying child aid at times
								to keep. This will not be disclosed within private participant's
								information, including but not limited to personal information,
								including test scores, that may/must be kept private to the
								participants.
							</p>
							<p className="leading-relaxed">
								<span className="">4)</span> Photograph(s), videotape, and audio
								recording(s) of the order-advantage of the participants, while
								participating in their Excellence Programs may be made in
								accordance with the order-advantage of other students such
								members of (support) not belonging(s) as part of a group visit
								without their faces used in advertisement brokering.
							</p>
							<p className="leading-relaxed">
								<span className="">5)</span> If you(were) receive or telephone/s
								with 48 hours in advance, you must notify us at least 24 hours
								in advance. If you/we(s) was free to cancel. Notice will be
								rescheduled at no additional cost.
							</p>
							<p className="leading-relaxed">
								<span className="">6)</span> If a tutor needs to cancel, they
								will notify the affected student at least 48 hours in advance
								and the session will be rescheduled at no additional cost.
							</p>
							<p className="leading-relaxed">
								<span className="">7)</span> Rescheduling: upon cancellation of
								lessons (24 -until)with discount (if your order? if none within
								14 days without discount). If more at($12) if you or your child
								cannot be notified(s) (or tutor will be full by your tax bill
								within two weeks) and upon 13 days we will apply the $25
								expedited refund processing fee.
							</p>
						</div>
					</section>
				</div>
			</section>
			{/* 1-on-1 Tutoring Card Section */}
			<section className="bg-[#D9E6ED]/40 py-12 md:py-24">
				<div className="mx-auto max-w-5xl bg-white">
					<div className="flex flex-col md:flex-row text-center md:text-start items-center justify-between gap-8  p-6">
						<div className="flex-1 max-w-[500px]">
							<h2 className="mb-3 text-[18px] md:text-[24px] font-bold text-[#296582]">
								1-ON-1 TUTORING
							</h2>
							<p className="text-[14px] md:text-[17px] text-[#20404E]">
								Get personalized, one-on-one instruction from top 1% tutors who
								specialize in regular courses, Honors, AP subjects, SAT, and ACT
								prep.
							</p>
						</div>
						<div className="flex flex-col items-center gap-3">
							<div className="text-3xl md:text-[45px] font-bold text-accent">
								$85/hour
							</div>
							<button
								type="button"
								className="text-[22px] md:text-[27px] rounded bg-primary-dark text-white  px-14 py-3 font-medium "
							>
								Register Now
							</button>
						</div>
					</div>
				</div>
			</section>
			<TutorRegistrationForm />
		</div>
	);
}
