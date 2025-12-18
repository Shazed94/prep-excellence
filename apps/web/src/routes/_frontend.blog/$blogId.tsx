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
import { toast } from "sonner";
import {
  ArrowRightSVG,
  CalenderSVG,
  MessageIcon,
} from "@/components/SvgComponents";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  useBlogBySlug,
  useBlogCategories,
  useBlogs,
  usePostBlogComment,
} from "@/hooks/content-management";

export const Route = createFileRoute("/_frontend/blog/$blogId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { blogId } = Route.useParams();
  const { data, isLoading, error } = useBlogBySlug(blogId);
  const commentFormId = useId();
  const repliesId = useId();

  const blog = data?.data;
  const cleanHTML = DOMPurify.sanitize(blog?.description ?? "");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const commentMutation = usePostBlogComment();
  const queryClient = useQueryClient();

  // Fetch latest 4 blogs for recent posts
  const { data: recentBlogs } = useBlogs({
    page: 1,
    limit: 4,
    status: "PUBLISHED",
  });

  // Fetch categories with counts
  const { data: categoriesData } = useBlogCategories({
    page: 1,
    limit: 100,
  });

  const recentPostsData = recentBlogs?.data || [];
  const categories = categoriesData?.data || [];

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
    <div className="bg-[#FAFAFA]">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-8">
        {/* Grid: 2/3 + 1/3 Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns (2/3) */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="mb-6 w-full h-[650px]">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full rounded-lg object-center object-cover"
              />
            </div>

            {/* Post Meta */}
            <div className="flex items-center gap-3 border-b border-[#E8E8E8] pb-4 mb-4">
              <div className="flex items-center gap-4 text-xs mb-3">
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
                      : format(new Date(blog.createdAt), "dd.MM.yyyy")}
                  </span>
                </span>
              </div>
            </div>

            {/* Post Author */}
            <h5 className="text-[10px] md:text-[15px] font-semibold text-muted block pb-2.5">
              -- By {blog.author.name}
            </h5>

            {/* Post Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Post Content */}
            <div className="prose max-w-none mb-6">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {parse(DOMPurify.sanitize(blog.description))}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-14">
                <h3 className="text-[14px] md:text-[19px] font-semibold pb-1 border-b border-b-[#BEBEBE]/80 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(blog.tags[0]).map((tag: string) => (
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
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 bg-[#9FACBA]/25 p-4 rounded">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {comment.user.name}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {format(
                                new Date(comment.createdAt),
                                "MMMM dd, yyyy"
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">
                            {comment.content}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handleReply(comment.id, comment.user.name)
                            }
                            className="text-primary-dark hover:text-primary-dark/80 text-sm font-medium cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div id={repliesId} className="ml-32 space-y-6">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-6 mb-6">
                              <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center text-gray-500 text-xl font-semibold">
                                {reply.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 bg-[#9FACBA]/25 p-4 rounded">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {reply.user.name}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {format(
                                      new Date(reply.createdAt),
                                      "MMMM dd, yyyy"
                                    )}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {reply.content}
                                </p>
                                {/* <button
                                  type="button"
                                  onClick={() =>
                                    handleReply(comment.id, comment.user.name)
                                  }
                                  className="text-primary-dark hover:text-primary-dark/80 text-sm font-medium cursor-pointer"
                                >
                                  Reply
                                </button> */}
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
            <div
              id={commentFormId}
              className="bg-white p-6 rounded-lg shadow-[0_0_21px_-2px_rgba(0,0,0,0.1)]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-4">
                {replyingTo ? "Leave a Reply" : "Leave a Comment"}
              </h3>

              {replyingTo && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Replying to a comment
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelReply}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Cancel Reply
                  </button>
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your comment here"
                            className="bg-white border-none shadow-[0_0px_15px_rgba(0,0,0,0.1)] rounded-lg min-h-24 text-[14px] placeholder:text-[13px] placeholder:text-[#9F9F9F]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={commentMutation.isPending}
                    className="bg-primary-dark hover:bg-primary-dark/90 text-white rounded-full px-6 py-2"
                  >
                    {commentMutation.isPending ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Sidebar - 1 column (1/3) */}
          <div className="lg:col-span-1">
            {/* Search */}
            <div className="mb-12">
              <h3 className="text-[19px] font-medium mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-dark text-white p-2 rounded-full hover:bg-primary-dark/90 transition-colors"
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
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to="/blog"
                      search={{ category: category.id }}
                      className="w-full flex items-center justify-between py-0.5 text-[12px] md:text-[17px] text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      <span>{category.name}</span>
                      <span className="bg-primary-dark text-white px-2 py-1 rounded text-xs font-semibold min-w-11">
                        {category._count?.blogs || 0}
                      </span>
                    </Link>
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
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
                >
                  <ArrowRightSVG />
                  <span>October 2023</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
                >
                  <ArrowRightSVG />
                  <span>November 2023</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
                >
                  <ArrowRightSVG />
                  <span>February 2024</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
                >
                  <ArrowRightSVG />
                  <span>July 2024</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2.5 py-0.5 text-[12px] md:text-[17px] rounded hover:bg-gray-100"
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
          </div>
        </div>
      </div>
    </div>
  );
}
