import { Image } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { WizardHeader } from "@/components/courses/wizard-header";
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
import { Label } from "../ui/label";

interface CourseBasicInfoProps {
	onNext: (data: { title: string; thumbnail: File | null }) => void;
	isLoading?: boolean;
	isEditMode?: boolean;
	initialTitle?: string;
	initialThumbnailPreview?: string;
}

export function CourseBasicInfo({
	onNext,
	isLoading,
	isEditMode,
	initialTitle,
	initialThumbnailPreview,
}: CourseBasicInfoProps) {
	const [previewUrl, setPreviewUrl] = useState<string>(
		initialThumbnailPreview || "",
	);
	const form = useForm<{ title: string; thumbnail: FileList | null }>({
		defaultValues: { title: initialTitle || "", thumbnail: null },
	});

	const handleSubmit = (data: {
		title: string;
		thumbnail: FileList | null;
	}) => {
		if (!data.title.trim()) {
			form.setError("title", { message: "Title is required" });
			return;
		}
		const thumbnailFile = data.thumbnail?.[0] || null;
		onNext({ title: data.title, thumbnail: thumbnailFile });
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
			form.setValue("thumbnail", e.target.files);
		}
	};

	return (
		<div className="space-y-6">
			<WizardHeader
				title={isEditMode ? "Edit Course" : "Create New Course"}
				subtitle="Start with the course title and a cover thumbnail."
				currentStep={1}
			/>

			<div className="mx-auto w-full max-w-3xl rounded-lg border border-border bg-white p-6 md:p-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<div className="space-y-4">
							<h2 className="font-switzer text-base font-semibold text-foreground">
								Basic Information
							</h2>

							<FormField
								control={form.control}
								name="title"
								rules={{ required: "Title is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Course Title *</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Full Stack Web Development"
												{...field}
												className="h-10"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="thumbnail"
								render={() => (
									<FormItem>
										<FormLabel>Thumbnail *</FormLabel>
										<FormControl>
											<div className="space-y-3">
												<div className="flex items-center justify-center w-full">
													<Label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border transition-colors hover:border-primary/40 hover:bg-primary-light/40">
														<div className="flex flex-col items-center justify-center pt-5 pb-6">
															<Image className="mb-2 h-8 w-8 text-primary/50" />
															<p className="text-sm text-muted">
																<span className="font-semibold text-foreground">
																	Click to upload
																</span>{" "}
																or drag and drop
															</p>
															<p className="text-xs text-muted/70">
																PNG, JPG, GIF up to 10MB
															</p>
														</div>
														<Input
															type="file"
															accept="image/*"
															className="hidden"
															onChange={handleFileChange}
														/>
													</Label>
												</div>
												{previewUrl && (
													<div className="relative h-40 w-full overflow-hidden rounded-lg border border-border">
														<img
															src={previewUrl}
															alt="Preview"
															className="h-full w-full object-cover"
														/>
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end pt-6 border-t">
							<Button
								type="submit"
								size="lg"
								className="px-8"
								disabled={isLoading}
							>
								{isLoading ? "Processing..." : "Next"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
