import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { BreakPage } from "@/components/bluebook/break-page";
import { CheckYourWork } from "@/components/bluebook/check-your-work";
import { DirectionsPopover } from "@/components/bluebook/directions-modal";
import { QuestionDisplay } from "@/components/bluebook/question-display";
import { QuestionNavigator } from "@/components/bluebook/question-navigation";
import { SplitPanel } from "@/components/bluebook/split-panel";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useGetSubjects,
	useGetTestTypeById,
	useGetTestTypes,
} from "@/hooks/sat-practice";
import { SECTION_1_QUESTIONS } from "@/store/question";
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
	const [currentSection, setCurrentSection] = useState(1);
	const [showPreview, setShowPreview] = useState(true);
	const [selectedTestTypeId, setSelectedTestTypeId] = useState("");
	const [selectedTestTypeName, setSelectedTestTypeName] = useState("");
	const [selectedSubjectName, setSelectedSubjectName] = useState("");

	const currentQuestionId = useExamStore((s) => s.currentQuestionId);
	const currentPage = useExamStore((s) => s.currentPage);
	const setCurrentQuestion = useExamStore((s) => s.setCurrentQuestion);
	const setPage = useExamStore((s) => s.setPage);

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

	// Only fetch single test type when we have an ID
	const { data: singleTestTypeResponse } = useGetTestTypeById(
		selectedTestTypeId || "",
	);

	// Get subjects from single test type response
	const availableSubjects = singleTestTypeResponse?.data?.subject || [];
	const hasSubjects = availableSubjects.length > 0;

	console.log("singleTestTypeResponse", singleTestTypeResponse);
	console.log("availableSubjects", availableSubjects);

	// Timer
	useEffect(() => {
		if (!showPreview) {
			const timer = setInterval(() => {
				setTimeRemaining((prev) => Math.max(0, prev - 1));
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [showPreview]);

	const currentQuestion = SECTION_1_QUESTIONS.find(
		(q) => q.id === currentQuestionId,
	);

	const handleNext = () => {
		const currentIndex = SECTION_1_QUESTIONS.findIndex(
			(q) => q.id === currentQuestionId,
		);

		if (currentIndex === SECTION_1_QUESTIONS.length - 1) {
			setPage("check-work");
		} else {
			setCurrentQuestion(SECTION_1_QUESTIONS[currentIndex + 1].id);
		}
	};

	const handleBack = () => {
		const currentIndex = SECTION_1_QUESTIONS.findIndex(
			(q) => q.id === currentQuestionId,
		);

		if (currentIndex > 0) {
			setCurrentQuestion(SECTION_1_QUESTIONS[currentIndex - 1].id);
		}
	};

	const handleCheckWorkBack = () => {
		setPage("exam");
		setCurrentQuestion(SECTION_1_QUESTIONS[SECTION_1_QUESTIONS.length - 1].id);
	};

	const handleCheckWorkNext = () => {
		setPage("break");
	};

	const handleBreakComplete = () => {
		setCurrentSection(currentSection + 1);
		setPage("exam");
		setCurrentQuestion(SECTION_1_QUESTIONS[0].id);
	};

	const handlePreviewSubmit = (values: z.infer<typeof previewFormSchema>) => {
		// If test type has subjects, require subject selection
		if (hasSubjects && !values.subject) {
			form.setError("subject", { message: "Subject is required" });
			return;
		}

		if (values.testType) {
			// Find the selected subject name if subject was selected
			if (values.subject && hasSubjects) {
				const selectedSubject = availableSubjects.find(
					(subj: { id: string; name: string }) => subj.id === values.subject,
				);

				if (selectedSubject) {
					setSelectedSubjectName(selectedSubject.name);
				}
			}

			setShowPreview(false);
			// You can store these values in your exam store if needed
			// useExamStore.setState({ testType: selectedTestTypeId, subject: values.subject });
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
			<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
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
									{/* Test Type */}
									<div>
										<FormLabel className="block text-sm font-semibold text-gray-900 mb-2">
											Test Type <span className="text-red-500">*</span>
										</FormLabel>
										<Select
											value={testTypeValue}
											onValueChange={(id) => {
												// Find the full test type object
												const fullObject = testTypeResponse?.data?.find(
													(item: { id: string; name: string }) =>
														item.id === id,
												);

												if (!fullObject) return;

												// Update form value with the ID
												form.setValue("testType", id);

												// Store the ID and name separately for later use
												setSelectedTestTypeId(fullObject.id);
												setSelectedTestTypeName(fullObject.name);
											}}
										>
											<SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
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
										{form.formState.errors.testType && (
											<p className="text-red-500 text-sm mt-1">
												{form.formState.errors.testType.message}
											</p>
										)}
									</div>

									{/* Subject */}
									{hasSubjects && (
										<div>
											<FormLabel className="block text-sm font-semibold text-gray-900 mb-2">
												Subject <span className="text-red-500">*</span>
											</FormLabel>
											<Select
												value={subjectValue}
												onValueChange={(value) => {
													form.setValue("subject", value);
												}}
												disabled={!testTypeValue}
											>
												<SelectTrigger className="w-full h-12 border-2 border-blue-500 rounded-md">
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent>
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
									<p className="text-sm text-gray-500 text-right mt-4">
										* = Required
									</p>
								</form>
							</Form>
						)}
					</div>
				</div>

				{/* Bottom Navigation */}
				<div className="fixed bottom-8 right-8 flex gap-3">
					<Button
						type="button"
						onClick={handlePreviewBack}
						className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
					>
						Back
					</Button>
					<Button
						type="button"
						onClick={form.handleSubmit(handlePreviewSubmit)}
						disabled={!testTypeValue || (hasSubjects && !subjectValue)}
						className="px-8 h-12 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</Button>
				</div>
			</div>
		);
	}

	// Render check-your-work page
	if (currentPage === "check-work") {
		return (
			<CheckYourWork
				handleBack={handleCheckWorkBack}
				onNext={handleCheckWorkNext}
			/>
		);
	}

	// Render break page
	if (currentPage === "break") {
		return <BreakPage onBreakComplete={handleBreakComplete} />;
	}

	if (!currentQuestion) {
		return <div>Loading...</div>;
	}

	const currentIndex = SECTION_1_QUESTIONS.findIndex(
		(q) => q.id === currentQuestionId,
	);

	// Main exam page
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<div className="bg-blue-50 text-black px-6 py-3 border-b-2 border-dashed border-slate-800 flex items-center justify-between relative z-30">
				<div className="flex flex-col gap-1.5">
					<h1 className="text-lg font-semibold">Section {currentSection}</h1>
					<DirectionsPopover />
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 text-sm font-medium">
						<Clock className="w-5 h-5" />
						{formatTime(timeRemaining)}
					</div>
					<button
						type="button"
						className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-blue-800 transition-colors"
					>
						Hide
					</button>
				</div>
			</div>

			{/* Test Preview Banner */}
			<div className="bg-blue-900 text-white text-center py-2 text-sm font-medium">
				THIS IS A TEST PREVIEW
			</div>

			{/* Main Content */}
			<div className="flex-1 flex overflow-hidden">
				{currentQuestion && currentQuestion?.layout === "split" ? (
					<SplitPanel
						leftContent={
							<div className="space-y-4">
								{currentQuestion?.passage && (
									<div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
										{currentQuestion.passage}
									</div>
								)}
							</div>
						}
						rightContent={<QuestionDisplay question={currentQuestion} />}
					/>
				) : (
					<div className="flex-1 overflow-y-auto px-8 py-8">
						<div className="max-w-2xl mx-auto">
							<QuestionDisplay question={currentQuestion} />
						</div>
					</div>
				)}
			</div>

			<div className="bg-blue-50 text-slate-800 px-6 py-4 border-t-slate-800 border-t-2 border-dashed flex items-center justify-between">
				<h5 className="text-sm font-semibold">
					{selectedTestTypeName}
					{selectedSubjectName && ` - ${selectedSubjectName}`}
				</h5>

				<QuestionNavigator />

				<div className="flex gap-3">
					<Button
						type="button"
						onClick={handleBack}
						disabled={currentIndex === 0}
						style={{ backgroundColor: "var(--button-blue)" }}
						className="px-6 h-10 bg-indigo-600 rounded-full text-white font-bold hover:opacity-90 disabled:opacity-50"
					>
						Back
					</Button>
					<Button
						type="button"
						onClick={handleNext}
						style={{ backgroundColor: "var(--button-blue)" }}
						className="px-6 h-10 bg-indigo-600 rounded-full text-white hover:opacity-90"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
