import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function AboutAnimatedText() {
	const containerRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start 0.85", "end 0.3"],
	});

	const para1Words =
		"Prep Excellence was built to remove confusion from SAT preparation. Too many students study without a plan, practice randomly, and don't see the results they're capable of.".split(
			" ",
		);

	const para2Words =
		"We designed a system where students follow a clear path, practice consistently, and improve with confidence. Every week has a goal. Every session has a purpose.".split(
			" ",
		);

	const totalWords = para1Words.length + para2Words.length;

	return (
		<div ref={containerRef} className="space-y-8">
			<p className="text-[24px] sm:text-[28px] lg:text-[32px] leading-8 sm:leading-10 -tracking-[1.5px] text-justify">
				{para1Words.map((word, i) => {
					const start = i / totalWords;
					const end = (i + 1) / totalWords;
					return (
						<AnimatedWord
							key={i}
							word={word}
							progress={scrollYProgress}
							start={start}
							end={end}
						/>
					);
				})}
			</p>

			<p className="text-[24px] sm:text-[28px] lg:text-[32px] leading-8 sm:leading-10 -tracking-[1.5px] text-justify">
				{para2Words.map((word, i) => {
					const globalIndex = para1Words.length + i;
					const start = globalIndex / totalWords;
					const end = (globalIndex + 1) / totalWords;
					return (
						<AnimatedWord
							key={i}
							word={word}
							progress={scrollYProgress}
							start={start}
							end={end}
						/>
					);
				})}
			</p>
		</div>
	);
}

function AnimatedWord({
	word,
	progress,
	start,
	end,
}: {
	word: string;
	progress: any;
	start: number;
	end: number;
}) {
	const color = useTransform(progress, [start, end], ["#6C7179", "#141B34"]);

	return (
		<motion.span style={{ color }} className="inline-block mr-[0.25em]">
			{word}
		</motion.span>
	);
}
