import { zodResolver } from "@hookform/resolvers/zod";
import type { TCreateParent } from "@prepexcellence/shared-validators";
import { ZCParent } from "@prepexcellence/shared-validators";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Upload, User, X } from "lucide-react";
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
import { usePostParent } from "@/hooks/user-management";

export default function AddParentForm() {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");
	const [showPassword, setShowPassword] = useState(false);

	const { mutateAsync: postParent, isPending } = usePostParent();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<TCreateParent>({
		resolver: zodResolver(ZCParent) as any,
		defaultValues: {
			name: "",
			email: "",
			password: "",
			phone: "",
			address: "",
			image: "",
			isStaff: false,
			isVerified: true,
			contactNumber: "",
			relation: undefined,
		},
	});

	const onSubmit = async (data: TCreateParent) => {
		try {
			// Create FormData if image file exists
			if (imageFile) {
				const formData = new FormData();

				// Append all form fields to FormData
				formData.append("name", data.name);
				formData.append("email", data.email);
				formData.append("password", data.password);
				if (data.phone) formData.append("phone", data.phone);
				if (data.address) formData.append("address", data.address);
				formData.append("isStaff", String(data.isStaff ?? false));
				formData.append("isVerified", String(data.isVerified ?? true));
				if (data.contactNumber)
					formData.append("contactNumber", data.contactNumber);
				if (data.relation) formData.append("relation", data.relation);

				// Append image file
				formData.append("image", imageFile);

				await postParent(formData);
			} else {
				// Send as JSON if no image
				await postParent(data);
			}

			// Reset form
			form.reset();
			setImageFile(null);
			setImagePreview("");
		} catch (error: any) {
			console.error("Error adding parent:", error);
			toast.error("Failed to add parent", {
				description: error.response?.data?.message || error.message,
			});
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

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center ">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Add New Parent/Guardian
					</h1>
					<p className="text-gray-600 mt-2">
						Fill in the parent or guardian's details
					</p>
				</div>
				<Button>
					<Link to="/dashboard/user-management/parents">
						Back to parent List
					</Link>
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Parent/Guardian Information</CardTitle>
					<CardDescription>
						Complete all required fields to add a new parent or guardian
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Basic Information Section */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
									Basic Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
														disabled={isPending}
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
														disabled={isPending}
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
													<div className="relative">
														<Input
															type={showPassword ? "text" : "password"}
															placeholder="Enter password"
															{...field}
														/>
														<button
															type="button"
															onClick={() => setShowPassword((v) => !v)}
															className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
														>
															{showPassword ? (
																<EyeOff size={20} />
															) : (
																<Eye size={20} />
															)}
														</button>
													</div>
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
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="contactNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Contact Number</FormLabel>
												<FormControl>
													<Input
														type="tel"
														placeholder="01234567890"
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="relation"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Relation to Student</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}
													disabled={isPending}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select relation" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="FATHER">Father</SelectItem>
														<SelectItem value="MOTHER">Mother</SelectItem>
														<SelectItem value="GUARDIAN">Guardian</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="md:col-span-3">
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
															disabled={isPending}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
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
													<div className="relative flex items-center justify-center shrink-0 ">
														{imagePreview ? (
															<div className=" w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
																<img
																	src={imagePreview}
																	alt="Preview"
																	className="w-full h-full object-cover"
																/>
																<button
																	type="button"
																	onClick={removeImage}
																	disabled={isPending}
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
															disabled={isPending}
														/>
														<div className="space-y-2">
															<Button
																type="button"
																variant="outline"
																onClick={() => fileInputRef.current?.click()}
																className="w-full max-w-xs"
																disabled={isPending}
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

							<div className="flex justify-end pt-6 border-t">
								<Button type="submit" disabled={isPending} size="lg">
									{isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Adding Parent...
										</>
									) : (
										"Add Parent/Guardian"
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
