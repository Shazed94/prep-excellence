import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	ArrowLeft,
	CheckSquare,
	Download,
	Eye,
	Filter,
	Plus,
} from "lucide-react";
import { useState } from "react";
import { createSortableHeader, DataTable } from "@/components/DataTable";
import { QuestionModal } from "@/components/sat-courses/question_model";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useDeleteQuestion } from "@/hooks/question-back";
import {
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
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	// Delete modal state
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
		null,
	);
	const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
	const deleteQuestion = useDeleteQuestion();

	const confirmDelete = async () => {
		if (selectedQuestionId) {
			await deleteQuestion.mutateAsync(selectedQuestionId);
			setDeleteDialogOpen(false);
			setSelectedQuestionId(null);
		}
	};

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
						variant="ghost"
						className=" hover:underline"
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

	const addButton = () => {
		return (
			<Button
				type="button"
				className="bg-primary-dark hover:bg-primary-dark/90 text-white"
			>
				<Link
					to="/dashboard/question-bank/practice-test-configuration/add-question"
					className="flex items-center"
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Question
				</Link>
			</Button>
		);
	};

	return (
		<div className=" bg-slate-50">
			{/* ================= HERO ================= */}
			<header className="bg-linear-to-r from-[#0086C5] to-[#005A8C] text-white">
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
				{/* <div className="bg-white border rounded-xl p-4 flex justify-between items-center sticky top-2 z-10 shadow-sm">
					<span className="text-sm text-slate-700">
						<strong>{selected.length}</strong> questions selected
					</span>

					<Button className="px-5 py-2 bg-[#0086C5] text-white rounded-md font-semibold text-sm flex items-center gap-2 hover:bg-[#005A8C]">
						<Download className="w-4 h-4" />
						Export
					</Button>
				</div> */}

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
					hasNext={questionsData?.pagination?.hasNext || false}
					hasPrev={questionsData?.pagination?.hasPrev || false}
					total={questionsData?.pagination?.total || 0}
					pageSize={limit}
					Component={addButton}
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

				{/* Delete confirmation dialog */}
				<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								question from the database.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={confirmDelete}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				{/* Question modal */}
				{selectedQuestion && (
					<QuestionModal
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
