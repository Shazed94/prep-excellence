"use client";

import { useEffect, useRef } from "react";
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
	const hasCalledRef = useRef(false);
	const DELAY_MS = 3000;

	// Reset the ref when nextModuleProgressId changes (new loading page instance)
	// We intentionally include nextModuleProgressId to reset for each new module
	// biome-ignore lint/correctness/useExhaustiveDependencies: Need to reset on nextModuleProgressId change
	useEffect(() => {
		hasCalledRef.current = false;
	}, [nextModuleProgressId]);

	// Single useEffect to handle timer-based page change
	// After delay: if nextModuleProgressId exists, fetch next module; otherwise complete test
	useEffect(() => {
		// Prevent duplicate calls within the same loading page instance
		if (hasCalledRef.current) {
			console.log("API call already made, skipping");
			return;
		}

		console.log(
			"Setting up timer for loading page, nextModuleProgressId:",
			nextModuleProgressId,
		);
		hasCalledRef.current = true;

		const timer = setTimeout(() => {
			if (!nextModuleProgressId) {
				// No next module, complete the test
				console.log("No next module found, completing test");
				onComplete();
			} else {
				// Fetch next module
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
			console.log("Cleaning up timer");
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
