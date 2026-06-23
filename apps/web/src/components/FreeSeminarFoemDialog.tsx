import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCFreeSeminarFormInput,
	ZCFreeSeminarForm,
} from "@prepexcellence/shared-validators";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "./jodit-editor";

interface FreeSeminarFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (formData: FormData) => Promise<void>;
	isLoading?: boolean;
	initialData?: Partial<TCFreeSeminarFormInput> & { id?: string };
	isEditMode?: boolean;
}

export function FreeSeminarFormDialog({
	open,
	onOpenChange,
	onSubmit,
	isLoading = false,
	initialData,
	isEditMode = false,
}: FreeSeminarFormDialogProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const form = useForm<TCFreeSeminarFormInput>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(ZCFreeSeminarForm.omit({ image: true })) as any,
		defaultValues: {
			title: "",
			description: "",
			startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
			endDate: undefined,
			startTime: "",
			endTime: "",
			capacity: 50,
			isActive: true,
		},
	});

	// Populate form when dialog opens with initialData
	useEffect(() => {
		if (open && initialData) {
			form.reset({
				title: initialData.title || "",
				description: initialData.description || "",
				startDate: initialData.startDate
					? new Date(initialData.startDate)
					: new Date(Date.now() + 24 * 60 * 60 * 1000),
				endDate: initialData.endDate
					? new Date(initialData.endDate)
					: undefined,
				startTime: initialData.startTime || "",
				endTime: initialData.endTime || "",
				capacity: initialData.capacity || 50,
				isActive: initialData.isActive ?? true,
			});

			if (initialData.image) {
				setPreviewUrl(initialData.image);
			} else {
				setPreviewUrl(null);
			}
			setImageFile(null);
		} else if (open && !initialData) {
			// Reset to defaults when opening for new seminar
			form.reset({
				title: "",
				description: "",
				startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
				endDate: undefined,
				startTime: "",
				endTime: "",
				capacity: 50,
				isActive: true,
			});
			setPreviewUrl(null);
			setImageFile(null);
		}
	}, [open, initialData, form]);

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			form.reset();
			setPreviewUrl(null);
			setImageFile(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	}, [open, form]);

	// Handle form submission
	const handleSubmit = async (data: TCFreeSeminarFormInput) => {
		try {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("description", data.description);
			formData.append("startDate", data.startDate.toISOString());
			if (data.endDate) {
				formData.append("endDate", new Date(data.endDate).toISOString());
			}

			// Combine startDate + startTime for startTime field
			const combinedStartTime = new Date(data.startDate);
			const [startHours, startMinutes] = data.startTime.split(":");
			combinedStartTime.setHours(
				Number.parseInt(startHours, 10),
				Number.parseInt(startMinutes, 10),
				0,
				0,
			);
			formData.append("startTime", combinedStartTime.toISOString());

			// Combine endDate + endTime for endTime field (if provided)
			if (data.endDate && data.endTime) {
				const combinedEndTime = new Date(data.endDate);
				const [endHours, endMinutes] = data.endTime.split(":");
				combinedEndTime.setHours(
					Number.parseInt(endHours, 10),
					Number.parseInt(endMinutes, 10),
					0,
					0,
				);
				formData.append("endTime", combinedEndTime.toISOString());
			}

			formData.append("capacity", String(data.capacity));
			formData.append("isActive", String(data.isActive));

			// Handle image: new file takes priority, otherwise keep existing URL
			if (imageFile) {
				formData.append("image", imageFile);
			} else if (initialData?.image && !imageFile) {
				formData.append("image", initialData.image);
			}

			await onSubmit(formData);

			form.reset();
			setPreviewUrl(null);
			setImageFile(null);
			onOpenChange(false);
		} catch (error) {
			// Error handling is done in the parent component
			console.error("Form submission error:", error);
		}
	};

	// Handle file input change
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Validate file
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image must be less than 5MB");
				return;
			}
			if (!file.type.startsWith("image/")) {
				toast.error("Please select a valid image file");
				return;
			}

			setImageFile(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	// Format date to input format (yyyy-MM-dd)
	const formatDateForInput = (date?: Date) => {
		if (!date) return "";
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[75vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						{isEditMode ? "Edit Seminar" : "Create New Seminar"}
					</DialogTitle>
					<DialogDescription>
						{isEditMode
							? "Update the seminar details below"
							: "Fill in the details to create a new free seminar"}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						{/* Image Upload (handled separately, not in form schema) */}
						<div className="space-y-2">
							<label
								htmlFor="image"
								className="text-sm font-medium text-gray-700"
							>
								Seminar Image
							</label>
							<div className="space-y-3">
								{/* Preview */}
								{previewUrl && (
									<div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
										<img
											src={previewUrl}
											alt="Preview"
											className="w-full h-full object-cover"
										/>
										<button
											type="button"
											onClick={() => {
												setPreviewUrl(null);
												setImageFile(null);
												if (fileInputRef.current) {
													fileInputRef.current.value = "";
												}
											}}
											className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								)}

								{/* File Input */}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
								/>

								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
								>
									<Upload className="w-4 h-4" />
									{previewUrl ? "Change Image" : "Upload Image"}
								</button>
							</div>
							<p className="text-xs text-gray-500">
								Max 5MB. Supported formats: JPG, PNG, GIF, WebP
							</p>
						</div>

						{/* Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Seminar Title</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g., College Preparation Workshop"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<RichTextEditor
											value={field.value || ""}
											onChange={field.onChange}
											minHeight={200}
										/>
									</FormControl>
									<FormDescription>
										Minimum 10 characters, maximum 5000 characters
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Date Row */}
						<div className="grid grid-cols-2 gap-4">
							{/* Start Date */}
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Date</FormLabel>
										<FormControl>
											<Input
												type="date"
												value={formatDateForInput(field.value)}
												onChange={(e) =>
													field.onChange(new Date(e.target.value))
												}
												disabled={isLoading}
												min={formatDateForInput(new Date())}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* End Date */}
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>End Date </FormLabel>
										<FormControl>
											<Input
												type="date"
												value={
													field.value
														? formatDateForInput(new Date(field.value))
														: ""
												}
												onChange={(e) =>
													field.onChange(
														e.target.value
															? new Date(e.target.value)
															: undefined,
													)
												}
												disabled={isLoading}
												min={formatDateForInput(form.getValues("startDate"))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Time Row */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Time</FormLabel>
										<FormControl>
											<Input type="time" {...field} disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											End Time <span className="text-gray-400">(optional)</span>
										</FormLabel>
										<FormControl>
											<Input type="time" {...field} disabled={isLoading} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Capacity */}
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="capacity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Capacity</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="50"
												{...field}
												disabled={isLoading}
												onChange={(e) =>
													field.onChange(Number.parseInt(e.target.value, 10))
												}
												min="1"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Active Status */}
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">Active Status</FormLabel>
										<FormDescription>
											Enable or disable this seminar
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isLoading}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* Submit and Cancel */}
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? "Saving..."
									: isEditMode
										? "Update Seminar"
										: "Create Seminar"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
