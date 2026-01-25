import type { ColumnFiltersState, SortingState } from "@/types";

interface QueryKeys {
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}

/**
 * Normalize params so React Query does not treat
 * equivalent objects as different cache keys.
 */
const normalizeParams = (params?: QueryKeys) => {
   if (!params) return undefined;

   return {
      filters: params.filters?.map((f) => ({
         id: f.id,
         value: f.value,
      })),
      sorts: params.sorts?.map((s) => ({
         id: s.id,
         desc: s.desc,
      })),
      search: params.search,
      page: params.page,
      limit: params.limit,
   };
};

export const queryKeys = {
   genre: {
      all: ["genres"] as const,

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["genres", "list", normalizeParams(params)] as const,
   },
   category: {
      all: ["categories"] as const,

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["categories", "list", normalizeParams(params)] as const,
   },
   style: {
      all: ["styles"] as const,

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["styles", "list", normalizeParams(params)] as const,
   },
   user: {
      all: ["users"] as const,
      blocked: {
         all: ["users", "blocked"] as const,
         list: (params?: QueryKeys) =>
            ["users", "blocked", normalizeParams(params)] as const,
         infinite: (params?: QueryKeys) =>
            ["users", "blocked", normalizeParams(params)] as const,
      },
   },
   artwork: {
      all: ["artworks"] as const,

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["artworks", "list", normalizeParams(params)] as const,

      infinite: (params?: QueryKeys) =>
         ["artworks", "infinite", normalizeParams(params)] as const,

      collection: {
         list: (params?: QueryKeys) =>
            [
               "artworks",
               "collections",
               "list",
               normalizeParams(params),
            ] as const,

         infinite: (params?: QueryKeys) =>
            [
               "artworks",
               "collections",
               "infinite",
               normalizeParams(params),
            ] as const,
      },

      /* =======================
       * SINGLE ARTWORK
       * ======================= */
      detail: (id: string) => ["artworks", "detail", id] as const,

      create: () => ["artworks", "create"] as const,

      update: (id: string) => ["artworks", "update", id] as const,

      /* =======================
       * LIKED ARTWORKS
       * ======================= */
      liked: {
         all: ["artworks", "liked"] as const,

         me: (params?: QueryKeys) =>
            ["artworks", "liked", "me", normalizeParams(params)] as const,

         byUser: (userId: string, params?: QueryKeys) =>
            ["artworks", "liked", userId, normalizeParams(params)] as const,
      },

      byArtwork: {
         list: (artworkId: string, params?: QueryKeys) =>
            [
               "artworks",
               "by-artwork",
               artworkId,
               normalizeParams(params),
            ] as const,

         infinite: (artworkId: string, params?: QueryKeys) =>
            [
               "artworks",
               "by-artwork",
               artworkId,
               "infinite",
               normalizeParams(params),
            ] as const,
      },

      /* =======================
       * ARTWORKS BY USER
       * ======================= */
      byUser: {
         me: (params?: QueryKeys) =>
            ["artworks", "by-user", "me", normalizeParams(params)] as const,

         all: ["artworks", "by-user"] as const,

         list: (userId: string, params?: QueryKeys) =>
            ["artworks", "by-user", userId, normalizeParams(params)] as const,

         infinite: (userId: string, params?: QueryKeys) =>
            [
               "artworks",
               "by-user",
               userId,
               "infinite",
               normalizeParams(params),
            ] as const,
      },
   },

   /* =======================
    * EVENTS
    * ======================= */
   event: {
      all: ["events"] as const,

      list: (params?: QueryKeys) =>
         ["events", "list", normalizeParams(params)] as const,

      infinite: (params?: QueryKeys) =>
         ["events", "infinite", normalizeParams(params)] as const,

      detail: (id: string) => ["events", "detail", id] as const,

      byUser: {
         me: (params?: QueryKeys) =>
            ["events", "by-user", "me", normalizeParams(params)] as const,

         all: ["events", "by-user"] as const,

         list: (userId: string, params?: QueryKeys) =>
            ["events", "by-user", userId, normalizeParams(params)] as const,

         infinite: (userId: string, params?: QueryKeys) =>
            [
               "events",
               "by-user",
               userId,
               "infinite",
               normalizeParams(params),
            ] as const,
      },

      popUp: {
         all: ["events", "pop-up"] as const,

         list: (params?: QueryKeys) =>
            ["events", "pop-up", "list", normalizeParams(params)] as const,
      },
   },

   /* =======================
    * ARTISTS
    * ======================= */
   artist: {
      all: ["artists"] as const,

      list: (params?: QueryKeys) =>
         ["artists", "list", normalizeParams(params)] as const,

      infinite: (params?: QueryKeys) =>
         ["artists", "infinite", normalizeParams(params)] as const,

      detail: (id: string) => ["artists", "detail", id] as const,
   },

   /* =======================
    * COLLECTORS
    * ======================= */
   collector: {
      all: ["collectors"] as const,

      list: (params?: QueryKeys) =>
         ["collectors", "list", normalizeParams(params)] as const,

      infinite: (params?: QueryKeys) =>
         ["collectors", "infinite", normalizeParams(params)] as const,

      detail: (id: string) => ["collectors", "detail", id] as const,
   },

   /* =======================
    * GALLERIES
    * ======================= */
   gallery: {
      all: ["galleries"] as const,

      list: (params?: QueryKeys) =>
         ["galleries", "list", normalizeParams(params)] as const,

      infinite: (params?: QueryKeys) =>
         ["galleries", "infinite", normalizeParams(params)] as const,

      detail: (id: string) => ["galleries", "detail", id] as const,
   },
};
