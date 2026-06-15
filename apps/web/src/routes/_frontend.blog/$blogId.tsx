import { zodResolver } from "@hookform/resolvers/zod";
import {
	type TCBlogCommentSchema,
	ZCBlogCommentSchema,
} from "@prepexcellence/shared-validators";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TwitterIcon,
	TwitterShareButton,
} from "react-share";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/breadcrumb";
import FooterTwo from "@/components/FooterTwo";
import { Subtitle } from "@/components/SectionSubtitle";
import { CalenderSVG } from "@/components/SvgComponents";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	useBlogBySlug,
	usePostBlogComment,
	useRelatedBlogs,
} from "@/hooks/content-management";
import { BACKEND_URL_V1 } from "@/lib/GlobalVariable";

export const Route = createFileRoute("/_frontend/blog/$blogId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { blogId } = Route.useParams();
	const { data, isLoading, error } = useBlogBySlug(blogId);
	const commentFormId = useId();
	const repliesId = useId();
	const blog = data?.data;

	const { data: relatedBlogsData } = useRelatedBlogs(
		blogId,
		blog?.categoryId!,
		blog?.tags,
	);
	const relatedBlogs = relatedBlogsData?.data || [];
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [searchInput, setSearchInput] = useState("");
	console.log("relatedBlogs", relatedBlogs);
	const commentMutation = usePostBlogComment();
	const queryClient = useQueryClient();

	const form = useForm<TCBlogCommentSchema>({
		resolver: zodResolver(ZCBlogCommentSchema),
		defaultValues: {
			blogId: blogId,
			content: "",
			parentId: undefined,
		},
	});

	function onSubmit(values: TCBlogCommentSchema) {
		const payload = {
			blogId: blog?.id!,
			content: values.content,
			parentId: replyingTo || undefined,
		};

		commentMutation.mutate(payload, {
			onSuccess: (res) => {
				toast.success(res.message || "Comment submitted successfully");
				document
					.getElementById(repliesId)
					?.scrollIntoView({ behavior: "smooth", block: "center" });
				queryClient.invalidateQueries({ queryKey: ["blog", "slug", blogId] });
				form.reset();
				setReplyingTo(null);
			},
			onError: (err) => {
				toast.error(err.message || "Error submitting comment");
			},
		});
	}

	const handleReply = (commentId: string, userName: string) => {
		setReplyingTo(commentId);
		// Optionally pre-fill the comment with @username
		form.setValue("content", `@${userName} `);
		// Scroll to comment form
		document
			.getElementById(commentFormId)
			?.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	const handleCancelReply = () => {
		setReplyingTo(null);
		form.setValue("content", "");
	};

	const handleSearch = () => {
		if (searchInput.trim()) {
			// Navigate to blog list with search query
			window.location.href = `/blog?search=${encodeURIComponent(searchInput)}`;
		}
	};

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
		<div className="">
			{/* Hero Section */}
			<div className="relative">
				<section className="container mx-auto py-8 md:py-16">
					<div className="">
						<Breadcrumb alignment="center" className="mb-2">
							Home / Blogs /{" "}
							<span className="text-primary! font-medium! hover:underline tracking-[0.5px]!">
								{blog?.title}
							</span>
						</Breadcrumb>

						<div className="text-center mb-10">
							<h2 className="h2 max-w-3xl mx-auto">{blog?.title}</h2>
							<div className="flex justify-center items-center gap-6">
								<div className="flex items-center justify-center gap-3">
									<Avatar className="h-8 w-8 rounded-full bg-white!">
										<AvatarImage
											src={blog.author.image}
											alt={blog.author.name}
											className="bg-white!"
										/>
										<AvatarFallback className="rounded-lg bg-gray-400 text-white">
											{blog.author.name.split(" ")[0].toUpperCase()[0] +
												blog.author.name.split(" ")[1].toUpperCase()[0]}
										</AvatarFallback>
									</Avatar>
									<span className="text-sm text-[#6C7179]!">
										{blog.author.name}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<CalenderSVG width="30" height="30" stroke="#1552FD" />
									{blog.publishedAt
										? format(new Date(blog.publishedAt), "MMMM d, yyyy")
										: format(new Date(blog.createdAt), "MMMM d, yyyy")}
								</div>
							</div>
						</div>
						<div className="w-full h-[500px] md:h-[632px] ">
							<img
								src={blog.image}
								alt={blog.title}
								className="w-full h-full object-cover rounded-[12px] mb-4"
							/>
							<div
								className="absolute inset-0 -z-10"
								style={{
									background:
										"linear-gradient(180deg, #FFFFFF 27.07%, rgba(236, 241, 254, 0.05) 60%, rgba(236, 241, 254, 0.1) 83%, rgba(21, 82, 253, 0.05) 100%)",
								}}
							/>
						</div>
					</div>
				</section>
			</div>

			<div className="container mx-auto">
				<div className="pt-8 md:pt-16 pb-3 max-w-5xl mx-auto ">
					{parse(DOMPurify.sanitize(blog.description))}
				</div>
				<div className="max-w-5xl mx-auto">
					<h4 className="mb-1.5">Share on social</h4>
					<div className="flex items-center gap-3">
						<FacebookShareButton
							url={`${BACKEND_URL_V1}/${blog.slug}`}
							title={blog.title}
						>
							<FacebookIcon size={32} round />
						</FacebookShareButton>
						<TwitterShareButton
							url={`${BACKEND_URL_V1}/${blog.slug}`}
							title={blog.title}
						>
							<TwitterIcon size={32} round />
						</TwitterShareButton>
						<LinkedinShareButton
							url={`${BACKEND_URL_V1}/${blog.slug}`}
							title={blog.title}
						>
							<LinkedinIcon size={32} round />
						</LinkedinShareButton>
					</div>
				</div>
			</div>

			{/* related blog */}
			<section className="container mx-auto py-8 md:py-16">
				<h3 className="h3 mb-4 text-center">Related Posts</h3>
				<Subtitle className="max-w-[620px] mx-auto ">
					Read related articles from our own desk
				</Subtitle>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{relatedBlogs && relatedBlogs?.length > 0 ? (
						relatedBlogs.map((relatedBlog) => (
							<Link
								key={relatedBlog.id}
								to={`/blog/${relatedBlog.slug}` as "/"}
								className="bg-white p-4 rounded-lg shadow-md"
							>
								<img
									src={relatedBlog.image}
									alt={relatedBlog.title}
									className="w-full h-[316px] rounded-[6px] mb-4"
								/>
								<h5 className="f14 text-[#6C7179]! mb-3">
									{relatedBlog.publishedAt
										? format(new Date(relatedBlog.publishedAt), "MMMM d, yyyy")
										: format(new Date(relatedBlog.createdAt), "MMMM d, yyyy")}
								</h5>
								<h4 className="h4 mb-3">{relatedBlog.title}</h4>

								{/* Add author check */}
								{relatedBlog.author && (
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8 rounded-full bg-white!">
											<AvatarImage
												src={relatedBlog.author.image}
												alt={relatedBlog.author.name}
												className="bg-white!"
											/>
											<AvatarFallback className="rounded-lg bg-gray-400 text-white">
												{relatedBlog.author.name
													.split(" ")
													.slice(0, 2)
													.map((word) => word[0].toUpperCase())
													.join("")}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm text-[#6C7179]!">
											{relatedBlog.author.name}
										</span>
									</div>
								)}
							</Link>
						))
					) : (
						<div className="col-span-full text-center text-gray-500">
							No related posts found
						</div>
					)}
				</div>
			</section>
			<FooterTwo />
		</div>
	);
}
