import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { BreakPage } from "@/components/bluebook/break-page";
import { CheckYourWork } from "@/components/bluebook/check-your-work";
import LoadingModulePage from "@/components/bluebook/complete-module-loading";
import CompletionPage from "@/components/bluebook/complete-test";
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
	useSatAttemptCompleteTest,
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
	practiceTest: z.string().optional(),
});

export default function ExamPage() {
	const moduleCompletionTriggeredRef = useRef(false);

	const [selectedTestTypeId, setSelectedTestTypeId] = useState("");
	const [selectedTestTypeName, setSelectedTestTypeName] = useState("");
	const [selectedSubject, setSelectedSubject] = useState({ id: "", name: "" });
	const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
	const [activeModule, setActiveModule] = useState<any>(null);
	const [nextModuleProgressId, setNextModuleProgressId] = useState<
		string | null
	>(null);

	const showPreview = useExamStore((s) => s.showPreview);
	const setShowPreview = useExamStore((s) => s.setShowPreview);
	const testMode = useExamStore((s) => s.testMode);
	const setTestMode = useExamStore((s) => s.setTestMode);
	const currentQuestionId = useExamStore((s) => s.currentQuestionId);
	const currentPage = useExamStore((s) => s.currentPage);
	const setCurrentQuestion = useExamStore((s) => s.setCurrentQuestion);
	const setPage = useExamStore((s) => s.setPage);
	const initAnswers = useExamStore((s) => s.initAnswers);
	const timeRemaining = useExamStore((s) => s.timeRemaining);
	const setTimeRemaining = useExamStore((s) => s.setTimeRemaining);
	const hideTimer = useExamStore((s) => s.hideTimer);
	const setHideTimer = useExamStore((s) => s.setHideTimer); // Initialize showPreview to true on mount if no active exam
	useEffect(() => {
		if (!attempt && !activeModule && !showPreview) {
			setShowPreview(true);
		}
	}, [attempt, activeModule, showPreview, setShowPreview]);

	const form = useForm<z.infer<typeof previewFormSchema>>({
		resolver: zodResolver(previewFormSchema),
		defaultValues: {
			testType: "",
			subject: "",
			practiceTest: "",
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

	const practiceTestValue = useWatch({
		control: form.control,
		name: "practiceTest",
	});

	const params = useMemo(
		() => ({
			page: 1,
			limit: 100,
			sortBy: "order",
			orderBy: "asc" as "asc" | "desc",
			search: "",
			testMode: testMode as "TEST_PRACTICE" | "FULL_LENGTH" | undefined,
		}),
		[testMode],
	);

	const {
		data: testTypeResponse,
		isLoading: testTypeLoading,
		isError: testTypeError,
	} = useGetTestTypes(params);

	const { data: singleTestTypeResponse } = useGetTestTypeById(
		selectedTestTypeId || "",
		testMode as "TEST_PRACTICE" | "FULL_LENGTH" | undefined,
	);
	const { data: singleSubjectResponse } = useGetSubjectById(
		selectedSubject.id || "",
	);
	const satAttemptMutation = useCreateSatAttempt();
	const completeModuleMutation = useCreateSatAttemptMCQModuleComplete();

	const completeTest = useSatAttemptCompleteTest();

	const availableSubjects = singleTestTypeResponse?.data?.subject || [];
	const hasSubjects = availableSubjects.length > 0;
	const availablePracticeTests =
		singleTestTypeResponse?.data?.SATPractice || [];
	const isSATTest = selectedTestTypeName === "SAT";

	useEffect(() => {
		if (testTypeValue) {
			form.setValue("subject", "");
			form.setValue("practiceTest", "");
			setSelectedSubject({ id: "", name: "" });
		}
	}, [testTypeValue, form]);

	// Update the timer initialization effect - reset the ref when module changes
	useEffect(() => {
		if (!showPreview && activeModule?.sectionProgress) {
			moduleCompletionTriggeredRef.current = false; // Reset the flag for new module
			const moduleDuration = activeModule.module.duration;
			if (moduleDuration?.startedAt) {
				const started = new Date(moduleDuration?.startedAt).getTime();
				const elapsed = (Date.now() - started) / 1000;
				const remaining = moduleDuration?.section.duration * 60 - elapsed;
				setTimeRemaining(Math.max(0, Math.floor(remaining)));
			} else {
				setTimeRemaining(moduleDuration * 60);
			}
		}
	}, [activeModule, showPreview, setTimeRemaining]);
	console.log("activeModule", activeModule);
	// Start the countdown timer
	useEffect(() => {
		if (
			!showPreview &&
			timeRemaining !== null &&
			(currentPage === "exam" || currentPage === "check-work")
		) {
			const timer = setInterval(() => {
				setTimeRemaining(
					timeRemaining === null ? null : Math.max(0, timeRemaining - 1),
				);
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [showPreview, currentPage, timeRemaining, setTimeRemaining]);

	//! Auto-navigate to loading page when time runs out
	useEffect(() => {
		// Only proceed if we have a valid time remaining value
		if (
			timeRemaining === null ||
			showPreview ||
			(currentPage !== "exam" && currentPage !== "check-work") ||
			moduleCompletionTriggeredRef.current // Guard: don't run if already triggered
		) {
			return;
		}

		// When timer hits 0, complete the module and go to loading
		if (timeRemaining === 0) {
			moduleCompletionTriggeredRef.current = true; // Set flag immediately to prevent re-runs

			completeModuleMutation.mutate(
				{
					attemptId: attempt?.data?.attempt.id,
					sectionId: activeModule.sectionProgress?.section?.id,
					moduleId: activeModule.moduleId,
					usedQuestionSet: activeModule.usedQuestionSet,
				},
				{
					onSuccess: (response) => {
						console.log("Module completed on timer expiry:", response);
						// Set the next module progress ID from the response
						setNextModuleProgressId(response.data.nextModuleProgressId);
						// Navigate to loading page - LoadingModulePage will handle next module fetch
						setPage("loading");
					},
					onError: (error) => {
						console.error("Error completing module:", error);
						// Still navigate to loading even on error, with no nextModuleProgressId
						setNextModuleProgressId(null);
						setPage("loading");
					},
				},
			);
		}
	}, [
		timeRemaining,
		showPreview,
		currentPage,
		activeModule,
		attempt,
		completeModuleMutation,
		setPage,
	]);

	console.log("currentPage", currentPage);
	console.log("showPreview", showPreview);
	console.log("testMode", testMode);

	// Build questions from activeModule
	const questions: Question[] = useMemo(() => {
		if (!activeModule?.module) return [];

		let qNum = 1;
		const qs: Question[] = [];
		const module = activeModule.module;
		const usedSet = activeModule.usedQuestionSet || "SET_ONE";

		const qbs =
			usedSet === "SET_ONE"
				? module.questionsSetOne || []
				: module.questionsSetTwo || [];
		const sortedQbs = Array.isArray(qbs)
			? [...qbs].sort((a, b) => a.orderIndex - b.orderIndex)
			: [];

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
				optionType: qb.optionType, // Include the question type
			});
		}

		return qs;
	}, [activeModule]);

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
			// After check-work page, complete the module and go to loading page
			completeModuleMutation.mutate(
				{
					attemptId: attempt?.data?.attempt.id,
					sectionId: activeModule.sectionProgress?.section?.id,
					moduleId: activeModule.moduleId,
					usedQuestionSet: activeModule.usedQuestionSet,
				},
				{
					onSuccess: (response) => {
						setNextModuleProgressId(response.data.nextModuleProgressId);
						// Only navigate to loading page after we have the response
						setPage("loading");
					},
					onError: (error) => {
						console.error("Error completing module:", error);
					},
				},
			);

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
		// After break, start the next module (reset to exam page)
		setPage("exam");
		// Reset to first question of the new module
		if (questions.length > 0) {
			setCurrentQuestion(questions[0].id);
		}
	};

	const handleNextModule = (response: any) => {
		// Update attempt and active module with the new module data
		setAttempt(response);
		setActiveModule(response.data.activeModule);
		// Go to break page before starting the new module
		setPage("break");
	};

	const handleComplete = () => {
		// Test is complete, go to completion page
		console.log("handleComplete called");
		console.log("Attempt ID:", attempt?.data?.attempt.id);

		completeTest.mutate(
			{
				attemptId: attempt?.data?.attempt.id,
			},
			{
				onSuccess: (response) => {
					console.log("Complete test response:", response);
					setPage("complete");
				},
				onError: (error) => {
					console.error("Error completing test:", error);
				},
			},
		);
	};

	const handlePreviewSubmit = (values: z.infer<typeof previewFormSchema>) => {
		if (isSATTest && !values.practiceTest) {
			form.setError("practiceTest", {
				message: "Practice Test is required",
			});
			return;
		}

		if (hasSubjects && !isSATTest && !values.subject) {
			form.setError("subject", { message: "Subject is required" });
			return;
		}

		let satPracticeId = "";
		if (isSATTest && values.practiceTest) {
			// For SAT, use the selected practice test ID directly
			satPracticeId = values.practiceTest;
		} else if (hasSubjects && values.subject) {
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
						form.reset();
						setAttempt(response);
						setActiveModule(response.data.activeModule);
						setPage("exam"); // Explicitly set page to exam before hiding preview
						setShowPreview(false);
					},
					onError: (error) => {
						console.error("Error Creating SAT Attempt:", error);
					},
				},
			);
		} else {
			toast.error("No SAT Practice ID found");
		}
	};

	const handlePreviewBack = () => {
		setTestMode(null);
	};
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${String(secs).padStart(2, "0")}`;
	};

	console.log("timeRemaining", timeRemaining);

	// Show Test Mode Selection Page (before preview)
	if (!testMode) {
		return (
			<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
				<div className="w-full max-w-2xl">
					<h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">
						Practice & Prepare
					</h1>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<button
							type="button"
							onClick={() => setTestMode("TEST_PRACTICE")}
							className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8 hover:border-blue-500 hover:shadow-md transition-all group"
						>
							<div className="flex flex-col items-center text-center space-y-4">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
									<svg
										className="w-8 h-8 text-blue-600 group-hover:text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900 mb-2">
										Test Preview
									</h2>
									<p className="text-sm text-gray-600">
										Practice with selected modules and questions
									</p>
								</div>
							</div>
						</button>

						<button
							type="button"
							onClick={() => setTestMode("FULL_LENGTH")}
							className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-8 hover:border-blue-500 hover:shadow-md transition-all group"
						>
							<div className="flex flex-col items-center text-center space-y-4">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
									<svg
										className="w-8 h-8 text-blue-600 group-hover:text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-gray-900 mb-2">
										Full-Length Practice
									</h2>
									<p className="text-sm text-gray-600">
										Complete practice test experience
									</p>
								</div>
							</div>
						</button>
					</div>

					<div className="mt-8 text-center">
						<Button
							type="button"
							onClick={() => window.history.back()}
							variant="outline"
							className="px-8 h-12"
						>
							Back
						</Button>
					</div>
				</div>
			</div>
		);
	}

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

									{hasSubjects && !isSATTest && (
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

									{isSATTest && (
										<div>
											<FormLabel className="block text-sm font-semibold text-gray-900 mb-2">
												Practice Test <span className="text-red-500">*</span>
											</FormLabel>
											<Select
												value={practiceTestValue}
												onValueChange={(value) => {
													const selected = availablePracticeTests.find(
														(test: { id: string; name: string }) =>
															test.id === value,
													);

													if (!selected) return;

													form.setValue("practiceTest", value);
												}}
												disabled={!testTypeValue}
											>
												<SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md">
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">Select</SelectItem>
													{availablePracticeTests.map(
														(test: { id: string; name: string }) => (
															<SelectItem key={test.id} value={test.id}>
																{test.name}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											{form.formState.errors.practiceTest && (
												<p className="text-red-500 text-sm mt-1">
													{form.formState.errors.practiceTest.message}
												</p>
											)}
										</div>
									)}
								</form>
							</Form>
						)}
					</div>
				</div>

				<div className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-200">
					<div className="fixed bottom-5 right-8 flex gap-3">
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
							disabled={
								!testTypeValue ||
								(hasSubjects && !isSATTest && !subjectValue) ||
								(isSATTest && !practiceTestValue)
							}
							className="px-8 h-12 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full disabled:opacity-50 cursor-pointer"
						>
							Next
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Render loading page (after completing a module)
	if (currentPage === "loading") {
		return (
			<LoadingModulePage
				nextModuleProgressId={nextModuleProgressId}
				onNextModule={handleNextModule}
				onComplete={handleComplete}
			/>
		);
	}

	// Render break page
	if (currentPage === "break") {
		return <BreakPage onBreakComplete={handleBreakComplete} />;
	}

	// Render completion page
	if (currentPage === "complete") {
		return <CompletionPage />;
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
					<DirectionsPopover activeModule={activeModule} />
				</div>

				<div className="flex flex-col justify-center items-center gap-2">
					{!hideTimer ? (
						<div className="flex items-center gap-0.5 h-5 text-lg font-medium">
							{timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
						</div>
					) : (
						<div className="h-5 text-lg font-medium">--:--</div>
					)}
					<button
						onClick={() => setHideTimer(!hideTimer)}
						type="button"
						className="px-3 py-0.5 border border-black rounded-full text-[12px] font-medium hover:bg-blue-800 hover:text-white transition-colors"
					>
						Hide
					</button>
				</div>
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
									{parse(DOMPurify.sanitize(currentQuestion?.text))}
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
						disabled={
							currentPage === "check-work" && completeModuleMutation.isPending
						}
						className="px-6 h-10 bg-indigo-600 rounded-full text-white hover:opacity-90"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
