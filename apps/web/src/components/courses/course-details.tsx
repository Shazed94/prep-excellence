import type { TcreateLMSCourseSchema } from "@prepexcellence/shared-validators";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { useGetInstructors } from "@/hooks/instructor";

interface CourseDetailsProps {
	courseTitle: string;
	thumbnailFile: File | null;
	onNext: (data: TcreateLMSCourseSchema) => Promise<void>;
	onBack: () => void;
	isLoading?: boolean;
	isEditMode?: boolean;
	initialData?: Partial<TcreateLMSCourseSchema>;
}

export function CourseDetails({
	courseTitle,
	thumbnailFile,
	onNext,
	onBack,
	isLoading,
	isEditMode,
	initialData,
}: CourseDetailsProps) {
	const { data: instructorsResponse } = useGetInstructors({
		page: 1,
		limit: 100,
		search: "",
		sortBy: "createdAt",
		orderBy: "desc",
	});

	const instructorsData = instructorsResponse?.data || [];

	const form = useForm<any>({
		defaultValues: {
			instructorId: initialData?.instructorId || "",
			description: initialData?.description || "",
			price: initialData?.price || 0,
			discount: initialData?.discount || undefined,
			level: initialData?.level || "BEGINNER",
			duration: initialData?.duration || undefined,
			category: initialData?.category || "",
			tags: initialData?.tags || [],
			requirements: initialData?.requirements || [],
			whatYouLearn: initialData?.whatYouLearn || [],
		},
	});

	const handleSubmit = async (data: TcreateLMSCourseSchema) => {
		const fullCourseData: TcreateLMSCourseSchema = {
			title: courseTitle,
			description: data.description,
			price: data.price,
			discount: data.discount,
			level: data.level,
			duration: data.duration,
			category: data.category,
			tags: data.tags,
			requirements: data.requirements,
			whatYouLearn: data.whatYouLearn,
			instructorId: data.instructorId,
			thumbnail: thumbnailFile as any,
		};

		await onNext(fullCourseData);
	};

	return (
		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10 min-h-screen">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
						{isEditMode ? "Update Course" : "Course"} Details
					</h1>
					<p className="text-slate-600">
						Step 2: Complete the course details and select instructor
					</p>
				</div>
			</div>

			<div className="w-full max-w-8xl mx-auto rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-900">
								Course Information
							</h2>

							{/* First Row - Instructor, Price, Discount, Level */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
								<FormField
									control={form.control}
									name="instructorId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Instructor Name*</FormLabel>
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
																	{instructor.user?.name || "Unnamed"}
																</SelectItem>
															))
														) : (
															<div className="text-sm text-gray-500 p-2">
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
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category *</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Web Development"
													{...field}
													className="h-10"
												/>
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

							{/* Description */}
							<FormField
								control={form.control}
								name="description"
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
								) : (
									<>{isEditMode ? "Save & Next" : "Next: Add Modules"}</>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
