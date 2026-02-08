'use client'

import { env } from '@/config/env'
import { Event } from '@/types';
import { sendGAEvent /*, sendGTMEvent*/ } from '@next/third-parties/google'

export function analyticSourceFromPathname(
  pathname: string | null
): AnalyticsSource {
  if (!pathname) return "unknown";

  // normalize: remove trailing slash except root
  const path =
    pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;

  // --- ROOT / HOME ---
  if (path === "/") return "home_page";

  // --- AUTH ---
  if (path === "/sign-in") return "sign_in_page";
  if (path === "/sign-up") return "sign_up_page";

  // --- CART / CHECKOUT ---
  if (path === "/cart") return "cart";
  if (path === "/checkout") return "checkout";

  // --- SETTINGS ---
  if (path.startsWith("/settings")) return "settings_page";

  // --- PROFILE (own profile area) ---
  if (path === "/profile") return "profile_page";
  if (path.startsWith("/profile/")) return "profile_page";

  // --- ARTWORKS ---
  if (path === "/artworks") return "artworks_page";
  if (path.startsWith("/artworks/")) return "artwork_detail";

  // --- EVENTS ---
  if (path === "/events") return "discover";
  if (path.startsWith("/events/")) return "event_detail";

  // --- ARTISTS ---
  if (path === "/artists") return "artists_page";
  if (path.startsWith("/artists/")) return "profile_page";

  // --- COLLECTORS ---
  if (path === "/collectors") return "collectors_page";
  if (path.startsWith("/collectors/")) return "profile_page";

  // --- GALLERIES ---
  if (path === "/galleries") return "galleries_page";
  if (path.startsWith("/galleries/")) return "profile_page";

  // --- COLLECTIONS / ARCADE ---
  if (path === "/arcade") return "arcade";

  // --- FALLBACK ---
  return "unknown";
}

/**
 * ✅ Product-analytics pattern for this app:
 * - Send WHAT happened + ON WHAT + FROM WHERE (internal source)
 * - Do NOT send PII (email/name) or “who did it” on each event
 * - Optionally set a stable user_id once after login (internal id only)
 */

/* ===========================
   ⚙️ ENABLE GUARD (safer)
=========================== */

function isEnabled() {
  return typeof window !== 'undefined' && env.ENABLE_ANALYTICS !== 'false'
}

/* ===========================
   🧭 INTERNAL SOURCE (your UI)
=========================== */

export type UserType = 'buyer' | 'artist' | 'collector' | 'gallery'

export type AnalyticsSource =
  | 'home_page'
  | 'discover'
  | 'arcade'
  | 'search'
  | 'sidebar'
  | 'artists_page'
  | 'artworks_page'
  | 'galleries_page'
  | 'collectors_page'
  | 'artwork_detail'
  | 'event_detail'
  | 'profile_page'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'settings_page'
  | 'admin_dashboard'
  | 'unknown'
  | 'sign_in_page'
  | 'sign_up_page'
  | 'header'
  | 'profile_menu'
  | 'mobile_nav'

function baseParams() {
  // Keep small + stable. GA already captures referrer/utm/page in most cases,
  // but SPA navigations can be tricky, so this helps debugging & funneling.
  try {
    return {
      page_path: window.location.pathname,
    }
  } catch {
    return {}
  }
}

type TrackParams = Record<string, any> & { source?: AnalyticsSource }

function track(event: string, params?: TrackParams) {
  if (!isEnabled()) return

  const payload = {
    ...baseParams(),
    ...params,
  }

  // sendGTMEvent({ event, ...payload })
  sendGAEvent('event', event, payload)
}

/* ===========================
   👤 USER ID (optional, recommended)
   - call once after login with internal user id
   - DO NOT pass email/username/name
=========================== */

export const userAnalytics = {
  setUser(userId: string, userType: UserType) {
    if (!isEnabled()) return
    // This sets GA4 user_id for stitching sessions. Not an event.
    sendGAEvent('set', { user_id: userId })
    sendGAEvent('set', 'user_properties', { user_type: userType })
  },

  clearUser() {
    if (!isEnabled()) return
    // Clear by setting to undefined (works fine for most setups)
    sendGAEvent('set', { user_id: null })
    sendGAEvent('set', 'user_properties', { user_type: 'guest' })
  },
}

