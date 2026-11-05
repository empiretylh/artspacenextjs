import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET RELATED BLOG POSTS
// ----------------------------------------------------------------------

export const getRelatedBlogPosts = async ({
   slug,
   limit = 4,
}: {
   slug: string;
   limit?: number;
}): Promise<BlogPost[]> => {
   try {
      const res = await api.get(`/blog/posts/${slug}/related/`, {
         params: { limit },
      });

      if (res?.data && Array.isArray(res.data.results)) {
         return res.data.results;
      }
      if (Array.isArray(res?.data)) {
         return res.data;
      }
      return [];
   } catch {
      return [];
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
