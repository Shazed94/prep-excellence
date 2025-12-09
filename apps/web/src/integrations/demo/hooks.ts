import { useQuery } from "@tanstack/react-query";

export interface DemoPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PaginatedResponse {
  data: DemoPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseDemoPostsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "id" | "title" | "userId";
  orderBy?: "asc" | "desc";
}

/**
 * Hook to fetch paginated demo posts with search and sorting
 * Simulates backend pagination using JSONPlaceholder API
 */
export function useDemoPosts({
  page,
  limit,
  search,
  sortBy = "id",
  orderBy = "desc",
}: UseDemoPostsParams) {
  return useQuery<PaginatedResponse>({
    queryKey: ["demo-posts", page, limit, search, sortBy, orderBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        _page: page.toString(),
        _limit: limit.toString(),
        sortBy,
        orderBy,
      });

      if (search && search.trim() !== "") {
        params.append("_search", search);
      }

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch demo posts");
      }

      let posts: DemoPost[] = await response.json();

      // Apply search filter on client side (simulating backend search)
      return {
        data: posts,
        pagination: {
          page,
          limit,
          total: posts.length,
          totalPages: Math.ceil(posts.length / limit),
        },
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
}