/* ===========================
   👤 AUTH / USER (GA4 standard)
=========================== */

export const authAnalytics = {
  signUp({
    method,
    source = 'sign_in_page',
  }: {
    method: 'email' | 'google' | 'github'
    source?: AnalyticsSource
  }) {
    track('sign_up', { method, source })
  },

  login({
    method,
    source = 'sign_up_page',
  }: {
    method: 'email' | 'google' | 'github'
    source?: AnalyticsSource
  }) {
    track('login', { method, source })
  },

  logout(source: AnalyticsSource = 'unknown') {
    track('logout', { source })
    userAnalytics.clearUser()
  },

  passwordReset(source: AnalyticsSource = 'unknown') {
    // not a GA4 “standard” event name, but fine as custom
    track('password_reset', { method: 'email', source })
  },
}

/* ===========================
   🧑 PROFILE / SOCIAL
=========================== */

export const profileAnalytics = {
  view(profileId: string, opts?: { isOwnProfile?: boolean; source?: AnalyticsSource }) {
    track('profile_view', {
      profile_id: profileId,
      is_own_profile: !!opts?.isOwnProfile,
      source: opts?.source ?? 'profile_page',
    })
  },

  follow(profileId: string, userType: UserType, source: AnalyticsSource = 'profile_page') {
    track('profile_follow', { profile_id: profileId, source, user_type: userType })
  },

  unfollow(profileId: string, userType: UserType, source: AnalyticsSource = 'profile_page') {
    track('profile_unfollow', { profile_id: profileId, source, user_type: userType })
  },

  block(profileId: string, userType: UserType, source: AnalyticsSource = 'profile_page') {
    track('profile_block', { profile_id: profileId, source, user_type: userType })
  },

  unblock(profileId: string, userType: UserType, source: AnalyticsSource = 'settings_page') {
    track('profile_unblock', { profile_id: profileId, source, user_type: userType })
  },

  edit(profileId: string, source: AnalyticsSource = 'settings_page') {
    track('profile_edit', { profile_id: profileId, source })
  },
}

/* ===========================
   🖼️ ARTWORKS (content + commerce bridge)
=========================== */

export const artworkAnalytics = {
  view(artworkId: string, opts?: { artistId?: string; galleryId?: string; category?: string; source?: AnalyticsSource }) {
    track('view_artwork', {
      artwork_id: artworkId,
      artist_id: opts?.artistId,
      gallery_id: opts?.galleryId,
      category: opts?.category,
      source: opts?.source ?? 'artwork_detail',
    })
  },

  like(artworkId: string, source: AnalyticsSource = 'artwork_detail') {
    track('like_artwork', { artwork_id: artworkId, source })
  },

  unlike(artworkId: string, source: AnalyticsSource = 'artwork_detail') {
    track('unlike_artwork', { artwork_id: artworkId, source })
  },

  share(artworkId: string, source: AnalyticsSource = 'artwork_detail') {
    track('share_artwork', { artwork_id: artworkId, source })
  },

  create(source: AnalyticsSource = 'admin_dashboard') {
    track('create_artwork', { source })
  },

  update(artworkId: string, source: AnalyticsSource = 'admin_dashboard') {
    track('update_artwork', { artwork_id: artworkId, source })
  },

  delete(artworkId: string, source: AnalyticsSource = 'admin_dashboard') {
    track('delete_artwork', { artwork_id: artworkId, source })
  },
}

/* ===========================
   🛍 E-COMMERCE (GA4 STANDARD)
=========================== */

type GAItem = {
  item_id: string
  item_name: string
  item_category?: string
  price?: number
  quantity?: number
  // Helpful optional fields GA4 supports:
  item_variant?: string
  item_brand?: string
}

