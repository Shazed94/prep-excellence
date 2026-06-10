import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { BlogSearch } from "@/components/BlogSearch";
import { Breadcrumb } from "@/components/breadcrumb";
import FAQSectionTwo from "@/components/homepage/two/FAQSectionTwo";
import { Subtitle } from "@/components/SectionSubtitle";
import { FilterDropdown } from "@/components/sat-courses/sat_courses";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	type Blog,
	useBlogCategories,
	useBlogs,
	useBlogsFilter,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";

export const Route = createFileRoute("/_frontend/blog/")({
	component: RouteComponent,
});

export function BlogCard({ blog }: { blog: Blog }) {
	return (
		<Link
			to={`/blog/${blog.slug}` as "/"}
			className="bg-white p-4 rounded-lg shadow-md"
		>
			<img
				src={blog?.image}
				alt={blog.title}
				className="w-full h-[316px] rounded-[6px] mb-4"
			/>
			<h5 className="f14 text-[#6C7179]! mb-3">
				{blog.publishedAt
					? format(new Date(blog?.publishedAt), "MMMM d, yyyy")
					: format(new Date(blog?.createdAt), "MMMM d, yyyy")}
			</h5>
			<h4 className="h4 mb-3">{blog?.title}</h4>
			<div className="flex items-center gap-3">
				<Avatar className="h-8 w-8 rounded-full bg-white!">
					<AvatarImage
						src={blog?.author.image}
						alt={blog?.author.name}
						className="bg-white!"
					/>
					<AvatarFallback className="rounded-lg bg-gray-400 text-white">
						{blog?.author.name.split(" ")[0].toUpperCase()[0] +
							blog?.author.name.split(" ")[1].toUpperCase()[0]}
					</AvatarFallback>
				</Avatar>
				<span className="text-sm text-[#6C7179]!">{blog?.author.name}</span>
			</div>
		</Link>
	);
}

