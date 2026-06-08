import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
	const faqs = [
		{
			id: 1,
			question: "How is the Digital SAT different from the old paper version?",
			answer:
				"It is shorter (about two hours), administered on a computer, and allows a calculator for the entire Math section. The Digital SAT is adaptive, meaning the difficulty of the second module in both Math and Reading/Writing adjusts based on your performance in the first module.",
		},
		{
			id: 2,
			question: "What materials do I need for your online courses?",
			answer:
				"All you need is a stable internet connection, a laptop/tablet, and access to the Bluebook app (for practice tests). We provide all study materials, practice questions, and video lessons through our online platform.",
		},
		{
			id: 3,
			question: "How does the Score Guarantee work?",
			answer:
				"If you complete our full program and don't improve by at least 100 points (or reach your target score), we’ll give you a full refund or let you retake the course for free — no questions asked.",
		},
		{
			id: 4,
			question: "Can I access course recordings if I miss a live session?",
			answer:
				"Yes! All live classes are recorded and uploaded within 24 hours. You’ll have lifetime access to recordings, notes, and practice materials even after the course ends.",
		},
		{
			id: 5,
			question: "How do you personalize the learning experience?",
			answer:
				"Every student gets a dedicated mentor, weekly 1-on-1 strategy calls, custom study plans based on diagnostic results, and adaptive homework that adjusts to your strengths and weaknesses.",
		},
	];

	return (
		<section className=" py-8 md:py-20 px-4 bg-[#D9E6ED]/40 relative overflow-hidden">
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-14 items-center px-2">
					{/* Decorative left bar */}
					<span className="hidden md:block bg-primary-dark/90 w-[40%] h-auto absolute left-0 top-12 bottom-12" />

					{/* Left Side - Image */}
					<div className="relative">
						<img
							src="/home/faq.png"
							alt="Happy students in classroom"
							className="w-full max-w-lg h-auto ml-auto"
						/>
					</div>

					{/* Right Side - FAQ Content */}
					<div className="relative">
						<h5 className="h5 font-bold text-[#191919] mb-4">
							Frequently Asked Questions
						</h5>
						<p className="text-[#666666] mb-10 leading-relaxed max-w-2xl">
							There are many variations of passages of Lorem Ipsum available,
							but the majority have suffered alteration in some form, by
							injected humour.
						</p>

						{/* shadcn/ui Accordion */}
						<Accordion
							type="single"
							collapsible
							defaultValue="item-0"
							className="w-full space-y-3"
						>
							{faqs.map((faq, index) => (
								<AccordionItem
									key={faq.id}
									value={`item-${index}`}
									className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
								>
									<AccordionTrigger className="px-6 py-5 text-left font-semibold text-[#191919] hover:no-underline hover:bg-gray-50/70">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent className="px-6 pb-6 pt-2 text-[#666666] leading-relaxed">
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</section>
	);
}
