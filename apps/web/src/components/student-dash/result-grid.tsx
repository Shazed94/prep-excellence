"use client";

import type { SATResult } from "@/routes/dashboard/students-dashboard/result";
import { ResultCard } from "./result-card";

interface Props {
	results: SATResult[];
	onSelectResult: (result: SATResult) => void;
}

export function ResultsGrid({ results, onSelectResult }: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{results.map((result) => (
				<ResultCard
					key={result.id}
					result={result}
					onClick={() => onSelectResult(result)}
				/>
			))}
		</div>
	);
}
