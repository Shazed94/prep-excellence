import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpen,
	Download,
	Grid3x3,
	Search,
	Sparkles,
	Target,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import FooterTwo from "@/components/FooterTwo";
import { Subtitle } from "@/components/SectionSubtitle";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export const Route = createFileRoute("/_frontend/question-bank")({
	component: RouteComponent,
});

const FEATURES = [
	{
		icon: Grid3x3,
		title: "Smart Filters",
		desc: "Filter by assessment type, domain, skill level, and difficulty in seconds.",
	},
	{
		icon: Zap,
		title: "Instant Export",
		desc: "Export custom question sets to PDF with full answer keys included.",
	},
	{
		icon: Sparkles,
		title: "1,000+ Questions",
		desc: "Authentic SAT, PSAT/NMSQT, PSAT 10, and PSAT 8/9 questions from College Board.",
	},
	{
		icon: Target,
		title: "Skill Targeting",
		desc: "Pinpoint specific weak areas and practice exactly what needs improvement.",
	},
	{
		icon: Search,
		title: "Full-Text Search",
		desc: "Search across question content, passage excerpts, and answer explanations.",
	},
	{
		icon: Download,
		title: "Offline Practice",
		desc: "Download question sets and practice without an internet connection.",
	},
];

const HOW_IT_WORKS = [
	{
		step: "01",
		title: "Choose Your Assessment",
		desc: "Select SAT, PSAT/NMSQT, PSAT 10, or PSAT 8/9 to filter the question pool.",
	},
	{
		step: "02",
		title: "Apply Smart Filters",
		desc: "Narrow by domain, skill, difficulty level, and question type.",
	},
	{
		step: "03",
		title: "Build Your Set",
		desc: "Select individual questions or generate a balanced set automatically.",
	},
	{
		step: "04",
		title: "Export & Practice",
		desc: "Download as PDF with answer key, or practice directly in the browser.",
	},
];

const ASSESSMENTS = [
	{ name: "SAT", questions: "800+", color: "bg-primary text-white" },
	{ name: "PSAT/NMSQT", questions: "200+", color: "bg-[#EBF3FF] text-primary" },
	{ name: "PSAT 10", questions: "100+", color: "bg-[#EBF3FF] text-primary" },
	{ name: "PSAT 8/9", questions: "80+", color: "bg-[#EBF3FF] text-primary" },
];

function RouteComponent() {
	return (
		<div className="overflow-x-hidden">
			{/* ── Hero ── */}
			<section className="relative overflow-hidden px-4 md:px-0">
				<div className="relative z-10 container mx-auto py-20 text-center">
					{/* Badge */}
					<motion.div
						className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-primary-light rounded-full border border-primary/10"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Sparkles className="w-4 h-4 text-primary" />
						<span className="f14 text-primary font-semibold">
							SAT · PSAT/NMSQT · PSAT 10 · PSAT 8/9
						</span>
					</motion.div>

					<motion.h1
						className="h1 max-w-3xl mx-auto mb-4"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
					>
						Find the Perfect{" "}
						<span className="text-primary">Practice Questions</span>
					</motion.h1>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.55,
							delay: 0.15,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<Subtitle className="max-w-xl mx-auto mb-8">
							Access 1,000+ authentic SAT and PSAT questions. Filter by
							difficulty, domain, and skill to build the perfect practice set.
						</Subtitle>
					</motion.div>

					<motion.div
						className="flex flex-col sm:flex-row items-center justify-center gap-4"
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<Link to={"/question-bank-search" as "/question-bank-search"}>
							<Button variant="gradient" className="h-[50px] px-10 text-base">
								Start Searching
								<ArrowRight className="ml-2 w-4 h-4" />
							</Button>
						</Link>
						<Link to={"/sat-practice" as "/sat-practice"}>
							<Button variant="outline" className="h-[50px] px-10 text-base">
								Take a Practice Test
							</Button>
						</Link>
					</motion.div>

					{/* Assessment chips */}
					<motion.div
						className="flex flex-wrap items-center justify-center gap-3 mt-10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.45 }}
					>
						{ASSESSMENTS.map((a) => (
							<div
								key={a.name}
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${a.color}`}
							>
								<BookOpen className="w-3.5 h-3.5" />
								{a.name}
								<span className="opacity-70">{a.questions}</span>
							</div>
						))}
					</motion.div>
				</div>

				{/* bg */}
				<img
					src="/bg.png"
					alt=""
					className="absolute inset-0 w-full h-full object-cover z-0"
				/>
				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(201,220,255,0.4) 60%, rgba(236,241,254,0.5) 83%, rgba(21,82,253,0.2) 100%)",
					}}
				/>
			</section>

			{/* ── Features ── */}
			<section className="py-20 px-4 md:px-0 bg-white">
				<div className="container mx-auto">
					<motion.div
						className="text-center mb-12"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<h2 className="h2">Everything You Need to Practice Smarter</h2>
						<Subtitle alignment="center">
							Powerful tools built for students and instructors alike
						</Subtitle>
					</motion.div>

					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
						variants={staggerContainer}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						{FEATURES.map(({ icon: Icon, title, desc }) => (
							<motion.div
								key={title}
								variants={fadeUp}
								className="group p-6 bg-white rounded-2xl border border-[#EBEBEB] hover:border-primary hover:shadow-lg transition-all duration-300"
							>
								<div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
									<Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
								</div>
								<h3 className="h4 mb-2">{title}</h3>
								<p className="f14 text-muted-foreground leading-relaxed">
									{desc}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* ── How it works ── */}
			<section className="py-20 px-4 md:px-0 bg-[#FAFAFA]">
				<div className="container mx-auto">
					<motion.div
						className="text-center mb-12"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<h2 className="h2">How It Works</h2>
						<Subtitle alignment="center">
							Go from browsing to practising in under a minute
						</Subtitle>
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{HOW_IT_WORKS.map(({ step, title, desc }, i) => (
							<motion.div
								key={step}
								variants={fadeUp}
								initial="hidden"
								whileInView="visible"
								viewport={viewportOnce}
								className="relative"
							>
								{i < HOW_IT_WORKS.length - 1 && (
									<div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-primary-light -translate-x-1/2 z-0" />
								)}
								<div className="relative z-10 bg-white rounded-2xl border border-[#EBEBEB] p-6 h-full">
									<div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm mb-4">
										{step}
									</div>
									<h3 className="h4 mb-2">{title}</h3>
									<p className="f14 text-muted-foreground leading-relaxed">
										{desc}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className="py-20 px-4 md:px-0 bg-primary">
				<div className="container mx-auto text-center">
					<motion.div
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOnce}
					>
						<h2 className="h2 text-white! mb-4">
							Ready to Build Your Practice Set?
						</h2>
						<Subtitle className="text-white/70! max-w-lg mx-auto mb-8">
							Join thousands of students who target their weakest areas and
							boost their scores with our question bank.
						</Subtitle>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Link to={"/question-bank-search" as "/question-bank-search"}>
								<Button className="h-[50px] px-10 text-base bg-white text-primary hover:bg-white/90">
									Search Questions
									<ArrowRight className="ml-2 w-4 h-4" />
								</Button>
							</Link>
							<Link to={"/sat-courses" as "/sat-courses"}>
								<Button
									variant="outline"
									className="h-[50px] px-10 text-base border-white text-white hover:bg-white/10 hover:text-white"
								>
									Browse SAT Courses
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			<FooterTwo />
		</div>
	);
}
