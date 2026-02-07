'use client'

import { env } from '@/config/env'
import { sendGAEvent, sendGTMEvent } from '@next/third-parties/google'

/**
 * Internal guard
 */
const enabled =
  typeof window !== 'undefined' &&
  env.ENABLE_ANALYTICS !== 'false'

function track(event: string, params?: Record<string, any>) {
  if (!enabled) return
  // sendGTMEvent({ event, ...params })
  sendGAEvent('event', event, { ...params })
}

/* ===========================
   👤 AUTH / USER
=========================== */

export const authAnalytics = {
  signUp({ method }: { method: 'email' | 'google' | 'github' }) {
    // GA4 standard
    track('sign_up', { method })
  },

  login({ method }: { method: 'email' | 'google' | 'github' }) {
    // GA4 standard
    track('login', { method })
  },

  logout() {
    track('logout')
  },

  passwordReset(method: 'email') {
    track('password_reset', { method })
  },
}

/* ===========================
   🧑 PROFILE / SOCIAL
=========================== */

export const profileAnalytics = {
  view(profileId: string, isOwnProfile: boolean) {
    track('profile_view', {
      profile_id: profileId,
      is_own_profile: isOwnProfile,
    })
  },

  follow(profileId: string) {
    track('profile_follow', { profile_id: profileId })
  },

  unfollow(profileId: string) {
    track('profile_unfollow', { profile_id: profileId })
  },

  edit(profileId: string) {
    track('profile_edit', { profile_id: profileId })
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
}

export const ecommerceAnalytics = {
  viewItem(currency: string, value: number, items: GAItem[]) {
    track('view_item', {
      currency,
      value,
      items,
    })
  },

  addToCart(currency: string, value: number, items: GAItem[]) {
    track('add_to_cart', {
      currency,
      value,
      items,
    })
  },

  removeFromCart(currency: string, value: number, items: GAItem[]) {
    track('remove_from_cart', {
      currency,
      value,
      items,
    })
  },

  viewCart(currency: string, value: number, items: GAItem[]) {
    track('view_cart', {
      currency,
      value,
      items,
    })
  },

  beginCheckout(currency: string, value: number, items: GAItem[]) {
    track('begin_checkout', {
      currency,
      value,
      items,
    })
  },

  purchase(params: {
    transaction_id: string
    currency: string
    value: number
    tax?: number
    shipping?: number
    items: GAItem[]
  }) {
    track('purchase', params)
  },
}

/* ===========================
   📝 POSTS / CONTENT
=========================== */

export const contentAnalytics = {
  createPost(contentType: 'text' | 'image' | 'video') {
    track('post_create', { content_type: contentType })
  },

  viewPost(postId: string, contentType: 'text' | 'image' | 'video') {
    track('post_view', {
      post_id: postId,
      content_type: contentType,
    })
  },

  likePost(postId: string) {
    track('post_like', { post_id: postId })
  },

  commentPost(postId: string) {
    track('post_comment', { post_id: postId })
  },

  sharePost(postId: string) {
    track('post_share', { post_id: postId })
  },
}

/* ===========================
   📅 EVENTS / ACTIVITIES
=========================== */

export const eventAnalytics = {
  view(eventId: string, eventType: 'online' | 'offline') {
    track('event_view', {
      event_id: eventId,
      event_type: eventType,
    })
  },

  register(eventId: string) {
    track('event_register', { event_id: eventId })
  },

  cancelRegistration(eventId: string) {
    track('event_cancel_registration', { event_id: eventId })
  },

  attend(eventId: string) {
    track('event_attend', { event_id: eventId })
  },
}

/* ===========================
   ❌ ERRORS & UX (HIGH VALUE)
=========================== */

export const errorAnalytics = {
  apiError(errorCode: string, context: string) {
    track('api_error', {
      error_code: errorCode,
      context,
    })
  },

  formValidationError(form: string, field?: string) {
    track('form_validation_error', {
      form,
      field,
    })
  },

  paymentFailed(errorCode: string) {
    track('payment_failed', {
      error_code: errorCode,
      context: 'checkout',
    })
  },
}
