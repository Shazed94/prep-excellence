// import { zodResolver } from "@hookform/resolvers/zod";
// import {
// 	type TCInstructor,
// 	ZCInstructor,
// } from "@prepexcellence/shared-validators";
// import { createFileRoute } from "@tanstack/react-router";
// import { Loader2, Upload, User, X } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import {
// 	Form,
// 	FormControl,
// 	FormDescription,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Textarea } from "@/components/ui/textarea";

// export const Route = createFileRoute(
// 	"/dashboard/instructor-portal/add-instructor",
// )({
// 	component: RouteComponent,
// });

// function RouteComponent() {
// 	return <AddInstructorForm />;
// }

// function AddInstructorForm() {
// 	const [activeTab, setActiveTab] = useState<"basic" | "professional">("basic");
// 	const [imageFile, setImageFile] = useState<File | null>(null);
// 	const [imagePreview, setImagePreview] = useState<string>("");
// 	const [uploading, setUploading] = useState(false);

// 	const form = useForm<TCInstructor>({
// 		resolver: zodResolver(ZCInstructor),
// 		defaultValues: {
// 			name: "",
// 			email: "",
// 			password: "",
// 			phone: "",
// 			address: "",
// 			qualifications: "",
// 			experienceYears: 0,
// 			certifications: [],
// 			subjects: [],
// 			bio: "",
// 			image: "",
// 		},
// 	});

// 	const onSubmit = async (data: TCInstructor) => {
// 		try {
// 			setUploading(true);

// 			// Upload image if exists
// 			if (imageFile) {
// 				const imageUrl = await uploadImage(imageFile);
// 				data.image = imageUrl;
// 			}

// 			console.log("Submitting instructor data:", data);
// 			// Add your API call here
// 			// await api.addInstructor(data)

// 			form.reset();
// 			setImageFile(null);
// 			setImagePreview("");
// 			setActiveTab("basic");

// 			// Show success message
// 			alert("Instructor added successfully!");
// 		} catch (error) {
// 			console.error("Error adding instructor:", error);
// 			alert("Failed to add instructor");
// 		} finally {
// 			setUploading(false);
// 		}
// 	};

// 	const uploadImage = async (file: File): Promise<string> => {
// 		// Simulate image upload - replace with actual upload logic
// 		await new Promise((resolve) => setTimeout(resolve, 1000));
// 		return URL.createObjectURL(file); // This would be your actual image URL from backend
// 	};

// 	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (file) {
// 			// Validate file type
// 			if (!file.type.startsWith("image/")) {
// 				form.setError("image", { message: "Please upload an image file" });
// 				return;
// 			}

// 			// Validate file size (max 5MB)
// 			if (file.size > 5 * 1024 * 1024) {
// 				form.setError("image", { message: "Image size must be less than 5MB" });
// 				return;
// 			}

// 			setImageFile(file);
// 			form.setValue("image", file.name, { shouldValidate: true });

// 			// Create preview
// 			const reader = new FileReader();
// 			reader.onloadend = () => {
// 				setImagePreview(reader.result as string);
// 			};
// 			reader.readAsDataURL(file);

// 			// Clear any previous errors
// 			form.clearErrors("image");
// 		}
// 	};

// 	const removeImage = () => {
// 		setImageFile(null);
// 		setImagePreview("");
// 		form.setValue("image", "");
// 	};

// 	const handleTabChange = async (value: string) => {
// 		if (value === "professional" && activeTab === "basic") {
// 			const isValid = await form.trigger(["name", "email", "password"]);
// 			if (isValid) {
// 				setActiveTab("professional" as "basic" | "professional");
// 			}
// 		} else {
// 			setActiveTab(value as "basic" | "professional");
// 		}
// 	};

// 	return (
// 		<div className="container mx-auto py-8 px-4">
// 			<div className="mb-8">
// 				<h1 className="text-3xl font-bold text-gray-900">Add New Instructor</h1>
// 				<p className="text-gray-600 mt-2">Fill in the instructor's details</p>
// 			</div>

// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Instructor Information</CardTitle>
// 					<CardDescription>
// 						Complete all required fields to add a new instructor
// 					</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					<Tabs value={activeTab} onValueChange={handleTabChange}>
// 						<TabsList className="bg-gray-200">
// 							<TabsTrigger value="basic">Basic Information</TabsTrigger>
// 							<TabsTrigger value="professional">
// 								Professional Information
// 							</TabsTrigger>
// 						</TabsList>

// 						<Form {...form}>
// 							<form
// 								onSubmit={form.handleSubmit(onSubmit)}
// 								className="space-y-6"
// 							>
// 								<TabsContent value="basic" className="space-y-6">
// 									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// 										<FormField
// 											control={form.control}
// 											name="name"
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>Full Name*</FormLabel>
// 													<FormControl>
// 														<Input
// 															placeholder="John Doe"
// 															{...field}
// 															className="h-10"
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>

// 										<FormField
// 											control={form.control}
// 											name="email"
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>Email*</FormLabel>
// 													<FormControl>
// 														<Input
// 															type="email"
// 															placeholder="john.doe@example.com"
// 															{...field}
// 															className="h-10"
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>

