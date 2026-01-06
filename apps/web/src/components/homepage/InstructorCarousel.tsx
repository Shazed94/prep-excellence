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
			name: "Areeq I. Hasan",
			stars: 4,
			image: "/teachers/teacher1.png",
		},
		{
			id: "instructor-2",
			name: "Nisarga Shashi",
			stars: 5,
			image: "/teachers/teacher2.png",
		},
		{
			id: "instructor-3",
			name: "Reem Esseghir",
			stars: 4.5,
			image: "/teachers/teacher3.png",
		},
		{
			id: "instructor-4",
			name: "Ayah Ahmed",
			stars: 4,
			image: "/teachers/teacher11.jpg",
		},
		{
			id: "instructor-5",
			name: "Heera Bandi",
			stars: 4.5,
			image: "/teachers/teacher4.jpeg",
		},
		{
			id: "instructor-6",
			name: "Amna Fatima Hasni",
			stars: 5,
			image: "/teachers/teacher5.jpg",
		},
		{
			id: "instructor-7",
			name: "Hagar Mohamed",
			stars: 4,
			image: "/teachers/teacher6.jpeg",
		},
		{
			id: "instructor-8",
			name: "Ranya Siddiqui",
			stars: 5,
			image: "/teachers/teacher7.jpg",
		},
		{
			id: "instructor-9",
			name: "Sana Ismail",
			stars: 4.5,
			image: "/teachers/teacher8.jpg",
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
		<div className="relative max-w-5xl mx-auto">
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex">
					{groupedInstructors.map((group, slideIndex) => (
						<div
							key={`slide-${slideIndex}`}
							className="flex-[0_0_100%] min-w-0"
						>
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
								{group.map((instructor) => (
									<div
										key={instructor.id}
										className="flex flex-col items-center"
									>
										{/* Instructor Image with Verified Badge */}
										<div className="relative mb-6">
											<div className="h-20 w-20 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-[#f5f5f5]">
												<img
													src={instructor.image || "/placeholder.svg"}
													alt={instructor.name}
													className="w-full h-full object-cover"
												/>
											</div>
											{/* Verified Badge */}
											<div className="absolute bottom-2 -right-8">
												<img
													src={"/home/badge.png"}
													alt={"badge"}
													className="h-8 w-8 md:w-full md:h-full object-cover"
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
