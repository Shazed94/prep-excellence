"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	BookOpen,
	CheckCircle2,
	ChevronDown,
	Clock,
	Layers,
	Plus,
	Target,
	Trash2,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import RichTextEditor from "@/components/jodit-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
	useGetQuestionsFiltered,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";
import { SearchableSelect } from "../ui/searchable-select";
import { QuestionTableDialog } from "./question-table-dialog";

const moduleSchema = z.object({
	name: z.string().min(1, "Module name is required"),
	description: z.string().optional(),
	score: z.number().min(0, "Score is required"),
	time: z.number().min(0, "Time is required"),
	direction: z.string().optional(),
	nextModuleScore: z.number().optional(),
	questionSet1: z.array(z.string()),
	questionSet2: z.array(z.string()),
});

const sectionSchema = z.object({
	name: z.string().min(1, "Section name is required"),
	description: z.string().optional(),
	modules: z.array(moduleSchema),
});

const formSchema = z.object({
	testName: z.string().min(1, "Test name is required"),
	testType: z.string().optional(),
	subject: z.string().optional(),
	difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
	duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
	status: z.enum(["Active", "Draft", "Archived"]).optional(),
	sections: z.array(sectionSchema),
});

type FormValues = z.infer<typeof formSchema>;

export function SATBuilderPage() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
		defaultValues: {
			testName: "",
			testType: "",
			subject: "",
			difficulty: undefined,
			duration: undefined,
			status: "Draft",
			sections: [],
		},
	});

	// Fetch test types
	const { data: testTypesData } = useGetTestTypes({ limit: 100 });

	// Watch the selected test type
	const selectedTestType = form.watch("testType");
	const selectedSubject = form.watch("subject");

	// Get the selected test type object to check its name
	const selectedTestTypeObj = testTypesData?.data?.find(
		(tt: any) => tt.id === selectedTestType,
	);
	const isAPTest = selectedTestTypeObj?.name?.toLowerCase().includes("ap");

	// Fetch subjects filtered by the selected test type
	const { data: subjectsData } = useGetSubjects({
		limit: 100,
		filters: selectedTestType ? { testTypeId: selectedTestType } : undefined,
	});

	// Fetch questions based on test type and subject (for AP tests)
	const questionsFilters: any = {};
	if (selectedTestType) {
		questionsFilters.testTypeId = selectedTestType;
		// Only add subject filter if it's an AP test and subject is selected
		if (isAPTest && selectedSubject) {
			questionsFilters.subjectId = selectedSubject;
		}
	}

	const { data: questionsData } = useGetQuestionsFiltered({
		limit: 1000, // Large limit to get all questions
		filters:
			Object.keys(questionsFilters).length > 0 ? questionsFilters : undefined,
	});

	// Reset subject field when test type changes
	useEffect(() => {
		if (selectedTestType) {
			form.setValue("subject", "");
		}
	}, [selectedTestType, form]);

	const {
		fields: sections,
		append: appendSection,
		remove: removeSection,
	} = useFieldArray({
		control: form.control,
		name: "sections",
	});

	// Calculate total questions from all modules
	const totalQuestions = sections.reduce((total, section) => {
		const sectionQuestions = section.modules.reduce((sectionTotal, module) => {
			const set1Count = module.questionSet1?.length || 0;
			const set2Count = module.questionSet2?.length || 0;
			return sectionTotal + set1Count + set2Count;
		}, 0);
		return total + sectionQuestions;
	}, 0);

	const onSubmit = (data: FormValues) => {
		if (!data.testName) {
			form.setError("testName", { message: "Test name is required" });
			return;
		}
		if (!data.testType || !data.subject) {
			form.setError("testType", { message: "Test type is required" });
			form.setError("subject", { message: "Subject is required" });
			return;
		}
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
								Test Builder
							</h1>
							<p className="text-xs text-muted-foreground">
								Configure sections, modules, and questions
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="px-3 py-1.5 bg-blue-50 ">
							<BookOpen className="w-3 h-3 mr-1.5 text-blue-600" />
							{totalQuestions} Question{totalQuestions !== 1 ? "s" : ""}
						</Badge>
						<Badge variant="outline" className="px-3 py-1.5">
							<Layers className="w-3 h-3 mr-1.5" />
							{sections.length} Section{sections.length !== 1 ? "s" : ""}
						</Badge>
					</div>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
						{/* Test Basic Information */}
						<Card className="border-0 shadow-lg bg-linear-to-br from-violet-50/50 to-blue-50/50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
							<CardContent className="p-5">
								<div className="mb-4 pb-3 border-b">
									<h3 className="text-sm font-bold text-primary-dark  flex items-center gap-2">
										<Target className="w-4 h-4" />
										Test Basic Information
									</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										Define the core details of your practice test
									</p>
								</div>

								<div className="space-y-4">
									{/* Row 1: Test Type, Subject, Difficulty */}
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<FormField
											control={form.control}
											name="testType"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
														Test Type *
													</FormLabel>
													<SearchableSelect
														options={
															testTypesData?.data?.map(
																(item: { id: string; name: string }) => ({
																	value: item.id,
																	label: item.name,
																}),
															) || []
														}
														value={field.value}
														onValueChange={field.onChange}
														placeholder="Select test type"
														searchPlaceholder="Search test types..."
													/>
													<FormMessage />
												</FormItem>
											)}
										/>

										{isAPTest && (
											<FormField
												control={form.control}
												name="subject"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
															Subject *
														</FormLabel>
														<SearchableSelect
															options={
																subjectsData?.data?.map(
																	(item: { id: string; name: string }) => ({
																		value: item.id,
																		label: item.name,
																	}),
																) || []
															}
															value={field.value}
															onValueChange={field.onChange}
															placeholder="Select subject"
															searchPlaceholder="Search subjects..."
														/>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}

										<FormField
											control={form.control}
											name="difficulty"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
														Difficulty
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="h-10 border-2 border-border w-full rounded-lg">
																<SelectValue placeholder="Select difficulty" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="Easy">
																<span className="flex items-center gap-2">
																	<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
																	Easy
																</span>
															</SelectItem>
															<SelectItem value="Medium">
																<span className="flex items-center gap-2">
																	<Target className="w-3.5 h-3.5 text-blue-600" />
																	Medium
																</span>
															</SelectItem>
															<SelectItem value="Hard">
																<span className="flex items-center gap-2">
																	<XCircle className="w-3.5 h-3.5 text-rose-600" />
																	Hard
																</span>
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
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
															<SelectTrigger className="h-10 border-2 border-border w-full rounded-lg">
																<SelectValue placeholder="Select status" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="Active">
																<span className="flex items-center gap-2">
																	<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
																	Active
																</span>
															</SelectItem>
															<SelectItem value="Draft">
																<span className="flex items-center gap-2">
																	<Clock className="w-3.5 h-3.5 text-amber-600" />
																	Draft
																</span>
															</SelectItem>
															<SelectItem value="Archived">
																<span className="flex items-center gap-2">
																	<XCircle className="w-3.5 h-3.5 text-gray-600" />
																	Archived
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
						<Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-0">
							<CardContent className="p-5">
								<div className="flex items-center justify-between ">
									<div>
										<h3 className="text-sm font-bold text-primary-dark dark:text-violet-300 flex items-center gap-2">
											<Layers className="w-4 h-4" />
											Test Sections
										</h3>
										<p className="text-xs text-muted-foreground mt-0.5">
											Organize your test into sections and modules
										</p>
									</div>
									<Button
										type="button"
										size="sm"
										onClick={() =>
											appendSection({ name: "", description: "", modules: [] })
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
																	placeholder="e.g., Reading Comprehension"
																	className="h-9 border-2 border-border hover:border-blue-500/50 transition-colors rounded-lg font-medium"
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
													onClick={() => removeSection(sectionIdx)}
													className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>

											{/* Section Description - Collapsible */}
											<SectionDescription sectionIdx={sectionIdx} form={form} />

											<ModuleFields
												sectionIdx={sectionIdx}
												form={form}
												questionsData={questionsData}
											/>
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

function SectionDescription({
	sectionIdx,
	form,
}: {
	sectionIdx: number;
	form: any;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const description = form.watch(`sections.${sectionIdx}.description`);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
			<CollapsibleTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="flex items-center justify-between w-full p-3 hover:bg-muted/50 rounded-lg border border-border"
				>
					<div className="flex items-center gap-2">
						<BookOpen className="w-4 h-4 text-primary-dark" />
						<span className="text-sm font-semibold">Section Description</span>
						{description && (
							<Badge variant="secondary" className="text-xs">
								Added
							</Badge>
						)}
					</div>
					<ChevronDown
						className={`w-4 h-4 transition-transform ${
							isOpen ? "transform rotate-180" : ""
						}`}
					/>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-3">
				<FormField
					control={form.control}
					name={`sections.${sectionIdx}.description`}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="border rounded-lg overflow-hidden">
									<RichTextEditor
										value={field.value || ""}
										onChange={field.onChange}
										minHeight={150}
										height={300}
										key={`section-description-${sectionIdx}`}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CollapsibleContent>
		</Collapsible>
	);
}

function ModuleFields({
	sectionIdx,
	form,
	questionsData,
}: {
	sectionIdx: number;
	form: any;
	questionsData: any;
}) {
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
							description: "",
							score: 0,
							time: 0,
							direction: "",
							questionSet1: [],
							questionSet2: [],
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

							{/* Module Description - Collapsible */}
							<ModuleDescription
								sectionIdx={sectionIdx}
								moduleIdx={moduleIdx}
								form={form}
							/>

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
													type="number"
													placeholder="0"
													className="h-8 border border-border rounded-lg text-xs"
													{...field}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : 0,
														)
													}
													value={field.value || ""}
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
													type="number"
													placeholder="0"
													className="h-8 border border-border rounded-lg text-xs"
													{...field}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : 0,
														)
													}
													value={field.value || ""}
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
													placeholder="e.g., Read"
													className="h-8 border border-border rounded-lg text-xs"
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
											<FormLabel className="text-xs font-semibold">
												Next Score
											</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="0"
													className="h-8 border border-border rounded-lg text-xs"
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

							{/* Question Sets Section */}
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
									<Layers className="w-3.5 h-3.5 text-violet-600" />
									Question Sets
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{/* Question Set 1 */}
									<div className="space-y-2">
										<QuestionTableDialog
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questionsData?.data || []}
											questionSet={1}
										/>
										<SelectedQuestionsList
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questionsData?.data || []}
											questionSet={1}
										/>
									</div>

									{/* Question Set 2 */}
									<div className="space-y-2">
										<QuestionTableDialog
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questionsData?.data || []}
											questionSet={2}
										/>
										<SelectedQuestionsList
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questionsData?.data || []}
											questionSet={2}
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))
			)}
		</div>
	);
}

