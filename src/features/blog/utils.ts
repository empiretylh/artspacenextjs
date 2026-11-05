import type { BlogPost, MediaAsset } from "@/types";
import { getImage } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export const getBlogCoverImage = (
   post: BlogPost | null | undefined,
   variant: "thumbnail" | "card" | "display" | "zoom" = "card"
): string => {
   if (!post) return "/assets/logo.png";

   const asset = post.cover_asset;
   if (asset) {
      if (variant === "thumbnail" && asset.thumbnail_url) return asset.thumbnail_url;
      if (variant === "card" && asset.card_url) return asset.card_url;
      if (variant === "zoom" && asset.zoom_url) return asset.zoom_url;

      if (asset.variants && Array.isArray(asset.variants)) {
         const matchingVariant = asset.variants.find((v) => v.name === variant);
         if (matchingVariant?.url) return matchingVariant.url;
      }

      if (asset.display_url) return asset.display_url;
      if (asset.original_url) return asset.original_url;
   }

   // Fallback for cover_asset_id or generic asset path if any
   return "/assets/logo.png";
};

export const formatBlogDate = (
   dateString: string | null | undefined,
   locale: string = "en"
): string => {
   if (!dateString) return "";
   try {
      const parsed = parseISO(dateString);
      return format(parsed, "MMM d, yyyy");
   } catch {
      return dateString;
   }
};

export const cleanBlogHtml = (html: string | null | undefined): string => {
   if (!html) return "";
   return html
      // Replace non-breaking spaces (entity & unicode) with regular spaces so lines can wrap normally
      .replace(/(&amp;nbsp;|&nbsp;|&#160;|&#xA0;|\u00A0)/g, " ")
      // Clean empty paragraphs / headings created by WYSIWYG editors
      .replace(/<(h[1-6]|p)>\s*<\/\1>/gi, "")
      .trim();
};

export const cleanBlogText = (text: string | null | undefined): string => {
   if (!text) return "";
   return text
      .replace(/(&amp;nbsp;|&nbsp;|&#160;|&#xA0;|\u00A0)/g, " ")
      .trim();
};

export const getEstimatedReadingTime = (post: BlogPost | null | undefined): number => {
   if (post?.reading_time_minutes && post.reading_time_minutes > 0) {
      return post.reading_time_minutes;
   }
   if (!post?.body && !post?.excerpt) return 1;
   const cleanBody = cleanBlogHtml(post?.body);
   const cleanExcerpt = cleanBlogText(post?.excerpt);
   const text = `${cleanBody} ${cleanExcerpt}`;
   const words = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
   return Math.max(1, Math.ceil(words / 200));
};
