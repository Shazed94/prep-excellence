import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBlogs } from "@/hooks/content-management";
import { useDebounce } from "@/hooks/useDebounce";

// Search schema
const searchSchema = z.object({
  query: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

interface BlogSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setPagination: (pagination: any) => void;
}

export function BlogSearch({
  searchTerm,
  setSearchTerm,
  setPagination,
}: BlogSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  // Watch form field
  const queryValue = form.watch("query");

  // Sync form with external searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      form.reset({ query: "" });
      return;
    }

    try {
      const parsed = JSON.parse(searchTerm);
      form.reset({ query: parsed.query ?? "" });
    } catch {
      form.reset({ query: searchTerm });
    }
  }, [searchTerm, form]);

  // Debounced search
  const debouncedQuery = useDebounce(queryValue, 300);

  // Fetch search results
  const { data: searchResults, isLoading: searchLoading } = useBlogs({
    page: 1,
    limit: 5,
    status: "PUBLISHED",
    search: debouncedQuery || undefined,
  });

  // Update search term when debounced value changes
  useEffect(() => {
    if (debouncedQuery) {
      const serialized = JSON.stringify({ query: debouncedQuery });
      setSearchTerm(serialized);
      setPagination({ pageIndex: 0, pageSize: 10 });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery, setSearchTerm, setPagination]);

  const handleReset = () => {
    form.reset({ query: "" });
    setSearchTerm("");
    setPagination({ pageIndex: 0, pageSize: 10 });
    setIsOpen(false);
  };

  const handleBlogClick = () => {
    setIsOpen(false);
  };

  const hasActiveFilters = !!queryValue;
  const searchData = searchResults?.data || [];

  return (
    <div className="flex items-center">
      <Form {...form}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center gap-3">
                <Popover open={isOpen && !!queryValue} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search blogs..."
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value) {
                              setIsOpen(true);
                            } else {
                              setIsOpen(false);
                            }
                          }}
                          onFocus={() => {
                            if (field.value) {
                              setIsOpen(true);
                            }
                          }}
                          className="w-[330px]  ps-9 py-2 placeholder:text-[14px] placeholder:text-[#7B7B7B] font-light border border-[#EBEBEB] rounded-[6px] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => field.onBlur()}
                          className="absolute left-2 top-1/2 -translate-y-1/2  text-white rounded-full  transition-colors"
                        >
                          <Search className="size-5 text-[#7B7B7B]" />
                        </button>
                      </div>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[400px] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-6 w-6 animate-spin text-primary-dark" />
                        </div>
                      ) : searchData.length === 0 ? (
                        <div className="py-6 text-center text-sm text-gray-500">
                          No blogs found
                        </div>
                      ) : (
                        <div className="divide-y">
                          {searchData.map((blog) => (
                            <Link
                              key={blog.id}
                              to="/blog/$blogId"
                              params={{ blogId: blog.slug }}
                              onClick={handleBlogClick}
                              className="flex gap-3 p-3 hover:bg-gray-50 transition-colors"
                            >
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold line-clamp-2 mb-1">
                                  {blog.title}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  {blog.publishedAt
                                    ? format(
                                        new Date(blog.publishedAt),
                                        "MMM dd, yyyy",
                                      )
                                    : format(
                                        new Date(blog.createdAt),
                                        "MMM dd, yyyy",
                                      )}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Reset Button */}
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="shrink-0"
                    title="Clear filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}
