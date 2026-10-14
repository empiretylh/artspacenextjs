# Implementation Checklist: Artspace React MiniApp (`art-space-react`)

> **Goal**: Complete 1:1 functional parity migration from `art-space-next` to `art-space-react` for SuperApp / FinTech MiniApp deployment.
> **Target Folder**: `../art-space-react` (`d:\data\learning\work\real-work\art-space-react`)
> **Tech Stack**: Vite 6 + React 19 + TypeScript + React Router (HashRouter) + Tailwind CSS v4 + Zustand + TanStack Query + react-i18next + Firebase Firestore + SSE Stream

---

## 📋 Phase 1: Scaffolding & Core Infrastructure
- [x] Initialize `art-space-react` directory at `d:\data\learning\work\real-work\art-space-react`
- [x] Set up `package.json` with React 19, Vite, Tailwind CSS v4, Lucide, Radix UI, Zustand, TanStack Query, Axios, Firebase, react-i18next
- [x] Configure `vite.config.ts` with `@tailwindcss/vite`, port 5173, and `@/*` alias path resolution
- [x] Configure Next.js module shims alias mapping (`next/image`, `next/link`, `next/navigation`, `next-intl`)
- [x] Set up `tsconfig.json` and strict path mappings
- [x] Set up `index.html` with mobile in-app webview meta tags and font declarations
- [x] Copy and configure `globals.css` with Tailwind v4 `@theme`, OKLCH colors, Masterpiece font face, and Burmese font diacritic rules
- [x] Create `src/config/env.ts` with Zod validation for `VITE_*` environment variables
- [x] Create `src/config/query-keys.ts` matching existing data fetching keys (including `board`, `notifications`, `collections`)
- [x] Create `src/config/paths.ts` and `src/config/support.ts`

---

## 🧩 Phase 2: Next.js Compatibility Shims & Foundation
- [x] `src/shims/next-image.tsx` (Native `<img>` supporting fill, priority, preload, eager/lazy, aspect ratio)
- [x] `src/shims/next-link.tsx` (Drop-in replacement for `next/link` wrapping React Router `Link` / `NavLink`)
- [x] `src/shims/next-navigation.ts` (Exporting `useRouter`, `usePathname`, `useSearchParams`, `useParams`, `redirect`, `notFound` with `useInRouterContext` fallback)
- [x] `src/shims/next-intl.tsx` (`react-i18next` bridge with `useTranslations`, `useLocale`, `getTranslations`, and `t.raw()` support)
- [x] `src/lib/api-client.ts` (Axios client with localStorage JWT token injection and 401 automatic refresh against backend)
- [x] `src/lib/utils.tsx` (cn helper, formatters, etc.)
- [x] `src/lib/analytics.ts` (Analytics event dispatcher with browser gtag bridge)
- [x] `src/lib/auth.ts` (Client session extraction from localStorage)
- [x] `src/lib/field-error.ts` & `src/lib/zod-schema.ts`
- [x] `src/i18n/i18n.ts` (i18next initialized with `messages/en.json` and `messages/my.json`, persisting to localStorage)
- [x] `src/types/` (Models: `User`, `Artwork`, `Event`, `Order`, `Post`, `Chat`, `Board`, `Notification`, etc.)

---

## 🎨 Phase 3: Shared UI Atoms & Layout Components
- [x] `src/components/ui/` Radix UI atoms:
  - [x] `button.tsx`
  - [x] `badge.tsx`
  - [x] `dialog.tsx`
  - [x] `sheet.tsx`
  - [x] `drawer.tsx`
  - [x] `popover.tsx`
  - [x] `dropdown-menu.tsx`
  - [x] `select.tsx`
  - [x] `input.tsx`
  - [x] `textarea.tsx`
  - [x] `checkbox.tsx`
  - [x] `radio-group.tsx`
  - [x] `switch.tsx`
  - [x] `slider.tsx`
  - [x] `tabs.tsx`
  - [x] `table.tsx`
  - [x] `avatar.tsx`
  - [x] `card.tsx`
  - [x] `separator.tsx`
  - [x] `scroll-area.tsx`
  - [x] `skeleton.tsx`
  - [x] `tooltip.tsx`
  - [x] `sidebar.tsx`
  - [x] `notifications.tsx`
- [x] `src/components/common/dialogs/form-dialog.tsx` (Responsive dialog with mobile full-screen safe areas)
- [x] `src/components/common/empty-state.tsx` (Generic reusable empty state)
- [x] `src/components/app/profile/profile-stats-summary.tsx` (Profile followers/following/artworks stats)
- [x] `src/components/layout/`:
  - [x] `app-sidebar.tsx`
  - [x] `nav-main.tsx`, `nav-user.tsx`, `nav-secondary.tsx`
  - [x] `scroll-container.tsx`
  - [x] Header, Language Selector & Theme Toggle
