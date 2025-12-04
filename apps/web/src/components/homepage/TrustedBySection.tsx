import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { SectionTitle } from "../SectionTitle";

export default function TrustedByCarousel() {
	const [emblaRef] = useEmblaCarousel(
		{
			loop: true,
			dragFree: true,
			containScroll: "trimSnaps",
			align: "start",
			watchDrag: false,
			duration: 8000,
		},
		[
			Autoplay({
				delay: 0, // keeps it continuous
				jump: false,
				playOnInit: true,
				stopOnInteraction: false,
				stopOnMouseEnter: false, // or true if you want pause on hover
			}),
		],
	);

	const partners = [
		{
			name: "NovaForge",
			logo: "/trusted.png",
		},
		{
			name: "BrightLabs",
			logo: "/trusted.png",
		},
		{
			name: "Skyline Digital",
			logo: "/trusted.png",
		},
		{
			name: "QuantumWorks",
			logo: "/trusted.png",
		},
		{
			name: "Apex Industries",
			logo: "/trusted.png",
		},
		{
			name: "NovaForge",
			logo: "/trusted.png",
		},
		{
			name: "BrightLabs",
			logo: "/trusted.png",
		},
		{
			name: "Skyline Digital",
			logo: "/trusted.png",
		},
	];

	return (
		<section className=" py-16">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-12">
					<SectionTitle accentClassName="w-20 left-1/2 -translate-x-1/2">
						Trusted By
					</SectionTitle>
					<p className="text-muted text-base md:text-[17px] max-w-3xl mx-auto mt-6">
						Prep Excellence is proud to be recognized by and partnered with
						innovative leaders across the educational and technology sectors.
					</p>
				</div>

				{/* Embla Carousel */}
				<div className="overflow-hidden" ref={emblaRef}>
					<div className="flex">
						{partners.map((partner) => (
							<div
								key={partner.name}
								className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 px-4"
							>
								<div className="flex items-center justify-center">
									<img
										src={partner.logo}
										alt={partner.name}
										className="max-w-full max-h-full object-contain transition-all duration-300 "
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
