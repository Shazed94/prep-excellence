import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
	useEffect(() => {
		const lenis = new Lenis({
			lerp: 0.1,
			smoothWheel: true,
		});

		let rafId: number;

		function raf(time: number) {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		}

		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	}, []);

	return <>{children}</>;
}
