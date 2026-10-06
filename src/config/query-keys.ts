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
   if (!params) return JSON.stringify({});

   return JSON.stringify({
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
   });
};

export const queryKeys = {
   genre: {
      all: ["genres"],

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["genres", "list", normalizeParams(params)],
      home: {
         all: ["genres", "home"],

         /* =======================
          * LIST / BROWSE
          * ======================= */
         list: (params?: QueryKeys) =>
            ["genres", "home", "list", normalizeParams(params)],
      }
   },
   category: {
      all: ["categories"],

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["categories", "list", normalizeParams(params)],
      home: {
         all: ["categories", "home"],

         /* =======================
          * LIST / BROWSE
          * ======================= */
         list: (params?: QueryKeys) =>
            ["categories", "home", "list", normalizeParams(params)],
      }
   },
   style: {
      all: ["styles"],

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["styles", "list", normalizeParams(params)],
      home: {
         all: ["styles", "home"],

         /* =======================
          * LIST / BROWSE
          * ======================= */
         list: (params?: QueryKeys) =>
            ["styles", "home", "list", normalizeParams(params)],
      }
   },
   user: {
      all: ["users"],

      type: {
         all(userType: string) {
            return ["users", userType];
         },
         infinite(userType: string) {
            return ["users", userType, "infinite"];
         },
         list(userType: string) {
            return ["users", userType, "list"];
         }
      },

      list: (userType: string, params?: QueryKeys) =>
         ["users", userType, "list", normalizeParams(params)],

      infinite: (userType: string, params?: QueryKeys) =>
         ["users", userType, "infinite", normalizeParams(params)],

      detail: (userType: string, id: string) => ["users", userType, "detail", id],
      blocked: {
         all: ["users", "blocked"],
         list: (params?: QueryKeys) =>
            ["users", "blocked", normalizeParams(params)],
         infinite: (params?: QueryKeys) =>
            ["users", "blocked", normalizeParams(params)],
         status: (userId: string, type: string) => ["users", "blocked", userId, type],
      },
      me: () => ["users", "me"],
      followed: {
         all: ["users", "followed"],
         list: (params?: QueryKeys) =>
            ["users", "followed", "list", normalizeParams(params)],
         infinite: (params?: QueryKeys) =>
            ["users", "followed", "infinite", normalizeParams(params)],
         status: (userId: string, type: string) => ["users", "followed", userId, type],
      }
   },
   artwork: {
      all: ["artworks"],

      /* =======================
       * LIST / BROWSE
       * ======================= */
      list: (params?: QueryKeys) =>
         ["artworks", "list", normalizeParams(params)],

      infinite: (params?: QueryKeys) =>
         ["artworks", "infinite", normalizeParams(params)],

      priceFilterOptions: (currency: string) =>
         ["artworks", "price-filter-options", currency],

      collection: {
         list: (params?: QueryKeys) =>
            [
               "artworks",
               "collections",
               "list",
               normalizeParams(params),
            ],

         infinite: (params?: QueryKeys) =>
            [
               "artworks",
               "collections",
               "infinite",
               normalizeParams(params),
            ],
      },

      /* =======================
       * SINGLE ARTWORK
       * ======================= */
      detail: (id: string) => ["artworks", "detail", id],

      create: () => ["artworks", "create"],

      update: (id: string) => ["artworks", "update", id],

      /* =======================
       * LIKED ARTWORKS
       * ======================= */
      liked: {
         all: ["artworks", "liked"],

         me: (params?: QueryKeys) =>
            ["artworks", "liked", "me", normalizeParams(params)],

         byUser: (userId: string, params?: QueryKeys) =>
            ["artworks", "liked", userId, normalizeParams(params)],
      },

      byArtwork: {
         list: (artworkId: string, params?: QueryKeys) =>
            [
               "artworks",
               "by-artwork",
               artworkId,
               normalizeParams(params),
            ],

         infinite: (artworkId: string, params?: QueryKeys) =>
            [
               "artworks",
               "by-artwork",
               artworkId,
               "infinite",
               normalizeParams(params),
            ],
      },

      /* =======================
       * ARTWORKS BY USER
       * ======================= */
      byUser: {
         me: (params?: QueryKeys) =>
            ["artworks", "by-user", "me", normalizeParams(params)],

         all: ["artworks", "by-user"],

         list: (userId: string, params?: QueryKeys) =>
            ["artworks", "by-user", userId, normalizeParams(params)],

         infinite: (userId: string, params?: QueryKeys) =>
            [
               "artworks",
               "by-user",
               userId,
               "infinite",
               normalizeParams(params),
            ],
      },
   },

   /* =======================
    * EVENTS
    * ======================= */
   event: {
      all: ["events"],

      list: (params?: QueryKeys) =>
         ["events", "list", normalizeParams(params)],

      infinite: (params?: QueryKeys) =>
         ["events", "infinite", normalizeParams(params)],

      detail: (id: string) => ["events", "detail", id],

      interested: {
         status: (eventSlug: string) => ["events", "interest-status", eventSlug],
      },

      byUser: {
         me: (params?: QueryKeys) =>
            ["events", "by-user", "me", normalizeParams(params)],

         all: ["events", "by-user"],

         list: (userId: string, params?: QueryKeys) =>
            ["events", "by-user", userId, normalizeParams(params)],

         infinite: (userId: string, params?: QueryKeys) =>
            [
               "events",
               "by-user",
               userId,
               "infinite",
               normalizeParams(params),
            ],
      },

      popUp: {
         all: ["events", "pop-up"],

         list: (params?: QueryKeys) =>
            ["events", "pop-up", "list", normalizeParams(params)],
      },
   },

   /* =======================
    * ARTISTS
    * ======================= */
   artist: {
      all: ["artists"],

      list: (params?: QueryKeys) =>
         ["artists", "list", normalizeParams(params)],

      infinite: (params?: QueryKeys) =>
         ["artists", "infinite", normalizeParams(params)],

      detail: (id: string) => ["artists", "detail", id],
   },



   /* =======================
    * COLLECTORS
    * ======================= */
   collector: {
      all: ["collectors"],

      list: (params?: QueryKeys) =>
         ["collectors", "list", normalizeParams(params)],

      infinite: (params?: QueryKeys) =>
         ["collectors", "infinite", normalizeParams(params)],

      detail: (id: string) => ["collectors", "detail", id],
   },

   /* =======================
    * GALLERIES
    * ======================= */
   gallery: {
      all: ["galleries"],

      list: (params?: QueryKeys) =>
         ["galleries", "list", normalizeParams(params)],

      infinite: (params?: QueryKeys) =>
         ["galleries", "infinite", normalizeParams(params)],

      detail: (id: string) => ["galleries", "detail", id],
   },

   /* =======================
    * GLOBAL SEARCH
    * ======================= */
   globalSearch: {
      list: (query: string, limit?: number, topN?: number) =>
         ["global-search", query, limit, topN],
   },

   /* =======================
    * BLOG & ARTICLES
    * ======================= */
   blog: {
      all: ["blog"],
      posts: {
         all: ["blog", "posts"],
         list: (params?: Record<string, any>) =>
            ["blog", "posts", "list", JSON.stringify(params ?? {})],
         infinite: (params?: Record<string, any>) =>
            ["blog", "posts", "infinite", JSON.stringify(params ?? {})],
         detail: (slug: string) => ["blog", "posts", "detail", slug],
         related: (slug: string, limit?: number) =>
            ["blog", "posts", "related", slug, limit ?? 4],
      },
      categories: {
         all: ["blog", "categories"],
         list: () => ["blog", "categories", "list"],
      },
      tags: {
         all: ["blog", "tags"],
         list: () => ["blog", "tags", "list"],
      },
   },
};