function ModuleDescription({
	sectionIdx,
	moduleIdx,
	form,
}: {
	sectionIdx: number;
	moduleIdx: number;
	form: any;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const description = form.watch(
		`sections.${sectionIdx}.modules.${moduleIdx}.description`,
	);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-3">
			<CollapsibleTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg border border-border"
				>
					<div className="flex items-center gap-2">
						<BookOpen className="w-3.5 h-3.5 text-violet-600" />
						<span className="text-xs font-semibold">Module Description</span>
						{description && (
							<Badge variant="secondary" className="text-[10px] h-4">
								Added
							</Badge>
						)}
					</div>
					<ChevronDown
						className={`w-3.5 h-3.5 transition-transform ${
							isOpen ? "transform rotate-180" : ""
						}`}
					/>
				</Button>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-2">
				<FormField
					control={form.control}
					name={`sections.${sectionIdx}.modules.${moduleIdx}.description`}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="border rounded-lg overflow-hidden">
									<RichTextEditor
										value={field.value || ""}
										onChange={field.onChange}
										minHeight={100}
										height={250}
										key={`module-description-${sectionIdx}-${moduleIdx}`}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CollapsibleContent>
		</Collapsible>
	);
}

function SelectedQuestionsList({
	sectionIdx,
	moduleIdx,
	form,
	questions,
	questionSet,
}: {
	sectionIdx: number;
	moduleIdx: number;
	form: any;
	questions: any[];
	questionSet: 1 | 2;
}) {
	const fieldName = questionSet === 1 ? "questionSet1" : "questionSet2";
	const selectedQuestionIds =
		form.watch(`sections.${sectionIdx}.modules.${moduleIdx}.${fieldName}`) ||
		[];

	const selectedQuestions = selectedQuestionIds
		.map((id: string) => questions.find((q) => q.id === id))
		.filter(Boolean);

	const handleRemoveQuestion = (questionId: string) => {
		const currentQuestions =
			form.getValues(
				`sections.${sectionIdx}.modules.${moduleIdx}.${fieldName}`,
			) || [];
		const updatedQuestions = currentQuestions.filter(
			(id: string) => id !== questionId,
		);
		form.setValue(
			`sections.${sectionIdx}.modules.${moduleIdx}.${fieldName}`,
			updatedQuestions,
		);
	};

	if (selectedQuestions.length === 0) {
		return (
			<div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
				<p className="text-xs text-muted-foreground">No questions selected</p>
			</div>
		);
	}

	return (
		<div className="space-y-1.5 max-h-[200px] overflow-y-auto border rounded-lg p-2 bg-muted/20">
			{selectedQuestions.map((question: any) => (
				<div
					key={question.id}
					className="flex items-start gap-2 p-2 bg-background border border-border rounded-lg hover:border-violet-300 transition-colors group"
				>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-medium truncate">{question.text}</p>
						<div className="flex items-center gap-1.5 mt-1">
							<Badge
								variant="outline"
								className={`text-[10px] h-4 px-1 ${
									question.difficulty === "easy"
										? "bg-emerald-50 border-emerald-300 text-emerald-700"
										: "bg-rose-50 border-rose-300 text-rose-700"
								}`}
							>
								{question.difficulty}
							</Badge>
							<Badge variant="outline" className="text-[10px] h-4 px-1">
								{question.skill}
							</Badge>
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => handleRemoveQuestion(question.id)}
						className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			))}
		</div>
	);
}
