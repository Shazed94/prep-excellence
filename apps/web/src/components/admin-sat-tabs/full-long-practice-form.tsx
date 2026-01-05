import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
	BookOpen,
	CheckCircle2,
	Clock,
	Coffee,
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
import { FullLengthQuestionTableDialog } from "./fullLengthTableDialog";


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
	direction: z.string().optional(),
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

export default function FullLengthPracticeBuilder({
	practiceId,
}: {
	practiceId?: string;
} = {}) {
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

	const submitPractice = useCreateSATPracticeTest();
	const { data: existingTestData, isLoading: isExistingLoading } =
		useGetSATPracticeTestById(practiceId || "");
	// Auto-save state management
	const [autoSaveStatus, setAutoSaveStatus] = React.useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const [lastSaveTime, setLastSaveTime] = React.useState<Date | null>(null);
	const [autoSaveError, setAutoSaveError] = React.useState<string | null>(null);
	const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
	const autoSaveIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

	const [typeName, setTestName] = React.useState<string | null>(null);

	const queryClient = useQueryClient();

	// Check if test type name includes "ap" (case-insensitive)
	const shouldShowSubject = typeName?.toLowerCase().includes("ap");

	const {
		fields: sections,
		append: appendSection,
		remove: removeSection,
	} = useFieldArray({
		control: form.control,
		name: "sections",
	});

	// Fetch test types and subjects from API
	const { data: testTypesData, isLoading: isLoadingTestTypes } =
		useGetTestTypes({
			limit: 100,
			sortBy: "order",
			orderBy: "asc",
		});
	const testTypes = testTypesData?.data || [];

	const testType = form.watch("testType");

	const {
		data: subjectsData,
		isLoading: isSubjectsLoading,
		error: subjectsError,
	} = useGetSubjects({
		limit: 100,
		filters: testType ? { testTypeId: testType } : undefined,
	});

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

	// Auto-save effect
	React.useEffect(() => {
		// Clear any existing timeout
		if (autoSaveTimeoutRef.current) {
			clearTimeout(autoSaveTimeoutRef.current);
		}

		// Set a timeout that will trigger auto-save after 5 seconds of no changes
		const timeout = setTimeout(async () => {
			// Only auto-save if we have required fields and the form is valid
			const formData = form.getValues();
			if (!formData.practiceName || !formData.testType) {
				return;
			}

			try {
				setAutoSaveStatus("saving");
				setAutoSaveError(null);

				const statusMap: Record<string, string> = {
					Draft: "DRAFT",
					Published: "PUBLISHED",
				};

				const payload: any = {
					name: formData.practiceName,
					testTypeId: formData.testType,
					practiceType: "FULL_LENGTH",
					status: statusMap[formData.status || "Draft"] || "DRAFT",
					sections: (formData.sections || []).map((section, sectionIdx) => ({
						name: section.name,
						duration: formData.totalDuration,
						orderIndex: sectionIdx,
						modules: (section.modules || []).map((module, moduleIdx) => ({
							name: module.name,
							threshold: module.score,
							duration: module.time,
							direction: module.direction,
							orderIndex: moduleIdx,
							questionsSetOneIds: module.easyQuestions || [],
							questionsSetTwoIds: module.hardQuestions || [],
						})),
					})),
				};

				if (practiceId) payload.id = practiceId;
				if (formData.subject) payload.subjectId = formData.subject;

				await submitPractice.mutateAsync(payload);

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
		}, 10000); // 5 seconds

		autoSaveTimeoutRef.current = timeout;

		// Cleanup timeout on unmount or when dependencies change
		return () => {
			if (autoSaveTimeoutRef.current) {
				clearTimeout(autoSaveTimeoutRef.current);
			}
		};
	}, [practiceId, form.getValues, submitPractice]);

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

	const onSubmit = (data: FormValues) => {
		// Basic validation (react-hook-form/Zod also handles this)
		if (!data.practiceName) {
			form.setError("practiceName", { message: "Practice name is required" });
			return;
		}
		if (!data.testType) {
			form.setError("testType", { message: "Test type is required" });
			return;
		}

		// Build payload matching backend expectations (similar to SAT builder)
		const statusMap: Record<string, string> = {
			Draft: "DRAFT",
			Published: "PUBLISHED",
		};

		const payload: any = {
			name: data.practiceName,
			testTypeId: data.testType,
			practiceType: "FULL_LENGTH",
			status: statusMap[data.status || "Draft"] || "DRAFT",
			sections: (data.sections || []).map((section, sectionIdx) => ({
				name: section.name,
				duration: data.totalDuration,
				direction: section.direction,
				orderIndex: sectionIdx,
				modules: (section.modules || []).map((module, moduleIdx) => ({
					name: module.name,
					threshold: module.score,
					duration: module.time,
					direction: module.direction,
					orderIndex: moduleIdx,
					questionsSetOneIds: module.easyQuestions || [],
					questionsSetTwoIds: module.hardQuestions || [],
				})),
			})),
		};

		if (practiceId) payload.id = practiceId;
		if (data.subject) payload.subjectId = data.subject;

		// Send to backend
		submitPractice
			.mutateAsync(payload)
			.then(() => {
				toast.success("Practice saved successfully!", {
					description: data.practiceName,
				});
				if (practiceId)
					queryClient.invalidateQueries({
						queryKey: ["sat-practice-test", practiceId],
					});
				form.reset();
			})
			.catch((err) => {
				console.error(err);
				const msg =
					err?.response?.data?.message ||
					err.message ||
					"Failed to save practice";
				toast.error(msg);
			});
	};

	// Build question list filtered by selected test type and subject (for dialogs)
	const testTypeForQuestions = form.watch("testType");
	const subjectForQuestions = form.watch("subject");

	const { data: questionsData, isLoading: isQuestionsLoading } =
		useGetQuestionsFiltered({
			limit: 1000,
			filters: {
				testTypeId: testTypeForQuestions,
				subjectId: subjectForQuestions,
			},
		});

	const questions =
		questionsData?.data?.map((q: any) => ({
			id: q.id,
			text: q.content || q.text || "",
			difficulty: q.difficulty?.toLowerCase() || "medium",
			domain: q.domain?.name || "Unknown",
			skill: q.skill?.name || "Unknown",
		})) || [];

	// When editing, hydrate form with existing data
	React.useEffect(() => {
		if (!practiceId) return;
		if (isExistingLoading) return;
		const test = existingTestData?.data;
		if (!test) return;

		const mapped = {
			practiceName: test.name || "",
			testType: test.testType?.id || "",
			subject: test.subject?.id || "",
			totalDuration:
				test.section && test.section.length > 0
					? test.section[0].duration || undefined
					: undefined,
			status: (test.status === "PUBLISHED"
				? "Published"
				: "Draft") as FormValues["status"],
			sections: (test.section || []).map((section: any) => ({
				name: section.name || "",
				direction: section.direction || undefined,
				breakTime: section.breakTime || 0,
				modules: (section.modules || []).map((m: any) => ({
					name: m.name || "",
					score: m.threshold || 0,
					time: m.duration || 0,
					direction: m.direction || undefined,
					nextModuleScore: m.nextModuleScore || undefined,
					easyQuestions: (m.questionsSetOne || []).map((q: any) => q.id),
					hardQuestions: (m.questionsSetTwo || []).map((q: any) => q.id),
				})),
			})),
		};

		form.reset(mapped);
	}, [practiceId, existingTestData, isExistingLoading, form.reset]);


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
													<SearchableSelect
														onValueChange={field.onChange}
														value={field.value}
														placeholder="Select test type"
														options={testTypes.map((tt: any) => ({
															value: tt.id,
															label: tt.name,
														}))}
														satLabel={setTestName}
														loading={isLoadingTestTypes}
														emptyText="No test type found."
														searchPlaceholder="Search test types..."
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
							>
								Reset
							</Button>
							<Button
								type="submit"
								disabled={submitPractice.isPending}
								className="rounded-lg px-8"
							>
								{submitPractice.isPending ? (
									<>
										<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Saving...
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
														field.onChange(
															e.target.value === ""
																? undefined
																: Number(e.target.value),
														)
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
														field.onChange(
															e.target.value === ""
																? 0
																: Number(e.target.value),
														)
													}
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
															e.target.value === ""
																? undefined
																: Number(e.target.value),
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
							</div>

							<QuestionSelection
								sectionIdx={sectionIdx}
								moduleIdx={moduleIdx}
								form={form}
								questions={questions}
								isQuestionsLoading={isQuestionsLoading}
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
	questions,
	isQuestionsLoading,
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
	isQuestionsLoading: boolean;
}) {
	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
				<Layers className="w-3.5 h-3.5 text-violet-600" />
				Question Sets
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div className="space-y-2">
					<FullLengthQuestionTableDialog
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

				<div className="space-y-2">
					<FullLengthQuestionTableDialog
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
	const fieldName = questionSet === 1 ? "easyQuestions" : "hardQuestions";
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
			{selectedQuestions.map((question: any) => {
				const text = question.text;
				const stripped = text?.replace(/<[^>]*>/g, "");
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
