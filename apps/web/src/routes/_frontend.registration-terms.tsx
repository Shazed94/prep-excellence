import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/SectionTitle";

export const Route = createFileRoute("/_frontend/registration-terms")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto p-6">
			<div className="text-center">
				<SectionTitle accentClassName="hidden">
					Registration Terms and Conditions
				</SectionTitle>
			</div>
			<ol className=" pl-6">
				<li className="mb-6">
					I do hereby in advance waive, release, acquit, forever discharge, and
					covenant not to sue the provider (Prep Excellence LLC), from any/all
					actions, claims, damages, costs, loss of services, expenses, on
					account of any and all known or unknown personal injuries, or personal
					property damage resulting from my child's attendance of the program.
				</li>
				<li className="mb-6">
					I hereby give permission for myself/my child to participate in this
					activity and assume the risk thereof and I do agree for myself/my
					child at all times to keep the said business Prep Excellence LLC free,
					harmless and indemnified from any and all liability for any injury
					I/my child might sustain as the result of said participation.
				</li>
				<li className="mb-6">
					Photographs, videotapes, and audio recordings of the participant,
					while participating in a Prep Excellence Program may be made. I hereby
					permit, consent and authorize such materials of myself/my son/daughter
					as an individual or part of a group - without text, to be used for
					Advertisement Activities.
				</li>
				<li className="mb-6">
					Payable immediately upon issuance of invoice (2% cash/Zelle discount
					if paid within 7 days, or within 14 days without discount)
				</li>
			</ol>
			<p>
				Payment: By Zelle. Due for any student taking the class (unless the
				student is taking our free repeat option.)
			</p>

			<h1>Video Policy</h1>
			<p>
				The following are expected from each student taking the course: video
				on, class participation, and proper attire. The video must remain on
				during the entire class. The camera can be turned off during a break.
			</p>
			<p>
				If your child needs accommodation regarding the video on policy, please
				email a request to Dr. Kaisar Alam at kaisar.alam@prepexcellence.com.
				Dr. Alam, at his discretion, might approve such requests on a case by
				case basis.
			</p>
		</div>
	);
}