// 										<FormField
// 											control={form.control}
// 											name="password"
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>Password*</FormLabel>
// 													<FormControl>
// 														<Input
// 															type="password"
// 															placeholder="••••••••"
// 															{...field}
// 															className="h-10"
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>

// 										<FormField
// 											control={form.control}
// 											name="phone"
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>Phone Number</FormLabel>
// 													<FormControl>
// 														<Input
// 															type="tel"
// 															placeholder="+1 (555) 123-4567"
// 															{...field}
// 															className="h-10"
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>

// 										<div className="md:col-span-2">
// 											<FormField
// 												control={form.control}
// 												name="address"
// 												render={({ field }) => (
// 													<FormItem>
// 														<FormLabel>Address</FormLabel>
// 														<FormControl>
// 															<Input
// 																placeholder="123 Main St, City, State, ZIP"
// 																{...field}
// 																className="h-10"
// 															/>
// 														</FormControl>
// 														<FormMessage />
// 													</FormItem>
// 												)}
// 											/>
// 										</div>

// 										{/* Image Upload Section */}
// 										<div className="md:col-span-2">
// 											<FormField
// 												control={form.control}
// 												name="image"
// 												render={({ field }) => (
// 													<FormItem>
// 														<FormLabel>Profile Picture</FormLabel>
// 														<FormControl>
// 															<div className="space-y-4">
// 																<div className="flex items-center gap-4">
// 																	<div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
// 																		{imagePreview ? (
// 																			<>
// 																				<img
// 																					src={imagePreview}
// 																					alt="Preview"
// 																					className="w-full h-full object-cover"
// 																				/>
// 																				<button
// 																					type="button"
// 																					onClick={removeImage}
// 																					className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
// 																				>
// 																					<X className="h-4 w-4" />
// 																				</button>
// 																			</>
// 																		) : (
// 																			<User className="h-16 w-16 text-gray-400" />
// 																		)}
// 																	</div>
// 																	<div className="flex-1">
// 																		<Input
// 																			type="file"
// 																			accept="image/*"
// 																			onChange={handleImageChange}
// 																			className="hidden"
// 																			id="image-upload"
// 																		/>
// 																		<div className="space-y-2">
// 																			<Button
// 																				type="button"
// 																				variant="outline"
// 																				onClick={() =>
// 																					document
// 																						.getElementById("image-upload")
// 																						?.click()
// 																				}
// 																				className="w-full"
// 																			>
// 																				<Upload className="mr-2 h-4 w-4" />
// 																				Upload Image
// 																			</Button>
// 																			<p className="text-sm text-gray-500">
// 																				{field.value || "No file chosen"}
// 																			</p>
// 																			<p className="text-xs text-gray-400">
// 																				JPG, PNG or GIF • Max 5MB
// 																			</p>
// 																		</div>
// 																	</div>
// 																</div>
// 															</div>
// 														</FormControl>
// 														<FormMessage />
// 													</FormItem>
// 												)}
// 											/>
// 										</div>
// 									</div>
// 								</TabsContent>

// 								<TabsContent value="professional" className="space-y-6">
// 									<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
// 										<FormField
// 											control={form.control}
// 											name="qualifications"
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>Qualifications</FormLabel>
// 													<FormControl>
// 														<Textarea
// 															placeholder="e.g., M.Sc in Mathematics, B.Ed"
// 															{...field}
// 															className="min-h-[80px]"
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>

// 										<FormField
// 											control={form.control}
// 											name="experienceYears"
// 											render={({ field }) => (
// 												<FormItem>
// 													<FormLabel>Years of Experience</FormLabel>
// 													<FormControl>
// 														<Input
// 															type="number"
// 															min="0"
// 															max="50"
// 															{...field}
// 															onChange={(e) =>
// 																field.onChange(parseInt(e.target.value) || 0)
// 															}
// 															className="h-10"
// 														/>
// 													</FormControl>
// 													<FormMessage />
// 												</FormItem>
// 											)}
// 										/>

// 										<div className="md:col-span-2">
// 											<FormField
// 												control={form.control}
// 												name="certifications"
// 												render={({ field }) => (
// 													<FormItem>
// 														<FormLabel>Certifications</FormLabel>
// 														<CertificationsField field={field} />
// 														<FormMessage />
// 													</FormItem>
// 												)}
// 											/>
// 										</div>

// 										<div className="md:col-span-2">
// 											<FormField
// 												control={form.control}
// 												name="subjects"
// 												render={({ field }) => (
// 													<FormItem>
// 														<FormLabel>Subjects</FormLabel>
// 														<SubjectsField field={field} />
// 														<FormMessage />
// 													</FormItem>
// 												)}
// 											/>
// 										</div>