function RouteComponent() {
	const { pagination, setPagination, searchTerm, setSearchTerm } =
		useTableStore();
	const [selectedCategory, setSelectedCategory] = useState<string>("");

	const { data: filters } = useBlogsFilter();

	// Parse search term to get filter params
	const getSearchParams = () => {
		if (!searchTerm) return {};
		try {
			return JSON.parse(searchTerm);
		} catch {
			return { query: searchTerm };
		}
	};

	const searchParams = getSearchParams();

	// Fetch blogs with filters - combine selectedCategory with search params
	const { data: blogsData, isLoading: blogsLoading } = useBlogs({
		page: pagination.pageIndex + 1,
		limit: pagination.pageSize,
		status: "PUBLISHED",
		categoryId: selectedCategory || searchParams.categoryId || undefined,
		search: searchParams.query || undefined,
	});

	// Fetch categories with counts
	const { data: categoriesData } = useBlogCategories({
		page: 1,
		limit: 20,
	});

	const blogs = blogsData?.data || [];
	const blogPagination = blogsData?.pagination;
	console.log("categoriesData", categoriesData);

	const handleCategoryFilter = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setSearchTerm(""); // Clear search when filtering by category
		setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page
	};

	const handleClearFilters = () => {
		setSelectedCategory("");
		setSearchTerm("");
		setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page
	};

	const handlePageChange = (newPage: number) => {
		setPagination({ ...pagination, pageIndex: newPage - 1 });
	};

	return (
		<div className="">
			{/* Hero Section */}
			<section className=" py-8 md:py-16 relative">
				<div className="">
					<Breadcrumb alignment="center">
						Home /{" "}
						<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
							Blogs
						</span>
					</Breadcrumb>

					<div className="text-center mb-10">
						<h2 className="h2">SAT Blogs and Updates</h2>
						<Subtitle alignment="center" className=" max-w-xl">
							Clear, practical content to help students improve SAT scores, plan
							preparation, and avoid common mistakes.
						</Subtitle>
					</div>
				</div>

				<div
					className="absolute inset-0 -z-10"
					style={{
						background:
							"linear-gradient(180deg, #FFFFFF 27.07%, rgba(236, 241, 254, 0.05) 60%, rgba(236, 241, 254, 0.1) 83%, rgba(21, 82, 253, 0.05) 100%)",
					}}
				/>
			</section>

			{/* Main Content */}
			<div className="container mx-auto py-8 md:py-16">
				<div className="px-4 md:px-0">
					<div className="flex items-center gap-3 mb-4">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							{/* Search */}
							<BlogSearch
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
								setPagination={setPagination}
							/>

							{/* Active Filters Display */}
							{(selectedCategory || searchParams.query) && (
								<div className="mt-4 flex items-center gap-2 flex-wrap">
									<span className="text-sm text-gray-600">Active filters:</span>

									{selectedCategory && (
										<span className="bg-primary-dark/10 text-primary-dark px-3 py-1 rounded-full text-sm flex items-center gap-2">
											Category:{" "}
											{
												filters?.data?.categories.find(
													(c: { id: string; name: string }) =>
														c.id === selectedCategory,
												)?.name
											}
											<button
												type="button"
												onClick={() => {
													setSelectedCategory("");
													setPagination({ ...pagination, pageIndex: 0 });
												}}
												className="hover:text-red-600"
											>
												✕
											</button>
										</span>
									)}

									{searchParams.query && (
										<span className="bg-primary-dark/10 text-primary-dark px-3 py-1 rounded-full text-sm flex items-center gap-2">
											Search: {searchParams.query}
											<button
												type="button"
												onClick={() => {
													setSearchTerm("");
													setPagination({ ...pagination, pageIndex: 0 });
												}}
												className="hover:text-red-600"
											>
												✕
											</button>
										</span>
									)}
								</div>
							)}
						</div>

						<div className="flex items-center gap-2 ml-auto">
							<FilterDropdown
								label="Featured"
								options={["Featured", "Newest", "Oldest", "Popular"]}
							/>

							<FilterDropdown
								label="All Categories"
								options={categoriesData?.data.map((category) => category.name)}
							/>

							{/* Reset */}
							<button
								type="button"
								onClick={() => {
									setSelectedCategory("");
									setSearchTerm("");
									setPagination({ ...pagination, pageIndex: 0 }); // Reset to first page
								}}
								className="py-3 px-4 flex items-center justify-center rounded-md border border-[#EBEBEB] bg-[#EBF3FF] hover:bg-[#EBEBEB] hover:border-[#EBEBEB] transition-all"
							>
								<RotateCcw className="w-5 h-5 text-primary" />
							</button>

							{/* Filters */}
							<button
								type="button"
								className="py-3 px-4 flex items-center justify-center rounded-md bg-primary hover:bg-blue-700 transition-colors"
							>
								<SlidersHorizontal className="w-5 h-5 text-white" />
							</button>
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						{blogs.map((blog) => (
							<BlogCard key={blog.id} blog={blog} />
						))}
					</div>
				</div>

				{/* Pagination */}
				{blogPagination && blogPagination.totalPages > 1 && (
					<div className="flex items-center justify-center md:justify-between gap-2 mt-8">
						<button
							type="button"
							onClick={() => handlePageChange(blogPagination.page - 1)}
							disabled={!blogPagination.hasPrev}
							className={`flex items-center gap-2 px-6 py-3 rounded-[6px] border border-gray-200 text-sm font-semibold transition-all ${
								blogPagination.hasPrev
									? "bg-white text-gray-700 hover:bg-[#1552FD] hover:text-white cursor-pointer"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"
							}`}
						>
							<ChevronLeft className="w-4 h-4" />
							Prev
						</button>
						<div className="flex items-center gap-2">
							{Array.from(
								{ length: blogPagination.totalPages },
								(_, i) => i + 1,
							).map((pageNum) => (
								<button
									key={pageNum}
									type="button"
									onClick={() => handlePageChange(pageNum)}
									className={` w-12 h-12 flex items-center justify-center rounded-[6px] text-sm font-semibold cursor-pointer transition-all ${
										blogPagination.page === pageNum
											? "bg-blue-600 text-white shadow-sm shadow-blue-200"
											: "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
									}`}
								>
									{pageNum}
								</button>
							))}
						</div>

						<button
							type="button"
							onClick={() => handlePageChange(blogPagination.page + 1)}
							disabled={!blogPagination.hasNext}
							className={`flex items-center gap-2 px-6 py-3 rounded-[6px] border border-gray-200 text-sm font-semibold ${
								blogPagination.hasNext
									? "bg-white text-gray-700 hover:bg-[#1552FD] hover:text-white cursor-pointer"
									: "bg-gray-200 text-gray-400 cursor-not-allowed"
							}`}
						>
							Next
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				)}
			</div>

			{/* FAQ Section */}
			<FAQSectionTwo />
		</div>
	);
}
