"use client";

import { ChevronDown, ChevronUp, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CourseContent() {
	const [expandedSections, setExpandedSections] = useState<Set<number>>(
		new Set([0]),
	);

	const sections = [
		{
			title: "Introduction to Product Management for AI & Data",
			lectures: 6,
			duration: "23min",
			lessons: [
				{
					title: "A Product Manager as an Analytics Translator",
					duration: "03:49",
				},
				{
					title: "The Role of PM in AI-Driven Organizations",
					duration: "04:15",
				},
				{ title: "Key Responsibilities and Expectations", duration: "05:22" },
				{ title: "Career Paths in AI Product Management", duration: "04:33" },
				{ title: "Essential Skills for Success", duration: "05:10" },
			],
		},
		{
			title: "Key Technological Concepts for AI & Data",
			lectures: 7,
			duration: "35min",
			lessons: [
				{ title: "Machine Learning Fundamentals", duration: "06:12" },
				{ title: "Deep Learning and Neural Networks", duration: "07:25" },
				{ title: "Data Pipelines and ETL Processes", duration: "05:48" },
				{ title: "Cloud Infrastructure for AI", duration: "06:30" },
				{ title: "Model Deployment and Monitoring", duration: "05:05" },
				{ title: "APIs and Microservices", duration: "04:20" },
			],
		},
		{
			title: "AI Product Development Lifecycle",
			lectures: 8,
			duration: "42min",
			lessons: [
				{ title: "Ideation and Problem Discovery", duration: "06:15" },
				{ title: "Data Acquisition and Preparation", duration: "07:10" },
				{ title: "Model Selection and Training", duration: "08:05" },
				{ title: "Validation and Testing Strategies", duration: "06:45" },
				{ title: "Deployment Planning", duration: "05:20" },
				{ title: "Post-Launch Monitoring", duration: "04:35" },
				{ title: "Iterative Improvement Cycles", duration: "04:10" },
			],
		},
		{
			title: "Data Strategy and Governance",
			lectures: 5,
			duration: "28min",
			lessons: [
				{ title: "Building a Data-Driven Culture", duration: "06:30" },
				{ title: "Data Quality and Management", duration: "07:15" },
				{ title: "Privacy Regulations and Compliance", duration: "05:45" },
				{ title: "Ethical AI Considerations", duration: "04:50" },
				{ title: "Data Security Best Practices", duration: "03:40" },
			],
		},
		{
			title: "Stakeholder Management and Communication",
			lectures: 6,
			duration: "31min",
			lessons: [
				{ title: "Communicating Technical Concepts", duration: "05:25" },
				{ title: "Managing Engineering Teams", duration: "06:10" },
				{ title: "Working with Data Scientists", duration: "05:45" },
				{ title: "Executive Reporting and Updates", duration: "06:30" },
				{ title: "Cross-Functional Collaboration", duration: "04:20" },
				{ title: "Conflict Resolution Strategies", duration: "03:10" },
			],
		},
		{
			title: "Metrics and Performance Evaluation",
			lectures: 7,
			duration: "38min",
			lessons: [
				{ title: "Defining Success Metrics", duration: "06:05" },
				{ title: "A/B Testing for AI Products", duration: "07:15" },
				{ title: "Model Performance Tracking", duration: "06:40" },
				{ title: "Business Impact Analysis", duration: "05:55" },
				{ title: "ROI Calculation Methods", duration: "04:45" },
				{ title: "User Behavior Analytics", duration: "05:20" },
				{ title: "Reporting Dashboards", duration: "02:20" },
			],
		},
		{
			title: "Future Trends and Advanced Topics",
			lectures: 5,
			duration: "32min",
			lessons: [
				{ title: "Generative AI and LLMs", duration: "08:15" },
				{ title: "Edge AI and IoT Integration", duration: "07:30" },
				{ title: "AutoML and No-Code Platforms", duration: "06:45" },
				{ title: "Quantum Computing Implications", duration: "05:10" },
				{ title: "Continuous Learning Systems", duration: "04:20" },
			],
		},
	];

	const totalLectures = sections.reduce(
		(sum, section) => sum + section.lectures,
		0,
	);
	const totalDuration = "4h 54m";

	const toggleSection = (index: number) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedSections(newExpanded);
	};

	const expandAllSections = () => {
		const allIndices = new Set(sections.map((_, index) => index));
		setExpandedSections(allIndices);
	};

	const collapseAllSections = () => {
		setExpandedSections(new Set());
	};

	const isAllExpanded = expandedSections.size === sections.length;

	return (
		<Card className="p-4">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-bold">Course content</h2>
				<Button
					variant="link"
					className="text-primary"
					onClick={isAllExpanded ? collapseAllSections : expandAllSections}
				>
					{isAllExpanded ? "Collapse all sections" : "Expand all sections"}
				</Button>
			</div>

			<p className="text-sm text-muted-foreground mb-4">
				{sections.length} sections • {totalLectures} lectures • {totalDuration}{" "}
				total length
			</p>

			<div className="space-y-2">
				{sections.map((section, index) => (
					<div
						key={index}
						className="border rounded-lg overflow-hidden hover:border-gray-200 transition-colors"
					>
						<Button
							onClick={() => toggleSection(index)}
							className="w-full flex items-center justify-between p-1 py-6 md:p-4 hover:bg-gray-400 transition-colors text-left"
						>
							<div className="flex items-center gap-3">
								{expandedSections.has(index) ? (
									<ChevronUp className="h-5 w-5 flex-shrink-0" />
								) : (
									<ChevronDown className="h-5 w-5 flex-shrink-0" />
								)}
								<div className="flex flex-col items-start">
									<span className="font-semibold text-left">
										{section.title}
									</span>
									<span className="text-xs text-muted-foreground mt-1">
										Section {index + 1} of {sections.length}
									</span>
								</div>
							</div>
							<div className="text-sm text-muted-foreground flex-shrink-0 ml-2">
								{section.lectures}{" "}
								{section.lectures === 1 ? "lecture" : "lectures"} •{" "}
								{section.duration}
							</div>
						</Button>

						{expandedSections.has(index) && (
							<div className="border-t bg-card/50">
								<div className="py-2 px-4 text-xs text-muted-foreground border-b">
									{section.lessons.length} lessons in this section
								</div>
								{section.lessons.map((lesson, lessonIndex) => (
									<div
										key={lessonIndex}
										className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors group"
									>
										<div className="flex items-center gap-3 ">
											<div className="relative">
												<Play className="h-4 w-4 text-muted-foreground group-hover:text-gray-400 transition-colors" />
												<div className="absolute -inset-2 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium group-hover:text-gray-700 transition-colors">
													{lesson.title}
												</span>
												<span className="text-xs text-muted-foreground mt-0.5">
													Lesson {lessonIndex + 1} of {section.lessons.length}
												</span>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<span className=" text-muted-foreground bg-primary/50 px-2 py-1 rounded-md text-xs">
												{lesson.duration}
											</span>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
											>
												Preview
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</Card>
	);
}
