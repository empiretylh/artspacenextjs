import type { Artwork, User } from "./index";

export type BoardVisibility = "PRIVATE" | "PUBLIC";

export interface Board {
   id: string;
   name: string;
   visibility: BoardVisibility;
   is_default: boolean;
   artworks_count?: number;
   cover_image?: string | null;
   created_at?: string;
   updated_at?: string;
   user?: User | number | string;
   artworks?: Artwork[];
}

export interface BoardItem {
   id?: string | number;
   artwork_id?: string;
   artwork: Artwork;
   created_at?: string;
}

export interface ArtworkSaveStatusBoard {
   id: string;
   name: string;
   visibility: BoardVisibility;
   is_default: boolean;
}

export interface ArtworkSaveStatus {
   saved: boolean;
   collections: ArtworkSaveStatusBoard[];
}

export interface CreateBoardInput {
   name: string;
   visibility?: BoardVisibility;
}

export interface UpdateBoardInput {
   name?: string;
   visibility?: BoardVisibility;
}

export interface SaveArtworkInput {
   collection_id?: string;
}
