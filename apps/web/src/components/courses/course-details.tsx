import { zodResolver } from "@hookform/resolvers/zod";
import {
	createLMSCourseSchema,
	type TcreateLMSCourseSchema,
} from "@prepexcellence/shared-validators";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { WizardHeader } from "@/components/courses/wizard-header";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
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
import { useGetCategories } from "@/hooks/course-management";
import { useGetInstructors } from "@/hooks/instructor";

interface CourseDetailsProps {
	courseTitle: string;
	thumbnailFile: File | null;
	onNext: (data: TcreateLMSCourseSchema) => Promise<void>;
	onBack: () => void;
	isLoading?: boolean;
	isEditMode?: boolean;
	initialData?: Partial<TcreateLMSCourseSchema>;
	/** When true, hides the teacher dropdown and locks to initialData.teacherId */
	hideInstructorSelector?: boolean;
	/** Display name shown when instructor selector is hidden */
	lockedInstructorName?: string;
	onStepClick?: (step: 1 | 2 | 3) => void;
}

export function CourseDetails({
	courseTitle,
	thumbnailFile,
	onNext,
	onBack,
	isLoading,
	isEditMode,
	initialData,
	hideInstructorSelector = false,
	lockedInstructorName,
	onStepClick,
}: CourseDetailsProps) {
	const { data: instructorsResponse } = useGetInstructors({
		page: 1,
		limit: 100,
		search: "",
		sortBy: "createdAt",
		orderBy: "desc",
	});

	const instructorsData = instructorsResponse?.data || [];

	const { data: categories } = useGetCategories();

	console.log("instructorsData", instructorsData);

	const form = useForm({
		resolver: zodResolver(createLMSCourseSchema.omit({ title: true, thumbnail: true })) as any,
		defaultValues: {
			teacherId: initialData?.teacherId || "",
			shortDescription: initialData?.shortDescription || "",
			longDescription: initialData?.longDescription || "",
			price: initialData?.price || 0,
			discount: initialData?.discount || undefined,
			level: initialData?.level || "BEGINNER",
			duration: initialData?.duration || undefined,
			categoryId: initialData?.categoryId || "",
			tags: initialData?.tags || [],
			requirements: initialData?.requirements || [],
			whatYouLearn: initialData?.whatYouLearn || [],
		},
	});

	const handleSubmit = async (data: any) => {
		const fullCourseData: TcreateLMSCourseSchema = {
			title: courseTitle,
			shortDescription: data.shortDescription,
			longDescription: data.longDescription,
			price: data.price,
			discount: data.discount,
			level: data.level,
			duration: data.duration,
			categoryId: data.categoryId,
			teacherId: data.teacherId,
			tags: data.tags,
			requirements: data.requirements,
			whatYouLearn: data.whatYouLearn,
			...(thumbnailFile && { thumbnail: thumbnailFile as any }),
		};

		await onNext(fullCourseData);
	};

	return (
		<div className="space-y-6">
			<WizardHeader
				title={`${isEditMode ? "Update Course" : "Course"} Details`}
				subtitle="Pricing, level, category and the course landing-page content."
				currentStep={2}
				onStepClick={onStepClick}
			/>

			<div className="mx-auto w-full max-w-4xl rounded-lg border border-border bg-white p-6 md:p-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<div className="space-y-4">
							<h2 className="font-switzer text-base font-semibold text-foreground">
								Course Information
							</h2>

							{/* First Row - Instructor, Price, Discount, Level */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
								{hideInstructorSelector ? (
									<div className="flex flex-col gap-1">
										<span className="text-sm font-medium text-foreground">
											Instructor
										</span>
										<div className="h-10 px-3 flex items-center rounded-md border border-border bg-muted/5 text-sm text-muted">
											{lockedInstructorName ?? "You (auto-assigned)"}
										</div>
									</div>
								) : (
									<FormField
										control={form.control}
										name="teacherId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Teacher *</FormLabel>
												<FormControl>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<SelectTrigger className="h-10">
															<SelectValue placeholder="Select Instructor" />
														</SelectTrigger>
														<SelectContent>
															{instructorsData?.length > 0 ? (
																instructorsData.map((instructor: any) => (
																	<SelectItem
																		key={instructor.id}
																		value={instructor.id}
																	>
																		{instructor?.name || "Unnamed"}
																	</SelectItem>
																))
															) : (
																<div className="text-sm text-muted p-2">
																	No instructors available
																</div>
															)}
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price *</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={0}
													placeholder="e.g., 99"
													{...field}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
													className="h-10"
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
											<FormLabel>Discount (optional)</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={0}
													placeholder="e.g., 79"
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: undefined,
														)
													}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="level"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Level *</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="h-10">
														<SelectValue placeholder="Select Level" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="BEGINNER">Beginner</SelectItem>
														<SelectItem value="INTERMEDIATE">
															Intermediate
														</SelectItem>
														<SelectItem value="ADVANCED">Advanced</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Second Row - Duration, Category, Tags, Requirements */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
								<FormField
									control={form.control}
									name="duration"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Duration (hours)</FormLabel>
											<FormControl>
												<Input
													type="number"
													min={0}
													placeholder="e.g., 10"
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value
																? Number(e.target.value)
																: undefined,
														)
													}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="categoryId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category *</FormLabel>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="h-10">
														<SelectValue placeholder="Select Category" />
													</SelectTrigger>
													<SelectContent>
														{categories?.length ? (
															categories.map((cat: any) => (
																<SelectItem key={cat.id} value={cat.id}>
																	{cat.name}
																</SelectItem>
															))
														) : (
															<div className="text-sm text-muted p-2">
																No categories available
															</div>
														)}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tags *</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., react, javascript"
													value={field.value?.join(", ") || ""}
													onChange={(e) =>
														field.onChange(
															e.target.value
																.split(",")
																.map((t) => t.trim())
																.filter(Boolean),
														)
													}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="requirements"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Requirements *</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Basic HTML"
													value={field.value?.join(", ") || ""}
													onChange={(e) =>
														field.onChange(
															e.target.value
																.split(",")
																.map((t) => t.trim())
																.filter(Boolean),
														)
													}
													className="h-10"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* What You Learn */}
							<FormField
								control={form.control}
								name="whatYouLearn"
								render={({ field }) => (
									<FormItem>
										<FormLabel>What You Learn *</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Build apps, Learn React"
												value={field.value?.join(", ") || ""}
												onChange={(e) =>
													field.onChange(
														e.target.value
															.split(",")
															.map((t) => t.trim())
															.filter(Boolean),
													)
												}
												className="h-10"
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
										<FormLabel>Short Description *</FormLabel>
										<FormControl>
											<RichTextEditor
												value={field.value}
												onChange={field.onChange}
												height="200px"
												minHeight="150px"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Long Description */}
							<FormField
								control={form.control}
								name="longDescription"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Detailed Description *</FormLabel>
										<FormControl>
											<RichTextEditor
												value={field.value}
												onChange={field.onChange}
												height="300px"
												minHeight="200px"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-between pt-6 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={onBack}
								size="lg"
							>
								<ChevronLeft className="w-4 h-4 mr-2" />
								Back
							</Button>
							<Button
								type="submit"
								size="lg"
								className="px-8"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{isEditMode ? "Updating..." : "Creating..."}
									</>
								) : isEditMode ? (
									"Save & Next"
								) : (
									"Next: Add Modules"
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
