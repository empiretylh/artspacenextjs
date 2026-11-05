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

// Rich-text editors save ordinary word spacing as &nbsp;, which the browser
// treats as unbreakable — long paragraphs then render as one line that runs
// past the article column instead of wrapping.
export const normalizeBlogBodyHtml = (html?: string | null): string => {
   if (!html) return "";
   return html.replace(/&nbsp;|&#160;|\u00a0/gi, " ");
};

export const getEstimatedReadingTime = (post: BlogPost | null | undefined): number => {
   if (post?.reading_time_minutes && post.reading_time_minutes > 0) {
      return post.reading_time_minutes;
   }
   if (!post?.body && !post?.excerpt) return 1;
   const text = normalizeBlogBodyHtml(post?.body) + " " + (post?.excerpt || "");
   const words = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
   return Math.max(1, Math.ceil(words / 200));
};
