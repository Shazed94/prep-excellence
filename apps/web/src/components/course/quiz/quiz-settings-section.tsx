// components/course/quiz/quiz-settings-section.tsx

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { QuizWithQuestionsState } from "@/hooks/lms-quiz";

interface QuizSettingsSectionProps {
	formData: QuizWithQuestionsState;
	onUpdate: (field: string, value: any) => void;
}

export function QuizSettingsSection({
	formData,
	onUpdate,
}: QuizSettingsSectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Quiz Settings</CardTitle>
				<CardDescription>
					Configure the basic settings for your quiz
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor="title">Quiz Title *</Label>
						<Input
							placeholder="Enter quiz title"
							value={formData.title}
							onChange={(e) => onUpdate("title", e.target.value)}
							className="mt-1"
						/>
					</div>

					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							placeholder="Brief description of the quiz..."
							value={formData.description}
							onChange={(e) => onUpdate("description", e.target.value)}
							className="min-h-20 mt-1"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
					<div>
						<Label htmlFor="orderIndex">Order Index</Label>
						<Input
							type="number"
							min={0}
							placeholder="0"
							value={formData.orderIndex}
							onChange={(e) =>
								onUpdate("orderIndex", parseInt(e.target.value, 10) || 0)
							}
							className="mt-1"
						/>
						<p className="text-xs text-slate-500 mt-1">
							Determines the order within the lesson
						</p>
					</div>
					<div>
						<Label htmlFor="passingScore">Passing Score (%) *</Label>
						<Input
							type="number"
							min={0}
							max={100}
							placeholder="70"
							value={formData.passingScore}
							onChange={(e) =>
								onUpdate("passingScore", parseInt(e.target.value, 10) || 0)
							}
							className="mt-1"
						/>
					</div>

					<div>
						<Label htmlFor="timeLimit">Time Limit (minutes)</Label>
						<Input
							type="number"
							min={1}
							placeholder="Optional"
							value={formData.timeLimit || ""}
							onChange={(e) =>
								onUpdate(
									"timeLimit",
									e.target.value ? parseInt(e.target.value, 10) : undefined,
								)
							}
							className="mt-1"
						/>
					</div>

					<div>
						<Label htmlFor="maxAttempts">Max Attempts</Label>
						<Input
							type="number"
							min={1}
							placeholder="Unlimited"
							value={formData.maxAttempts || ""}
							onChange={(e) =>
								onUpdate(
									"maxAttempts",
									e.target.value ? parseInt(e.target.value, 10) : undefined,
								)
							}
							className="mt-1"
						/>
					</div>
					<div className="flex items-center justify-between rounded-lg border p-2">
						<div className="space-y-0.5">
							<Label className="text-sm">Shuffle Questions</Label>
						</div>
						<Switch
							checked={formData.shuffleQuestions}
							onCheckedChange={(checked) =>
								onUpdate("shuffleQuestions", checked)
							}
						/>
					</div>

					<div className="flex items-center justify-between rounded-lg border p-2">
						<div className="space-y-0.5">
							<Label className="text-sm">Show Results</Label>
						</div>
						<Switch
							checked={formData.showResults}
							onCheckedChange={(checked) => onUpdate("showResults", checked)}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
