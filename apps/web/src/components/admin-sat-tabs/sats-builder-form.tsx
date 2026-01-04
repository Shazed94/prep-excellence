"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	BookOpen,
	CheckCircle2,
	Clock,
	Layers,
	Plus,
	Target,
	Trash2,
	XCircle,
} from "lucide-react";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
	useCreateSATPracticeTest,
	useGetQuestionsFiltered,
	useGetSATPracticeTestById,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";
import { SearchableSelect } from "../ui/searchable-select";
import { DirectionEditorDialog } from "./direction-editor-dialog";
import { QuestionTableDialog } from "./question-table-dialog";

const moduleSchema = z.object({
	name: z.string().min(1, "Module name is required"),
	score: z.number().min(0, "Score is required"),
	time: z.number().min(0, "Time is required"),
	direction: z.string().optional(),
	nextModuleScore: z.number().optional(),
	questionSet1: z.array(z.string()),
	questionSet2: z.array(z.string()),
});

const sectionSchema = z.object({
	name: z.string().min(1, "Section name is required"),
	direction: z.string().optional(),
	modules: z.array(moduleSchema),
});

const formSchema = z.object({
	testName: z.string().min(1, "Test name is required"),
	testType: z.string().min(1, "Test type is required"),
	subject: z.string().optional(),
	difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
	duration: z.number().min(1, "Duration must be at least 1 minute").optional(),
	status: z.enum(["Draft", "Published", "Archived"]).optional(),
	sections: z.array(sectionSchema),
});

type FormValues = z.infer<typeof formSchema>;

