import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import RichTextEditor from "@/components/jodit-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
	useBlog,
	useBlogCategories,
	useCreateBlog,
	useUpdateBlog,
} from "@/hooks/content-management";

export const Route = createFileRoute(
	"/dashboard/content-management/create-blog",
)({
	component: CreateBlogPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			editId: (search.editId as string) || undefined,
		};
	},
});

interface BlogFormData {
	title: string;
	categoryId: string;
	description: string;
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
	tags: string[];
	image?: File;
}

function CreateBlogPage() {
	const { editId } = useSearch({
		from: "/dashboard/content-management/create-blog",
	});
	const { data: blogData, isLoading: blogLoading } = useBlog(
		editId || "",
		!!editId,
	);
	const navigate = useNavigate();

	const handleSuccess = () => {
		navigate({ to: "/dashboard/content-management/blogs-list" });
	};

	if (blogLoading && editId) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">
					{editId ? "Edit Blog Post" : "Create Blog Post"}
				</h1>
				<p className="text-muted-foreground">
					{editId ? "Update your blog post" : "Create a new blog post"}
				</p>
			</div>
			<BlogForm
				initialData={blogData?.data}
				onSuccess={handleSuccess}
				mode={editId ? "edit" : "create"}
			/>
		</div>
	);
}

interface BlogFormProps {
	initialData?: any;
	onSuccess?: () => void;
	mode?: "create" | "edit";
}

function BlogForm({ initialData, onSuccess, mode = "create" }: BlogFormProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(
		initialData?.image || null,
	);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [tagsInput, setTagsInput] = useState("");

	const createMutation = useCreateBlog();
	const updateMutation = useUpdateBlog();
	const { data: categoriesData } = useBlogCategories({ page: 1, limit: 100 });

	const form = useForm<BlogFormData>({
		defaultValues: {
			title: "",
			categoryId: "",
			description: "",
			status: "DRAFT",
			tags: [],
		},
	});

	// Update form when initialData changes
	useEffect(() => {
		if (initialData) {
			form.reset({
				title: initialData.title || "",
				categoryId: initialData.categoryId || "",
				description: initialData.description || "",
				status: initialData.status || "DRAFT",
				tags: initialData.tags || [],
			});
			setImagePreview(initialData.image || null);
			setTagsInput((initialData.tags || []).join(", "));
		}
	}, [initialData, form]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setTagsInput(value);
		const tagsArray = value
			.split(",")
			.map((tag) => tag.trim())
			.filter((tag) => tag);
		form.setValue("tags", tagsArray);
	};

	const onSubmit = async (data: BlogFormData) => {
		try {
			const formData = new FormData();

			// Handle image
			if (selectedImage) {
				formData.append("image", selectedImage);
			} else if (mode === "create") {
				toast.error("Please select an image");
				return;
			}

			// Append other fields
			formData.append("title", data.title);
			formData.append("categoryId", data.categoryId);
			formData.append("description", data.description);
			formData.append("status", data.status || "DRAFT");

			if (data.tags && data.tags.length > 0) {
				formData.append("tags", JSON.stringify(data.tags));
			}

			if (mode === "edit" && initialData?.id) {
				await updateMutation.mutateAsync({
					id: initialData.id,
					data: formData as any,
				});
				toast.success("Blog updated successfully!");
			} else {
				await createMutation.mutateAsync(formData as any);
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
						</FormItem>

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

						{/* Category */}
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-slate-800 text-base">
										Category
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categoriesData?.data?.map((category: any) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormDescription className="text-slate-500">
										Select the category for your blog post
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
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select blog status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="DRAFT">Draft</SelectItem>
											<SelectItem value="PUBLISHED">Published</SelectItem>
											<SelectItem value="ARCHIVED">Archived</SelectItem>
										</SelectContent>
									</Select>
									<FormDescription className="text-slate-500">
										Set the publication status of your blog post
									</FormDescription>
									<FormMessage className="text-red-500 text-sm" />
								</FormItem>
							)}
						/>

						{/* Tags */}
						<FormItem>
							<FormLabel className="text-slate-800 text-base">Tags</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter tags separated by commas (e.g., SAT, College, Tips)"
									value={tagsInput}
									onChange={handleTagsChange}
									className="text-base"
								/>
							</FormControl>
							<FormDescription className="text-slate-500">
								Add tags to help categorize your blog post (comma-separated)
							</FormDescription>
						</FormItem>
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

				{/* Submit Button */}
				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => onSuccess?.()}
						disabled={isLoading}
					>
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
