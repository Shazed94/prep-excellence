import { createFileRoute, Outlet } from "@tanstack/react-router";
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
			<img
				src="/home/ellipse.png"
				alt=""
				width={400}
				height={300}
				className=" md:block w-auto h-24 md:h-56 object-contain fixed right-0 top-1/2 z-50 pointer-events-none select-none transform -translate-y-1/2"
			/>

			<PopupModal />

			<Outlet />
			<Footer />
		</>
	);
}
