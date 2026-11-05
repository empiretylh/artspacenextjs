import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { BlogCategory, BlogTag } from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET PUBLIC BLOG CATEGORIES
// ----------------------------------------------------------------------

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
   const res = await api.get(`/blog/categories/`);
   if (res?.data && Array.isArray(res.data.results)) {
      return res.data.results;
   }
   return Array.isArray(res?.data) ? res.data : [];
};

export const getBlogCategoriesQueryOptions = () => {
   return queryOptions({
      queryKey: queryKeys.blog.categories.list(),
      queryFn: () => getBlogCategories(),
   });
};

export const useGetBlogCategories = ({
   queryConfig,
}: {
   queryConfig?: QueryConfig<typeof getBlogCategoriesQueryOptions>;
} = {}) => {
   return useQuery({
      ...getBlogCategoriesQueryOptions(),
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 2. GET PUBLIC BLOG TAGS
// ----------------------------------------------------------------------

export const getBlogTags = async (): Promise<BlogTag[]> => {
   const res = await api.get(`/blog/tags/`);
   if (res?.data && Array.isArray(res.data.results)) {
      return res.data.results;
   }
   return Array.isArray(res?.data) ? res.data : [];
};

export const getBlogTagsQueryOptions = () => {
   return queryOptions({
      queryKey: queryKeys.blog.tags.list(),
      queryFn: () => getBlogTags(),
   });
};

export const useGetBlogTags = ({
   queryConfig,
}: {
   queryConfig?: QueryConfig<typeof getBlogTagsQueryOptions>;
} = {}) => {
   return useQuery({
      ...getBlogTagsQueryOptions(),
      ...queryConfig,
   });
};
