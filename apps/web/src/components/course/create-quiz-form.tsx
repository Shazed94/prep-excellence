// // components/course/create-quiz-form.tsx
//

// import { zodResolver } from "@hookform/resolvers/zod";
// import {
// 	CheckCircle,
// 	ChevronLeft,
// 	ChevronRight,
// 	Copy,
// 	FileText,
// 	Hash,
// 	Plus,
// 	RefreshCw,
// 	Save,
// 	Trash2,
// 	X,
// } from "lucide-react";
// import { useState } from "react";
// import { useFieldArray, useForm } from "react-hook-form";
// import * as z from "zod";
// import RichTextEditor from "@/components/jodit-editor";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";

// // Define form schema for quiz creation
// // Note: This is a local schema for form handling, separate from API validation
// const questionSchema = z.object({
// 	id: z.number().optional(),
// 	question: z.string().min(10, "Question must be at least 10 characters"),
// 	questionType: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
// 	options: z.array(z.string()).optional(),
// 	correctAnswer: z.string(),
// 	points: z.number().int().positive().default(1),
// 	explanation: z.string().optional(),
// });

// const formSchema = z.object({
// 	title: z.string().min(3, "Title must be at least 3 characters").max(200),
// 	description: z.string().max(2000).default(""),
// 	orderIndex: z.number().int().min(0).default(0),
// 	passingScore: z.number().int().min(0).max(100).default(70),
// 	timeLimit: z.number().int().positive().optional(),
// 	maxAttempts: z.number().int().positive().optional(),
// 	shuffleQuestions: z.boolean().default(false),
// 	showResults: z.boolean().default(true),
// 	questions: z
// 		.array(questionSchema)
// 		.min(1, "At least one question is required"),
// 	moduleId: z.string(),
// });

// type FormValues = z.infer<typeof formSchema>;

// type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";

// interface Question {
// 	id: number;
// 	question: string;
// 	questionType: QuestionType;
// 	options?: string[];
// 	correctAnswer: string;
// 	points: number;
// 	explanation?: string;
// }

// interface CreateQuizFormProps {
// 	lessonId: string;
// 	moduleId: string;
// 	courseTitle?: string;
// 	lessonTitle?: string;
// 	moduleTitle?: string;
// 	onSaveSuccess?: () => void;
// }

// export function CreateQuizForm({
// 	moduleId,
// 	onSaveSuccess,
// }: CreateQuizFormProps) {
// 	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

// 	const form = useForm<FormValues>({
// 		resolver: zodResolver(formSchema),
// 		mode: "onChange",
// 		defaultValues: {
// 			title: "",
// 			description: "",
// 			orderIndex: 0,
// 			passingScore: 60,
// 			timeLimit: undefined,
// 			maxAttempts: undefined,
// 			shuffleQuestions: false,
// 			showResults: true,
// 			questions: [
// 				{
// 					id: 1,
// 					question: "",
// 					questionType: "MULTIPLE_CHOICE",
// 					options: ["", "", "", ""],
// 					correctAnswer: "",
// 					points: 1,
// 					explanation: "",
// 				},
// 			],
// 			moduleId,
// 		},
// 	} as any);

// 	const {
// 		fields: questionFields,
// 		append: appendQuestion,
// 		remove: removeQuestion,
// 		update: updateQuestion,
// 	} = useFieldArray({
// 		control: form.control,
// 		name: "questions",
// 	});

// 	const onSubmit = (data: FormValues) => {
// 		console.log("Form submitted:", data);
// 		if (onSaveSuccess) {
// 			onSaveSuccess();
// 		}
// 	};

// 	// Get current question from form
// 	const currentQuestion = form.watch(`questions.${currentQuestionIndex}`);
// 	const totalQuestions = questionFields.length;

// 	const addNewQuestion = () => {
// 		const newId =
// 			questionFields.length > 0
// 				? Math.max(...questionFields.map((q) => q.id || 0)) + 1
// 				: 1;

