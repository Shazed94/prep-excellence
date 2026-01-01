import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { BreakPage } from "@/components/bluebook/break-page";
import { CheckYourWork } from "@/components/bluebook/check-your-work";
import { DirectionsPopover } from "@/components/bluebook/directions-modal";
import { QuestionDisplay } from "@/components/bluebook/question-display";
import { QuestionNavigator } from "@/components/bluebook/question-navigation";
import { SplitPanel } from "@/components/bluebook/split-panel";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCreateSatAttempt,
	useCreateSatAttemptMCQModuleComplete,
	useGetSubjectById,
} from "@/hooks/sat-attempt";
import { useGetTestTypeById, useGetTestTypes } from "@/hooks/sat-practice";
import type { AttemptResponse, Question } from "@/store/question";
import { useExamStore } from "@/store/useExamStore";

export const Route = createFileRoute("/bluebook/")({
	component: ExamPage,
});

const previewFormSchema = z.object({
	testType: z.string().min(1, "Test type is required"),
	subject: z.string().optional(),
});

export default function ExamPage() {
	const [timeRemaining, setTimeRemaining] = useState(1800);
	const [showPreview, setShowPreview] = useState(true);
	const [selectedTestTypeId, setSelectedTestTypeId] = useState("");
	const [selectedTestTypeName, setSelectedTestTypeName] = useState("");
	const [selectedSubject, setSelectedSubject] = useState({ id: "", name: "" });
	const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
	const [activeModule, setActiveModule] = useState<any>(null);

	const currentQuestionId = useExamStore((s) => s.currentQuestionId);
	const currentPage = useExamStore((s) => s.currentPage);
	const setCurrentQuestion = useExamStore((s) => s.setCurrentQuestion);
	const setPage = useExamStore((s) => s.setPage);
	const initAnswers = useExamStore((s) => s.initAnswers);

	const form = useForm<z.infer<typeof previewFormSchema>>({
		resolver: zodResolver(previewFormSchema),
		defaultValues: {
			testType: "",
			subject: "",
		},
	});

	const testTypeValue = useWatch({
		control: form.control,
		name: "testType",
	});

	const subjectValue = useWatch({
		control: form.control,
		name: "subject",
	});

	const [params] = useState({
		page: 1,
		limit: 100,
		sortBy: "order",
		orderBy: "asc" as "asc" | "desc",
		search: "",
	});

	const {
		data: testTypeResponse,
		isLoading: testTypeLoading,
		isError: testTypeError,
	} = useGetTestTypes(params);
	const { data: singleTestTypeResponse } = useGetTestTypeById(
		selectedTestTypeId || "",
	);
	const { data: singleSubjectResponse } = useGetSubjectById(
		selectedSubject.id || "",
	);
	const satAttemptMutation = useCreateSatAttempt();
	const completeModuleMutation = useCreateSatAttemptMCQModuleComplete();

	const availableSubjects = singleTestTypeResponse?.data?.subject || [];
	const hasSubjects = availableSubjects.length > 0;

	useEffect(() => {
		if (testTypeValue) {
			form.setValue("subject", "");
			setSelectedSubject({ id: "", name: "" });
		}
	}, [testTypeValue, form]);

	useEffect(() => {
		if (!showPreview) {
			const timer = setInterval(() => {
				setTimeRemaining((prev) => Math.max(0, prev - 1));
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [showPreview]);

	useEffect(() => {
		if (!showPreview && activeModule?.sectionProgress) {
			const sectionProg = activeModule.sectionProgress;
			if (sectionProg.startedAt) {
				const started = new Date(sectionProg.startedAt).getTime();
				const elapsed = (Date.now() - started) / 1000;
				const remaining = sectionProg.section.duration * 60 - elapsed;
				setTimeRemaining(Math.max(0, Math.floor(remaining)));
			} else {
				setTimeRemaining(sectionProg.section.duration * 60);
			}
		}
	}, [activeModule, showPreview]);

	// Auto-navigate to break page when time runs out
	//   useEffect(() => {
	//     if (
	//       !showPreview &&
	//       timeRemaining <= 0 &&
	//       currentPage !== "break" &&
	//       currentPage !== "complete"
	//     ) {
	//       setPage("break");
	//     }
	//   }, [timeRemaining, showPreview, currentPage, setPage]);

	console.log("currentPage", currentPage);

	// Build questions from activeModule
	const questions: Question[] = useMemo(() => {
		if (!activeModule?.module) return [];

		let qNum = 1;
		const qs: Question[] = [];
		const module = activeModule.module;
		const usedSet = activeModule.usedQuestionSet || "SET_ONE";

		const qbs =
			usedSet === "SET_ONE" ? module.questionsSetOne : module.questionsSetTwo;
		const sortedQbs = [...qbs].sort((a, b) => a.orderIndex - b.orderIndex);

		for (const qb of sortedQbs) {
			qs.push({
				id: qb.id,
				questionNumber: qNum++,
				text: qb.content,
				options: [...qb.options]
					.sort((a, b) => a.orderIndex - b.orderIndex)
					.map((o) => ({
						id: o.id,
						label: String.fromCharCode(65 + o.orderIndex),
						text: o.content,
					})),
				moduleId: module.id,
			});
		}

		return qs;
	}, [activeModule]);

	console.log("attempttttttttttttt", attempt);

	useEffect(() => {
		if (questions.length > 0) {
			initAnswers(questions.map((q) => q.id));
			if (
				!currentQuestionId ||
				!questions.find((q) => q.id === currentQuestionId)
			) {
				setCurrentQuestion(questions[0].id);
			}
		}
	}, [questions, currentQuestionId, initAnswers, setCurrentQuestion]);

	const currentQuestion = questions.find((q) => q.id === currentQuestionId);

	const handleNext = () => {
		if (currentPage === "check-work") {
			// After check-work page, go to break page
			completeModuleMutation.mutate({
				attemptId: attempt?.data?.attempt.id,
				sectionId: activeModule.sectionProgress?.section?.id,
				moduleId: activeModule.moduleId,
				usedQuestionSet: activeModule.usedQuestionSet,
			});
			setPage("break");
			return;
		}

		const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
		const nextQuestion = questions[currentIndex + 1];

		// If there's no next question, we're at the last question of the module
		if (!nextQuestion) {
			setPage("check-work");
		} else {
			setCurrentQuestion(nextQuestion.id);
		}
	};

	const handleBack = () => {
		// Prevent going back from break page
		if (currentPage === "break") {
			return;
		}

		if (currentPage === "check-work") {
			setPage("exam");
			setCurrentQuestion(questions[questions.length - 1].id);
			return;
		}

		const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);

		if (currentIndex > 0) {
			setCurrentQuestion(questions[currentIndex - 1].id);
		}
	};

	const handleBreakComplete = () => {
		// After break, the backend should provide the next module
		// For now, just go to complete page
		// In a real scenario, you'd fetch the next module data here
		setPage("complete");
	};

	const handlePreviewSubmit = (values: z.infer<typeof previewFormSchema>) => {
		if (hasSubjects && !values.subject) {
			form.setError("subject", { message: "Subject is required" });
			return;
		}

		let satPracticeId = "";
		if (hasSubjects && values.subject) {
			satPracticeId = singleSubjectResponse?.data?.SATPractice?.id || "";
		} else {
			// Assuming fallback if no subjects; adjust based on actual API structure if needed
			satPracticeId = singleTestTypeResponse?.data?.SATPractice?.id || "";
		}

		if (satPracticeId) {
			satAttemptMutation.mutate(
				{
					satPracticeId,
				},
				{
					onSuccess: (response) => {
						setAttempt(response);
						setActiveModule(response.data.activeModule);
						setShowPreview(false);
					},
					onError: (error) => {
						console.error("Error Creating SAT Attempt:", error);
					},
				},
			);
		}
	};

	const handlePreviewBack = () => {
		window.history.back();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${String(secs).padStart(2, "0")}`;
	};

	// Show Preview Page
	if (showPreview) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:pt-20 lg:pt-28">
				<div className="w-full max-w-xl">
					<h1 className="text-3xl font-semibold text-gray-900 text-center mb-12">
						Choose a Preview
					</h1>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
						{testTypeLoading ? (
							<div className="text-center py-8 text-gray-600">Loading...</div>
						) : testTypeError ? (
							<div className="text-center py-8 text-red-600">
								Error loading test types
							</div>
						) : (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(handlePreviewSubmit)}
									className="space-y-6"
								>
									<FormField
										control={form.control}
										name="testType"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="flex justify-between items-center text-sm font-semibold text-gray-900">
													<div>
														Test Type <span className="text-red-500">*</span>
													</div>
													<p className="text-sm text-gray-500 text-right">
														* = Required
													</p>
												</FormLabel>
												<Select
													value={field.value}
													onValueChange={(id) => {
														const fullObject = testTypeResponse?.data?.find(
															(item: { id: string; name: string }) =>
																item.id === id,
														);

														if (!fullObject) return;

														field.onChange(id);
														setSelectedTestTypeId(fullObject.id);
														setSelectedTestTypeName(fullObject.name);
													}}
												>
													<FormControl>
														<SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md">
															<SelectValue placeholder="Select" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{testTypeResponse?.data?.map(
															(type: { id: string; name: string }) => (
																<SelectItem key={type.id} value={type.id}>
																	{type.name}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{hasSubjects && (
										<div>
											<FormLabel className="block text-sm font-semibold text-gray-900 mb-2">
												Subject <span className="text-red-500">*</span>
											</FormLabel>
											<Select
												value={subjectValue}
												onValueChange={(value) => {
													const selected = availableSubjects.find(
														(subj: { id: string; name: string }) =>
															subj.id === value,
													);

													if (!selected) return;

													form.setValue("subject", value);
													setSelectedSubject({
														id: selected.id,
														name: selected.name,
													});
												}}
												disabled={!testTypeValue}
											>
												<SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md">
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Select</SelectItem>
													{availableSubjects.map(
														(subj: { id: string; name: string }) => (
															<SelectItem key={subj.id} value={subj.id}>
																{subj.name}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											{form.formState.errors.subject && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.subject.message}
												</p>
											)}
										</div>
									)}
								</form>
							</Form>
						)}
					</div>
				</div>

				<div className="fixed bottom-0 left-0 right-0 h-28 bg-white border-t border-gray-200">
					<div className="fixed bottom-8 right-8 flex gap-3">
						<Button
							type="button"
							onClick={handlePreviewBack}
							className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full cursor-pointer"
						>
							Back
						</Button>
						<Button
							type="button"
							onClick={form.handleSubmit(handlePreviewSubmit)}
							disabled={!testTypeValue || (hasSubjects && !subjectValue)}
							className="px-8 h-12 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full disabled:opacity-50 cursor-pointer"
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Render break page
	if (currentPage === "break") {
		return (
			<BreakPage
				onBreakComplete={handleBreakComplete}
				activeModule={activeModule}
			/>
		);
	}

	if (!currentQuestion || !activeModule) {
		return <div>Loading...</div>;
	}

	const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);

	// Main exam page
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<div className="bg-blue-50 text-black px-6 py-3 border-b-2 border-dashed border-slate-800 flex items-center justify-between relative z-30">
				<div className="flex flex-col gap-1.5">
					<h1 className="text-2xl font-semibold">
						{activeModule.sectionProgress.section.name} -{" "}
						{activeModule.module.name}
					</h1>
					<DirectionsPopover />
				</div>

				<div className="flex flex-col justify-center items-center gap-2">
					<div className="flex items-center gap-0.5 text-lg font-medium">
						{formatTime(timeRemaining)}
					</div>
					<button
						type="button"
						className="px-3 py-0.5 border border-black rounded-full text-[12px] font-medium hover:bg-blue-800 transition-colors"
					>
						Hide
					</button>
				</div>
				<div></div>
			</div>

			<div className="bg-blue-900 text-white text-center py-2 text-sm font-medium">
				THIS IS A TEST PREVIEW
			</div>

			{/* Main Content */}
			<div className="flex-1 flex overflow-hidden">
				{currentPage === "check-work" ? (
					<CheckYourWork
						questions={questions}
						sectionName={
							activeModule?.sectionProgress?.section?.name || "Section I"
						}
					/>
				) : (
					<SplitPanel
						leftContent={
							<div className="space-y-4">
								{currentQuestion?.passage && (
									<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
										{currentQuestion.passage}
									</div>
								)}
								{/* Show question text on left */}
								<h3 className="font-serif text-base text-gray-800 leading-relaxed">
									{currentQuestion?.text}
								</h3>
							</div>
						}
						rightContent={
							<QuestionDisplay
								attemptId={attempt?.data?.attempt?.id || ""}
								question={currentQuestion}
							/>
						}
					/>
				)}
			</div>

			<div className="bg-blue-50 text-slate-800 px-6 py-4 border-t-slate-800 border-t-2 border-dashed flex items-center justify-between">
				<h5 className="text-sm font-semibold">{selectedTestTypeName}</h5>

				<QuestionNavigator activeModule={activeModule} />

				<div className="flex gap-3">
					<Button
						type="button"
						onClick={handleBack}
						disabled={currentPage === "exam" && currentIndex === 0}
						className="px-6 h-10 bg-indigo-600 rounded-full text-white font-bold hover:opacity-90 disabled:opacity-50"
					>
						Back
					</Button>
					<Button
						type="button"
						onClick={handleNext}
						className="px-6 h-10 bg-indigo-600 rounded-full text-white hover:opacity-90"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
