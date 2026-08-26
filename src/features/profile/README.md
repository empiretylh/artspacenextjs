# Profile Feature: User Profiles, Tabbed Navigation & Media Management

> [!IMPORTANT]
> **AI MODELS**: This directory manages private user profile views (`/profile`), tabbed sub-pages (`/profile/artworks`, `/profile/events`, `/profile/liked-artworks`), and public profile mirrors. It coordinates with `features/settings` for profile updates and `features/artwork` for uploaded artwork catalogs.

## 🚀 Directory Structure
- **`api/`**:
  - `get-profile.tsx`: React Query hook for fetching current user profile.
  - `upload-featured-photo.tsx`, `edit-featured-photo.tsx`, `delete-featured-photo.tsx`: Featured highlights/studio photo management.
- **`components/`**:
  - `profile-layout.tsx`: Layout wrapper consuming `ProfileLayoutView`.
- **`pages/`**:
  - `profile-overview-page.tsx`: Overview tab featuring "About the profile", structured "Summary" metadata cards, and "Featured Highlights" photo gallery.
  - `profile-artworks-page.tsx`: Paginated/infinite grid of user's uploaded artworks with edit/delete controls.
  - `profile-events-page.tsx`: Event list and event creation modal for artist/gallery users.
  - `profile-liked-artworks-page.tsx`: Artworks favorited by the current user.
  - `profile-collections-page.tsx`, `profile-save-page.tsx`: Collections and bookmarks (placeholders/in-progress).

---

## 🏗️ Visual & Typographic Standards

### 1. Hero vs. Tab Section Scale
To maintain consistent visual hierarchy on both desktop and mobile without competing titles:
- **Top Hero Title (User Name)**: `text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground`
  - Mobile (`< 640px`): `24px`
  - Desktop (`≥ 640px`): `30px`
- **Tab Headings & Section Titles**: `text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground`
  - Mobile (`< 640px`): `20px`
  - Desktop (`≥ 640px`): `24px`
  - Applied uniformly across **Overview sections** (`About`, `Summary`, `Featured Highlights`), **Artworks tab**, **Events tab**, and **Liked Artworks tab**.
- **Body & Metadata**: `text-sm` (`14px`) and `text-base` (`16px`) with `leading-relaxed`.

### 2. Tab Navigation & Redundancy Prevention
- The active navigation tab bar serves as the primary tab anchor.
- The **Overview** tab starts directly with equal structured section blocks (`About the profile`, `Summary`, `Featured Highlights`) to avoid repeating duplicate "Overview" titles.

---

## 📂 Related Files
- [profile-layout-view.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/app/profile/profile-layout-view.tsx): Shared presentation shell for avatar, cover photo, full name, social actions, and tab bar.
- [profile-overview-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/profile/pages/profile-overview-page.tsx): Main profile landing screen.
- [user-overview-page.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/user/pages/user-overview-page.tsx): Public mirror screen for artist/gallery/collector profiles.