// 		appendQuestion({
// 			id: newId,
// 			question: "",
// 			questionType: "MULTIPLE_CHOICE",
// 			options: ["", "", "", ""],
// 			correctAnswer: "",
// 			points: 1,
// 			explanation: "",
// 		});
// 		setCurrentQuestionIndex(questionFields.length);
// 	};

// 	const removeCurrentQuestion = () => {
// 		if (questionFields.length > 1) {
// 			removeQuestion(currentQuestionIndex);

// 			if (currentQuestionIndex >= questionFields.length - 1) {
// 				setCurrentQuestionIndex(questionFields.length - 2);
// 			}
// 		}
// 	};

// 	const duplicateQuestion = () => {
// 		const questionToDuplicate = {
// 			...currentQuestion,
// 			id: Math.max(...questionFields.map((q) => q.id || 0)) + 1,
// 		};

// 		appendQuestion(questionToDuplicate);
// 		setCurrentQuestionIndex(questionFields.length);
// 	};

// 	const updateCurrentQuestion = (field: keyof Question, value: any) => {
// 		updateQuestion(currentQuestionIndex, {
// 			...currentQuestion,
// 			[field]: value,
// 		});
// 	};

// 	const updateOption = (optionIndex: number, value: string) => {
// 		const newOptions = [...(currentQuestion.options || [])];
// 		newOptions[optionIndex] = value;

// 		updateQuestion(currentQuestionIndex, {
// 			...currentQuestion,
// 			options: newOptions,
// 		});
// 	};

// 	const addOption = () => {
// 		const newOptions = [...(currentQuestion.options || []), ""];

// 		updateQuestion(currentQuestionIndex, {
// 			...currentQuestion,
// 			options: newOptions,
// 		});
// 	};

// 	const removeOption = (optionIndex: number) => {
// 		const newOptions = [...(currentQuestion.options || [])];
// 		if (newOptions.length > 2) {
// 			newOptions.splice(optionIndex, 1);

// 			updateQuestion(currentQuestionIndex, {
// 				...currentQuestion,
// 				options: newOptions,
// 			});

// 			// If the removed option was the correct answer, clear it
// 			if (
// 				currentQuestion.correctAnswer === String.fromCharCode(65 + optionIndex)
// 			) {
// 				updateQuestion(currentQuestionIndex, {
// 					...currentQuestion,
// 					correctAnswer: "",
// 					options: newOptions,
// 				});
// 			}
// 		}
// 	};

// 	const getQuestionPoints = (): number => {
// 		const questions = form.watch("questions");
// 		return questions.reduce((total, q) => total + q.points, 0);
// 	};

// 	const renderQuestionEditor = () => {
// 		if (!currentQuestion) return null;

// 		switch (currentQuestion.questionType) {
// 			case "MULTIPLE_CHOICE":
// 				return (
// 					<div className="space-y-4">
// 						<div className="space-y-3">
// 							<Label className="text-sm font-medium">Options</Label>
// 							{currentQuestion.options?.map((option, index) => (
// 								<div key={index} className="flex items-center gap-3 group">
// 									<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-medium shrink-0">
// 										{String.fromCharCode(65 + index)}
// 									</div>
// 									<Input
// 										placeholder={`Option ${String.fromCharCode(65 + index)}`}
// 										value={option}
// 										onChange={(e) => updateOption(index, e.target.value)}
// 										className="flex-1"
// 									/>
// 									<Button
// 										type="button"
// 										variant="ghost"
// 										size="icon"
// 										onClick={() => removeOption(index)}
// 										disabled={(currentQuestion.options?.length || 0) <= 2}
// 										className="opacity-0 group-hover:opacity-100 transition-opacity"
// 									>
// 										<X className="w-4 h-4" />
// 									</Button>
// 								</div>
// 							))}
// 							<Button
// 								type="button"
// 								variant="outline"
// 								onClick={addOption}
// 								className="w-full mt-2"
// 							>
// 								<Plus className="w-4 h-4 mr-2" />
// 								Add Option
// 							</Button>
// 						</div>

