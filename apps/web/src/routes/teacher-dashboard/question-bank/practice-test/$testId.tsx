import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSATPracticeTestById } from "@/hooks/sat-practice";

export const Route = createFileRoute(
	"/teacher-dashboard/question-bank/practice-test/$testId",
)({
	component: RouteComponent,
});

function Option({ option }: { option: any }) {
	return (
		<div className="flex items-start gap-3 py-2">
			<div className="w-6 flex-shrink-0">
				{option.isCorrect ? (
					<span className="inline-block w-4 h-4 rounded-full bg-emerald-600" />
				) : (
					<span className="inline-block w-4 h-4 rounded-full border bg-transparent" />
				)}
			</div>
			<div
				className="prose max-w-none text-sm"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Question content from database
				dangerouslySetInnerHTML={{ __html: option.content }}
			/>
		</div>
	);
}

function QuestionCard({ q }: { q: any }) {
	return (
		<Card className="mb-4">
			<CardHeader>
				<CardTitle className="text-sm font-medium">Question</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="prose max-w-none mb-3"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Question content from database
					dangerouslySetInnerHTML={{ __html: q.content }}
				/>
				{q.options && q.options.length > 0 && (
					<div className="space-y-2">
						{q.options.map((opt: any) => (
							<Option key={opt.id} option={opt} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function RouteComponent() {
	const { testId } = Route.useParams();
	const { data, isLoading, isError } = useGetSATPracticeTestById(testId);

	if (isLoading) {
		return (
			<div className="py-8 text-center">
				<Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
				<p className="mt-3 text-sm text-muted-foreground">Loading test...</p>
			</div>
		);
	}

	if (isError || !data?.data) {
		return (
			<div className="py-8 text-center text-sm text-muted-foreground">
				Test not found or failed to load.
			</div>
		);
	}

	const test = data.data;

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-bold">{test.name}</h1>
				<div className="flex items-center gap-2 mt-2">
					<Badge variant="outline">{test.testType?.name || "—"}</Badge>
					<Badge variant="secondary">{test.subject?.name || "—"}</Badge>
					<Badge>{test.difficulty?.name || "—"}</Badge>
					<Badge
						variant={test.status === "PUBLISHED" ? "default" : "secondary"}
					>
						{test.status}
					</Badge>
				</div>
			</div>

			{(test.section || test.sections || []).map(
				(section: any, sIdx: number) => (
					<div key={section.id}>
						<h2 className="text-lg font-semibold mt-4 mb-2">
							{sIdx + 1}. {section.name || `Section ${sIdx + 1}`}
						</h2>
						<div className="space-y-4">
							{(section.modules || []).map((module: any, mIdx: number) => (
								<div key={module.id} className="mb-4">
									<h3 className="text-sm font-medium mb-2">
										Module {mIdx + 1}: {module.name || "Module"}
									</h3>
									{module.questionsSetOne &&
										module.questionsSetOne.length > 0 && (
											<div className="mb-3">
												<h4 className="text-xs font-semibold mb-2">
													Questions Set 1
												</h4>
												{module.questionsSetOne.map((q: any) => (
													<QuestionCard key={q.id} q={q} />
												))}
											</div>
										)}
									{module.questionsSetTwo &&
										module.questionsSetTwo.length > 0 && (
											<div className="mb-3">
												<h4 className="text-xs font-semibold mb-2">
													Questions Set 2
												</h4>
												{module.questionsSetTwo.map((q: any) => (
													<QuestionCard key={q.id} q={q} />
												))}
											</div>
										)}
								</div>
							))}
						</div>
					</div>
				),
			)}
		</div>
	);
}
