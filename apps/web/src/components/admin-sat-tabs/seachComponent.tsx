import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const testIds = [
	"f2328D283H23",
	"f2328D283H24",
	"f2328D283H25",
	"f2328D283H26",
];
const testTypes = ["SAT", "ACT", "GRE", "GMAT"];
const subjects = ["English", "Math", "Science", "History"];
const sections = [
	"Reading and Writing",
	"Mathematics",
	"Verbal Reasoning",
	"Quantitative",
];
const difficulties = ["Easy", "Medium", "Advanced", "Expert"];
const skills = [
	"Cross-text Connections",
	"Inference",
	"Main Idea",
	"Vocabulary",
	"Grammar",
];

export function SearchSection() {
	const [testId, setTestId] = useState("f2328D283H23");
	const [testType, setTestType] = useState("SAT");
	const [subject, setSubject] = useState("English");
	const [section, setSection] = useState("Reading and Writing");
	const [difficulty, setDifficulty] = useState("Advanced");
	const [skill, setSkill] = useState("Cross-text Connections");
	const [question, setQuestion] = useState("");

	const handleSearch = () => {
		console.log({
			testId,
			testType,
			subject,
			section,
			difficulty,
			skill,
			question,
		});
	};

	const handleReset = () => {
		setTestId("f2328D283H23");
		setTestType("SAT");
		setSubject("English");
		setSection("Reading and Writing");
		setDifficulty("Advanced");
		setSkill("Cross-text Connections");
		setQuestion("");
	};

	return (
		<div className="w-full space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-foreground">
						Search Questions
					</h2>
					<p className="text-sm text-muted-foreground">
						Filter and find specific test questions
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleReset}
					className="text-muted-foreground hover:text-foreground"
				>
					Reset filters
				</Button>
			</div>

			{/* Filters Container */}
			<div className="bg-[#FFFFFF] rounded-2xl p-6 border border-border/50">
				{/* Row 1 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
					{/* Test ID */}
					<div className="space-y-2">
						<Label
							htmlFor="test-id"
							className="text-sm font-medium text-foreground"
						>
							Test ID<span className="text-destructive">*</span>
						</Label>
						<Select value={testId} onValueChange={setTestId}>
							<SelectTrigger
								id={testId}
								className=" bg-background border-border hover:border-foreground/20 transition-colors w-full"
							>
								<SelectValue placeholder="Select Test ID" />
							</SelectTrigger>
							<SelectContent>
								{testIds.map((id) => (
									<SelectItem key={id} value={id}>
										{id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Test Type */}
					<div className="space-y-2">
						<Label
							htmlFor="test-type"
							className="text-sm font-medium text-foreground"
						>
							Test Type<span className="text-destructive">*</span>
						</Label>
						<Select value={testType} onValueChange={setTestType}>
							<SelectTrigger
								id={testType}
								className=" bg-background border-border hover:border-foreground/20 transition-colors w-full"
							>
								<SelectValue placeholder="Select Test Type" />
							</SelectTrigger>
							<SelectContent>
								{testTypes.map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Subject */}
					<div className="space-y-2">
						<Label
							htmlFor="subject"
							className="text-sm font-medium text-foreground"
						>
							Subject<span className="text-destructive">*</span>
						</Label>
						<Select value={subject} onValueChange={setSubject}>
							<SelectTrigger
								id={subject}
								className=" bg-background border-border hover:border-foreground/20 transition-colors w-full"
							>
								<SelectValue placeholder="Select Subject" />
							</SelectTrigger>
							<SelectContent>
								{subjects.map((subj) => (
									<SelectItem key={subj} value={subj}>
										{subj}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Section */}
					<div className="space-y-2">
						<Label
							htmlFor="section"
							className="text-sm font-medium text-foreground"
						>
							Section<span className="text-destructive">*</span>
						</Label>
						<Select value={section} onValueChange={setSection}>
							<SelectTrigger
								id={section}
								className=" bg-background border-border hover:border-foreground/20 transition-colors w-full"
							>
								<SelectValue placeholder="Select Section" />
							</SelectTrigger>
							<SelectContent>
								{sections.map((sec) => (
									<SelectItem key={sec} value={sec}>
										{sec}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Difficulty */}
					<div className="space-y-2">
						<Label
							htmlFor="difficulty"
							className="text-sm font-medium text-foreground"
						>
							Difficulty
						</Label>
						<Select value={difficulty} onValueChange={setDifficulty}>
							<SelectTrigger
								id={difficulty}
								className=" bg-background border-border hover:border-foreground/20 transition-colors w-full"
							>
								<SelectValue placeholder="Select Difficulty" />
							</SelectTrigger>
							<SelectContent>
								{difficulties.map((diff) => (
									<SelectItem key={diff} value={diff}>
										{diff}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Row 2 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_2fr_auto] gap-4 items-end">
					{/* Skill */}
					<div className="space-y-2">
						<Label
							htmlFor="skill"
							className="text-sm font-medium text-foreground"
						>
							Skill
						</Label>
						<Select value={skill} onValueChange={setSkill}>
							<SelectTrigger
								id={skill}
								className=" bg-background border-border hover:border-foreground/20 transition-colors w-full"
							>
								<SelectValue placeholder="Select Skill" />
							</SelectTrigger>
							<SelectContent>
								{skills.map((sk) => (
									<SelectItem key={sk} value={sk}>
										{sk}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Question Input */}
					<div className="space-y-2">
						<Label
							htmlFor="questions"
							className="text-sm font-medium text-foreground"
						>
							Question
						</Label>
						<Input
							id={"questions"}
							type="text"
							placeholder="Write question here"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							className=" bg-background border-border hover:border-foreground/20 focus:border-foreground/30 transition-colors px-5"
						/>
					</div>

					{/* Search Button */}
					<Button
						onClick={handleSearch}
						className=" px-8  bg-primary-dark text-background hover:bg-primary-dark/90 transition-all shadow-sm"
					>
						<Search className="w-4 h-4 mr-2" />
						Search
					</Button>
				</div>
			</div>

			{/* Active Filters Pills */}
			{/* <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
        {[
          { label: "Test Type", value: testType },
          { label: "Subject", value: subject },
          { label: "Difficulty", value: difficulty },
        ].map((filter) => (
          <span
            key={filter.label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 text-sm text-foreground border border-border/50"
          >
            <span className="text-muted-foreground">{filter.label}:</span>
            <span className="font-medium">{filter.value}</span>
          </span>
        ))}
      </div> */}
		</div>
	);
}
