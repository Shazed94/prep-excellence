"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	BookOpen,
	CheckCircle2,
	Clock,
	Coffee,
	Layers,
	Plus,
	Search,
	Target,
	Trash2,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const mockQuestions = [
	{
		id: "q1",
		text: "Which choice completes the text with the most logical and precise word?",
		difficulty: "easy",
		domain: "Reading Comprehension",
		skill: "Vocabulary in Context",
	},
	{
		id: "q2",
		text: "What is the main idea of the passage?",
		difficulty: "easy",
		domain: "Reading Comprehension",
		skill: "Central Ideas",
	},
	{
		id: "q3",
		text: "Which inference is best supported by the passage?",
		difficulty: "hard",
		domain: "Reading Comprehension",
		skill: "Inference",
	},
	{
		id: "q4",
		text: "Based on the data, what conclusion can be drawn?",
		difficulty: "hard",
		domain: "Information and Ideas",
		skill: "Command of Evidence",
	},
	{
		id: "q5",
		text: "Which statement best describes the relationship between the variables?",
		difficulty: "easy",
		domain: "Math",
		skill: "Algebra",
	},
	{
		id: "q6",
		text: "What is the solution to the equation?",
		difficulty: "hard",
		domain: "Math",
		skill: "Advanced Math",
	},
];

const moduleSchema = z.object({
	name: z.string().min(1, "Module name is required"),
	score: z.number().min(0, "Score is required"),
	time: z.number().min(0, "Time is required"),
	direction: z.string().optional(),
	nextModuleScore: z.number().optional(),
	easyQuestions: z.array(z.string()),
	hardQuestions: z.array(z.string()),
});

const sectionSchema = z.object({
	name: z.string().min(1, "Section name is required"),
	breakTime: z.number().min(0, "Break time must be 0 or more").optional(),
	modules: z.array(moduleSchema),
});

const formSchema = z.object({
	practiceName: z.string().min(1, "Practice name is required"),
	testType: z.string().optional(),
	subject: z.string().optional(),
	totalDuration: z
		.number()
		.min(1, "Total duration must be at least 1 minute")
		.optional(),
	status: z.enum(["Published", "Draft"]).optional(),
	sections: z.array(sectionSchema),
});

type FormValues = z.infer<typeof formSchema>;

