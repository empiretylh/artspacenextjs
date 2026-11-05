import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET SINGLE BLOG POST DETAIL
// ----------------------------------------------------------------------

export const getBlogPost = async ({
   slug,
}: {
   slug: string;
}): Promise<BlogPost> => {
   const res = await api.get(`/blog/posts/${slug}/`);
   return res.data;
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
