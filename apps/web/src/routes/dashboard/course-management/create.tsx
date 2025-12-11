"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ---------- Route ----------
export const Route = createFileRoute("/dashboard/course-management/create")({
	component: RouteComponent,
});

// ---------- Schemas ----------
const Step1Schema = z.object({
	title: z
		.string()
		.min(1, "Course title is required")
		.min(3, "Title must be at least 3 characters")
		.max(100, "Title must be less than 100 characters"),
});

const SessionSchema = z.object({
	day: z.string().min(1, "Day is required"),
	startTime: z.string().min(1, "Start time is required"),
	endTime: z.string().min(1, "End time is required"),
});

const Step2Schema = z.object({
	short_description: z
		.string()
		.min(1, "Description is required")
		.min(20, "Description must be at least 20 characters"),
	long_description: z
		.string()
		.min(1, "Description is required")
		.min(20, "Description must be at least 20 characters"),
	startDate: z.string().min(1, "Start date is required"),
	durationDays: z.string().min(1, "Duration must be at least 1 day"),
	sessions: z.array(SessionSchema).min(1, "Add at least one weekly session"),
	price: z.string().min(0, "Price must be 0 or more"),
	capacity: z.string().min(1, "Capacity must be at least 1"),
	thumbnail: z.string().optional(),
});

type Step1FormData = z.infer<typeof Step1Schema>;
type Step2FormData = z.infer<typeof Step2Schema>;

