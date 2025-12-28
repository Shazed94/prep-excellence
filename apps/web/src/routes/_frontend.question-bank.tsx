import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Grid3x3, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/_frontend/question-bank")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full overflow-x-hidden">
			{/* ================= HERO SECTION ================= */}
			<section className="bg-[#D9E6ED] px-4 sm:px-6 py-10 sm:py-14 lg:py-20">
				<div className="max-w-5xl mx-auto text-center">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-blue-100/60 rounded-full border border-blue-200/50">
						<Sparkles className="w-4 h-4 text-[#0086C5]" />
						<span className="text-xs sm:text-sm font-medium text-[#0086C5]">
							SAT | PSAT/NMSQT | PSAT 10 | PSAT 8/9
						</span>
					</div>

					{/* Heading */}
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
						Find Perfect Test Questions
					</h1>

					{/* Description */}
					<p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
						Access thousands of authentic SAT and PSAT questions. Filter by
						difficulty, domain, and skill to create the perfect question sets
						for your classroom.
					</p>

					{/* CTA */}
					<div className="flex justify-center">
						<Link
							to={"/question-bank-search/" as "/question-bank-search"}
							className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-[#0086C5] text-white font-semibold rounded-lg
                         hover:bg-[#0070A8] transition-all hover:shadow-xl hover:-translate-y-0.5"
						>
							Start Searching
							<ArrowRight className="w-5 h-5" />
						</Link>
					</div>
				</div>
			</section>

			{/* ================= FEATURES ================= */}
			<section className="bg-slate-50/50 px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
						{[
							{
								icon: Grid3x3,
								label: "Smart Filters",
								desc: "Filter by assessment, domain, skill, and difficulty",
							},
							{
								icon: Zap,
								label: "Instant Export",
								desc: "Export to PDF with answer keys in seconds",
							},
							{
								icon: Sparkles,
								label: "1000+ Questions",
								desc: "Authentic questions from College Board",
							},
						].map((item, i) => (
							<div
								key={i}
								className="p-6 bg-white rounded-xl border border-slate-200
                           hover:border-[#0086C5] hover:shadow-lg transition-all group"
							>
								<item.icon className="w-8 h-8 text-[#0086C5] mb-4 group-hover:scale-110 transition-transform" />
								<h3 className="text-lg font-bold text-slate-900 mb-2">
									{item.label}
								</h3>
								<p className="text-sm text-slate-600 leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
