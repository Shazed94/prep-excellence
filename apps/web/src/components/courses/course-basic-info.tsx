import { Link } from "@tanstack/react-router";
import { ChevronLeft, Image } from "lucide-react";
import { useState } from "react";
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
import { Label } from "../ui/label";

interface CourseBasicInfoProps {
	onNext: (data: { title: string; thumbnail: File | null }) => void;
	isLoading?: boolean;
}

export function CourseBasicInfo({ onNext, isLoading }: CourseBasicInfoProps) {
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const form = useForm<{ title: string; thumbnail: FileList | null }>({
		defaultValues: { title: "", thumbnail: null },
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
		<div className="w-full bg-slate-50 py-8 px-4 md:px-8 lg:px-10 min-h-screen">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-slate-900">
						Create New Course
					</h1>
					<p className="text-slate-600">
						Step 1: Add course title and thumbnail
					</p>
				</div>
				<Link
					to={"/dashboard/" as "/"}
					className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
				>
					<ChevronLeft className="w-4 h-4 mr-2" />
					Back
				</Link>
			</div>

			<div className="w-full max-w-5xl mx-auto rounded-xl border border-slate-200 bg-white shadow-sm p-6 md:p-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-900">
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
								rules={{ required: "Thumbnail is required" }}
								render={() => (
									<FormItem>
										<FormLabel>Thumbnail *</FormLabel>
										<FormControl>
											<div className="space-y-3">
												<div className="flex items-center justify-center w-full">
													<Label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
														<div className="flex flex-col items-center justify-center pt-5 pb-6">
															<Image className="w-8 h-8 text-slate-400 mb-2" />
															<p className="text-sm text-slate-500">
																<span className="font-semibold">
																	Click to upload
																</span>{" "}
																or drag and drop
															</p>
															<p className="text-xs text-slate-400">
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
													<div className="relative w-full h-40 rounded-lg overflow-hidden border border-slate-200">
														<img
															src={previewUrl}
															alt="Preview"
															className="w-full h-full object-cover"
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
