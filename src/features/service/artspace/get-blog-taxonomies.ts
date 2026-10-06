import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { BlogCategory, BlogTag } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { MOCK_BLOG_CATEGORIES, MOCK_BLOG_TAGS } from "@/mocks/blog";

// ----------------------------------------------------------------------
// 1. GET PUBLIC BLOG CATEGORIES (WITH DEV-ONLY MOCK FALLBACK)
// ----------------------------------------------------------------------

export const getBlogCategories = async (): Promise<BlogCategory[]> => {
   const isDev = process.env.NODE_ENV === "development";

   try {
      const res = await api.get(`/blog/categories/`);
      if (res?.data && Array.isArray(res.data.results) && res.data.results.length > 0) {
         return res.data.results;
      }
      if (Array.isArray(res?.data) && res.data.length > 0) {
         return res.data;
      }
      if (isDev) {
         return MOCK_BLOG_CATEGORIES;
      }
      return Array.isArray(res?.data) ? res.data : (res?.data?.results || []);
   } catch (error) {
      if (isDev) {
         return MOCK_BLOG_CATEGORIES;
      }
      throw error;
   }
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
// 2. GET PUBLIC BLOG TAGS (WITH DEV-ONLY MOCK FALLBACK)
// ----------------------------------------------------------------------

export const getBlogTags = async (): Promise<BlogTag[]> => {
   const isDev = process.env.NODE_ENV === "development";

   try {
      const res = await api.get(`/blog/tags/`);
      if (res?.data && Array.isArray(res.data.results) && res.data.results.length > 0) {
         return res.data.results;
      }
      if (Array.isArray(res?.data) && res.data.length > 0) {
         return res.data;
      }
      if (isDev) {
         return MOCK_BLOG_TAGS;
      }
      return Array.isArray(res?.data) ? res.data : (res?.data?.results || []);
   } catch (error) {
      if (isDev) {
         return MOCK_BLOG_TAGS;
      }
      throw error;
   }
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
