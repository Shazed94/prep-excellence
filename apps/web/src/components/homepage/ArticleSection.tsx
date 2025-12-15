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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

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
}) => (
	<div className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4">
		<Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full border-none bg-white">
			<CardHeader className="p-0">
				<img src={image} alt={title} className="w-full h-48 object-cover" />
			</CardHeader>
			<CardContent className="p-6 flex flex-col h-72 justify-between">
				<p className="text-sm text-[#848484] mb-3">— By {author}</p>
				<CardTitle className="text-xl font-bold text-[#191919] mb-4">
					{title}
				</CardTitle>
				<div className="flex items-center gap-4 mb-4 text-[#848484] text-sm">
					<div className="flex items-center gap-1">
						<MessageCircle className="w-4 h-4 text-[#0086c5]" />
						<span>{comments}</span>
					</div>
					<div className="flex items-center gap-1">
						<Calendar className="w-4 h-4 text-[#0086c5]" />
						<span>{date}</span>
					</div>
				</div>
				<CardDescription className="text-[#848484] text-sm mb-6">
					{description}
				</CardDescription>
				<div className="flex items-center justify-between">
					<button
						type="button"
						className="bg-[#0086c5] hover:bg-[#0076ad] text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
					>
						Read more
					</button>
					<div className="flex items-center gap-3">
						<span className="text-xs text-[#0086c5] font-medium">Share:</span>
						<div className="flex gap-2">
							<Facebook className="w-4 h-4 text-[#191919] hover:text-[#0086c5] cursor-pointer transition-colors" />
							<Twitter className="w-4 h-4 text-[#191919] hover:text-[#0086c5] cursor-pointer transition-colors" />
							<Linkedin className="w-4 h-4 text-[#191919] hover:text-[#0086c5] cursor-pointer transition-colors" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
);

export default function ArticlesSection() {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			align: "start",
			loop: true,
			slidesToScroll: 1,
			dragFree: true,
			duration: 50,
			breakpoints: {
				"(min-width: 768px)": { slidesToScroll: 1 },
				"(min-width: 1024px)": { slidesToScroll: 1 },
			},
		},
		[Autoplay({ playOnInit: true, delay: 30000 })],
	);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const articles = [
		{
			id: "article-1",
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
			id: "article-2",
			image:
				"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Reading and Writing Deep Dive",
			comments: 3,
			date: "31.12.2025",
			description:
				"We analyze the best strategies for managing dual-passage questions.",
		},
		{
			id: "article-3",
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
			id: "article-4",
			image:
				"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Math Module Mastery",
			comments: 3,
			date: "31.12.2025",
			description:
				"Learn three advanced techniques that can shave minutes off your exam.",
		},
		{
			id: "article-5",
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
			id: "article-6",
			image:
				"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop",
			author: "Zion Sandoval",
			title: "Reading and Writing Deep Dive",
			comments: 3,
			date: "31.12.2025",
			description:
				"We analyze the best strategies for managing dual-passage questions.",
		},
		{
			id: "article-7",
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
			id: "article-8",
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
		<>
			{/* Embla Carousel with Navigation */}
			<div className="relative">
				{/* Left Arrow */}
				<button
					type="button"
					onClick={scrollPrev}
					className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-16 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
					aria-label="Previous slide"
				>
					<ChevronLeft className="w-6 h-6 text-[#191919]" />
				</button>

				{/* Embla Viewport */}
				<div className="embla overflow-hidden" ref={emblaRef}>
					<div className="embla__container flex -ml-4">
						{articles.map((article) => (
							<ArticleCard key={article.id} {...article} />
						))}
					</div>
				</div>

				{/* Right Arrow */}
				<button
					type="button"
					onClick={scrollNext}
					className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-16 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
					aria-label="Next slide"
				>
					<ChevronRight className="w-6 h-6 text-[#191919]" />
				</button>
			</div>
		</>
	);
}
