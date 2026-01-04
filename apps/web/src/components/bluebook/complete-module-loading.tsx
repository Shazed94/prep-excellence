"use client";

import { useEffect, useRef } from "react";
import { useCreateSatAttemptMCQModuleNext } from "@/hooks/sat-attempt";

interface LoadingModulePageProps {
	activeModule: any;
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

	useEffect(() => {
		if (hasCalledRef.current || !nextModuleProgressId) return;

		hasCalledRef.current = true;

		const data = {
			nextModuleProgressId,
		};

		fetchNextModule.mutate(data, {
			onSuccess: (response) => {
				if (response?.data?.activeModule) {
					onNextModule(response);
				} else {
					onComplete();
				}
			},
		});
	}, [
		nextModuleProgressId,
		fetchNextModule, // ✅ FIX
		onNextModule,
		onComplete,
	]);

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
