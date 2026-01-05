"use client";

import { useEffect } from "react";
import { useCreateSatAttemptMCQModuleNext } from "@/hooks/sat-attempt";

interface LoadingModulePageProps {
	nextModuleProgressId: string | null;
	onNextModule: (response: any) => void;
	onComplete: () => void;
}

export default function LoadingModulePage({
	nextModuleProgressId,
	onNextModule,
	onComplete,
}: LoadingModulePageProps) {
	const fetchNextModule = useCreateSatAttemptMCQModuleNext();
	const DELAY_MS = 3000;

	// Simple logic: Wait 3 seconds, then either fetch next module or complete
	useEffect(() => {
		console.log(
			"Loading page mounted, nextModuleProgressId:",
			nextModuleProgressId,
		);

		const timer = setTimeout(() => {
			if (!nextModuleProgressId) {
				// No next module ID, complete the test
				console.log("No nextModuleProgressId, completing test");
				onComplete();
			} else {
				// Have next module ID, fetch it
				console.log("Fetching next module:", nextModuleProgressId);
				fetchNextModule.mutate(
					{
						moduleProgressId: nextModuleProgressId,
					},
					{
						onSuccess: (response) => {
							console.log("Next module fetched successfully:", response);
							if (response?.data?.activeModule) {
								// Has next module, go to break page
								console.log("Active module found, calling onNextModule");
								onNextModule(response);
							} else {
								// No active module in response, complete test
								console.log("No active module in response, completing test");
								onComplete();
							}
						},
						onError: (error) => {
							console.error("Error fetching next module:", error);
							// On error, treat as test completion
							onComplete();
						},
					},
				);
			}
		}, DELAY_MS);

		return () => {
			console.log("Cleaning up loading page timer");
			clearTimeout(timer);
		};
	}, [nextModuleProgressId, fetchNextModule, onNextModule, onComplete]);

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full text-center space-y-6">
				<h1 className="text-4xl font-semibold text-blue-400">
					This Module Is Over
				</h1>

				<div className="space-y-3 pt-4">
					<p className="text-lg text-slate-700">
						All your work has been saved.
					</p>
					<p className="text-lg text-slate-700">
						You'll move on automatically in just a moment.
					</p>
					<p className="text-lg text-slate-700">
						Do not refresh this page or quit the app.
					</p>
				</div>

				{/* Loading Spinner */}
				<div className="pt-12 flex justify-center">
					<div className="flex gap-1.5">
						<div
							className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
							style={{ animationDelay: "0ms" }}
						/>
						<div
							className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
							style={{ animationDelay: "150ms" }}
						/>
						<div
							className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
							style={{ animationDelay: "300ms" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
