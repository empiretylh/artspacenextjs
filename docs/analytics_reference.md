# Frontend Analytics Event Reference

This document outlines all Google Analytics (GA4) events dispatched from the Next.js frontend application. It is intended for the Dashboard/Data teams to understand what user metrics are available for reporting, funnel analysis, and dashboards.

## Global Context
Every event includes the following base parameters implicitly:
- `page_path` *(string)*: The current pathname of the user's location (e.g., `"/artworks/123"`).

Most events also include a `source` parameter, which identifies the UI component or page the action originated from. 
- `source` *(string)*: Possible values include: 
  `'home_page'`, `'discover'`, `'arcade'`, `'search'`, `'sidebar'`, `'artists_page'`, `'artworks_page'`, `'galleries_page'`, `'collectors_page'`, `'artwork_detail'`, `'event_detail'`, `'profile_page'`, `'cart'`, `'checkout'`, `'orders'`, `'settings_page'`, `'admin_dashboard'`, `'sign_in_page'`, `'sign_up_page'`, `'header'`, `'profile_menu'`, `'mobile_nav'`, `'unknown'`.

---

## 1. Authentication & Session Events

### `set` (User Context)
Called once after login to identify the user across sessions. *(Note: This is not a distinct event, but sets GA4 user properties)*
- `user_id` *(string)*: The internal database UUID of the user. 
- `user_type` *(string)*: The role of the user. Values: `'buyer' | 'artist' | 'collector' | 'gallery' | 'guest'`.

### `sign_up`
Triggered when a user successfully creates a new account.
- `method` *(string)*: The authentication method used. Values: `'email' | 'google' | 'github'`.
- `source` *(string)*: e.g., `'sign_in_page'`.

### `login`
Triggered when an existing user successfully logs in.
- `method` *(string)*: The authentication method used. Values: `'email' | 'google' | 'github'`.
- `source` *(string)*: e.g., `'sign_up_page'`.

### `logout`
Triggered when a user logs out of their account.
- `source` *(string)*: e.g., `'profile_menu'`.

### `password_reset`
Triggered when a user requests a password reset link.
- `method` *(string)*: Always `'email'`.
- `source` *(string)*: e.g., `'sign_in_page'`.

---

## 2. Profile & Social Interactions

Events related to users interacting with each other globally (Artists, Collectors, Galleries).

### `view_user`
Triggered when a profile page is viewed.
- `entity_id` *(string)*: UUID of the user profile being viewed.
- `is_own_profile` *(boolean)*: `true` if the logged-in user is viewing their own profile, `false` otherwise.
- `source` *(string)*: e.g., `'profile_page'`.

### `follow_user` / `unfollow_user`
Triggered when a user follows or unfollows another profile.
- `entity_id` *(string)*: UUID of the target user.
- `entity_type` *(string)*: Role of the target user. Values: `'buyer' | 'artist' | 'collector' | 'gallery'`.
- `source` *(string)*: e.g., `'profile_page'`.

### `block_user` / `unblock_user`
Triggered when a user is blocked or unblocked.
- `entity_id` *(string)*: UUID of the target user.
- `entity_type` *(string)*: Role of the target user. Values: `'buyer' | 'artist' | 'collector' | 'gallery'`.
- `source` *(string)*: e.g., `'settings_page'` or `'profile_page'`.

### `edit_user`
Triggered when a user updates their profile.
- `entity_id` *(string)*: The UUID of the user being edited.
- `source` *(string)*: e.g., `'settings_page'`.

---

## 3. Artworks

Events detailing interactions with individual artworks. *(Note: regular artwork views are currently tracked via GA4 enhanced measurement or e-commerce events).*

### `like_artwork` / `unlike_artwork`
- `artwork_id` *(string)*: UUID of the artwork.
- `source` *(string)*: Where the like occurred (e.g., `'artwork_detail'`, `'home_page'`).

### `create_artwork` / `update_artwork` / `delete_artwork`
Admin/Artist actions concerning inventory management.
- `artwork_id` *(string)*: UUID of the artwork (only for update/delete events).
- `source` *(string)*: Usually `'admin_dashboard'`.

---

## 4. E-Commerce (GA4 Standard)

These events use GA4 standard e-commerce arrays. `items` arrays contain objects with the following shape:
```typescript
{
  item_id: string;        // UUID of the artwork
  item_name: string;      // Title of the artwork
  item_category?: string; // Category name (e.g., 'Painting')
  price?: number;         // Numeric value
  quantity?: number;      // Usually 1
  currency?: 'MMK';       // Always 'MMK'
}
```

### `view_item`
Triggered when viewing a specific artwork for potential purchase.
- `currency` *(string)*: Usually `'MMK'`.
- `value` *(number)*: Total value of the items.
- `items` *(array)*: Array containing a single item object (the artwork).
- `source` *(string)*: Usually `'artwork_detail'`.

### `view_item_list`
Triggered when a list of items is presented (e.g., in a cart view).
- `item_list_id` *(string)*: Identifier for the list.
- `item_list_name` *(string)*: Human-readable list name.
- `currency` *(string)*: Usually `'MMK'`.
- `items` *(array)*: Array of item objects.
- `source` *(string)*: usually `'cart'`.

### `select_item`
Triggered when a user selects an item from a list.
- `item_list_id` *(string)*: Identifier for the list.
- `item_list_name` *(string)*: Human-readable list name.
- `items` *(array)*: Array containing the single selected item object.
- `source` *(string)*: Usually `'cart'`.

---

## 5. Exhibitions & Events

### `view_event`
- `event_id` *(string)*: UUID of the event/exhibition.
- `event_type` *(string)*: Type/Category of the event (e.g., `'exhibition'`, `'fair'`).
- `source` *(string)*: Usually `'event_detail'`.

### `interest_event`
Triggered when a user toggles their interest status for an event.
- `event_id` *(string)*: UUID of the event/exhibition.
- `interest_action` *(string)*: Indicates the toggle state. Values: `'interested' | 'not_interested'`.
- `source` *(string)*: Usually `'event_detail'`.

### `create_event` / `update_event` / `delete_event`
- `event_id` *(string)*: UUID of the event (only for update/delete events).
- `source` *(string)*: Usually `'profile_page'`.

---

## 6. Search & Discovery

### `search`
Triggered when a user performs a search across the platform.
- `search_term` *(string)*: The exact string the user typed (e.g., `"Mandalay Art"`).
- `source` *(string)*: Usually `'search'`.

### `share`
Triggered when a user clicks a share button for any content.
- `item_id` *(string)*: UUID of the shared entity.
- `item_name` *(string)*: Name/Title of the shared entity.
- `content_type` *(string)*: Type of content. Values: `'artwork' | 'user' | 'event'`.
- `user_type` *(string)*: (Optional) The type of user being shared if `content_type` is `'user'` (e.g., `'artist'`).
- `method` *(string)*: The sharing channel used (e.g., `'facebook'`, `'x'`, `'copy_link'`, `'native'` for the system's native share drawer).
- `source` *(string)*: e.g., `'artwork_detail'`, `'profile_page'`.

### `content_scroll`
Triggered to track engagement depth on long-form content.
- `scroll_percent` *(number)*: Integer representing the percentage of the page scrolled (e.g., `25`, `50`, `75`, `100`).