// 						<div className="space-y-3">
// 							<Label className="text-sm font-medium">Correct Answer</Label>
// 							<RadioGroup
// 								value={currentQuestion.correctAnswer}
// 								onValueChange={(value) =>
// 									updateCurrentQuestion("correctAnswer", value)
// 								}
// 							>
// 								<div className="grid grid-cols-2 gap-2">
// 									{currentQuestion.options?.map((option, index) => (
// 										<div key={index} className="flex items-center space-x-2">
// 											<RadioGroupItem
// 												value={String.fromCharCode(65 + index)}
// 												id={`option-${index}`}
// 											/>
// 											<Label
// 												htmlFor={`option-${index}`}
// 												className="cursor-pointer"
// 											>
// 												<span className="font-medium mr-1">
// 													{String.fromCharCode(65 + index)}.
// 												</span>
// 												{option || `Option ${String.fromCharCode(65 + index)}`}
// 											</Label>
// 										</div>
// 									))}
// 								</div>
// 							</RadioGroup>
// 						</div>
// 					</div>
// 				);

// 			case "TRUE_FALSE":
// 				return (
// 					<div className="space-y-4">
// 						<Label className="text-sm font-medium">Correct Answer</Label>
// 						<RadioGroup
// 							value={currentQuestion.correctAnswer}
// 							onValueChange={(value) =>
// 								updateCurrentQuestion("correctAnswer", value)
// 							}
// 						>
// 							<div className="flex gap-4">
// 								<div className="flex-1">
// 									<RadioGroupItem
// 										value="true"
// 										id="true-option"
// 										className="peer sr-only"
// 									/>
// 									<Label
// 										htmlFor="true-option"
// 										className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
// 											currentQuestion.correctAnswer === "true"
// 												? "border-emerald-500 bg-emerald-50 text-emerald-700"
// 												: "border-slate-200 hover:border-slate-300"
// 										}`}
// 									>
// 										True
// 									</Label>
// 								</div>
// 								<div className="flex-1">
// 									<RadioGroupItem
// 										value="false"
// 										id="false-option"
// 										className="peer sr-only"
// 									/>
// 									<Label
// 										htmlFor="false-option"
// 										className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
// 											currentQuestion.correctAnswer === "false"
// 												? "border-rose-500 bg-rose-50 text-rose-700"
// 												: "border-slate-200 hover:border-slate-300"
// 										}`}
// 									>
// 										False
// 									</Label>
// 								</div>
// 							</div>
// 						</RadioGroup>
// 					</div>
// 				);

// 			case "SHORT_ANSWER":
// 				return (
// 					<div className="space-y-4">
// 						<div className="space-y-3">
// 							<Label className="text-sm font-medium">Expected Answer</Label>
// 							<Textarea
// 								placeholder="Enter the expected answer or key points for grading..."
// 								value={currentQuestion.correctAnswer}
// 								onChange={(e) =>
// 									updateCurrentQuestion("correctAnswer", e.target.value)
// 								}
// 								className="min-h-[100px]"
// 							/>
// 						</div>
// 					</div>
// 				);

// 			default:
// 				return null;
// 		}
// 	};

// 	const renderQuestionPreview = () => {
// 		if (!currentQuestion) return null;

// 		return (
// 			<Card className="border-slate-200">
// 				<CardHeader className="pb-3">
// 					<CardTitle className="text-base flex items-center justify-between">
// 						<span>
// 							Question {currentQuestionIndex + 1} of {totalQuestions}
// 						</span>
// 						<Badge variant="outline" className="font-normal">
// 							{currentQuestion.questionType.replace("_", " ")}
// 						</Badge>
// 					</CardTitle>
// 					<CardDescription>
// 						{currentQuestion.question ? (
// 							<div
// 								className="prose prose-sm max-w-none"
// 								// dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
// 							/>
// 						) : (
// 							"No question content yet"
// 						)}
// 					</CardDescription>
// 				</CardHeader>
// 				{currentQuestion.questionType === "MULTIPLE_CHOICE" &&
// 					currentQuestion.options && (
// 						<CardContent className="space-y-2">
// 							{currentQuestion.options.map((option, index) => (
// 								<div
// 									key={index}
// 									className={`p-3 rounded-lg border ${
// 										currentQuestion.correctAnswer ===
// 										String.fromCharCode(65 + index)
// 											? "border-emerald-500 bg-emerald-50"
// 											: "border-slate-200"
// 									}`}
// 								>
// 									<div className="flex items-center">
// 										<div
// 											className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
// 												currentQuestion.correctAnswer ===
// 												String.fromCharCode(65 + index)
// 													? "bg-emerald-500 text-white"
// 													: "bg-slate-100 text-slate-600"
// 											}`}
// 										>
// 											{String.fromCharCode(65 + index)}
// 										</div>
// 										<span>
// 											{option || `Option ${String.fromCharCode(65 + index)}`}
// 										</span>
// 									</div>
// 								</div>
// 							))}
// 						</CardContent>
// 					)}
// 				{currentQuestion.explanation && (
// 					<CardFooter className="pt-4 border-t">
// 						<div className="text-sm">
// 							<span className="font-medium">Explanation:</span>{" "}
// 							{currentQuestion.explanation}
// 						</div>
// 					</CardFooter>
// 				)}
// 			</Card>
// 		);
// 	};

