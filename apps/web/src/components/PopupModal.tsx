import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export default function PopupModal() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	useEffect(() => {
		// Check if user has seen the promotion before
		const hasSeenPromotion = localStorage.getItem("hasSeenPromotion");

		if (!hasSeenPromotion) {
			// Show popup after a short delay for better UX
			const timer = setTimeout(() => {
				setIsOpen(true);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, []);

	const handleClose = () => {
		// Mark as seen in localStorage
		localStorage.setItem("hasSeenPromotion", "true");
		setIsOpen(false);
	};
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}
					className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-100"
					onClick={handleClose}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.9, opacity: 0, y: 20 }}
						transition={{
							duration: 0.3,
							ease: [0.4, 0, 0.2, 1], // Custom easing for smooth feel
						}}
						className="relative inline-block"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button - positioned absolute relative to the container */}
						<motion.button
							onClick={handleClose}
							whileHover={{ scale: 1.1, rotate: 90 }}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className="absolute top-0 right-0 w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer"
						>
							<X size={20} className="text-black" />
						</motion.button>

						{/* The image */}
						<img
							src="/home/seminar-popup.png"
							alt="Promotion"
							className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
						/>

						{/* CTA Button - positioned absolute relative to the container */}
						<motion.button
							onClick={() => {
								router.navigate({
									to: "/free-seminar-registration",
								});
								handleClose();
							}}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
							transition={{ duration: 0.2 }}
							className="absolute bottom-4 md:bottom-10 right-7 md:right-14 px-8 py-2 md:py-3 bg-primary-dark text-white text-sm md:text-lg font-semibold rounded-sm w-[40%] cursor-pointer shadow-lg hover:shadow-xl"
						>
							Learn More
						</motion.button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
