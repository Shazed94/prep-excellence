import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		const lenis = new Lenis({
			lerp: 0.1, // only if you want to tune smoothness
			smoothWheel: true, // only needed if it's not default in your version
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	return <>{children}</>;
}
