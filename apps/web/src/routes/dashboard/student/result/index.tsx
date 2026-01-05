"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { SATResult } from "@/components/student-dash/result-card";
import {
	type AttemptStatus,
	ResultDetail,
} from "@/components/student-dash/result-detail";
import { ResultsGrid } from "@/components/student-dash/result-grid";
import { useGetMyAttempts, useGetMyAttemptsAnswers } from "@/hooks/sat-attempt";

export const Route = createFileRoute("/dashboard/student/result/")({
	component: DashboardResultPage,
});

function DashboardResultPage() {
	const studentId = "me"; // from auth store later
	const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
		null,
	);

	/* ---------------- LIST API ---------------- */
	const { data, isLoading, isError } = useGetMyAttempts(studentId);

	/* ---------------- DETAIL API ---------------- */
	const { data: _detailData, isLoading: isDetailLoading } =
		useGetMyAttemptsAnswers(selectedAttemptId ?? undefined);

	/* ---------------- MAP LIST DATA ---------------- */

	const results: SATResult[] =
		data?.data?.map((item: any) => ({
			id: item.id,
			testName: item.satPractice?.name ?? "SAT Practice",
			date: item.createdAt,
			totalScore: item.totalScore ?? 0,
			percentile: item.percentageScore ?? 0,
			status: item.status as AttemptStatus, // 👈 enum-safe
		})) ?? [];

	/* ---------------- SELECTED RESULT META ---------------- */
	const selectedResult = selectedAttemptId
		? (results.find((r) => r.id === selectedAttemptId) ?? null)
		: null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
			<main className="container mx-auto px-4 py-4">
				{/* Header */}
				<div className="mb-6">
					<h1 className="text-2xl font-bold">SAT Results</h1>
					<p className="text-muted-foreground">
						Track your SAT practice performance
					</p>
				</div>

				{/* States */}
				{isLoading && <p className="text-muted-foreground">Loading results…</p>}

				{isError && <p className="text-destructive">Failed to load results</p>}

				{/* Detail View */}
				{selectedAttemptId && selectedResult ? (
					<>
						<ResultDetail
							attemptId={selectedAttemptId}
							meta={{
								testName: selectedResult.testName,
								date: selectedResult.date,
								status: selectedResult.status, // ✅ enum passed through
							}}
							onBack={() => setSelectedAttemptId(null)}
						/>

						{isDetailLoading && (
							<p className="mt-4 text-muted-foreground">
								Loading attempt details…
							</p>
						)}
					</>
				) : (
					!isLoading && (
						<ResultsGrid
							results={results}
							onSelectResult={(r) => setSelectedAttemptId(r.id)}
						/>
					)
				)}
			</main>
		</div>
	);
}
