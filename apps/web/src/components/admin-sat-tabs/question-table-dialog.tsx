import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Question = {
	id: string;
	text: string;
	difficulty: string;
	domain: string;
	skill: string;
};

interface QuestionTableDialogProps {
	sectionIdx: number;
	moduleIdx: number;
	form: any;
	questions: Question[];
	questionSet: 1 | 2;
	isLoading?: boolean;
}

export function QuestionTableDialog({
	sectionIdx,
	moduleIdx,
	form,
	questions,
	questionSet,
	isLoading = false,
}: QuestionTableDialogProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
		skill: true,
		domain: true,
		difficulty: true,
	});

	const fieldName = questionSet === 1 ? "questionSet1" : "questionSet2";
	const savedQuestions =
		form.watch(`sections.${sectionIdx}.modules.${moduleIdx}.${fieldName}`) ||
		[];

	const handleDialogOpen = () => {
		setSelectedQuestions([...savedQuestions]);
		setSearchValue("");
		setIsDialogOpen(true);
	};

	const handleSave = () => {
		form.setValue(
			`sections.${sectionIdx}.modules.${moduleIdx}.${fieldName}`,
			selectedQuestions,
		);
		setIsDialogOpen(false);
	};

	// Filter questions based on search
	const filteredQuestions = useMemo(() => {
		return questions.filter(
			(question) =>
				question.text.toLowerCase().includes(searchValue.toLowerCase()) ||
				question.skill.toLowerCase().includes(searchValue.toLowerCase()) ||
				question.domain.toLowerCase().includes(searchValue.toLowerCase()),
		);
	}, [searchValue, questions]);

	const columns: ColumnDef<Question>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "text",
			header: "Question",

			cell: ({ row }) => {
				const text = row.original.text;
				const stripped = text?.replace(/<[^>]*>/g, "");

				return (
					<div className="max-w-[400px] truncate" title={stripped}>
						{stripped}
					</div>
				);
			},
		},
		{
			accessorKey: "difficulty",
			header: "Difficulty",
			cell: ({ row }) => {
				const difficulty = row.getValue("difficulty") as string;
				const isEasy = difficulty === "easy";
				return (
					<Badge
						variant="outline"
						className={`text-xs ${
							isEasy
								? "bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
								: "bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300"
						}`}
					>
						{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
					</Badge>
				);
			},
		},
		{
			accessorKey: "domain",
			header: "Domain",
			cell: ({ row }) => (
				<Badge variant="outline" className="text-xs">
					{row.getValue("domain")}
				</Badge>
			),
		},
		{
			accessorKey: "skill",
			header: "Skill",
			cell: ({ row }) => (
				<Badge variant="outline" className="text-xs">
					{row.getValue("skill")}
				</Badge>
			),
		},
	];

	const table = useReactTable({
		data: filteredQuestions,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getRowId: (row) => row.id,
		state: {
			rowSelection: filteredQuestions.reduce(
				(acc, question) => {
					acc[question.id] = selectedQuestions.includes(question.id);
					return acc;
				},
				{} as Record<string, boolean>,
			),

			columnVisibility,
		},
		enableRowSelection: true,
		onRowSelectionChange: (updater) => {
			const currentRowSelection = filteredQuestions.reduce(
				(acc, question) => {
					acc[question.id] = selectedQuestions.includes(question.id);
					return acc;
				},
				{} as Record<string, boolean>,
			);

			const newSelection =
				typeof updater === "function" ? updater(currentRowSelection) : updater;

			// Get selected IDs from filtered questions
			const selectedFromFiltered = filteredQuestions
				.filter((q) => newSelection[q.id])
				.map((q) => q.id);

			// Keep previously selected questions that are not in filtered list
			const keptFromPrevious = selectedQuestions.filter(
				(id) => !filteredQuestions.find((q) => q.id === id),
			);

			setSelectedQuestions([...selectedFromFiltered, ...keptFromPrevious]);
		},
		onColumnVisibilityChange: setColumnVisibility,
	});

	const totalSelected = selectedQuestions.length;

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="outline"
					onClick={handleDialogOpen}
					className="w-full h-9"
				>
					<Plus className="w-4 h-4 mr-2" />
					Question Set {questionSet} ({savedQuestions.length})
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-7xl! max-h-[85vh] flex flex-col">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Select Questions - Set {questionSet}
					</DialogTitle>
					<DialogDescription>
						Search, filter, and select questions from the table below
					</DialogDescription>
				</DialogHeader>

				{/* Search Bar */}
				<div className="flex items-center gap-2 px-1">
					<Search className="w-4 h-4 text-muted-foreground" />
					<Input
						placeholder="Search by question text, skill, or domain..."
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="h-9 border-2 border-border rounded-lg text-sm"
					/>
					{searchValue && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => setSearchValue("")}
							className="h-9 w-9"
						>
							<X className="w-4 h-4" />
						</Button>
					)}
				</div>

				{/* Column Visibility Toggles */}
				<div className="flex items-center gap-2 flex-wrap px-1">
					<span className="text-xs font-semibold text-muted-foreground">
						Columns:
					</span>
					{["skill", "domain", "difficulty"].map((column) => (
						<Button
							key={column}
							type="button"
							variant={columnVisibility[column] ? "default" : "outline"}
							size="sm"
							onClick={() =>
								setColumnVisibility((prev) => ({
									...prev,
									[column]: !prev[column],
								}))
							}
							className="h-8 text-xs rounded-lg"
						>
							{column.charAt(0).toUpperCase() + column.slice(1)}
						</Button>
					))}
				</div>

				{/* Table */}
				<div className="flex-1 overflow-auto border rounded-lg">
					<Table>
						<TableHeader className="sticky top-0 bg-muted/10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="h-10 px-2 text-xs">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-muted-foreground"
									>
										Loading questions...
									</TableCell>
								</TableRow>
							) : table.getRowModel().rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center text-muted-foreground"
									>
										{questions.length === 0
											? "Please select a test type and subject to load questions"
											: "No questions found"}
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="hover:bg-muted/5 cursor-pointer"
										onClick={() => row.toggleSelected(!row.getIsSelected())}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="h-12 px-2 text-xs">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setIsDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button type="button" onClick={handleSave}>
						Save Selection ({totalSelected})
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
