import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/Course/checkout";
export const Route = createFileRoute("/course/$courseId/checkout/")({
	component: () => {
		const { courseId } = Route.useParams();
		return <CheckoutPage courseId={courseId} />;
	},
});
