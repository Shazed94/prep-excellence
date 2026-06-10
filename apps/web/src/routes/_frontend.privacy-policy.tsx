import { Breadcrumb } from "@/components/breadcrumb";
import { Subtitle } from "@/components/SectionSubtitle";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_frontend/privacy-policy")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="">
			{/* Hero Section */}
			<section className=" py-8 md:py-16 relative">
				<div className="">
					<Breadcrumb alignment="center" className="mb-4">
						Home /{" "}
						<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
							Privacy Policy
						</span>
					</Breadcrumb>

					<div className="text-center mb-10">
						<h2 className="h2 mb-4">Privacy Policy</h2>
						<Subtitle alignment="center" className=" max-w-xl">
							Last Updated On: 12 October 2025
						</Subtitle>
					</div>
				</div>

				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(236, 241, 254, 0.05) 60%, rgba(236, 241, 254, 0.1) 83%, rgba(21, 82, 253, 0.05) 100%)",
					}}
				/>
			</section>

			<div className="container mx-auto px-4 md:px-0 py-8 md:py-16 max-w-4xl">
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						1. Information We Collect
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							{" "}
							We collect personal information when you use our website, place an
							order, or interact with our services. The types of data we collect
							include:
						</p>
						<ul className="ps-5 body_lg list-disc mt-2 space-y-6">
							<li>
								Personal Identification Information: Name, email address,
								mailing address, phone number, etc.
							</li>
							<li>
								Payment Information: Credit card details and billing information
								(Note: Payments are processed securely by third-party
								providers.)
							</li>
							<li>
								Order Information: Products purchased, transaction amounts, and
								order history.
							</li>
							<li>
								Usage Data: IP address, browser type, device information, and
								page views on our site for the purpose of analytics.
							</li>
						</ul>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						2. Methods of Collection
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							We gather your information in the following ways:
						</p>
						<ul className="ps-5 body_lg list-disc mt-2 space-y-6">
							<li>
								Direct Collection: When you sign up, place an order, or contact
								us.
							</li>
							<li>
								Automatic Collection: Via cookies and tracking technologies
								while you browse our website.
							</li>
							<li>
								Third-Party Services: We may receive data from payment
								processors, shipping partners, and other third-party services to
								fulfill your order.
							</li>
						</ul>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						3. How We Use Your Information
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							We use your personal data for various purposes, including:
						</p>
						<ul className="ps-5 body_lg list-disc mt-2 space-y-6">
							<li>
								Order Processing & Fulfillment: To complete and manage your
								orders, provide customer support, and communicate updates about
								your purchases.
							</li>
							<li>
								Marketing & Promotions: To send you promotional offers,
								newsletters, and product updates (you can opt out of marketing
								communications at any time).
							</li>
							<li>
								Improvement of Services: To personalize your shopping
								experience, improve our website’s functionality, and enhance our
								products and services.
							</li>
							<li>
								Legal Compliance: To comply with applicable laws, regulations,
								or legal obligations.
							</li>
						</ul>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						4. Data Retention
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							We retain your personal data only for as long as necessary to
							fulfill the purposes outlined in this policy, or as required by
							law. After that period, your data will be securely deleted.
						</p>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						5. Sharing Your Information
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							We do not sell or rent your personal information to third parties.
							However, we may share your data with trusted service providers to
							fulfill orders or improve our services. These third parties are
							contractually obligated to protect your data and use it solely for
							the purposes we specify.
						</p>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						6. Cookies and Tracking Technologies
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							Our website uses cookies to enhance user experience, analyze site
							traffic, and tailor content to your preferences. Cookies are small
							files stored on your device. You can control cookie preferences
							via your browser settings, but disabling cookies may affect your
							ability to use certain features of our site.
						</p>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						7. Data Security
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							We take reasonable precautions to protect your personal
							information from unauthorized access, alteration, or destruction.
							This includes using encryption protocols and secure servers.
							However, no data transmission method over the internet or
							electronic storage is 100% secure, and we cannot guarantee
							complete security.
						</p>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						8. Your Rights and Choices
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							As a user, you have certain rights regarding your personal data:
						</p>
						<ul className="ps-5 body_lg list-disc mt-2 space-y-6">
							<li>
								Access: You can request access to the personal data we hold
								about you.
							</li>
							<li>
								Correction: You can request updates or corrections to your
								information.
							</li>
							<li>
								Deletion: You can request the deletion of your data under
								certain circumstances.
							</li>
							<li>
								Opt-Out: You can opt out of receiving marketing communications
								from us at any time by following the unsubscribe link in our
								emails or by contacting us directly.
							</li>
						</ul>
					</div>
				</div>
				<div className="mb-8">
					<h5 className="text-[24px] leading-[32px] -tracking-[1px] font-semibold mb-3">
						9. Changes to This Privacy Policy
					</h5>
					<div className="body_lg">
						<p className="mb-6">
							We may update this Privacy Policy from time to time. Any changes
							will be posted on this page, and the “Effective Date” at the top
							will reflect the latest revision. Please review this policy
							periodically to stay informed.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
