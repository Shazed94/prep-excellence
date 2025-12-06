import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
	// ssr:""
});

function RouteComponent() {
	return (
		<div className="p-8 text-white bg-orange-600">
			<motion.div
				initial={{ x: 20, background: "black" }}
				animate={{ x: 0, background: "green" }}
				transition={{ duration: 1 }}
				className="text-2xl font-bold "
			>
				Hello "/test"!
			</motion.div>
			asdasdasdd
		</div>
	);
}
