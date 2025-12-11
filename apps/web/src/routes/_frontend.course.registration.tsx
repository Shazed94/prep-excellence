import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

export const Route = createFileRoute("/_frontend/course/registration")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<main className="min-h-screen bg-gray-50 p-8">
				<div className="mx-auto max-w-6xl">
					<div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
						<div className="flex items-start gap-8">
							{/* Left Section */}
							<div className="flex-1">
								<div className="mb-4">
									<div className="mb-2 text-4xl font-bold text-orange-500">
										$499
									</div>
									<h2 className="mb-2 text-xl font-bold text-teal-700">
										SAT PREMIUM STRATEGIES PREP
									</h2>
									<p className="text-sm text-gray-600">
										Master advanced SAT strategies through a structured,
										results-driven course built to boost confidence, accuracy,
										and speed.
									</p>
								</div>

								<div className="mb-4">
									<div className="mb-2 text-2xl font-bold text-blue-600">
										10th Nov → 10th Jan
									</div>
									<div className="mb-2 inline-block rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white">
										Target SAT: Oct 1 - 31, 2025
									</div>
									<div className="text-base font-semibold text-gray-900">
										4 Classes
									</div>
								</div>
							</div>

							{/* Center Section */}
							<div className="flex flex-col gap-3">
								<div className="text-right">
									<div className="text-lg font-semibold text-orange-500">
										6:00 PM – 9:00 PM EDT
									</div>
									<div className="text-lg font-semibold text-orange-500">
										5:00 PM – 8:00 PM CDT
									</div>
									<div className="text-lg font-semibold text-orange-500">
										3:00 PM – 6:00 PM PDT
									</div>
								</div>

								<div className="mt-4">
									<div className="mb-2 text-lg font-bold text-blue-600">
										Monday & Tuesday
									</div>
									<div className="text-base text-gray-900">
										3 hours per class
									</div>
									<div className="text-base text-gray-900">2 Tests</div>
								</div>
							</div>

							{/* Right Section - Instructor */}
							<div className="flex flex-col items-center">
								<div className="mb-3 h-32 w-32 overflow-hidden rounded-lg bg-teal-700">
									<img
										src="/professional-instructor-in-business-suit-with-arms.jpg"
										alt="Dr. Alam"
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="text-center">
									<div className="mb-1 text-sm font-semibold text-orange-500">
										Designed by Dr. Alam
									</div>
									<div className="flex items-center justify-center gap-1">
										<span className="text-xs font-medium text-gray-700">
											Rating:
										</span>
										<div className="flex gap-0.5">
											<Star className="h-4 w-4 fill-orange-500 text-orange-500" />
											<Star className="h-4 w-4 fill-orange-500 text-orange-500" />
											<Star className="h-4 w-4 fill-orange-500 text-orange-500" />
											<Star className="h-4 w-4 fill-orange-500 text-orange-500" />
											<Star className="h-4 w-4 fill-none text-orange-500" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
