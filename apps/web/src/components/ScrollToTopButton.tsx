import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollToTopProps {
	showAfter?: number;
	className?: string;
	iconSize?: number;
}

export function ScrollToTopButton({
	showAfter = 600,
	className = "",
	iconSize = 24,
}: ScrollToTopProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > showAfter) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [showAfter]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!isVisible) return null;

	return (
		<button
			type="button"
			onClick={scrollToTop}
			className={`fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 cursor-pointer ${className}`}
			aria-label="Scroll to top"
		>
			<ArrowUp size={iconSize} />
		</button>
	);
}
