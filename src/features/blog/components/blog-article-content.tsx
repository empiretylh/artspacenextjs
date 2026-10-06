"use client";

import React from "react";
import type { BlogTag } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { useTranslations } from "next-intl";

interface BlogArticleContentProps {
   body?: string;
   tags?: BlogTag[];
}

export const BlogArticleContent: React.FC<BlogArticleContentProps> = ({
   body,
   tags = [],
}) => {
   const t = useTranslations("Blog");

   return (
      <div className="space-y-8 max-w-4xl mx-auto">
         {/* Article HTML Content */}
         {body ? (
            <div
               className="blog-prose prose dark:prose-invert max-w-none 
                  text-foreground/90 text-sm sm:text-base leading-relaxed 
                  [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:font-display [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:tracking-tight [&>h2]:text-foreground
                  [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-semibold [&>h3]:font-display [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:text-foreground
                  [&>h4]:text-base sm:[&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-4 [&>h4]:mb-2 [&>h4]:text-foreground
                  [&>p]:mb-5 [&>p]:leading-relaxed
                  [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ul>li]:mb-1.5
                  [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>ol>li]:mb-1.5
                  [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:py-1.5 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-foreground/80 [&>blockquote]:bg-muted/30 [&>blockquote]:rounded-r-lg
                  [&>pre]:bg-muted/80 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:my-6 [&>pre]:border [&>pre]:border-border/60 [&>pre]:text-xs sm:[&>pre]:text-sm
                  [&>code]:bg-muted [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:text-xs [&>code]:font-mono
                  [&>table]:w-full [&>table]:my-6 [&>table]:border-collapse [&>table]:border [&>table]:border-border
                  [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:p-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-xs sm:[&_th]:text-sm
                  [&_td]:border [&_td]:border-border [&_td]:p-2.5 [&_td]:text-xs sm:[&_td]:text-sm
                  [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto [&_img]:border [&_img]:border-border/60 [&_img]:shadow-xs
                  [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_a]:font-medium
                  [&>hr]:my-8 [&>hr]:border-border"
               dangerouslySetInnerHTML={{ __html: body }}
            />
         ) : (
            <div className="py-12 text-center text-muted-foreground">
               <p>{t("noContentAvailable")}</p>
            </div>
         )}

         {/* Tags Section */}
         {tags.length > 0 && (
            <div className="pt-6 border-t border-border/60 space-y-2.5">
               <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("articleTags")}:
               </span>
               <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                     <Link
                        key={tag.id}
                        to={`${paths.press.path}?tag=${tag.slug}`}
                        className="group"
                     >
                        <Badge
                           variant="secondary"
                           className="text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer py-0.5 px-2.5 rounded-full"
                        >
                           #{tag.name}
                        </Badge>
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default BlogArticleContent;
