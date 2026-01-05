"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCreateTeacher,
	ZCTeacherForm,
} from "@prepexcellence/shared-validators";
import { Loader2, Upload, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePostInstructor } from "@/hooks/instructor";

export default function AddTeacherForm() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [localCertifications, setLocalCertifications] = useState<string[]>([]);
	const [localSubjects, setLocalSubjects] = useState<string[]>([]);

	const { mutateAsync: postInstructor, isPending } = usePostInstructor();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<TCreateTeacher>({
		resolver: zodResolver(ZCTeacherForm),
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
			role: "TEACHER",
		},
	});

	const onSubmit = async (data: any) => {
		try {
			setIsSubmitting(true);

			// Ensure arrays are properly set
			data.certifications = localCertifications;
			data.subjects = localSubjects;

			const formData = new FormData();
			if (!imageFile) {
				toast.error("Please upload an image");
				setIsSubmitting(false);
				return;
			}
			// Append all form fields to FormData
			formData.append("name", data.name);
			formData.append("email", data.email);
			formData.append("password", data.password);
			if (data.phone) formData.append("phone", data.phone);
			if (data.address) formData.append("address", data.address);
			if (data.qualifications)
				formData.append("qualifications", data.qualifications);
			if (data.experienceYears)
				formData.append("experienceYears", String(data.experienceYears));
			if (data.certifications)
				formData.append("certifications", JSON.stringify(data.certifications));
			if (data.subjects)
				formData.append("subjects", JSON.stringify(data.subjects));
			if (data.bio) formData.append("bio", data.bio);
			if (data.image) formData.append("image", data.image);
			formData.append("role", data.role);

			// Make API call using the mutation hook
			const result = await postInstructor(data);
			console.log("Instructor created successfully:", result);

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
				role: "TEACHER",
			});

			setLocalCertifications([]);
			setLocalSubjects([]);
			setImageFile(null);
			setImagePreview("");

			// Show success message
			toast.success("Instructor added successfully!");
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

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type - specific formats like blog implementation
			const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
			if (!validTypes.includes(file.type)) {
				form.setError("image", { message: "Please upload a valid image file" });
				toast.error("Please select a valid image file (JPG, PNG, or WebP)");
				return;
			}

			// Validate file size (5MB max)
			const maxSize = 5 * 1024 * 1024; // 5MB in bytes
			if (file.size > maxSize) {
				form.setError("image", { message: "Image size must be less than 5MB" });
				toast.error("Image size should not exceed 5MB");
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

			toast.info("Image selected", {
				description: `${file.name} ready for upload`,
			});
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview("");
		form.setValue("image", "");
		// Reset file input
		const fileInput = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		if (fileInput) {
			fileInput.value = "";
		}
		toast.info("Image removed");
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
		<div className="">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Add New Instructor</h1>
				<p className="text-gray-600 mt-2">Fill in the instructor's details</p>
			</div>

			<Card>
				{/* <CardHeader>
          <CardTitle>Instructor Information</CardTitle>
          <CardDescription>
            Complete all required fields to add a new instructor
          </CardDescription> */}
				{/* </CardHeader> */}
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 pt-4"
						>
							{/* Basic Information Section */}
							<div className="space-y-4">
								<div className="border-b pb-2">
									<h3 className="text-lg font-semibold text-gray-900">
										Basic Information
									</h3>
									<p className="text-sm text-gray-600">
										Enter the instructor's personal details
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
														placeholder="12345678901"
														{...field}
														value={field.value || ""}
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
															value={field.value || ""}
															className="h-10"
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Profile Picture Section */}
								<div className="pt-4">
									<FormField
										control={form.control}
										name="image"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Profile Picture</FormLabel>
												<FormControl>
													<div className="space-y-4">
														<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
															<div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
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
															<div className="flex-1 w-full sm:max-w-xs">
																<Input
																	ref={fileInputRef}
																	type="file"
																	accept="image/jpeg,image/jpg,image/png,image/webp"
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

							{/* Professional Information Section */}
							<div className="space-y-4">
								<div className="border-b pb-2">
									<h3 className="text-lg font-semibold text-gray-900">
										Professional Information
									</h3>
									<p className="text-sm text-gray-600">
										Enter the instructor's professional details
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									<FormField
										control={form.control}
										name="role"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Role*</FormLabel>
												<FormControl>
													<Select
														onValueChange={field.onChange}
														value={field.value}
														disabled={submitting}
													>
														<FormControl>
															<SelectTrigger className="w-full h-10">
																<SelectValue placeholder="Select role" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="TEACHER">Teacher</SelectItem>
															<SelectItem value="INSTRUCTOR">
																Instructor
															</SelectItem>
														</SelectContent>
													</Select>
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
														value={field.value || 0}
														onChange={(e) => {
															const val =
																e.target.value === ""
																	? 0
																	: parseInt(e.target.value, 10);
															field.onChange(val);
														}}
														className="h-10"
														disabled={submitting}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="lg:col-span-1">
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
															value={field.value || ""}
															className="min-h-[80px] resize-none"
															disabled={submitting}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="md:col-span-2 lg:col-span-3 flex  gap-4 w-full">
										<div className="w-full">
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
										<div className="w-full">
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
									</div>

									<div className="md:col-span-2 lg:col-span-3">
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
															value={field.value || ""}
															className="min-h-[120px] resize-none"
															disabled={submitting}
														/>
													</FormControl>
													<FormDescription>
														{field.value?.length || 0} characters
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className="flex justify-end pt-6 border-t">
								<Button
									type="submit"
									disabled={submitting}
									className="min-w-[200px]"
								>
									{submitting ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										"Add Instructor"
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
