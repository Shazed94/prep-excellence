"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ResultDetail } from "@/components/student-dash/result-detail";
import { ResultsGrid } from "@/components/student-dash/result-grid";

/* ------------------ TYPES ------------------ */
export interface SATResult {
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

/* ------------------ MOCK DATA ------------------ */
const mockResults: SATResult[] = [
	{
		id: "1",
		testName: "Practice Test 1",
		date: "2024-12-15",
		totalScore: 1340,
		evidenceReading: 680,
		math: 660,
		percentile: 82,
		attempts: 1,
		status: "completed",
	},
	{
		id: "2",
		testName: "Practice Test 2",
		date: "2024-12-22",
		totalScore: 1380,
		evidenceReading: 710,
		math: 670,
		percentile: 88,
		attempts: 2,
		status: "completed",
	},
	{
		id: "3",
		testName: "Practice Test 3",
		date: "2025-01-05",
		totalScore: 1420,
		evidenceReading: 730,
		math: 690,
		percentile: 92,
		attempts: 1,
		status: "completed",
	},
	{
		id: "4",
		testName: "Mock Test (Full-Length)",
		date: "2025-01-10",
		totalScore: 0,
		evidenceReading: 0,
		math: 0,
		percentile: 0,
		attempts: 0,
		status: "pending",
	},
];

/* ------------------ ROUTE ------------------ */
export const Route = createFileRoute("/dashboard/students-dashboard/result/")({
	component: DashboardResultPage,
});

function DashboardResultPage() {
	const [selectedResult, setSelectedResult] = useState<SATResult | null>(null);

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
			<main className="container mx-auto px-4 py-2">
				<div className="mb-6">
					<h1 className="text-2xl font-bold text-foreground mb-2">
						SAT Results Dashboard
					</h1>
					<p className="text-muted-foreground">
						Track your practice test performance and progress
					</p>
				</div>

				{selectedResult ? (
					<ResultDetail
						result={selectedResult}
						onBack={() => setSelectedResult(null)}
					/>
				) : (
					<ResultsGrid
						results={mockResults}
						onSelectResult={setSelectedResult}
					/>
				)}
			</main>
		</div>
	);
}