- [x] `src/hooks/`:
  - [x] `use-dialog-state.tsx`
  - [x] `use-mobile.tsx`
  - [x] `use-safe-back.ts`
  - [x] `use-theme.ts`
  - [x] `use-document-visibility.ts`
  - [x] `use-file-upload.ts`

---

## 📦 Phase 4: Feature-by-Feature Parity Implementation

### 1. Auth Feature (`src/features/auth/`)
- [x] Zustand auth store (`store.ts`) with direct backend login, register, token refresh, and logout
- [x] `auth-dialog.tsx`, `login-form.tsx`, `register-form.tsx`
- [x] Google OAuth button / popup integration
- [x] Collector privacy support (`collector_name_privacy` in registration & profile)
- [x] Role checks (`isBuyer`, `isArtist`, `isCollector`, `isGallery`)

### 2. Service Layer (`src/features/service/`)
- [x] Full copy of all API queries and mutations in `src/features/service/artspace/`
- [ ] Sync new Board mutations (`board-mutations.ts`, `get-boards.ts`, `get-board.ts`, `get-board-artworks.ts`, `save-artwork.ts`, `get-collections-by-user-id.ts`)
- [x] Firebase initialization in `src/features/service/firebase/firebase.ts`

### 3. Home Feature (`src/features/home/`)
- [x] Synchronous Client Component architecture (`HomePage`, `BannerSliderContainer`, `GenreSection`, `CategoryAndStyleSection`)
- [x] Hero section & banner carousel
- [x] Featured / Curated collections
- [x] Trending artworks slider
- [x] Featured artists spotlight
- [x] Genre & category pills

### 4. Artwork Feature (`src/features/artwork/`)
- [x] Artwork listing grid with filters (category, medium, style, price range, orientation)
- [x] Artwork card with like button and hover effects
- [x] Artwork detail view (`artwork-detail-page.tsx`) with image gallery / zoom, certificates, related artworks
- [x] Like / Save toggle mutations and hooks (`use-like.ts`, `use-like-toggle.ts`)
- [x] Report artwork dialog
- [x] Upload & edit artwork forms (standardized with `form-dialog.tsx`)
- [ ] Save-to-board action on artwork card & detail view

### 5. Collections Feature (`src/features/collections/`)
- [x] Curated collections list and detail views
- [x] Collection artworks grid

### 6. Boards Feature - Save-for-Later & Custom Collections (`src/features/boards/`) 🆕
- [ ] Port `src/features/boards/` components:
  - [ ] `save-to-board-dialog.tsx` (Toggle artwork membership across boards, inline board creation)
  - [ ] `board-card.tsx` (Collage preview with 1, 2, 3, 4+ thumbnails, ambient fallback, privacy badges)
  - [ ] `create-board-dialog.tsx` (Modal to create custom board with title and visibility)
  - [ ] `edit-board-dialog.tsx` (Modal to edit title and privacy setting)
  - [ ] `board-artworks-view.tsx` (Detail grid of artworks in a board with pagination and removal controls)
- [ ] Wire Boards models (`src/types/models/board.ts`)
- [ ] Wire Boards query keys (`queryKeys.board`)

### 7. Notifications Feature - Realtime SSE & Push Tokens (`src/features/notifications/`) 🆕
- [ ] Port `src/features/notifications/` components & hooks:
  - [ ] `notification-store.ts` (Zustand state for unread count & active filters)
  - [ ] `use-notifications.ts` (React Query hook with optimistic read updates)
  - [ ] `use-notification-stream.ts` (Server-Sent Events stream reader with auto-reconnect & Sonner toasts)
  - [ ] `use-notification-device.ts` (Device token registration for miniapp / webview)
  - [ ] `notification-dropdown.tsx` (Popover on header bell with unread badge, All/Unread tabs)
  - [ ] `notification-item.tsx` (Contextual icon, thumbnail, relative time, click-to-route)
  - [ ] `notification-list.tsx` (List container with empty and loading states)
  - [ ] `notification-listener.tsx` (Headless global listener mounted in layout)
  - [ ] `notifications-page.tsx` (Full-screen dedicated notifications page at `#/notifications`)
- [ ] Add notification Bell icon & dropdown to `site-header.tsx`
- [ ] Wire Notification models (`src/types/models/notification.ts`)

### 8. Artist & Gallery Features (`src/features/artist/`, `src/features/gallery/`, `src/features/user/`)
- [x] Artists directory view with filtering
- [x] Galleries directory view
- [x] Public user profile container (`users-container.tsx`, `artist-layout-container.tsx`)
- [x] Profile overview, artworks tab, and liked artworks tab
- [ ] User public collections tab (`/:userType/:id/collections`)
- [ ] User public saved boards tab (`/:userType/:id/save`)
- [x] Follow / unfollow artist hook & action (`use-follow.ts`)

