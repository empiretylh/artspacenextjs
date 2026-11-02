/**
 * Remembers endpoints that answered 503 Service Unavailable so the app stops
 * calling them for the rest of the session instead of hammering a down service.
 * The set lives in sessionStorage, so it resets when the app/tab restarts.
 */
const STORAGE_KEY = "artspace_unavailable_endpoints";

const ENDPOINTS = {
   notificationStream: "/orders/notifications/stream/",
   notifications: "/orders/notifications/",
   notificationDevices: "/orders/notification-devices/",
   orders: "/orders/orders/",
} as const;

export type UnavailableEndpoint = keyof typeof ENDPOINTS;

const unavailable = new Set<UnavailableEndpoint>();
let hydrated = false;

function hydrate() {
   if (hydrated || typeof window === "undefined") return;
   hydrated = true;

   try {
      const parsed = JSON.parse(
         window.sessionStorage.getItem(STORAGE_KEY) ?? "[]"
      );
      if (Array.isArray(parsed)) {
         parsed.forEach((key) => {
            if (key in ENDPOINTS) unavailable.add(key as UnavailableEndpoint);
         });
      }
   } catch {
      // Ignore unreadable storage and start with an empty set.
   }
}

function persist() {
   if (typeof window === "undefined") return;

   try {
      window.sessionStorage.setItem(
         STORAGE_KEY,
         JSON.stringify([...unavailable])
      );
   } catch {
      // Storage can be full or blocked; the in-memory set still works.
   }
}

function matchEndpoint(url?: string): UnavailableEndpoint | null {
   if (!url) return null;

   const path = url.split("?")[0];
   if (path.includes(ENDPOINTS.notificationStream)) return "notificationStream";
   if (path.includes(ENDPOINTS.notifications)) return "notifications";
   if (path.includes(ENDPOINTS.notificationDevices)) return "notificationDevices";
   if (path.includes(ENDPOINTS.orders) || path.endsWith("/orders")) {
      return "orders";
   }
   return null;
}

export function isEndpointUnavailable(endpoint: UnavailableEndpoint): boolean {
   hydrate();
   return unavailable.has(endpoint);
}

export function isUrlUnavailable(url?: string): boolean {
   const endpoint = matchEndpoint(url);
   return endpoint ? isEndpointUnavailable(endpoint) : false;
}

/**
 * Marks the endpoint behind `url` as unavailable. Returns true only when the
 * url belongs to a tracked endpoint, so callers can skip error toasts.
 */
export function markUrlUnavailable(url?: string): boolean {
   const endpoint = matchEndpoint(url);
   if (!endpoint) return false;

   hydrate();
   if (!unavailable.has(endpoint)) {
      unavailable.add(endpoint);
      persist();
   }
   return true;
}
