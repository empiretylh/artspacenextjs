"use client";

import React from "react";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import type { BlogPost } from "@/types";
import AppImage from "@/components/common/app-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { formatBlogDate, getBlogCoverImage, getEstimatedReadingTime } from "../utils";
import { getImage } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface FeaturedBlogHeroProps {
   post: BlogPost;
}

export const FeaturedBlogHero: React.FC<FeaturedBlogHeroProps> = ({ post }) => {
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
      <section className="relative w-full rounded-2xl overflow-hidden border border-border/70 bg-gradient-to-b from-card to-muted/20 shadow-xs mb-6 sm:mb-8">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
            {/* Image Column */}
            <Link
               to={paths.blog.detail.getHref(post.slug)}
               className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[220px] sm:min-h-[280px] lg:min-h-[340px] overflow-hidden bg-muted group block"
            >
               <AppImage
                  src={coverUrl}
                  alt={post.cover_alt || post.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
               <Badge className="absolute top-3.5 left-3.5 bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("featuredStory")}
               </Badge>
            </Link>

            {/* Content Column */}
            <div className="lg:col-span-5 p-5 sm:p-6 lg:p-7 flex flex-col justify-between gap-4 sm:gap-5 bg-card/90">
               <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                     {post.category && (
                        <Badge variant="outline" className="font-semibold text-[11px] py-0.5 px-2">
                           {post.category.name}
                        </Badge>
                     )}
                     <span>•</span>
                     <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground/80" />
                        {readingTime} {t("minRead")}
                     </span>
                     <span>•</span>
                     <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-muted-foreground/80" />
                        {formattedDate}
                     </span>
                  </div>

                  <Link to={paths.blog.detail.getHref(post.slug)} className="group block">
                     <h2 className="font-display font-semibold text-lg sm:text-xl lg:text-2xl tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-3">
                        {post.title}
                     </h2>
                  </Link>

                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                     {post.excerpt}
                  </p>
               </div>

               <div className="space-y-3.5 pt-3.5 border-t border-border/50">
                  <div className="flex items-center gap-2.5">
                     <Avatar className="w-7 h-7 border border-border">
                        {authorAvatar && <AvatarImage src={authorAvatar} alt={authorName} />}
                        <AvatarFallback className="text-[10px] font-semibold">
                           {authorName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-xs font-semibold text-foreground leading-none">
                           {authorName}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                           {t("authorEditorial")}
                        </p>
                     </div>
                  </div>

                  <Link to={paths.blog.detail.getHref(post.slug)} className="block">
                     <Button size="sm" className="w-full sm:w-auto rounded-full font-semibold px-4 text-xs gap-1.5 group h-8.5">
                        <span>{t("readStory")}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </section>
   );
};

export default FeaturedBlogHero;