// 	return (
// 		<Form {...form}>
// 			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
// 				{/* Quiz Settings Section */}
// 				<Card>
// 					<CardHeader>
// 						<CardTitle className="text-lg">Quiz Settings</CardTitle>
// 						<CardDescription>
// 							Configure the basic settings for your quiz
// 						</CardDescription>
// 					</CardHeader>
// 					<CardContent className="space-y-4">
// 						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 							<FormField
// 								control={form.control}
// 								name="title"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Quiz Title *</FormLabel>
// 										<FormControl>
// 											<Input placeholder="Enter quiz title" {...field} />
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="orderIndex"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Order Index</FormLabel>
// 										<FormControl>
// 											<Input
// 												type="number"
// 												min={0}
// 												placeholder="0"
// 												{...field}
// 												onChange={(e) =>
// 													field.onChange(parseInt(e.target.value) || 0)
// 												}
// 											/>
// 										</FormControl>
// 										<FormDescription>
// 											Determines the order within the lesson
// 										</FormDescription>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>
// 						</div>

// 						<FormField
// 							control={form.control}
// 							name="description"
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Description</FormLabel>
// 									<FormControl>
// 										<Textarea
// 											placeholder="Brief description of the quiz..."
// 											className="min-h-20"
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>

// 						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 							<FormField
// 								control={form.control}
// 								name="passingScore"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Passing Score (%) *</FormLabel>
// 										<FormControl>
// 											<Input
// 												type="number"
// 												min={0}
// 												max={100}
// 												placeholder="60"
// 												{...field}
// 												onChange={(e) =>
// 													field.onChange(parseInt(e.target.value) || 0)
// 												}
// 											/>
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="timeLimit"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Time Limit (minutes)</FormLabel>
// 										<FormControl>
// 											<Input
// 												type="number"
// 												min={1}
// 												placeholder="Optional"
// 												value={field.value || ""}
// 												onChange={(e) =>
// 													field.onChange(
// 														e.target.value
// 															? parseInt(e.target.value)
// 															: undefined,
// 													)
// 												}
// 											/>
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="maxAttempts"
// 								render={({ field }) => (
// 									<FormItem>
// 										<FormLabel>Max Attempts</FormLabel>
// 										<FormControl>
// 											<Input
// 												type="number"
// 												min={1}
// 												placeholder="Unlimited"
// 												value={field.value || ""}
// 												onChange={(e) =>
// 													field.onChange(
// 														e.target.value
// 															? parseInt(e.target.value)
// 															: undefined,
// 													)
// 												}
// 											/>
// 										</FormControl>
// 										<FormMessage />
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="shuffleQuestions"
// 								render={({ field }) => (
// 									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
// 										<div className="space-y-0.5">
// 											<FormLabel className="text-base">
// 												Shuffle Questions
// 											</FormLabel>
// 										</div>
// 										<FormControl>
// 											<Switch
// 												checked={field.value}
// 												onCheckedChange={field.onChange}
// 											/>
// 										</FormControl>
// 									</FormItem>
// 								)}
// 							/>

