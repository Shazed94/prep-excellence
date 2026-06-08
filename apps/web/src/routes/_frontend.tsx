import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import Footer from "@/components/Footer";
import FooterTwo from "@/components/FooterTwo";
import Header from "@/components/Header";
import HeaderTwo from "@/components/HeaderTwo";
import PopupModal from "@/components/PopupModal";
import { SmoothScrollProvider } from "@/provider/SmoothScrollProvider";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export const Route = createFileRoute("/_frontend")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<SmoothScrollProvider>
				<main className="overflow-x-hidden">
					<HeaderTwo />
					<AnimatedOutlet />
					<FooterTwo />
				</main>
			</SmoothScrollProvider>
		</>
	);
}
