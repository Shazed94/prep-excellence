import { zodResolver } from "@hookform/resolvers/zod";
import type { TCBlogSchema } from "@prepexcellence/shared-validators";
import { ZCBlogSchema } from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCreateBlog, useUpdateBlog } from "@/hooks/content-management";

export const Route = createFileRoute("/dashboard/content-management/blogs")({
	component: BlogForm,
});

interface BlogFormProps {
	initialData?: Partial<TCBlogSchema> & { id?: string };
	onSuccess?: () => void;
	mode?: "create" | "edit";
}

export function BlogForm({
	initialData,
	onSuccess,
	mode = "create",
}: BlogFormProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(
		typeof initialData?.image === "string" ? initialData.image : null,
	);

	const createMutation = useCreateBlog();
	const updateMutation = useUpdateBlog();

	const form = useForm<TCBlogSchema>({
		// Cast to any to avoid type mismatch with react-hook-form generics
		resolver: zodResolver(ZCBlogSchema) as any,
		defaultValues: {
			image: undefined,
			tags: initialData?.tags || [],
			title: initialData?.title || "",
			author: initialData?.author || "",
			description: initialData?.description || "",
			socialShare: {
				facebook: initialData?.socialShare?.facebook ?? true,
				instagram: initialData?.socialShare?.instagram ?? true,
				linkedin: initialData?.socialShare?.linkedin ?? true,
			},
			status: initialData?.status || "draft",
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("image", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const buildFormData = (data: TCBlogSchema): FormData => {
		const formData = new FormData();

		// Handle image - can be File or string URL
		if (data.image) {
			if (typeof data.image === "string") {
				formData.append("imageUrl", data.image);
			} else if (data.image instanceof File) {
				formData.append("image", data.image);
			}
		}

		// Append other fields
		formData.append("title", data.title);
		formData.append("author", data.author);
		formData.append("description", data.description);
		formData.append("status", data.status);

		// Serialize objects/arrays as JSON
		formData.append("socialShare", JSON.stringify(data.socialShare));

		if (data.slug) formData.append("slug", data.slug);
		if (data.tags && data.tags.length > 0) {
			formData.append("tags", JSON.stringify(data.tags));
		}
		if (data.publishedAt) formData.append("publishedAt", data.publishedAt);

		return formData;
	};

	const onSubmit = async (data: TCBlogSchema) => {
		try {
			const formData = buildFormData(data);

			if (mode === "edit" && initialData?.id) {
				await updateMutation.mutateAsync({
					id: initialData.id,
					data: formData,
				});
				toast.success("Blog updated successfully!");
			} else {
				await createMutation.mutateAsync(formData);
				toast.success("Blog created successfully!");
			}
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || "Something went wrong!");
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Image Upload */}
						<FormField
							control={form.control}
							name="image"
							render={({ field: { value, onChange, ...field } }) => (
								<FormItem>
									<FormLabel className="text-slate-800 text-base">
										Featured Image
									</FormLabel>
									<FormControl>
										<div className="space-y-4">
											{imagePreview && (
												<div className="relative w-full h-64 rounded-lg overflow-hidden border">
													<img
														src={imagePreview}
														alt="Preview"
														className="w-full h-full object-cover"
													/>
												</div>
											)}
											<div className="flex items-center gap-4">
												<Input
													type="file"
													accept="image/jpeg,image/jpg,image/png,image/webp"
													onChange={handleImageChange}
													{...field}
													className="cursor-pointer"
												/>
												<ImageIcon className="w-5 h-5 text-gray-400" />
											</div>
										</div>
									</FormControl>
									<FormDescription className="text-slate-500">
										Upload a featured image for your blog post. Max size: 5MB.
										Supported formats: JPG, PNG, WebP
									</FormDescription>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>

						{/* Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-800 text-base">
										Blog Title
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter blog title"
											{...field}
											className="text-base"
										/>
									</FormControl>
									<FormDescription className="text-slate-500">
										A catchy and descriptive title for your blog post
									</FormDescription>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>

						{/* Author */}
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-800 text-base">
										Author Name
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter author name"
											{...field}
											className="text-base"
										/>
									</FormControl>
									<FormDescription className="text-slate-500">
										The name of the blog post author
									</FormDescription>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>

						{/* Status */}
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-800 text-base">
										Status
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select blog status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="draft">Draft</SelectItem>
											<SelectItem value="published">Published</SelectItem>
											<SelectItem value="archived">Archived</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription className="text-slate-500">
										Set the publication status of your blog post
									</FormDescription>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Description */}
				<Card>
					<CardHeader>
						<CardTitle>Blog Content</CardTitle>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-800 text-base">
										Blog Description
									</FormLabel>
									<FormControl>
										<RichTextEditor
											value={field.value}
											onChange={field.onChange}
											height="400px"
											minHeight="200px"
										/>
									</FormControl>
									<FormDescription className="text-slate-500">
										Write your blog content using the rich text editor. You can
										format text, add links, images, and more.
									</FormDescription>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Social Share Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Social Share Settings</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="socialShare.facebook"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="text-base font-medium">
											Enable Facebook Sharing
										</FormLabel>
										<FormDescription>
											Allow readers to share this blog post on Facebook
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="socialShare.instagram"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="text-base font-medium">
											Enable Instagram Sharing
										</FormLabel>
										<FormDescription>
											Allow readers to share this blog post on Instagram
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="socialShare.linkedin"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel className="text-base font-medium">
											Enable LinkedIn Sharing
										</FormLabel>
										<FormDescription>
											Allow readers to share this blog post on LinkedIn
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Submit Button */}
				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" disabled={isLoading}>
						Cancel
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{mode === "edit" ? "Update Blog" : "Create Blog"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