// 							<FormField
// 								control={form.control}
// 								name="showResults"
// 								render={({ field }) => (
// 									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
// 										<div className="space-y-0.5">
// 											<FormLabel className="text-base">Show Results</FormLabel>
// 										</div>
// 										<FormControl>
// 											<Switch
// 												checked={field.value}
// 												onCheckedChange={field.onChange}
// 											/>
// 										</FormControl>
// 									</FormItem>
// 								)}
// 							/>
// 						</div>
// 					</CardContent>
// 				</Card>

// 				{/* Questions Section */}
// 				<Card>
// 					<CardHeader>
// 						<div className="flex items-center justify-between">
// 							<div>
// 								<CardTitle className="text-lg">Questions</CardTitle>
// 								<CardDescription>
// 									Add and manage quiz questions ({totalQuestions} questions,{" "}
// 									{getQuestionPoints()} total points)
// 								</CardDescription>
// 							</div>
// 							<Button type="button" onClick={addNewQuestion} className="gap-2">
// 								<Plus className="w-4 h-4" />
// 								Add Question
// 							</Button>
// 						</div>
// 					</CardHeader>

// 					<CardContent className="space-y-6">
// 						{/* Question Navigation */}
// 						{totalQuestions > 1 && (
// 							<div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
// 								<Button
// 									type="button"
// 									variant="outline"
// 									size="sm"
// 									onClick={() =>
// 										setCurrentQuestionIndex(
// 											Math.max(0, currentQuestionIndex - 1),
// 										)
// 									}
// 									disabled={currentQuestionIndex === 0}
// 									className="gap-2"
// 								>
// 									<ChevronLeft className="w-4 h-4" />
// 									Previous
// 								</Button>

// 								<div className="flex items-center gap-2">
// 									<div className="flex gap-1">
// 										{questionFields.map((_, index) => (
// 											<button
// 												key={index}
// 												type="button"
// 												onClick={() => setCurrentQuestionIndex(index)}
// 												className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
// 													index === currentQuestionIndex
// 														? "bg-primary text-primary-foreground"
// 														: "bg-slate-200 hover:bg-slate-300 text-slate-700"
// 												}`}
// 											>
// 												{index + 1}
// 											</button>
// 										))}
// 									</div>
// 									<Badge variant="secondary" className="ml-2">
// 										{currentQuestionIndex + 1}/{totalQuestions}
// 									</Badge>
// 								</div>

// 								<Button
// 									type="button"
// 									variant="outline"
// 									size="sm"
// 									onClick={() =>
// 										setCurrentQuestionIndex(
// 											Math.min(totalQuestions - 1, currentQuestionIndex + 1),
// 										)
// 									}
// 									disabled={currentQuestionIndex === totalQuestions - 1}
// 									className="gap-2"
// 								>
// 									Next
// 									<ChevronRight className="w-4 h-4" />
// 								</Button>
// 							</div>
// 						)}

// 						{/* Current Question Editor */}
// 						{currentQuestion && (
// 							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// 								<div className="lg:col-span-2 space-y-6">
// 									{/* Question Actions */}
// 									<div className="flex items-center justify-between">
// 										<div className="flex items-center gap-2">
// 											<Badge variant="outline" className="gap-1">
// 												<Hash className="w-3 h-3" />
// 												{currentQuestion.points} point
// 												{currentQuestion.points !== 1 ? "s" : ""}
// 											</Badge>
// 											<Select
// 												value={currentQuestion.questionType}
// 												onValueChange={(value: QuestionType) =>
// 													updateCurrentQuestion("questionType", value)
// 												}
// 											>
// 												<SelectTrigger className="w-[180px]">
// 													<SelectValue />
// 												</SelectTrigger>
// 												<SelectContent>
// 													<SelectItem value="MULTIPLE_CHOICE">
// 														Multiple Choice
// 													</SelectItem>
// 													<SelectItem value="TRUE_FALSE">True/False</SelectItem>
// 													<SelectItem value="SHORT_ANSWER">
// 														Short Answer
// 													</SelectItem>
// 												</SelectContent>
// 											</Select>
// 										</div>

