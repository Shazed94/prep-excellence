"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TUpdateStudent,
	ZUStudent,
} from "@prepexcellence/shared-validators";
import { Check, Upload, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
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
import { TabsContent } from "@/components/ui/tabs";
import { useUpdateSystemUser } from "@/hooks/user-management";

export function StudentUpdateForm({ user }: any) {
	const updateUser = useUpdateSystemUser();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [imagePreview, setImagePreview] = useState<string | null>(
		user?.user?.image || null,
	);

	const form = useForm<TUpdateStudent>({
		resolver: zodResolver(ZUStudent),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			phone: user?.phone || "",
			address: user?.address || "",
			image: user?.image || "",
		},
	});

	const { control, handleSubmit, formState } = form;
	const { isSubmitting } = formState;

	/* ---------------- IMAGE HANDLERS ---------------- */
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		form.setValue("image", file);
		setImagePreview(URL.createObjectURL(file));
	};

	const removeImage = () => {
		form.setValue("image", null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	/* ---------------- SUBMIT ---------------- */
	const onSubmit = (data: TUpdateStudent) => {
		updateUser.mutate({
			id: user.id,
			data,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* BASIC INFORMATION */}
				<TabsContent value="basic" className="space-y-6">
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

				{/* ACADEMIC */}
				<TabsContent value="academic" className="space-y-6">
					<div className="grid md:grid-cols-4 gap-6">
						<FormField
							control={control}
							name="grade"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Grade</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="class"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Class</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name="section"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Section</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</TabsContent>

				{/* ACTIONS */}
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
