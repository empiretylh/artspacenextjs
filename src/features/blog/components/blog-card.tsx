"use client";

import React from "react";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import type { BlogPost } from "@/types";
import { cn, getImage } from "@/lib/utils";
import AppImage from "@/components/common/app-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Globe, ArrowRight } from "lucide-react";
import { formatBlogDate, getBlogCoverImage, getEstimatedReadingTime } from "../utils";
import { useLocale, useTranslations } from "next-intl";

interface BlogCardProps {
   post: BlogPost;
   className?: string;
   variant?: "standard" | "compact" | "horizontal";
}

export const BlogCard: React.FC<BlogCardProps> = ({
   post,
   className,
   variant = "standard",
}) => {
   const locale = useLocale();
   const t = useTranslations("Blog");
   const coverUrl = getBlogCoverImage(post, "card");
   const readingTime = getEstimatedReadingTime(post);
   const formattedDate = formatBlogDate(post.published_at, locale);
   const authorName = post.author
      ? `${post.author.first_name || ""} ${post.author.last_name || ""}`.trim() || post.author.email
      : null;
   const authorAvatar = post.author?.profile?.profile_picture
      ? getImage(post.author.profile.profile_picture)
      : null;

   if (variant === "compact") {
      return (
         <article
            className={cn(
               "group flex flex-col bg-card border border-border/70 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-xs transition-all duration-300",
               className
            )}
         >
            <Link
               to={paths.press.detail.getHref(post.slug)}
               className="relative w-full aspect-video overflow-hidden bg-muted block"
            >
               <AppImage
                  src={coverUrl}
                  alt={post.cover_alt || post.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
               />
               {post.category && (
                  <Badge
                     variant="secondary"
                     className="absolute top-2.5 left-2.5 text-[10px] font-semibold backdrop-blur-md bg-background/85 shadow-2xs border-0 py-0.5 px-2"
                  >
                     {post.category.name}
                  </Badge>
               )}
            </Link>

            <div className="flex flex-col flex-1 p-3.5 justify-between gap-2.5">
               <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                     <span className="inline-flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-muted-foreground/70" />
                        {readingTime} {t("minRead")}
                     </span>
                     <span>•</span>
                     <span>{formattedDate}</span>
                  </div>

                  <Link to={paths.press.detail.getHref(post.slug)} className="block">
                     <h3 className="font-display font-semibold text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                     </h3>
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                     {post.excerpt}
                  </p>
               </div>

               <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                     <Avatar className="w-4 h-4 shrink-0">
                        {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName || "Author"} />}
                        <AvatarFallback className="text-[8px]">
                           {(authorName || "A").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     <span className="text-[11px] font-medium text-foreground/80 truncate">
                        {authorName || "Art Space"}
                     </span>
                  </div>

                  <Link
                     to={paths.press.detail.getHref(post.slug)}
                     className="text-[11px] font-semibold text-primary group-hover:underline inline-flex items-center gap-0.5 shrink-0 whitespace-nowrap"
                  >
                     <span>{t("readArticle")}</span>
                     <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
               </div>
            </div>
         </article>
      );
   }

   return (
      <article
         className={cn(
            "group flex flex-col bg-card border border-border/70 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-xs transition-all duration-300",
            className
         )}
      >
         <Link
            to={paths.press.detail.getHref(post.slug)}
            className="relative w-full aspect-video overflow-hidden bg-muted block"
         >
            <AppImage
               src={coverUrl}
               alt={post.cover_alt || post.title}
               className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
               {post.category && (
                  <Badge
                     variant="secondary"
                     className="text-[11px] font-semibold backdrop-blur-md bg-background/85 shadow-2xs border-0 py-0.5 px-2"
                  >
                     {post.category.name}
                  </Badge>
               )}
            </div>
            {post.language && (
               <Badge
                  variant="outline"
                  className="absolute top-2.5 right-2.5 text-[9px] uppercase font-bold backdrop-blur-md bg-background/85 px-1.5 py-0.5 border-border/60"
               >
                  <Globe className="w-2.5 h-2.5 mr-0.5" />
                  {post.language}
               </Badge>
            )}
         </Link>

         <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between gap-3">
            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium">
                     <Clock className="w-3 h-3 text-muted-foreground/70" />
                     {readingTime} {t("minRead")}
                  </span>
                  <span>•</span>
                  <span>{formattedDate}</span>
               </div>

               <Link to={paths.press.detail.getHref(post.slug)} className="block group">
                  <h3 className="font-display font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                     {post.title}
                  </h3>
               </Link>

               <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
               </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs text-muted-foreground gap-2">
               <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Avatar className="w-5 h-5 shrink-0">
                     {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName || "Author"} />}
                     <AvatarFallback className="text-[9px] font-semibold">
                        {(authorName || "A").slice(0, 2).toUpperCase()}
                     </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-medium text-foreground/80 truncate">
                     {authorName || "Art Space"}
                  </span>
               </div>

               <Link
                  to={paths.press.detail.getHref(post.slug)}
                  className="text-xs font-semibold text-primary group-hover:underline inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
               >
                  <span>{t("readArticle")}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
               </Link>
            </div>
         </div>
      </article>
   );
};

export default BlogCard;
