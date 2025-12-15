"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCreateTeacher,
	ZCTeacher,
} from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Upload, User, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { usePostInstructor } from "@/hooks/instructor";

export const Route = createFileRoute(
	"/dashboard/instructor-portal/add-instructor",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <AddInstructorForm />;
}

function AddInstructorForm() {
	const [activeTab, setActiveTab] = useState<"basic" | "professional">("basic");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [localCertifications, setLocalCertifications] = useState<string[]>([]);
	const [localSubjects, setLocalSubjects] = useState<string[]>([]);

	const { mutateAsync: postInstructor, isPending } = usePostInstructor();

	const form = useForm<TCreateTeacher>({
		resolver: zodResolver(ZCTeacher),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			qualifications: "",
			experienceYears: 0,
			certifications: [],
			subjects: [],
			bio: "",
			image: "",
		},
	});

	const onSubmit = async (data: TCreateTeacher) => {
		try {
			setIsSubmitting(true);

			// Upload image if exists (you need to implement this)
			if (imageFile) {
				const imageUrl = await uploadImage(imageFile);
				data.image = imageUrl;
			}

			// Ensure arrays are properly set
			data.certifications = localCertifications;
			data.subjects = localSubjects;

			console.log("Submitting instructor data:", data);

			// Make API call using the mutation hook
			await postInstructor(data);

			// Reset form and state
			form.reset({
				name: "",
				email: "",
				password: "",
				phone: "",
				address: "",
				qualifications: "",
				experienceYears: 0,
				certifications: [],
				subjects: [],
				bio: "",
				image: "",
			});

			setLocalCertifications([]);
			setLocalSubjects([]);
			setImageFile(null);
			setImagePreview("");
			setActiveTab("basic");

			// Show success message
			toast.success("Instructor added successfully!", {
				description: `${data.name} has been added to the system.`,
			});
		} catch (error: any) {
			console.error("Error adding instructor:", error);

			// Show specific error message if available
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Failed to add instructor";

			toast.error("Failed to add instructor", {
				description: errorMessage,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const uploadImage = async (file: File): Promise<string> => {
		// TODO: Implement actual image upload to your server/cloud storage
		// This is a mock implementation - replace with actual upload logic

		// For now, we'll create a FormData object and upload it
		// You need to create an API endpoint for image uploads
		const formData = new FormData();
		formData.append("image", file);

		try {
			// Example of actual upload (uncomment and modify as needed):
			// const response = await axiosInstance.post("/upload", formData, {
			//   headers: {
			//     "Content-Type": "multipart/form-data",
			//   },
			// });
			// return response.data.url;

			// Mock implementation for now
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return URL.createObjectURL(file); // Replace with actual image URL from backend
		} catch (error) {
			console.error("Error uploading image:", error);
			throw new Error("Failed to upload image");
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				form.setError("image", { message: "Please upload an image file" });
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				form.setError("image", { message: "Image size must be less than 5MB" });
				return;
			}

			setImageFile(file);
			form.setValue("image", file.name, { shouldValidate: true });

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			// Clear any previous errors
			form.clearErrors("image");
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview("");
		form.setValue("image", "");
	};

	const handleTabChange = async (value: string) => {
		if (value === "professional" && activeTab === "basic") {
			const isValid = await form.trigger(["name", "email", "password"]);
			if (isValid) {
				setActiveTab("professional" as "basic" | "professional");
			}
		} else {
			setActiveTab(value as "basic" | "professional");
		}
	};

	const addCertification = (cert: string) => {
		if (cert.trim()) {
			const updated = [...localCertifications, cert.trim()];
			setLocalCertifications(updated);
			form.setValue("certifications", updated);
		}
	};

	const removeCertification = (index: number) => {
		const updated = localCertifications.filter((_, i) => i !== index);
		setLocalCertifications(updated);
		form.setValue("certifications", updated);
	};

	const addSubject = (subject: string) => {
		if (subject.trim()) {
			const updated = [...localSubjects, subject.trim()];
			setLocalSubjects(updated);
			form.setValue("subjects", updated);
		}
	};

	const removeSubject = (index: number) => {
		const updated = localSubjects.filter((_, i) => i !== index);
		setLocalSubjects(updated);
		form.setValue("subjects", updated);
	};

	// Check if we're in a submitting state
	const submitting = isSubmitting || isPending;

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Add New Instructor</h1>
				<p className="text-gray-600 mt-2">Fill in the instructor's details</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Instructor Information</CardTitle>
					<CardDescription>
						Complete all required fields to add a new instructor
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<TabsList className="bg-gray-200">
							<TabsTrigger value="basic">Basic Information</TabsTrigger>
							<TabsTrigger value="professional">
								Professional Information
							</TabsTrigger>
						</TabsList>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
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
															className="h-10"
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
															className="h-10"
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
															className="h-10"
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
															placeholder="+1 (555) 123-4567"
															{...field}
															className="h-10"
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
																className="h-10"
																disabled={submitting}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										{/* Image Upload Section */}
										<div className="md:col-span-2">
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
																					className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
																					document
																						.getElementById("image-upload")
																						?.click()
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

								<TabsContent value="professional" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
										<FormField
											control={form.control}
											name="qualifications"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Qualifications</FormLabel>
													<FormControl>
														<Textarea
															placeholder="e.g., M.Sc in Mathematics, B.Ed"
															{...field}
															className=""
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="experienceYears"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Years of Experience</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="0"
															max="50"
															{...field}
															onChange={(e) =>
																field.onChange(
																	parseInt(e.target.value, 10) ?? 0,
																)
															}
															className="h-10"
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="md:col-span-2">
											<FormItem>
												<FormLabel>Certifications</FormLabel>
												<CertificationsField
													certifications={localCertifications}
													onAdd={addCertification}
													onRemove={removeCertification}
													disabled={submitting}
												/>
												<FormMessage />
											</FormItem>
										</div>

										<div className="md:col-span-2">
											<FormItem>
												<FormLabel>Subjects</FormLabel>
												<SubjectsField
													subjects={localSubjects}
													onAdd={addSubject}
													onRemove={removeSubject}
													disabled={submitting}
												/>
												<FormMessage />
											</FormItem>
										</div>

										<div className="md:col-span-2">
											<FormField
												control={form.control}
												name="bio"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Bio</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Tell us about the instructor's teaching philosophy and experience..."
																{...field}
																className="min-h-[60px]"
																disabled={submitting}
															/>
														</FormControl>
														<FormDescription>
															{field.value?.length || 0}/500 characters
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</TabsContent>

								<div className="flex justify-between pt-6 border-t">
									{activeTab === "professional" && (
										<Button
											type="button"
											variant="outline"
											onClick={() => setActiveTab("basic")}
											disabled={submitting}
										>
											Back to Basic Info
										</Button>
									)}
									<div className="ml-auto flex space-x-4">
										{activeTab === "basic" ? (
											<Button
												type="button"
												onClick={async () => {
													const isValid = await form.trigger([
														"name",
														"email",
														"password",
													]);
													if (isValid) {
														setActiveTab("professional");
													}
												}}
												disabled={submitting}
											>
												Next: Professional Info
											</Button>
										) : (
											<div className="flex gap-4">
												<Button
													type="button"
													variant="outline"
													onClick={() => setActiveTab("basic")}
													disabled={submitting}
													className="cursor-pointer"
												>
													Back
												</Button>
												<Button
													type="submit"
													disabled={submitting}
													className="cursor-pointer"
												>
													{submitting ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Adding Instructor...
														</>
													) : (
														"Add Instructor"
													)}
												</Button>
											</div>
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

// Updated CertificationsField component
function CertificationsField({
	certifications,
	onAdd,
	onRemove,
	disabled,
}: {
	certifications: string[];
	onAdd: (cert: string) => void;
	onRemove: (index: number) => void;
	disabled?: boolean;
}) {
	const [input, setInput] = useState("");

	const addCertification = () => {
		if (input.trim()) {
			onAdd(input.trim());
			setInput("");
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Add a certification"
					onKeyPress={(e) =>
						e.key === "Enter" && (e.preventDefault() ?? addCertification())
					}
					className="h-10"
					disabled={disabled}
				/>
				<Button
					type="button"
					variant="outline"
					onClick={addCertification}
					className="h-10"
					disabled={disabled}
				>
					Add
				</Button>
			</div>
			<div className="flex flex-wrap gap-2 mt-2">
				{certifications?.map((cert: string, index: number) => (
					<Badge key={index} variant="secondary" className="px-3 py-1">
						{cert}
						<button
							type="button"
							onClick={() => onRemove(index)}
							disabled={disabled}
							className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}
			</div>
		</div>
	);
}

// Updated SubjectsField component
function SubjectsField({
	subjects,
	onAdd,
	onRemove,
	disabled,
}: {
	subjects: string[];
	onAdd: (subject: string) => void;
	onRemove: (index: number) => void;
	disabled?: boolean;
}) {
	const [input, setInput] = useState("");

	const addSubject = () => {
		if (input.trim()) {
			onAdd(input.trim());
			setInput("");
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex gap-2">
				<Input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Add a subject"
					onKeyPress={(e) =>
						e.key === "Enter" && (e.preventDefault() ?? addSubject())
					}
					className="h-10"
					disabled={disabled}
				/>
				<Button
					type="button"
					variant="outline"
					onClick={addSubject}
					className="h-10"
					disabled={disabled}
				>
					Add
				</Button>
			</div>
			<div className="flex flex-wrap gap-2 mt-2">
				{subjects?.map((subject: string, index: number) => (
					<Badge key={index} variant="outline" className="px-3 py-1">
						{subject}
						<button
							type="button"
							onClick={() => onRemove(index)}
							disabled={disabled}
							className="ml-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}
			</div>
		</div>
	);
}
