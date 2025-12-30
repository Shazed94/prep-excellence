import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	useCreateSATPracticeTest,
	useGetSATPracticeTests,
} from "@/hooks/sat-practice";

export const Route = createFileRoute("/dashboard/question-bank/practice-test/")(
	{
		component: RouteComponent,
	},
);

// Types
interface TestPractice {
	id: string;
	testName: string;
	subject: string;
	questionCount: number;
	duration: number;
	difficulty: "Easy" | "Medium" | "Hard";
	createdAt: string;
	status: "Active" | "Draft" | "Archived";
	active?: boolean;
}

function RouteComponent() {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search, setSearch] = useState("");

	// Fetch SAT practice tests from API (backend-driven pagination + search)
	const { data: testsRes, isLoading: testsLoading } = useGetSATPracticeTests({
		page,
		limit,
		search,
	});

	const testPracticeData: TestPractice[] = React.useMemo(() => {
		const items = testsRes?.data || [];
		return items.map((item: any) => {
			const sections = item.sections || item.section || [];
			const questionCount = sections.reduce((sAcc: number, section: any) => {
				const modules = section.modules || [];
				return (
					sAcc +
					modules.reduce(
						(mAcc: number, m: any) =>
							mAcc +
							(m.questionsSetOne?.length || 0) +
							(m.questionsSetTwo?.length || 0),
						0,
					)
				);
			}, 0);
			const duration = sections.reduce(
				(acc: number, s: any) => acc + (s.duration || 0),
				0,
			);
			const difficultyRaw = item.difficulty?.name || item.difficulty;
			const difficulty = difficultyRaw
				? String(difficultyRaw).charAt(0).toUpperCase() +
					String(difficultyRaw).slice(1).toLowerCase()
				: "Medium";
			const createdAt = item.createdAt
				? new Date(item.createdAt).toLocaleDateString()
				: "";
			const status =
				item.status === "PUBLISHED"
					? "Active"
					: item.status === "ARCHIVED"
						? "Archived"
						: "Draft";

			return {
				id: item.id,
				testName: item.name || "",
				subject: item.subject?.name || item.subjectId || "",
				questionCount,
				duration,
				difficulty,
				createdAt,
				status,
			} as TestPractice;
		});
	}, [testsRes]);

	// Mutation to update/create practice test (used to change status)
	const updatePractice = useCreateSATPracticeTest();
	const [togglingId, setTogglingId] = React.useState<string | null>(null);

	const handleArchive = (id: string) => {
		setTogglingId(id);
		updatePractice.mutate(
			{ id, status: "ARCHIVED" },
			{
				onError: () => setTogglingId(null),
				onSettled: () => setTogglingId(null),
			},
		);
	};

	const handleToggleStatus = (id: string, status: string) => {
		setTogglingId(id);
		updatePractice.mutate(
			{ id, status },
			{
				onError: () => setTogglingId(null),
				onSettled: () => setTogglingId(null),
			},
		);
	};
	// Test Practice Columns
	const testPracticeColumns: ColumnDef<TestPractice>[] = [
		{
			accessorKey: "active",
			header: "Active",
			cell: ({ row }) => {
				const item = row.original as TestPractice & {
					id: string;
					status: string;
				};
				const checked = item.status === "Active";
				return (
					<div className="flex items-center gap-2">
						<Switch
							checked={checked}
							aria-label={`Toggle active ${item.id}`}
							onCheckedChange={(val: boolean) =>
								handleToggleStatus(item.id, val ? "PUBLISHED" : "DRAFT")
							}
							disabled={togglingId !== null && togglingId !== item.id}
						/>
						{togglingId === item.id && (
							<Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("id")}</div>
			),
		},
		{
			accessorKey: "testName",
			header: "Test Name",
			cell: ({ row }) => (
				<div className="max-w-[300px] truncate font-medium">
					{row.getValue("testName")}
				</div>
			),
		},
		{
			accessorKey: "subject",
			header: "Subject",
			cell: ({ row }) => <div>{row.getValue("subject")}</div>,
		},
		{
			accessorKey: "questionCount",
			header: "Questions",
			cell: ({ row }) => (
				<div className="text-center">{row.getValue("questionCount")}</div>
			),
		},
		{
			accessorKey: "duration",
			header: "Duration (min)",
			cell: ({ row }) => (
				<div className="text-center">{row.getValue("duration")}</div>
			),
		},
		{
			accessorKey: "difficulty",
			header: "Difficulty",
			cell: ({ row }) => {
				const difficulty = row.getValue("difficulty") as string;
				return (
					<Badge
						variant={
							difficulty === "Easy"
								? "default"
								: difficulty === "Medium"
									? "secondary"
									: "destructive"
						}
					>
						{difficulty}
					</Badge>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				return (
					<Badge
						variant={
							status === "Active"
								? "default"
								: status === "Draft"
									? "secondary"
									: "outline"
						}
					>
						{status}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Created",
			cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const test = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem asChild>
								<Link
									to={
										`/dashboard/question-bank/practice-test/${test.id}` as "/"
									}
								>
									<Eye className="mr-2 h-4 w-4" />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									to={
										`/dashboard/question-bank/practice-test/edit-practice/${test.id}` as "/"
									}
								>
									<Pencil className="mr-2 h-4 w-4" />
									Edit Test
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => handleArchive(test.id)}
								className="text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Archive Test
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const testPracticeCreate = () => {
		return (
			<Button
				asChild
				className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md"
			>
				<Link to="/dashboard/question-bank/practice-test/create-practice">
					Create Practice
				</Link>
			</Button>
		);
	};
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Practice Tests</h1>
					<p className="text-muted-foreground mt-1">
						Manage and organize practice tests and full-length practice exams
					</p>
				</div>
			</div>

			<div>
				<div className="flex items-center justify-between mb-4">
					<div />
					<div className="w-full max-w-xs">
						<Input
							placeholder="Search by test name..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>

				<DataTable
					data={testPracticeData}
					columns={testPracticeColumns}
					searchKey="testName"
					searchPlaceholder="Search by test name..."
					searchValue={search}
					onSearch={setSearch}
					title="Test Practice"
					Component={testPracticeCreate}
					isLoading={testsLoading}
					manualPagination
					pageIndex={page - 1}
					pageCount={testsRes?.pagination?.totalPages || 0}
					onPaginationChange={(paginationState) => {
						const state =
							typeof paginationState === "function"
								? paginationState({ pageIndex: page - 1, pageSize: limit })
								: paginationState;

						const { pageIndex: newPageIndex, pageSize: newPageSize } =
							state as any;

						if (newPageSize !== limit) {
							setLimit(newPageSize);
							setPage(1);
						} else {
							setPage(newPageIndex + 1);
						}
					}}
					hasNext={testsRes?.pagination?.hasNext || false}
					hasPrev={testsRes?.pagination?.hasPrev || false}
					total={testsRes?.pagination?.total || 0}
					pageSize={limit}
				/>
			</div>
		</div>
	);
}