export default function FullLengthPracticeBuilder() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
		defaultValues: {
			practiceName: "",
			testType: "",
			subject: "",
			totalDuration: undefined,
			status: "Draft",
			sections: [],
		},
	});

	const {
		fields: sections,
		append: appendSection,
		remove: removeSection,
	} = useFieldArray({
		control: form.control,
		name: "sections",
	});

	// Derive subject options from selected test type
	const selectedTestType = form.watch("testType") || "";

	const subjectOptionsMap: Record<string, string[]> = {
		SAT: ["Full Test", "Mathematics", "English", "Reading and Writing"],
		ACT: [
			"Full Test",
			"Mathematics",
			"English",
			"Science",
			"Reading and Writing",
		],
		AP: ["Mathematics", "English", "Science", "History"],
	};

	const subjectOptions = subjectOptionsMap[selectedTestType] || [
		"Full Test",
		"Mathematics",
		"English",
		"Reading and Writing",
		"Science",
		"History",
	];

	// Reset subject whenever test type changes to force user to pick a matching subject
	useEffect(() => {
		form.setValue("subject", "");
	}, [form]);

	// Calculate total questions from all modules
	const totalQuestions = sections.reduce((total, section) => {
		const sectionQuestions = section.modules.reduce((sectionTotal, module) => {
			const easyCount = module.easyQuestions?.length || 0;
			const hardCount = module.hardQuestions?.length || 0;
			return sectionTotal + easyCount + hardCount;
		}, 0);
		return total + sectionQuestions;
	}, 0);

	// Calculate total break time
	const totalBreakTime = sections.reduce((total, section) => {
		return total + (section.breakTime || 0);
	}, 0);

	const onSubmit = (data: FormValues) => {
		if (!data.practiceName) {
			form.setError("practiceName", { message: "Practice name is required" });
			return;
		}
		if (!data.testType || !data.subject) {
			form.setError("testType", { message: "Test type is required" });
			form.setError("subject", { message: "Subject is required" });
			return;
		}
		console.log("Form submitted:", data);
	};

	return (
		<div className="">
			<div className=" space-y-6">
				{/* Compact Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-primary-dark/10 border border-violet-200 ">
							<BookOpen className="w-6 h-6 text-primary-dark" />
						</div>
						<div>
							<h1 className="text-2xl font-bold  text-primary-dark ">
								Full Length Practice Builder
							</h1>
							<p className="text-xs text-muted-foreground">
								Configure full-length practice test with sections and breaks
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700"
						>
							<BookOpen className="w-3 h-3 mr-1.5 text-blue-600" />
							{totalQuestions} Question{totalQuestions !== 1 ? "s" : ""}
						</Badge>
						<Badge
							variant="outline"
							className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700"
						>
							<Coffee className="w-3 h-3 mr-1.5 text-amber-600" />
							{totalBreakTime} min break
						</Badge>
						<Badge variant="outline" className="px-3 py-1.5">
							<Layers className="w-3 h-3 mr-1.5" />
							{sections.length} Section{sections.length !== 1 ? "s" : ""}
						</Badge>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						{/* Practice Basic Information */}
						<Card className="border-0 shadow-lg bg-linear-to-br from-violet-50/50 to-blue-50/50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
							<CardContent className="p-5">
								<div className="mb-4 pb-3 border-b">
									<h3 className="text-sm font-bold text-primary-dark flex items-center gap-2">
										<Target className="w-4 h-4" />
										Practice Basic Information
									</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										Define the core details of your full-length practice test
									</p>
								</div>

								<div className="space-y-4">
									{/* Practice Name - Full Width */}
									<FormField
										control={form.control}
										name="practiceName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
													<BookOpen className="w-3.5 h-3.5 text-primary-dark" />
													Practice Name *
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., SAT Full Practice Test 1"
														className="h-10 border-2 border-border hover:border-primary-dark/50 focus:border-primary-dark transition-colors rounded-lg font-medium"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Row 1: Test Type, Subject, Total Duration */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<FormField
											control={form.control}
											name="testType"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
														Test Type *
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-10 border-2 border-border rounded-lg w-full">
																<SelectValue placeholder="Select type" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="SAT">SAT</SelectItem>
															<SelectItem value="ACT">ACT</SelectItem>
															<SelectItem value="AP">AP</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="subject"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
														Subject *
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-10 border-2 border-border  rounded-lg w-full">
																<SelectValue placeholder="Select subject" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{subjectOptions.map((opt) => (
																<SelectItem key={opt} value={opt}>
																	{opt}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="totalDuration"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
														<Clock className="w-3.5 h-3.5 " />
														Total Duration (min)
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., 180"
															type="number"
															className="h-10 border-2  rounded-lg"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target.value
																		? Number(e.target.value)
																		: undefined,
																)
															}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Row 2: Status */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="status"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
														Status
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-10 border-2 border-border rounded-lg w-full">
																<SelectValue placeholder="Select status" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="Published">
																<span className="flex items-center gap-2">
																	<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
																	Published
																</span>
															</SelectItem>
															<SelectItem value="Draft">
																<span className="flex items-center gap-2">
																	<Clock className="w-3.5 h-3.5 text-amber-600" />
																	Draft
																</span>
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Sections Configuration */}
						<Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
							<CardContent className="p-5">
								<div className="flex items-center justify-between mb-4">
									<div>
										<h3 className="text-sm font-bold text-primary-dark dark:text-violet-300 flex items-center gap-2">
											<Layers className="w-4 h-4" />
											Test Sections
										</h3>
										<p className="text-xs text-muted-foreground mt-0.5">
											Organize your test into sections with break times
										</p>
									</div>
									<Button
										type="button"
										size="sm"
										onClick={() =>
											appendSection({ name: "", breakTime: 0, modules: [] })
										}
										className="rounded-lg px-4 h-9"
									>
										<Plus className="h-4 w-4 mr-1.5" />
										Add Section
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Compact Sections List */}
						<div className="space-y-4">
							{sections.length === 0 ? (
								<Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/10">
									<CardContent className="py-10 text-center">
										<Layers className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
										<p className="text-sm font-medium text-muted-foreground mb-4">
											No sections yet. Click "Add Section" to start building
											your test.
										</p>
									</CardContent>
								</Card>
							) : (
								sections.map((section, sectionIdx) => (
									<Card
										key={section.id}
										className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden"
									>
										<CardContent className="p-4">
											<div className="flex items-center gap-3 mb-4">
												<Badge
													variant="outline"
													className="bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
												>
													Section {sectionIdx + 1}
												</Badge>
												<FormField
													control={form.control}
													name={`sections.${sectionIdx}.name`}
													render={({ field }) => (
														<FormItem className="flex-1">
															<FormControl>
																<Input
																	placeholder="e.g., Reading and Writing"
																	className="h-9 border-2 border-border hover:border-blue-500/50 transition-colors rounded-lg font-medium"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`sections.${sectionIdx}.breakTime`}
													render={({ field }) => (
														<FormItem className="w-32">
															<FormControl>
																<div className="flex items-center gap-2">
																	<Coffee className="w-4 h-4 text-amber-600" />
																	<Input
																		placeholder="Break"
																		type="number"
																		className="h-9 border-2 border-border hover:border-amber-500/50 transition-colors rounded-lg text-sm"
																		{...field}
																		onChange={(e) =>
																			field.onChange(
																				e.target.value
																					? Number(e.target.value)
																					: 0,
																			)
																		}
																		value={field.value || 0}
																	/>
																	<span className="text-xs text-muted-foreground">
																		min
																	</span>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => removeSection(sectionIdx)}
													className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
											<ModuleFields sectionIdx={sectionIdx} form={form} />
										</CardContent>
									</Card>
								))
							)}
						</div>

						{/* Compact Submit Button */}
						<div className="flex justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => form.reset()}
								className="rounded-lg"
							>
								Reset
							</Button>
							<Button type="submit" className="rounded-lg px-8">
								<CheckCircle2 className="w-4 h-4 mr-2" />
								Save Configuration
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

function ModuleFields({ sectionIdx, form }: { sectionIdx: number; form: any }) {
	const {
		fields: modules,
		append,
		remove,
	} = useFieldArray({
		control: form.control,
		name: `sections.${sectionIdx}.modules`,
	});

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-lg">
				<div className="flex items-center gap-2">
					<Layers className="w-4 h-4 text-primary-dark" />
					<Label className="text-sm font-semibold">Modules</Label>
					<Badge variant="secondary" className="rounded-full text-xs h-5">
						{modules.length}
					</Badge>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() =>
						append({
							name: "",
							score: 0,
							time: 0,
							direction: "",
							easyQuestions: [],
							hardQuestions: [],
						})
					}
					className="h-7 rounded-lg hover:bg-violet-500/10"
				>
					<Plus className="h-3.5 w-3.5 mr-1" />
					Add
				</Button>
			</div>

			{modules.length === 0 ? (
				<div className="text-center py-6 border border-dashed rounded-lg bg-muted/10">
					<Layers className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
					<p className="text-xs text-muted-foreground">
						Add modules to organize questions
					</p>
				</div>
			) : (
				modules.map((module, moduleIdx) => (
					<Card
						key={module.id}
						className="border border-violet-200 dark:border-violet-800/50 bg-violet-50/30 dark:bg-violet-950/10 shadow-sm"
					>
						<CardContent className="p-3 space-y-3">
							{/* Module Header - Compact */}
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									className="bg-primary-dark/10 dark:bg-primary-dark border-violet-300 dark:border-primary-dark text-primary-dark dark:text-violet-300 text-xs h-6"
								>
									Module {moduleIdx + 1}
								</Badge>
								<FormField
									control={form.control}
									name={`sections.${sectionIdx}.modules.${moduleIdx}.name`}
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormControl>
												<Input
													placeholder="Module name"
													className="h-8 border border-border hover:border-primary-dark-500/50 transition-colors rounded-lg text-sm font-medium"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => remove(moduleIdx)}
									className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</Button>
							</div>

							{/* Module Config - Compact Grid */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
								<FormField
									control={form.control}
									name={`sections.${sectionIdx}.modules.${moduleIdx}.score`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-semibold flex items-center gap-1">
												<Target className="w-3 h-3 text-emerald-600" />
												Score
											</FormLabel>
											<FormControl>
												<Input
													placeholder="100"
													type="number"
													className="h-8 border border-border hover:border-emerald-500/50 transition-colors rounded-lg text-sm"
													{...field}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`sections.${sectionIdx}.modules.${moduleIdx}.time`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-semibold flex items-center gap-1">
												<Clock className="w-3 h-3 text-blue-600" />
												Time (min)
											</FormLabel>
											<FormControl>
												<Input
													placeholder="30"
													type="number"
													className="h-8 border border-border hover:border-blue-500/50 transition-colors rounded-lg text-sm"
													{...field}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`sections.${sectionIdx}.modules.${moduleIdx}.direction`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-semibold">
												Direction
											</FormLabel>
											<FormControl>
												<Input
													placeholder="L to R"
													className="h-8 border border-border hover:border-primary-dark/50 transition-colors rounded-lg text-sm"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name={`sections.${sectionIdx}.modules.${moduleIdx}.nextModuleScore`}
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xs font-semibold flex items-center gap-1">
												<Target className="w-3 h-3 text-amber-600" />
												Threshold
											</FormLabel>
											<FormControl>
												<Input
													placeholder="75"
													type="number"
													className="h-8 border border-border hover:border-amber-500/50 transition-colors rounded-lg text-sm"
													{...field}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: undefined,
														)
													}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<QuestionSelection
								sectionIdx={sectionIdx}
								moduleIdx={moduleIdx}
								form={form}
							/>
						</CardContent>
					</Card>
				))
			)}
		</div>
	);
}

