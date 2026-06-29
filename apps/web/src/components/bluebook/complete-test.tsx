import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useExamStore } from "@/store/useExamStore";
import { Button } from "../ui/button";

export default function CompletionPage() {
	const [mounted, _setMounted] = useState(false);
	const resetExam = useExamStore((s) => s.resetExam);
	const router = useRouter();

	// Generate random confetti dots
	const confetti = mounted
		? Array.from({ length: 40 }, (_, i) => ({
				id: i,
				left: Math.random() * 100,
				top: Math.random() * 100,
				size: Math.random() * 8 + 4,
				color: [
					"#FFC300", // yellow
					"#FF5733", // red
					"#C70039", // dark red
					"#900C3F", // purple
					"#540D6E", // dark purple
					"#00BCD4", // cyan
					"#FF69B4", // pink
					"#87CEEB", // sky blue
				][Math.floor(Math.random() * 8)],
				delay: Math.random() * 0.5,
			}))
		: [];

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 relative overflow-hidden">
			{/* Confetti background */}
			<div className="absolute inset-0">
				{confetti.map((dot) => (
					<div
						key={dot.id}
						className="absolute rounded-full opacity-60"
						style={{
							left: `${dot.left}%`,
							top: `${dot.top}%`,
							width: `${dot.size}px`,
							height: `${dot.size}px`,
							backgroundColor: dot.color,
							animation: `float 3s ease-in-out infinite`,
							animationDelay: `${dot.delay}s`,
						}}
					/>
				))}
			</div>

			{/* Return to Home link - top right */}
			<div className="absolute top-6 right-6 z-10">
				<Button
					onClick={() => {
						resetExam();
						router.navigate({
							to: "/sat-practice",
						});
					}}
					className="text-white bg-primary font-medium flex items-center gap-1 transition-colors"
				>
					Return to Home
					<span className="text-lg">🏠</span>
				</Button>
			</div>

			{/* Main content */}
			<div className="relative z-5 min-h-screen flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl w-full">
					<div className="text-center space-y-8">
						{/* Heading */}
						<h1 className="text-4xl md:text-5xl font-bold text-slate-800">
							You're All Finished!
						</h1>

						{/* Laptop illustration */}
						<div className="flex justify-center py-6">
							<div className="w-full h-auto flex items-center justify-center">
								<img src="/complete_module.png" alt="Complete Module" />
							</div>
						</div>

						{/* Content text */}
						<div className="space-y-4 text-slate-700">
							<p className="text-base md:text-lg">
								Return to the{" "}
								<span className="font-semibold text-blue-600">homepage</span> to
								start the preview again.
							</p>
							<p className="text-sm md:text-base">
								<span className="font-semibold">Reminder:</span> there are no{" "}
								<span className="font-semibold text-blue-600">scores</span> or
								feedback in this preview.
							</p>
							<p className="text-sm md:text-base">
								When you see this page on test day, you'll know your{" "}
								<span className="font-semibold text-blue-600">scores</span> have
								been submitted.
							</p>
						</div>

						{/* Return to Home button */}
						<div className="pt-6">
							<Button
								onClick={() => {
									resetExam();
									router.navigate({
										to: "/sat-practice",
									});
								}}
								className="inline-block bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-full transition-colors shadow-md hover:shadow-lg"
							>
								Return to Home
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
