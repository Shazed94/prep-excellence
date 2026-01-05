"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ZUSystemUser } from "@prepexcellence/shared-validators";
import { Check, Upload, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateSystemUser } from "@/hooks/user-management";

// Custom schema that allows File objects for image field
const UpdateSystemUserFormSchema = ZUSystemUser.extend({
	image: z.union([z.string(), z.instanceof(File)]).optional(),
});

type UpdateSystemUserFormData = z.infer<typeof UpdateSystemUserFormSchema>;

export interface SystemUserProfile {
	id: string;
	createdAt: string;
	updatedAt: string;
	isActive: boolean;

	// System user specific info
	jobTitle:
		| "ADMIN"
		| "SUPPORT"
		| "MANAGER"
		| "ACCOUNTANT"
		| "DEVELOPER"
		| "INSTRUCTOR";
	department: "HR" | "SALES" | "IT" | "FINANCE" | "MARKETING" | "OPERATIONS";
	qualifications?: string[];
	experienceYears?: number;
	certifications?: string[];
	bio?: string;

	// User basic info
	userId: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	image?: string;
}

interface SystemUserUpdateFormProps {
	systemUser: SystemUserProfile;
	onSuccess?: () => void;
}

export function SystemUserUpdateForm({
	systemUser,
	onSuccess,
}: SystemUserUpdateFormProps) {
	const updateSystemUser = useUpdateSystemUser();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [imagePreview, setImagePreview] = useState<string | null>(
		systemUser?.image || null,
	);

	console.log("System user data in form:", systemUser);

	const form = useForm<UpdateSystemUserFormData>({
		resolver: zodResolver(UpdateSystemUserFormSchema) as any,
		defaultValues: {
			name: systemUser?.name || "",
			email: systemUser?.email || "",
			phone: systemUser?.phone || "",
			address: systemUser?.address || "",
			image: systemUser?.image || "",
			jobTitle: systemUser?.jobTitle || "SUPPORT",
			department: systemUser?.department || "OPERATIONS",
			qualifications: systemUser?.qualifications || [],
			experienceYears: systemUser?.experienceYears || 0,
			certifications: systemUser?.certifications || [],
			bio: systemUser?.bio || "",
		},
	});

	const { control, handleSubmit, formState, reset } = form;
	const { isSubmitting } = formState;

	// Reset form when systemUser data changes
	useEffect(() => {
		if (systemUser) {
			reset({
				name: systemUser?.name || "",
				email: systemUser?.email || "",
				phone: systemUser?.phone || "",
				address: systemUser?.address || "",
				image: systemUser?.image || "",
				jobTitle: systemUser?.jobTitle || "SUPPORT",
				department: systemUser?.department || "OPERATIONS",
				qualifications: systemUser?.qualifications || [],
				experienceYears: systemUser?.experienceYears || 0,
				certifications: systemUser?.certifications || [],
				bio: systemUser?.bio || "",
			});
			setImagePreview(systemUser?.image || null);
		}
	}, [systemUser, reset]);

	/* ---------------- IMAGE HANDLERS ---------------- */
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		form.setValue("image", file);
		setImagePreview(URL.createObjectURL(file));
	};

	const removeImage = () => {
		form.setValue("image", "");
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	/* ---------------- SUBMIT ---------------- */
	const onSubmit = async (data: any) => {
		try {
			// If image is a File object, send as FormData
			if (data.image instanceof File) {
				const formData = new FormData();
				formData.append("image", data.image);

				// Append other fields
				if (data.name) formData.append("name", data.name);
				if (data.email) formData.append("email", data.email);
				if (data.phone) formData.append("phone", data.phone);
				if (data.address) formData.append("address", data.address);
				if (data.jobTitle) formData.append("jobTitle", data.jobTitle);
				if (data.department) formData.append("department", data.department);
				if (data.experienceYears)
					formData.append("experienceYears", String(data.experienceYears));
				if (data.bio) formData.append("bio", data.bio);

				// Handle arrays
				if (data.qualifications && data.qualifications.length > 0) {
					formData.append(
						"qualifications",
						JSON.stringify(data.qualifications),
					);
				}
				if (data.certifications && data.certifications.length > 0) {
					formData.append(
						"certifications",
						JSON.stringify(data.certifications),
					);
				}

				await updateSystemUser.mutateAsync({
					id: systemUser.id,
					data: formData,
				});
			} else {
				// Remove image from data if it's empty string
				const submitData = { ...data };
				if (!submitData.image) {
					delete submitData.image;
				}

				// Send as regular JSON
				await updateSystemUser.mutateAsync({
					id: systemUser.id,
					data: submitData,
				});
			}
			onSuccess?.();
		} catch (error) {
			console.error("Failed to update system user:", error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* BASIC INFORMATION */}
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<FormField
							control={control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name*</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} disabled />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input {...field} disabled={isSubmitting} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="jobTitle"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Job Title*</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isSubmitting}
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
											<SelectItem value="ACCOUNTANT">Accountant</SelectItem>
											<SelectItem value="DEVELOPER">Developer</SelectItem>
											<SelectItem value="INSTRUCTOR">Instructor</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="department"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Department*</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isSubmitting}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select department" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="HR">HR</SelectItem>
											<SelectItem value="SALES">Sales</SelectItem>
											<SelectItem value="IT">IT</SelectItem>
											<SelectItem value="FINANCE">Finance</SelectItem>
											<SelectItem value="MARKETING">Marketing</SelectItem>
											<SelectItem value="OPERATIONS">Operations</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="experienceYears"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Experience (Years)</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											min="0"
											onChange={(e) =>
												field.onChange(Number(e.target.value) || 0)
											}
											disabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="md:col-span-2">
							<FormField
								control={control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input {...field} disabled={isSubmitting} />
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="md:col-span-4">
							<FormField
								control={control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bio</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Brief biography..."
												rows={3}
												disabled={isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Image Upload Section */}
						<div className="md:col-span-4">
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
																	disabled={isSubmitting}
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
															disabled={isSubmitting}
														/>
														<div className="space-y-2">
															<Button
																type="button"
																variant="outline"
																onClick={() => fileInputRef.current?.click()}
																className="w-full"
																disabled={isSubmitting}
															>
																<Upload className="mr-2 h-4 w-4" />
																Upload Image
															</Button>
															<p className="text-sm text-gray-500">
																{field.value instanceof File
																	? field.value.name
																	: typeof field.value === "string" &&
																			field.value
																		? "Current image"
																		: "No file chosen"}
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
				</div>

				<div className="flex gap-2">
					<Button type="submit" disabled={isSubmitting}>
						<Check className="mr-2 h-4 w-4" />
						Update User
					</Button>

					<Button type="button" variant="outline">
						<X className="mr-2 h-4 w-4" />
						Cancel
					</Button>
				</div>
			</form>
		</Form>
	);
}
