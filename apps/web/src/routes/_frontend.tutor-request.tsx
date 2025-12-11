import { createFileRoute } from "@tanstack/react-router";
import OnetoOneTutorBanner from "@/components/onetoone-tutor/OnetoOneTutorBanner";
import TutorRegistrationForm from "@/components/onetoone-tutor/OnoOnOnTutorRequestForm";

export const Route = createFileRoute("/_frontend/tutor-request")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<OnetoOneTutorBanner />
			<section className="relative py-12 md:py-24">
				<span className="size-32 rounded-full bg-[#6965EB] blur-[120px] absolute right-3 top-0 -z-10" />

				<div className="container mx-auto ">
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
						<div className="space-y-3 ">
							<div className="flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium text-primary-dark">
									• High school:
								</span>
								<span className="font-medium">$60/hr</span>
								<span className="">
									(10+hours save only, regularly $65): $35/hr if you prepay 4
									hours or more
								</span>
							</div>
							<div className="flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium text-primary-dark">
									• Middle school:
								</span>
								<span className="font-medium">$55/hr</span>
								<span className="">
									(10+min time only, regularly $75): $40/hr if you prepay 4
									hours or more
								</span>
							</div>
							<div className="flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium text-primary-dark">
									• Elementary:
								</span>
								<span className="font-medium">$45/hr</span>
								<span className="">
									(10+ted time only, regularly $50): $30/hr if you prepay 4
									hours or more
								</span>
							</div>
							<div className="flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium text-primary-dark">
									• Test prep (SAT/ACT/GRE):
								</span>
								<span className="font-medium">$80/hr</span>
								<span className="">
									(10+rated time only, regularly $95): $50/hr if you prepay 4
									hours or more
								</span>
							</div>
							<div className="flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium text-primary-dark">
									• College subjects:
								</span>
								<span className="font-medium">$65/hr</span>
								<span className="">
									(10+ted time only, regularly $70): $45/hr if you prepay 4
									hours or more
								</span>
							</div>
							<div className="flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium text-primary-dark">
									• College-specific/Major subjects:
								</span>
								<span className="font-medium">$75/hr</span>
								<span className="">
									(10+ted time only, regularly $100): $55/hr if you prepay 4
									hours or more
								</span>
							</div>
							<div className="mt-4 flex items-baseline gap-2 text-[14px] md:text-[19px]">
								<span className="font-medium">save 15%</span>
								<span className="">
									(discount if you ordered 4 or more hours at once)
								</span>
							</div>
						</div>

						<p className="mt-6 leading-relaxed text-[14px] md:text-[19px]">
							If you prefer earlier/faster/tutor, you can request below. The
							costs are higher (approximately $25/hr more). We cannot guarantee
							that we will be able to accommodate your scheduling needs if we do
							not have as much time to find you your best tutors.
						</p>

						<p className="mt-4 leading-relaxed text-[14px] md:text-[19px]">
							In: Know Aliyah's Prep Guidance (usually) schedule is very busy,
							but he can accommodate a small number of 1-on-1 tutoring students.
							His rate is $70/hr (limited time only, regularly $75). His rate
							requires a 4-hour prepayment. He has extensive educational
							experience, and can assign an SAT prep tutor at no charge if his
							sessions are unavailable or end.
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
					<div className="flex items-center justify-between gap-8  p-6">
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
