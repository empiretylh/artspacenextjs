import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   BlogPost,
   BlogFilters,
   ListApiResponse,
} from "@/types";
import { queryKeys } from "@/config/query-keys";
import { filterMockBlogPosts } from "@/mocks/blog";

// ----------------------------------------------------------------------
// 1. GET BLOG POSTS (API CALL WITH DEV-ONLY MOCK FALLBACK)
// ----------------------------------------------------------------------

export interface GetBlogPostsParams extends BlogFilters {
   page?: number;
   limit?: number;
}

export const getBlogPosts = async (
   params: GetBlogPostsParams = {}
): Promise<ListApiResponse<BlogPost>> => {
   const isDev = process.env.NODE_ENV === "development";

   try {
      const queryParams: Record<string, any> = {};

      if (params.page !== undefined) queryParams.page = params.page;
      if (params.limit !== undefined) queryParams.limit = params.limit;
      if (params.language) queryParams.language = params.language;
      if (params.category) queryParams.category = params.category;
      if (params.tag) queryParams.tag = params.tag;
      if (params.featured !== undefined) queryParams.featured = params.featured;
      if (params.search) queryParams.search = params.search;
      if (params.ordering) queryParams.ordering = params.ordering;

      const res = await api.get(`/blog/posts/`, { params: queryParams });
      if (res?.data?.results && res.data.results.length > 0) {
         return res.data;
      }
      if (isDev) {
         return filterMockBlogPosts(params);
      }
      return res.data;
   } catch (error) {
      if (isDev) {
         return filterMockBlogPosts(params);
      }
      throw error;
   }
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getBlogPostsQueryOptions = (params: GetBlogPostsParams = {}) => {
   return queryOptions({
      queryKey: queryKeys.blog.posts.list(params),
      queryFn: () => getBlogPosts(params),
   });
};

// ----------------------------------------------------------------------
// 3. HOOK: useGetBlogPosts
// ----------------------------------------------------------------------

type UseGetBlogPostsOptions = {
   params?: GetBlogPostsParams;
   queryConfig?: QueryConfig<typeof getBlogPostsQueryOptions>;
};

export const useGetBlogPosts = ({
   params = {},
   queryConfig,
}: UseGetBlogPostsOptions = {}) => {
   return useQuery({
      ...getBlogPostsQueryOptions(params),
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 4. HOOK: useGetBlogPostsInfinite
// ----------------------------------------------------------------------

type UseGetBlogPostsInfiniteOptions = {
   params?: Omit<GetBlogPostsParams, "page">;
   limit?: number;
};

export const useGetBlogPostsInfinite = ({
   params = {},
   limit = 12,
}: UseGetBlogPostsInfiniteOptions = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.blog.posts.infinite({ ...params, limit }),
      queryFn: ({ pageParam = 1 }) =>
         getBlogPosts({ ...params, page: pageParam as number, limit }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
         if (lastPage?.next && lastPage?.current_page && lastPage?.total_pages) {
            if (lastPage.current_page < lastPage.total_pages) {
               return lastPage.current_page + 1;
            }
         }
         return undefined;
      },
   });
};
