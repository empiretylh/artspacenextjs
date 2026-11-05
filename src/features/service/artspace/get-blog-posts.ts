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

// ----------------------------------------------------------------------
// 1. GET BLOG POSTS
// ----------------------------------------------------------------------

export interface GetBlogPostsParams extends BlogFilters {
   page?: number;
   limit?: number;
}

export const getBlogPosts = async (
   params: GetBlogPostsParams = {}
): Promise<ListApiResponse<BlogPost>> => {
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
   return res.data;
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
// 3. CUSTOM HOOK (STANDARD QUERY)
// ----------------------------------------------------------------------

type UseBlogPostsOptions = {
   params?: GetBlogPostsParams;
   queryConfig?: QueryConfig<typeof getBlogPostsQueryOptions>;
};

export const useGetBlogPosts = ({
   params = {},
   queryConfig,
}: UseBlogPostsOptions = {}) => {
   return useQuery({
      ...getBlogPostsQueryOptions(params),
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 4. INFINITE QUERY HOOK FOR INFINITE FEED / LOAD MORE
// ----------------------------------------------------------------------

export const useGetBlogPostsInfinite = ({
   params = {},
   limit = 12,
}: {
   params?: Omit<GetBlogPostsParams, "page" | "limit">;
   limit?: number;
} = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.blog.posts.infinite({ ...params, limit }),
      queryFn: ({ pageParam = 1 }) =>
         getBlogPosts({
            ...params,
            page: pageParam,
            limit,
         }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
         if (!lastPage || !lastPage.next) return undefined;
         return allPages.length + 1;
      },
   });
};
