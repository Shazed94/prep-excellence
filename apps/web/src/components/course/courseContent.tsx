import {
	ChevronDown,
	ChevronUp,
	Clock,
	FileText,
	PlayCircle,
} from "lucide-react";
import { useState } from "react";

interface Lesson {
	id: string;
	title: string;
	description?: string;
	duration?: number;
	videoUrl?: string;
	orderIndex: number;
	isActive: boolean;
}

interface Quiz {
	id: string;
	title: string;
	description?: string;
	timeLimit?: number;
	passingScore: number;
	orderIndex: number;
}

interface Module {
	id: string;
	title: string;
	description?: string;
	duration?: number;
	orderIndex: number;
	lessons: Lesson[];
	quizzes?: Quiz[];
}

interface CourseContentProps {
	modules?: Module[];
}

export function CourseContent({ modules = [] }: CourseContentProps) {
	const [expandedModules, setExpandedModules] = useState<Set<string>>(
		new Set(),
	);

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(moduleId)) {
				newSet.delete(moduleId);
			} else {
				newSet.add(moduleId);
			}
			return newSet;
		});
	};

	// Calculate total lessons and quizzes
	const totalLessons = modules.reduce(
		(acc, module) => acc + (module.lessons?.length || 0),
		0,
	);
	const totalQuizzes = modules.reduce(
		(acc, module) => acc + (module.quizzes?.length || 0),
		0,
	);

	if (!modules || modules.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">No course content available yet.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Summary */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<div className="flex gap-8 text-sm">
					<div>
						<span className="text-gray-600">Modules: </span>
						<strong className="text-gray-900">{modules.length}</strong>
					</div>
					<div>
						<span className="text-gray-600">Lessons: </span>
						<strong className="text-gray-900">{totalLessons}</strong>
					</div>
					{totalQuizzes > 0 && (
						<div>
							<span className="text-gray-600">Quizzes: </span>
							<strong className="text-gray-900">{totalQuizzes}</strong>
						</div>
					)}
				</div>
			</div>

			{/* Modules List */}
			<div className="space-y-3">
				{modules
					.sort((a, b) => a.orderIndex - b.orderIndex)
					.map((module) => {
						const isExpanded = expandedModules.has(module.id);
						const lessonCount = module.lessons?.length || 0;
						const quizCount = module.quizzes?.length || 0;

						return (
							<div
								key={module.id}
								className="border border-gray-200 rounded-lg overflow-hidden"
							>
								{/* Module Header */}
								<button
									onClick={() => toggleModule(module.id)}
									type="button"
									className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
								>
									<div className="flex items-center gap-3 text-left flex-1">
										<div className="flex-shrink-0">
											{isExpanded ? (
												<ChevronUp className="w-5 h-5 text-gray-600" />
											) : (
												<ChevronDown className="w-5 h-5 text-gray-600" />
											)}
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">
												{module.title}
											</h3>
											{module.description && (
												<p className="text-sm text-gray-600 mt-1">
													{module.description}
												</p>
											)}
										</div>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<span>{lessonCount} lessons</span>
										{quizCount > 0 && <span>{quizCount} quizzes</span>}
										{module.duration && (
											<span className="flex items-center gap-1">
												<Clock className="w-4 h-4" />
												{module.duration}m
											</span>
										)}
									</div>
								</button>

								{/* Module Content */}
								{isExpanded && (
									<div className="bg-white">
										{/* Lessons */}
										{module.lessons && module.lessons.length > 0 && (
											<div className="divide-y divide-gray-100">
												{module.lessons
													.sort((a, b) => a.orderIndex - b.orderIndex)
													.map((lesson, index) => (
														<div
															key={lesson.id}
															className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
														>
															<div className="flex-shrink-0">
																<PlayCircle className="w-5 h-5 text-blue-600" />
															</div>
															<div className="flex-1">
																<div className="flex items-center gap-2">
																	<span className="text-sm text-gray-500">
																		{index + 1}.
																	</span>
																	<h4 className="font-medium text-gray-900">
																		{lesson.title}
																	</h4>
																</div>
																{lesson.description && (
																	<p className="text-sm text-gray-600 mt-1">
																		{lesson.description}
																	</p>
																)}
															</div>
															{lesson.duration && (
																<div className="flex items-center gap-1 text-sm text-gray-600">
																	<Clock className="w-4 h-4" />
																	{lesson.duration}m
																</div>
															)}
														</div>
													))}
											</div>
										)}

										{/* Quizzes */}
										{module.quizzes && module.quizzes.length > 0 && (
											<div className="divide-y divide-gray-100 border-t border-gray-200">
												{module.quizzes
													.sort((a, b) => a.orderIndex - b.orderIndex)
													.map((quiz) => (
														<div
															key={quiz.id}
															className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors bg-amber-50/30"
														>
															<div className="flex-shrink-0">
																<FileText className="w-5 h-5 text-amber-600" />
															</div>
															<div className="flex-1">
																<h4 className="font-medium text-gray-900">
																	{quiz.title}
																</h4>
																{quiz.description && (
																	<p className="text-sm text-gray-600 mt-1">
																		{quiz.description}
																	</p>
																)}
																<div className="flex gap-4 mt-2 text-xs text-gray-600">
																	{quiz.timeLimit && (
																		<span>Time: {quiz.timeLimit}min</span>
																	)}
																	<span>Passing: {quiz.passingScore}%</span>
																</div>
															</div>
														</div>
													))}
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
}
