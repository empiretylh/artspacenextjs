import type { User } from "./index";

export type BlogLanguage = "en" | "my";

export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface MediaVariant {
   name: "thumbnail" | "card" | "display" | "zoom" | string;
   url: string;
   width?: number;
   height?: number;
   byte_size?: number;
}

export interface MediaAsset {
   id: string;
   original_name?: string;
   content_type?: string;
   status?: "UPLOADED" | "PROCESSING" | "READY" | "FAILED";
   original_url?: string;
   display_url?: string;
   variants?: MediaVariant[] | Record<string, { url: string; width?: number; height?: number }>;
   thumbnail_url?: string;
   card_url?: string;
   zoom_url?: string;
}

export interface BlogCategory {
   id: number | string;
   name: string;
   slug: string;
   description?: string;
   post_count?: number;
}

export interface BlogTag {
   id: number | string;
   name: string;
   slug: string;
   description?: string;
   post_count?: number;
}

export interface BlogTranslationLink {
   id: number | string;
   slug: string;
   language: BlogLanguage;
   title: string;
}

export interface BlogPost {
   id: number | string;
   title: string;
   slug: string;
   excerpt: string;
   body?: string;
   language: BlogLanguage;
   translation_group: string | null;
   author?: User | null;
   author_id?: number | null;
   category?: BlogCategory | null;
   category_id?: number | null;
   tags?: BlogTag[];
   tag_ids?: number[];
   cover_asset?: MediaAsset | null;
   cover_asset_id?: string | null;
   cover_alt?: string;
   seo_title?: string | null;
   seo_description?: string | null;
   is_featured?: boolean;
   status: BlogStatus;
   published_at: string | null;
   reading_time_minutes?: number;
   translations?: BlogTranslationLink[];
   created_at: string;
   updated_at: string;
}

// Backward compatibility alias
export type Post = BlogPost;

export interface BlogFilters {
   language?: BlogLanguage;
   category?: string; // slug
   tag?: string; // slug
   featured?: boolean | string;
   search?: string;
   ordering?: "published_at" | "-published_at" | "title" | "-title" | "created_at" | "-created_at" | string;
   page?: number;
   limit?: number;
}
