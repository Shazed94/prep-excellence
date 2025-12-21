import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
	useDeleteQuestion,
	useGetQuestionById,
	useGetQuestions,
} from "@/hooks/question-back";
import {
	useGetDomains,
	useGetSkills,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";

export const Route = createFileRoute(
	"/dashboard/question-bank/practice-test-configuration/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const limit = 10;
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState<Record<string, any>>({});

	// Delete dialog state
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
		null,
	);

	// View dialog state
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [viewQuestionId, setViewQuestionId] = useState<string | null>(null);

	// Fetch questions
	const { data: questionsData, isLoading } = useGetQuestions({
		page,
		limit,
		search,
		filters,
		sortBy: "createdAt",
		orderBy: "desc",
	});

	// Fetch filter options
	const { data: testTypesData } = useGetTestTypes({ limit: 100 });
	const { data: subjectsData } = useGetSubjects({ limit: 100 });
	const { data: domainsData } = useGetDomains({ limit: 100 });
	const { data: skillsData } = useGetSkills({ limit: 100 });
	const { data: viewQuestionData } = useGetQuestionById(viewQuestionId || "");

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

	const handleView = (id: string) => {
		setViewQuestionId(id);
		setViewDialogOpen(true);
	};

	const handleEdit = (id: string) => {
		navigate({
			to: "/dashboard/question-bank/practice-test-configuration/add-question",
			search: { id },
		});
	};

	const columns: ColumnDef<any>[] = [
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
						onClick={() => handleView(row.original.id)}
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
		<div className="w-full space-y-6">
			{/* Filters Section */}
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
										testTypesData?.data?.map((type: any) => ({
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
										subjectsData?.data?.map((subject: any) => ({
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
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">Domain</Label>
								<SearchableSelect
									options={
										domainsData?.data?.map((domain: any) => ({
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
										setFilters(newFilters);
									}}
								/>
							</div>

							<div>
								<Label className="text-sm font-medium mb-2 block">Skill</Label>
								<SearchableSelect
									options={
										skillsData?.data?.map((skill: any) => ({
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
										{ value: "TRUE_FALSE", label: "True/False" },
										{ value: "FILL_IN_THE_BLANK", label: "Fill in the Blank" },
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

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={questionsData?.data || []}
				title="Questions"
				Component={addButton}
				isLoading={isLoading}
				manualPagination
				pageIndex={page - 1}
				pageCount={questionsData?.pagination?.totalPages || 0}
				onPaginationChange={(updater) => {
					if (typeof updater === "function") {
						const newState = updater({ pageIndex: page - 1, pageSize: limit });
						setPage(newState.pageIndex + 1);
					}
				}}
				hasNext={questionsData?.pagination?.hasNext || false}
				hasPrev={questionsData?.pagination?.hasPrev || false}
				total={questionsData?.pagination?.total || 0}
			/>

			{/* Delete Confirmation Dialog */}
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

			{/* View Question Dialog */}
			<Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
				<DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Question Details</DialogTitle>
						<DialogDescription>
							View complete question information
						</DialogDescription>
					</DialogHeader>
					{viewQuestionData?.data && (
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold mb-2">Question Content</h3>
								<div
									className="prose prose-sm max-w-none"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Blog content is sanitized
									dangerouslySetInnerHTML={{
										__html: viewQuestionData.data.content,
									}}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<span className="text-sm font-medium">Test Type:</span>
									<p className="text-sm text-muted-foreground">
										{viewQuestionData.data.testType?.name || "N/A"}
									</p>
								</div>
								<div>
									<span className="text-sm font-medium">Subject:</span>
									<p className="text-sm text-muted-foreground">
										{viewQuestionData.data.subject?.name || "N/A"}
									</p>
								</div>
								<div>
									<span className="text-sm font-medium">Difficulty:</span>
									<p className="text-sm text-muted-foreground">
										{viewQuestionData.data.difficulty}
									</p>
								</div>
								<div>
									<span className="text-sm font-medium">Points:</span>
									<p className="text-sm text-muted-foreground">
										{viewQuestionData.data.points || 1}
									</p>
								</div>
								<div>
									<span className="text-sm font-medium">Domain:</span>
									<p className="text-sm text-muted-foreground">
										{viewQuestionData.data.domain?.name || "N/A"}
									</p>
								</div>
								<div>
									<span className="text-sm font-medium">Skill:</span>
									<p className="text-sm text-muted-foreground">
										{viewQuestionData.data.skill?.name || "N/A"}
									</p>
								</div>
							</div>

							{viewQuestionData.data.options?.length > 0 && (
								<div>
									<h3 className="font-semibold mb-2">Options</h3>
									<div className="space-y-2">
										{viewQuestionData.data.options.map(
											(option: any, idx: number) => (
												<div
													key={option.id}
													className={`p-3 rounded-lg border ${
														option.isCorrect
															? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
															: "bg-muted/50"
													}`}
												>
													<div className="flex items-start gap-2">
														<span className="font-semibold min-w-6">
															{String.fromCharCode(65 + idx)}.
														</span>
														<span className="flex-1">{option.content}</span>
														{option.isCorrect && (
															<Badge className="bg-green-600">Correct</Badge>
														)}
													</div>
												</div>
											),
										)}
									</div>
								</div>
							)}

							{viewQuestionData.data.fillBlanks?.length > 0 && (
								<div>
									<h3 className="font-semibold mb-2">Fill in the Blanks</h3>
									<div className="space-y-2">
										{viewQuestionData.data.fillBlanks.map(
											(blank: any, idx: number) => (
												<div key={blank.id} className="p-3 rounded-lg bg-muted">
													<p className="font-medium">
														Blank {idx + 1}: {blank.answer}
													</p>
													{blank.alternatives?.length > 0 && (
														<p className="text-sm text-muted-foreground mt-1">
															Alternatives: {blank.alternatives.join(", ")}
														</p>
													)}
												</div>
											),
										)}
									</div>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
