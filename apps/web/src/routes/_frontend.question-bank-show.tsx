import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CheckSquare,
	Download,
	Eye,
	Filter,
	Loader2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MultiSearchableSelect } from "@/components/ui/multiSelect";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useGetDifficulties,
	useGetQuestionsFiltered,
	useGetSkillsByFilter,
} from "@/hooks/sat-practice";

type QuestionBankSearchParams = {
	testTypeId?: string;
	subjectId?: string;
	domainIds?: string;
};

export const Route = createFileRoute("/_frontend/question-bank-show")({
	component: RouteComponent,
	validateSearch: (
		search: Record<string, unknown>,
	): QuestionBankSearchParams => {
		return {
			testTypeId: search.testTypeId as string | undefined,
			subjectId: search.subjectId as string | undefined,
			domainIds: search.domainIds as string | undefined,
		};
	},
});

/* ================= PAGE ================= */

function RouteComponent() {
	const { testTypeId, subjectId, domainIds } = Route.useSearch();
	const [selected, setSelected] = useState<string[]>([]);
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

	// Parse domainIds from comma-separated string to array
	const domainIdsArray = domainIds
		? domainIds
				.split(",")
				.map((id) => id.trim())
				.filter(Boolean)
		: [];

	// Additional filters state
	const [selectedSkillId, setSelectedSkillId] = useState<string[]>([]);

	// Fetch difficulties
	const { data: difficultiesData } = useGetDifficulties({
		page: 1,
		limit: 100,
	});

	// Fetch skills (prefer domain-based, fallback to subject)
	const { data: skillsData, isLoading: isLoadingSkills } = useGetSkillsByFilter(
		{
			page: 1,
			limit: 100,
			filters: {
				domainIds: domainIdsArray.length > 0 ? domainIdsArray : undefined,
			},
		},
	);
	const skills = skillsData?.data || [];

	const difficulties = difficultiesData?.data || [];

	const selectedSkills = skills.filter((s: any) =>
		selectedSkillId.includes(s.id),
	);

	// Map selected difficulty label to difficultyId if possible
	const selectedDifficultyId = (() => {
		if (!selectedDifficulty || selectedDifficulty === "any") return undefined;
		const found = difficulties.find((d: any) => d.name === selectedDifficulty);
		return found?.id;
	})();

	// Fetch questions based on search params using POST filter endpoint
	const { data: questionsData, isLoading } = useGetQuestionsFiltered({
		page: 1,
		limit: 100,
		filters: {
			testTypeId,
			subjectId,
			domainIds: domainIdsArray.length > 0 ? domainIdsArray : undefined,
			skillIds: selectedSkillId.length > 0 ? selectedSkillId : undefined,
			difficultyId: selectedDifficultyId,
		},
	});

	const questions = questionsData?.data || [];

	const toggle = (id: string) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	};

	const toggleAll = () => {
		if (selected.length === questions.length) {
			setSelected([]);
		} else {
			setSelected(questions.map((q: any) => q.id));
		}
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
				{/* Back link */}
				<Link
					to="/question-bank-search"
					className="inline-flex items-center gap-2 text-[#0086C5] hover:underline"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Search
				</Link>

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
							<div className="space-y-3 text-sm text-slate-700">
								<div>
									<p className="text-xs text-slate-500 mb-1">Difficulty</p>
									<Select
										value={selectedDifficulty}
										onValueChange={setSelectedDifficulty}
									>
										<SelectTrigger className="w-full rounded-md">
											<SelectValue placeholder="Select difficulty" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="any">Any</SelectItem>
											<SelectItem value="Easy">Easy</SelectItem>
											<SelectItem value="Medium">Medium</SelectItem>
											<SelectItem value="Hard">Hard</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<p className="text-xs text-slate-500 mb-1">Skill</p>
									<MultiSearchableSelect
										loading={isLoadingSkills}
										debounceMs={30}
										searchPlaceholder="Search by skills"
										options={skills.map((s: any) => ({
											value: s.id,
											label: s.name,
										}))}
										value={selectedSkillId}
										onValueChange={setSelectedSkillId}
									/>
								</div>

								<div>
									<strong>Other:</strong>
									<div className="mt-2 text-xs text-slate-600">
										<div>
											Exclude Active Questions: Remove questions already
											available in Bluebook™.
										</div>
										<div>
											Include State Standards: View State Standard IDs assessed
											by each question.
										</div>
									</div>
								</div>
							</div>
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

				{/* Active filters */}
				<div className="flex items-center gap-2 mt-2">
					{domainIdsArray.length > 0 && (
						<Badge variant="secondary">{domainIdsArray.length} domain(s)</Badge>
					)}
					{selectedSkills.map((s: any) => (
						<Badge key={s.id} variant="secondary">
							{s.name}
						</Badge>
					))}
					{selectedDifficulty && selectedDifficulty !== "any" && (
						<Badge variant="secondary">{selectedDifficulty}</Badge>
					)}
				</div>

				{/* ================= TABLE ================= */}
				<div className="bg-white border rounded-xl overflow-hidden">
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<Loader2 className="w-8 h-8 animate-spin text-[#0086C5]" />
						</div>
					) : questions.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-slate-500">
								No questions found matching your criteria.
							</p>
							<Link
								to="/question-bank-search"
								className="text-[#0086C5] hover:underline mt-2 inline-block"
							>
								Modify your search
							</Link>
						</div>
					) : (
						<table className="w-full text-sm">
							<thead className="bg-slate-100 text-slate-700">
								<tr>
									<th className="px-4 py-3 text-left">
										<input
											type="checkbox"
											checked={
												selected.length === questions.length &&
												questions.length > 0
											}
											onChange={toggleAll}
										/>
									</th>
									<th className="px-4 py-3 text-left">ID</th>
									<th className="px-4 py-3 text-left">Domain</th>
									<th className="px-4 py-3 text-left">Skill</th>
									<th className="px-4 py-3 text-left">Difficulty</th>
									<th className="px-4 py-3 text-right">Preview</th>
								</tr>
							</thead>

							<tbody>
								{questions.map((q: any) => {
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
												{q.questionId || q.id}
											</td>
											<td className="px-4 py-3">{q.domain?.name || "-"}</td>
											<td className="px-4 py-3">{q.skill?.name || "-"}</td>
											<td className="px-4 py-3">
												<DifficultyBadge
													level={q.difficulty?.name || "Medium"}
												/>
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
					)}
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
