import { format } from "date-fns";
import DOMPurify from "dompurify";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import parse from "html-react-parser";
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
import { type Blog, useBlogs } from "@/hooks/content-management";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

/* ---------------- Article Card ---------------- */

const ArticleCard = ({ article }: { article: Blog }) => {
	console.log("article", article);

	return (
		<div
			className="
				embla__slide
				flex-[0_0_100%]
				md:flex-[0_0_50%]
				lg:flex-[0_0_33.333%]
				xl:flex-[0_0_25%]
				min-w-0
				px-2
			"
		>
			<Card className="h-full border-none bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
				<CardHeader className="p-0">
					<img
						src={article?.image}
						alt={article?.title}
						className="w-full h-48 object-cover"
					/>
				</CardHeader>

				<CardContent className="p-6 flex flex-col h-72 justify-between">
					<div>
						<p className="text-sm text-[#848484] mb-3">
							— By {article?.author?.name}
						</p>

						<CardTitle className="text-md xl:text-xl font-bold text-[#191919] mb-4">
							{article?.title}
						</CardTitle>

						<div className="flex items-center gap-4 mb-4 text-sm text-[#848484]">
							<div className="flex items-center gap-1">
								<MessageCircle className="w-4 h-4 text-[#0086c5]" />
								<span>{article?.comments?.length}</span>
							</div>

							<div className="flex items-center gap-1">
								<Calendar className="w-4 h-4 text-[#0086c5]" />
								<span>
									{format(article?.publishedAt || "", "MMMM dd, yyyy")}
								</span>
							</div>
						</div>

						<CardDescription className="text-sm text-[#848484] mb-6">
							{parse(DOMPurify.sanitize(article?.description))}
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

	const { data: latestBlogs } = useBlogs({
		page: 1,
		limit: 7,
		status: "PUBLISHED",
	});

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
					{latestBlogs?.data?.map((article) => (
						<ArticleCard key={article.id} article={article} />
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
