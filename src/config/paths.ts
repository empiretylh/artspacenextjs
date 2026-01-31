export const paths = {
   root: {
      path: "/",
      getHref: () => "/",
   },
   collections: {
      path: "/arcade",
      getHref: () => "/",
   },
   cart: {
      path: "/cart",
      getHref: () => "/",
   },
   checkout: {
      path: "/checkout",
      getHref: () => "/checkout",
   },
   artworks: {
      path: "/artworks",
      getHref: () => "/artworks",
      detail: {
         path: "/artworks/:id",
         getHref: (id: string) => `/artworks/${id}`,
      },
   },
   events: {
      path: "/events",
      getHref: () => "/events",
      detail: {
         path: "/events/:slug",
         getHref: (slug: string) => `/events/${slug}`,
      },
   },
   users: {
      path: "/users",
      getHref: () => "/users",
      detail: {
         path: "/users/:id",
         getHref: (id: string) => `/users/${id}`,
      },
      artworks: {
         path: "/users/:id/artworks",
         getHref: (id: string) => `/users/${id}/artworks`,
      },
      events: {
         path: "/users/:id/events",
         getHref: (id: string) => `/users/${id}/events`,
      },
      collections: {
         path: "/users/:id/collections",
         getHref: (id: string) => `/users/${id}/collections`,
      },
      save: {
         path: "/users/:id/save",
         getHref: (id: string) => `/users/${id}/save`,
      },
      likedArtworks: {
         path: "/users/:id/liked-artworks",
         getHref: (id: string) => `/users/${id}/liked-artworks`,
      },
   },
   artists: {
      path: "/artists",
      getHref: () => "/artists",
      detail: {
         path: "/artists/:id",
         getHref: (id: string) => `/artists/${id}`,
      },
      artworks: {
         path: "/artists/:id/artworks",
         getHref: (id: string) => `/artists/${id}/artworks`,
      },
      events: {
         path: "/profile/events",
         getHref: () => "/profile/events",
      },
      collections: {
         path: "/artists/:id/collections",
         getHref: (id: string) => `/artists/${id}/collections`,
      },
      save: {
         path: "/artists/:id/save",
         getHref: (id: string) => `/artists/${id}/save`,
      },
      likedArtworks: {
         path: "/artists/:id/liked-artworks",
         getHref: (id: string) => `/artists/${id}/liked-artworks`,
      },
   },
   collectors: {
      path: "/collectors",
      getHref: () => "/collectors",
      detail: {
         path: "/collectors/:id",
         getHref: (id: string) => `/collectors/${id}`,
      },
      artworks: {
         path: "/collectors/:id/artworks",
         getHref: (id: string) => `/collectors/${id}/artworks`,
      },
      events: {
         path: "/profile/events",
         getHref: () => "/profile/events",
      },
      collections: {
         path: "/collectors/:id/collections",
         getHref: (id: string) => `/collectors/${id}/collections`,
      },
      save: {
         path: "/collectors/:id/save",
         getHref: (id: string) => `/collectors/${id}/save`,
      },
      likedArtworks: {
         path: "/collectors/:id/liked-artworks",
         getHref: (id: string) => `/collectors/${id}/liked-artworks`,
      },
   },
   galleries: {
      path: "/galleries",
      getHref: () => "/galleries",
      detail: {
         path: "/galleries/:id",
         getHref: (id: string) => `/galleries/${id}`,
      },
      artworks: {
         path: "/galleries/:id/artworks",
         getHref: (id: string) => `/galleries/${id}/artworks`,
      },
      events: {
         path: "/profile/events",
         getHref: () => "/profile/events",
      },
      collections: {
         path: "/galleries/:id/collections",
         getHref: (id: string) => `/galleries/${id}/collections`,
      },
      save: {
         path: "/galleries/:id/save",
         getHref: (id: string) => `/galleries/${id}/save`,
      },
      likedArtworks: {
         path: "/galleries/:id/liked-artworks",
         getHref: (id: string) => `/galleries/${id}/liked-artworks`,
      },
   },
   chats: {
      path: "/chats",
      getHref: () => "/chats",
      detail: {
         path: "/chats/:id",
         getHref: (id: string) => `/chats/${id}`,
      },
   },
   inventory: {
      path: "/inventory",
      getHref: () => "/inventory",
      detail: {
         path: "/inventory/:id",
         getHref: (id: string) => `/inventory/${id}`,
      },
   },
   settings: {
      path: "/settings",
      getHref: () => "/settings",
      privacyAndSafety: {
         path: "/settings/privacy-and-policy",
         getHref: () => "/settings/privacy-and-policy",
         blockedUsers: {
            path: "/settings/privacy-and-policy/blocked-users",
            getHref: () => "/settings/privacy-and-policy/blocked-users",
         },
      },
   },
   order: {
      path: "/orders",
      getHref: () => "/orders",
      detail: {
         path: "/orders/:id",
         getHref: (id: string) => `/orders/${id}`,
      },
   },
   profile: {
      path: "/profile",
      getHref: () => "/profile",
      artworks: {
         path: "/profile/artworks",
         getHref: () => "/profile/artworks",
      },
      events: {
         path: "/profile/events",
         getHref: () => "/profile/events",
      },
      collections: {
         path: "/profile/collections",
         getHref: () => "/profile/collections",
      },
      save: {
         path: "/profile/save",
         getHref: () => "/profile/save",
      },
      likedArtworks: {
         path: "/profile/liked-artworks",
         getHref: () => "/profile/liked-artworks",
      },
   },
   auth: {
      login: {
         path: "/sign-in",
         getHref: () => "/sign-in",
      },
      register: {
         path: "/sign-up",
         getHref: () => "/sign-up",
      },
   },
   posts: {
      path: "/posts",
      getHref: () => "/posts",
      create: {
         path: "/posts/create",
         getHref: () => "/posts/create",
      },
      edit: {
         path: "/posts/:id/edit",
         getHref: (id: string) => `/posts/edit/${id}`,
      },
      view: {
         path: "/posts/:id/view",
         getHref: (id: string) => `/posts/view/${id}`,
      },
   },
   notFound: {
      path: "*",
      getHref: () => "*",
   },
} as const;
