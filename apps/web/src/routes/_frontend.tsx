import { createFileRoute, Link } from "@tanstack/react-router";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PopupModal from "@/components/PopupModal";

export const Route = createFileRoute("/_frontend")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<Link to="/bluebook" className="cursor-pointer block bg-red-500">
				<img
					src="/home/ellipse.png"
					alt=""
					width={400}
					height={300}
					className="w-auto h-24 md:h-44 lg:h-56 object-contain fixed right-0 top-1/2 z-50 transform -translate-y-1/2"
				/>
			</Link>

			<PopupModal />

			{/* 👇 Animated page content */}
			<AnimatedOutlet />
			<Footer />
		</>
	);
}
