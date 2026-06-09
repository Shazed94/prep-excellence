import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  Blog,
  useBlogCategories,
  useBlogs,
  useBlogsFilter,
} from "@/hooks/content-management";
import { useTableStore } from "@/store/usePagination";
import { Breadcrumb } from "@/components/breadcrumb";
import { Subtitle } from "@/components/SectionSubtitle";
import { format } from "date-fns";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { FilterDropdown } from "@/components/sat-courses/sat_courses";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_frontend/blog/")({
  component: RouteComponent,
});

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link to={`/blog/${blog.id}`} className="bg-white p-4 rounded-lg shadow-md">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[316px] rounded-[6px] mb-4"
      />
      <h5 className="f14 text-[#6C7179]! mb-3">
        {blog.publishedAt
          ? format(new Date(blog.publishedAt), "MMMM d, yyyy")
          : format(new Date(blog.createdAt), "MMMM d, yyyy")}
      </h5>
      <h4 className="h4 mb-3">{blog.title}</h4>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 rounded-full bg-white!">
          <AvatarImage
            src={blog.author.image}
            alt={blog.author.name}
            className="bg-white!"
          />
          <AvatarFallback className="rounded-lg bg-gray-400 text-white">
            ee
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-[#6C7179]!">{blog.author.name}</span>
      </div>
    </Link>
  );
}

function RouteComponent() {
  const baseUrl = "https://prepexcellence.trodad.com/";
  const pathname = useLocation().pathname;

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
      <div className="container mx-auto">
        <div className="px-4 md:px-0 py-2 md:py-8">
          <div className="flex items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
              <input
                type="text"
                placeholder="Search Courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-md border border-[#EBEBEB] bg-white f14 text-[#7B7B7B] placeholder-[#7B7B7B] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <FilterDropdown
                label="Featured"
                options={["Featured", "Newest", "Oldest", "Popular"]}
              />

              <FilterDropdown
                label="All Categories"
                options={[
                  "All Categories",
                  "SAT Math",
                  "SAT Reading",
                  "SAT Writing",
                ]}
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
      </div>
    </div>
  );
}