export function SATBuilderPage({ practiceId }: { practiceId?: string } = {}) {
	const {
		data: testData,
		isLoading,
		error,
	} = useGetTestTypes({
		limit: 100,
	});
	const createPracticeTest = useCreateSATPracticeTest();
	const { data: existingTestData, isLoading: isExistingLoading } =
		useGetSATPracticeTestById(practiceId || "");
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

	console.log(form.formState.errors);

	// Auto-save state management
	const [autoSaveStatus, setAutoSaveStatus] = React.useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const [lastSaveTime, setLastSaveTime] = React.useState<Date | null>(null);
	const [autoSaveError, setAutoSaveError] = React.useState<string | null>(null);
	const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
	const autoSaveIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const [testId, setTestId] = React.useState<string | null>(null);
	const [typeName, setTestName] = React.useState<string | null>(null);

	const testType = form.watch("testType");
	const subject = form.watch("subject");

	console.log("testType", testType);

	const {
		data: subjectsData,
		isLoading: isSubjectsLoading,
		error: subjectsError,
	} = useGetSubjects({
		limit: 100,
		filters: testType ? { testTypeId: testType } : undefined,
	});

	// Fetch questions based on selected test type and subject
	const { data: questionsData, isLoading: isQuestionsLoading } =
		useGetQuestionsFiltered({
			limit: 1000,
			filters: {
				testTypeId: testType,
				subjectId: subject,
			},
		});

	// Auto-save effect
	React.useEffect(() => {
		// Clear any existing timeout
		if (autoSaveTimeoutRef.current) {
			clearTimeout(autoSaveTimeoutRef.current);
		}

		// Set a timeout that will trigger auto-save after 1 minute of no changes
		const timeout = setTimeout(async () => {
			// Only auto-save if we have required fields and the form is valid
			const formData = form.getValues();
			if (!formData.testName || !formData.testType) {
				return;
			}

			try {
				setAutoSaveStatus("saving");
				setAutoSaveError(null);

				const statusMap: Record<string, string> = {
					Draft: "DRAFT",
					Published: "PUBLISHED",
					Archived: "ARCHIVED",
				};

				const payload: any = {
					name: formData.testName,
					testTypeId: formData.testType,

					status: statusMap[formData.status || "Draft"] || "DRAFT",
					practiceType: "TEST_PRACTICE",
					sections: formData.sections.map((section, sectionIdx) => ({
						name: section.name,
						duration: formData.duration,
						orderIndex: sectionIdx,
						modules: section.modules.map((module, moduleIdx) => ({
							name: module.name,
							threshold: module.score,
							direction:
								module.direction &&
								(module.direction === "EASIER" || module.direction === "HARDER")
									? (module.direction as "EASIER" | "HARDER")
									: undefined,
							orderIndex: moduleIdx,
							questionsSetOneIds: module.questionSet1 || [],
							questionsSetTwoIds: module.questionSet2 || [],
						})),
					})),
				};
				if (formData.subject !== "") payload.subjectId = formData.subject;
				if (practiceId) payload.id = practiceId;
				if (testId) payload.id = testId;

				const res = await createPracticeTest.mutateAsync(payload);
				setTestId(res.data.id);

				setAutoSaveStatus("saved");
				setLastSaveTime(new Date());

				// Reset status after 2 seconds
				setTimeout(() => {
					setAutoSaveStatus("idle");
				}, 2000);
			} catch (error: any) {
				console.error("Auto-save error:", error);
				setAutoSaveStatus("error");
				setAutoSaveError(
					error?.response?.data?.message ||
						error?.message ||
						"Auto-save failed",
				);

				// Reset error after 5 seconds
				setTimeout(() => {
					setAutoSaveStatus("idle");
					setAutoSaveError(null);
				}, 2000);
			}
		}, 10000); // 60 seconds = 1 minute

		autoSaveTimeoutRef.current = timeout;

		// Cleanup timeout on unmount or when dependencies change
		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
		};
	}, [practiceId, createPracticeTest, testId, form.getValues]);

	// Cleanup interval on unmount
	React.useEffect(() => {
		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
			if (autoSaveIntervalRef.current) {
				clearInterval(autoSaveIntervalRef.current);
			}
		};
	}, []);

	// Map API questions to dialog format
	const questions =
		questionsData?.data?.map((q: any) => ({
			id: q.id,
			text: q.content,
			difficulty: q.difficulty?.toLowerCase() || "medium",
			domain: q.domain?.name || "Unknown",
			skill: q.skill?.name || "Unknown",
		})) || [];

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

	const onSubmit = async (data: FormValues) => {
		// Validate required fields
		if (!data.testName) {
			form.setError("testName", { message: "Test name is required" });
			return;
		}

		// Map frontend status to backend status
		const statusMap: Record<string, string> = {
			Draft: "DRAFT",
			Published: "PUBLISHED",
			Archived: "ARCHIVED",
		};

		// Transform form data to match API schema
		const payload: any = {
			id: testId || undefined,
			name: data.testName,
			testTypeId: data.testType,
			practiceType: "TEST_PRACTICE",
			status: statusMap[data.status || "Draft"] || "DRAFT",
			sections: data.sections.map((section, sectionIdx) => ({
				name: section.name,
				duration: data.duration,
				direction: section.direction,
				orderIndex: sectionIdx,
				modules: section.modules.map((module, moduleIdx) => ({
					name: module.name,
					threshold: module.score,
					direction: module.direction,
					orderIndex: moduleIdx,
					questionsSetOneIds: module.questionSet1 || [],
					questionsSetTwoIds: module.questionSet2 || [],
				})),
			})),
		};
		if (data.subject !== "") payload.subjectId = data.subject;
		if (practiceId) payload.id = practiceId;

		try {
			const result = await createPracticeTest.mutateAsync(payload);
			setTestId(result.id);

			toast.success("Practice test created successfully!", {
				description: `${data.testName} has been saved.`,
			});
			form.reset();
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || error?.message || "Please try again.";
			const errorDetails =
				error?.response?.data?.errors || error?.response?.data?.details;

			toast.error("Failed to create practice test", {
				description: errorDetails
					? `${errorMessage}: ${JSON.stringify(errorDetails)}`
					: errorMessage,
				duration: 10000,
			});
		}
	};

	// When editing, hydrate form with existing data
	React.useEffect(() => {
		if (!practiceId) return;
		if (isExistingLoading) return;
		const test = existingTestData?.data;
		if (!test) return;

		const mapped = {
			testName: test.name || "",
			testType: test.testType?.id || "",
			subject: test.subject?.id || "",
			difficulty: (() => {
				const name = test.difficulty?.name;
				if (!name) return undefined;
				const lower = String(name).toLowerCase();
				if (lower === "easy") return "Easy";
				if (lower === "medium") return "Medium";
				if (lower === "hard") return "Hard";
				return undefined;
			})() as FormValues["difficulty"],
			duration:
				test.section && test.section.length > 0
					? test.section[0].duration || undefined
					: undefined,
			status: (test.status === "PUBLISHED"
				? "Published"
				: test.status === "ARCHIVED"
					? "Archived"
					: "Draft") as FormValues["status"],
			sections: (test.section || []).map((section: any) => ({
				name: section.name || "",
				direction: section.direction || undefined,
				modules: (section.modules || []).map((m: any) => ({
					name: m.name || "",
					score: m.threshold || 0,
					time: section.duration || 0,
					direction: m.direction || undefined,
					questionSet1: (m.questionsSetOne || []).map((q: any) => q.id),
					questionSet2: (m.questionsSetTwo || []).map((q: any) => q.id),
				})),
			})),
		};

		form.reset(mapped);
	}, [practiceId, existingTestData, isExistingLoading, form.reset]);

	// Check if test type name includes "ap" (case-insensitive)
	const shouldShowSubject = typeName?.toLowerCase().includes("ap");

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
								Practice Test Builder
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
						{/* Auto-save status indicator */}
						<Badge
							variant="outline"
							className={`px-3 py-1.5 transition-colors ${
								autoSaveStatus === "saving"
									? "bg-blue-50 border-blue-300 text-blue-600"
									: autoSaveStatus === "saved"
										? "bg-emerald-50 border-emerald-300 text-emerald-600"
										: autoSaveStatus === "error"
											? "bg-red-50 border-red-300 text-red-600"
											: "bg-gray-50 border-gray-300 text-gray-600"
							}`}
						>
							{autoSaveStatus === "saving" && (
								<>
									<div className="w-2.5 h-2.5 mr-1.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
									Saving...
								</>
							)}
							{autoSaveStatus === "saved" && (
								<>
									<CheckCircle2 className="w-3 h-3 mr-1.5" />
									Saved
									{lastSaveTime && (
										<span className="text-xs ml-1">
											({lastSaveTime.toLocaleTimeString()})
										</span>
									)}
								</>
							)}
							{autoSaveStatus === "error" && (
								<>
									<XCircle className="w-3 h-3 mr-1.5" />
									{autoSaveError || "Save failed"}
								</>
							)}
							{autoSaveStatus === "idle" && (
								<>
									<Clock className="w-3 h-3 mr-1.5" />
									Auto-save enabled
								</>
							)}
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
									{/* Test Name - Full Width */}
									<FormField
										control={form.control}
										name="testName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
													<BookOpen className="w-3.5 h-3.5 text-primary-dark" />
													Test Name *
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., SAT Math Practice - Algebra"
														className="h-10 border-2 border-border hover:border-primary-dark/50 focus:border-primary-dark transition-colors rounded-lg font-medium"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

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
														onValueChange={field.onChange}
														value={field.value}
														placeholder="Select test type"
														satLabel={setTestName}
														options={
															isLoading
																? []
																: testData?.data.map(
																		(test: { id: string; name: string }) => ({
																			value: test.id,
																			label: test.name,
																		}),
																	) || []
														}
														disabled={isLoading || !!error}
													/>
													<FormMessage />
												</FormItem>
											)}
										/>

										{shouldShowSubject && (
											<FormField
												control={form.control}
												name="subject"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300">
															Subject *
														</FormLabel>
														<SearchableSelect
															onValueChange={field.onChange}
															value={field.value}
															placeholder="Select subject"
															emptyText="No subject found."
															searchPlaceholder="Search subjects..."
															loading={isSubjectsLoading}
															options={
																isSubjectsLoading
																	? []
																	: subjectsData?.data.map(
																			(subject: {
																				id: string;
																				name: string;
																			}) => ({
																				value: subject.id,
																				label: subject.name,
																			}),
																		) || []
															}
															disabled={
																isSubjectsLoading ||
																!!subjectsError ||
																!testType
															}
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
									</div>

									{/* Row 2: Duration and Status */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="duration"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
														<Clock className="w-3.5 h-3.5 text-blue-600" />
														Test Duration (minutes)
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., 30"
															type="number"
															className="h-10 border-2 border-border  rounded-lg"
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
						<Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 pb-0 p-0 backdrop-blur-sm">
							<CardContent className="p-3">
								<div className="flex items-center justify-between">
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
										onClick={() => appendSection({ name: "", modules: [] })}
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
												<FormField
													control={form.control}
													name={`sections.${sectionIdx}.direction`}
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<DirectionEditorDialog
																	value={field.value || ""}
																	onChange={field.onChange}
																	label="Section Direction"
																/>
															</FormControl>
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
											<ModuleFields
												sectionIdx={sectionIdx}
												form={form}
												questions={questions}
												isQuestionsLoading={isQuestionsLoading}
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
								disabled={createPracticeTest.isPending}
							>
								Reset
							</Button>
							<Button
								type="submit"
								className="rounded-lg px-8"
								disabled={createPracticeTest.isPending}
							>
								{createPracticeTest.isPending ? (
									<>
										<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Creating...
									</>
								) : (
									<>
										<CheckCircle2 className="w-4 h-4 mr-2" />
										Save Configuration
									</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

function ModuleFields({
	sectionIdx,
	form,
	questions,
	isQuestionsLoading,
}: {
	sectionIdx: number;
	form: any;
	questions: Array<{
		id: string;
		text: string;
		difficulty: string;
		domain: string;
		skill: string;
	}>;
	isQuestionsLoading: boolean;
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
												<DirectionEditorDialog
													value={field.value || ""}
													onChange={field.onChange}
													label="Module Direction"
													triggerClassName="w-full h-8 text-xs"
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
											questions={questions}
											questionSet={1}
											isLoading={isQuestionsLoading}
										/>
										<SelectedQuestionsList
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questions}
											questionSet={1}
										/>
									</div>

									{/* Question Set 2 */}
									<div className="space-y-2">
										<QuestionTableDialog
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questions}
											questionSet={2}
											isLoading={isQuestionsLoading}
										/>
										<SelectedQuestionsList
											sectionIdx={sectionIdx}
											moduleIdx={moduleIdx}
											form={form}
											questions={questions}
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
	questions: Array<{
		id: string;
		text: string;
		difficulty: string;
		domain: string;
		skill: string;
	}>;
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

	// const text = row.original.text;
	// 			const stripped = text && text.replace(/<[^>]*>/g, "");

	if (selectedQuestions.length === 0) {
		return (
			<div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center">
				<p className="text-xs text-muted-foreground">No questions selected</p>
			</div>
		);
	}

	return (
		<div className="space-y-1.5 max-h-[200px] overflow-y-auto border rounded-lg p-2 bg-muted/20">
			{selectedQuestions.map((question: any) => {
				const text = question.text;
				const stripped = text.replace(/<[^>]*>/g, "");
				return (
					<div
						key={question.id}
						className="flex items-start gap-2 p-2 bg-background border border-border rounded-lg hover:border-violet-300 transition-colors group"
					>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium truncate">{stripped}</p>
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
				);
			})}
		</div>
	);
}
