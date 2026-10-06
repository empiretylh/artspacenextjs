"use client";

import React from "react";
import type { BlogPost } from "@/types";
import { BlogCard } from "./blog-card";
import { useTranslations } from "next-intl";

interface BlogRelatedArticlesProps {
   articles: BlogPost[];
}

export const BlogRelatedArticles: React.FC<BlogRelatedArticlesProps> = ({
   articles,
}) => {
   const t = useTranslations("Blog");

   if (!articles || articles.length === 0) return null;

   return (
      <section className="pt-10 sm:pt-12 border-t border-border/70 space-y-5">
         <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight text-foreground">
               {t("relatedArticles")}
            </h2>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {articles.map((article) => (
               <BlogCard key={article.id} post={article} variant="compact" />
            ))}
         </div>
      </section>
   );
};

export default BlogRelatedArticles;
