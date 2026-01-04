"use client";

import { format } from "date-fns";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SATResult {
	id: string;
	testName: string;
	date: string;
	totalScore: number;
	evidenceReading: number;
	math: number;
	percentile: number;
	attempts: number;
	status: "completed" | "in-progress" | "pending";
}

interface ResultDetailProps {
	result: SATResult;
	onBack: () => void;
}

export function ResultDetail({ result, onBack }: ResultDetailProps) {
	const getScoreColor = (score: number) => {
		if (score >= 1400) return "text-emerald-600";
		if (score >= 1300) return "text-blue-600";
		return "text-amber-600";
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-emerald-50 text-emerald-700 border-emerald-200";
			case "in-progress":
				return "bg-blue-50 text-blue-700 border-blue-200";
			case "pending":
				return "bg-amber-50 text-amber-700 border-amber-200";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					onClick={onBack}
					className="gap-2 bg-transparent"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Results
				</Button>

				<div className="flex gap-2">
					<Button variant="outline" size="sm" className="gap-2 bg-transparent">
						<Share2 className="w-4 h-4" />
						Share
					</Button>
					<Button variant="outline" size="sm" className="gap-2 bg-transparent">
						<Download className="w-4 h-4" />
						Download
					</Button>
				</div>
			</div>

			{/* Test Info */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>{result.testName}</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								{format(new Date(result.date), "MMMM dd, yyyy")}
							</p>
						</div>
						<Badge className={getStatusColor(result.status)}>
							{result.status === "completed" ? "✓ Completed" : result.status}
						</Badge>
					</div>
				</CardHeader>
			</Card>

			{/* Score Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<p className="text-xs text-muted-foreground mb-2">Total Score</p>
						<p
							className={`text-3xl font-bold ${getScoreColor(result.totalScore)}`}
						>
							{result.totalScore}
						</p>
						<p className="text-xs text-muted-foreground mt-2">out of 1600</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<p className="text-xs text-muted-foreground mb-2">
							Reading & Writing
						</p>
						<p className="text-3xl font-bold text-blue-600">
							{result.evidenceReading}
						</p>
						<p className="text-xs text-muted-foreground mt-2">out of 800</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<p className="text-xs text-muted-foreground mb-2">Math</p>
						<p className="text-3xl font-bold text-blue-600">{result.math}</p>
						<p className="text-xs text-muted-foreground mt-2">out of 800</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<p className="text-xs text-muted-foreground mb-2">Percentile</p>
						<p className="text-3xl font-bold text-emerald-600">
							{result.percentile}%
						</p>
						<p className="text-xs text-muted-foreground mt-2">nationally</p>
					</CardContent>
				</Card>
			</div>

			{/* Performance Analysis */}
			<Card>
				<CardHeader>
					<CardTitle>Performance Analysis</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Reading */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="font-medium">Reading & Writing</span>
							<span className="text-muted-foreground">
								{result.evidenceReading}/800
							</span>
						</div>
						<div className="h-2 rounded-full bg-secondary">
							<div
								className="h-2 rounded-full bg-blue-500"
								style={{ width: `${(result.evidenceReading / 800) * 100}%` }}
							/>
						</div>
					</div>

					{/* Math */}
					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span className="font-medium">Math</span>
							<span className="text-muted-foreground">{result.math}/800</span>
						</div>
						<div className="h-2 rounded-full bg-secondary">
							<div
								className="h-2 rounded-full bg-violet-500"
								style={{ width: `${(result.math / 800) * 100}%` }}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Next Steps */}
			<Card className="border-primary/20 bg-primary/5">
				<CardHeader>
					<CardTitle className="text-primary">Next Steps</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p>✓ Great progress! Focus on strengthening your Math skills.</p>
					<p>• Review incorrect answers and underlying concepts.</p>
					<p>• Practice time management in full-length tests.</p>
				</CardContent>
			</Card>
		</div>
	);
}
