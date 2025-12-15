import { createFileRoute } from "@tanstack/react-router";
import { AdminTabs } from "@/components/admin-sat-tabs/sat-tabs";

export const Route = createFileRoute(
	"/dashboard/question-bank/question-configuration/",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			{/* Header Section */}
			<div className="rounded-xl">
				<div className=" ">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
								Test Configuration
							</h1>
							<p className="text-muted-foreground text-sm max-w-2xl">
								Manage test types, subjects, difficulties, and more. Drag items
								to reorder them.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="py-4">
				<AdminTabs />
			</div>
		</main>
	);
}
