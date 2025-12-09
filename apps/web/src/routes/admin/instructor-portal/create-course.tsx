// app/admin/instructor-portal/create-course.tsx
"use client";

import type { CourseFormData } from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/instructor-portal/create-course")({
	component: CreateCoursePage,
});

function CreateCoursePage() {
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CourseFormData>({
		// resolver: zodResolver(courseSchema),
		defaultValues: {
			discount: 0,
			lessons: [],
			documents: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "lessons",
	});

	const onSubmit = async (data: CourseFormData) => {
		setIsLoading(true);
		try {
			// Add IDs and order to lessons
			const lessonsWithIds = data.lessons.map((lesson, index) => ({
				...lesson,
				id: lesson.id || crypto.randomUUID(),
				order: index + 1,
			}));

			const formData = {
				...data,
				lessons: lessonsWithIds,
			};

			console.log("Form Data:", formData);
		} catch (error) {
			console.error("Error creating course:", error);
		} finally {
			setIsLoading(false);
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
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Course Title */}
						<div className="space-y-2">
							<Label htmlFor="title">Course Title</Label>
							<Input
								placeholder="Introduction to Web Development"
								{...register("title")}
							/>
							{errors.title && (
								<p className="text-sm text-red-600">{errors.title.message}</p>
							)}
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Course Description</Label>
							<Textarea
								placeholder="Describe what students will learn in this course..."
								rows={4}
								{...register("description")}
							/>
							{errors.description && (
								<p className="text-sm text-red-600">
									{errors.description.message}
								</p>
							)}
						</div>

						{/* Category and Level */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Controller
									name="category"
									control={control}
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
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
									)}
								/>
								{errors.category && (
									<p className="text-sm text-red-600">
										{errors.category.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="level">Difficulty Level</Label>
								<Controller
									name="level"
									control={control}
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select level" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="beginner">Beginner</SelectItem>
												<SelectItem value="intermediate">
													Intermediate
												</SelectItem>
												<SelectItem value="advanced">Advanced</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.level && (
									<p className="text-sm text-red-600">{errors.level.message}</p>
								)}
							</div>
						</div>

						{/* Duration and Price */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="duration">Estimated Duration (minutes)</Label>
								<Input
									type="number"
									placeholder="120"
									min="1"
									max="1000"
									{...register("duration", { valueAsNumber: true })}
								/>
								{errors.duration && (
									<p className="text-sm text-red-600">
										{errors.duration.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="price">Price (USD)</Label>
								<Input
									type="number"
									step="0.01"
									placeholder="49.99"
									min="0"
									max="10000"
									{...register("price", { valueAsNumber: true })}
								/>
								{errors.price && (
									<p className="text-sm text-red-600">{errors.price.message}</p>
								)}
							</div>
						</div>

						{/* Discount and Thumbnail */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="discount">Discount (%)</Label>
								<Input
									type="number"
									placeholder="0"
									min="0"
									max="100"
									{...register("discount", { valueAsNumber: true })}
								/>
								{errors.discount && (
									<p className="text-sm text-red-600">
										{errors.discount.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="thumbnail">Thumbnail URL</Label>
								<Input
									placeholder="https://example.com/image.jpg"
									{...register("thumbnail")}
								/>
								{errors.thumbnail && (
									<p className="text-sm text-red-600">
										{errors.thumbnail.message}
									</p>
								)}
							</div>
						</div>

						{/* Video Trailer */}
						{/* <div className="space-y-2">
							<Label htmlFor="videoTrailer">Video Trailer URL (optional)</Label>
							<Input
								id="videoTrailer"
								placeholder="https://example.com/trailer.mp4"
								{...register("videoTrailer")}
							/>
							{errors.videoTrailer && (
								<p className="text-sm text-red-600">
									{errors.videoTrailer.message}
								</p>
							)}
						</div> */}

						{/* Lessons Section */}
						<div className="space-y-4">
							<div className="flex justify-between items-center">
								<Label>Lessons</Label>
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										append({
											id: crypto.randomUUID(),
											title: "",
											description: "",
											order: fields.length + 1,
										})
									}
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
										>
											<Trash className="h-4 w-4 mr-2" />
											Remove
										</Button>
									</div>

									<div className="space-y-2">
										<Label htmlFor={`lessons.${index}.title`}>
											Lesson Title
										</Label>
										<Input
											placeholder="Lesson 1: Introduction"
											{...register(`lessons.${index}.title` as const)}
										/>
										{errors.lessons?.[index]?.title && (
											<p className="text-sm text-red-600">
												{errors.lessons[index]?.title?.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor={`lessons.${index}.description`}>
											Lesson Description (optional)
										</Label>
										<Textarea
											placeholder="Describe this lesson..."
											{...register(`lessons.${index}.description` as const)}
										/>
										{errors.lessons?.[index]?.description && (
											<p className="text-sm text-red-600">
												{errors.lessons[index]?.description?.message}
											</p>
										)}
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor={`lessons.${index}.videoUrl`}>
												Video URL (optional)
											</Label>
											<Input
												placeholder="https://example.com/lesson-video.mp4"
												{...register(`lessons.${index}.videoUrl` as const)}
											/>
											{errors.lessons?.[index]?.videoUrl && (
												<p className="text-sm text-red-600">
													{errors.lessons[index]?.videoUrl?.message}
												</p>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor={`lessons.${index}.duration`}>
												Duration (minutes, optional)
											</Label>
											<Input
												id={`lessons.${index}.duration`}
												type="number"
												placeholder="15"
												min="1"
												{...register(`lessons.${index}.duration` as const, {
													setValueAs: (v) => (v === "" ? undefined : Number(v)),
												})}
											/>
											{errors.lessons?.[index]?.duration && (
												<p className="text-sm text-red-600">
													{errors.lessons[index]?.duration?.message}
												</p>
											)}
										</div>
									</div>
								</Card>
							))}
						</div>

						{/* Submit Buttons */}
						<div className="flex flex-col md:flex-row gap-4">
							<Button type="submit" disabled={isLoading} className="flex-1">
								{isLoading ? "Creating..." : "Create Course"}
							</Button>
							<Button
								type="button"
								variant="outline"
								className="w-full md:w-auto"
								onClick={() => window.history.back()}
							>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
