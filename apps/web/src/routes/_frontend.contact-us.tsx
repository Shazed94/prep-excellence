import { createFileRoute } from "@tanstack/react-router";
import ContactUsBanner from "@/components/contact-us/ContactUsBanner";
import ContactSection from "@/components/contact-us/ContactUsForm";

export const Route = createFileRoute("/_frontend/contact-us")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<ContactUsBanner />

			<ContactSection />
		</div>
	);
}
