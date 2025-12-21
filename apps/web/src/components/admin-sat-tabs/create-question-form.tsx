"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ZCQuestion } from "@prepexcellence/shared-validators";
import {
	Eye,
	FileQuestion,
	GripVertical,
	Plus,
	RotateCcw,
	Save,
	Sparkles,
	Trash2,
	Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import RichTextEditor, {
	type RichTextEditorRef,
} from "@/components/jodit-editor";
import { AsyncSearchableSelect } from "@/components/ui/async-searchable-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuestion } from "@/hooks/question-back";
import {
	useGetDomains,
	useGetSkills,
	useGetSubjects,
	useGetTestTypes,
} from "@/hooks/sat-practice";
import { cn } from "@/lib/utils";

const questionTypes = [
	{ value: "SINGLE_CHOICE", label: "Single Choice" },
	{ value: "MULTIPLE_CHOICE", label: "Multiple Select" },
	{ value: "TRUE_FALSE", label: "True/False" },
	{ value: "FILL_IN_THE_BLANK", label: "Fill in the Blank" },
	{ value: "SHORT_ANSWER", label: "Short Answer" },
	// { value: "matching", label: "Matching" },
];

type FormValues = z.infer<typeof ZCQuestion>;

type FillBlank = {
	id: number;
	answer: string;
	alternatives: string[];
};

export function CreateQuestionForm() {
	const editorRef = useRef<RichTextEditorRef>(null);
	const [options, setOptions] = useState<string[]>(["", "", "", ""]);
	// ])
	const [fillBlanks, setFillBlanks] = useState<FillBlank[]>([]);
	const [showPreview, setShowPreview] = useState(false);
	const [blankCounter, setBlankCounter] = useState(0);

	// Search states for async selects
	const [testTypeSearch, setTestTypeSearch] = useState("");
	const [subjectSearch, setSubjectSearch] = useState("");
	const [domainSearch, setDomainSearch] = useState("");
	const [skillsSearch, setSkillsSearch] = useState("");

	// API hooks
	const { data: testTypesData, isLoading: testTypesLoading } = useGetTestTypes({
		search: testTypeSearch,
		limit: 50,
	});
	const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects({
		search: subjectSearch,
		limit: 50,
	});
	const { data: domainsData, isLoading: domainsLoading } = useGetDomains({
		search: domainSearch,
		limit: 50,
	});
	const { data: skillsData, isLoading: skillsLoading } = useGetSkills({
		search: skillsSearch,
		limit: 50,
	});

	// Create question mutation
	const createQuestion = useCreateQuestion();

	const form = useForm<FormValues>({
		resolver: zodResolver(ZCQuestion),
		defaultValues: {
			testTypeId: "",
			subjectId: "",
			difficulty: "EASY",
			domainId: "",
			skillId: "",
			optionType: "SINGLE_CHOICE",
			content: "",
			options: [],
			correctAnswer: "",
			fillBlanks: [],
			points: 1,
		},
	});

	const optionType = form.watch("optionType");
	const questionText = form.watch("content");

	useEffect(() => {
		if (optionType === "FILL_IN_THE_BLANK") {
			// Match both HTML span format and plain text format
			const htmlBlankPattern = /\[Blank[:\s]*(\d+)\]/gi;
			const matches = [...questionText.matchAll(htmlBlankPattern)];

			// Extract unique blank numbers
			const blankNumbers = [
				...new Set(matches.map((m) => Number.parseInt(m[1], 10))),
			].sort((a, b) => a - b);
			const blankCount = blankNumbers.length;

			// Update fillBlanks array to match detected blanks
			setFillBlanks((prev) => {
				const newBlanks: FillBlank[] = [];
				for (let i = 0; i < blankCount; i++) {
					const blankNum = blankNumbers[i];
					const existingBlank = prev.find((b) => b.id === blankNum);
					if (existingBlank) {
						newBlanks.push(existingBlank);
					} else {
						newBlanks.push({ id: blankNum, answer: "", alternatives: [] });
					}
				}
				return newBlanks;
			});

			// Update counter to be at least the max blank number
			if (blankNumbers.length > 0) {
				const maxBlankNum = Math.max(...blankNumbers);
				setBlankCounter((prev) => Math.max(prev, maxBlankNum));
			}
		}
	}, [questionText, optionType]);

	useEffect(() => {
		if (optionType !== "FILL_IN_THE_BLANK") {
			setFillBlanks([]);
			setBlankCounter(0);
		}
	}, [optionType]);

	const insertBlank = () => {
		const newBlankNumber = blankCounter + 1;
		setBlankCounter(newBlankNumber);

		// Create inline blank HTML with proper spacing
		const blankHtml = `<span style="background-color: #e0f2fe; padding: 2px 12px; border-radius: 4px; border: 1px solid #0ea5e9; font-weight: 600; color: #0369a1; margin: 0 2px; display: inline-block;">[Blank: ${newBlankNumber}]</span>&nbsp;`;

		// Use editor ref to insert at cursor position
		if (editorRef.current) {
			editorRef.current.insertHTML(blankHtml);
		}
	};

	const updateBlankAnswer = (index: number, answer: string) => {
		setFillBlanks((prev) => {
			const newBlanks = [...prev];
			newBlanks[index] = { ...newBlanks[index], answer };
			return newBlanks;
		});
	};

	const addAlternative = (blankIndex: number) => {
		setFillBlanks((prev) => {
			const newBlanks = [...prev];
			newBlanks[blankIndex] = {
				...newBlanks[blankIndex],
				alternatives: [...newBlanks[blankIndex].alternatives, ""],
			};
			return newBlanks;
		});
	};

	const updateAlternative = (
		blankIndex: number,
		altIndex: number,
		value: string,
	) => {
		setFillBlanks((prev) => {
			const newBlanks = [...prev];
			const newAlternatives = [...newBlanks[blankIndex].alternatives];
			newAlternatives[altIndex] = value;
			newBlanks[blankIndex] = {
				...newBlanks[blankIndex],
				alternatives: newAlternatives,
			};
			return newBlanks;
		});
	};

	const removeAlternative = (blankIndex: number, altIndex: number) => {
		setFillBlanks((prev) => {
			const newBlanks = [...prev];
			newBlanks[blankIndex] = {
				...newBlanks[blankIndex],
				alternatives: newBlanks[blankIndex].alternatives.filter(
					(_, i) => i !== altIndex,
				),
			};
			return newBlanks;
		});
	};

	const renderQuestionPreview = () => {
		if (!questionText) return null;

		// Create a temporary element to decode HTML entities and get clean text
		const decodeHTML = (html: string) => {
			if (typeof document === "undefined") {
				// Handle server-side rendering
				return html
					.replace(/&amp;/g, "&")
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">")
					.replace(/&quot;/g, '"')
					.replace(/&#039;/g, "'");
			}
			const txt = document.createElement("textarea");
			txt.innerHTML = html;
			return txt.value;
		};

		// First decode HTML entities, then process
		let processedText = questionText
			// Replace blank spans with markers
			.replace(
				/<span[^>]*class="[^"]*blank-marker[^"]*"[^>]*>\s*\[Blank[:\s]*(\d+)\]\s*<\/span>/gi,
				"___BLANK_$1___",
			)
			.replace(
				/<span[^>]*>\s*\[Blank[:\s]*(\d+)\]\s*<\/span>/gi,
				"___BLANK_$1___",
			)
			// Handle plain text blanks
			.replace(/\[Blank[:\s]*(\d+)\]/gi, "___BLANK_$1___");

		// Remove remaining HTML tags
		processedText = processedText.replace(/<[^>]+>/g, " ");

		// Decode HTML entities
		processedText = decodeHTML(processedText);

		// Clean up whitespace
		processedText = processedText.replace(/\s+/g, " ").trim();

		// Restore blank markers
		processedText = processedText.replace(/___BLANK_(\d+)___/g, "[BLANK_$1]");

		const parts = processedText.split(/(\[BLANK_\d+\])/g).filter(Boolean);

		return (
			<div className="p-2 rounded-2xl dark:from-amber-950/30 dark:to-orange-950/20  dark:border-amber-800/50 shadow-sm">
				<div className="flex items-center gap-2 mb-4">
					<div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50">
						<Eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
					</div>
					<span className="text-sm font-bold text-amber-800 dark:text-amber-300">
						Live Preview
					</span>
				</div>
				<div className="p-4 rounded-xl bg-white dark:bg-background border border-amber-100 dark:border-amber-900/30">
					<p className="text-base leading-loose text-foreground font-medium">
						{parts.map((part, i) => {
							const blankMatch = part.match(/\[BLANK_(\d+)\]/);
							if (blankMatch) {
								const blankNum = Number.parseInt(blankMatch[1], 10);
								const blankData = fillBlanks.find((b) => b.id === blankNum);
								const hasAnswer =
									blankData?.answer && blankData.answer.trim() !== "";
								return (
									<span
										key={i}
										className={cn(
											"inline-flex items-center justify-center min-w-[100px] px-4 py-0 mx-1 rounded-lg font-bold transition-all",
											hasAnswer
												? "bg-emerald-100 dark:bg-emerald-900/40 border-b-2 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
												: "bg-gray-100 dark:bg-gray-800 border-b-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500",
										)}
									>
										{hasAnswer ? blankData.answer : `Blank ${blankNum}`}
									</span>
								);
							}
							return <span key={i}>{part}</span>;
						})}
					</p>
				</div>
			</div>
		);
	};

	const onSubmit = async (data: FormValues) => {
		try {
			// Prepare submission data based on question type
			const submitData: any = {
				testTypeId: data.testTypeId,
				subjectId: data.subjectId,
				difficulty: data.difficulty,
				domainId: data.domainId,
				skillId: data.skillId,
				optionType: data.optionType,
				content: data.content,
				points: data.points,
			};

			// Handle different question types
			switch (optionType) {
				case "SINGLE_CHOICE":
					submitData.options = options.filter(Boolean);
					submitData.correctAnswer = data.correctAnswer; // Index as string
					break;

				case "MULTIPLE_CHOICE":
					submitData.options = options.filter(Boolean);
					submitData.correctAnswer = Array.isArray(data.correctAnswer)
						? data.correctAnswer
						: [data.correctAnswer]; // Array of indices
					break;

				case "TRUE_FALSE":
					// Don't need to send options for TRUE_FALSE, backend auto-generates them
					submitData.options = undefined;
					submitData.correctAnswer = data.correctAnswer; // "true" or "false"
					break;

				case "FILL_IN_THE_BLANK":
					submitData.options = undefined;
					submitData.correctAnswer = undefined;
					submitData.fillBlanks = fillBlanks.map((blank) => ({
						id: blank.id,
						answer: blank.answer,
						alternatives: blank.alternatives.filter(Boolean),
					}));
					break;

				case "SHORT_ANSWER":
					submitData.options = undefined;
					submitData.correctAnswer = data.correctAnswer; // Text answer
					break;

				default:
					throw new Error("Invalid question type");
			}

			console.log("Submitting data:", submitData);

			// Submit to API
			await createQuestion.mutateAsync(submitData);

			// Show success toast
			toast.success("Question created successfully!", {
				description: "The question has been added to the question bank.",
			});

			// Reset form
			form.reset();
			setOptions(["", "", "", ""]);
			setFillBlanks([]);
			setBlankCounter(0);
		} catch (error: any) {
			// Show error toast
			toast.error("Failed to create question", {
				description:
					error?.response?.data?.message ||
					error?.message ||
					"Please try again later.",
			});
			console.error("Error creating question:", error);
		}
	};

	// Render options based on question type
	const renderOptionsSection = () => {
		switch (optionType) {
			case "SINGLE_CHOICE":
			case "MULTIPLE_CHOICE":
				return (
					<Card className="border-0 shadow-md bg-card pb-4">
						<CardHeader className="pb-0 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-blue-500/10 border border-blue-200 dark:border-blue-800">
									<FileQuestion className="w-5 h-5 text-primary-dark" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold text-primary-dark dark:text-foreground">
										Answer Options
									</CardTitle>
									<CardDescription className="text-xs">
										Add possible answers for students to choose from
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-1 max-h-[330px] overflow-y-auto">
							{options.map((option, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-2 rounded-xl bg-muted/10 border border-border/50 hover:border-primary/30 transition-colors group"
								>
									<GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab group-hover:text-muted-foreground transition-colors" />
									<div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-dark/30 text-gray-900  text-sm font-bold">
										{String.fromCharCode(65 + index)}
									</div>
									<Input
										placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
										value={option}
										onChange={(e) => updateOption(index, e.target.value)}
										className="flex-1 h-11 rounded-xl border-0 bg-background shadow-sm"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeOption(index)}
										disabled={options.length <= 2}
										className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={addOption}
								className="w-full mt-3 h-12 rounded-xl border-dashed border-2 "
							>
								<Plus className="w-4 h-4 mr-2" />
								Add Another Option
							</Button>
						</CardContent>
					</Card>
				);

			case "TRUE_FALSE":
				return (
					<Card className="border-0 shadow-sm bg-card">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-primary/10">
									<FileQuestion className="w-5 h-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold">
										Options
									</CardTitle>
									<CardDescription className="text-sm">
										True or False question type
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex gap-4">
								<div className="flex-1 p-5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 text-center font-semibold text-emerald-700">
									True
								</div>
								<div className="flex-1 p-5 rounded-xl bg-rose-500/10 border-2 border-rose-500/30 text-center font-semibold text-rose-700">
									False
								</div>
							</div>
						</CardContent>
					</Card>
				);

			case "FILL_IN_THE_BLANK":
				return (
					<Card className="border-0 shadow-sm bg-card max-h-[450px] overflow-y-auto">
						<CardHeader className="pb-0">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-xl bg-primary/10">
										<Type className="w-5 h-5 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold">
											Blanks Configuration
										</CardTitle>
										<CardDescription className="text-sm">
											Configure answers for each blank
										</CardDescription>
									</div>
								</div>
								<Badge
									variant="secondary"
									className="rounded-full px-3 py-1 font-semibold"
								>
									{fillBlanks.length} blank{fillBlanks.length !== 1 ? "s" : ""}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border border-sky-200 dark:border-sky-800">
								<p className="text-sm text-sky-800 dark:text-sky-200 mb-3 font-medium">
									Position your cursor in the editor where you want the blank,
									then click the button below.
								</p>
								<Button
									type="button"
									variant="default"
									size="sm"
									onClick={insertBlank}
									className="rounded-full shadow-md bg-sky-600 hover:bg-sky-700"
								>
									<Sparkles className="w-4 h-4 mr-2" />
									Insert Blank at Cursor
								</Button>
							</div>

							{fillBlanks.length === 0 ? (
								<div className="text-center py-10 text-muted-foreground">
									<div className="w-16 h-16 rounded-2xl bg-muted/10 flex items-center justify-center mx-auto mb-4">
										<Type className="w-8 h-8 opacity-40" />
									</div>
									<p className="font-medium">No blanks added yet</p>
									<p className="text-sm mt-1">
										Add blanks to your question to configure answers
									</p>
								</div>
							) : (
								<div className="space-y-2">
									{fillBlanks.map((blank, index) => (
										<div
											key={blank.id}
											className="p-2 rounded-xl bg-muted/10 border border-border/50 space-y-1"
										>
											<div className="flex items-center gap-2">
												<div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
													{blank.id}
												</div>
												<Label className="font-semibold">
													Blank {blank.id}
												</Label>
											</div>

											<div>
												<Label className="text-sm text-muted-foreground mb-2 block">
													Primary Answer
												</Label>
												<Input
													placeholder="Enter the correct answer"
													value={blank.answer}
													onChange={(e) =>
														updateBlankAnswer(index, e.target.value)
													}
													className="h-11 rounded-xl"
												/>
											</div>

											{blank.alternatives.length > 0 && (
												<div className="space-y-2">
													<Label className="text-sm text-muted-foreground">
														Alternative Answers
													</Label>
													{blank.alternatives.map((alt, altIndex) => (
														<div
															key={altIndex}
															className="flex items-center gap-2"
														>
															<Input
																placeholder={`Alternative ${altIndex + 1}`}
																value={alt}
																onChange={(e) =>
																	updateAlternative(
																		index,
																		altIndex,
																		e.target.value,
																	)
																}
																className="h-10 rounded-xl flex-1"
															/>
															<Button
																type="button"
																variant="ghost"
																size="icon"
																onClick={() =>
																	removeAlternative(index, altIndex)
																}
																className="h-10 w-10 text-muted-foreground hover:text-destructive rounded-xl"
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
													))}
												</div>
											)}

											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => addAlternative(index)}
												className="text-muted-foreground hover:text-foreground"
											>
												<Plus className="w-4 h-4 mr-1.5" />
												Add Alternative
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				);

			case "SHORT_ANSWER":
				return (
					<Card className="border-0 shadow-sm bg-card">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-primary/10">
									<FileQuestion className="w-5 h-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold">
										Answer Guidelines
									</CardTitle>
									<CardDescription className="text-sm">
										Short answer response type
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
								<p className="text-sm text-amber-800 font-medium">
									Students will provide a written response to this question. Be
									clear about expected answer length and format.
								</p>
							</div>
						</CardContent>
					</Card>
				);

			default:
				return null;
		}
	};

	// Render answer section based on question type
	const renderAnswerSection = () => {
		switch (optionType) {
			case "SINGLE_CHOICE":
				return (
					<Card className="border-0 shadow-md bg-card">
						<CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
									<Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
								</div>
								<div>
									<CardTitle className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
										Correct Answer
									</CardTitle>
									<CardDescription className="text-xs">
										Select the right answer
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="correctAnswer"
								render={({ field }) => (
									<FormItem>
										<FormControl className="space-y-1 max-h-[330px] overflow-y-auto">
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value as string}
											>
												{options.map((option, index) => (
													<div
														key={index}
														className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
															field.value === String.fromCharCode(65 + index)
																? "border-emerald-500 bg-emerald-500/10"
																: "border-transparent bg-muted/10 hover:border-border"
														}`}
													>
														<RadioGroupItem
															value={String(index)}
															id={`answer-${index}`}
														/>
														<Label
															htmlFor={`answer-${index}`}
															className="flex-1 cursor-pointer font-medium"
														>
															<span className="text-primary-dark font-bold mr-2">
																{String.fromCharCode(65 + index)}.
															</span>
															{option ||
																`Option ${String.fromCharCode(65 + index)}`}
														</Label>
													</div>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
				);

			case "MULTIPLE_CHOICE":
				return (
					<Card className="border-0 shadow-sm bg-card">
						<CardHeader className=" bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-b">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-emerald-500/10">
									<Sparkles className="w-5 h-5 text-emerald-600" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold">
										Correct Answers
									</CardTitle>
									<CardDescription className="text-sm">
										Select all that apply
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="correctAnswer"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="space-y-2">
												{options.map((option, index) => {
													const value = String(index);
													const currentValues = Array.isArray(field.value)
														? field.value
														: [];
													const isChecked = currentValues.includes(value);
													return (
														<div
															key={index}
															className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
																isChecked
																	? "border-emerald-500 bg-emerald-500/10"
																	: "border-transparent bg-muted/10 hover:border-border"
															}`}
														>
															<Checkbox
																id={`answer-${index}`}
																checked={isChecked}
																onCheckedChange={(checked) => {
																	if (checked) {
																		field.onChange([...currentValues, value]);
																	} else {
																		field.onChange(
																			currentValues.filter((v) => v !== value),
																		);
																	}
																}}
															/>
															<Label
																htmlFor={`answer-${index}`}
																className="flex-1 cursor-pointer font-medium"
															>
																<span className="text-primary font-bold mr-2">
																	{value}.
																</span>
																{option || `Option ${value}`}
															</Label>
														</div>
													);
												})}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
				);

			case "TRUE_FALSE":
				return (
					<Card className="border-0 shadow-sm bg-card">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-emerald-500/10">
									<Sparkles className="w-5 h-5 text-emerald-600" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold">
										Correct Answer
									</CardTitle>
									<CardDescription className="text-sm">
										Select the correct response
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="correctAnswer"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value as string}
												className="flex gap-4"
											>
												<div className="flex-1">
													<RadioGroupItem
														value="True"
														id={"answer-true"}
														className="peer sr-only"
													/>
													<Label
														htmlFor="answer-true"
														className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all font-semibold ${
															field.value === "True"
																? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
																: "border-border hover:border-emerald-500/50"
														}`}
													>
														True
													</Label>
												</div>
												<div className="flex-1">
													<RadioGroupItem
														value="False"
														id={`answer-false`}
														className="peer sr-only"
													/>
													<Label
														htmlFor="answer-false"
														className={`flex items-center justify-center p-5 rounded-xl border-2 cursor-pointer transition-all font-semibold ${
															field.value === "False"
																? "border-rose-500 bg-rose-500/10 text-rose-700"
																: "border-border hover:border-rose-500/50"
														}`}
													>
														False
													</Label>
												</div>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
				);

			case "FILL_IN_THE_BLANK":
				return (
					<Card className="border-0 shadow-sm bg-card max-h-[450px] overflow-y-auto">
						<CardHeader className="pb-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-xl bg-emerald-500/10">
										<Eye className="w-5 h-5 text-emerald-600" />
									</div>
									<div>
										<CardTitle className="text-lg font-semibold">
											Answer Preview
										</CardTitle>
										<CardDescription className="text-sm">
											See how the question looks
										</CardDescription>
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setShowPreview(!showPreview)}
									className="rounded-full"
								>
									<Eye className="w-4 h-4 mr-1.5" />
									{showPreview ? "Hide" : "Show"}
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{showPreview && renderQuestionPreview()}

							{fillBlanks.length > 0 ? (
								<div className="space-y-3">
									<Label className="text-sm font-medium text-muted-foreground">
										Answer Summary
									</Label>
									<div className="space-y-2">
										{fillBlanks.map((blank, index) => (
											<div
												key={blank.id}
												className="flex items-start gap-3 p-2 rounded-xl bg-muted/10 border border-border/50"
											>
												<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground text-xs font-bold shrink-0">
													{index + 1}
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-semibold">
														{blank.answer || (
															<span className="text-muted-foreground italic font-normal">
																No answer set
															</span>
														)}
													</p>
													{blank.alternatives.filter(Boolean).length > 0 && (
														<div className="flex flex-wrap gap-1.5 mt-2">
															{blank.alternatives
																.filter(Boolean)
																.map((alt, i) => (
																	<Badge
																		key={i}
																		variant="outline"
																		className="text-xs rounded-full font-normal"
																	>
																		{alt}
																	</Badge>
																))}
														</div>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<p className="text-sm">
										Add blanks to your question to see the answer preview
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				);

			case "SHORT_ANSWER":
				return (
					<Card className="border-0 shadow-sm bg-card">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-emerald-500/10">
									<Sparkles className="w-5 h-5 text-emerald-600" />
								</div>
								<div>
									<CardTitle className="text-lg font-semibold">
										Model Answer
									</CardTitle>
									<CardDescription className="text-sm">
										Reference answer for grading
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<FormField
								control={form.control}
								name="correctAnswer"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder="Enter the model answer or key points..."
												value={field.value as string}
												onChange={field.onChange}
												className="min-h-[140px] rounded-xl resize-none"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>
				);

			default:
				return null;
		}
	};

	const addOption = () => {
		setOptions([...options, ""]);
	};

	const removeOption = (index: number) => {
		if (options.length > 2) {
			setOptions(options.filter((_, i) => i !== index));
		}
	};

	const updateOption = (index: number, value: string) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	return (
		<div className=" ">
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Main Content Grid */}
						<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
							{/* Left Column - Question Details */}
							<div className="xl:col-span-2 space-y-6">
								<Card className="border-0 shadow-lg bg-card overflow-hidden pb-6">
									<CardHeader className="bg-gradient-to-r from-primary-50 to-primary-50 dark:from-violet-950/30 dark:to-purple-950/30 border-b">
										<CardTitle className="text-lg font-semibold text-primary-dark dark:text-violet-100">
											Question Details
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
											<FormField
												control={form.control}
												name="testTypeId"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Test Type *
														</FormLabel>
														<FormControl>
															<AsyncSearchableSelect
																options={
																	testTypesData?.data?.map((item: any) => ({
																		value: item.id,
																		label: item.name,
																	})) || []
																}
																value={field.value}
																onValueChange={field.onChange}
																onSearchChange={setTestTypeSearch}
																isLoading={testTypesLoading}
																placeholder="Select test type"
																searchPlaceholder="Search test types..."
																emptyText="No test type found."
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="subjectId"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Subject *
														</FormLabel>

														<FormControl>
															<AsyncSearchableSelect
																options={
																	subjectsData?.data?.map((item: any) => ({
																		value: item.id,
																		label: item.name,
																	})) || []
																}
																value={field.value}
																onValueChange={field.onChange}
																onSearchChange={setSubjectSearch}
																isLoading={subjectsLoading}
																placeholder="Select subject"
																searchPlaceholder="Search subjects..."
																emptyText="No subject found."
															/>
														</FormControl>

														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="difficulty"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Difficulty *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className=" w-full ">
																	<SelectValue placeholder="Select level" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="EASY">Easy</SelectItem>
																<SelectItem value="MEDIUM">Medium</SelectItem>
																<SelectItem value="HARD">Hard</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="domainId"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Domain *
														</FormLabel>
														<FormControl>
															<AsyncSearchableSelect
																options={
																	domainsData?.data?.map((item: any) => ({
																		value: item.id,
																		label: item.name,
																	})) || []
																}
																value={field.value}
																onValueChange={field.onChange}
																onSearchChange={setDomainSearch}
																isLoading={domainsLoading}
																placeholder="Select domain"
																searchPlaceholder="Search domains..."
																emptyText="No domain found."
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="skillId"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Skills *
														</FormLabel>
														<FormControl>
															<AsyncSearchableSelect
																options={
																	skillsData?.data?.map((item: any) => ({
																		value: item.id,
																		label: item.name,
																	})) || []
																}
																value={field.value}
																onValueChange={field.onChange}
																onSearchChange={setSkillsSearch}
																isLoading={skillsLoading}
																placeholder="Select skill"
																searchPlaceholder="Search skills..."
																emptyText="No skill found."
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="optionType"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Question Type *
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger className="w-full ">
																	<SelectValue placeholder="Select type" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{questionTypes.map((type) => (
																	<SelectItem
																		key={type.value}
																		value={type.value}
																	>
																		{type.label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											{/* // point inputfiled */}

											<FormField
												control={form.control}
												name="points"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="text-sm font-semibold text-foreground/90">
															Points *
														</FormLabel>
														<FormControl>
															<Input
																type="number"
																min={0}
																placeholder="e.g., 99"
																value={field.value === 0 ? "" : field.value}
																onChange={(e) => {
																	const val = e.target.value;
																	field.onChange(val === "" ? 0 : Number(val));
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<Separator className="my-6" />

										<FormField
											control={form.control}
											name="content"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base font-semibold flex items-center gap-2 text-foreground/90">
														Question Content *
														{optionType === "FILL_IN_THE_BLANK" && (
															<Badge
																variant="secondary"
																className="rounded-full text-xs font-normal  "
															>
																Use Insert Blank button below
															</Badge>
														)}
													</FormLabel>
													<FormControl>
														<div className=" border-border  overflow-hidden ">
															<RichTextEditor
																ref={editorRef}
																value={field.value}
																onChange={field.onChange}
																minHeight={280}
															/>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</div>

							{/* Right Column - Options and Answers */}
							<div className="xl:col-span-1 space-y-6">
								{renderOptionsSection()}
								{renderAnswerSection()}
							</div>
						</div>

						{/* <Card className="border-0 shadow-sm bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
              

                 
                 
              </CardContent>
            </Card> */}

						{/* Action Buttons */}
						<Card className="border-0 shadow-2xl bg-white sticky bottom-0 pb-0 py-4">
							<CardContent className="">
								<div className="flex items-center justify-between">
									<p className="text-sm text-muted-foreground">
										All required fields marked with{" "}
										<span className="text-destructive">*</span>
									</p>
									<div className="flex items-center gap-3">
										<Button
											type="button"
											variant="outline"
											className=""
											onClick={() => {
												form.reset();
												setOptions(["", "", "", ""]);
												setFillBlanks([]);
												setBlankCounter(0);
												// if (editorRef.current) {
												// 	editorRef.current.setContent("");
												// }
											}}
											disabled={createQuestion.isPending}
										>
											<RotateCcw className="w-4 h-4 mr-2" />
											Reset
										</Button>
										<Button
											type="submit"
											className=""
											disabled={createQuestion.isPending}
										>
											{createQuestion.isPending ? (
												<>
													<div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
													Creating...
												</>
											) : (
												<>
													<Save className="w-4 h-4 mr-2" />
													Create Question
												</>
											)}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</form>
				</Form>
			</div>
		</div>
	);
}
