// app/admin/instructor-portal/create-course.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type CourseFormData,
	courseSchema,
} from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Trash, Upload } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-course",
)({
	component: CreateCoursePage,
});

const steps = [
	{ id: "title", title: "Course Title" },
	{ id: "descriptions", title: "Descriptions" },
	{ id: "details", title: "Details & Media" },
	{ id: "lessons", title: "Lessons" },
	{ id: "review", title: "Review & Submit" },
];

function CreateCoursePage() {
	const [currentStep, setCurrentStep] = useState(0);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	// const [videoPreview, setVideoPreview] = useState<string | null>(null);

	const form = useForm<any>({
		resolver: zodResolver(courseSchema),
		defaultValues: {
			title: "",
			shortDescription: "",
			description: "",
			category: "",
			level: "beginner",
			duration: 0,
			price: 0,
			discount: 0,
			thumbnail: undefined,
			videoTrailer: undefined,
			lessons: [],
			documents: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "lessons",
	});

	const onSubmit = async (data: CourseFormData) => {
		console.log("Submitted data:", data);
		// Handle actual submission (e.g., API call)
		alert("Course created successfully! (Check console for data)");
	};
	const handleNext = async () => {
		const stepFields = getFieldsForStep(currentStep).map(String);
		const isValid = await form.trigger(stepFields);

		if (isValid) {
			if (currentStep < steps.length - 1) {
				setCurrentStep((prev) => prev + 1);
			} else {
				form.handleSubmit(onSubmit)();
			}
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const getFieldsForStep = (step: number): (keyof any)[] => {
		switch (step) {
			case 0:
				return ["title"];
			case 1:
				return ["shortDescription", "description"];
			case 2:
				return [
					"category",
					"level",
					"duration",
					"price",
					"discount",
					"thumbnail",
					"videoTrailer",
				];
			case 3:
				return ["lessons"];
			default:
				return [];
		}
	};

	const handleFileChange = (
		fieldName: "thumbnail" | "videoTrailer",
		file: File | undefined,
		previewSetter: (url: string | null) => void,
	) => {
		if (file) {
			form.setValue(fieldName, file as any); // Type assertion as Zod expects File in runtime
			const previewUrl = URL.createObjectURL(file);
			previewSetter(previewUrl);
		}
	};

	const handleRemoveThumbnail = () => {
		form.setValue("thumbnail", undefined);
		setThumbnailPreview(null);
		if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
	};

	// const handleRemoveVideo = () => {
	// 	form.setValue("videoTrailer", undefined);
	// 	setVideoPreview(null);
	// 	if (videoPreview) URL.revokeObjectURL(videoPreview);
	// };

	return (
		<div className="container mx-auto py-10 px-4">
			<Card className="max-w-5xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl">Create New Course</CardTitle>
					<CardDescription>
						Fill in the details step by step to create your course.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Stepper Indicator - Mobile-friendly horizontal tabs */}
					<div className="mb-8">
						<Tabs value={currentStep.toString()} className="w-full">
							<TabsList className="grid grid-cols-5 w-full h-auto">
								{steps.map((step, index) => (
									<TabsTrigger
										key={step.id}
										value={index.toString()}
										disabled
										className="flex flex-col items-center gap-1 text-xs"
									>
										<div
											className={`flex h-8 w-8 items-center justify-center rounded-full ${
												index < currentStep
													? "bg-primary text-primary-foreground"
													: index === currentStep
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
											}`}
										>
											{index < currentStep ? (
												<Check className="h-5 w-5" />
											) : (
												index + 1
											)}
										</div>
										<span className="hidden sm:block">{step.title}</span>
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 py-2"
						>
							{/* Step 1: Title */}
							{currentStep === 0 && (
								<div className="space-y-6">
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Course Title <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Introduction to Web Development"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Step 2: Descriptions */}
							{currentStep === 1 && (
								<div className="grid gap-8 md:grid-cols-1">
									<div className="space-y-6">
										<FormField
											control={form.control}
											name="shortDescription"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Short Description</FormLabel>
													<FormControl>
														<Textarea
															placeholder="A brief overview of the course..."
															rows={5}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="space-y-6">
										<FormLabel>
											Full Description <span className="text-red-500">*</span>
										</FormLabel>
										<Controller
											control={form.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<RichTextEditor
															value={field.value}
															onChange={field.onChange}
															height="400px"
															minHeight="200px"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}

							{/* Step 3: Details & Media */}
							{currentStep === 2 && (
								<div className="space-y-8">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="category"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Category <span className="text-red-500">*</span>
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select category" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="Web Development">
																Web Development
															</SelectItem>
															<SelectItem value="Mobile Development">
																Mobile Development
															</SelectItem>
															<SelectItem value="Data Science">
																Data Science
															</SelectItem>
															<SelectItem value="Design">Design</SelectItem>
															<SelectItem value="Business">Business</SelectItem>
															<SelectItem value="Marketing">
																Marketing
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="level"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Difficulty Level{" "}
														<span className="text-red-500">*</span>
													</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select level" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="beginner">Beginner</SelectItem>
															<SelectItem value="intermediate">
																Intermediate
															</SelectItem>
															<SelectItem value="advanced">Advanced</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<FormField
											control={form.control}
											name="duration"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Estimated Duration (minutes){" "}
														<span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder="120"
															{...field}
															onChange={(e) =>
																field.onChange(e.target.valueAsNumber)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="price"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Price (USD) <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															placeholder="49.99"
															{...field}
															onChange={(e) =>
																field.onChange(e.target.valueAsNumber)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="discount"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Discount (%)</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder="0"
															{...field}
															onChange={(e) =>
																field.onChange(e.target.valueAsNumber)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="thumbnail"
											render={({ field: { value, onChange, ...field } }) => (
												<FormItem>
													<FormLabel>Thumbnail Image</FormLabel>
													<FormControl>
														<div className="space-y-4">
															<Input
																type="file"
																accept="image/*"
																onChange={(e) => {
																	const file = e.target.files?.[0];
																	handleFileChange(
																		"thumbnail",
																		file,
																		setThumbnailPreview,
																	);
																}}
																{...field}
															/>
															{thumbnailPreview && (
																<div className="relative">
																	<img
																		src={thumbnailPreview}
																		alt="Thumbnail preview"
																		className="w-full h-64 object-cover rounded-md border"
																	/>
																	<Button
																		type="button"
																		variant="destructive"
																		size="sm"
																		className="absolute top-2 right-2"
																		onClick={handleRemoveThumbnail}
																	>
																		Remove
																	</Button>
																</div>
															)}
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="videoTrailer"
											render={({ field: { value, onChange, ...field } }) => (
												<FormItem>
													<FormLabel>Video Trailer (optional)</FormLabel>
													<FormControl>
														<div className="space-y-4">
															<Input
																type="file"
																accept="video/*"
																onChange={() => {
																	// const file = e.target.files?.[0];
																	// handleFileChange(
																	// 	"videoTrailer",
																	// 	file,
																	// 	setVideoPreview,
																	// );
																}}
																{...field}
															/>
															{/* {videoPreview && (
																<div className="relative">
																	<video
																		src={videoPreview}
																		controls
																		className="w-full max-h-64 rounded-md border"
																	/>
																	<Button
																		type="button"
																		variant="destructive"
																		size="sm"
																		className="absolute top-2 right-2"
																		onClick={handleRemoveVideo}
																	>
																		Remove
																	</Button>
																</div>
															)} */}
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}

							{/* Step 4: Lessons */}
							{currentStep === 3 && (
								<div className="space-y-6">
									<div className="flex justify-between items-center">
										<FormLabel className="text-lg font-semibold">
											Lessons
										</FormLabel>
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												append({
													id: crypto.randomUUID(),
													title: "",
													description: "",
													videoUrl: "",
													duration: 0,
													order: fields.length + 1,
												});
											}}
										>
											Add Lesson
										</Button>
									</div>

									{fields.length === 0 && (
										<p className="text-center text-muted-foreground py-8">
											No lessons added yet. Click "Add Lesson" to start.
										</p>
									)}

									<div className="space-y-6">
										{fields.map((field, index) => (
											<Card key={field.id} className="p-6">
												<div className="flex justify-between items-center mb-4">
													<h4 className="font-medium">Lesson {index + 1}</h4>
													<Button
														type="button"
														variant="destructive"
														size="sm"
														onClick={() => remove(index)}
													>
														<Trash className="h-4 w-4 mr-2" />
														Remove
													</Button>
												</div>

												<div className="space-y-4">
													<FormField
														control={form.control}
														name={`lessons.${index}.title`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Lesson Title{" "}
																	<span className="text-red-500">*</span>
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Lesson 1: Introduction"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`lessons.${index}.description`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Description (optional)</FormLabel>
																<FormControl>
																	<Textarea
																		placeholder="Describe this lesson..."
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<FormField
															control={form.control}
															name={`lessons.${index}.videoUrl`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Video URL (optional)</FormLabel>
																	<FormControl>
																		<Input
																			placeholder="https://example.com/video.mp4"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name={`lessons.${index}.duration`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>
																		Duration (minutes, optional)
																	</FormLabel>
																	<FormControl>
																		<Input
																			type="number"
																			placeholder="15"
																			{...field}
																			onChange={(e) =>
																				field.onChange(e.target.valueAsNumber)
																			}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>
											</Card>
										))}
									</div>
								</div>
							)}

							{/* Step 5: Review */}
							{currentStep === 4 && (
								<div className="space-y-6">
									<h3 className="text-lg font-semibold">Review Your Course</h3>
									<div className="bg-muted/50 p-6 rounded-lg space-y-4">
										{/* You can display a summary of all form values here */}
										<p className="text-sm text-muted-foreground">
											Review all entered information. You can go back to edit
											any step.
										</p>
										<pre className="text-xs bg-background p-4 rounded overflow-auto">
											{JSON.stringify(form.getValues(), null, 2)}
										</pre>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className="flex justify-between pt-8">
								<Button
									type="button"
									variant="outline"
									onClick={handlePrevious}
									disabled={currentStep === 0}
								>
									<ChevronLeft className="mr-2 h-4 w-4" />
									Previous
								</Button>

								<Button type="button" onClick={handleNext}>
									{currentStep === steps.length - 1 ? (
										<>
											Submit Course
											<Upload className="ml-2 h-4 w-4" />
										</>
									) : (
										<>
											Next
											<ChevronRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
