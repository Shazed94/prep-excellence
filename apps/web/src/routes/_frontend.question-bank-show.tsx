import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Filter } from "lucide-react";
import { useState } from "react";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { ExportButton } from "@/components/exportButton";
import { QuestionBankModal } from "@/components/sat-courses/questionBankView";
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
	useGetQuestionsFiltered,
	useGetSkillsByFilter,
} from "@/hooks/sat-practice";
import useSearchStore, {
	type UserSearchStoreState,
} from "@/stores/search_store";

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
	const testType = useSearchStore(
		(state: UserSearchStoreState) => state.testType,
	);

	const subject = useSearchStore(
		(state: UserSearchStoreState) => state.subject,
	);
	const domain = useSearchStore((state: UserSearchStoreState) => state.domain);

	console.log("testType", testType);
	console.log("subject", subject);
	console.log("domain", domain);
	const { testTypeId, subjectId, domainIds } = Route.useSearch();
	const [selected, setSelected] = useState<string[]>([]);
	const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

	// Parse domainIds from comma-separated string to array
	const domainIdsArray = domainIds
		? domainIds
				.split(",")
				.map((id) => id.trim())
				.filter(Boolean)
		: [];

	// Additional filters state
	const [selectedSkillId, setSelectedSkillId] = useState<string[]>([]);

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

	const selectedSkills = skills.filter((s: any) =>
		selectedSkillId.includes(s.id),
	);

	// Map UI difficulty labels to backend difficulty string (uppercase)
	const selectedDifficultyValue = (() => {
		if (!selectedDifficulty || selectedDifficulty === "any") return undefined;
		return selectedDifficulty.toUpperCase();
	})();

	// Fetch questions based on search params using POST filter endpoint
	const { data: questionsData, isLoading } = useGetQuestionsFiltered({
		page,
		limit,
		filters: {
			testTypeId,
			subjectId,
			domainIds: domainIdsArray.length > 0 ? domainIdsArray : undefined,
			skillIds: selectedSkillId.length > 0 ? selectedSkillId : undefined,
			// send difficulty as string (EASY|MEDIUM|HARD)
			difficulty: selectedDifficultyValue,
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

	// DataTable columns definition
	const columns: ColumnDef<any>[] = [
		{
			accessorKey: "select",
			header: () => (
				<input
					type="checkbox"
					checked={selected.length === questions.length && questions.length > 0}
					onChange={toggleAll}
					className="accent-[#0086C5]"
				/>
			),
			cell: ({ row }) => (
				<input
					type="checkbox"
					checked={selected.includes(row.original.id)}
					onChange={() => toggle(row.original.id)}
					className="accent-[#0086C5]"
				/>
			),
		},
		{
			accessorKey: "questionID",
			header: createSortableHeader("Question ID"),
			cell: ({ row }) => {
				const questionId = row.original.questionID;
				return (
					<Button
						onClick={() => setSelectedQuestion(row.original)}
						variant="link"
						className="underline cursor-pointer"
					>
						{questionId}
					</Button>
				);
			},
		},
		{
			accessorKey: "difficulty",
			header: createSortableHeader("Difficulty"),
			cell: ({ row }) => {
				const level = row.original.difficulty || "Medium";
				return <DifficultyBadge level={level} />;
			},
		},
		{
			accessorKey: "skill",
			header: createSortableHeader("Skill"),
			cell: ({ row }) => row.original.skill?.name || "N/A",
		},
	];

	return (
		<div className=" bg-slate-50">
			{/* ================= HERO ================= */}
			<header className="bg-linear-to-r from-[#0086C5] to-[#005A8C] text-white">
				<div className="container mx-auto py-12 px-4 md:px-0">
					<h1 className="text-3xl font-bold mb-2">Educator Question Bank</h1>
					<p className="text-blue-100">
						Create, review, and export targeted SAT question sets
					</p>
				</div>
			</header>

			{/* ================= CONTENT ================= */}
			<main className="container mx-auto py-8 space-y-6 px-4 sm:px-0">
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

					<div className="grid md:grid-cols-5 gap-8">
						{/* Filters */}
						<div className="md:col-span-2">
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
										<SelectTrigger className="w-full h-12 rounded-md">
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
										maxSelected={3}
									/>
								</div>
							</div>
						</div>

						{/* Filters & Final Steps */}
						<section className="flex gap-2 flex-col sm:flex-row md:col-span-3">
							<div>
								<p className="mb-6 text-sm text-slate-700">
									<strong>
										Apply extra filters to refine your search results:{" "}
									</strong>
								</p>

								<ul className="space-y-3 text-sm text-slate-700 mb-8">
									<li className="font-medium">
										• Difficulty: Pick one or multiple levels (easy, medium,
										hard) to match your needs.
									</li>
									<li className="font-medium">
										• Skill: Focus on a particular skill area within the
										selected subject.
									</li>
									<li className="font-medium">
										• Exclude Active Questions: Option to skip questions that
										appear in existing full-length practice exams.
									</li>
									{/* <li className="font-medium">
            • Include State Standards: Select from available states to display matching Standard IDs for each question.
          </li> */}
								</ul>
							</div>

							<div>
								<p className="text-sm text-slate-700">
									<strong>To finalize your question collection:</strong>
								</p>
								<ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc list-inside">
									<li>Click an ID to preview the question details.</li>
									<li>
										Tick the checkboxes next to questions you want to include.
									</li>
									<li>
										Hit the Export button to generate a PDF of your selected
										questions, optionally including correct answers and detailed
										explanations.
									</li>
								</ul>
							</div>
						</section>
					</div>
				</section>

				{/* Active filters */}
				<div className="flex items-center gap-2 mt-2 flex-wrap">
					{testType && (
						<Badge variant="secondary">Assessment: {testType.name}</Badge>
					)}
					{subject && (
						<Badge variant="secondary">Section: {subject.name}</Badge>
					)}
					{domain.length > 0 &&
						domain?.map((d) => {
							console.log("d", d.name);
							const domainName = d.name;
							return (
								<Badge key={d.id} variant="secondary">
									Domain: {domainName}
								</Badge>
							);
						})}
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
				<DataTable
					columns={columns}
					data={questions}
					title="Questions"
					isLoading={isLoading}
					manualPagination
					pageIndex={page - 1}
					pageCount={questionsData?.pagination?.totalPages || 0}
					onPaginationChange={(paginationState) => {
						const state =
							typeof paginationState === "function"
								? paginationState({ pageIndex: page - 1, pageSize: limit })
								: paginationState;

						const { pageIndex: newPageIndex, pageSize: newPageSize } = state;

						if (newPageSize !== limit) {
							setLimit(newPageSize);
							setPage(1);
						} else {
							setPage(newPageIndex + 1);
						}
					}}
					enableExport={false}
					hasNext={questionsData?.pagination?.hasNext || false}
					hasPrev={questionsData?.pagination?.hasPrev || false}
					total={questionsData?.pagination?.total || 0}
					pageSize={limit}
					Component={() => (
						<ExportButton
							questions={questions.filter((q: any) => selected.includes(q.id))}
						/>
					)}
				/>

				{questions.length === 0 && !isLoading && (
					<div className="text-center py-12 bg-white rounded-xl border">
						<p className="text-slate-500 mb-2">
							No questions found matching your criteria.
						</p>
						<Link
							to="/question-bank-search"
							className="text-[#0086C5] hover:underline"
						>
							Modify your search
						</Link>
					</div>
				)}

				{/* Question modal */}
				{selectedQuestion && (
					<QuestionBankModal
						question={selectedQuestion}
						questions={questionsData?.data || []}
						onClose={() => setSelectedQuestion(null)}
						onNavigate={(q: any) => setSelectedQuestion(q)}
					/>
				)}
			</main>
		</div>
	);
}

/* ================= HELPERS ================= */

function DifficultyBadge({ level }: { level: string }) {
	// Render three dots and fill based on difficulty level
	const normalized = (level || "").toLowerCase();
	let fillCount = 1;
	if (normalized.includes("easy")) fillCount = 1;
	else if (normalized.includes("medium")) fillCount = 2;
	else if (normalized.includes("hard")) fillCount = 3;

	const dots = [0, 1, 2].map((i) => (
		<span
			key={i}
			className={`inline-block w-12 h-2 rounded-full mr-1 last:mr-0 transition-colors duration-150 ${
				i < fillCount ? "bg-[#0086C5]" : "bg-slate-200"
			}`}
			aria-hidden
		/>
	));

	return (
		<span title={level} className="inline-flex items-center">
			{dots}
		</span>
	);
}
