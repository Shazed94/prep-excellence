import { zodResolver } from "@hookform/resolvers/zod";
import type { TCBlogSchema } from "@prepexcellence/shared-validators";
import { ZCBlogSchema } from "@prepexcellence/shared-validators";
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
  "/dashboard/content-management/create-blog"
)({
  component: CreateBlogPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      editId: (search.editId as string) || undefined,
    };
  },
});

function CreateBlogPage() {
  const { editId } = useSearch({
    from: "/dashboard/content-management/create-blog",
  });
  const navigate = useNavigate();

  // Fetch categories first to ensure they're available before blog data
  const { data: categoriesData, isLoading: categoriesLoading } =
    useBlogCategories({
      page: 1,
      limit: 100,
    });

  const { data: blogData, isLoading: blogLoading } = useBlog(
    editId || "",
    !!editId
  );

  const handleSuccess = () => {
    navigate({ to: "/dashboard/content-management/blogs-list" });
  };

  // Show loading only if we're waiting for critical data
  const isLoading = categoriesLoading || (blogLoading && !!editId);

  if (isLoading) {
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
        categories={categoriesData?.data || []}
        onSuccess={handleSuccess}
        mode={editId ? "edit" : "create"}
      />
    </div>
  );
}

interface BlogFormProps {
  initialData?: any;
  categories: any[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
}

function BlogForm({
  initialData,
  categories,
  onSuccess,
  mode = "create",
}: BlogFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const createMutation = useCreateBlog();

  const updateMutation = useUpdateBlog();

  type BlogFormData = Omit<TCBlogSchema, "tags"> & { tags: string[] };

  const form = useForm<BlogFormData>({
    resolver: zodResolver(ZCBlogSchema) as any,
    defaultValues: {
      title: "",
      image: "",
      categoryId: "",
      description: "",
      status: "DRAFT",
      tags: [],
    },
  });

  // Watch tags to display them reactively
  const tags = form.watch("tags");

  // Update form when initialData changes - ensure categories are loaded first
  useEffect(() => {
    if (initialData && categories.length > 0) {
      form.reset({
        title: initialData.title || "",
        categoryId: initialData.categoryId || "",
        description: initialData.description || "",
        status: initialData.status || "DRAFT",
        tags: initialData.tags || [],
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData, categories, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG, or WebP)");
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size should not exceed 5MB");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      if (mode === "edit" && initialData?.id) {
        // For edit mode, create update payload
        const updatePayload: any = {
          title: data.title,
          categoryId: data.categoryId,
          description: data.description,
          status: data.status || "DRAFT",
          tags: data.tags || [],
        };

        // Only add image if a new one is selected
        if (selectedImage) {
          updatePayload.image = selectedImage;
        }

        await updateMutation.mutateAsync({
          id: initialData.id,
          data: updatePayload,
        });
      } else {
        // For create mode, build FormData
        const formData = new FormData();

        // Image is required for create mode
        if (!selectedImage) {
          toast.error("Please select an image");
          return;
        }

        formData.append("image", selectedImage);
        formData.append("title", data.title);
        formData.append("categoryId", data.categoryId);
        formData.append("description", data.description);
        formData.append("status", data.status || "DRAFT");

        if (data.tags && data.tags.length > 0) {
          formData.append("tags[]", JSON.stringify(data.tags));
        }

        await createMutation.mutateAsync(formData as any);
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Submit error:", error);
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 text-base">
                    Featured Image{" "}
                    {mode === "create" && (
                      <span className="text-red-500">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative w-full max-w-md">
                          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-slate-200">
                            <img
                              src={imagePreview}
                              alt="Blog preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="mt-2"
                          >
                            Remove Image
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <Input
                          {...field}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          disabled={isLoading}
                          className="cursor-pointer"
                        />
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    {mode === "create"
                      ? "Upload a featured image for your blog post. Max size: 5MB. Supported formats: JPG, PNG, WebP"
                      : "Upload a new image to replace the existing one. Max size: 5MB. Supported formats: JPG, PNG, WebP"}
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
                      {categories?.map((category: any) => (
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
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-800 text-base">
                    Tags
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {/* Tag Display - Show above input */}
                      {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <div
                              key={`${tag}-${index}`}
                              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedTags = tags.filter(
                                    (_, i) => i !== index
                                  );
                                  field.onChange(updatedTags);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${tag}`}
                                title="Remove tag"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <title>Remove tag</title>
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tag Input */}
                      <Input
                        placeholder="Type a tag and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const inputValue = e.currentTarget.value.trim();
                            if (inputValue.length > 0) {
                              const currentTags = tags || [];
                              if (!currentTags.includes(inputValue)) {
                                field.onChange([...currentTags, inputValue]);
                                e.currentTarget.value = "";
                              } else {
                                toast.error("Tag already exists");
                              }
                            }
                          }
                        }}
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-slate-500">
                    Type a tag and press Enter to add. Tags help categorize your
                    blog post.
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
