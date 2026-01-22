export * from "./post";

export interface User {
   id: number;
   email: string;
   first_name: string;
   last_name: string;
   user_type: "BUYER" | "COLLECTOR" | "ARTIST" | "GALLERY";
   profile: Profile;
}

export interface FeaturedPhoto {
   id: number;
   image: string;
   description: string;
}

export interface Style {
   id: number;
   image: string;
   name: string;
   slug: string;
}

export interface Profile {
   id: number;
   bio: string;
   about: string;
   profile_picture: string | null;
   cover_photo: string | null;
   website: string;
   user: number;
   features_photos: FeaturedPhoto[];
   is_following: boolean;
   isBlocked: boolean;
}

export interface Category {
   id: string;
   name: string;
   image: string;
   slug: string;
}

export interface Genre {
   id: string;
   image: string;
   name: string;
   slug: string;
}

export interface Order {
   id: string;
   buyerId: number;
   buyer: User;
   total_price: number;
   shipping_address: string;
   stripe_session_id?: string | null;
   status: "PENDING" | "COMPLETED" | "FAILED" | "SHIPPED";
   paid_at?: Date | null;
   created_at: Date;
   updated_at: Date;
   items: OrderItem[];
}

export interface OrderItem {
   id: number;
   orderId: string;
   artworkId: string;
   price_at_purchase: number;
   quantity: number;
   artwork: Artwork;
   order: Order;
}

export interface Artwork {
   id: string;
   artist_name: string;
   category_name: string;
   category: number;
   image: string;
   genre: number;
   styles: number[];
   title: string;
   description: string;
   original_width: number;
   original_height: number;
   hide_price: boolean;
   visibility: "PRIVATE" | "PUBLIC";
   price: string;
   medium: string;
   dimensions: string;
   year: number;
   status: "AVAILABLE";
   search_keywords?: string[];
   current_owner_display: User;
   current_owner?: number;
   current_owner_name?: string | null;
   created_at: string;
   updated_at: string;
   artist_profile: User;
   artwork_styles: Style[];
   is_liked: boolean;
}

export interface Artist {
   id: number;
   username: string;
   first_name: string;
   last_name: string;
   avatar?: string;
   num_artworks: number;
   popular_artworks: Artwork[];
   profile: Profile;
}

export interface Collector {
   id: number;
   name: string;
   avatar?: string;
   num_artworks: number;
   popular_artworks: Artwork[];
}

export interface Gallery {
   id: number;
   name: string;
   avatar?: string;
   num_artworks: number;
   popular_artworks: Artwork[];
}

export interface EventImage {
   id: number;
   url: string;
   artwork?: Artwork | null;
   caption: string;
   order: number;
}

export interface Event {
   id: string;
   title: string;
   slug: string;
   cover_photo: string;
   event_image: string | null;
   event_type: "GROUP";
   about: string;
   artists: Artist[];
   artworks: Artwork[];
   images: EventImage[];
   start_date: string;
   end_date: string;
   show_popup: boolean;
   popup_start: string;
   popup_end: string;
   is_published: boolean;
   event_logo: string | null;
   is_interested: boolean;
   interest_count: number;
}
