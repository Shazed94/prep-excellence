import { zodResolver } from "@hookform/resolvers/zod";
import type { TCBlogCategorySchema } from "@prepexcellence/shared-validators";
import { ZCBlogCategorySchema } from "@prepexcellence/shared-validators";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type BlogCategory,
	useBlogCategories,
	useCreateBlogCategory,
	useDeleteBlogCategory,
	useUpdateBlogCategory,
} from "@/hooks/content-management";

export const Route = createFileRoute(
	"/dashboard/content-management/blog-categories",
)({
	component: BlogCategoriesPage,
});

function BlogCategoriesPage() {
	const [page] = useState(1);
	const [limit] = useState(10);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
		null,
	);

	const { data: categoriesData, isLoading } = useBlogCategories({
		page,
		limit,
	});

	const handleCreateSuccess = () => {
		setIsCreateDialogOpen(false);
	};

	const handleEditSuccess = () => {
		setEditingCategory(null);
	};

	return (
		<div className=" py-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Blog Categories</h1>
					<p className="text-muted-foreground">
						Manage your blog categories and organize content
					</p>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Category
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Blog Category</DialogTitle>
							<DialogDescription>
								Add a new category to organize your blog posts
							</DialogDescription>
						</DialogHeader>
						<CategoryForm onSuccess={handleCreateSuccess} />
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Categories</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex justify-center py-8">
							<Loader2 className="h-8 w-8 animate-spin" />
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Slug</TableHead>
									<TableHead>Blogs Count</TableHead>
									<TableHead>Created At</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{categoriesData?.data?.map((category: BlogCategory) => (
									<TableRow key={category.id}>
										<TableCell className="font-medium">
											{category.name}
										</TableCell>
										<TableCell>{category.slug}</TableCell>
										<TableCell>{category._count?.blogs || 0}</TableCell>
										<TableCell>
											{new Date(category.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Dialog
													open={editingCategory?.id === category.id}
													onOpenChange={(open) => {
														if (!open) setEditingCategory(null);
													}}
												>
													<DialogTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setEditingCategory(category)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Edit Blog Category</DialogTitle>
															<DialogDescription>
																Update the category details
															</DialogDescription>
														</DialogHeader>
														<CategoryForm
															initialData={category}
															onSuccess={handleEditSuccess}
														/>
													</DialogContent>
												</Dialog>
												<DeleteCategoryButton categoryId={category.id} />
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

interface CategoryFormProps {
	initialData?: BlogCategory;
	onSuccess?: () => void;
}

function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
	const createMutation = useCreateBlogCategory();
	const updateMutation = useUpdateBlogCategory();

	const form = useForm<TCBlogCategorySchema>({
		resolver: zodResolver(ZCBlogCategorySchema as any),
		defaultValues: {
			name: initialData?.name || "",
		},
	});

	const onSubmit = async (data: TCBlogCategorySchema) => {
		try {
			if (initialData) {
				await updateMutation.mutateAsync({
					id: initialData.id,
					data,
				});
			} else {
				await createMutation.mutateAsync(data);
			}
			form.reset();
			onSuccess?.();
		} catch (error: any) {
			toast.error(error?.message || "Something went wrong!");
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter category name"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end gap-2">
					<Button type="submit" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{initialData ? "Update" : "Create"}
					</Button>
				</div>
			</form>
		</Form>
	);
}

function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const deleteMutation = useDeleteBlogCategory();

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync(categoryId);

			setIsOpen(false);
		} catch (error: any) {
			console.log(error);
			// toast.error(error?.message || "Failed to delete category");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Trash2 className="h-4 w-4 text-red-500" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Category</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this category? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setIsOpen(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
