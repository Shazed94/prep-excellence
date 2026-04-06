export default function Topnav() {
	return (
		<div className="bg-primary text-primary-foreground py-2.5 relative">
			<div className="container mx-auto text-center font-inter flex justify-center items-center gap-3">
				{" "}
				<span className="bg-[#FF7E2D] w-3 h-3 rounded-full inline-block" />
				<span className=" text-sm leading-5 -tracking-[0.64]">
					Limited seats per batch. Early enrollment recommended.
				</span>
				<span className="underline text-sm">Enroll Now</span>
			</div>

			{/* Generate repeating boxes horizontally with an 8px gap */}
			{Array.from({ length: 15 }).map((_, i) => {
				const boxWidth = 137.82; // matches the tailwind width class
				const gap = 10; // 8px gap between boxes
				return (
					<div
						key={i}
						className="w-[137.82px] h-[80px] rounded-[20.69px] bg-[#ffffff]/10 absolute -top-2"
						style={{ left: `${i * (boxWidth + gap)}px`, zIndex: 1000 - i }}
					/>
				);
			})}
		</div>
	);
}
