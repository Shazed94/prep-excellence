// app/admin/instructor-portal/create-course.tsx
"use client";

import type { CourseFormData } from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/create-course",
)({
	component: CreateCoursePage,
});

function CreateCoursePage() {
	const [videoPreview, setVideoPreview] = useState<string | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

	const form = useForm<CourseFormData>({
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

	const onSubmit = async () => {};

	const handleAddLesson = () => {
		append({
			id: crypto.randomUUID(),
			title: "",
			description: "",
			videoUrl: "",
			duration: 0,
			order: fields.length + 1,
		});
	};

	// const handleFileChange = (
	// 	fieldName: keyof CourseFormData,
	// 	file: File | undefined,
	// 	previewSetter: (url: string | null) => void,
	// ) => {
	// 	if (file) {
	// 		form.setValue(fieldName, file);
	// 		const previewUrl = URL.createObjectURL(file);
	// 		previewSetter(previewUrl);
	// 	}
	// };

	const handleRemoveVideo = () => {
		form.setValue("videoTrailer", undefined);
		setVideoPreview(null);
		if (videoPreview) {
			URL.revokeObjectURL(videoPreview);
		}
	};

	const handleRemoveThumbnail = () => {
		form.setValue("thumbnail", undefined);
		setThumbnailPreview(null);
		if (thumbnailPreview) {
			URL.revokeObjectURL(thumbnailPreview);
		}
	};
	return (
		<div className="container mx-auto py-10">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle>Create New Course</CardTitle>
					<CardDescription>
						Fill in the basic information to get started with your course
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Course Title */}
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

							{/* Short Description */}
							<FormField
								control={form.control}
								name="shortDescription"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Short Course Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Brief description about the course..."
												rows={2}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Full Description */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Course Description <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe what students will learn in this course..."
												rows={4}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Category and Level */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
													<SelectItem value="Marketing">Marketing</SelectItem>
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
												Difficulty Level <span className="text-red-500">*</span>
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

							{/* Duration and Price */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
													min="1"
													max="1000"
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
													min="0"
													max="10000"
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

							{/* Discount and Thumbnail */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
													min="0"
													max="100"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="thumbnail"
									render={({ field: { value, onChange, ...field } }) => (
										<FormItem>
											<FormLabel>Thumbnail Image</FormLabel>
											<FormControl>
												<div className="space-y-2">
													<Input
														type="file"
														accept="image/*"
														onChange={() => {
															// const file = e.target.files?.[0];
															// handleFileChange(
															// 	"thumbnail",
															// 	file,
															// 	setThumbnailPreview,
															// );
														}}
														{...field}
													/>
													{thumbnailPreview && (
														<div className="mt-2">
															<img
																src={thumbnailPreview}
																alt="Thumbnail preview"
																className="w-full h-40 object-cover rounded-md border"
															/>
															<Button
																type="button"
																variant="outline"
																size="sm"
																className="mt-2"
																onClick={handleRemoveThumbnail}
															>
																Remove Thumbnail
															</Button>
														</div>
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Video Trailer */}
							<FormField
								control={form.control}
								name="videoTrailer"
								render={({ field: { value, onChange, ...field } }) => (
									<FormItem>
										<FormLabel>Video Trailer (optional)</FormLabel>
										<FormControl>
											<div className="space-y-2">
												<Input
													type="file"
													// accept="video/*"
													//   disabled={isLoading}
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
												{videoPreview && (
													<div className="mt-2">
														{/* <video
															src={videoPreview}
															controls
															className="w-full max-h-60 rounded-md border"
														/> */}
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="mt-2"
															onClick={handleRemoveVideo}
															//   disabled={isLoading}
														>
															Remove Video
														</Button>
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Lessons Section */}
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<FormLabel>Lessons</FormLabel>
									<Button
										type="button"
										variant="outline"
										onClick={handleAddLesson}
										// disabled={isLoading}
									>
										Add Lesson
									</Button>
								</div>

								{fields.map((field, index) => (
									<Card key={field.id} className="p-4 space-y-4">
										<div className="flex justify-between items-center">
											<h4 className="font-medium">Lesson {index + 1}</h4>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={() => remove(index)}
												// disabled={isLoading}
											>
												<Trash className="h-4 w-4 mr-2" />
												Remove
											</Button>
										</div>

										<FormField
											control={form.control}
											name={`lessons.${index}.title`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Lesson Title <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Lesson 1: Introduction"
															{...field}
															//   disabled={isLoading}
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
													<FormLabel>Lesson Description (optional)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Describe this lesson..."
															{...field}
															//   disabled={isLoading}
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
																placeholder="https://example.com/lesson-video.mp4"
																{...field}
																// disabled={isLoading}
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
														<FormLabel>Duration (minutes, optional)</FormLabel>
														<FormControl>
															<Input
																type="number"
																placeholder="15"
																min="1"
																{...field}
																onChange={(e) =>
																	field.onChange(e.target.valueAsNumber)
																}
																// disabled={isLoading}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</Card>
								))}
							</div>

							{/* Submit Buttons */}
							<div className="flex flex-col md:flex-row gap-4">
								<Button
									type="submit"
									//   disabled={isLoading}
									className="flex-1"
								>
									{/* {isLoading ? "Creating..." : "Create Course"} */}
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full md:w-auto"
									onClick={() => window.history.back()}
									//   disabled={isLoading}
								>
									Cancel
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
