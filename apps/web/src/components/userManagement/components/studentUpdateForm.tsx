import { zodResolver } from "@hookform/resolvers/zod";
import { ZUStudent } from "@prepexcellence/shared-validators";
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
import { useUpdateStudent } from "@/hooks/user-management";
import type { StudentProfile } from "../students/StudentListPage";

// Custom schema that allows File objects for image field
const UpdateStudentFormSchema = ZUStudent.extend({
	image: z.union([z.string(), z.instanceof(File)]).optional(),
});

type UpdateStudentFormData = z.infer<typeof UpdateStudentFormSchema>;

interface StudentUpdateFormProps {
	student: StudentProfile;
	onSuccess?: () => void;
}

export function StudentUpdateForm({
	student,
	onSuccess,
}: StudentUpdateFormProps) {
	const updateStudent = useUpdateStudent();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [imagePreview, setImagePreview] = useState<string | null>(
		student?.image || null,
	);

	const form = useForm<UpdateStudentFormData>({
		resolver: zodResolver(UpdateStudentFormSchema) as any,
		defaultValues: {
			name: student?.name || "",
			email: student?.email || "",
			phone: student?.phone || "",
			address: student?.address || "",
			image: student?.image || "",
		},
	});

	const { control, handleSubmit, formState, reset } = form;
	const { isSubmitting } = formState;

	// Reset form when student data changes
	useEffect(() => {
		if (student) {
			reset({
				name: student?.name || "",
				email: student?.email || "",
				phone: student?.phone || "",
				address: student?.address || "",
				image: student?.image || "",
			});
			setImagePreview(student?.image || null);
		}
	}, [student, reset]);

	/* ---------------- IMAGE HANDLERS ---------------- */
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Store the file with validation now that schema supports it
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

				await updateStudent.mutateAsync({
					id: student.id,
					data: formData,
				});
			} else {
				// Remove image from data if it's empty string
				const submitData = { ...data };
				if (!submitData.image) {
					delete submitData.image;
				}

				// Send as regular JSON
				await updateStudent.mutateAsync({
					id: student.id,
					data: submitData,
				});
			}
			onSuccess?.();
		} catch (error) {
			console.error("Failed to update student:", error);
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
																	disabled={isSubmitting}
																	className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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

// Legacy export for backward compatibility
export { StudentUpdateForm as UserForm };
