import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export function InstructorsCarousel() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "start",
		slidesToScroll: 1,
	});
	const [selectedIndex, setSelectedIndex] = useState(0);

	const instructors = [
		{
			id: "instructor-1",
			name: "Hannah McKenzie",
			stars: 4,
			image:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-2",
			name: "Emanuel Hodges",
			stars: 5,
			image:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-3",
			name: "Kailani Jacobs",
			stars: 4.5,
			image:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-4",
			name: "Joelle Fernandez",
			stars: 4,
			image:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-5",
			name: "Marcus Chen",
			stars: 5,
			image:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-6",
			name: "Sofia Martinez",
			stars: 4.5,
			image:
				"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-7",
			name: "David Kim",
			stars: 5,
			image:
				"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
		},
		{
			id: "instructor-8",
			name: "Emma Wilson",
			stars: 4,
			image:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
		},
	];

	// Group instructors into slides of 4
	const groupedInstructors = [];
	for (let i = 0; i < instructors.length; i += 4) {
		groupedInstructors.push(instructors.slice(i, i + 4));
	}

	const scrollTo = useCallback(
		(index: number) => emblaApi?.scrollTo(index),
		[emblaApi],
	);

	useEffect(() => {
		if (!emblaApi) return;

		const onSelect = () => {
			setSelectedIndex(emblaApi.selectedScrollSnap());
		};

		emblaApi.on("select", onSelect);
		onSelect();

		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi]);

	return (
		<div className="relative max-w-6xl mx-auto px-4">
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex">
					{groupedInstructors.map((group, slideIndex) => (
						<div
							key={`slide-${slideIndex}`}
							className="flex-[0_0_100%] min-w-0"
						>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{group.map((instructor) => (
									<div
										key={instructor.id}
										className="flex flex-col items-center"
									>
										{/* Instructor Image with Verified Badge */}
										<div className="relative mb-6">
											<div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#f5f5f5]">
												<img
													src={instructor.image || "/placeholder.svg"}
													alt={instructor.name}
													className="w-full h-full object-cover"
												/>
											</div>
											{/* Verified Badge */}
											<div className="absolute bottom-2 -right-12">
												<img
													src={"/home/badge.png"}
													alt={"badge"}
													className="w-full h-full object-cover"
												/>
											</div>
										</div>

										{/* Instructor Name */}
										<h3 className="text-[19px] font-semibold   text-center">
											{instructor.name}
										</h3>

										{/* Star Rating */}
										<div className="text-primary-dark text-[17px] font-semibold">
											{instructor.stars} Stars
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Carousel Dots */}
			<div className="flex justify-center gap-2 mt-12">
				{groupedInstructors.map((_, index) => (
					<button
						type="button"
						key={`dot-${index}`}
						onClick={() => scrollTo(index)}
						className={`h-3 rounded-full transition-all duration-300 ${
							index === selectedIndex ? "w-8 bg-[#ef782e]" : "w-3 bg-[#bebebe]"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
