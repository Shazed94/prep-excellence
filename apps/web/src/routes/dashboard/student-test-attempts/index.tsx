import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, FileText, Pencil, TrendingUp } from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetGradingStats } from "@/hooks/grading-system";

export const Route = createFileRoute("/dashboard/student-test-attempts/")({
	component: RouteComponent,
});

// Types
interface StudentAttempt {
	id: string;
	studentName: string;
	studentEmail: string;
	testName: string;
	subject: string;
	status: "IN_PROGRESS" | "COMPLETED" | "SUBMITTED" | "GRADED";
	totalQuestions: number;
	answeredQuestions: number;
	score: number | null;
	maxScore: number;
	startedAt: string;
	completedAt: string | null;
	timeSpent: number;
}

// Dummy Data
const DUMMY_ATTEMPTS: StudentAttempt[] = [
	{
		id: "att_001",
		studentName: "Alice Johnson",
		studentEmail: "alice.johnson@example.com",
		testName: "SAT Math Practice Test - Full Length",
		subject: "Mathematics",
		status: "SUBMITTED",
		totalQuestions: 44,
		answeredQuestions: 44,
		score: null,
		maxScore: 44,
		startedAt: "2026-01-03T09:00:00Z",
		completedAt: "2026-01-03T10:45:00Z",
		timeSpent: 6300,
	},
	{
		id: "att_002",
		studentName: "Bob Smith",
		studentEmail: "bob.smith@example.com",
		testName: "SAT Reading Practice Test",
		subject: "Reading & Writing",
		status: "GRADED",
		totalQuestions: 27,
		answeredQuestions: 27,
		score: 23,
		maxScore: 27,
		startedAt: "2026-01-02T14:00:00Z",
		completedAt: "2026-01-02T14:55:00Z",
		timeSpent: 3300,
	},
	{
		id: "att_003",
		studentName: "Carol Davis",
		studentEmail: "carol.davis@example.com",
		testName: "SAT Math Practice Test - Module 1",
		subject: "Mathematics",
		status: "SUBMITTED",
		totalQuestions: 22,
		answeredQuestions: 20,
		score: null,
		maxScore: 22,
		startedAt: "2026-01-04T10:30:00Z",
		completedAt: "2026-01-04T11:05:00Z",
		timeSpent: 2100,
	},
	{
		id: "att_004",
		studentName: "David Lee",
		studentEmail: "david.lee@example.com",
		testName: "SAT Reading Practice Test - Advanced",
		subject: "Reading & Writing",
		status: "IN_PROGRESS",
		totalQuestions: 33,
		answeredQuestions: 18,
		score: null,
		maxScore: 33,
		startedAt: "2026-01-04T13:15:00Z",
		completedAt: null,
		timeSpent: 1800,
	},
	{
		id: "att_005",
		studentName: "Emma Wilson",
		studentEmail: "emma.wilson@example.com",
		testName: "SAT Full Length Practice - Digital",
		subject: "Full Test",
		status: "GRADED",
		totalQuestions: 98,
		answeredQuestions: 98,
		score: 89,
		maxScore: 98,
		startedAt: "2026-01-01T08:00:00Z",
		completedAt: "2026-01-01T11:14:00Z",
		timeSpent: 11640,
	},
];

function RouteComponent() {
	const [searchValue, setSearchValue] = React.useState("");

	const { data: gradingStats, isLoading: isGradingStatsLoading } =
		useGetGradingStats();

	console.log(gradingStats, isGradingStatsLoading);

	// Format time from seconds to readable format
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m ${secs}s`;
	};

	// Format date to readable format
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Get status badge variant
	const getStatusBadge = (status: StudentAttempt["status"]) => {
		const variants: Record<
			StudentAttempt["status"],
			{ variant: string; icon: React.ReactNode }
		> = {
			IN_PROGRESS: {
				variant: "bg-blue-100 text-blue-800 hover:bg-blue-100",
				icon: <Clock className="w-3 h-3 mr-1" />,
			},
			COMPLETED: {
				variant: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
				icon: <FileText className="w-3 h-3 mr-1" />,
			},
			SUBMITTED: {
				variant: "bg-purple-100 text-purple-800 hover:bg-purple-100",
				icon: <Pencil className="w-3 h-3 mr-1" />,
			},
			GRADED: {
				variant: "bg-green-100 text-green-800 hover:bg-green-100",
				icon: <CheckCircle className="w-3 h-3 mr-1" />,
			},
		};

		const { variant, icon } = variants[status];
		return (
			<Badge className={variant}>
				{icon}
				{status.replace("_", " ")}
			</Badge>
		);
	};

	// DataTable columns
	const columns: ColumnDef<StudentAttempt>[] = [
		{
			accessorKey: "studentName",
			header: "Student Name",
			cell: ({ row }) => (
				<div>
					<div className="font-medium">{row.original.studentName}</div>
					<div className="text-sm text-muted-foreground">
						{row.original.studentEmail}
					</div>
				</div>
			),
		},
		{
			accessorKey: "testName",
			header: "Test Name",
			cell: ({ row }) => (
				<div className="max-w-[250px]">
					<div className="font-medium truncate">{row.original.testName}</div>
					<div className="text-sm text-muted-foreground">
						{row.original.subject}
					</div>
				</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => getStatusBadge(row.original.status),
		},
		{
			accessorKey: "progress",
			header: "Progress",
			cell: ({ row }) => {
				const { answeredQuestions, totalQuestions } = row.original;
				const percentage = Math.round(
					(answeredQuestions / totalQuestions) * 100,
				);
				return (
					<div>
						<div className="text-sm font-medium">
							{answeredQuestions}/{totalQuestions}
						</div>
						<div className="text-xs text-muted-foreground">{percentage}%</div>
					</div>
				);
			},
		},
		{
			accessorKey: "score",
			header: "Score",
			cell: ({ row }) => {
				const { score, maxScore } = row.original;
				if (score === null) {
					return <span className="text-muted-foreground">Not graded</span>;
				}
				const percentage = Math.round((score / maxScore) * 100);
				return (
					<div>
						<div className="text-sm font-medium">
							{score}/{maxScore}
						</div>
						<div className="text-xs text-muted-foreground">{percentage}%</div>
					</div>
				);
			},
		},
		{
			accessorKey: "timeSpent",
			header: "Time Spent",
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<Clock className="w-4 h-4 text-muted-foreground" />
					<span>{formatTime(row.original.timeSpent)}</span>
				</div>
			),
		},
		{
			accessorKey: "startedAt",
			header: "Started At",
			cell: ({ row }) => (
				<div className="text-sm">{formatDate(row.original.startedAt)}</div>
			),
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<Link
					to="/dashboard/student-test-attempts/$attemptId"
					params={{ attemptId: row.original.id }}
				>
					<Button variant="outline" size="sm">
						<TrendingUp className="w-4 h-4 mr-2" />
						Grade Test
					</Button>
				</Link>
			),
		},
	];

	return (
		<div className="">
			<DataTable
				columns={columns}
				data={DUMMY_ATTEMPTS}
				title="Student Test Attempts"
				searchKey="studentName"
				searchPlaceholder="Search by student name..."
				enableExport={true}
				enablePagination={true}
				pageSize={10}
				fileName="student-test-attempts"
				searchValue={searchValue}
				onSearch={setSearchValue}
			/>
		</div>
	);
}
