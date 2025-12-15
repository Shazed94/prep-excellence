import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowRightSVG,
	CalenderSVG,
	MessageIcon,
} from "@/components/SvgComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBlogBySlug } from "@/integrations/services/hooks";

export const Route = createFileRoute("/_frontend/blog/$blogId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { blogId } = Route.useParams();
	const { data, isLoading, error } = useBlogBySlug(blogId);

	const blog = data?.data;

	if (isLoading) {
		return (
			<div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center">
				<div className="text-center">Loading blog post...</div>
			</div>
		);
	}

	if (error || !blog) {
		return (
			<div className="bg-[#FAFAFA] min-h-screen flex items-center justify-center">
				<div className="text-center text-red-500">
					Blog post not found or error loading data.
				</div>
			</div>
		);
	}
	return (
		<div className=" bg-[#FAFAFA]">
			{/* Main Content Container */}
			<div className="container mx-auto px-4 py-8">
				{/* Grid: 2/3 + 1/3 Layout */}
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content - 2 columns (2/3) */}
					<div className="lg:col-span-2">
						{/* Featured Image */}
						<div className="mb-6">
							<img
								src={blog.image}
								alt={blog.title}
								className="w-full rounded-lg"
							/>
						</div>

						{/* Post Meta */}
						<div className="flex items-center gap-3 border-b border-[#E8E8E8] pb-4 mb-4">
							<div className="flex items-center gap-4 text-xs  mb-3">
								<span className="flex items-center gap-1">
									<MessageIcon />
									<span className="text-[16px]">
										{blog.comments?.length || 0}
									</span>
								</span>
								<span className="flex items-center gap-1">
									<CalenderSVG />
									<span className="text-[16px]">
										{blog.publishedAt
											? format(new Date(blog.publishedAt), "dd.MM.yyyy")
											: "Draft"}
									</span>
								</span>
							</div>
						</div>

						{/* post author */}
						<h5 className="text-[10px] md:text-[15px] font-semibold text-muted block pb-2.5">
							-- By {blog.author.username}
						</h5>

						{/* Post Title */}
						<h1 className="text-3xl font-bold text-gray-900 mb-6">
							{blog.title}
						</h1>

						{/* Post Content */}
						<div className="prose max-w-none mb-6">
							<div
								className="text-gray-700 leading-relaxed"
								// dangerouslySetInnerHTML={{ __html: blog.description }}
							/>
						</div>

						{/* Tags */}
						{blog.tags && blog.tags.length > 0 && (
							<div className="mb-14">
								<h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
									Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{blog.tags.map((tag) => (
										<Button
											key={tag}
											className="bg-primary-dark hover:bg-primary-dark/90 text-white"
										>
											{tag}
										</Button>
									))}
								</div>
							</div>
						)}

						{/* Comments Section */}
						<div className="mb-8 bg-white border border-[#BEBEBE] rounded p-6">
							<h3 className="text-[14px] md:text-[19px] font-medium border-b border-b-[#BEBEBE] pb-3 mb-6">
								Comments ({blog.comments?.length || 0})
							</h3>

							{blog.comments && blog.comments.length > 0 ? (
								<div className="space-y-6">
									{blog.comments.map((comment) => (
										<div key={comment.id}>
											<div className="flex gap-6 mb-6">
												<div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-xl font-semibold">
													{comment.user.username.charAt(0).toUpperCase()}
												</div>
												<div className="flex-1 bg-[#9FACBA]/25 p-4 rounded">
													<div className="flex items-center justify-between mb-2">
														<h4 className="font-semibold text-gray-900">
															{comment.user.username}
														</h4>
														<span className="text-sm text-gray-500">
															{format(
																new Date(comment.createdAt),
																"MMMM dd, yyyy",
															)}
														</span>
													</div>
													<p className="text-gray-700 text-sm leading-relaxed">
														{comment.content}
													</p>
												</div>
											</div>

											{/* Replies */}
											{comment.replies && comment.replies.length > 0 && (
												<div className="ml-32 space-y-6">
													{comment.replies.map((reply) => (
														<div key={reply.id} className="flex gap-6 mb-6">
															<div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-xl font-semibold">
																{reply.user.username.charAt(0).toUpperCase()}
															</div>
															<div className="flex-1 bg-[#9FACBA]/25 p-4 rounded">
																<div className="flex items-center justify-between mb-2">
																	<h4 className="font-semibold text-gray-900">
																		{reply.user.username}
																	</h4>
																	<span className="text-sm text-gray-500">
																		{format(
																			new Date(reply.createdAt),
																			"MMMM dd, yyyy",
																		)}
																	</span>
																</div>
																<p className="text-gray-700 text-sm leading-relaxed">
																	{reply.content}
																</p>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-center py-8">
									No comments yet. Be the first to comment!
								</p>
							)}
						</div>

						{/* Comment Form */}
						<div className="bg-white p-6 rounded-lg shadow-[0_0_21px_-2px_rgba(0,0,0,0.1)]">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-4">
								Leave a Comment
							</h3>
							<form className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="name"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Your Name*
										</label>
										<Input
											name="name"
											placeholder="Enter your full name here"
											className="rounded-full bg-gray-50 border-none"
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Email*
										</label>
										<Input
											name="email"
											type="email"
											placeholder="Enter your email here"
											className="rounded-full bg-gray-50 border-none"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label
											htmlFor="website"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Website
										</label>
										<Input
											name="website"
											placeholder="Enter website here"
											className="rounded-full bg-gray-50 border-none"
										/>
									</div>

									<div>
										<label
											htmlFor="phone"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Phone
										</label>
										<Input
											name="phone"
											placeholder="Enter your phone number here"
											className="rounded-full bg-gray-50 border-none"
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="comment"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Comment
									</label>
									<Textarea
										name="comment"
										placeholder="Your comment here"
										rows={4}
										className="rounded-2xl bg-gray-50 border-none"
									/>
								</div>

								<Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2">
									Submit
								</Button>
							</form>
						</div>
					</div>

					{/* Sidebar - 1 column (1/3) */}
					<div className="lg:col-span-1">
						{/* Search */}
						<div className="mb-12">
							<h3 className="text-[19px] font-medium  mb-4">Search</h3>
							<div className="relative ">
								<input
									type="text"
									placeholder="Search"
									className="w-full px-4 py-2 placeholder:text-[13px] font-light border border-primary-dark rounded-full focus:outline-none focus:ring focus:ring-primary-dark shadow-[0_1px_21px_0_rgba(0,0,0,0.1)]"
								/>
								<button
									type="button"
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
					</div>
				</div>
			</div>
		</div>
	);
}
