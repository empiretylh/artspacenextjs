import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { MOCK_BLOG_POSTS } from "@/mocks/blog";

// ----------------------------------------------------------------------
// 1. GET RELATED BLOG POSTS (API CALL WITH DEV-ONLY MOCK FALLBACK)
// ----------------------------------------------------------------------

export const getRelatedBlogPosts = async ({
   slug,
   limit = 4,
}: {
   slug: string;
   limit?: number;
}): Promise<BlogPost[]> => {
   const isDev = process.env.NODE_ENV === "development";

   try {
      const res = await api.get(`/blog/posts/${slug}/related/`, {
         params: { limit },
      });

      if (res?.data && Array.isArray(res.data.results) && res.data.results.length > 0) {
         return res.data.results;
      }
      if (Array.isArray(res?.data) && res.data.length > 0) {
         return res.data;
      }
      if (isDev) {
         return MOCK_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
      }
      return Array.isArray(res?.data) ? res.data : (res?.data?.results || []);
   } catch (error) {
      if (isDev) {
         return MOCK_BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
      }
      throw error;
   }
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getRelatedBlogPostsQueryOptions = ({
   slug,
   limit = 4,
}: {
   slug: string;
   limit?: number;
}) => {
   return queryOptions({
      queryKey: queryKeys.blog.posts.related(slug, limit),
      queryFn: () => getRelatedBlogPosts({ slug, limit }),
      enabled: !!slug,
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseRelatedBlogPostsOptions = {
   slug: string;
   limit?: number;
   queryConfig?: QueryConfig<typeof getRelatedBlogPostsQueryOptions>;
};

export const useGetRelatedBlogPosts = ({
   slug,
   limit = 4,
   queryConfig,
}: UseRelatedBlogPostsOptions) => {
   return useQuery({
      ...getRelatedBlogPostsQueryOptions({ slug, limit }),
      ...queryConfig,
   });
};
