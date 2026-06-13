import { createFileRoute } from "@tanstack/react-router";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import HeaderTwo from "@/components/HeaderTwo";
import { SmoothScrollProvider } from "@/provider/SmoothScrollProvider";

export const Route = createFileRoute("/_frontend")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<SmoothScrollProvider>
			<main className="overflow-x-hidden">
				<HeaderTwo />
				<AnimatedOutlet />
			</main>
		</SmoothScrollProvider>
	);
}
