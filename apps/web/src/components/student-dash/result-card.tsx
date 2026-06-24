export interface SATResult {
	id: string;
	testName: string;
	date: string;
	totalScore: number;
	percentile: number;
	status: AttemptStatus;
}
("use client");

import { format } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AttemptStatus } from "./result-detail";

interface Props {
	result: SATResult;
	onClick: () => void;
}

const STATUS_CONFIG: Record<
	AttemptStatus,
	{ label: string; className: string }
> = {
	[AttemptStatus.NOT_STARTED]: {
		label: "Not Started",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	[AttemptStatus.IN_PROGRESS]: {
		label: "In Progress",
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
	[AttemptStatus.PAUSED]: {
		label: "Paused",
		className: "bg-yellow-50 text-yellow-700 border-yellow-200",
	},
	[AttemptStatus.COMPLETED]: {
		label: "Completed",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	[AttemptStatus.SUBMITTED]: {
		label: "Submitted",
		className: "bg-purple-50 text-purple-700 border-purple-200",
	},
	[AttemptStatus.GRADED]: {
		label: "Graded",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
};

export function ResultCard({ result, onClick }: Props) {
	const statusConfig =
		STATUS_CONFIG[result.status as AttemptStatus] ||
		STATUS_CONFIG[AttemptStatus.NOT_STARTED];

	const isCompleted =
		result.status === AttemptStatus.COMPLETED ||
		result.status === AttemptStatus.GRADED ||
		result.status === AttemptStatus.SUBMITTED;

	return (
		<Card
			onClick={() => {
				if (result.status !== AttemptStatus.IN_PROGRESS) {
					onClick();
				}
			}}
			className="cursor-pointer disabled:cursor-not-allowed transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50"
		>
			<CardHeader className="flex flex-row justify-between items-start pb-3">
				<div className="space-y-1">
					<h3 className="font-semibold text-lg">{result.testName}</h3>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Clock className="w-3 h-3" />
						{format(new Date(result.date), "MMM dd, yyyy")}
					</div>
				</div>
				<Badge className={statusConfig.className}>{statusConfig.label}</Badge>
			</CardHeader>

			<CardContent className="pt-0">
				{isCompleted ? (
					<>
						<div className="mb-4">
							<p className="text-4xl font-bold text-primary">
								{result.totalScore}
							</p>
							<p className="text-sm text-muted-foreground">Total Score</p>
						</div>

						<div className="flex items-center justify-between text-sm pt-3 border-t">
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground">Percentage:</span>
								<span className="font-semibold text-emerald-600">
									{result.percentile.toFixed(1)}%
								</span>
							</div>
							<ChevronRight className="w-4 h-4 text-muted-foreground" />
						</div>
					</>
				) : (
					<div className="py-8 text-center">
						<p className="text-sm text-muted-foreground">
							{result.status === AttemptStatus.IN_PROGRESS
								? "Test in progress..."
								: "Not started yet"}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
