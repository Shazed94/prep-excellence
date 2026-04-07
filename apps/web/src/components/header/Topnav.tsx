import { useEffect, useRef, useState } from "react";

const BOX_GAP = 10;

function getBoxCount(width: number): number {
	if (width < 480) return 3; // mobile
	if (width < 768) return 5; // large mobile
	if (width < 1024) return 7; // tablet
	if (width < 1280) return 10; // laptop
	return 15; // desktop
}

export default function Topnav() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [boxWidth, setBoxWidth] = useState(137.82);
	const [boxCount, setBoxCount] = useState(15);

	useEffect(() => {
		const update = () => {
			if (!containerRef.current) return;
			const totalWidth = containerRef.current.offsetWidth;
			const count = getBoxCount(totalWidth);
			const width = (totalWidth - BOX_GAP * (count - 1)) / count;
			setBoxCount(count);
			setBoxWidth(width);
		};

		update();

		const observer = new ResizeObserver(update);
		if (containerRef.current) observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className="bg-primary text-primary-foreground py-2.5 relative"
		>
			<div className="container mx-auto text-center font-inter flex justify-center items-center gap-1.5 sm:gap-3 relative z-10">
				<span className="bg-[#FF7E2D] w-2 h-2 sm:w-3 sm:h-3 rounded-full inline-block shrink-0" />
				<span className="text-[11px] sm:text-sm leading-5 -tracking-[0.64]">
					Limited seats per batch. Early enrollment recommended.
				</span>
				<span className="underline text-[11px] sm:text-sm whitespace-nowrap">
					Enroll Now
				</span>
			</div>

			{Array.from({ length: boxCount }).map((_, i) => (
				<div
					key={i}
					className="h-[80px] rounded-[20.69px] bg-white/10 absolute -top-2 pointer-events-none"
					style={{
						width: `${boxWidth}px`,
						left: `${i * (boxWidth + BOX_GAP)}px`,
						zIndex: 1000 - i,
					}}
				/>
			))}
		</div>
	);
}
