import type { QueryClient } from "@tanstack/react-query";
import type { Persister } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const QUERY_CACHE_KEY = "ARTSPACE_QUERY_CACHE";

/**
 * Bump when a cached API response shape changes so stale entries are dropped
 * on the next app start.
 */
export const QUERY_CACHE_BUSTER = "1";

/** How long a persisted query stays usable after the last visit. */
export const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

const noopPersister: Persister = {
   persistClient: async () => {},
   restoreClient: async () => undefined,
   removeClient: async () => {},
};

/**
 * Persister for `PersistQueryClientProvider`.
 *
 * Uses localStorage, which survives WebView/app restarts in Capacitor. SSR has
 * no `window`, so a no-op persister is returned during server rendering.
 */
export function createQueryCachePersister(): Persister {
   if (typeof window === "undefined") return noopPersister;

   return createSyncStoragePersister({
      storage: window.localStorage,
      key: QUERY_CACHE_KEY,
      throttleTime: 1000,
   });
}

/**
 * Drops every cached query and the persisted copy. Call this on logout or
 * session expiry so private data never leaks into the next session.
 */
export function clearPersistedQueryCache(queryClient: QueryClient) {
   if (typeof window !== "undefined") {
      window.localStorage.removeItem(QUERY_CACHE_KEY);
   }
   queryClient.clear();
}
