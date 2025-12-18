import { createFileRoute, Link } from "@tanstack/react-router";
import { parse as dateParse, format } from "date-fns";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import {
	ArrowRightSVG,
	CalenderSVG,
	FacebookSVG,
	LinkedInSVG,
	MessageIcon,
	PinterestSVG,
	TwitterSVG,
} from "@/components/SvgComponents";
import { Button } from "@/components/ui/button";
import {
	useBlogCategories,
	useBlogs,
	useBlogsFilter,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";
import { BlogSearch } from "./BlogSearch";
export const Route = createFileRoute("/_frontend/blog/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { pagination, setPagination, searchTerm, setSearchTerm } =
		useTableStore();
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	// Fetch latest 3 blogs for hero section
	const { data: heroBlogs } = useBlogs({
		page: 1,
		limit: 3,
		status: "PUBLISHED",
	});

	// Fetch latest 4 blogs for recent posts
	const { data: recentBlogs } = useBlogs({
		page: 1,
		limit: 4,
		status: "PUBLISHED",
	});

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
	console.log("categoriesData:", categoriesData);
	const blogs = blogsData?.data || [];
	const blogPagination = blogsData?.pagination;
	const heroPostsData = heroBlogs?.data || [];
	const recentPostsData = recentBlogs?.data || [];

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
		<div className="bg-[#FAFAFA]">
			{/* Hero Section */}
			<div className="container mx-auto">
				<div className="px-4 md:px-20 py-8">
					<div className="grid md:grid-cols-3 gap-4 mb-16 h-full">
						{/* Left Hero Image - Latest Blog */}
						{heroPostsData[0] && (
							<Link
								to="/blog/$blogId"
								params={{ blogId: heroPostsData[0].slug }}
								className="relative col-span-1 md:col-span-2 h-full max-h-[450px] bg-white shadow-[0_0_21px_0_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow cursor-pointer"
							>
								<img
									src={heroPostsData[0].image}
									alt={heroPostsData[0].title}
									className="w-full h-[75%] object-cover"
								/>
								<div className="h-[25%] flex justify-center items-center px-4">
									<div className="text-sm md:text-[17px] font-medium leading-normal line-clamp-3">
										{parse(DOMPurify.sanitize(heroPostsData[0].description))}
									</div>
								</div>
							</Link>
						)}

						{/* Right Hero Images - 2nd and 3rd Latest Blogs */}
						<div className="col-span-1 grid grid-rows-2 gap-4 h-full max-h-[450px]">
							{heroPostsData[1] && (
								<Link
									to="/blog/$blogId"
									params={{ blogId: heroPostsData[1].slug }}
									className="relative bg-white shadow-[0_0_21px_0_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow cursor-pointer"
								>
									<img
										src={heroPostsData[1].image}
										alt={heroPostsData[1].title}
										className="w-full h-[70%] object-cover"
									/>
									<div className="h-[30%] flex justify-center items-center px-4">
										<div className="text-sm md:text-[17px] font-medium leading-normal line-clamp-2">
											{parse(DOMPurify.sanitize(heroPostsData[1].description))}
										</div>
									</div>
								</Link>
							)}
							{heroPostsData[2] && (
								<Link
									to="/blog/$blogId"
									params={{ blogId: heroPostsData[2].slug }}
									className="relative bg-white shadow-[0_0_21px_0_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow cursor-pointer"
								>
									<img
										src={heroPostsData[2].image}
										alt={heroPostsData[2].title}
										className="w-full h-[70%] object-cover"
									/>
									<div className="h-[30%] flex justify-center items-center px-4">
										<div className="text-sm md:text-[17px] font-medium leading-normal line-clamp-2">
											{parse(DOMPurify.sanitize(heroPostsData[2].description))}
										</div>
									</div>
								</Link>
							)}
						</div>
					</div>

					{/* Explore Our Blog Archives - Search Section */}
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="col-span-1 md:col-span-2 gap-2">
							<SectionTitle>Explore Our Blog Archives</SectionTitle>

							<div className="flex flex-wrap gap-3">
								<Button
									onClick={() => handleClearFilters()}
									className={`${
										selectedCategory === "" && searchTerm === ""
											? "bg-primary-dark text-white"
											: "bg-white text-gray-700 border-primary-dark"
									} px-2.5 py-0.5 h-8 min-w-20`}
									variant={
										selectedCategory === "" && searchTerm === ""
											? "default"
											: "outline"
									}
								>
									All
								</Button>
								{filters?.data?.categories.map((category: any) => (
									<Button
										key={category.id}
										onClick={() => handleCategoryFilter(category.id)}
										variant={
											selectedCategory === category.id ? "default" : "outline"
										}
										className={`${
											selectedCategory === category.id
												? "bg-primary-dark text-white"
												: "bg-white text-gray-700 border-primary-dark"
										} px-2.5 py-0.5 h-8 min-w-20`}
									>
										{category.name}
									</Button>
								))}
							</div>

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
						{/* Search */}
						<BlogSearch
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							setPagination={setPagination}
						/>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto">
				<div className="px-4 md:px-20 py-8">
					<div className="grid lg:grid-cols-3 gap-4 md:gap-16">
						{/* Blog Posts Grid - Takes 2/3 (2 columns) */}
						<div className="lg:col-span-2">
							{blogsLoading ? (
								<div className="text-center py-12">Loading blogs...</div>
							) : blogs.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-gray-500 text-lg mb-4">
										No blogs found matching your criteria.
									</p>
									{searchTerm && (
										<Button
											onClick={() => {
												setSearchTerm("");
												setPagination({ ...pagination, pageIndex: 0 });
											}}
											className="bg-primary-dark hover:bg-primary-dark/90"
										>
											Clear Filters
										</Button>
									)}
								</div>
							) : (
								<>
									<div className="grid md:grid-cols-2 gap-6">
										{blogs.map((blog) => (
											<Link
												key={blog.id}
												to="/blog/$blogId"
												params={{ blogId: blog.slug }}
											>
												<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
													<img
														src={blog.image}
														alt={blog.title}
														className="w-full h-[300px] object-cover"
													/>
													<div className="p-[15px]">
														<span className="text-[10px] md:text-[15px] font-semibold text-muted block pb-2.5">
															-- By {blog.author?.name || "Anonymous"}
														</span>
														<h3 className="text-[14px] md:text-[19px] font-semibold mb-7 line-clamp-2">
															{blog.title}
														</h3>
														<div className="flex items-center gap-4 text-xs mb-3">
															<span className="flex items-center gap-1">
																<MessageIcon />
																<span className="text-[16px]">
																	{blog._count?.comments || 0}
																</span>
															</span>
															<span className="flex items-center gap-1">
																<CalenderSVG />
																<span className="text-[16px]">
																	{blog.publishedAt
																		? format(
																				new Date(blog.publishedAt),
																				"dd.MM.yyyy",
																			)
																		: format(
																				new Date(blog.createdAt),
																				"dd.MM.yyyy",
																			)}
																</span>
															</span>
														</div>
														<div className="text-[12px] md:text-[17px] mb-4 line-clamp-3">
															{blog.description?.replace(/<[^>]*>/g, "") || ""}
														</div>
														<div className="flex items-center justify-between">
															<Button
																size="lg"
																className="bg-primary-dark hover:bg-primary-dark text-white text-[13px] md:text-[18px] cursor-pointer"
															>
																Read More
															</Button>
															<div className="flex gap-2">
																<span className="text-[15px] font-medium text-primary-dark">
																	Share:
																</span>
																<FacebookSVG />
																<TwitterSVG />
																<PinterestSVG />
																<LinkedInSVG />
															</div>
														</div>
													</div>
												</article>
											</Link>
										))}
									</div>

									{/* Pagination */}
									{blogPagination && blogPagination.totalPages > 1 && (
										<div className="flex items-center justify-center md:justify-end gap-2 mt-8">
											<button
												type="button"
												onClick={() =>
													handlePageChange(blogPagination.page - 1)
												}
												disabled={!blogPagination.hasPrev}
												className={`w-8 h-8 rounded-full flex items-center justify-center ${
													blogPagination.hasPrev
														? "bg-white text-gray-700 hover:bg-gray-100"
														: "bg-gray-200 text-gray-400 cursor-not-allowed"
												}`}
											>
												<ArrowLeft className="h-4 w-4" />
											</button>

											{Array.from(
												{ length: blogPagination.totalPages },
												(_, i) => i + 1,
											).map((pageNum) => (
												<button
													key={pageNum}
													type="button"
													onClick={() => handlePageChange(pageNum)}
													className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
														blogPagination.page === pageNum
															? "bg-primary-dark text-white hover:bg-cyan-600"
															: "bg-white text-gray-700 hover:bg-gray-100"
													}`}
												>
													{pageNum}
												</button>
											))}

											<button
												type="button"
												onClick={() =>
													handlePageChange(blogPagination.page + 1)
												}
												disabled={!blogPagination.hasNext}
												className={`w-8 h-8 rounded-full flex items-center justify-center ${
													blogPagination.hasNext
														? "bg-white text-gray-700 hover:bg-gray-100"
														: "bg-gray-200 text-gray-400 cursor-not-allowed"
												}`}
											>
												<ArrowRight className="h-4 w-4" />
											</button>
										</div>
									)}
								</>
							)}
						</div>

						{/* Sidebar - Takes 1/3 (1 column) */}
						<aside className="lg:col-span-1 space-y-6">
							{/* Recent Posts */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Recent Posts
								</h3>
								<div className="space-y-4">
									{recentPostsData.length > 0 ? (
										recentPostsData.map((post) => (
											<Link
												key={post.id}
												to="/blog/$blogId"
												params={{ blogId: post.slug }}
												className="flex gap-5 items-center hover:opacity-80 transition-opacity"
											>
												<img
													src={post.image}
													alt={post.title}
													className="w-[82px] h-[88px] object-cover"
												/>
												<div className="flex-1">
													<h4 className="text-[12px] md:text-[16px] font-semibold line-clamp-4">
														{post.title}
													</h4>
												</div>
											</Link>
										))
									) : (
										<p className="text-gray-500 text-sm">No recent posts</p>
									)}
								</div>
							</div>

							{/* Categories */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Categories
								</h3>
								<div className="space-y-[5px]">
									{categoriesData?.data && categoriesData?.data.length > 0 ? (
										categoriesData.data.map((category: any) => (
											<button
												key={category.id}
												type="button"
												onClick={() => handleCategoryFilter(category.id)}
												className={`w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100 ${
													selectedCategory === category.id
														? "bg-primary-dark/10 text-primary-dark font-semibold"
														: "text-gray-700 bg-gray-50"
												}`}
											>
												<span>{category.name}</span>
												<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
													{category._count?.blogs || 0}
												</span>
											</button>
										))
									) : (
										<p className="text-gray-500 text-sm">No categories</p>
									)}
								</div>
							</div>

							{/* Archives */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Archives
								</h3>
								<div className="space-y-1">
									{filters?.data?.months?.map((monthStr, index) => {
										// Parse the string "2025-12" into a Date object
										const date = dateParse(monthStr, "yyyy-MM", new Date());

										// Format the date as "December 2025"
										const formattedMonth = format(date, "MMMM yyyy");

										return (
											<button
												key={index}
												type="button"
												className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
											>
												<ArrowRightSVG />
												<span>{formattedMonth}</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* Meta */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Meta
								</h3>
								<div className="space-y-1">
									<button
										type="button"
										className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Register</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Log In</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Entries Feed</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Comments Feed</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>WordPress.org</span>
									</button>
								</div>
							</div>

							{/* Tags */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Language learning
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Business
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Development
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Health
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Motivation
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Marketing
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										UI/UX
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Technology
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Lifestyle
									</Button>
									<Button className="bg-primary-dark hover:bg-primary-dark/90 text-white">
										Art
									</Button>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</div>
	);
}
