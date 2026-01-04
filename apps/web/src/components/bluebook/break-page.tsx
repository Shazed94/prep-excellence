"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BreakPageProps {
	breakDurationSeconds?: number;
	onBreakComplete: () => void;
}

export function BreakPage({
	breakDurationSeconds = 60,
	onBreakComplete,
}: BreakPageProps) {
	const [timeRemaining, setTimeRemaining] = useState(breakDurationSeconds);

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					// Timer reached 0, start next module
					onBreakComplete();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [onBreakComplete]);

	const minutes = Math.floor(timeRemaining / 60);
	const seconds = timeRemaining % 60;

	return (
		<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-4">
			<div className="max-w-3xl w-full">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
					{/* Timer */}
					<div className="flex flex-col items-center">
						<div className="border-2 border-gray-500 rounded-lg px-8 py-6 text-center mb-6">
							<div className="text-sm text-gray-400 mb-2">
								Remaining Break Time:
							</div>
							<div className="text-5xl font-bold font-mono">
								{String(minutes).padStart(2, "0")}:
								{String(seconds).padStart(2, "0")}
							</div>
						</div>
						<Button
							type="button"
							onClick={onBreakComplete}
							className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-2.5 rounded-full"
						>
							Resume Testing
						</Button>
					</div>

					{/* Instructions */}
					<div>
						<h1 className="text-2xl font-bold mb-4">Practice Test Break</h1>

						<p className=" text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
							You can resume this practice test as soon as you're ready to move
							on. On test day, you'll wait until the clock counts down. Read
							below to see how breaks work on test day.
						</p>

						<hr className="border-gray-700 my-8" />
						<h2 className="text-2xl font-bold mb-4">
							Take a Break: Do Not Close Your Device
						</h2>
						<p className="text-gray-300 mb-4">
							After the break, a Resume Testing Now button will appear and
							you'll start the next section.
						</p>
						<p className="text-gray-400 font-semibold mb-3">
							Follow these rules during the break:
						</p>
						<ol className="text-gray-300 space-y-2 list-decimal list-inside">
							<li>Do not disturb students who are still testing.</li>
							<li>Do not exit the app or close your laptop.</li>
							<li>
								Do not access phones, smartwatches, textbooks, notes, or the
								internet.
							</li>
							<li>Do not eat or drink in the test room.</li>
							<li>
								Do not speak in the test room; outside the test room, do not
								discuss the exam with anyone.
							</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
}
