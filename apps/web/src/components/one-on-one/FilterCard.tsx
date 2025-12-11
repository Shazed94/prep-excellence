import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ----------------------
// TypeScript Types
// ----------------------
export interface SubjectItem {
	name: string;
	subSubjects: string[];
}

export interface CategoryData {
	title: string;
	subjects: SubjectItem[];
}

// ----------------------
// Full Filter Data
// ----------------------
const filterData: CategoryData[] = [
	{
		title: "Standardized Testing",
		subjects: [
			{
				name: "Standardized Tests",
				subSubjects: [
					"SAT",
					"ACT",
					"PSAT",
					"AP Exam Tests",
					"AP 2-D Art and Design",
					"AP 3-D Art and Design",
					"AP Art History",
					"AP Drawing",
					"AP English Language and Composition",
					"AP English Literature and Composition",
					"AP Comparative Government and Politics",
					"AP European History",
					"AP Human Geography",
					"AP Macroeconomics",
					"AP Microeconomics",
					"AP Psychology",
					"AP United States Government and Politics",
					"AP United States History",
					"AP World History",
					"AP Calculus AB",
					"AP Calculus BC",
					"AP Computer Science A",
					"AP Computer Science Principles",
					"AP Statistics",
					"AP Biology",
					"AP Chemistry",
					"AP Environmental Science",
					"AP Physics 1: Algebra-Based",
					"AP Physics C: Mechanics",
					"AP Chinese Language and Culture",
					"AP Spanish Language and Culture",
					"AP Spanish Literature and Culture",
					"MCAT",
				],
			},
		],
	},
	{
		title: "Academic Subjects",
		subjects: [
			{
				name: "Math",
				subSubjects: [
					"Algebra 1",
					"Algebra 2",
					"Pre-Algebra",
					"Geometry",
					"Trigonometry",
					"Pre-Calculus",
					"Calculus AB",
					"Calculus BC",
					"Statistics & Probability",
					"Multivariable Calculus",
				],
			},
			{
				name: "English",
				subSubjects: [
					"Reading Comprehension",
					"Writing",
					"Literature",
					"ESL",
					"Essay Editing",
				],
			},
			{
				name: "Science",
				subSubjects: [
					"Chemistry",
					"Physics",
					"Biology",
					"Earth Science",
					"Anatomy & Physiology",
					"Organic Chemistry",
					"Botany",
					"Neuroscience",
					"Psychology",
				],
			},
			{
				name: "Social Studies",
				subSubjects: [
					"U.S. History",
					"World History",
					"European History",
					"U.S. Government & Politics",
					"African History",
					"Art History",
					"Ethnic Studies",
					"Film & Theater",
					"Gender Studies",
					"International Relations",
					"Philosophy",
					"Political Science",
					"Sociology",
				],
			},
			{
				name: "Business & Technology",
				subSubjects: ["English (as a second language to foreign students)"],
			},
			{
				name: "Foreign Languages",
				subSubjects: ["Spanish"],
			},
		],
	},
	{
		title: "Engineering",
		subjects: [
			{
				name: "Engineering Subjects",
				subSubjects: [
					"Mechanical Engineering",
					"Electrical Engineering",
					"Civil Engineering",
					"Aerospace Engineering",
					"Computer Engineering",
					"Chemical Engineering",
				],
			},
		],
	},
];

// ----------------------
// Component
// ----------------------
export function FilterCard() {
	// State to track selected sub-subject for each subject dropdown
	const [selectedSubs, setSelectedSubs] = useState<
		Record<string, string | null>
	>({});

	return (
		<div className="space-y-6">
			{filterData.map((category) => (
				<Card key={category.title} className="p-5 space-y-4">
					{/* Category Title */}
					<h3 className="text-lg font-semibold">{category.title}</h3>

					{/* Subjects */}
					<div className="space-y-3">
						{category.subjects.map((subject) => (
							<DropdownMenu key={subject.name}>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" className="w-full justify-between">
										{selectedSubs[subject.name] ?? subject.name}
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="start"
									className="w-(--radix-popper-anchor-width)"
								>
									{subject.subSubjects.map((sub) => (
										<DropdownMenuItem
											key={sub}
											onClick={() =>
												setSelectedSubs((prev) => ({
													...prev,
													[subject.name]: sub,
												}))
											}
											className="w-full"
										>
											{sub}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						))}
					</div>
				</Card>
			))}
		</div>
	);
}
