"use client";

import { format } from "date-fns";
import { ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SATResult } from "@/routes/dashboard/students-dashboard/result";

interface Props {
	result: SATResult;
	onClick: () => void;
}

export function ResultCard({ result, onClick }: Props) {
	return (
		<Card
			onClick={onClick}
			className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
		>
			<CardHeader className="flex flex-row justify-between">
				<div>
					<h3 className="font-semibold">{result.testName}</h3>
					<p className="text-xs text-muted-foreground">
						{format(new Date(result.date), "MMM dd, yyyy")}
					</p>
				</div>
				<Badge>{result.status}</Badge>
			</CardHeader>

			<CardContent>
				{result.status === "completed" ? (
					<>
						<p className="text-3xl font-bold text-primary">
							{result.totalScore}
						</p>
						<div className="flex items-center justify-between text-sm mt-2">
							<span>{result.percentile}%ile</span>
							<ChevronRight className="w-4 h-4" />
						</div>
					</>
				) : (
					<p className="text-sm text-muted-foreground text-center py-6">
						Not started yet
					</p>
				)}
			</CardContent>
		</Card>
	);
}
