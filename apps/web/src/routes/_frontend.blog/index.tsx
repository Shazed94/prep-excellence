import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
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
import { useBlogCategories, useBlogs } from "@/hooks/content-management";

export const Route = createFileRoute("/_frontend/blog/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [page, setPage] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchInput, setSearchInput] = useState("");

	const { data: blogsData, isLoading: blogsLoading } = useBlogs({
		page,
		limit: 8,
		status: "PUBLISHED",
		categoryId: selectedCategory || undefined,
		search: searchQuery || undefined,
	});

	const { data: categoriesData } = useBlogCategories({ limit: 100 });

	const blogs = blogsData?.data || [];
	const blogPagination = blogsData?.pagination;
	const categories = categoriesData?.data || [];

	const handleSearch = () => {
		setSearchQuery(searchInput);
		setPage(1);
	};

	const handleCategoryFilter = (categoryId: string) => {
		setSelectedCategory(categoryId);
		setPage(1);
	};
	return (
		<div className=" bg-[#FAFAFA]">
			{/* Hero Section */}
			<div className="container mx-auto">
				<div className="px-4 md:px-20 py-8">
					<div className="grid md:grid-cols-3 gap-4 mb-16 h-full">
						{/* Left Hero Image */}
						<div className="relative col-span-1 md:col-span-2 h-full max-h-[450px] bg-white shadow-[0_0_21px_0_rgba(0,0,0,0.1)]">
							<img
								src="https://picsum.photos/800/400"
								alt="Students studying"
								className="w-full h-[75%] object-cover"
							/>
							<div className="h-[25%] flex justify-center items-center px-4">
								<p className="text-sm md:text-[17px] font-medium leading-normal">
									Lorem ipsum dolor sit amet, consectetur adipisicing elit.
									Itaque alias eaque nemo magni, voluptates maxime vero cumque,
									esse maiores ea consequuntur, cum explicabo fugiat
									necessitatibus repellendus sequi eum id omnis!
								</p>
							</div>
						</div>

						{/* Right Hero Images */}
						<div className="col-span-1 grid grid-rows-2 gap-4 h-full max-h-[450px]">
							<div className="relative  bg-white shadow-[0_0_21px_0_rgba(0,0,0,0.1)]">
								<img
									src="https://picsum.photos/800/400"
									alt="Students studying"
									className="w-full h-[70%] object-cover"
								/>
								<div className="h-[30%] flex justify-center items-center px-4">
									<p className="text-sm md:text-[17px] font-medium leading-normal">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit.
										Itaque alias eaque nemo magni
									</p>
								</div>
							</div>
							<div className="relative  bg-white shadow-[0_0_21px_0_rgba(0,0,0,0.1)]">
								<img
									src="https://picsum.photos/800/400"
									alt="Students studying"
									className="w-full h-[70%] object-cover"
								/>
								<div className="h-[30%] flex justify-center items-center px-4">
									<p className="text-sm md:text-[17px] font-medium leading-normal">
										Lorem ipsum dolor sit amet, consectetur adipisicing elit.
										Itaque alias eaque nemo magni
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Explore Our Blog Archives */}
					<div className="grid lg:grid-cols-3 gap-8">
						<div className="col-span-1 md:col-span-2 gap-2">
							<SectionTitle> Explore Our Blog Archives</SectionTitle>

							<div className="flex flex-wrap gap-3">
								<Button
									onClick={() => handleCategoryFilter("")}
									className={`${
										selectedCategory === ""
											? "bg-primary-dark text-white"
											: "bg-white text-gray-700 border-primary-dark"
									} px-2.5 py-0.5 h-8 min-w-20`}
									variant={selectedCategory === "" ? "default" : "outline"}
								>
									All
								</Button>
								{categories.map((category) => (
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
						</div>
						{/* Search */}
						<div className="pt-4 ">
							<h3 className="text-[19px] font-medium  mb-4">Search</h3>
							<div className="relative ">
								<input
									type="text"
									placeholder="Search"
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleSearch();
									}}
									className="w-full px-4 py-2 placeholder:text-[13px] font-light border border-primary-dark rounded-full focus:outline-none focus:ring focus:ring-primary-dark shadow-[0_1px_21px_0_rgba(0,0,0,0.1)]"
								/>
								<button
									type="button"
									onClick={handleSearch}
									className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-dark text-white p-2 rounded-full "
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 15 15"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<title>Search icon</title>
										<path
											d="M14.7949 12.9697L11.874 10.0488C11.7422 9.91699 11.5635 9.84375 11.376 9.84375H10.8984C11.707 8.80957 12.1875 7.50879 12.1875 6.09375C12.1875 2.72754 9.45996 0 6.09375 0C2.72754 0 0 2.72754 0 6.09375C0 9.45996 2.72754 12.1875 6.09375 12.1875C7.50879 12.1875 8.80957 11.707 9.84375 10.8984V11.376C9.84375 11.5635 9.91699 11.7422 10.0488 11.874L12.9697 14.7949C13.2451 15.0703 13.6904 15.0703 13.9629 14.7949L14.792 13.9658C15.0674 13.6904 15.0674 13.2451 14.7949 12.9697ZM6.09375 9.84375C4.02246 9.84375 2.34375 8.16797 2.34375 6.09375C2.34375 4.02246 4.01953 2.34375 6.09375 2.34375C8.16504 2.34375 9.84375 4.01953 9.84375 6.09375C9.84375 8.16504 8.16797 9.84375 6.09375 9.84375Z"
											fill="white"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto ">
				<div className="px-4 md:px-20 py-8">
					<div className="grid lg:grid-cols-3 gap-4 md:gap-16">
						{/* Blog Posts Grid - Takes 2/3 (2 columns) */}
						<div className="lg:col-span-2">
							{blogsLoading ? (
								<div className="text-center py-12">Loading blogs...</div>
							) : blogs.length === 0 ? (
								<div className="text-center py-12 text-gray-500">
									No blogs found. Try a different search or category.
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
												<article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
													<img
														src={blog.image}
														alt={blog.title}
														className="w-full h-[300px] object-cover"
													/>
													<div className="p-[15px]">
														<span className="text-[10px] md:text-[15px] font-semibold text-muted block pb-2.5">
															-- By {blog.author.name}
														</span>
														<h3 className="text-[14px] md:text-[19px] font-semibold mb-7 line-clamp-2">
															{blog.title}
														</h3>
														<div className="flex items-center gap-4 text-xs  mb-3">
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
																		: "Draft"}
																</span>
															</span>
														</div>
														<p className="text-[12px] md:text-[17px] mb-4 line-clamp-3">
															{blog.description}
														</p>
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
												onClick={() => setPage((p) => Math.max(1, p - 1))}
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
													onClick={() => setPage(pageNum)}
													className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
														page === pageNum
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
													setPage((p) =>
														Math.min(blogPagination.totalPages, p + 1),
													)
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
									<div className="flex gap-5 items-center">
										<img
											src="https://picsum.photos/id/133/400/300"
											alt="Recent post"
											className="w-[82px] h-[88px] object-cover"
										/>
										<div className="flex-1">
											<h4 className="text-[12px] md:text-[16px] font-semibold  line-clamp-4">
												Master the Art of Studying: Powerful Tips, Proven
												Frameworks, and Smart Techniques Every Student Must Know
												in this 2025.
											</h4>
										</div>
									</div>
									<div className="flex gap-5 items-center">
										<img
											src="https://picsum.photos/id/133/400/300"
											alt="Recent post"
											className="w-[82px] h-[88px] object-cover"
										/>
										<div className="flex-1">
											<h4 className="text-[12px] md:text-[16px] font-semibold  line-clamp-4">
												Master the Art of Studying: Powerful Tips, Proven
												Frameworks, and Smart Techniques Every Student Must Know
												in this 2025.
											</h4>
										</div>
									</div>
									<div className="flex gap-5 items-center">
										<img
											src="https://picsum.photos/id/133/400/300"
											alt="Recent post"
											className="w-[82px] h-[88px] object-cover"
										/>
										<div className="flex-1">
											<h4 className="text-[12px] md:text-[16px] font-semibold  line-clamp-4">
												Master the Art of Studying: Powerful Tips, Proven
												Frameworks, and Smart Techniques Every Student Must Know
												in this 2025.
											</h4>
										</div>
									</div>
									<div className="flex gap-5 items-center">
										<img
											src="https://picsum.photos/id/133/400/300"
											alt="Recent post"
											className="w-[82px] h-[88px] object-cover"
										/>
										<div className="flex-1">
											<h4 className="text-[12px] md:text-[16px] font-semibold  line-clamp-4">
												Master the Art of Studying: Powerful Tips, Proven
												Frameworks, and Smart Techniques Every Student Must Know
												in this 2025.
											</h4>
										</div>
									</div>
								</div>
							</div>

							{/* Categories */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Categories
								</h3>
								<div className="space-y-[5px]">
									<button
										type="button"
										className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
									>
										<span>College Admission</span>
										<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
											23
										</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
									>
										<span>College Essays</span>
										<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
											45
										</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
									>
										<span>College Info</span>
										<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
											67
										</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
									>
										<span>Deadlines</span>
										<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
											13
										</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
									>
										<span>Financial Aid</span>
										<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
											89
										</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
									>
										<span>General Education</span>
										<span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
											24
										</span>
									</button>
								</div>
							</div>

							{/* Archives */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Archives
								</h3>
								<div className="space-y-1">
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>October 2023</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>November 2023</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>February 2024</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>July 2024</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>June 2025</span>
									</button>
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
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Register</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Log In</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Entries Feed</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>Comments Feed</span>
									</button>
									<button
										type="button"
										className="w-full flex items-center gap-2.5  py-0.5 text-[12px] md:text-[17px]  rounded hover:bg-gray-100"
									>
										<ArrowRightSVG />
										<span>WordPress.org</span>
									</button>
								</div>
							</div>

							{/* Tags */}
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Meta
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
