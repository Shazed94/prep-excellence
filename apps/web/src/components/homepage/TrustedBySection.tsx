import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useGetTrustedCompanies } from "@/hooks/content-management";
import { SectionTitle } from "../SectionTitle";

export default function TrustedByCarousel() {
	const {
		data: trustedCompanies,
		isLoading,
		isError,
	} = useGetTrustedCompanies();
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

	if (isLoading || isError) {
		return null; // or a loading spinner / error message
	}

	console.log("trustedCompanies:", trustedCompanies);
	return (
		<section className=" py-16">
			<div className="container mx-auto px-4 md:px-6">
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
						{trustedCompanies?.data.map((company: any) => (
							<div
								key={company.name}
								className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 px-4"
							>
								<div className="flex items-center justify-center">
									<img
										src={company.logo}
										alt={company.name}
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
