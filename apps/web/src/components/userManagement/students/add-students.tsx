"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TCreateStudent } from "@prepexcellence/shared-validators";
import { Link } from "@tanstack/react-router";
import { Loader2, Upload, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { any } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostStudent } from "@/hooks/user-management";

export default function AddStudentForm() {
	const [activeTab, setActiveTab] = useState<"basic" | "academic" | "guardian">(
		"basic",
	);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { mutateAsync: postStudent, isPending } = usePostStudent();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<TCreateStudent>({
		resolver: zodResolver(any()),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			image: "",
			// roleId: "", // This should be set based on your role system
			isStaff: false,
			isVerified: false,
			grade: "",
			class: "",
			section: "",
			enrollmentDate: new Date(),
			currentLevel: "",
			gpa: 0,
			totalCredits: 0,
			academicStatus: "ACTIVE",
			guardianName: "",
			guardianPhone: "",
			guardianEmail: "",
		},
	});

	const onSubmit = async (data: TCreateStudent) => {
		try {
			setIsSubmitting(true);

			// If image file exists, convert to base64 or upload
			if (imageFile) {
				// Option 1: Convert to base64 (if backend accepts base64)
				const reader = new FileReader();
				reader.readAsDataURL(imageFile);
				reader.onloadend = () => {
					data.image = reader.result as string;
				};

				// Option 2: Upload to server first (uncomment if you have upload endpoint)
				// try {
				//     const imageUrl = await uploadImage(imageFile);
				//     data.image = imageUrl;
				//     toast.success("Image uploaded successfully");
				// } catch (error: any) {
				//     toast.error("Failed to upload image");
				//     setIsSubmitting(false);
				//     return;
				// }
			}

			// Convert date to ISO string if exists
			if (data.enrollmentDate) {
				data.enrollmentDate = new Date(data.enrollmentDate) as any;
			}

			// Make API call
			await postStudent(data);

			// Reset form
			form.reset();
			setImageFile(null);
			setImagePreview("");
			setActiveTab("basic");

			toast.success("Student added successfully!");
		} catch (error: any) {
			console.error("Error adding student:", error);
			toast.error("Failed to add student", {
				description: error.response?.data?.message || error.message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast.error("Invalid file type", {
					description: "Please select an image file (JPG, PNG, GIF)",
				});
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				toast.error("File too large", {
					description: "Image size must be less than 5MB",
				});
				return;
			}

			setImageFile(file);
			form.setValue("image", file.name);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			toast.info("Image selected", {
				description: `${file.name} ready for upload`,
			});
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview("");
		form.setValue("image", "");
		toast.info("Image removed");
	};

	const handleTabChange = async (value: string) => {
		if (value === "academic" && activeTab === "basic") {
			const isValid = await form.trigger(["name", "email", "password"]);
			if (isValid) {
				setActiveTab("academic");
			}
		} else if (value === "guardian" && activeTab === "academic") {
			setActiveTab("guardian");
		} else {
			setActiveTab(value as "basic" | "academic" | "guardian");
		}
	};

	const submitting = isSubmitting || isPending;

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center ">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
					<p className="text-gray-600 mt-2">Fill in the student's details</p>
				</div>
				<Button>
					<Link to="/dashboard/user-management/students">
						Back to Students List
					</Link>
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Student Information</CardTitle>
					<CardDescription>
						Complete all required fields to add a new student
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<TabsList className="bg-gray-200">
							<TabsTrigger value="basic">Basic Information</TabsTrigger>
							<TabsTrigger value="academic">Academic Information</TabsTrigger>
							<TabsTrigger value="guardian">Guardian Information</TabsTrigger>
						</TabsList>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								{/* BASIC INFORMATION TAB */}
								<TabsContent value="basic" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Name*</FormLabel>
													<FormControl>
														<Input
															placeholder="John Doe"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email*</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="john.doe@example.com"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password*</FormLabel>
													<FormControl>
														<Input
															type="password"
															placeholder="••••••••"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<Input
															type="tel"
															placeholder="01234567890"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="md:col-span-2">
											<FormField
												control={form.control}
												name="address"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Address</FormLabel>
														<FormControl>
															<Input
																placeholder="123 Main St, City, State, ZIP"
																{...field}
																disabled={submitting}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										{/* <FormField
                                            control={form.control}
                                            name="roleId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role ID*</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter role ID"
                                                            {...field}
                                                            disabled={submitting}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Student role identifier
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        /> */}

										{/* Image Upload Section */}
										<div className="md:col-span-3">
											<FormField
												control={form.control}
												name="image"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Profile Picture</FormLabel>
														<FormControl>
															<div className="space-y-4">
																<div className="flex items-center gap-4">
																	<div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
																		{imagePreview ? (
																			<>
																				<img
																					src={imagePreview}
																					alt="Preview"
																					className="w-full h-full object-cover"
																				/>
																				<button
																					type="button"
																					onClick={removeImage}
																					disabled={submitting}
																					className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
																				>
																					<X className="h-4 w-4" />
																				</button>
																			</>
																		) : (
																			<User className="h-16 w-16 text-gray-400" />
																		)}
																	</div>
																	<div className="flex-1">
																		<Input
																			ref={fileInputRef}
																			type="file"
																			accept="image/*"
																			onChange={handleImageChange}
																			className="hidden"
																			disabled={submitting}
																		/>
																		<div className="space-y-2">
																			<Button
																				type="button"
																				variant="outline"
																				onClick={() =>
																					fileInputRef.current?.click()
																				}
																				className="w-full"
																				disabled={submitting}
																			>
																				<Upload className="mr-2 h-4 w-4" />
																				Upload Image
																			</Button>
																			<p className="text-sm text-gray-500">
																				{field.value || "No file chosen"}
																			</p>
																			<p className="text-xs text-gray-400">
																				JPG, PNG or GIF • Max 5MB
																			</p>
																		</div>
																	</div>
																</div>
															</div>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</TabsContent>

								{/* ACADEMIC INFORMATION TAB */}
								<TabsContent value="academic" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
										<FormField
											control={form.control}
											name="grade"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Grade</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., 10"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="class"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Class</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., A"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="section"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Section</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Morning"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="currentLevel"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Current Level</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Intermediate"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="enrollmentDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Enrollment Date</FormLabel>
													<FormControl>
														<Input
															type="date"
															{...field}
															value={
																field.value
																	? new Date(field.value)
																			.toISOString()
																			.split("T")[0]
																	: ""
															}
															onChange={(e) =>
																field.onChange(
																	e.target.value
																		? new Date(e.target.value)
																		: undefined,
																)
															}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="gpa"
											render={({ field }) => (
												<FormItem>
													<FormLabel>GPA</FormLabel>
													<FormControl>
														<Input
															type="number"
															step="0.01"
															min="0"
															max="4"
															placeholder="e.g., 3.75"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target.value
																		? parseFloat(e.target.value)
																		: undefined,
																)
															}
															value={field.value ?? ""}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="totalCredits"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Total Credits</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="0"
															placeholder="e.g., 120"
															{...field}
															onChange={(e) =>
																field.onChange(
																	e.target.value
																		? parseInt(e.target.value, 10)
																		: undefined,
																)
															}
															value={field.value ?? ""}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="academicStatus"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Academic Status</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
														disabled={submitting}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select status" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="ACTIVE">Active</SelectItem>
															<SelectItem value="PROBATION">
																Probation
															</SelectItem>
															<SelectItem value="GRADUATED">
																Graduated
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</TabsContent>

								{/* GUARDIAN INFORMATION TAB */}
								<TabsContent value="guardian" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<FormField
											control={form.control}
											name="guardianName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Guardian Name</FormLabel>
													<FormControl>
														<Input
															placeholder="John Smith"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="guardianPhone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Guardian Phone</FormLabel>
													<FormControl>
														<Input
															type="tel"
															placeholder="01234567890"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="guardianEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Guardian Email</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="guardian@example.com"
															{...field}
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</TabsContent>

								{/* NAVIGATION BUTTONS */}
								<div className="flex justify-between pt-6 border-t">
									{activeTab !== "basic" && (
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												if (activeTab === "guardian") setActiveTab("academic");
												else if (activeTab === "academic")
													setActiveTab("basic");
											}}
											disabled={submitting}
										>
											Back
										</Button>
									)}
									<div className="ml-auto flex space-x-4">
										{activeTab === "basic" && (
											<Button
												type="button"
												onClick={async () => {
													const isValid = await form.trigger([
														"name",
														"email",
														"password",
													]);
													if (isValid) setActiveTab("academic");
												}}
												disabled={submitting}
											>
												Next: Academic Info
											</Button>
										)}
										{activeTab === "academic" && (
											<Button
												type="button"
												onClick={() => setActiveTab("guardian")}
												disabled={submitting}
											>
												Next: Guardian Info
											</Button>
										)}
										{activeTab === "guardian" && (
											<Button type="submit" disabled={submitting}>
												{submitting ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														Adding Student...
													</>
												) : (
													"Add Student"
												)}
											</Button>
										)}
									</div>
								</div>
							</form>
						</Form>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
