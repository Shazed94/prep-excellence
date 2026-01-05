import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, FileText, Pencil, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetGradingStats } from "@/hooks/grading-system";

export const Route = createFileRoute("/dashboard/student-test-attempts/")({
	component: RouteComponent,
});

// Types matching API response
interface ApiAttemptResponse {
	id: string;
	createdAt: string;
	updatedAt: string;
	studentId: string;
	satPracticeId: string;
	status: "IN_PROGRESS" | "COMPLETED" | "SUBMITTED" | "GRADED";
	startedAt: string;
	completedAt: string | null;
	submittedAt: string | null;
	totalScore: number | null;
	maxScore: number;
	percentageScore: number | null;
	totalTimeSpent: number | null;
	student: {
		id: string;
		guardianPhone: string | null;
		guardianName: string | null;
		guardianEmail: string | null;
		user: {
			id: string;
			name: string;
			email: string;
		};
	};
	satPractice: {
		id: string;
		name: string;
	};
	answers: Array<{
		id: string;
		textAnswer: string | null;
		isCorrect: boolean | null;
		pointsEarned: number | null;
		timeSpent: number;
		flaggedForReview: boolean;
		question: {
			id: string;
			content: string;
			points: number;
			difficulty: string;
			optionType: string;
			options?: Array<{
				id: string;
				content: string;
				isCorrect: boolean;
			}>;
		};
	}>;
}

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

function RouteComponent() {
	const [searchValue, setSearchValue] = useState("");
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [search] = useState("");

	const { data: gradingStats, isLoading: isGradingStatsLoading } =
		useGetGradingStats({
			page,
			limit,
			search,
		});

	// Map API response to StudentAttempt format with type safety and optional chaining
	const attempts: StudentAttempt[] = useMemo(() => {
		const apiData = gradingStats?.data as ApiAttemptResponse[] | undefined;

		if (!apiData) return [];

		return apiData.map((attempt) => {
			// Calculate answered questions (questions with answers)
			const answeredQuestions =
				attempt.answers?.filter(
					(ans) => ans.isCorrect !== null || ans.textAnswer !== null,
				).length ?? 0;

			// Calculate total time spent from answers if totalTimeSpent is null
			const timeSpent =
				attempt.totalTimeSpent ??
				attempt.answers?.reduce((sum, ans) => sum + (ans.timeSpent ?? 0), 0) ??
				0;

			// Get subject from first question's data (you might want to add subject to satPractice in backend)
			const subject = attempt.answers?.[0]?.question?.optionType ?? "General";

			return {
				id: attempt.id,
				studentName: attempt.student?.user?.name ?? "Unknown Student",
				studentEmail: attempt.student?.user?.email ?? "N/A",
				testName: attempt.satPractice?.name ?? "Unnamed Test",
				subject: subject,
				status: attempt.status,
				totalQuestions: attempt.answers?.length ?? 0,
				answeredQuestions: answeredQuestions,
				score: attempt.totalScore,
				maxScore: attempt.maxScore ?? 0,
				startedAt: attempt.startedAt,
				completedAt: attempt.completedAt,
				timeSpent: timeSpent,
			};
		});
	}, [gradingStats?.data]);

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

		const variantData = variants[status];
		if (!variantData) return null;

		const { variant, icon } = variantData;
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
					<div className="font-medium">
						{row.original?.studentName ?? "N/A"}
					</div>
					<div className="text-sm text-muted-foreground">
						{row.original?.studentEmail ?? "N/A"}
					</div>
				</div>
			),
		},
		{
			accessorKey: "testName",
			header: "Test Name",
			cell: ({ row }) => (
				<div className="max-w-[250px]">
					<div className="font-medium truncate">
						{row.original?.testName ?? "N/A"}
					</div>
					<div className="text-sm text-muted-foreground">
						{row.original?.subject ?? "N/A"}
					</div>
				</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => getStatusBadge(row.original?.status ?? "IN_PROGRESS"),
		},
		{
			accessorKey: "progress",
			header: "Progress",
			cell: ({ row }) => {
				const answeredQuestions = row.original?.answeredQuestions ?? 0;
				const totalQuestions = row.original?.totalQuestions ?? 0;
				const percentage =
					totalQuestions > 0
						? Math.round((answeredQuestions / totalQuestions) * 100)
						: 0;
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
				const score = row.original?.score;
				const maxScore = row.original?.maxScore ?? 0;
				if (score === null || score === undefined) {
					return <span className="text-muted-foreground">Not graded</span>;
				}
				const percentage =
					maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
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
			cell: ({ row }) => {
				const timeSpent = row.original?.timeSpent ?? 0;
				return (
					<div className="flex items-center gap-1">
						<Clock className="w-4 h-4 text-muted-foreground" />
						<span>{formatTime(timeSpent)}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "startedAt",
			header: "Started At",
			cell: ({ row }) => {
				const startedAt = row.original?.startedAt;
				return (
					<div className="text-sm">
						{startedAt ? formatDate(startedAt) : "N/A"}
					</div>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const attemptId = row.original?.id;
				if (!attemptId) return null;

				// Find the full API response data for this attempt
				const apiData = gradingStats?.data as ApiAttemptResponse[] | undefined;
				const attemptData = apiData?.find((a) => a.id === attemptId);

				return (
					<Link
						to="/dashboard/student-test-attempts/$attemptId"
						params={{ attemptId }}
						state={{ attemptData } as any}
					>
						<Button variant="outline" size="sm">
							<TrendingUp className="w-4 h-4 mr-2" />
							Grade Test
						</Button>
					</Link>
				);
			},
		},
	];

	// Show loading state
	if (isGradingStatsLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="mt-4 text-muted-foreground">Loading test attempts...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="">
			<DataTable
				columns={columns}
				data={attempts}
				title="Student Test Attempts"
				searchKey="studentName"
				searchPlaceholder="Search by student name..."
				isLoading={isGradingStatsLoading}
				manualPagination
				pageCount={gradingStats?.pagination?.totalPages}
				pageIndex={page}
				pageSize={limit}
				onPaginationChange={(paginationState) => {
					const state =
						typeof paginationState === "function"
							? paginationState({ pageIndex: page, pageSize: limit })
							: paginationState;

					const { pageIndex: newPageIndex, pageSize: newPageSize } = state;

					if (newPageSize !== limit) {
						setLimit(newPageSize);
						setPage(1);
					} else {
						setPage(newPageIndex);
					}
				}}
				fileName="student-test-attempts"
				searchValue={searchValue}
				onSearch={setSearchValue}
			/>
		</div>
	);
}
