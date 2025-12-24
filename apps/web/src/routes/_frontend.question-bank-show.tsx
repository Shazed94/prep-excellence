import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Download, Eye, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_frontend/question-bank-show")({
	component: RouteComponent,
});

/* ================= MOCK DATA ================= */

const QUESTIONS = Array.from({ length: 10 }).map((_, i) => ({
	id: `M-${1000 + i}`,
	domain: "Advanced Math",
	skill: "Quadratic Functions",
	difficulty: ["Easy", "Medium", "Hard"][i % 3],
}));

/* ================= PAGE ================= */

function RouteComponent() {
	const [selected, setSelected] = useState<string[]>([]);

	const toggle = (id: string) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	return (
		<div className=" bg-slate-50">
			{/* ================= HERO ================= */}
			<header className="bg-gradient-to-r from-[#0086C5] to-[#005A8C] text-white">
				<div className="container mx-auto py-10">
					<h1 className="text-3xl font-bold mb-2">Educator Question Bank</h1>
					<p className="text-blue-100">
						Create, review, and export targeted SAT question sets
					</p>
				</div>
			</header>

			{/* ================= CONTENT ================= */}
			<main className="container mx-auto py-10 space-y-8">
				{/* ================= GUIDE SECTION ================= */}
				<section className="bg-white border rounded-xl p-6 md:p-8">
					<h2 className="text-2xl font-bold text-slate-900 mb-2">
						Question Bank Results
					</h2>
					<p className="text-slate-600 mb-6">
						Use the additional filters to narrow your results and complete your
						question set.
					</p>

					<div className="grid md:grid-cols-2 gap-8">
						{/* Filters */}
						<div>
							<h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
								<Filter className="w-5 h-5 text-[#0086C5]" />
								Additional Filters
							</h3>
							<ul className="space-y-3 text-sm text-slate-700">
								<li>
									<strong>Difficulty:</strong> Easy, Medium, or Hard.
								</li>
								<li>
									<strong>Skill:</strong> Focus on a specific skill within a
									domain.
								</li>
								<li>
									<strong>Exclude Active Questions:</strong> Remove questions
									already available in Bluebook™.
								</li>
								<li>
									<strong>Include State Standards:</strong> View State Standard
									IDs assessed by each question.
								</li>
							</ul>
						</div>

						{/* How to use */}
						<div>
							<h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
								<CheckSquare className="w-5 h-5 text-[#0086C5]" />
								Build Your Question Set
							</h3>
							<ul className="space-y-3 text-sm text-slate-700">
								<li className="flex gap-2">
									<Eye className="w-4 h-4 mt-0.5" />
									Select a Question ID to preview.
								</li>
								<li className="flex gap-2">
									<CheckSquare className="w-4 h-4 mt-0.5" />
									Use checkboxes to add questions.
								</li>
								<li className="flex gap-2">
									<Download className="w-4 h-4 mt-0.5" />
									Export PDF with or without answers.
								</li>
							</ul>
						</div>
					</div>
				</section>

				{/* ================= ACTION BAR ================= */}
				<div className="bg-white border rounded-xl p-4 flex justify-between items-center sticky top-2 z-10 shadow-sm">
					<span className="text-sm text-slate-700">
						<strong>{selected.length}</strong> questions selected
					</span>

					<Button className="px-5 py-2 bg-[#0086C5] text-white rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-[#005A8C]">
						<Download className="w-4 h-4" />
						Export
					</Button>
				</div>

				{/* ================= TABLE ================= */}
				<div className="bg-white border rounded-xl overflow-hidden">
					<table className="w-full text-sm">
						<thead className="bg-slate-100 text-slate-700">
							<tr>
								<th className="px-4 py-3 text-left">
									<input type="checkbox" />
								</th>
								<th className="px-4 py-3 text-left">ID</th>
								<th className="px-4 py-3 text-left">Domain</th>
								<th className="px-4 py-3 text-left">Skill</th>
								<th className="px-4 py-3 text-left">Difficulty</th>
								<th className="px-4 py-3 text-right">Preview</th>
							</tr>
						</thead>

						<tbody>
							{QUESTIONS.map((q) => {
								const active = selected.includes(q.id);
								return (
									<tr
										key={q.id}
										className={`border-t hover:bg-slate-50 ${
											active ? "bg-blue-50" : ""
										}`}
									>
										<td className="px-4 py-3">
											<input
												type="checkbox"
												checked={active}
												onChange={() => toggle(q.id)}
												className="accent-[#0086C5]"
											/>
										</td>
										<td className="px-4 py-3 font-medium text-[#0086C5] cursor-pointer">
											{q.id}
										</td>
										<td className="px-4 py-3">{q.domain}</td>
										<td className="px-4 py-3">{q.skill}</td>
										<td className="px-4 py-3">
											<DifficultyBadge level={q.difficulty} />
										</td>
										<td className="px-4 py-3 text-right">
											<Button className="text-[#0086C5] hover:underline flex items-center gap-1 justify-end">
												<Eye className="w-4 h-4" /> View
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}

/* ================= HELPERS ================= */

function DifficultyBadge({ level }: { level: string }) {
	const map = {
		Easy: "bg-green-100 text-green-700",
		Medium: "bg-yellow-100 text-yellow-700",
		Hard: "bg-red-100 text-red-700",
	};

	return (
		<span
			className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
				map[level as keyof typeof map]
			}`}
		>
			{level}
		</span>
	);
}
