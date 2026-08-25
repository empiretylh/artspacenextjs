"use client";

import React from "react";
import { useGetBlogPost } from "@/features/service/artspace/get-blog-post";
import { useGetRelatedBlogPosts } from "@/features/service/artspace/get-related-blog-posts";
import { BlogArticleHeader } from "../components/blog-article-header";
import { BlogArticleContent } from "../components/blog-article-content";
import { BlogRelatedArticles } from "../components/blog-related-articles";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

interface BlogDetailPageProps {
   slug: string;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug }) => {
   const t = useTranslations("Blog");

   const {
      data: post,
      isLoading,
      isError,
      refetch,
   } = useGetBlogPost({ slug });

   const { data: relatedPosts = [] } = useGetRelatedBlogPosts({
      slug,
      limit: 4,
   });

   if (isLoading) {
      return (
         <article className="w-full max-w-4xl mx-auto space-y-6 py-2">
            <div className="space-y-3">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-8 sm:h-10 w-full" />
               <Skeleton className="h-4 w-3/4" />
               <div className="flex items-center gap-3 py-3 border-y border-border/60">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                     <Skeleton className="h-3 w-32" />
                     <Skeleton className="h-2.5 w-40" />
                  </div>
               </div>
            </div>
            <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
            <div className="space-y-2.5 pt-4">
               <Skeleton className="h-3.5 w-full" />
               <Skeleton className="h-3.5 w-full" />
               <Skeleton className="h-3.5 w-5/6" />
               <Skeleton className="h-3.5 w-full" />
               <Skeleton className="h-3.5 w-2/3" />
            </div>
         </article>
      );
   }

   if (isError || !post) {
      return (
         <div className="w-full max-w-xl mx-auto py-16 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-muted/80 flex items-center justify-center mx-auto text-muted-foreground">
               <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="space-y-1">
               <h1 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
                  {t("articleNotFound")}
               </h1>
               <p className="text-xs sm:text-sm text-muted-foreground">
                  {t("articleNotFoundDesc")}
               </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
               <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-full text-xs">
                  {t("tryAgain")}
               </Button>
               <Link to={paths.press.path}>
                  <Button size="sm" className="rounded-full gap-1.5 text-xs">
                     <ArrowLeft className="w-3.5 h-3.5" />
                     {t("backToBlog")}
                  </Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <main className="w-full max-w-4xl mx-auto py-2 space-y-8 pb-10">
         {/* Article Header */}
         <BlogArticleHeader post={post} />

         {/* Article HTML Body Content */}
         <BlogArticleContent body={post.body} tags={post.tags} />

         {/* Related Articles Section */}
         {relatedPosts.length > 0 && (
            <BlogRelatedArticles articles={relatedPosts} />
         )}
      </main>
   );
};

export default BlogDetailPage;
