import type {
	TDomain,
	TGQuestion,
	TSkill,
	TSubject,
	TTestType,
} from "@prepexcellence/shared-validators";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useDeleteQuestion, useGetQuestions } from "@/hooks/question-back";
import {
	useGetDomains,
	useGetSkills,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";

export const Route = createFileRoute(
	"/teacher-dashboard/question-bank/practice-test-configuration/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<Record<string, string>>({});

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
		null,
	);
	const [selectedQuestion, setSelectedQuestion] = useState<TGQuestion | null>(
		null,
	);

	const { data: questionsData, isLoading } = useGetQuestions({
		page,
		limit,
		search,
		filters,
		sortBy: "createdAt",
		orderBy: "desc",
	});

	const { data: testTypesData } = useGetTestTypes({
		limit: 100,
		sortBy: "order",
		orderBy: "asc",
	});
	const { data: subjectsData } = useGetSubjects({
		limit: 100,
		sortBy: "order",
		orderBy: "asc",
		filters: { testTypeId: filters.testTypeId },
	});
	const { data: domainsData } = useGetDomains({
		limit: 100,
		sortBy: "order",
		orderBy: "asc",
		filters: { subjectId: filters.subjectId },
	});
	const { data: skillsData } = useGetSkills({
		limit: 100,
		sortBy: "order",
		orderBy: "asc",
		filters: { domainId: filters.domainId },
	});

	const deleteQuestion = useDeleteQuestion();

	const handleDelete = (id: string) => {
		setSelectedQuestionId(id);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (selectedQuestionId) {
			await deleteQuestion.mutateAsync(selectedQuestionId);
			setDeleteDialogOpen(false);
			setSelectedQuestionId(null);
		}
	};

	const handleEdit = (id: string) => {
		navigate({
			to: "/teacher-dashboard/question-bank/practice-test-configuration/add-question",
			search: { id },
		});
	};

	const columns: ColumnDef<TGQuestion>[] = [
		{
			accessorKey: "questionID",
			header: "Question ID",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.questionID}</div>
			),
		},
		{
			accessorKey: "content",
			header: "Question",
			cell: ({ row }) => {
				const content = row.original.content;
				const stripped = content.replace(/<[^>]*>/g, "");
				return (
					<div className="max-w-[400px] truncate" title={stripped}>
						{stripped}
					</div>
				);
			},
		},
		{
			accessorKey: "testType",
			header: "Test Type",
			cell: ({ row }) => row.original.testType?.name || "N/A",
		},
		{
			accessorKey: "subject",
			header: "Subject",
			cell: ({ row }) => row.original.subject?.name || "N/A",
		},
		{
			accessorKey: "difficulty",
			header: "Difficulty",
			cell: ({ row }) => {
				const difficulty = row.original.difficulty;
				const colors: Record<string, string> = {
					EASY: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
					MEDIUM:
						"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
					HARD: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
				};
				return <Badge className={colors[difficulty] || ""}>{difficulty}</Badge>;
			},
		},
		{
			accessorKey: "optionType",
			header: "Type",
			cell: ({ row }) => {
				const type = row.original.optionType;
				const formatted = type
					.replace(/_/g, " ")
					.toLowerCase()
					.replace(/\b\w/g, (c: string) => c.toUpperCase());
				return (
					<Badge variant="outline" className="whitespace-nowrap">
						{formatted}
					</Badge>
				);
			},
		},
		{
			accessorKey: "points",
			header: "Points",
			cell: ({ row }) => row.original.points || 1,
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSelectedQuestion(row.original)}
						title="View"
					>
						<Eye className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleEdit(row.original.id)}
						title="Edit"
					>
						<Edit className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => handleDelete(row.original.id)}
						title="Delete"
						className="text-destructive hover:text-destructive"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			),
		},
	];

	const addButton = () => {
		return (
			<Button
				type="button"
				className="bg-primary-dark hover:bg-primary-dark/90 text-white"
				onClick={() =>
					navigate({
						to: "/teacher-dashboard/question-bank/practice-test-configuration/add-question",
					})
				}
			>
				<Plus className="w-4 h-4 mr-2" />
				Add Question
			</Button>
		);
	};

	return (
		<div className="w-full space-y-6">
			<Card>
				<CardContent className="pt-6">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-lg">Filters</h3>
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setFilters({});
									setSearch("");
								}}
								disabled={Object.keys(filters).length === 0 && !search}
							>
								Clear Filters
							</Button>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<Label className="text-sm font-medium mb-2 block">
									Test Type
								</Label>
								<SearchableSelect
									options={
										testTypesData?.data?.map((type: TTestType) => ({
											value: type.id,
											label: type.name,
										})) || []
									}
									value={filters.testTypeId || ""}
									onValueChange={(value) => {
										const newFilters = { ...filters };
										if (value) {
											newFilters.testTypeId = value;
										} else {
											delete newFilters.testTypeId;
										}
										delete newFilters.subjectId;
										delete newFilters.domainId;
										delete newFilters.skillId;
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">
									Subject
								</Label>
								<SearchableSelect
									options={
										subjectsData?.data?.map((subject: TSubject) => ({
											value: subject.id,
											label: subject.name,
										})) || []
									}
									value={filters.subjectId || ""}
									onValueChange={(value) => {
										const newFilters = { ...filters };
										if (value) {
											newFilters.subjectId = value;
										} else {
											delete newFilters.subjectId;
										}
										delete newFilters.domainId;
										delete newFilters.skillId;
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">Domain</Label>
								<SearchableSelect
									options={
										domainsData?.data?.map((domain: TDomain) => ({
											value: domain.id,
											label: domain.name,
										})) || []
									}
									value={filters.domainId || ""}
									onValueChange={(value) => {
										const newFilters = { ...filters };
										if (value) {
											newFilters.domainId = value;
										} else {
											delete newFilters.domainId;
										}
										delete newFilters.skillId;
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">Skill</Label>
								<SearchableSelect
									options={
										skillsData?.data?.map((skill: TSkill) => ({
											value: skill.id,
											label: skill.name,
										})) || []
									}
									value={filters.skillId || ""}
									onValueChange={(value) => {
										const newFilters = { ...filters };
										if (value) {
											newFilters.skillId = value;
										} else {
											delete newFilters.skillId;
										}
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">
									Difficulty
								</Label>
								<SearchableSelect
									options={[
										{ value: "EASY", label: "Easy" },
										{ value: "MEDIUM", label: "Medium" },
										{ value: "HARD", label: "Hard" },
									]}
									value={filters.difficulty || ""}
									onValueChange={(value) => {
										const newFilters = { ...filters };
										if (value) {
											newFilters.difficulty = value;
										} else {
											delete newFilters.difficulty;
										}
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">
									Question Type
								</Label>
								<SearchableSelect
									options={[
										{ value: "SINGLE_CHOICE", label: "Single Choice" },
										{ value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
										{ value: "FILL_IN_THE_BLANK", label: "Fill in the Blank" },
										{ value: "TRUE_FALSE", label: "True/False" },
										{ value: "SHORT_ANSWER", label: "Short Answer" },
									]}
									value={filters.optionType || ""}
									onValueChange={(value) => {
										const newFilters = { ...filters };
										if (value) {
											newFilters.optionType = value;
										} else {
											delete newFilters.optionType;
										}
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">Search</Label>
								<Input
									placeholder="Search questions..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<DataTable
				columns={columns}
				data={questionsData?.data || []}
				title="Questions"
				Component={addButton}
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
			/>

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
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{selectedQuestion && (
				<QuestionModal
					question={selectedQuestion}
					questions={questionsData?.data || []}
					onClose={() => setSelectedQuestion(null)}
					onNavigate={(q) => setSelectedQuestion(q)}
				/>
			)}
		</div>
	);
}