### 9. Search Feature (`src/features/search/`)
- [x] Search input dialog / omnibox
- [x] Multi-entity search results (artworks, artists, exhibitions, galleries)
- [x] Recent searches caching
- [x] Collector name privacy handling in user search cards

### 10. Events Feature (`src/features/events/`)
- [x] Events listing page with status filter (Upcoming, Ongoing, Past)
- [x] Event detail page (`event-detail-page.tsx`)
- [x] Event RSVP / Interest toggle button (`interest-event.ts`)
- [x] Email invitation modal
- [x] Global promotional popup slider (`event-pop-up-slider.tsx`)

### 11. Blog & Press Features (`src/features/blog/`)
- [x] Blog posts directory & category filter
- [x] Blog post detail view with author details and related posts
- [x] Press releases listing and detail reader

### 12. Cart & Checkout Features (`src/features/cart/`, `src/features/checkout/`)
- [x] Shopping cart drawer & item management
- [x] Multi-step checkout flow (`checkout-page.tsx`)
- [x] Delivery address form & validation
- [x] Direct artwork buy now (`/artworks/:id/order`)
- [x] Enhanced payment error handling & mobile safe area navigation

### 13. Orders Feature (`src/features/orders/`)
- [x] Orders list page with status filter tabs (All, Pending, Paid, Shipped, Delivered, Cancelled)
- [x] Order detail view with tracking timeline and item breakdown
- [x] Order payment view (`payment-page.tsx`) with payment options and QR display
- [x] Order cancellation & confirmation actions

### 14. User Profile Feature (`src/features/profile/`)
- [x] Personal profile dashboard (`profile-page.tsx`)
- [x] My uploaded artworks view (`profile-artworks-page.tsx`)
- [x] My registered events view (`profile-events-page.tsx`)
- [x] My liked artworks view (`profile-liked-artworks-page.tsx`)
- [ ] My custom collections view (`profile-collections-page.tsx`)
- [ ] My saved boards view (`profile-save-page.tsx`)
- [x] Profile stats summary (followers, following, artworks count)

### 15. Settings Feature (`src/features/settings/`)
- [x] Profile edit form (name, bio, location, phone, social links, collector privacy)
- [x] Avatar and cover photo upload with cropping
- [x] Blocked users management (`blocked-users-page.tsx`) with instant unblock

### 16. Chat Feature (`src/features/chat/`)
- [x] Real-time conversation list with search and unread badges
- [x] Chat conversation window with auto-scroll and infinite scroll pagination
- [x] Send text messages and grouped media image gallery (up to 10 images)
- [x] Media lightbox viewer with auto-hide controls
- [x] WhatsApp-style dual delete ("Delete for me" / "Delete for everyone")
- [x] Inline message editing
- [x] Emoji reactions popup
- [x] Rich embedded order cards (`orderCard`)
- [x] Typing indicators and presence tracking (`usePresence`, `lastSeen`)
- [x] Firebase session race-condition fix on token refresh
- [x] User block / unblock integration
- [x] Global floating mini-chat widget (`MiniChat`)

### 17. Informational & Legal Pages
- [x] About Us page
- [x] FAQ accordion page
- [x] Privacy Policy legal page
- [x] Terms of Service legal page

---

## 🗺️ Phase 5: Routing & App Shell Wiring
- [x] Top-level `<HashRouter>` configured in `src/main.tsx`
- [x] Route guards: `ProtectedRoute` and `PublicOnlyRoute`
- [x] Dashboard layout with `AppSidebar`, mobile drawer, `ScrollContainer`, `EventPopupSlider`, `MiniChat`
- [ ] Mount `<NotificationListener />` in root layout / shell
- [x] Existing routes (Artworks, Events, Blog, Search, Users, Orders, Checkout, Profile, Settings, Chat)
- [ ] New routes to wire:
  - [ ] `#/notifications` &rarr; `NotificationsPage`
  - [ ] `#/profile/collections` &rarr; `ProfileCollectionsPage`
  - [ ] `#/profile/save` &rarr; `ProfileSavePage`
  - [ ] `#/:userType/:id/collections` &rarr; `UserCollectionsPage`
  - [ ] `#/:userType/:id/save` &rarr; `UserSavePage`
  - [ ] `#/users/:id` &rarr; Redirect to `#/:userType/:id`

---

## ✅ Phase 6: Verification & Quality Assurance
- [x] Full TypeScript compilation check (`tsc --noEmit` returns 0 errors)
- [x] Production build verification (`npm run build` generates `dist/` cleanly)
- [x] Standard Vite port 5173 configured in `vite.config.ts`
- [ ] Verify Boards creation, editing, and artwork saving inside MiniApp
- [ ] Verify Notifications SSE stream and unread badge in header