// ---------- Component ----------
function RouteComponent() {
	const [currentStep, setCurrentStep] = useState<1 | 2>(1);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

	const [step1Data, setStep1Data] = useState<Step1FormData>({
		title: "",
	});

	const step1Form = useForm<Step1FormData>({
		resolver: zodResolver(Step1Schema),
		defaultValues: step1Data,
	});

	const step2Form = useForm<Step2FormData>({
		resolver: zodResolver(Step2Schema),
		defaultValues: {
			short_description: "",
			long_description: "",
			startDate: "",
			durationDays: "",
			price: "0",
			capacity: "30",
			thumbnail: "",
			sessions: [
				{
					day: "sunday",
					startTime: "13:00",
					endTime: "14:00",
				},
			],
		},
	});

	const { control } = step2Form;

	const {
		fields: sessionFields,
		append,
		remove,
	} = useFieldArray({
		control,
		name: "sessions",
	});

	// ---------- Handlers ----------
	const handleStep1Next = (data: Step1FormData) => {
		setStep1Data(data);
		setCurrentStep(2);
	};

	const handleStep2Back = () => {
		setCurrentStep(1);
		// sync title when going back (optional but nice)
		step1Form.reset(step1Data);
	};

	const handleStep2Submit = async (data: Step2FormData): Promise<void> => {
		const finalData = { ...step1Data, ...data };
		console.log("Form submitted:", finalData);
		// TODO: call your API here
	};

	const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const preview = reader.result as string;
			setThumbnailPreview(preview);
			step2Form.setValue("thumbnail", preview);
		};
		reader.readAsDataURL(file);
	};

	// ---------- UI ----------
	return (
		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10">
			{/* Header */}
			<div className="mb-8 flex flex-col gap-2">
				<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
					Create Course
				</h1>
				<p className="text-slate-600">
					Define the course structure, schedule, and details your students will
					see.
				</p>
			</div>

			{/* Step indicator (full width) */}
			<div className="mb-6 flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div
						className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
							currentStep === 1
								? "bg-blue-600 text-white"
								: "bg-slate-300 text-slate-800"
						}`}
					>
						1
					</div>
					<span className="text-sm font-medium text-slate-700">
						Course Title
					</span>
				</div>

				<div
					className={`flex-1 h-0.5 transition-all ${
						currentStep >= 2 ? "bg-blue-600" : "bg-slate-300"
					}`}
				/>

				<div className="flex items-center gap-2">
					<div
						className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
							currentStep === 2
								? "bg-blue-600 text-white"
								: "bg-slate-300 text-slate-800"
						}`}
					>
						2
					</div>
					<span className="text-sm font-medium text-slate-700">
						Description & Schedule
					</span>
				</div>
			</div>

			{/* Main card (full-width style) */}
			<div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
				{currentStep === 1 && (
					<div className="space-y-6">
						<div>
							<h2 className="text-2xl font-semibold text-slate-900 mb-1">
								What is the title of your course?
							</h2>
							<p className="text-slate-600">
								Choose a clear, descriptive title that reflects what students
								will learn.
							</p>
						</div>

						<Form {...step1Form}>
							<form
								onSubmit={step1Form.handleSubmit(handleStep1Next)}
								className="space-y-6 max-w-3xl"
							>
								<FormField
									control={step1Form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-slate-800 text-base">
												Course Title
											</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Full Stack Web Development (Beginner to Advanced)"
													{...field}
													className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500 text-base"
												/>
											</FormControl>
											<FormDescription className="text-slate-500">
												This will be shown in the course catalog and on the
												course page.
											</FormDescription>
											<FormMessage className="text-red-500 text-sm" />
										</FormItem>
									)}
								/>

								<div className="flex justify-end gap-3 pt-2">
									<Button
										type="submit"
										className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg"
									>
										Continue
										<ChevronRight className="w-4 h-4" />
									</Button>
								</div>
							</form>
						</Form>
					</div>
				)}

				{currentStep === 2 && (
					<div className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
							<div>
								<h2 className="text-2xl font-semibold text-slate-900 mb-1">
									Description & Schedule
								</h2>
								<p className="text-slate-600">
									Explain your course and define when classes will run.
								</p>
							</div>
							<div className="text-sm text-slate-500">
								Course: <span className="font-semibold">{step1Data.title}</span>
							</div>
						</div>

						<Form {...step2Form}>
							<form
								onSubmit={step2Form.handleSubmit(handleStep2Submit)}
								className="space-y-8"
							>
								{/* Description (Jodit) */}
								<FormField
									control={step2Form.control}
									name="short_description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-slate-800 text-base">
												Short Description
											</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe what students will learn, prerequisites, outcomes, and any projects included..."
													{...field}
													rows={6}
													className="py-3 px-4 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500 resize-none text-base"
												/>
											</FormControl>
											<FormDescription className="text-slate-500">
												Use clear language and structure to describe the course
												content.
											</FormDescription>
											<FormMessage className="text-red-500 text-sm" />
										</FormItem>
									)}
								/>
								<FormField
									control={step2Form.control}
									name="long_description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-slate-800 text-base">
												Long Description
											</FormLabel>
											<FormControl>
												<RichTextEditor
													value={field.value}
													onChange={field.onChange}
													height="400px"
													minHeight="200px"
												/>
											</FormControl>

											<FormDescription className="text-slate-500">
												Use clear language and structure to describe the course
												content.
											</FormDescription>
											<FormMessage className="text-red-500 text-sm" />
										</FormItem>
									)}
								/>

								{/* Duration & date */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
									<FormField
										control={step2Form.control}
										name="startDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Start Date
												</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
														className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
													/>
												</FormControl>
												<FormDescription className="text-slate-500">
													First day of the course.
												</FormDescription>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									<FormField
										control={step2Form.control}
										name="durationDays"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Duration (days)
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min={1}
														placeholder="e.g., 40"
														{...field}
														className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
													/>
												</FormControl>
												<FormDescription className="text-slate-500">
													Total length of the course (e.g., 40 days).
												</FormDescription>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									<FormField
										control={step2Form.control}
										name="price"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Price
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min={0}
														placeholder="e.g., 99"
														{...field}
														className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
													/>
												</FormControl>
												<FormDescription className="text-slate-500">
													Set 0 for a free course.
												</FormDescription>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>
								</div>

								{/* Capacity & thumbnail */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
									<FormField
										control={step2Form.control}
										name="capacity"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-800 text-base">
													Max Students
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														min={1}
														placeholder="e.g., 50"
														{...field}
														className="h-11 border-2 border-slate-200 rounded-lg focus-visible:ring-0 focus-visible:border-blue-500"
													/>
												</FormControl>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>

									<FormField
										control={step2Form.control}
										name="thumbnail"
										render={() => (
											<FormItem className="md:col-span-2">
												<FormLabel className="text-slate-800 text-base">
													Course Thumbnail
												</FormLabel>
												<div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 hover:border-blue-500 transition-colors">
													<input
														type="file"
														accept="image/*"
														className="hidden"
														onChange={handleThumbnailUpload}
													/>
													<label
														htmlFor="thumbnail-upload"
														className="cursor-pointer flex items-center gap-3"
													>
														<div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
															<Upload className="w-6 h-6 text-slate-500" />
														</div>
														<div>
															<p className="font-medium text-slate-800">
																{thumbnailPreview
																	? "Change thumbnail"
																	: "Upload thumbnail"}
															</p>
															<p className="text-sm text-slate-500">
																PNG, JPG up to 5MB. Recommended ratio 16:9.
															</p>
														</div>
													</label>

													{thumbnailPreview && (
														<div className="w-full md:w-56">
															<img
																src={thumbnailPreview}
																alt="Thumbnail preview"
																className="w-full h-32 object-cover rounded-lg border border-slate-200"
															/>
														</div>
													)}
												</div>
												<FormMessage className="text-red-500 text-sm" />
											</FormItem>
										)}
									/>
								</div>

								{/* Weekly Sessions */}
								<div className="space-y-3">
									<div className="flex items-center justify-between gap-3">
										<div>
											<h3 className="text-lg font-semibold text-slate-900">
												Weekly Class Schedule
											</h3>
											<p className="text-sm text-slate-600">
												Example: Monday 1:00 PM – 2:00 PM, Tuesday 1:00 PM –
												2:00 PM (every week).
											</p>
										</div>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												append({
													day: "sunday",
													startTime: "13:00",
													endTime: "14:00",
												})
											}
											className="flex items-center gap-2"
										>
											<Plus className="w-4 h-4" />
											Add Day
										</Button>
									</div>

									<div className="space-y-3">
										{sessionFields.map((session, index) => (
											<div
												key={session.id}
												className="grid grid-cols-1 md:grid-cols-[1.2fr,1fr,1fr,auto] gap-3 items-end bg-slate-50 border border-slate-200 rounded-lg p-3"
											>
												<FormField
													control={step2Form.control}
													name={`sessions.${index}.day`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-slate-800 text-sm">
																Day of Week
															</FormLabel>
															<FormControl>
																<select
																	{...field}
																	className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
																>
																	<option value="">Select day</option>
																	<option value="monday">Monday</option>
																	<option value="tuesday">Tuesday</option>
																	<option value="wednesday">Wednesday</option>
																	<option value="thursday">Thursday</option>
																	<option value="friday">Friday</option>
																	<option value="saturday">Saturday</option>
																	<option value="sunday">Sunday</option>
																</select>
															</FormControl>
															<FormMessage className="text-red-500 text-xs" />
														</FormItem>
													)}
												/>

												<FormField
													control={step2Form.control}
													name={`sessions.${index}.startTime`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-slate-800 text-sm">
																Start Time
															</FormLabel>
															<FormControl>
																<Input
																	type="time"
																	{...field}
																	className="h-10 border border-slate-300 rounded-md text-sm"
																/>
															</FormControl>
															<FormMessage className="text-red-500 text-xs" />
														</FormItem>
													)}
												/>

												<FormField
													control={step2Form.control}
													name={`sessions.${index}.endTime`}
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-slate-800 text-sm">
																End Time
															</FormLabel>
															<FormControl>
																<Input
																	type="time"
																	{...field}
																	className="h-10 border border-slate-300 rounded-md text-sm"
																/>
															</FormControl>
															<FormMessage className="text-red-500 text-xs" />
														</FormItem>
													)}
												/>

												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => remove(index)}
													className="mb-1 self-center text-slate-500 hover:text-red-500"
													disabled={sessionFields.length === 1}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										))}
									</div>

									<FormMessage className="text-red-500 text-sm">
										{step2Form.formState.errors.sessions?.message?.toString()}
									</FormMessage>
								</div>

								{/* Actions */}
								<div className="flex flex-col md:flex-row gap-3 justify-between pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={handleStep2Back}
										className="inline-flex items-center gap-2 h-11 rounded-lg border-2 border-slate-300"
									>
										<ChevronLeft className="w-4 h-4" />
										Back to Title
									</Button>

									<Button
										type="submit"
										className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 rounded-lg"
									>
										Create Course
									</Button>
								</div>
							</form>
						</Form>
					</div>
				)}
			</div>

			<div className="mt-4 text-xs text-slate-500">Step {currentStep} of 2</div>
		</div>
	);
}