// 										<div className="flex items-center gap-2">
// 											<Button
// 												type="button"
// 												variant="outline"
// 												size="sm"
// 												onClick={duplicateQuestion}
// 												className="gap-2"
// 											>
// 												<Copy className="w-4 h-4" />
// 												Duplicate
// 											</Button>
// 											<Button
// 												type="button"
// 												variant="outline"
// 												size="sm"
// 												onClick={removeCurrentQuestion}
// 												disabled={totalQuestions === 1}
// 												className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
// 											>
// 												<Trash2 className="w-4 h-4" />
// 												Remove
// 											</Button>
// 										</div>
// 									</div>

// 									{/* Question Content */}
// 									<div className="space-y-4">
// 										<div>
// 											<Label className="text-sm font-medium mb-2 block">
// 												Question Content *
// 											</Label>
// 											<RichTextEditor
// 												value={currentQuestion.question}
// 												onChange={(value) =>
// 													updateCurrentQuestion("question", value)
// 												}
// 												minHeight="150px"
// 											/>
// 										</div>

// 										{/* Points Input */}
// 										<div className="max-w-xs">
// 											<Label className="text-sm font-medium mb-2 block">
// 												Points
// 											</Label>
// 											<Input
// 												type="number"
// 												min={1}
// 												value={currentQuestion.points}
// 												onChange={(e) =>
// 													updateCurrentQuestion(
// 														"points",
// 														parseInt(e.target.value) || 1,
// 													)
// 												}
// 												placeholder="Points"
// 											/>
// 										</div>

// 										{/* Question Type Specific Fields */}
// 										{renderQuestionEditor()}

// 										{/* Explanation */}
// 										<div>
// 											<Label className="text-sm font-medium mb-2 block">
// 												Explanation (Optional)
// 											</Label>
// 											<Textarea
// 												placeholder="Add explanation for the correct answer..."
// 												value={currentQuestion.explanation || ""}
// 												onChange={(e) =>
// 													updateCurrentQuestion("explanation", e.target.value)
// 												}
// 												className="min-h-[60px]"
// 											/>
// 											<p className="text-xs text-slate-500 mt-1">
// 												This will be shown to students after they answer the
// 												question
// 											</p>
// 										</div>
// 									</div>
// 								</div>

// 								{/* Question Preview */}
// 								<div>
// 									<Label className="text-sm font-medium mb-3 block">
// 										Preview
// 									</Label>
// 									{renderQuestionPreview()}
// 								</div>
// 							</div>
// 						)}
// 					</CardContent>
// 				</Card>

// 				{/* Summary and Actions */}
// 				<div className="sticky bottom-0 bg-white border-t p-4 -mx-6 -mb-6 mt-6">
// 					<div className="flex items-center justify-between">
// 						<div className="space-y-1">
// 							<div className="flex items-center gap-4 text-sm">
// 								<div className="flex items-center gap-2">
// 									<FileText className="w-4 h-4 text-slate-500" />
// 									<span>{totalQuestions} questions</span>
// 								</div>
// 								<div className="flex items-center gap-2">
// 									<Hash className="w-4 h-4 text-slate-500" />
// 									<span>{getQuestionPoints()} total points</span>
// 								</div>
// 								<div className="flex items-center gap-2">
// 									<CheckCircle className="w-4 h-4 text-slate-500" />
// 									<span>{form.watch("passingScore") || 60}% passing score</span>
// 								</div>
// 							</div>
// 							<p className="text-xs text-slate-500">
// 								All fields marked with * are required
// 							</p>
// 						</div>

// 						<div className="flex items-center gap-3">
// 							<Button
// 								type="button"
// 								variant="outline"
// 								onClick={() => form.reset()}
// 								className="gap-2"
// 							>
// 								<RefreshCw className="w-4 h-4" />
// 								Reset
// 							</Button>
// 							<Button type="submit" className="gap-2">
// 								<Save className="w-4 h-4" />
// 								Save Quiz
// 							</Button>
// 						</div>
// 					</div>
// 				</div>
// 			</form>
// 		</Form>
// 	);
// }