export const ecommerceAnalytics = {
  viewItem(currency: string, value: number, items: GAItem[], source: AnalyticsSource = 'artwork_detail') {
    track('view_item', { currency, value, items, source })
  },

  addToCart(currency: string, value: number, items: GAItem[], source: AnalyticsSource = 'artwork_detail') {
    track('add_to_cart', { currency, value, items, source })
  },

  removeFromCart(currency: string, value: number, items: GAItem[], source: AnalyticsSource = 'cart') {
    track('remove_from_cart', { currency, value, items, source })
  },

  viewCart(currency: string, value: number, items: GAItem[], source: AnalyticsSource = 'cart') {
    track('view_cart', { currency, value, items, source })
  },

  beginCheckout(currency: string, value: number, items: GAItem[], source: AnalyticsSource = 'checkout') {
    track('begin_checkout', { currency, value, items, source })
  },

  purchase(params: {
    transaction_id: string
    currency: string
    value: number
    tax?: number
    shipping?: number
    items: GAItem[]
    source?: AnalyticsSource
  }) {
    track('purchase', { ...params, source: params.source ?? 'checkout' })
  },
}

/* ===========================
   📝 POSTS / SOCIAL FEED
=========================== */

export const contentAnalytics = {
  createPost(contentType: 'text' | 'image' | 'video', source: AnalyticsSource = 'home_page') {
    track('create_post', { content_type: contentType, source })
  },

  viewPost(postId: string, contentType: 'text' | 'image' | 'video', source: AnalyticsSource = 'home_page') {
    track('view_post', {
      post_id: postId,
      content_type: contentType,
      source,
    })
  },

  likePost(postId: string, source: AnalyticsSource = 'home_page') {
    track('like_post', { post_id: postId, source })
  },

  unlikePost(postId: string, source: AnalyticsSource = 'home_page') {
    track('unlike_post', { post_id: postId, source })
  },

  commentPost(postId: string, source: AnalyticsSource = 'home_page') {
    track('comment_post', { post_id: postId, source })
  },

  sharePost(postId: string, source: AnalyticsSource = 'home_page') {
    track('share_post', { post_id: postId, source })
  },
}

/* ===========================
   📅 EVENTS / ACTIVITIES
=========================== */

export const eventAnalytics = {
  view(eventId: string, eventType: Lowercase<Event["event_type"]>, source: AnalyticsSource = 'event_detail') {
    track('view_event', {
      event_id: eventId,
      event_type: eventType,
      source,
    })
  },

  interested(eventId: string, source: AnalyticsSource = 'event_detail') {
    track('event_interest', { event_id: eventId, source, interest_action: "interested" })
  },

  uninterested(eventId: string, source: AnalyticsSource = 'event_detail') {
    track('event_interest', { event_id: eventId, source, interest_action: "not_interested" })
  },

  create(source: AnalyticsSource = 'profile_page') {
    track('create_event', { source })
  },

  update(eventId: string, source: AnalyticsSource = 'profile_page') {
    track('update_event', { event_id: eventId, source })
  },

  delete(eventId: string, source: AnalyticsSource = 'profile_page') {
    track('delete_event', { event_id: eventId, source })
  },
}

/* ===========================
   ❌ ERRORS & UX (HIGH VALUE)
=========================== */

export const errorAnalytics = {
  apiError(errorCode: string, context: string, source: AnalyticsSource = 'unknown') {
    track('api_error', { error_code: errorCode, context, source })
  },

  formValidationError(form: string, field?: string, source: AnalyticsSource = 'unknown') {
    track('form_validation_error', { form, field, source })
  },

  paymentFailed(errorCode: string, source: AnalyticsSource = 'checkout') {
    track('payment_failed', { error_code: errorCode, context: 'checkout', source })
  },
}

export const searchAnalytics = {
  search(term: string, opts?: { resultCount?: number; source?: AnalyticsSource }) {
    track('search', {
      search_term: term,
      result_count: opts?.resultCount,
      source: opts?.source ?? 'search',
    })
  },
}

export const scrollAnalytics = {
  scrollToEnd({ scrollPercent }: { scrollPercent: number }) {
    track('content_scroll', { scroll_percent: scrollPercent })
  },
}

// export const filterAnalytics = {
//   apply(filters: string[], resultCount?: number, source: AnalyticsSource = 'discover') {
//     track('apply_filter', {
//       filters,
//       result_count: resultCount,
//       source,
//     })
//   },
// }

// left to do events
// all share event
// errorAnalytics
// postAnalytics
// searchAnalytics
// contentAnalytics
// ecommerceAnalytics
// remove artwork view and change as view_item
