import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PopupModal from "@/components/PopupModal";
import { SmoothScrollProvider } from "@/provider/SmoothScrollProvider";
import { useAuth } from "@/store/useAuth";
import useLoginPopupStore from "@/store/useLoginPopupStore";

export const Route = createFileRoute("/_frontend copy")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { openLoginPopup } = useLoginPopupStore();

	return (
		<>
			<Header />
			<button
				type="button"
				onClick={() => {
					if (user?.role === "Student") {
						navigate({ to: "/sat-practice" });
					} else {
						if (!user) {
							openLoginPopup("/sat-practice");
							return;
						}
						toast("You must be a student to access this page", {
							style: {
								background: "#fff",
								position: "relative",
								zIndex: 9999,
							},
						});
					}
				}}
				className="cursor-pointer "
			>
				<img
					src="/home/ellipse.png"
					alt=""
					width={400}
					height={300}
					className="w-auto h-24 md:h-44 lg:h-56 object-contain fixed right-0 top-1/2 z-50 transform -translate-y-1/2"
				/>
			</button>

			<PopupModal />
			<SmoothScrollProvider>
				{/* 👇 Animated page content */}
				<AnimatedOutlet />
			</SmoothScrollProvider>
			<Footer />
		</>
	);
}
