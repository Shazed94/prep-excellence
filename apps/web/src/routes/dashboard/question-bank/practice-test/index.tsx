import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

interface FullLongPractice {
	id: string;
	practiceName: string;
	totalQuestions: number;
	totalDuration: number;
	sections: number;
	attemptedBy: number;
	avgScore: number;
	createdAt: string;
	status: "Published" | "Draft";
}

// Sample Data
const testPracticeData: TestPractice[] = [
	{
		id: "TP001",
		testName: "SAT Math Practice - Algebra",
		subject: "Mathematics",
		questionCount: 20,
		duration: 30,
		difficulty: "Medium",
		createdAt: "2024-12-10",
		status: "Active",
	},
	{
		id: "TP002",
		testName: "SAT Reading Comprehension",
		subject: "English",
		questionCount: 15,
		duration: 25,
		difficulty: "Hard",
		createdAt: "2024-12-09",
		status: "Active",
	},
	{
		id: "TP003",
		testName: "SAT Writing & Language",
		subject: "English",
		questionCount: 18,
		duration: 20,
		difficulty: "Easy",
		createdAt: "2024-12-08",
		status: "Draft",
	},
	{
		id: "TP004",
		testName: "SAT Math Practice - Geometry",
		subject: "Mathematics",
		questionCount: 25,
		duration: 35,
		difficulty: "Medium",
		createdAt: "2024-12-07",
		status: "Active",
	},
	{
		id: "TP005",
		testName: "SAT Advanced Calculus",
		subject: "Mathematics",
		questionCount: 30,
		duration: 40,
		difficulty: "Hard",
		createdAt: "2024-12-06",
		status: "Archived",
	},
];

const fullLongPracticeData: FullLongPractice[] = [
	{
		id: "FLP001",
		practiceName: "SAT Full Practice Test 1",
		totalQuestions: 154,
		totalDuration: 180,
		sections: 4,
		attemptedBy: 245,
		avgScore: 82.5,
		createdAt: "2024-12-10",
		status: "Published",
	},
	{
		id: "FLP002",
		practiceName: "SAT Full Practice Test 2",
		totalQuestions: 154,
		totalDuration: 180,
		sections: 4,
		attemptedBy: 198,
		avgScore: 78.3,
		createdAt: "2024-12-08",
		status: "Published",
	},
	{
		id: "FLP003",
		practiceName: "SAT Full Practice Test 3",
		totalQuestions: 154,
		totalDuration: 180,
		sections: 4,
		attemptedBy: 167,
		avgScore: 85.1,
		createdAt: "2024-12-05",
		status: "Draft",
	},
	{
		id: "FLP004",
		practiceName: "SAT Mock Exam - December",
		totalQuestions: 154,
		totalDuration: 180,
		sections: 4,
		attemptedBy: 312,
		avgScore: 79.8,
		createdAt: "2024-12-01",
		status: "Published",
	},
];

function RouteComponent() {
	// Test Practice Columns
	const testPracticeColumns: ColumnDef<TestPractice>[] = [
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
							<DropdownMenuItem onClick={() => console.log("View", test.id)}>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => console.log("Edit", test.id)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Test
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => console.log("Delete", test.id)}
								className="text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Test
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	// Full Long Practice Columns
	const fullLongPracticeColumns: ColumnDef<FullLongPractice>[] = [
		{
			accessorKey: "id",
			header: "ID",
			cell: ({ row }) => (
				<div className="font-medium">{row.getValue("id")}</div>
			),
		},
		{
			accessorKey: "practiceName",
			header: "Practice Name",
			cell: ({ row }) => (
				<div className="max-w-[300px] truncate font-medium">
					{row.getValue("practiceName")}
				</div>
			),
		},
		{
			accessorKey: "sections",
			header: "Sections",
			cell: ({ row }) => (
				<div className="text-center">{row.getValue("sections")}</div>
			),
		},
		{
			accessorKey: "totalQuestions",
			header: "Total Questions",
			cell: ({ row }) => (
				<div className="text-center">{row.getValue("totalQuestions")}</div>
			),
		},
		{
			accessorKey: "totalDuration",
			header: "Duration (min)",
			cell: ({ row }) => (
				<div className="text-center">{row.getValue("totalDuration")}</div>
			),
		},
		{
			accessorKey: "attemptedBy",
			header: "Attempted By",
			cell: ({ row }) => (
				<div className="text-center font-medium">
					{row.getValue("attemptedBy")} students
				</div>
			),
		},
		{
			accessorKey: "avgScore",
			header: "Avg Score",
			cell: ({ row }) => (
				<div className="text-center font-semibold text-primary">
					{row.getValue("avgScore")}%
				</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				return (
					<Badge variant={status === "Published" ? "default" : "secondary"}>
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
				const practice = row.original;

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
							<DropdownMenuItem
								onClick={() => console.log("View", practice.id)}
							>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => console.log("Edit", practice.id)}
							>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Practice
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => console.log("Delete", practice.id)}
								className="text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Practice
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

	const fullLongPracticeCreate = () => {
		return (
			<Button
				asChild
				className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md"
			>
				<Link to="/dashboard/question-bank/practice-test/full-long-practice">
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

			{/* Tabs Section */}
			<Tabs defaultValue="test-practice" className="w-full">
				<TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
					<TabsTrigger value="test-practice" className="text-sm font-medium">
						Test Practice
					</TabsTrigger>
					<TabsTrigger
						value="full-long-practice"
						className="text-sm font-medium"
					>
						Full Long Practice
					</TabsTrigger>
				</TabsList>

				{/* Test Practice Tab */}
				<TabsContent value="test-practice" className="space-y-4">
					<div>
						<DataTable
							data={testPracticeData}
							columns={testPracticeColumns}
							searchKey="testName"
							searchPlaceholder="Search by test name..."
							title="Test Practice"
							Component={testPracticeCreate}
						/>
					</div>
				</TabsContent>

				{/* Full Long Practice Tab */}
				<TabsContent value="full-long-practice" className="space-y-4">
					<div>
						<DataTable
							data={fullLongPracticeData}
							columns={fullLongPracticeColumns}
							searchKey="practiceName"
							searchPlaceholder="Search by practice name..."
							title="Full Long Practice"
							Component={fullLongPracticeCreate}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
