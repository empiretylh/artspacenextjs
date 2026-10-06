import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { findMockBlogPost, MOCK_BLOG_POSTS } from "@/mocks/blog";

// ----------------------------------------------------------------------
// 1. GET SINGLE BLOG POST DETAIL (API CALL WITH DEV-ONLY MOCK FALLBACK)
// ----------------------------------------------------------------------

export const getBlogPost = async ({
   slug,
}: {
   slug: string;
}): Promise<BlogPost> => {
   const isDev = process.env.NODE_ENV === "development";

   try {
      const res = await api.get(`/blog/posts/${slug}/`);
      if (res?.data?.id) {
         return res.data;
      }
      if (isDev) {
         return findMockBlogPost(slug) || MOCK_BLOG_POSTS[0];
      }
      return res.data;
   } catch (error) {
      if (isDev) {
         const mock = findMockBlogPost(slug);
         if (mock) return mock;
         return MOCK_BLOG_POSTS[0];
      }
      throw error;
   }
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getBlogPostQueryOptions = ({ slug }: { slug: string }) => {
   return queryOptions({
      queryKey: queryKeys.blog.posts.detail(slug),
      queryFn: () => getBlogPost({ slug }),
      enabled: !!slug,
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseBlogPostOptions = {
   slug: string;
   queryConfig?: QueryConfig<typeof getBlogPostQueryOptions>;
};

export const useGetBlogPost = ({ slug, queryConfig }: UseBlogPostOptions) => {
   return useQuery({
      ...getBlogPostQueryOptions({ slug }),
      ...queryConfig,
   });
};