// 										<div className="md:col-span-2">
// 											<FormField
// 												control={form.control}
// 												name="bio"
// 												render={({ field }) => (
// 													<FormItem>
// 														<FormLabel>Bio</FormLabel>
// 														<FormControl>
// 															<Textarea
// 																placeholder="Tell us about the instructor's teaching philosophy and experience..."
// 																{...field}
// 																className="min-h-[120px]"
// 															/>
// 														</FormControl>
// 														<FormDescription>
// 															{field.value?.length || 0}/500 characters
// 														</FormDescription>
// 														<FormMessage />
// 													</FormItem>
// 												)}
// 											/>
// 										</div>
// 									</div>
// 								</TabsContent>

// 								<div className="flex justify-between pt-6 border-t">
// 									{activeTab === "professional" && (
// 										<Button
// 											type="button"
// 											variant="outline"
// 											onClick={() => setActiveTab("basic")}
// 										>
// 											Back to Basic Info
// 										</Button>
// 									)}
// 									<div className="ml-auto flex space-x-4">
// 										{activeTab === "basic" ? (
// 											<Button
// 												type="button"
// 												onClick={async () => {
// 													const isValid = await form.trigger([
// 														"name",
// 														"email",
// 														"password",
// 													]);
// 													if (isValid) {
// 														setActiveTab("professional");
// 													}
// 												}}
// 											>
// 												Next: Professional Info
// 											</Button>
// 										) : (
// 											<div className="flex gap-4">
// 												<Button
// 													type="button"
// 													variant="outline"
// 													onClick={() => setActiveTab("basic")}
// 												>
// 													Back
// 												</Button>
// 												<Button
// 													type="submit"
// 													disabled={uploading || form.formState.isSubmitting}
// 												>
// 													{uploading ? (
// 														<>
// 															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
// 															Uploading...
// 														</>
// 													) : form.formState.isSubmitting ? (
// 														<>
// 															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
// 															Adding...
// 														</>
// 													) : (
// 														"Add Instructor"
// 													)}
// 												</Button>
// 											</div>
// 										)}
// 									</div>
// 								</div>
// 							</form>
// 						</Form>
// 					</Tabs>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }

// // Separate component for Certifications field
// function CertificationsField({ field }: any) {
// 	const [input, setInput] = useState("");

// 	const addCertification = () => {
// 		if (input.trim()) {
// 			const current = field.value || [];
// 			const updated = [...current, input.trim()];
// 			field.onChange(updated);
// 			setInput("");
// 		}
// 	};

// 	const removeCertification = (index: number) => {
// 		const updated = field.value.filter((_: any, i: number) => i !== index);
// 		field.onChange(updated);
// 	};

// 	return (
// 		<div className="space-y-2">
// 			<div className="flex gap-2">
// 				<Input
// 					type="text"
// 					value={input}
// 					onChange={(e) => setInput(e.target.value)}
// 					placeholder="Add a certification"
// 					onKeyPress={(e) =>
// 						e.key === "Enter" && (e.preventDefault(), addCertification())
// 					}
// 					className="h-10"
// 				/>
// 				<Button
// 					type="button"
// 					variant="outline"
// 					onClick={addCertification}
// 					className="h-10"
// 				>
// 					Add
// 				</Button>
// 			</div>
// 			<div className="flex flex-wrap gap-2 mt-2">
// 				{field.value?.map((cert: string, index: number) => (
// 					<Badge key={index} variant="secondary" className="px-3 py-1">
// 						{cert}
// 						<button
// 							type="button"
// 							onClick={() => removeCertification(index)}
// 							className="ml-2 text-gray-500 hover:text-gray-700"
// 						>
// 							<X className="h-3 w-3" />
// 						</button>
// 					</Badge>
// 				))}
// 			</div>
// 		</div>
// 	);
// }

// // Separate component for Subjects field
// function SubjectsField({ field }: any) {
// 	const [input, setInput] = useState("");

// 	const addSubject = () => {
// 		if (input.trim()) {
// 			const current = field.value || [];
// 			const updated = [...current, input.trim()];
// 			field.onChange(updated);
// 			setInput("");
// 		}
// 	};

// 	const removeSubject = (index: number) => {
// 		const updated = field.value.filter((_: any, i: number) => i !== index);
// 		field.onChange(updated);
// 	};

// 	return (
// 		<div className="space-y-2">
// 			<div className="flex gap-2">
// 				<Input
// 					type="text"
// 					value={input}
// 					onChange={(e) => setInput(e.target.value)}
// 					placeholder="Add a subject"
// 					onKeyPress={(e) =>
// 						e.key === "Enter" && (e.preventDefault(), addSubject())
// 					}
// 					className="h-10"
// 				/>
// 				<Button
// 					type="button"
// 					variant="outline"
// 					onClick={addSubject}
// 					className="h-10"
// 				>
// 					Add
// 				</Button>
// 			</div>
// 			<div className="flex flex-wrap gap-2 mt-2">
// 				{field.value?.map((subject: string, index: number) => (
// 					<Badge key={index} variant="outline" className="px-3 py-1">
// 						{subject}
// 						<button
// 							type="button"
// 							onClick={() => removeSubject(index)}
// 							className="ml-2 text-gray-500 hover:text-gray-700"
// 						>
// 							<X className="h-3 w-3" />
// 						</button>
// 					</Badge>
// 				))}
// 			</div>
// 		</div>
// 	);
// }
