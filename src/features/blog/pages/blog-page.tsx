"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/routing";
import { useGetBlogPostsInfinite, useGetBlogPosts } from "@/features/service/artspace/get-blog-posts";
import { useGetBlogCategories, useGetBlogTags } from "@/features/service/artspace/get-blog-taxonomies";
import { BlogCard } from "../components/blog-card";
import { FeaturedBlogHero } from "../components/featured-blog-hero";
import { BlogFilterBar } from "../components/blog-filter-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookOpen, AlertCircle } from "lucide-react";
import type { BlogLanguage, BlogPost } from "@/types";
import { useTranslations } from "next-intl";

export const BlogPage = () => {
   const t = useTranslations("Blog");
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   // URL query parameters
   const categoryParam = searchParams.get("category") || undefined;
   const tagParam = searchParams.get("tag") || undefined;
   const languageParam = (searchParams.get("language") as BlogLanguage) || undefined;
   const searchParam = searchParams.get("search") || undefined;
   const orderingParam = searchParams.get("ordering") || "-published_at";

   // Taxonomies
   const { data: categories = [], isLoading: _isLoadingCategories } = useGetBlogCategories();
   const { data: tags = [] } = useGetBlogTags();

   // Featured Post (displayed at top when no search or category filters are applied)
   const isDefaultView = !categoryParam && !tagParam && !searchParam;
   const { data: featuredData } = useGetBlogPosts({
      params: { featured: true, limit: 1 },
      queryConfig: { enabled: isDefaultView },
   });
   const featuredPost = featuredData?.results?.[0];

   // Main Posts Feed (Infinite Query)
   const {
      data,
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
      isError,
      refetch,
   } = useGetBlogPostsInfinite({
      params: {
         category: categoryParam,
         tag: tagParam,
         language: languageParam,
         search: searchParam,
         ordering: orderingParam,
      },
      limit: 12,
   });

   // Flatten infinite query pages
   const allPosts = useMemo(() => {
      if (!data?.pages) return [];
      const posts: BlogPost[] = [];
      data.pages.forEach((page) => {
         if (Array.isArray(page.results)) {
            page.results.forEach((post) => {
               // Avoid duplicating featured post in the list if hero is already displaying it
               if (isDefaultView && featuredPost && String(post.id) === String(featuredPost.id)) {
                  return;
               }
               posts.push(post);
            });
         }
      });
      return posts;
   }, [data, isDefaultView, featuredPost]);

   // Helper to update URL search params
   const updateQueryParams = (updates: Record<string, string | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(updates).forEach(([key, value]) => {
         if (value === undefined || value === "") {
            current.delete(key);
         } else {
            current.set(key, value);
         }
      });
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
   };

   return (
      <div className="grow transition-all duration-300 w-full space-y-6">
         {/* Page Header matching Events & Artworks pattern */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
               <h1 className="text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground">
                  {t("title")}
               </h1>
               <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {t("pageSubtitle")}
               </p>
            </div>
         </div>

         {/* Filter Bar */}
         <BlogFilterBar
            categories={categories}
            tags={tags}
            selectedCategory={categoryParam}
            selectedTag={tagParam}
            selectedLanguage={languageParam}
            selectedOrdering={orderingParam}
            searchQuery={searchParam || ""}
            onCategoryChange={(slug) => updateQueryParams({ category: slug })}
            onTagChange={(slug) => updateQueryParams({ tag: slug })}
            onLanguageChange={(lang) => updateQueryParams({ language: lang })}
            onOrderingChange={(ordering) => updateQueryParams({ ordering })}
            onSearchChange={(search) => updateQueryParams({ search: search || undefined })}
            onClearFilters={() => router.push(pathname)}
         />

         {/* Featured Hero Banner (Only on clean/default browse view) */}
         {isDefaultView && featuredPost && (
            <FeaturedBlogHero post={featuredPost} />
         )}

         {/* Posts Grid / Loading / Empty States */}
         {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div
                     key={i}
                     className="bg-card border border-border/70 rounded-xl overflow-hidden space-y-3 p-3"
                  >
                     <Skeleton className="w-full aspect-video rounded-lg" />
                     <div className="space-y-2">
                        <Skeleton className="h-3 w-1/4" />
                        <Skeleton className="h-5 w-5/6" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                     </div>
                     <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                     </div>
                  </div>
               ))}
            </div>
         ) : isError ? (
            <div className="py-16 text-center space-y-4 bg-card border border-border/70 rounded-2xl p-8">
               <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
               <h3 className="text-lg font-bold text-foreground">
                  {t("errorLoadingPosts")}
               </h3>
               <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {t("errorLoadingPostsDesc")}
               </p>
               <Button onClick={() => refetch()} variant="outline" className="rounded-full">
                  {t("tryAgain")}
               </Button>
            </div>
         ) : allPosts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-card/60 border border-border/70 rounded-2xl p-8">
               <BookOpen className="w-12 h-12 text-muted-foreground/60 mx-auto" />
               <h3 className="font-display text-xl font-bold text-foreground">
                  {t("noPostsFound")}
               </h3>
               <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {t("noPostsFoundDesc")}
               </p>
               {(categoryParam || tagParam || searchParam || languageParam) && (
                  <Button
                     onClick={() => router.push(pathname)}
                     variant="outline"
                     className="rounded-full"
                  >
                     {t("clearFilters")}
                  </Button>
               )}
            </div>
         ) : (
            <div className="space-y-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allPosts.map((post) => (
                     <BlogCard key={post.id} post={post} />
                  ))}
               </div>

               {/* Load More Button */}
               {hasNextPage && (
                  <div className="flex justify-center pt-4">
                     <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        size="default"
                        variant="outline"
                        className="rounded-full px-6 font-semibold shadow-xs hover:bg-muted"
                     >
                        {isFetchingNextPage ? t("loadingMore") : t("loadMoreArticles")}
                     </Button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default BlogPage;
