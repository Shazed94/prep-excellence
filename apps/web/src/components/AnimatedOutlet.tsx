import { Outlet, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

export default function AnimatedOutlet() {
	const { location } = useRouterState();

	return (
		<AnimatePresence mode="wait">
			<motion.main
				key={location.pathname}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				// exit={{ opacity: 0 }}
				transition={{ duration: 0.2, ease: "easeIn" }}
			>
				<Outlet />
			</motion.main>
		</AnimatePresence>
	);
}
