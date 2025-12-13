import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/SectionTitle";

export const Route = createFileRoute("/_frontend/terms-of-service")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 md:px-0 py-12 md:py-24">
			<div className="text-center">
				<SectionTitle accentClassName="hidden" className="mb-8 md:mb-14">
					Website Terms and Conditions
				</SectionTitle>
			</div>
			<div className="mb-12">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					DEFINITIONS
				</h5>
				<p className="text-[19px]">
					”We,” “Us,” and/or “Ours” means and refers to PrepExcellence and
					https://PrepExcellence.com (“Website”), a Website wholly owned and
					operated by PrepExcellence LLC, a New Jersey Corporation. “You,”
					“Your,” “Yours,” and “You/Your Student” means and refers to You and/or
					any other person or entity engaging in services with Our Website.{" "}
				</p>
			</div>
			<div className="mb-12">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					DISCLAIMER
				</h5>
				<p className="text-[19px]">
					The information, services, products and materials contained in or
					described on this site (including, but not limited to, the sat, act,
					and psat course material, other text, graphics, video and audio clips
					and links) are provided by prepexcellence “as is.” Prepexcellence
					makes no, and hereby disclaims, all representations or warranties of
					any kind, express or implied as to the operation of the site,
					information, content, materials, services or products referenced on
					this site, including, but not limited to, implied warranties of
					merchantability, fitness for a particular purpose, noninfringement,
					implied warranties arising from course of dealing or course of
					performance, or warranties that defects will be corrected or that the
					site or the server that makes it available will be free of viruses or
					other harmful components. In addition, although prepexcellence
					believes all information accessible on or via the site to be accurate
					as of the time of its publication, prepexcellence cannot, and does
					not, represent, guarantee or warrant that the information accessible
					on or via the site is accurate, complete, or current, and
					prepexcellence is not responsible for any errors or omissions therein,
					or results obtained from using such information.
				</p>
			</div>
			<div className="mb-12">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					LIMITATION OF LIABILITY
				</h5>
				<p className="text-[19px]">
					Prepexcellence will not be liable for any damages of any kind arising
					from the use of this site, including, but not limited to, direct,
					indirect, special, incidental, exemplary, punitive, and consequential
					damages, even if prepexcellence has been previously advised of the
					possibility of such damages, whether in an action under contract,
					negligence or any other theory, arising out of or in connection with
					the use, inability to use, or performance of the site, the system or
					any information, services, products and materials available on or via
					this site.
				</p>
			</div>
			<div className="mb-12">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					ENROLLMENT AGREEMENT
				</h5>
				<div className="text-[19px] leading-relaxed mb-10  ">
					<p className="mb-5">
						Please refer here if You/Your Student is enrolled in a
						PrepExcellence SAT/ACT Prep Course. For tutoring and admissions
						consulting orders, please refer to the applicable agreement below.
					</p>
					<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-12">
						<li className="mb-5 [::marker-text-red-500] ">
							<span className="font-semibold text-primary-dark">
								Children:{" "}
							</span>
							In compliance with the Children's Online Privacy Protection Act,
							PrepExcellence does not permit children under 13 years of age to
							become users without their parent or guardian's express consent
							and approval. By using Our Website and enrolling in any of Our
							courses, You represent You are not under 13 years of age.
						</li>
						<li className=" mb-5  ">
							<span className="font-semibold text-primary-dark">
								One Person Per Account:{" "}
							</span>
							You agree that only one person will use each account that You
							purchase from Prep Expert. PrepExcellence may restrict access to
							Your account with no refund provided if We believe the account is
							being used by more than one person. In such a case, if in fact
							only one person was using the account, PrepExcellence will restore
							that account.
						</li>
						<li className=" mb-5  ">
							<span className="font-semibold text-primary-dark">
								Course Access:{" "}
							</span>
							You/Your Student will have access to your 6-Week Flagship, 3-Week
							Fast Track, or SAT/ACT Weekend Review Camp from the beginning of
							the first lesson/class (“course start”) date until sixty (60) days
							after the concluding lesson/class (“course end”). You/Your Student
							will have access to any Self-Paced Video SAT/ACT Prep Course for
							one (1) year or 365 days after the date of purchase. This access
							includes the ability to use and/or view dashboards, test-scoring
							website, and any recorded videos associated with each course.
							Additional access may be permitted for the SAT/ACT Self-Paced
							Course at Prep Expert’s discretion upon written request to
							support@PrepExcellence.com.
						</li>
						<li className=" mb-5  ">
							<span className="font-semibold text-primary-dark">
								Late Arrival:{" "}
							</span>
							No adjustment shall be made for time lost because of late arrival
							by You/Your Student. PrepExcellence will compensate for the late
							arrival of an instructor by extending a class (“lesson”) for the
							time forfeited.
						</li>
						<li className=" mb-5  ">
							<span className="font-semibold text-primary-dark">
								Rescheduling:{" "}
							</span>
							Occasionally, due to various circumstances, We may change a course
							schedule, location, or instructor. While this is unlikely, We will
							do our best to accommodate you if you wish to move into a
							different course, including waiving any applicable transfer fees.
						</li>
						<li className=" mb-5  ">
							<span className="font-semibold text-primary-dark">
								Cancellation:{" "}
							</span>
							Occasionally, due to various circumstances, We may cancel a course
							entirely. If We cancel a course in which You/Your Student are
							registered and are unable to reschedule You/Your Student into
							another course that is acceptable to You/Your Student, we will
							refund all tuition You/Your Student have paid, and We will have no
							further liability to You/Your Student regarding the cancelled
							course.
						</li>
						<li className=" mb-5  ">
							<span className="font-semibold text-primary-dark">
								Withdrawals:{" "}
							</span>
							In some cases, you may be able to withdraw from a PrepExcellence
							course. If You/Your Student wish to withdraw from the course in
							which you are currently enrolled, then you must submit your
							request either by emailing support@PrepExcellence.com or calling
							(877) 345-7737 and speaking to a Customer Service Representative.
							Only the Payee may request a withdrawal.
						</li>

						<ol className="list-disc marker:text-primary-light ps-10 space-y-4">
							<li>
								If You/Your Student choose to withdraw Your enrollment in an
								online 6-Week Flagship SAT/ACT Prep Course, 3-Week Fast Track
								SAT/ACT Prep Course, or SAT/ ACT Weekend Review you may do so
								within seventy-two (72) hours of purchase for a full refund. No
								refunds will be given more than seventy-two (72) hours after
								purchase or after the course starts.
							</li>
							<li>
								Due to limited seating for in-person courses, if You/Your
								Student choose to withdraw Your enrollment in an in-person
								6-Week Flagship SAT/ACT Prep Course, 3-Week Fast Track SAT/ACT
								Prep Course, or SAT/ACT Weekend Review you may do so within
								seventy-two (72) hours of purchase for a full refund. No refunds
								will be given for withdrawal fourteen (14) days or less before
								the course start date/time or after the course starts.
							</li>
							<li>
								If You/Your Student choose to withdraw Your enrollment in a
								Self-Paced SAT/ACT/GMAT Prep Course before it is used,
								PrepExcellence will refund all tuition You/Your Student have
								paid. If You/Your Student choose to withdraw Your enrollment in
								a Self-Paced SAT/ACT Prep Course after it is used, no refunds
								will be given. “Used” is defined as submitting a first/last name
								and email address on the student dashboard.
							</li>
							<li>
								No refunds will be given for cancellations after the use of
								SAT/ACT Answer Solutions. PrepExcellence will refund the amount
								paid for SAT/ACT Answer Solutions if they have not been used.
								“Use of” and “Used” is defined as submitting any section of a
								practice test on the student dashboard. If You/Your student has
								transferred from an online 6-Week Flagship SAT/ACT Prep Course,
								3-Week Fast Track SAT/ACT Prep Course, or SAT/ACT Weekend Review
								six (6) days or less before the course start date/time of your
								original online course and wish to withdrawal from that new
								course, no refunds will be given. If You/Your student has
								transferred from an in-person 6-Week Flagship SAT/ACT Prep
								Course, 3-Week Fast Track SAT/ACT Prep Course, or SAT/ACT
								Weekend Review fourteen (14) days or less before the course
								start date/time of your original in-person course, no refunds
								will be given.
							</li>
							<li>
								Transfers: In some cases, you may be able to transfer from a
								PrepExcellence course. If You/Your Student wish to transfer from
								the course in which you are currently enrolled, then you must
								submit your request either by emailing
								support@PrepExcellence.com or calling (877) 345-7737 and
								speaking to a Customer Service Representative.
							</li>
							<li>
								If You/Your Student choose to transfer Your enrollment in an
								online 6-Week Flagship SAT/ACT Prep Course, 3-Week Fast Track
								SAT/ACT Prep Course, or SAT/ACT Weekend Review before the course
								start date/time, You/Your Student will be able to do so by
								contacting Us at support@PrepExcellence.com or (877) 345-7737.
								If You/Your Student choose to transfer Your enrollment in an
								online 6-Week Flagship SAT/ACT Prep Course, 3-Week Fast Track
								SAT/ACT Prep Course, or SAT/ACT Weekend Review after the course
								start date/time, You/Your Student will automatically void any
								respective Score Improvement Guarantee℠ You/Your Student may
								have for that course.
							</li>
							<li>
								If You/Your Student choose to transfer Your enrollment in an
								in-person 6-Week Flagship SAT/ACT Prep Course, 3-Week Fast Track
								SAT/ACT Prep Course, or SAT/ACT Weekend Review fifteen (15) days
								or more before the course start date/time, You/Your Student will
								be able to do so by contacting Us at support@PrepExcellence.com
								or (877) 345-7737. Due to limited seating for in-person courses,
								if You/Your Student choose to transfer Your enrollment in an
								in-person 6-Week Flagship SAT/ACT Prep Course, 3-Week Fast Track
								SAT/ACT Prep Course, or SAT/ACT Weekend Review fourteen (14)
								days or less before the course start date/time, You/Your Student
								will be assessed a $199 Transfer Fee. If You/Your Student choose
								to transfer Your enrollment in an in-person 6-Week Flagship
								SAT/ACT Prep Course, 3-Week Fast Track SAT/ACT Prep Course, or
								SAT/ACT Weekend Review after the course start date/time,
								You/Your Student will automatically void any respective Score
								Improvement Guarantee℠ You/Your Student may have for that
								course.
							</li>
							<li>
								If You/Your Student choose to transfer Your enrollment in the
								Self-Paced SAT Prep Course to the Self-Paced ACT Prep Course (or
								vice versa), you may do so if you have not used the course.
								“Used” is defined as entering a first/last name and email
								address on the student dashboard.
							</li>
							<li>
								Additionally, if You/Your Student choose to transfer Your
								enrollment in either an online or in-person 6-Week Flagship
								SAT/ACT Prep Course, 3-Week Fast Track SAT/ACT Prep Course, or
								SAT/ACT Weekend Review Camp after lesson 4, You/Your Student
								will only be able to join that new course at the lesson from
								which you left off. It is You/Your Student’s responsibility to
								inform PrepExcellence when you would like to transfer to the new
								course. Please note: You/Your Student will temporarily lose
								access to the student dashboard and SAT/ACT Answer Solutions
								until You/Your Student is officially transferred to the new
								class.
							</li>
						</ol>
						<li>
							{" "}
							<span className="font-semibold text-primary-dark">
								Recordings:{" "}
							</span>
							All PrepExcellence class sessions, tutoring sessions and
							instruction sessions of any kind are recorded for quality
							assurance and administrative purposes. By visiting, logging into,
							or participating in any class, tutoring session or instruction
							session of any kind, you consent to the recording of your
							presence, participation, and any video or audio feeds you enable
							in that session. <br />
							Copyright: You understand that all PrepExcellence course materials
							and methods are the exclusive property of Patel Educational
							Services Inc, DBA PrepExcellence and You agree not to copy,
							disclose, reproduce, sell, or otherwise distribute any
							information, materials, or methods obtained from Us.
						</li>
					</ol>
				</div>
			</div>
			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					PRIVATE TUTORING AGREEMENT
				</h5>
				<p className="mb-3">
					Please refer here if You/Your Student is enrolled in a PrepExcellence
					tutoring package.
				</p>
				<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-10">
					<li>
						<span className="font-semibold text-primary-dark">Children: </span>
						In compliance with the Children’s Online Privacy Protection Act,
						PrepExcellence does not permit children under 13 years of age to
						become users without their parent or guardian’s express consent and
						approval. By using our Site and receiving tutoring services from Us,
						you represent you are not under 13 years of age.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Scheduling:{" "}
						</span>
						You and Your assigned tutor will agree upon a mutually convenient
						means of scheduling sessions — for example, by email or text
						message. When You and Your tutor agree on a time for an individual
						session or for a recurring session, that session’s scheduling will
						be considered to be active. Students and tutors should communicate
						directly with each other to change the time of any scheduled
						session. A time change for recurring sessions is only considered
						confirmed if it is agreed upon by both parties prior to the start
						time of the session. If it is not agreed upon by both parties, the
						session would still begin at the originally scheduled time, and the
						party seeking the time change will still be subject to any penalties
						that would occur for missing the originally scheduled session. Once
						scheduled, the tutoring agenda may be set/changed based on the
						relationship between the student and tutor and what is requested for
						optimal results.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Student Rescheduling:{" "}
						</span>
						In the event You cancel a session, You must provide PrepExcellence
						and Your tutor with notice of cancellation no less than twenty-four
						(24) hours before the scheduled session. If You fail to provide both
						the company and the tutor at least twenty-four (24) hours notice of
						cancellation, Your time will be reduced as if the session had
						occurred as scheduled. To provide notice of cancellation, please
						email Your tutor and PrepExcellence at tutoring@PrepExcellence.com;
						this message must have “CANCELLATION” as its subject and must list
						the soon-to-be-missed session date time, Your name, and the tutor’s
						name. Tutors may be able to accommodate session changes on shorter
						than twenty-four (24) hours notice; however, tutors are not
						responsible for making such sessions. There is also no guarantee
						that any session will be rescheduled to meet a test deadline,
						regardless of whether or not You make Your request twenty-four (24)
						hours in advance.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Tutor Rescheduling:{" "}
						</span>
						In the event Your tutor must cancel a scheduled session, he/she will
						provide You with notice of cancellation no less than twenty-four
						(24) hours before the scheduled session. If Your tutor fails to
						provide this notice, You will have an amount of time equal to half
						of the scheduled session’s length added to Your remaining available
						tutoring time total.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Late Arrival:{" "}
						</span>
						No adjustment shall be made for time lost because of late arrival by
						You/Your Student. Tutors will compensate for late arrival by
						extending a tutoring session for the time forfeited.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Tutor Changes:{" "}
						</span>
						Occasionally, due to various circumstances, We may replace a tutor
						to whom You have been assigned with another. We will not refund the
						amount You have paid should we replace Your tutor within a
						reasonable amount of time: two (2) weeks. If We are unable to assign
						You/Your Student another tutor within a two (2) week period, We will
						refund all the tuition You have paid, and We will have no further
						liability to You regarding the cancelled tutoring package.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Withdrawals:{" "}
						</span>
						If you choose to withdraw Your/Your Student’s enrollment in a
						tutoring session seven (7) days or more before the first scheduled
						session of your program, PrepExcellence will refund all the tuition
						you have paid less a scheduling fee of $199. No refunds will be
						given for withdrawals after the first scheduled tutoring session. To
						request a withdrawal or cancellation refund, please call us at (877)
						345-7737 or email us at support@PrepExcellence.com. Please be
						advised that refunds for withdrawals typically take four (4) weeks
						to process.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Recordings:{" "}
						</span>
						All PrepExcellence class sessions, tutoring sessions and instruction
						sessions of any kind are recorded for quality assurance and
						administrative purposes. By visiting, logging into, or participating
						in any class, tutoring session or instruction session of any kind,
						you consent to the recording of your presence, participation, and
						any video or audio feeds you enable in that session.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Additional Hours:{" "}
						</span>
						You/Your Student can purchase additional private tutoring hours on
						the Student Dashboard. Additional hours are considered a separate
						purchase and can not be combined with the initial package to receive
						a reduced per hour rate. We cannot guarantee that your original
						tutor will be available for the additional hours. If they are
						unavailable to tutor You/Your Student for the additional hours, then
						PrepExcellence will assign You/Your Student a new tutor.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Refunds & Guarantees:{" "}
						</span>
						Due to the nature of focused subject tutoring, PrepExcellence does
						not offer a point improvement guarantee nor grant refund requests of
						any kind for tutoring packages.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">Copyright: </span>
						You understand that all PrepExcellence tutoring materials and
						methods are the exclusive property of Patel Educational Services
						Inc, DBA PrepExcellence and You agree not to copy, disclose,
						reproduce, sell, or otherwise distribute any information, materials,
						or methods obtained from Us.
					</li>
				</ol>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					ADMISSIONS CONSULTING AGREEMENT
				</h5>
				<p className="mb-3">
					Please refer here for Applicants enrolled in a PrepExcellence
					admissions consulting package.
				</p>
				<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-10">
					<li>
						<span className="font-semibold text-primary-dark">Children: </span>
						In compliance with the Children’s Online Privacy Protection Act,
						PrepExcellence does not permit children under 13 years of age to
						become users without their parent or guardian’s express consent and
						approval. By using our Site and receiving tutoring services from Us,
						You represent You are not under 13 years of age.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Good Faith/Applicant Responsibilities:{" "}
						</span>
						You agree to faithfully pursue the advice provided by Your
						consultant to exert Your best effort in completing the application
						process. This includes, but is not limited to, submitting adequate
						draft essays after consultation and strategy sessions, completing
						online applications to the best of Your ability, obtaining letters
						of recommendation from teachers in a timely manner, submitting
						accurate information, updating colleges about changes in schedule,
						and sending score reports and transcripts to colleges when required.
						Unless otherwise agreed upon in writing via email, You must submit
						all draft responses at least six weeks prior to a deadline.
						PrepExcellence is not responsible for missed deadlines resulting
						from late, inadequate and/or missing draft responses for
						applications and/or from failure to submit required materials. You
						agree to follow timeline established by Admissions Consultant for
						completing applications. PrepExcellence reserves the right to cancel
						an agreement if You are not acting in good faith and/or failure to
						meet deadlines for drafts. No refunds will be given.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Unethical Interference/False Information:{" "}
						</span>
						PrepExcellence reserves the right to cancel an agreement if a
						parent, guardian and/or other person interferes with the application
						process in an inappropriate and/or unethical manner. This includes,
						but is not limited to, a person other than You writing essay drafts,
						communicating false information about familial circumstances and/or
						exaggerating hours per activity. No refunds will be given.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Legal Services:{" "}
						</span>
						Legal Services: This is not an agreement for legal services of any
						kind, which PrepExcellence LLC. does not provide.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">Deadlines: </span>
						It is Your responsibility to inform Your consultant in writing via
						email of any deadline at least eight (8) weeks prior to any
						deadline. This will ensure applications are submitted on time. This
						includes deadlines for any scholarship applications, summer
						programs, and/or other programs.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Application Limit:{" "}
						</span>
						This service is limited to twelve (12) applications per purchase
						with the Flagship package. All UC schools are considered as part of
						the same one (1) application.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Scheduling:{" "}
						</span>
						You and Your assigned consultant will agree upon a mutually
						convenient means of scheduling sessions — for example, by email or
						text message. When You and Your consultant agree on a time for an
						individual session or for a recurring session, that session’s
						scheduling will be considered to be active. You should communicate
						directly with consultants to change the time of any scheduled
						session. You are expected to be vigilant in keeping to the mutually
						agreed upon schedule as part of the Good Faith clause.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Consultant Changes:{" "}
						</span>
						Occasionally, due to various circumstances, We may replace a
						consultant to whom You have been assigned with another. We will not
						refund the amount You have paid should we replace Your consultant
						within a reasonable amount of time of two (2) weeks. If We are
						unable to assign You another consultant within a two (2) week
						period, We will refund all the tuition You have paid, and We will
						have no further liability to You regarding the cancelled consulting
						package.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Additional Applications:{" "}
						</span>
						If You exceed the twelve (12) application limit or hourly limit for
						consulting services purchased with the Flagship package You may
						purchase additional hours at a rate of $300 per hour with Your
						consultant. The Platinum packages offers 50 hours of admissions
						consulting services. Additional hours will be charged at a rate of
						$300 per hour.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">Dispute: </span>
						In the unlikely event of a dispute, You are responsible for travel
						costs for Consultant, costs of Prep classes offered at no additional
						cost with an admissions package, and all hours used with Admissions
						Consulting at rate of $500/hour.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">
							Refunds & Guarantees:{" "}
						</span>
						PrepExcellence does not offer a guarantee of admission to any
						school, express or otherwise implied, nor grant refund requests of
						any kind for admissions consulting.
					</li>
					<li>
						<span className="font-semibold text-primary-dark">Copyright: </span>
						You understand that all PrepExcellence tutoring materials and
						methods are the exclusive property of Patel Educational Services
						Inc, DBA PrepExcellence and You agree not to copy, disclose,
						reproduce, sell, or otherwise distribute any information, materials,
						or methods obtained from Us.
					</li>
				</ol>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					PAYMENT
				</h5>
				<p className="mb-5">
					You must pay the full tuition by the first scheduled date of You/Your
					Student’s service. If you have not paid the full tuition at this
					point, you authorize Us to charge the remaining balance to your credit
					card. All PrepExcellence services require upfront payment. For
					information about paying over time for your PrepExcellence course or
					tutoring package, please view our Affirm payment options.
				</p>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					PREPEXCELLENCE GUARANTEEENT
				</h5>
				<p className="mb-5">
					In order for Us to offer Our guarantees, we are reliant upon You/Your
					Student completing Our course in full (“Completes”). All
					PrepExcellence guarantees may only be used once by each individual
					student; there can be no combining of guarantees in multiple
					purchases. Guarantees are also not valid for bulk or group purchases,
					which are defined as single orders/invoices including two or more
					students. Upon receipt of a refund for a guarantee, You/Your Student
					may lose access to other products you may have purchased from Prep
					Expert, including but not limited to Answer Solutions and previous
					video recordings. By accepting a refund for an applicable guarantee,
					You acknowledge that You may no longer have access to any content You
					may have purchased located in Your dashboard.
				</p>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					200-POINT SCORE IMPROVEMENT GUARANTEE
				</h5>
				<p className="mb-5">
					PrepExcellence is so confident in our SAT prep methodology, we backup
					our 6-Week Flagship SAT Prep Courses with a remarkable 200-Point Score
					Improvement Guarantee℠! You/Your Student qualify for our 200-Point
					Score Improvement Guarantee℠ if:{" "}
				</p>
				<ol className="list-decimal  ps-10 space-y-4 mb-12 text-[19px]">
					<li className="mb-5 [::marker-text-red-500] ">
						You/Your Student have an official SAT or PSAT score (“starting
						score”) before enrolling in a 6-Week Flagship SAT Prep Course. An
						official SAT or PSAT score is one received after taking an official
						SAT or PSAT exam administered by the College Board. Because the PSAT
						and SAT are scored on different scales, official PSAT scores will be
						converted to SAT scores to determine the starting score.
					</li>
					<li className=" mb-5  ">
						You/Your Student have a starting score of 1250 or less. If Your/Your
						Student’s starting score is 1260 and above, You/Your Student qualify
						for an improvement guarantee up to 1450 points.
					</li>
					<li className=" mb-5  ">
						You/Your Student takes another official SAT exam administered by the
						College Board within sixty (60) days after the last official lesson
						(Lesson 12), of Your/Your Student’s course, or the next available
						SAT exam administered by the College Board after the last official
						lesson (Lesson 12), of Your/Your Student’s course. PrepExcellence
						will only accept the first official SAT exam taken after the last
						official lesson (Lesson 12), of You/Your Student’s course.
					</li>

					<ol className="list-disc marker:text-primary-dark ps-10 space-y-4">
						<li>
							<span className="font-semibold text-primary-dark">
								Attendance Completion:{" "}
							</span>
							Attend 80% or a minimum of ten (10) of twelve (12) lessons for at
							least 80% or a minimum of 2 hours 24 minutes of each lesson. To
							verify attendance, usernames will be automatically generated upon
							joining each lesson; You/Your Student must not alter this
							username. You/Your Student must also answer at least 80% of the
							poll questions posed by instructors during the entire course to
							ensure active learning engagement.
						</li>
						<li>
							<span className="font-semibold text-primary-dark">
								Homework Completion:{" "}
							</span>
							Turn in 90%, a minimum of eighteen (18) of twenty (20) homework
							assignments, in full and on time. Each homework assignment must be
							submitted by You/Your Student before the submission deadline.
							Homework assignments submitted late will be considered incomplete.
							Because homework represents a vital component of successful test
							prep, PrepExcellence cannot grant exceptions or extensions to
							homework assignment requirements. Homework assignments must also
							represent a good faith effort on the part of You/Your Student.
							PrepExcellence actively will review homework submissions to verify
							that each assignment represents a good faith effort on the part of
							the student, and You/Your Student will not receive credit for
							homework assignments that do not represent a good faith effort.
						</li>
						<li className="marker:text-destructive!">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:{" "}
							</span>
							Homework Completion also includes completing each essay section
							according to Prep Expert’s essay submission requirements and
							submitting the completed essay in You/Your Student’s dashboard on
							time. All students are required to complete the essay sections.
						</li>
						<li>
							<span className="font-semibold text-primary-dark">
								Practice Test Completion:{" "}
							</span>
							Complete 100%, a minimum of all six (6) assigned practice tests,
							in full and on time. Each practice test must be submitted by
							You/Your Student before the submission deadline. Practice tests
							submitted late will be considered incomplete. Because practice
							tests represent a vital component of successful test prep,
							PrepExcellence cannot grant exceptions or extensions to practice
							test requirements. Practice tests must also represent a good faith
							effort on the part of You/Your Student. PrepExcellence actively
							will review practice test submissions to verify that each practice
							test represents a good faith effort on the part of You/Your
							Student, and You/Your Student will not receive credit for practice
							tests that do not represent a good faith effort. Because practice
							tests must be very strictly timed to serve as effective test
							preparation, each practice test must be completed and submitted
							within a window of time totaling no more than six (6) hours. If
							more than six hours elapse between the submission of the first
							section of a practice test and any other section (including the
							essay section), of that practice test, that practice test will be
							considered incomplete. PLEASE NOTE: Practice Test Completion also
							includes completing each test’s essay section according to Prep
							Expert’s essay submission requirements and submitting the
							completed essay in You/Your Student’s dashboard on time as part of
							the full test. All students are required to complete all essay
							sections.
						</li>
					</ol>
				</ol>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					100-POINT SCORE IMPROVEMENT GUARANTEES
				</h5>
				<p className="mb-5">
					PrepExcellence is so confident in our SAT prep methodology, we backup
					our 3-Week Fast Track SAT Prep Courses with a remarkable 100-Point
					Score Improvement Guarantee℠! You/Your Student qualify for our
					100-Point Score Improvement Guarantee℠ if:
					<br />
				</p>
				<ol className="list-decimal  ps-10 space-y-4 mb-12 text-[19px]">
					<li className="mb-5 ">
						You/Your Student have an official SAT or PSAT score (“starting
						score”) before enrolling in a 3-Week Fast Track SAT Prep Course. An
						official SAT or PSAT score is one received after taking an official
						SAT or PSAT exam administered by the College Board. Because the PSAT
						and SAT are scored on different scales, official PSAT scores will be
						converted to SAT scores to determine the starting score.
					</li>
					<li className=" mb-5  ">
						You/Your Student have a starting score of 1350 or less. If You/Your
						Student’s starting score is 1360 and above, You/Your Student qualify
						for an improvement guarantee up to 1450 points.
					</li>
					<li className=" mb-5  ">
						You/Your Student takes another official SAT exam administered by the
						College Board within sixty (60) days after the last official lesson
						(Lesson 12), of Your/Your Student’s course, or the next available
						SAT exam administered by the College Board after the last official
						lesson (Lesson 12), of Your/Your Student’s course. PrepExcellence
						will only accept the first official SAT exam taken after the last
						official lesson (Lesson 12), of You/Your Student’s course.
					</li>
					<li className="mb-5">
						You/Your Student fully complete (“complete”) our 3-Week Fast Track
						SAT Prep Course. To complete our 3-Week Fast Track SAT Prep Course:
					</li>

					<ol className="list-disc marker:text-primary-dark ps-10 space-y-4">
						<li>
							<span className="font-semibold text-primary-dark">
								Attendance Completion:{" "}
							</span>
							Attend a minimum of seven (7) of eight (8) lessons for at least
							80% or a minimum of 2 hours 24 minutes of each lesson. To verify
							attendance, usernames will be automatically generated upon joining
							each lesson; You/Your Student must not alter this username.
							You/Your Student must also answer at least 80% of the poll
							questions posed by instructors during the entire course to ensure
							active learning engagement.
						</li>
						<li>
							<span className="font-semibold text-primary-dark">
								Homework Completion:{" "}
							</span>
							Turn a minimum of seven (7) of eight (8) homework assignments, in
							full and on time. Each homework assignment must be submitted by
							You/Your Student on the student dashboard before the submission
							deadline. Homework assignments submitted late will be considered
							incomplete. Practice Test Completion. Complete a minimum of all
							four (4) assigned practice tests, in full and on time. Each
							practice test must be submitted by You/Your Student on the student
							dashboard before the submission deadline. Practice tests submitted
							late will be considered incomplete.
						</li>
						<li className="marker:text-destructive! ">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:{" "}
							</span>
							Homework Completion also includes completing each essay section
							according to Prep Expert’s essay submission requirements and
							submitting the completed essay in You/Your Student’s dashboard on
							time. All students are required to complete the essay sections.
						</li>
						<li>
							<span className="font-semibold text-primary-dark">
								Practice Test Completion:{" "}
							</span>
							Complete 100%, a minimum of all six (6) assigned practice tests,
							in full and on time. Each practice test must be submitted by
							You/Your Student before the submission deadline. Practice tests
							submitted late will be considered incomplete. Because practice
							tests represent a vital component of successful test prep,
							PrepExcellence cannot grant exceptions or extensions to practice
							test requirements. Practice tests must also represent a good faith
							effort on the part of You/Your Student. PrepExcellence actively
							will review practice test submissions to verify that each practice
							test represents a good faith effort on the part of You/Your
							Student, and You/Your Student will not receive credit for practice
							tests that do not represent a good faith effort. Because practice
							tests must be very strictly timed to serve as effective test
							preparation, each practice test must be completed and submitted
							within a window of time totaling no more than six (6) hours. If
							more than six hours elapse between the submission of the first
							section of a practice test and any other section (including the
							essay section), of that practice test, that practice test will be
							considered incomplete.
						</li>
						<li className="marker:text-destructive!">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:{" "}
							</span>
							Practice Test Completion also includes completing each test’s
							essay section according to Prep Expert’s essay submission
							requirements and submitting the completed essay in You/Your
							Student’s dashboard on time as part of the full test. All students
							are required to complete all essay sections.
						</li>
					</ol>
				</ol>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					4-POINT SCORE IMPROVEMENT GUARANTEE℠
				</h5>

				<div className="space-y-6 ">
					<p>
						PrepExcellence is so confident in our ACT prep methodology, we
						backup our 6-Week Flagship ACT Prep Courses with a remarkable
						4-Point Score Improvement Guarantee℠! You/Your Student qualify for
						our 4-Point Score Improvement Guarantee℠ if:
					</p>

					<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-10">
						<li className="">
							You/Your Student have an official ACT score ("starting score")
							before enrolling in a 6-Week Flagship ACT Prep Course. An official
							ACT score is one received after taking an official ACT exam
							administered by the ACT.
						</li>

						<li className="">
							You/Your Student have a starting score of 28 or less. If Your/Your
							Student's starting score is 29 and above, You/Your Student qualify
							for an improvement guarantee to 32 points.
						</li>

						<li className="">
							You/Your Student takes another official ACT exam administered by
							the ACT within sixty (60) days after the last official lesson
							(Lesson 12), of Your/Your Student's course, or the next available
							ACT exam administered by the ACT after the last official lesson
							(Lesson 12), of Your/Your Student's course. PrepExcellence will
							only accept the first official ACT exam taken after the last
							official lesson (Lesson 12), of You/Your Student's course.
						</li>

						<li className="">
							You/Your Student fully completes ("complete") our 6-Week Flagship
							ACT Prep Course. To complete our 6-Week Flagship ACT Prep Course:
						</li>
					</ol>

					<ol className="list-disc marker:text-primary-dark  ps-10 space-y-4 mb-12">
						<li className="">
							<span className="font-semibold text-primary-dark">
								Attendance Completion:
							</span>{" "}
							Attend 80% or a minimum of ten (10) of twelve (12) lessons for at
							least 80% or a minimum of 2 hours 24 minutes of each lesson. To
							verify attendance, usernames will be automatically generated upon
							joining each lesson; You/Your Student must not alter this
							username. You/Your Student must submit at least one (1) question
							during course in the chat or learning management.
						</li>

						<li className="">
							<span className="font-semibold text-primary-dark">
								Homework Completion:
							</span>{" "}
							Turn in 90%, a minimum of eighteen (18) of twenty (20) homework
							assignments, in full and on time. Each homework assignment must be
							submitted by You/Your Student before the submission deadline.
							Homework assignments submitted late will be considered incomplete.
							Because homework represents a combination of successful test prep,
							PrepExcellence instructional services and extensions or homework
							assignment requirements, Homework assignments must also represent
							a good faith effort on the part of You/Your Student.
							PrepExcellence actively will review homework submissions to verify
							that each assignment represents a good faith effort on the part of
							the student; and You/Your Student will not receive credit for
							homework assignments that do not represent a good faith effort.
						</li>

						<li className="marker:text-destructive!">
							<span className="font-semibold text-[#FF0000]">PLEASE NOTE:</span>{" "}
							Homework Completion also includes completing each essay section
							(also known as the writing section) according to Prep Expert's
							essay submission requirements and submitting the completed essay
							in You/Your Student's dashboard on time. All students are required
							to complete the essay sections.
						</li>

						<li className="">
							<span className="font-semibold text-primary-dark">
								Practice Test Completion:
							</span>{" "}
							Complete 100%, a minimum of all six (6) assigned practice tests,
							in full and on time. Each practice test must be submitted by
							You/Your Student before the submission deadline. Practice tests
							submitted late will be considered incomplete. Because practice
							tests represent a component of successful test prep,
							PrepExcellence cannot grant exceptions or extensions to practice
							test requirements. Practice tests must also represent a good faith
							effort on the part of You/Your Student, and You/Your Student will
							not receive credit for practice tests that do not represent a good
							faith effort. Because practice tests must be very strictly timed
							to serve as effective test preparation, each practice test must be
							completed and submitted within a window after being started. After
							the submission of the first section of a practice test and any
							other section (including the essay section), of that practice
							test, that practice test will be considered incomplete.
						</li>

						<li className="marker:text-destructive!">
							<span className="font-semibold text-[#FF0000]">PLEASE NOTE:</span>{" "}
							Practice Test Completion also includes completing each test's
							essay section (also known as the writing section) according to
							Prep Expert's essay submission requirements and submitting the
							completed essay in You/Your Student's dashboard on time as part of
							the full test. All students are required to complete all essay
							sections.
						</li>
					</ol>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					2-POINT SCORE IMPROVEMENT GUARANTEESM
				</h5>

				<div className="space-y-6 ">
					<p>
						PrepExcellence is so confident in our ACT prep methodology, we
						backup our 3-Week Fast Track ACT Prep Courses with a remarkable
						2-Point Score Improvement Guarantee℠! You/Your Student qualify for
						our 2-Point Score Improvement Guarantee℠ if:
					</p>

					<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-10">
						<li className="">
							You/Your Student have an official ACT score (“starting score”)
							before enrolling in a 3-Week Fast Track ACT Prep Course. An
							official ACT score is one received after taking an official ACT
							exam administered by the ACT.
						</li>

						<li className="">
							You/Your Student have a starting score of 30 or less. If Your/Your
							Student’s starting score is 31 and above, You/Your Student qualify
							for an improvement guarantee up to 32 points.
						</li>

						<li className="">
							You/Your Student takes another official ACT exam administered by
							the ACT within sixty (60) days after the last official lesson
							(Lesson 12), of Your/Your Student’s course, or the next available
							ACT exam administered by the ACT after the last official lesson
							(Lesson 12), of Your/Your Student’s course. PrepExcellence will
							only accept the first official ACT exam taken after the last
							official lesson (Lesson 12), of You/Your Student’s course.
						</li>

						<li className="">
							You/Your Student fully completes (“complete”) our 3-Week Fast
							Track ACT Prep Course. To complete our 3-Week Fast Track ACT Prep
							Course:
						</li>
					</ol>

					<ol className="list-disc marker:text-primary-dark  ps-10 space-y-4 mb-12">
						<li className="">
							<span className="font-semibold text-primary-dark">
								Attendance Completion:
							</span>{" "}
							Attend 80% or a minimum of ten (10) of twelve (12) lessons for at
							least 80% or a minimum of 2 hours 24 minutes of each lesson. To
							verify attendance, usernames will be automatically generated upon
							joining each lesson; You/Your Student must not alter this
							username. You/Your Student must also answer at least 80% of the
							poll questions posed by instructors during the entire course to
							ensure active learning engagement.
						</li>

						<li className="">
							<span className="font-semibold text-primary-dark">
								Homework Completion:
							</span>{" "}
							Turn in 90%, a minimum of eighteen (18) of twenty (20) homework
							assignments, in full and on time. Each homework assignment must be
							submitted by You/Your Student before the submission deadline.
							Homework assignments submitted late will be considered incomplete.
							Because homework represents a vital component of successful test
							prep, PrepExcellence cannot grant exceptions or extensions to
							homework assignment requirements. Homework assignments must also
							represent a good faith effort on the part of You/Your Student.
							PrepExcellence actively will review homework submissions to verify
							that each assignment represents a good faith effort on the part of
							the student, and You/Your Student will not receive credit for
							homework assignments that do not represent a good faith effort.
						</li>

						<li className="marker:text-destructive!">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:
							</span>{" "}
							Homework Completion also includes completing each essay section
							(also known as the writing section) according to Prep Expert’s
							essay submission requirements and submitting the completed essay
							in You/Your Student’s dashboard on time. All students are required
							to complete the essay sections.
						</li>

						<li className="">
							<span className="font-semibold text-primary-dark">
								Practice Test Completion:
							</span>{" "}
							Complete 100%, a minimum of all six (6) assigned practice tests,
							in full and on time. Each practice test must be submitted by
							You/Your Student before the submission deadline. Practice tests
							submitted late will be considered incomplete. Because practice
							tests represent a vital component of successful test prep,
							PrepExcellence cannot grant exceptions or extensions to practice
							test requirements. Practice tests must also represent a good faith
							effort on the part of You/Your Student. PrepExcellence actively
							will review practice test submissions to verify that each practice
							test represents a good faith effort on the part of You/Your
							Student, and You/Your Student will not receive credit for practice
							tests that do not represent a good faith effort. Because practice
							tests must be very strictly timed to serve as effective test
							preparation, each practice test must be completed and submitted
							within a window of time totaling no more than six hours. If more
							than six (6) hours elapse between the submission of the first
							section of a practice test and any other section (including the
							essay section), of that practice test, that practice test will be
							considered incomplete.
						</li>

						<li className="marker:text-destructive!">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:
							</span>{" "}
							Practice Test Completion also includes completing each test’s
							essay section (also known as the writing section) according to
							Prep Expert’s essay submission requirements and submitting the
							completed essay in You/Your Student’s dashboard on time as part of
							the full test. All students are required to complete all essay
							sections.
						</li>
					</ol>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					SCORE IMPROVEMENT GUARANTEESM(PSAT)
				</h5>

				<div className="space-y-6 ">
					<p>
						PrepExcellence is so confident in our PSAT prep methodology, we
						backup our 4-Week PSAT Prep Courses with a remarkable Score
						Improvement Guarantee℠! Our Score Improvement Guarantee℠ guarantees
						that You/Your Student will improve a PSAT/NMSQT score by at least
						ten (10) points. You/Your Student qualify for our Score Improvement
						Guarantee℠ if:
					</p>

					<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-10">
						<li className="">
							You/Your Student have an official PSAT 10 (“starting score”)
							before enrolling in a 4-Week PSAT Prep Course. An official PSAT 10
							score is one received after taking an official PSAT 10 exam
							administered by the College Board.
						</li>

						<li className="">
							You/Your Student have a starting score of 1360 or less. If
							Your/Your Student’s starting score is 1370 and above, You/Your
							Student does not qualify for Our Score Improvement Guarantee℠.
						</li>

						<li className="">
							You/Your Student takes an official PSAT/NMSQT exam administered by
							the College Board within one hundred and twenty (120) days after
							the last official lesson (Lesson 8), of Your/Your Student’s
							course, or the next available PSAT/NMSQT exam administered by the
							College Board after the last official lesson (Lesson 8), of
							Your/Your Student’s course. PrepExcellence will only accept the
							first official PSAT/NMSQT exam taken after the last official
							lesson (Lesson 8), of You/Your Student’s course.
						</li>

						<li className="">
							You/Your Student Completes our 4-Week PSAT Prep Course. To
							Complete our 4-Week PSAT Prep Course:
						</li>
					</ol>

					<ol className="list-disc marker:text-primary-dark  ps-10 space-y-4 mb-12">
						<li className="">
							<span className="font-semibold text-primary-dark">
								Attendance Completion:
							</span>{" "}
							Attend a minimum of seven (7) of eight (8) lessons for at least
							80% or a minimum of 2 hours 24 minutes of each lesson. To verify
							attendance, usernames will be automatically generated upon joining
							each lesson; You/Your Student must not alter this username.
							You/Your Student must also answer at least 80% of the poll
							questions posed by instructors during the entire course to ensure
							active learning engagement.
						</li>

						<li className="">
							<span className="font-semibold text-primary-dark">
								Homework Completion:
							</span>{" "}
							Turn a minimum of seven (7) of eight (8) homework assignments, in
							full and on time. Each homework assignment must be submitted by
							You/Your Student on the student dashboard before the submission
							deadline. Homework assignments submitted late will be considered
							incomplete. Practice Test Completion. Complete a minimum of all
							four (4) assigned practice tests, in full and on time. Each
							practice test must be submitted by You/Your Student on the student
							dashboard before the submission deadline. Practice tests submitted
							late will be considered incomplete.
						</li>
					</ol>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					SCORE IMPROVEMENT GUARANTEESM
				</h5>

				<div className="space-y-6 ">
					<p>
						PrepExcellenceis so confident in our SAT/ACT/GMAT prep methodology,
						we backup our Self-Paced Video SAT/ACT/GMAT Prep Courses with a
						remarkable Score Improvement Guarantee℠! Our Score Improvement
						Guarantee℠ guarantees that You/Your Student will improve an SAT
						score by at least ten (10) points, an ACT score by at least one (1)
						point, or a GMAT score by at least ten (10) points. You/Your Student
						qualify for our Score Improvement Guarantee℠ if:
					</p>

					<ol className="list-decimal marker:text-primary-dark ps-10 space-y-4 mb-10">
						<li className="">
							You/Your Student have an official SAT/PSAT/ACT/GMAT score
							(“starting score”) before enrolling in a Self-Paced Video
							SAT/ACT/GMAT Prep Course. An official SATor PSAT score is one
							received after taking an official SAT exam administered by the
							College Board. Because the PSAT and SAT are scored on different
							scales, official PSAT scores will be converted to SAT scores to
							determine the starting score. An official ACT score is one
							received after taking an official ACT exam administered by the
							ACT. An official GMAT score is one received after taking an
							official GMAT exam administered by the Graduate Management
							Admission Council.
						</li>

						<li className="">
							You/Your Student have a starting score of 1440 or less (SAT),
							and/or 31 or less (ACT), and/or 700 or less (GMAT). If Your/Your
							Student’s starting score is 1450 (SAT), and/or 32 (ACT), and/or
							700 (GMAT), and above, You/Your Student does not qualify for Our
							Score Improvement Guarantee.℠You/Your Student takes another
							official SAT/ACT/GMAT exam administered by the College Board, ACT,
							or Graduate Management Admission Council, respectively, within
							sixty (60) days after the last official lesson (Lesson 12), of
							Your/Your Student’s course. PrepExcellence will only accept the
							first official SAT exam taken after the last official lesson
							(Lesson 12), of You/Your Student’s course.
						</li>

						<li className="">
							You/Your Student fully completes (“complete”) our Self-Paced Video
							SAT/ACT Prep Course. To complete our Self-Paced Video SAT/ACT Prep
							Course:
						</li>
					</ol>

					<ol className="list-disc marker:text-primary-dark  ps-10 space-y-4 mb-12">
						<li className="">
							<span className="font-semibold text-primary-dark">
								Attendance Completion. (SAT/ACT/GMAT):
							</span>{" "}
							Attend 100%, or watch every prerecorded lesson in full prior to
							taking an official SAT/ACT/GMAT.
						</li>

						<li className="">
							<span className="font-semibold text-primary-dark">
								Homework Completion. (SAT/ACT):
							</span>{" "}
							Turn in 90%, a minimum of eighteen (18) of twenty (20) homework
							assignments, in full prior to taking an official SAT/ACT. Homework
							assignments must represent a good faith effort on the part of
							You/Your Student. PrepExcellence actively will review homework
							submissions to verify that each assignment represents a good faith
							effort on the part of the student, and You/Your Student will not
							receive credit for homework assignments that do not represent a
							good faith effort.
						</li>
						<li className="marker:text-destructive!">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:
							</span>{" "}
							Homework Completion also includes completing each essay section
							(also known as the writing section on the ACT and the analytical
							writing assessment on the GMAT) according to Prep Expert’s essay
							submission requirements and submitting the completed essay in
							You/Your Student’s dashboard on time. All students are required to
							complete the essay sections.
						</li>
						<li className="">
							<span className="font-semibold text-primary-dark">
								Practice Test Completion. (SAT/ACT):
							</span>{" "}
							Complete 100%, a minimum of all six (6) assigned practice tests,
							in full prior to taking an official SAT/ACT. Practice tests must
							represent a good faith effort on the part of You/Your Student.
							PrepExcellence actively will review practice test submissions to
							verify that each practice test represents a good faith effort on
							the part of You/Your Student, and You/Your Student will not
							receive credit for practice tests that do not represent a good
							faith effort. Because practice tests must be very strictly timed
							to serve as effective test preparation, each practice test must be
							completed and submitted within a window of time totaling no more
							than six (6) hours. If more than six (6) hours elapse between the
							submission of the first section of a practice test and any other
							section (including the essay section), of that practice test, that
							practice test will be considered incomplete.
						</li>
						<li className="marker:text-destructive!">
							<span className="font-semibold text-destructive">
								PLEASE NOTE:
							</span>{" "}
							Practice Test Completion also includes completing each test’s
							essay section (also known as the writing section on the ACT and
							the analytical writing assessment on the GMAT) according to Prep
							Expert’s essay submission requirements and submitting the
							completed essay in You/Your Student’s dashboard on time as part of
							the full test. All students are required to complete all essay
							sections.
						</li>
					</ol>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					GUARANTEE REFUND REQUESTS
				</h5>

				<div className="space-y-6 ">
					<p>
						If You (the Payee) would like to request a refund from
						PrepExcellence having met the qualifications of a particular
						guarantee, you must submit an official score report from a qualified
						exam taken before the course start and an official score report from
						a qualified exam taken within sixty (60) days after the final
						lesson.
					</p>

					<p>
						The score reports must be downloaded from the College Board or ACT
						website and show Your Student’s full name, score, and date of the
						exam. If you are having issues with locating your official score
						report on the College Board’s website, you can contact them at (866)
						630-9305 or go to collegeboard.org. If you are having issues with
						locating your official score report on the ACT’s website, you can
						contact them at (319) 337-1270 or go to act.org. Official score
						reports from each testing agency are free to download online. Please
						attach the official score reports to an email with the subject line
						“Refund Request” and send it to support@PrepExcellence.com. If you
						have any questions, then call us at{" "}
						<span className="text-[#2600FF]">877.345.7737.</span>{" "}
					</p>
					<p>PSAT Sample Score Report</p>
					<p>ACT Sample Score Report</p>
					<p>SAT Sample Score Report</p>
					<p>
						If You (the Payee) would like to request a refund from
						PrepExcellence having met the qualifications of the Higher Grade
						GuaranteeSM, you must submit an official report card or transcript
						from your accredited public, private, parochial, or charter school
						showing your starting grade and the resulting grade after taking our
						course. Please attach the official report card or transcript to an
						email with the subject line “Refund Request” and send it to{" "}
						<span className="text-[#2600FF]">support@PrepExcellence.com</span>.
						If you have any questions, then call us at{" "}
						<span className="text-[#2600FF]">877.345.7737.</span>
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					SALES & DISCOUNTS
				</h5>

				<div className="space-y-6 ">
					<p>
						If the prices on our website are reduced within seventy-two (72)
						hours on a course(s) you have purchased, we will refund the
						difference to you as long as you contact us within one (1) week
						after your purchase date. To contact us, please email
						support@PrepExcellence.com or call (877) 345-7737 between 9:00AM and
						5:00PM PST during normal business days.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					REFERRAL PROGRAM
				</h5>

				<div className="space-y-6 ">
					<p>
						Refer a friend to take a test prep program with us, whether a course
						or private tutoring (other than an PSAT and SAT program that is
						$1,000 or more). To sign up for the Study Together, Earn Money
						Together Referral Program, create an account on the referral program
						page or log into the page with your account information. From that
						page, you can send your friend a personalized link to register for a
						test prep program by entering your friend’s email address, share the
						link through Facebook, or copy the link and send it yourself. We
						will send you and your friend a $25 Amazon.com Gift Card* by email
						about 30 days after:your friend uses your personalized link to
						register for a test prep program that is $199 or more and starts the
						test prep program, and you start a test prep program with us that is
						$199 or more (or you have previously taken such a program according
						to our records). This referral program is only available to U.S. and
						Canada customers.
					</p>
					<p>
						<span className="font-semibold text-primary-dark">
							For the invited friend:{" "}
						</span>{" "}
						We will notify the friend who invited you when you enroll in a test
						prep program and have earned the gift card.
					</p>
					<p>
						<span className="font-semibold text-primary-dark">
							PSAT and SAT REFER-A-FRIEND Program Special Terms and Conditions:{" "}
						</span>{" "}
						Refer a friend to take an PSAT or SAT program with us, whether a
						course or private tutoring. To sign up for the PSAT or SAT
						Refer-A-Friend Program, create an account on the referral program
						page or log into the page with your account information. From that
						page, you can send your friend a personalized link to register for
						an PSAT or SAT program by entering your friend’s email address,
						share the link through Facebook, or copy the link and send it
						yourself. We will send you and your friend a $100 Amazon.com Gift
						Card by email about 30 days after:
					</p>
					<ol className="list-decimal ps-10 space-y-4 mb-10">
						<li className="">
							your friend uses your personalized link to register for an PSAT or
							SAT program that is $1,000 or more and starts the program, and
						</li>
						<li className="">
							you start an PSAT or SAT program with us that is $1,000 or more
							(or you have previously taken such a program according to our
							records).
						</li>
					</ol>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					CUSTOMER AFFILIATE PROGRAM AND POLICY
				</h5>

				<div className="space-y-6 ">
					<p>
						Upon purchase, You will automatically be enrolled in the Customer
						Affiliate Program. Upon entering the student information on the
						student dashboard, Your Student will have the option to agree to the
						Terms of Service and enroll in the Customer Affiliate Program.
					</p>
					<p>
						By signing up for Our Customer Affiliate Program, you agree not to
						use referral codes/links directly on any orders you place, and not
						to offer any existing or potential customers any discounts, coupons,
						or advertisements (digital/PPC or print), relating to
						PrepExcellence.com, our Sites and/or Our products or services.For a
						sale to generate a commission, the person referred must follow a
						properly formatted link (“Link”) to our Site, purchase the product
						on our Site, and pay us in full. You are entitled to a commission
						only if Prep Expert’s third-party tracking system tracks the
						referred customer’s purchase from the time the customer clicks on a
						Link to our Site to the time of sale. PrepExcellence is not
						responsible or liable for payment for a referee’s deletion of a
						required cookie or any tracking failures of the third party tracking
						system We use to count referral conversions. The referred customer
						must spend at least three-hundred dollars ($300) and be enrolled in
						a course and remain enrolled in a course through the start date
						before the commission is paid to the Customer Affiliate. Referrals
						will not be generated with Private Tutoring purchases.
					</p>
					<p>
						You may post your referral link to various social media platforms,
						blogs, and email campaigns as a way to increase your affiliate
						sales; however, You agree not to promote PrepExcellence LLC. on any
						customer cash-back or any other type of “loyalty” or “incentive”
						program, unless you have received a specific written exemption from
						Us.
					</p>
					<p>
						Commissions sent electronically via PayPal for each verified sale
						generated by Your Link. Commissions will be paid out on the 5th or
						20th of each month after the referred student’s course starts. If
						the 5th or 20th is on either Saturday/Sunday or holiday, then the
						commission will be paid out the following business day. Commissions
						will not be paid out in other forms, including but not limited to
						checks, credits to additional courses, and wire transfers to bank
						accounts.Should you follow these policies, You may receive a
						commission in connection with qualifying sales. To enable us to
						credit You with an earned commission, You must be a PrepExcellence
						customer with a PrepExcellence order history to receive payment for
						referral purchases.
					</p>
					<p>
						We have no obligation to pay or authorize commissions for orders
						placed after the termination of this agreement. For the avoidance of
						doubt, We reserve the right to reverse and/or deny commissions for
						referrals for any reason, whether or not resulting directly or
						indirectly from your violation of any term or condition of this
						agreement at the discretion of PrepExcellence LLC. We also reserve
						the right to remove You/Your Student from the Customer Affiliate
						Program for any reason.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					AFFILIATE PROGRAM AND POLICY
				</h5>

				<div className="space-y-6 ">
					<p>
						By signing up for Our Affiliate Program, you agree not to use
						referral codes/links directly on any orders you place, and not to
						offer any existing or potential customers any discounts, coupons, or
						advertisements (digital/PPC or print), relating to
						PrepExcellence.com, our Sites and/or Our products or services.
					</p>
					<p>
						For a sale to generate a commission, the person referred must follow
						a properly formatted link (“Link”) to our Site, purchase the product
						on our Site, and pay us in full. You are entitled to a commission
						only if Prep Expert’s third-party tracking system tracks the
						referred customer’s purchase from the time the customer clicks on a
						Link to our Site to the time of sale. PrepExcellence is not
						responsible or liable for payment for a referee’s deletion of a
						required cookie or any tracking failures of the third party tracking
						system We use to count referral conversions. The referred customer
						must spend at least three-hundred dollars ($300) and must be
						enrolled in a course and remain enrolled in a course through the
						start date before the commission is paid to the Affiliate. Referrals
						will not be generated with Private Tutoring purchases.
					</p>
					<p>
						You may post your referral link to various social media platforms,
						blogs, and email campaigns as a way to increase your affiliate
						sales; however, You agree not to promote PrepExcellence LLC. on any
						customer cash-back or any other type of “loyalty” or “incentive”
						program, unless you have received a specific written exemption from
						Us. Posting your Link on coupon sites is prohibited.
					</p>
					<p>
						Commissions sent electronically via PayPal for each verified sale
						generated by Your Link. Commissions will be paid out on the 5th or
						20th of each month after the referred student’s course starts. If
						the 5th or 20th is on either Saturday/Sunday or holiday, then the
						commission will be paid out the following business day. Commissions
						will not be paid out in other forms, including but not limited to
						checks, credits to additional courses, and wire transfers to bank
						accounts.Should you follow these policies, You may receive a
						commission in connection with qualifying sales. To enable us to
						credit You with an earned commission, You must be an approved
						PrepExcellence Affiliate to receive payment for referral purchases.
					</p>
					<p>
						We have no obligation to pay or authorize commissions for orders
						placed after the termination of this agreement. For the avoidance of
						doubt, We reserve the right to reverse and/or deny commissions for
						referrals for any reason, whether or not resulting directly or
						indirectly from your violation of any term or condition of this
						agreement at the discretion of PrepExcellence LLC. We also reserve
						the right to remove you from the Affiliate Program for any reason.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					TERMINATION
				</h5>

				<div className="space-y-6 ">
					<p>
						We may terminate, change, suspend or discontinue any aspect of the
						Site or the Site’s products or services at any time. We may
						restrict, suspend or terminate your access to the Site and/or its
						products or services if we believe you are in breach of these Terms
						and Conditions or applicable law, you are a repeat infringer of
						intellectual property rights, or for any other reason without notice
						or liability.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					CHANGES TO TERMS OF USE
				</h5>

				<div className="space-y-6 ">
					<p>
						We reserve the right, at our sole discretion, to modify any portion
						of these Terms and Conditions at any time. Changes in these Terms
						and Conditions will be effective when posted. Your continued use of
						the Site and/or the products or services offered on or through the
						Site after any changes to these Terms and Conditions are posted will
						be considered acceptance of those changes.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					COMMUNICATION
				</h5>

				<div className="space-y-6 ">
					<p>
						If you provide us your email address, you agree and consent to
						receive email messages from us. These emails may be transactional or
						relationship communications relating to the products or services we
						offer, such as administrative notices and service announcements or
						changes, or emails containing commercial offers, promotions or
						special offers from us. You also may sign up, and therefore agree,
						to receive SMS or text messages on your mobile phone.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					MISCELLANEOUS
				</h5>

				<div className="space-y-6 ">
					<p>
						These Terms and Conditions comprise the entire agreement between you
						and us concerning the subject matter of these Terms and Conditions.
						Our failure to exercise or enforce any right or provision of these
						Terms and Conditions will not constitute a waiver of such right or
						provision. We may assign these Terms and Conditions to any person or
						entity without your consent. You may not assign these Terms and
						Conditions without our prior written consent. If any provision of
						these Terms and Conditions is found by a court of competent
						jurisdiction to be invalid, the parties nevertheless agree that the
						court should endeavor to give effect to the parties’ intentions as
						reflected in the provision, and the other provisions of these Terms
						and Conditions remain in full force and effect. Sections 1, 3-6,
						9-14, 17-20 and any other provisions of these Terms and Conditions
						which would be expected to survive the termination or expiration of
						your relationship with us will so survive.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					ALL ACCOUNTS
				</h5>

				<div className="space-y-6 ">
					<p>
						If you enroll in any of PrepExcellence’s Site test preparation
						service you will have an account and a password. Access to password
						protected portions of this Site is available for only so long as you
						have paid all required fees to PrepExcellence. You are responsible
						for maintaining the confidentiality of your account and password and
						for restricting access to PrepExcellence’s Site course material to
						anyone other than yourself. You agree to accept responsibility for
						all activities that occur under your account or password.
						PrepExcellence reserves the right to refuse service, terminate
						accounts, remove or edit content, or cancel orders in its sole
						discretion.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					SMS/MMS MOBILE MESSAGE MARKETING PROGRAM TERMS AND CONDITIONS
				</h5>

				<div className="space-y-6 ">
					<p>
						PrepExcellence (hereinafter, “We,” “Us,” “Our”) is offering a mobile
						messaging program (the “Program”), which you agree to use and
						participate in subject to these Mobile Messaging Terms and
						Conditions and Privacy Policy (the “Agreement”). By opting in to or
						participating in any of our Programs, you accept and agree to these
						terms and conditions, including, without limitation, your agreement
						to resolve any disputes with us through binding, individual-only
						arbitration, as detailed in the “Dispute Resolution” section below.
						This Agreement is limited to the Program and is not intended to
						modify other Terms and Conditions or Privacy Policy that may govern
						the relationship between you and Us in other contexts.
					</p>
					<p>
						<span className="text-primary-dark">User Opt In:</span> The Program
						allows Users to receive SMS/MMS mobile messages by affirmatively
						opting into the Program, such as through online or application-based
						enrollment forms. Regardless of the opt-in method you utilized to
						join the Program, you agree that this Agreement applies to your
						participation in the Program. By participating in the Program, you
						agree to receive autodialed or prerecorded marketing mobile messages
						at the phone number associated with your opt-in, and you understand
						that consent is not required to make any purchase from Us. While you
						consent to receive messages sent using an autodialer, the foregoing
						shall not be interpreted to suggest or imply that any or all of Our
						mobile messages are sent using an automatic telephone dialing system
						(“ATDS” or “autodialer”). Message and data rates may apply.
					</p>
					<p>
						<span className="text-primary-dark">User Opt Out:</span> The Program
						If you do not wish to continue participating in the Program or no
						longer agree to this Agreement, you agree to reply STOP, END,
						CANCEL, UNSUBSCRIBE, or QUIT to any mobile message from Us in order
						to opt out of the Program. You may receive an additional mobile
						message confirming your decision to opt out. You understand and
						agree that the foregoing options are the only reasonable methods of
						opting out. You also understand and agree that any other method of
						opting out, including, but not limited to, texting words other than
						those set forth above or verbally requesting one of our employees to
						remove you from our list, is not a reasonable means of opting out.
					</p>
					<p>
						<span className="text-primary-dark">
							Duty to Notify and Indemnify:
						</span>{" "}
						The Program If at any time you intend to stop using the mobile
						telephone number that has been used to subscribe to the Program,
						including cancelling your service plan or selling or transferring
						the phone number to another party, you agree that you will complete
						the User Opt Out process set forth above prior to ending your use of
						the mobile telephone number. You understand and agree that your
						agreement to do so is a material part of these terms and conditions.
						You further agree that, if you discontinue the use of your mobile
						telephone number without notifying Us of such change, you agree that
						you will be responsible for all costs (including attorneys’ fees)
						and liabilities incurred by Us, or any party that assists in the
						delivery of the mobile messages, as a result of claims brought by
						individual(s) who are later assigned that mobile telephone number.
						This duty and agreement shall survive any cancellation or
						termination of your agreement to participate in any of our Programs.
					</p>
					<p className="uppercase font-semibold">
						YOU AGREE THAT YOU SHALL INDEMNIFY, DEFEND, AND HOLD US HARMLESS
						FROM ANY CLAIM OR LIABILITY RESULTING FROM YOUR FAILURE TO NOTIFY US
						OF A CHANGE IN THE INFORMATION YOU HAVE PROVIDED, INCLUDING ANY
						CLAIM OR LIABILITY UNDER THE TELEPHONE CONSUMER PROTECTION ACT, 47
						U.S.C. § 227, et seq., OR SIMILAR STATE AND FEDERAL LAWS, AND ANY
						REGULATIONS PROMULGATED THEREUNDER RESULTING FROM US ATTEMPTING TO
						CONTACT YOU AT THE MOBILE TELEPHONE NUMBER YOU PROVIDED.
					</p>
					<p>
						<span className="text-primary-dark">Program Description:</span>{" "}
						Without limiting the scope of the Program, users that opt into the
						Program can expect to receive messages concerning the marketing and
						sale of test prep courses, webinars, books, consulting, and other
						test prep & educational related services provided by PrepExcellence
						and/or it’s affiliated partners.
					</p>
					<p>
						<span className="text-primary-dark">Cost and Frequency:</span>{" "}
						Message and data rates may apply. The Program involves recurring
						mobile messages, and additional mobile messages may be sent
						periodically based on your interaction with Us.
					</p>
					<p>
						<span className="text-primary-dark">Support Instructions:</span> For
						support regarding the Program, text “HELP” to the number you
						received messages from or email us at support@PrepExcellence.com.
						Please note that the use of this email address is not an acceptable
						method of opting out of the program. Opt outs must be submitted in
						accordance with the procedures set forth above.
					</p>
					<p>
						<span className="text-primary-dark">MMS Disclosure:</span> For The
						Program will send SMS TMs (terminating messages) if your mobile
						device does not support MMS messaging.
					</p>
					<p>
						<span className="text-primary-dark">
							Our Disclaimer of Warranty:
						</span>{" "}
						For The Program is offered on an “as-is” basis and may not be
						available in all areas at all times and may not continue to work in
						the event of product, software, coverage or other changes made by
						your wireless carrier. We will not be liable for any delays or
						failures in the receipt of any mobile messages connected with this
						Program. Delivery of mobile messages is subject to effective
						transmission from your wireless service provider/network operator
						and is outside of Our control. T-Mobile is not liable for delayed or
						undelivered mobile messages.
					</p>
					<p>
						<span className="text-primary-dark">Participant Requirements:</span>
						You must have a wireless device of your own, capable of two-way
						messaging, be using a participating wireless carrier, and be a
						wireless service subscriber with text messaging service. Not all
						cellular phone providers carry the necessary service to participate.
						Check your phone capabilities for specific text messaging
						instructions.
					</p>
					<p>
						<span className="text-primary-dark">Age Restriction:</span>
						You may not use of engage with the Platform if you are under
						thirteen (13) years of age. If you use or engage with the Platform
						and are between the ages of thirteen (13) and eighteen (18) years of
						age, you must have your parent’s or legal guardian’s permission to
						do so. By using or engaging with the Platform, you acknowledge and
						agree that you are not under the age of thirteen (13) years, are
						between the ages of thirteen (13) and eighteen (18) andhave your
						parent’s or legal guardian’s permission to use or engage with the
						Platform, or are of adult age in your jurisdiction. By using or
						engaging with the Platform, you also acknowledge and agree that you
						are permitted by your jurisdiction’s Applicable Law to use and/or
						engage with the Platform.Prohibited Content: You acknowledge and
						agree to not send any prohibited content over the Platform.
						Prohibited content includes:
					</p>
					<p>
						– Any fraudulent, libelous, defamatory, scandalous, threatening,
						harassing, or stalking activity;
					</p>
					<p>
						- Objectionable content, including profanity, obscenity,
						lasciviousness, violence, bigotry, hatred, and discrimination on the
						basis of race, sex, religion, nationality, disability, sexual
						orientation, or age;
					</p>
					<p>
						- Pirated computer programs, viruses, worms, Trojan horses, or other
						harmful code;
					</p>
					<p>
						- Any product, service, or promotion that is unlawful where such
						product, service, or promotion thereof is received;
					</p>
					<p>
						- Any content that implicates and/or references personal health
						information that is protected by the Health Insurance Portability
						and Accountability Act (“HIPAA”) or the Health Information
						Technology for Economic and Clinical Health Act (“HITEC” Act); and
					</p>
					<p>
						- Any other content that is prohibited by Applicable Law in the
						jurisdiction from which the message is sent.
					</p>
					<p>
						<span className="text-primary-dark">Dispute Resolution: </span> We
						do not In the event that there is a dispute, claim, or controversy
						between you and Us, or between you and 317 LABS, INC. or any other
						third-party service provider acting on Our behalf to transmit the
						mobile messages within the scope of the Program, arising out of or
						relating to federal or statestatutory claims, common law claims,
						this Agreement, or the breach, termination, enforcement,
						interpretation or validity thereof, including the determination of
						the scope or applicability of this agreement to arbitrate, such
						dispute, claim, or controversy will be, to the fullest extent
						permitted by law, determined by arbitration in Las Vegas, Nevada
						before one arbitrator.
					</p>
					<p>
						The parties agree to submit the dispute to binding arbitration in
						accordance with the Commercial Arbitration Rules of the American
						Arbitration Association (“AAA”) then in effect. Except as otherwise
						provided herein, the arbitrator shall apply the substantive laws of
						the Federal Judicial Circuit in which Prep Expert’s principle place
						of business is located, without regard to its conflict of laws
						rules. Within ten (10) calendar days after the arbitration demand is
						served upon a party, the parties must jointly select an arbitrator
						with at least five years’ experience in that capacity and who has
						knowledge of and experience with the subject matter of the dispute.
						If the parties do not agree on an arbitrator within ten (10)
						calendar days, a party may petition the AAA to appoint an
						arbitrator, who must satisfy the same experience requirement. In the
						event of a dispute, the arbitrator shall decide the enforceability
						and interpretation of this arbitration agreement in accordance with
						the Federal Arbitration Act (“FAA”). The parties also agree that the
						AAA’s rules governing Emergency Measures of Protection shall apply
						in lieu of seeking emergency injunctive relief from a court. The
						decision of the arbitrator shall be final and binding, and no party
						shall have rights of appeal except for those provided in section 10
						of the FAA. Each party shall bear its share of the fees paid for the
						arbitrator and the administration of the arbitration; however, the
						arbitrator shall have the power to order one party to pay all or any
						portion of such fees as part of a well-reasoned decision. The
						parties agree that the arbitrator shall have the authority to award
						attorneys’ fees only to the extent expressly authorized by statute
						or contract. The arbitrator shall have no authority to award
						punitive damages and each party hereby waives any right to seek or
						recover punitive damages with respect to any dispute resolved by
						arbitration. The parties agree to arbitrate solely on an individual
						basis, and this agreement does not permit class arbitration, or any
						claims brought as a plaintiff or class member in any class or
						representative arbitration proceeding. Except as may be required by
						law, neither a party nor the arbitrator may disclose the existence,
						content, or results of any arbitration without the prior written
						consent of both parties, unless
					</p>
					<p>
						- to protect or pursue a legal right. If any term or provision of
						this Section is invalid, illegal, or unenforceable in any
						jurisdiction, such invalidity, illegality, or unenforceability shall
						not affect any other term or provision of this Section or invalidate
						or render unenforceable such term or provision in any other
						jurisdiction. If for any reason a dispute proceeds in court rather
						than in arbitration, the parties hereby waive any right to a jury
						trial. This arbitration provision shall survive any cancellation or
						termination of your agreement to participate in any of our Programs.
					</p>
					<p>
						<span className="text-primary-dark">Miscellaneous: </span> You
						warrant and represent to Us that you have all necessary rights,
						power, and authority to agree to these Terms and perform your
						obligations hereunder, and nothing contained in this Agreement or in
						the performance of such obligations will place you in breach of any
						other contract or obligation. The failure of either party to
						exercise in any respect any right provided for herein will not be
						deemed a waiver of any further rights hereunder. If any provision of
						this Agreement is found to be unenforceable or invalid, that
						provision will be limited or eliminated to the minimum extent
						necessary so that this Agreement will otherwise remain in full force
						and effect and enforceable. Any new features, changes, updates or
						improvements of the Program shall be subject to this Agreement
						unless explicitly stated otherwise in writing. We reserve the right
						to change this Agreement from time to time. Any updates to this
						Agreement shall be communicated to you. You acknowledge your
						responsibility to review this Agreement from time to time and to be
						aware of any such changes. By continuing to participate in the
						Program after any such changes, you accept this Agreement, as
						modified.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					IMAGE CONSENT
				</h5>

				<div className="space-y-6 ">
					<p>
						If You/Your Student have submitted a photo or video in response to a
						promotional survey, PrepExcellence has Your permission to use Your
						image (photographic or video) publicly to promote their company,
						products and services thereof. You understand that the images may be
						used in print publications, online publications, presentations,
						websites, advertising, and social media. You understand that no
						royalty, fee, or other compensation shall be payable to You by
						reason of such use, unless explicitly stated and agreed to by both
						parties in writing. Both parties agree to the terms here as stated
						unless explicitly revised and agreed to by both parties in writing.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					CHARGE BACK
				</h5>

				<div className="space-y-6 ">
					<p>
						You agree that any refund for any course or tutoring will have to be
						approved by PrepExcellence. If you initiate a dispute (for example,
						with your credit card), you agree to pay PrepExcellence the full
						amount you dispute and an additional $250 in administrative,
						investigation, and documentation fees. You also agree to reimburse
						us for any chargeback fee assessed by PayPal and/or the bank.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					NOTIFICATION OF CHANGES
				</h5>

				<div className="space-y-6 ">
					<p>
						We reserve the right to change these Terms from time to time as We
						see fit and Your continued use of the site will signify Your
						acceptance of any adjustment to these Terms. You agree to be bound
						by such modifications, revisions, or updates. You are therefore
						advised to re-read this statement on a regular basis.
					</p>
				</div>
			</div>
			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					CANCELLATION POLICY
				</h5>

				<div className="space-y-6 ">
					<p>
						We will also need a cancellation policy. It should state that no
						cancellation will be approved after the first class of the course
						has occurred whether or not the student attended the class.
						PrepExcellence, at its discretion, can offer a credit that can be
						used for a future course. The credit can be used for a course that
						costs the same or less. For use in a more expensive course, the user
						will be charged the difference.
					</p>
				</div>
			</div>
			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					LATENESS & CANCELLATIONS
				</h5>

				<div className="space-y-6 ">
					<p>
						Lateness By Client: If the client arrives late for a scheduled
						session, the session will not be automatically extended. If the
						client wishes to extend the session, the extra time will be billed
						in addition to the originally scheduled session. Lateness By Tutor:
						Any lateness on the part of tutor will be made up at the end of said
						session (if possible) or at an agreed upon time in the future. A
						partial pro-rated refund may also be applied to the account instead
						of a make-up session. Cancellation & Rescheduling: We require 48
						hours’ notice via email to cancel or reschedule a session. If
						cancellation or rescheduling is made within 48 hours of the session
						start time, a cancellation fee equal to 1 hour of tutoring will
						apply. If rescheduling occurs before 48 hours of the tutoring start
						time, no cancellation fee will apply. The session may be rescheduled
						based on the tutor’s availability at no additional charge. No
						RefundsPro-rated refunds are not applied for days absent for class
						or for services not being fully utilized. For students wishing to
						make up missed class time, private tutoring at the regular rates may
						be arranged.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					IN-HOME TUTORING
				</h5>

				<div className="space-y-6 ">
					<p>
						A parent or guardian must be present for in-home tutoring for the
						entirety of any sessions booked. Tutoring sessions may also be held
						in a public place such as a library. PAYMENT METHODS We accept a
						variety of payment methods, including: • CHEQUE TO “IVY GLOBAL” •
						VISA, MASTERCARD, DEBIT • CASH Regrettably, we do not accept
						American Express at this time. You can pay: • IN PERSON: at one of
						our offices by cheque, credit card, debit or cash • BY PHONE:
						calling in your credit card info to 1-800-470-2995 • ONLINE: through
						Paypal or our online registration system (for courses only) Once the
						payment has been approved, you will receive either a paper or
						electronic copy of the receipt to the email address you provided on
						your registration form.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					PAYMENT OPTIONS
				</h5>

				<div className="space-y-6 ">
					<p>
						Payment for tutoring is required before tutoring sessions or a
						class. CLASSES In order to reserve a place in the course, we require
						at least ½ of the total balance to be paid within a week before the
						class commences. Failure to do so will result in an incomplete
						registration and we will not be able to guarantee that there will be
						an allotted space for you in the course. We require the remaining
						amount to be paid in full by the first day of the course. Tutoring
						Sessions We require payment on the day of or prior to every
						scheduled session. Tutoring Packages We normally require full
						payment up front. However, you may also choose to pay ½ of the total
						balance on the first day of tutoring and the remaining to be paid
						half-way through the package. Consulting Programs We normally
						require full payment up front. However, you may also choose to pay ½
						of the total balance on the first day of consulting and the
						remaining to be paid half-way through the program.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					PRIVACY POLICY
				</h5>

				<div className="space-y-6 ">
					<p>
						This privacy policy explains how PrepExcellence, Inc.
						(“PrepExcellence”) uses, shares and protects personal information
						that we collect , including on kaptest.com,
						PrepExcellenceprepandachieve.com, pmbr.com including their
						respective subdomains (“Site(s)”). By visiting one of our Sites or
						purchasing, enrolling in or using our products, services and events
						(“Programs”), you agree to this Privacy Policy, as it may be amended
						from time to time. This Privacy Policy is incorporated into the
						Terms and Conditions.
					</p>

					<p>
						<span className="text-primary-dark">Information We Collect: </span>
						Personal Data is any information about an individual from which that
						individual can be identified. Your name, address, phone number and
						bank account number are examples of personal data. It does not
						include data where the identity has been removed (anonymous data).
						We collect Personal Data from you in various ways, including when
						you visit the Site(s), create an account with us, purchase, enroll
						in and use our Programs, use our Apps, answer surveys, participate
						in our social media communities, such as on Facebook, and when you
						send us feedback.
					</p>

					<p>
						When you log-on to our websites or to our App(s), we automatically
						receive information from your device, including your IP address and
						location. We and our service providers may use “cookies” to keep,
						and sometimes track, information about you, and to create a
						personalized web experience. Cookies are small data files that are
						stored on your device’s web browser. Cookies track where you travel
						on our Site and what you look at and purchase. You agree to the use
						of cookies in this way. Most web browsers can be set to inform you
						when a cookie has been sent to you and provide you with the
						opportunity to refuse that cookie. We and our service providers may
						also use so-called “pixel tags”, “web beacons”, “clear GIFs” or
						similar means (collectively, “Pixel Tags”) in connection with some
						Site pages and HTML-formatted email messages to, among other things,
						compile aggregate statistics about Site usage and response rates. A
						pixel tag is an electronic image, often a single pixel (1×1), that
						is ordinarily not visible to Site visitors and may be associated
						with cookies on the visitors’ hard drives. Pixel Tags allow us to
						count users who have visited certain pages of the Site, to deliver
						branded services, and to target our promotional or advertising
						campaigns and determine their effectiveness.
					</p>

					<p>
						If your parent, school, employer or other third party purchases
						Programs on your behalf, or if an agent refers you to
						PrepExcellence, such third parties may provide us with Personal Data
						about you, including your first name, last name and email address.
						We may also collect Personal Data about you from our business
						partners and other PrepExcellence owned companies.
					</p>

					<p>
						<span className="text-primary-dark">
							{" "}
							Use of Your Personal Data:{" "}
						</span>
						We may use your Personal Data in the following ways:
					</p>

					<ol className="list-disc ps-10 space-y-4 mb-12">
						<li>
							For the purpose you provided personal data, for example to enroll
							you in one of our Programs or respond to a specific inquiry;
						</li>
						<li>
							To customize and personalize your learning experience to you;
						</li>
						<li>To administer, support, improve and develop our business;</li>
						<li>
							To send you information about PrepExcellence and Manhattan Prep
							products or services;
						</li>
						<li>
							To send you information about select third party’s products or
							services that may be of interest to you;
						</li>
						<li>
							To allow you access to the Site to post your content or
							communicate with others; and
						</li>
						<li>
							And as otherwise described to you at the point of collection.
						</li>
					</ol>

					<p>
						<span className="text-primary-dark">
							{" "}
							Mobile Devices, Phone Calls and SMS:{" "}
						</span>
						If you provide PrepExcellence with a telephone number, such as when
						you purchase, enroll in or use a PrepExcellence Program, you agree
						that PrepExcellence may contact you by telephone and/or text message
						utilizing automated technology at such telephone number(s). You
						understand that this consent is not required to purchase goods or
						services from PrepExcellence.
					</p>
					<p>
						<span className="text-primary-dark">
							{" "}
							Disclosure of Your Personal Data:{" "}
						</span>
						We do not share your Personal Data with third parties for their
						marketing purposes, though we may share your Personal Data with
						other PrepExcellence companies, including Manhattan Prep. We may
						disclose your Personal Data in response to legal process, to protect
						our rights, as otherwise required by law, or for the prevention or
						detection of a crime. We may share your Personal Data with trusted
						third parties who are delivering services to PrepExcellence,
						including those who help deliver our Programs, help us process
						transactions, such as charging your credit card when you make
						purchases, and otherwise help us operate our business. These third
						parties are not authorized by us to use your Personal Data except in
						connection with providing services to us. PrepExcellence may
						disclose anonymous data to third parties. We may also share your
						information with third parties that you have specifically designated
						as authorized to receive information from us.
					</p>
					<p>
						If payment for your Program was made by a third party,
						PrepExcellence may provide that third party with access to your
						Personal Data and other data. For example, if PrepExcellence
						provides You access to a Program in your capacity as a student of a
						school that has contracted with PrepExcellence, PrepExcellence may
						share your activity, performance and other data with your school,
						even if you paid for the Program in whole or in part yourself. If
						you purchased PrepExcellence’s Nursing Admissions Test for
						application to a specific nursing school, your name and scores will
						be sent to that nursing school.If we sell our company or part of it,
						or our business enters into a joint venture with another business
						entity, we may disclose your Personal Data to our new business
						partners or owners who may then provide you with information about
						their products and services.
					</p>
					<p>
						<span className="text-primary-dark"> Your Ability to Choose: </span>
						If you do not wish to continue receiving emails from us, you may
						unsubscribe by clicking on the unsubscribe link in our emails and
						following directions. If you do not wish to continue receiving SMS
						messages from us, text{" "}
						<span className="text-[#2600FF]">“STOP” to KAPTST (527878)</span>.
						You may also direct us to stop marketing to you by emailing us at{" "}
						<span className="text-[#2600FF]">
							ktp.dataprivacy@PrepExcellence.com.
						</span>
					</p>
					<p>
						<span className="text-primary-dark">
							Transfer of Data Outside of Your Home Country:{" "}
						</span>
						Some of the products and services advertised on the Site(s) are sold
						and delivered by third parties (“Third Party Sellers”). The Site(s)
						may also provide links to third party websites. This Privacy Policy
						governs collection and use of Personal Data by PrepExcellence. This
						Privacy Policy does not apply to Third Party Sellers or to third
						party websites and PrepExcellence makes no representation about
						their data practices or policies.
					</p>

					<p>
						{" "}
						<span className="text-primary-dark">Third Party Websites: </span>{" "}
						Some of the products and services advertised on the Site(s) are sold
						and delivered by third parties (“Third Party Sellers”). The Site(s)
						may also provide links to third party websites. This Privacy Policy
						governs collection and use of Personal Data by PrepExcellence. This
						Privacy Policy does not apply to Third Party Sellers or to third
						party websites and PrepExcellence makes no representation about
						their data practices or policies.
					</p>
					<p>
						{" "}
						<span className="text-primary-dark">
							Changes to this Privacy Policy:{" "}
						</span>{" "}
						We will update this Privacy Policy from time to time. When we post
						changes to this Privacy Policy, we will revise the “Effective Date”
						at the bottom of this Privacy Policy. We recommend that you check
						our Site(s) from time to time to inform yourself of any changes in
						this Privacy Policy or any of our other policies.
					</p>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					SEVERABILITY
				</h5>
				<div className="space-y-6">
					<p>
						If a provision of this Agreement is or becomes illegal, invalid or
						unenforceable in any jurisdiction, that shall not affect:
					</p>
					<ol className="list-decimal ps-10 space-y-4 mb-10">
						<li>
							the validity or enforceability in that jurisdiction of any other
							provision of this Agreement; or
						</li>
						<li>
							the validity or enforceability in other jurisdictions of that or
							any other provision of this Agreement.
						</li>
					</ol>
				</div>
			</div>

			<div className="mb-12 text-[19px]">
				<h5 className="text-[24px] text-primary-dark font-bold mb-3">
					WHOLE AGREEMENT
				</h5>
				<div className="space-y-6">
					<p>
						This agreement constitutes the entire understanding between you and
						PrepExcellence with regard to the subject matter thereof and both
						parties waive the right to rely on any alleged, expressed, or
						implied provision not contained herein.
					</p>
					<p>
						These Terms of Service form part of the Agreement between You and
						Us. Your accessing of this Website and/or purchasing services from
						Us indicates Your understanding, agreement to and acceptance of the
						full Terms of Use, Privacy Policy, and Terms of Service contained
						herein.
					</p>
				</div>
			</div>
		</div>
	);
}
