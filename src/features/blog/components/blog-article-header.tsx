"use client";

import React from "react";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import type { BlogPost } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
   Clock,
   Calendar,
   Globe,
   ChevronRight,
} from "lucide-react";
import { formatBlogDate, getBlogCoverImage, getEstimatedReadingTime } from "../utils";
import AppImage from "@/components/common/app-image";
import { getImage } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface BlogArticleHeaderProps {
   post: BlogPost;
}

export const BlogArticleHeader: React.FC<BlogArticleHeaderProps> = ({ post }) => {
   const locale = useLocale();
   const t = useTranslations("Blog");

   const coverUrl = getBlogCoverImage(post, "display");
   const readingTime = getEstimatedReadingTime(post);
   const formattedDate = formatBlogDate(post.published_at, locale);

   const authorName = post.author
      ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() || post.author.email
      : "Art Space Editorial";
   const authorAvatar = post.author?.profile?.profile_picture
      ? getImage(post.author.profile.profile_picture)
      : null;

   return (
      <header className="space-y-5 sm:space-y-6">
         {/* Breadcrumbs */}
         <nav className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto whitespace-nowrap pb-1">
            <Link to="/" className="hover:text-foreground transition-colors">
               {t("home")}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
            <Link to={paths.press.path} className="hover:text-foreground transition-colors font-medium">
               {t("blog")}
            </Link>
            {post.category && (
               <>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                  <Link
                     to={`${paths.press.path}?category=${post.category.slug}`}
                     className="hover:text-foreground transition-colors"
                  >
                     {post.category.name}
                  </Link>
               </>
            )}
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
               {post.title}
            </span>
         </nav>

         {/* Category & Language Header Badges */}
         <div className="flex flex-wrap items-center gap-2">
            {post.category && (
               <Badge variant="secondary" className="text-xs font-semibold py-0.5 px-2.5 rounded-full">
                  {post.category.name}
               </Badge>
            )}
            {post.language && (
               <Badge variant="outline" className="text-[11px] uppercase font-bold py-0.5 px-2 rounded-full">
                  <Globe className="w-3 h-3 mr-1 text-muted-foreground" />
                  {post.language === "my" ? "မြန်မာစာ" : "English"}
               </Badge>
            )}
         </div>

         {/* Title & Subtitle */}
         <div className="space-y-3">
            <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug text-foreground">
               {post.title}
            </h1>

            {post.excerpt && (
               <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                  {post.excerpt}
               </p>
            )}
         </div>

         {/* Author, Date, and Reading Time Row */}
         <div className="flex items-center justify-between gap-4 py-3.5 border-y border-border/60">
            <div className="flex items-center gap-3">
               <Avatar className="w-8 h-8 border border-border">
                  {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
                  <AvatarFallback className="text-[10px] font-semibold">
                     {authorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <p className="text-xs font-semibold text-foreground leading-none">
                     {authorName}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                     <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground/70" />
                        {formattedDate}
                     </span>
                     <span>•</span>
                     <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground/70" />
                        {readingTime} {t("minRead")}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Cover Image */}
         {coverUrl && (
            <figure className="space-y-2 pt-1">
               <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden bg-muted border border-border/70 shadow-xs">
                  <AppImage
                     src={coverUrl}
                     alt={post.cover_alt || post.title}
                     className="object-cover"
                     priority
                  />
               </div>
               {post.cover_alt && (
                  <figcaption className="text-center text-xs text-muted-foreground italic">
                     {post.cover_alt}
                  </figcaption>
               )}
            </figure>
         )}
      </header>
   );
};

export default BlogArticleHeader;
