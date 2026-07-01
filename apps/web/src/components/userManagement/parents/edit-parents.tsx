import { zodResolver } from "@hookform/resolvers/zod";
import type { TUpdateParent } from "@prepexcellence/shared-validators";
import { ZUParent } from "@prepexcellence/shared-validators";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Upload, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { useGetParentById, useUpdateParent } from "@/hooks/user-management";

interface EditParentFormProps {
	parentId: string;
}

export default function EditParentForm({ parentId }: EditParentFormProps) {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string>("");

	const { data: parentData, isLoading: isFetching } =
		useGetParentById(parentId);
	const { mutateAsync: updateParent, isPending } = useUpdateParent();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<TUpdateParent>({
		resolver: zodResolver(ZUParent) as any,
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

	// Populate form with existing parent data once fetched
	useEffect(() => {
		if (parentData) {
			// The API may return the parent directly or wrapped in a data property
			const parent = parentData.data || parentData;
			// User info may be nested under `user` (detail endpoint) or flat (list endpoint)
			const user = parent.user || parent;

			form.reset({
				name: user.name || "",
				email: user.email || "",
				password: "",
				phone: user.phone || "",
				address: user.address || "",
				image: user.image || "",
				isStaff: user.isStaff ?? false,
				isVerified: user.isVerified ?? true,
				contactNumber: parent.contactNumber || "",
				relation: parent.relation || undefined,
			});

			// Set existing image preview
			if (user.image) {
				setImagePreview(user.image);
			}
		}
	}, [parentData, form]);

	const onSubmit = async (data: TUpdateParent) => {
		try {
			// Build payload — omit password if left empty (keep existing)
			const payload = { ...data } as any;
			if (!payload.password) {
				delete payload.password;
			}

			if (imageFile) {
				const formData = new FormData();

				if (payload.name) formData.append("name", payload.name);
				if (payload.email) formData.append("email", payload.email);
				if (payload.password) formData.append("password", payload.password);
				if (payload.phone) formData.append("phone", payload.phone);
				if (payload.address) formData.append("address", payload.address);
				formData.append("isStaff", String(payload.isStaff ?? false));
				formData.append("isVerified", String(payload.isVerified ?? true));
				if (payload.contactNumber)
					formData.append("contactNumber", payload.contactNumber);
				if (payload.relation) formData.append("relation", payload.relation);

				// Append new image file
				formData.append("image", imageFile);

				await updateParent({ id: parentId, data: formData });
			} else {
				await updateParent({ id: parentId, data: payload });
			}

			toast.success("Parent updated successfully");
			navigate({ to: "/dashboard/user-management/parents" });
		} catch (error: any) {
			console.error("Error updating parent:", error);
			toast.error("Failed to update parent", {
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

	if (isFetching) {
		return (
			<div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
				<div className="flex flex-col items-center gap-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-muted-foreground">Loading parent data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Edit Parent/Guardian
					</h1>
					<p className="text-gray-600 mt-2">
						Update the parent or guardian's details
					</p>
				</div>
				<Button variant="outline" asChild>
					<Link to="/dashboard/user-management/parents">
						Back to Parent List
					</Link>
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Parent/Guardian Information</CardTitle>
					<CardDescription>
						Modify the fields below to update the parent or guardian's
						information
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
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Leave blank to keep current"
														{...field}
														disabled={isPending}
													/>
												</FormControl>
												<FormMessage />
												<p className="text-xs text-muted-foreground mt-1">
													Leave empty to keep the current password
												</p>
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
											Updating Parent...
										</>
									) : (
										"Update Parent/Guardian"
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
