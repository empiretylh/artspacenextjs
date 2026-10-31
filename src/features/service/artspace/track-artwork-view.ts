import { api } from "@/lib/api-client";

const VISITOR_STORAGE_KEY = "mas_visitor_id";
const SESSION_VIEW_PREFIX = "mas_viewed:";
const inFlightViews = new Set<string>();

/**
 * Stable anonymous visitor id used to dedupe artwork views server-side.
 * Authenticated requests are keyed by the JWT user, so this is only a fallback.
 */
export function getVisitorId(): string {
   if (typeof window === "undefined") return "";
   try {
      const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
      if (existing) return existing;
      const generated =
         typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(VISITOR_STORAGE_KEY, generated);
      return generated;
   } catch {
      return "";
   }
}

function hasViewedThisSession(artworkId: string): boolean {
   try {
      return Boolean(window.sessionStorage.getItem(`${SESSION_VIEW_PREFIX}${artworkId}`));
   } catch {
      return false;
   }
}

function markViewedThisSession(artworkId: string) {
   try {
      window.sessionStorage.setItem(`${SESSION_VIEW_PREFIX}${artworkId}`, "1");
   } catch {
      // Storage can be unavailable (private mode); the server still dedupes.
   }
}

/**
 * Fire-and-forget artwork view tracking. Returns the server view count when
 * available. At most one request per artwork per browser session; the backend
 * additionally dedupes one view per visitor per artwork per day.
 */
export async function trackArtworkView(
   artworkId: string,
   source = "detail",
): Promise<number | null> {
   if (typeof window === "undefined") return null;

   if (inFlightViews.has(artworkId) || hasViewedThisSession(artworkId)) {
      return null;
   }

   inFlightViews.add(artworkId);
   try {
      const response = await api.post(`/artworks/artworks/${artworkId}/view/`, {
         visitor_id: getVisitorId(),
         source,
      });
      markViewedThisSession(artworkId);
      const viewCount = response.data?.view_count;
      return typeof viewCount === "number" ? viewCount : null;
   } catch {
      return null;
   } finally {
      inFlightViews.delete(artworkId);
   }
}