function QuestionSelection({
	sectionIdx,
	moduleIdx,
	form,
}: {
	sectionIdx: number;
	moduleIdx: number;
	form: any;
}) {
	const [easySearchTerm, setEasySearchTerm] = useState("");
	const [hardSearchTerm, setHardSearchTerm] = useState("");
	const [showEasyDropdown, setShowEasyDropdown] = useState(false);
	const [showHardDropdown, setShowHardDropdown] = useState(false);

	const easyQuestions =
		form.watch(`sections.${sectionIdx}.modules.${moduleIdx}.easyQuestions`) ||
		[];
	const hardQuestions =
		form.watch(`sections.${sectionIdx}.modules.${moduleIdx}.hardQuestions`) ||
		[];

	const filteredEasyQuestions = mockQuestions.filter(
		(q) =>
			q.difficulty === "easy" &&
			(q.text.toLowerCase().includes(easySearchTerm.toLowerCase()) ||
				q.skill.toLowerCase().includes(easySearchTerm.toLowerCase())),
	);

	const filteredHardQuestions = mockQuestions.filter(
		(q) =>
			q.difficulty === "hard" &&
			(q.text.toLowerCase().includes(hardSearchTerm.toLowerCase()) ||
				q.skill.toLowerCase().includes(hardSearchTerm.toLowerCase())),
	);

	const addQuestion = (questionId: string, difficulty: "easy" | "hard") => {
		const currentQuestions =
			difficulty === "easy" ? easyQuestions : hardQuestions;
		const isSelected = currentQuestions.includes(questionId);
		const fieldName = `sections.${sectionIdx}.modules.${moduleIdx}.${difficulty === "easy" ? "easyQuestions" : "hardQuestions"}`;

		if (!isSelected) {
			form.setValue(fieldName, [...currentQuestions, questionId]);
		}

		if (difficulty === "easy") {
			setEasySearchTerm("");
			setShowEasyDropdown(false);
		} else {
			setHardSearchTerm("");
			setShowHardDropdown(false);
		}
	};

	const removeQuestion = (questionId: string, difficulty: "easy" | "hard") => {
		const currentQuestions =
			difficulty === "easy" ? easyQuestions : hardQuestions;
		const fieldName = `sections.${sectionIdx}.modules.${moduleIdx}.${difficulty === "easy" ? "easyQuestions" : "hardQuestions"}`;

		form.setValue(
			fieldName,
			currentQuestions.filter((id: string) => id !== questionId),
		);
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 bg-purple-50/50 dark:bg-purple-950/20 px-2 py-1.5 rounded-lg">
				<BookOpen className="w-4 h-4 text-primary-dark " />
				<Label className="text-xs font-bold text-primary-dark dark:text-purple-200">
					Questions
				</Label>
				<span className="text-xs text-muted-foreground">
					({easyQuestions.length + hardQuestions.length} total)
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
				{/* Easy Questions - Compressed */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
						<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
						<span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
							Easy
						</span>
						<Badge
							variant="secondary"
							className="ml-auto bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 h-5 text-xs"
						>
							{easyQuestions.length}
						</Badge>
					</div>

					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
						<Input
							placeholder="Search easy..."
							value={easySearchTerm}
							onChange={(e) => {
								setEasySearchTerm(e.target.value);
								setShowEasyDropdown(e.target.value.length > 0);
							}}
							onFocus={() =>
								easySearchTerm.length > 0 && setShowEasyDropdown(true)
							}
							onBlur={() => setTimeout(() => setShowEasyDropdown(false), 200)}
							className="pl-8 h-8 border border-border hover:border-emerald-500/50 transition-colors rounded-lg text-sm"
						/>
						{showEasyDropdown && filteredEasyQuestions.length > 0 && (
							<div className="absolute z-50 w-full mt-1 bg-background border-2 border-emerald-200 dark:border-emerald-800 rounded-lg shadow-xl max-h-48 overflow-y-auto">
								{filteredEasyQuestions.map((question) => {
									const isAlreadyAdded = easyQuestions.includes(question.id);
									return (
										<button
											key={question.id}
											type="button"
											onClick={() => addQuestion(question.id, "easy")}
											disabled={isAlreadyAdded}
											className="w-full text-left p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors border-b last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<p className="text-xs font-medium leading-tight line-clamp-2">
												{question.text}
											</p>
											<p className="text-[10px] text-muted-foreground mt-0.5">
												{question.skill}
											</p>
										</button>
									);
								})}
							</div>
						)}
					</div>

					<div className="space-y-1.5 min-h-20 max-h-[200px] overflow-y-auto p-2 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-lg border border-dashed border-emerald-300 dark:border-emerald-700">
						{easyQuestions.length === 0 ? (
							<div className="text-center py-4">
								<CheckCircle2 className="w-6 h-6 text-emerald-600/30 mx-auto mb-1" />
								<p className="text-[10px] text-muted-foreground">
									No questions
								</p>
							</div>
						) : (
							easyQuestions.map((qId: string) => {
								const question = mockQuestions.find((q) => q.id === qId);
								return (
									<div
										key={qId}
										className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 group hover:shadow-sm transition-shadow"
									>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium leading-tight line-clamp-2">
												{question?.text}
											</p>
											<p className="text-[10px] text-muted-foreground mt-0.5">
												{question?.skill}
											</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												removeQuestion(qId, "easy");
											}}
											className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								);
							})
						)}
					</div>
				</div>

				{/* Hard Questions - Compressed */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
						<XCircle className="w-3.5 h-3.5 text-rose-600" />
						<span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
							Hard
						</span>
						<Badge
							variant="secondary"
							className="ml-auto bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 h-5 text-xs"
						>
							{hardQuestions.length}
						</Badge>
					</div>

					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
						<Input
							placeholder="Search hard..."
							value={hardSearchTerm}
							onChange={(e) => {
								setHardSearchTerm(e.target.value);
								setShowHardDropdown(e.target.value.length > 0);
							}}
							onFocus={() =>
								hardSearchTerm.length > 0 && setShowHardDropdown(true)
							}
							onBlur={() => setTimeout(() => setShowHardDropdown(false), 200)}
							className="pl-8 h-8 border border-border hover:border-rose-500/50 transition-colors rounded-lg text-sm"
						/>
						{showHardDropdown && filteredHardQuestions.length > 0 && (
							<div className="absolute z-50 w-full mt-1 bg-background border-2 border-rose-200 dark:border-rose-800 rounded-lg shadow-xl max-h-48 overflow-y-auto">
								{filteredHardQuestions.map((question) => {
									const isAlreadyAdded = hardQuestions.includes(question.id);
									return (
										<button
											key={question.id}
											type="button"
											onClick={() => addQuestion(question.id, "hard")}
											disabled={isAlreadyAdded}
											className="w-full text-left p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border-b last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<p className="text-xs font-medium leading-tight line-clamp-2">
												{question.text}
											</p>
											<p className="text-[10px] text-muted-foreground mt-0.5">
												{question.skill}
											</p>
										</button>
									);
								})}
							</div>
						)}
					</div>

					<div className="space-y-1.5 min-h-20 max-h-[200px] overflow-y-auto p-2 bg-rose-50/30 dark:bg-rose-950/10 rounded-lg border border-dashed border-rose-300 dark:border-rose-700">
						{hardQuestions.length === 0 ? (
							<div className="text-center py-4">
								<XCircle className="w-6 h-6 text-rose-600/30 mx-auto mb-1" />
								<p className="text-[10px] text-muted-foreground">
									No questions
								</p>
							</div>
						) : (
							hardQuestions.map((qId: string) => {
								const question = mockQuestions.find((q) => q.id === qId);
								return (
									<div
										key={qId}
										className="flex items-start gap-2 p-2 rounded-lg bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 group hover:shadow-sm transition-shadow"
									>
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium leading-tight line-clamp-2">
												{question?.text}
											</p>
											<p className="text-[10px] text-muted-foreground mt-0.5">
												{question?.skill}
											</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												removeQuestion(qId, "hard");
											}}
											className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
