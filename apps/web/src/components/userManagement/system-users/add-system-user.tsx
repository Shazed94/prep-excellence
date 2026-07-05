import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCreateSystemUser,
	ZCSystemUser,
} from "@prepexcellence/shared-validators";
import { Link } from "@tanstack/react-router";
import { Loader2, Upload, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUploadImage } from "@/hooks/instructor";
import { usePostSystemUser } from "@/hooks/user-management";

export default function AddSystemUserForm() {
	const [activeTab, setActiveTab] = useState<"basic" | "professional">("basic");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState("");

	const fileInputRef = useRef<HTMLInputElement>(null);

	const { mutateAsync: createSystemUser, isPending } = usePostSystemUser();
	console.log("DATAAAAAA", createSystemUser);
	const { uploadImage, isUploading } = useUploadImage();

	const form = useForm<TCreateSystemUser>({
		resolver: zodResolver(ZCSystemUser) as any,
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			image: "",
			jobTitle: "ADMIN",
			department: "IT",
			qualifications: [] as string[],
			certifications: [] as string[],
			experienceYears: undefined,
			bio: "",
			isStaff: true,
			isVerified: false,
		},
	});

	/* ======================
      Submit Handler
  ====================== */
	const onSubmit = async (values: TCreateSystemUser) => {
		try {
			// Create a clean payload
			const payload: TCreateSystemUser = {
				...values,
				// Handle empty strings for optional fields
				phone: values.phone?.trim() || undefined,
				address: values.address?.trim() || undefined,
				bio: values.bio?.trim() || undefined,
				// Ensure arrays are never undefined
				qualifications: values.qualifications || [],
				certifications: values.certifications || [],
				// Handle experienceYears
				experienceYears:
					values.experienceYears !== undefined && values.experienceYears >= 0
						? values.experienceYears
						: undefined,
			};

			// Upload image if present
			if (imageFile) {
				try {
					const imageUrl = await uploadImage(imageFile);
					payload.image = imageUrl;
				} catch (error) {
					console.error("Error uploading image:", error);
					toast.error("Failed to upload image. Please try again.");
					return;
				}
			}

			// Create system user - API will be hit here
			await createSystemUser(payload);

			toast.success("System user added successfully");

			// Reset form and state
			form.reset();
			setImageFile(null);
			setImagePreview("");
			setActiveTab("basic");

			// Clear file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				"Failed to create system user";
			toast.error(errorMessage);
			console.error("Error creating system user:", error);
		}
	};

	/* ======================
      Image Handler
  ====================== */
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Only image files are allowed");
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be less than 5MB");
			return;
		}

		setImageFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onload = () => setImagePreview(reader.result as string);
		reader.onerror = () => toast.error("Failed to read image file");
		reader.readAsDataURL(file);

		// Clear input so same file can be selected again
		e.target.value = "";
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview("");
		form.setValue("image", "");

		// Clear file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const submitting = isPending || isUploading;

	/* =====================================================
      UI
  ===================================================== */
	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center ">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Add New System User{" "}
					</h1>
					<p className="text-gray-600 mt-2">Fill in the System User details</p>
				</div>
				<Button>
					<Link to="/dashboard/user-management/system-users">
						Back to System User List
					</Link>
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Add System User</CardTitle>
					<CardDescription>
						Fill in all required fields to create a new system user
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Tabs
						value={activeTab}
						onValueChange={(v) => setActiveTab(v as "basic" | "professional")}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="basic">Basic Info</TabsTrigger>
							<TabsTrigger value="professional">Professional Info</TabsTrigger>
						</TabsList>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6 mt-6"
							>
								{/* ================= BASIC INFO TAB ================= */}
								<TabsContent value="basic" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* NAME */}
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Full Name *</FormLabel>
													<FormControl>
														<Input
															{...field}
															disabled={submitting}
															placeholder="John Doe"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* EMAIL */}
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email *</FormLabel>
													<FormControl>
														<Input
															type="email"
															{...field}
															disabled={submitting}
															placeholder="john.doe@example.com"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* PASSWORD */}
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password *</FormLabel>
													<FormControl>
														<Input
															type="password"
															{...field}
															disabled={submitting}
															placeholder="Min 8 characters"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* PHONE */}
										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone Number</FormLabel>
													<FormControl>
														<Input
															type="tel"
															{...field}
															value={field.value || ""}
															disabled={submitting}
															placeholder="01712345678"
														/>
													</FormControl>
													<FormDescription>
														Optional, min 11 digits
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* ADDRESS */}
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Address</FormLabel>
													<FormControl>
														<Input
															{...field}
															value={field.value || ""}
															disabled={submitting}
															placeholder="123 Main Street"
														/>
													</FormControl>
													<FormDescription>Optional</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* JOB TITLE */}
										<FormField
											control={form.control}
											name="jobTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Job Title *</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
														disabled={submitting}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select job title" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="ADMIN">Admin</SelectItem>
															<SelectItem value="SUPPORT">Support</SelectItem>
															<SelectItem value="MANAGER">Manager</SelectItem>
															<SelectItem value="ACCOUNTANT">
																Accountant
															</SelectItem>
															<SelectItem value="DEVELOPER">
																Developer
															</SelectItem>
															<SelectItem value="INSTRUCTOR">
																Instructor
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* DEPARTMENT */}
										<FormField
											control={form.control}
											name="department"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Department *</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value}
														disabled={submitting}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select department" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="IT">IT</SelectItem>
															<SelectItem value="HR">HR</SelectItem>
															<SelectItem value="SALES">Sales</SelectItem>
															<SelectItem value="FINANCE">Finance</SelectItem>
															<SelectItem value="MARKETING">
																Marketing
															</SelectItem>
															<SelectItem value="OPERATIONS">
																Operations
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Profile Picture Section */}
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
											Profile Picture
										</h3>
										<FormField
											control={form.control}
											name="image"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="flex items-center gap-6">
															<div className="relative flex items-center justify-center shrink-0">
																{imagePreview ? (
																	<div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
																		<img
																			src={imagePreview}
																			alt="Preview"
																			className="w-full h-full object-cover"
																		/>
																		<button
																			type="button"
																			onClick={removeImage}
																			disabled={submitting}
																			className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
																		>
																			<X className="h-4 w-4" />
																		</button>
																	</div>
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
																		className="w-full max-w-xs"
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
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</TabsContent>

								{/* ================= PROFESSIONAL INFO TAB ================= */}
								<TabsContent value="professional" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* QUALIFICATIONS */}
										<FormField
											control={form.control}
											name="qualifications"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Qualifications</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Bachelor of Computer Science&#10;Master of Business Administration"
															value={field.value?.join("\n") || ""}
															onChange={(e) => {
																const lines = e.target.value
																	.split("\n")
																	.filter((line) => line.trim());
																field.onChange(lines);
															}}
															className="min-h-[120px]"
															disabled={submitting}
														/>
													</FormControl>
													<FormDescription>
														One qualification per line
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* CERTIFICATIONS */}
										<FormField
											control={form.control}
											name="certifications"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Certifications</FormLabel>
													<FormControl>
														<Textarea
															placeholder="AWS Certified Solutions Architect&#10;PMP Certification"
															value={field.value?.join("\n") || ""}
															onChange={(e) => {
																const lines = e.target.value
																	.split("\n")
																	.filter((line) => line.trim());
																field.onChange(lines);
															}}
															className="min-h-[120px]"
															disabled={submitting}
														/>
													</FormControl>
													<FormDescription>
														One certification per line
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* EXPERIENCE YEARS */}
										<FormField
											control={form.control}
											name="experienceYears"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Experience (Years)</FormLabel>
													<FormControl>
														<Input
															type="number"
															min="0"
															max="50"
															value={field.value ?? ""}
															onChange={(e) => {
																const value = e.target.value;
																field.onChange(
																	value === "" ? undefined : Number(value),
																);
															}}
															placeholder="e.g., 5"
															disabled={submitting}
														/>
													</FormControl>
													<FormDescription>Optional</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* BIO */}
										<FormField
											control={form.control}
											name="bio"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Bio</FormLabel>
													<FormControl>
														<Textarea
															{...field}
															value={field.value || ""}
															placeholder="Short professional description..."
															className="min-h-[120px]"
															disabled={submitting}
															maxLength={500}
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
								</TabsContent>

								{/* ================= FORM ACTIONS ================= */}
								<div className="flex justify-end gap-4 pt-6 border-t">
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											setActiveTab(
												activeTab === "basic" ? "professional" : "basic",
											)
										}
										disabled={submitting}
									>
										{activeTab === "basic"
											? "Next: Professional Info →"
											: "← Back: Basic Info"}
									</Button>
									<Button
										type="submit"
										disabled={submitting}
										className="min-w-[150px]"
									>
										{submitting && (
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										)}
										{submitting ? "Creating..." : "Add System User"}
									</Button>
								</div>
							</form>
						</Form>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
