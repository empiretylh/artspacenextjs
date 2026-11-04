/**
 * MAS Store entities, mirroring /api/v1/store/.
 *
 * A Product is one artwork printed on one product type, so "Mug - Rice Fields"
 * and "T-Shirt - Rice Fields" are two products over the same Artwork.
 */

export interface StorePreviewArea {
   x: number;
   y: number;
   w: number;
   h: number;
   rotation?: number;
}

/**
 * Renderer contract for the layered product preview. A product's own config is
 * merged over its product type defaults key by key, with print_area merging one
 * level deeper, so the merged object on a Product is the only one to trust.
 */
export interface StorePreviewConfig {
   print_area?: StorePreviewArea;
   blend_mode?: "normal" | "multiply" | "screen" | "luminosity" | string;
   mask_asset?: string | null;
   angles?: string[];
   default_colorways?: { name: string; hex: string; asset?: string | null }[];
}

export interface ProductType {
   id: string;
   name: string;
   slug: string;
   category: "APPAREL" | "MUG" | "TOTE" | "BOOK" | "OTHER";
   base_price: string;
   currency: string;
   default_royalty_percent: string;
   preview_config: StorePreviewConfig;
   is_colorable: boolean;
   is_active: boolean;
   sort_order: number;
}

export interface ProductVariant {
   id: string;
   color_name: string;
   color_hex: string;
   size: string;
   sku: string;
   price_modifier: string;
   stock: number | null;
   mockup_asset: string | null;
   mockup_url: string | null;
   price: string;
   is_active: boolean;
   sort_order: number;
}

export interface Product {
   id: string;
   title: string;
   slug: string;
   description: string;
   product_type: ProductType;
   artwork: string;
   artwork_title: string;
   artwork_image_url: string | null;
   artist: number | null;
   artist_name: string;
   hero_asset: string | null;
   hero_url: string | null;
   /** Resolved selling price: price_override when set, else the type base price. */
   price: string;
   /** Raw override, so the admin form can round-trip a blank back to "inherit". */
   price_override: string | null;
   currency: string;
   royalty_percent: string | null;
   /** Already merged over the product type defaults. Render from this. */
   preview_config: StorePreviewConfig;
   is_colorable: boolean;
   variants: ProductVariant[];
   is_published: boolean;
   created_at: string;
   updated_at: string;
}

/**
 * Merch line frozen at purchase time. Descriptive fields are snapshots, so an
 * admin editing a price or title later never rewrites an existing order.
 */
export interface StoreOrderLine {
   id: number;
   product: string | null;
   variant: string | null;
   product_title: string;
   product_type_name: string;
   variant_sku: string;
   color_name: string;
   color_hex: string;
   size: string;
   unit_price: string;
   currency_code: string;
   quantity: number;
   line_total: string;
   artwork_id_snapshot: string | null;
   artwork_title: string;
   artist_name: string;
   thumbnail_key: string;
   thumbnail_url: string | null;
   royalty_percent: string;
   royalty_amount: string;
}

/**
 * Write payloads for the admin screens. `slug` is absent on purpose: both
 * models derive it from their name/title in `save()`, so a hand-typed slug can
 * never collide with the artwork x product type pairing the store is keyed on.
 */
export interface ProductTypeInput {
   name: string;
   category: ProductType["category"];
   base_price: string;
   /** Currency primary key, i.e. the ISO code such as "MMK". */
   currency: string;
   default_royalty_percent: string;
   preview_config: StorePreviewConfig;
   is_colorable: boolean;
   is_active: boolean;
   sort_order: number;
}

export interface ProductVariantInput {
   /** Present only when the row already exists on the server. */
   id?: string;
   color_name: string;
   color_hex: string;
   size: string;
   sku: string;
   price_modifier: string;
   stock: number | null;
   is_active: boolean;
   sort_order: number;
}

export interface ProductInput {
   title: string;
   description: string;
   /** Product type primary key (UUID). */
   product_type: string;
   /** Artwork primary key (UUID) — the manual phase-1 match. */
   artwork: string;
   price_override: string | null;
   royalty_percent: string | null;
   preview_config: StorePreviewConfig;
   hero_asset: string | null;
   is_published: boolean;
   variants: ProductVariantInput[];
}
