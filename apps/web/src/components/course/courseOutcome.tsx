import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LearningOutcomes() {
	const outcomes = [
		"This course provides a complete overview for a product manager in the field of data science and AI",
		"Learn what is the role of a product manager and what is the difference between a product and a project manager",
		"Be able to tell the difference between an algorithm and an AI",
		"Execute business strategy for AI and Data",
		"Learn how to be the bridge between business needs and technically-oriented data and AI personnel",
		"Distinguish between data analysis and data science",
		"Distinguish different types of machine learning",
		"Perform SWOT analysis",
	];

	return (
		<Card className="p-6 mb-8">
			<h2 className="text-2xl font-bold mb-6">{"What you'll learn"}</h2>
			<div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
				{outcomes.map((outcome, index) => (
					<div key={index} className="flex gap-3">
						<Check className="h-5 w-5 text-foreground shrink-0 mt-0.5" />
						<p className="text-sm leading-relaxed">{outcome}</p>
					</div>
				))}
			</div>
		</Card>
	);
}
