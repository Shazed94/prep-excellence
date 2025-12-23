import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Facebook,
	Linkedin,
	MessageCircle,
	Twitter,
} from "lucide-react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

/* ---------------- Article Card ---------------- */

const ArticleCard = ({
	image,
	author,
	title,
	comments,
	date,
	description,
}: {
	image: string;
	author: string;
	title: string;
	comments: number;
	date: string;
	description: string;
}) => {
	return (
		<div
			className="
				embla__slide
				flex-none
				basis-full
				md:basis-1/2
				lg:basis-1/3
				xl:basis-1/4
				px-2
			"
		>
			<Card className="h-full border-none bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
				<CardHeader className="p-0">
					<img src={image} alt={title} className="w-full h-48 object-cover" />
				</CardHeader>

				<CardContent className="p-6 flex flex-col h-72 justify-between">
					<div>
						<p className="text-sm text-[#848484] mb-3">— By {author}</p>

						<CardTitle className="text-md xl:text-xl font-bold text-[#191919] mb-4">
							{title}
						</CardTitle>

						<div className="flex items-center gap-4 mb-4 text-sm text-[#848484]">
							<div className="flex items-center gap-1">
								<MessageCircle className="w-4 h-4 text-[#0086c5]" />
								<span>{comments}</span>
							</div>

							<div className="flex items-center gap-1">
								<Calendar className="w-4 h-4 text-[#0086c5]" />
								<span>{date}</span>
							</div>
						</div>

						<CardDescription className="text-sm text-[#848484] mb-6">
							{description}
						</CardDescription>
					</div>

					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<Button className="bg-[#0086c5] hover:bg-[#0076ad] text-white font-semibold px-6 py-2 rounded-lg w-full md:w-auto transition-colors">
							Read more
						</Button>

						<div className="flex items-center gap-3">
							<span className="text-xs text-[#0086c5] font-medium">Share:</span>
							<Facebook className="w-4 h-4 cursor-pointer hover:text-[#0086c5]" />
							<Twitter className="w-4 h-4 cursor-pointer hover:text-[#0086c5]" />
							<Linkedin className="w-4 h-4 cursor-pointer hover:text-[#0086c5]" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

/* ---------------- Articles Section ---------------- */

export default function ArticlesSection() {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			align: "start",
			loop: true,
			slidesToScroll: 1,
			dragFree: false,
		},
		[Autoplay({ delay: 30000, stopOnInteraction: true })],
	);

	const scrollPrev = useCallback(() => {
		emblaApi?.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		emblaApi?.scrollNext();
	}, [emblaApi]);

	const articles = [
		{
			id: "1",
			image:
				"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Maximize Your Time",
			comments: 3,
			date: "31.12.2025",
			description:
				"Decoding the Digital SAT's adaptive format is key to success.",
		},
		{
			id: "2",
			image:
				"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Reading and Writing Deep Dive",
			comments: 3,
			date: "31.12.2025",
			description:
				"We analyze the best strategies for managing dual-passage questions.",
		},
		{
			id: "3",
			image:
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Test Day Essentials",
			comments: 3,
			date: "31.12.2025",
			description:
				"Don't let small details trip you up! We provide a definitive checklist.",
		},
		{
			id: "4",
			image:
				"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Math Module Mastery",
			comments: 3,
			date: "31.12.2025",
			description:
				"Learn three advanced techniques that can shave minutes off your exam.",
		},
		{
			id: "5",
			image:
				"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Maximize Your Time",
			comments: 3,
			date: "31.12.2025",
			description:
				"Decoding the Digital SAT's adaptive format is key to success.",
		},
		{
			id: "6",
			image:
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Math Module Mastery",
			comments: 3,
			date: "31.12.2025",
			description:
				"We analyze the best strategies for managing dual-passage questions.",
		},
		{
			id: "7",
			image:
				"https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Test Day Essentials",
			comments: 3,
			date: "31.12.2025",
			description:
				"Don't let small details trip you up! We provide a definitive checklist.",
		},
		{
			id: "8",
			image:
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Math Module Mastery",
			comments: 3,
			date: "31.12.2025",
			description:
				"Learn three advanced techniques that can shave minutes off your exam.",
		},
	];

	return (
		<div className="relative">
			{/* Left Arrow */}
			<Button
				onClick={scrollPrev}
				className="absolute left-0 top-1/2 -translate-y-1/2 lg:translate-x-2 z-10 p-3 rounded-full shadow-lg hover:shadow-xl"
			>
				<ChevronLeft className="w-6 h-6 " />
			</Button>

			{/* Embla */}
			<div className="embla overflow-hidden" ref={emblaRef}>
				<div className="embla__container flex -mx-2">
					{articles.map((article) => (
						<ArticleCard key={article.id} {...article} />
					))}
				</div>
			</div>

			{/* Right Arrow */}
			<Button
				onClick={scrollNext}
				className="absolute right-0 top-1/2 -translate-y-1/2 lg:-translate-x-2 z-10 p-3 rounded-full shadow-lg hover:shadow-xl"
			>
				<ChevronRight className="w-6 h-6 " />
			</Button>
		</div>
	);
}
