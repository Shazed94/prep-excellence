// /components/BlogSearch
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
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
	pagination: { pageIndex: number; pageSize: number };
	setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export function BlogSearch({
	searchTerm,
	setSearchTerm,
	pagination,
	setPagination,
}: BlogSearchProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Skip the very first run of the debounce-sync effect below so we don't
	// clobber a searchTerm that was already restored from the store on mount.
	const hasMountedRef = useRef(false);

	const form = useForm<SearchFormData>({
		resolver: zodResolver(searchSchema),
		defaultValues: { query: "" },
	});

	// Watch form field
	const queryValue = form.watch("query");

	// Sync form with external searchTerm changes (e.g. reset button clicked elsewhere)
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

	// Fetch preview results for the popover
	const { data: searchResults, isLoading: searchLoading } = useBlogs({
		page: 1,
		limit: 5,
		status: "PUBLISHED",
		search: debouncedQuery || undefined,
	});

	// Keep a ref to the latest pagination so the sync effect below can read
	// it without needing "pagination" in its dependency array. If we added
	// "pagination" directly as a dep, the effect would re-fire (and reset
	// pageIndex back to 0) every time pagination changes for ANY reason —
	// e.g. the user clicking "next page" — which is not what we want. The
	// only thing that should trigger this effect is the debounced query.
	const paginationRef = useRef(pagination);
	useEffect(() => {
		paginationRef.current = pagination;
	}, [pagination]);

	// Push the debounced query up to the parent — including clearing it
	// when the user empties the input.
	useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}

		setSearchTerm(debouncedQuery || "");
		setPagination({ ...paginationRef.current, pageIndex: 0 });
		setIsOpen(!!debouncedQuery);
	}, [debouncedQuery, setSearchTerm, setPagination]);

	const handleReset = () => {
		form.reset({ query: "" });
		setSearchTerm("");
		setPagination({ ...pagination, pageIndex: 0 });
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
														setIsOpen(!!e.target.value);
													}}
													onFocus={() => {
														if (field.value) {
															setIsOpen(true);
														}
													}}
													className="w-[330px]  ps-9 py-2 placeholder:text-[14px] placeholder:text-[#7B7B7B] font-light border border-[#EBEBEB] rounded-[6px] focus:outline-none"
												/>
												<Search className="absolute left-2 top-1/2 -translate-y-1/2 size-5 text-[#7B7B7B] pointer-events-none" />
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
