# Press & Announcements (formerly Blog): The Editorial & Corporate Communications Hub

> [!IMPORTANT]
> **AI MODELS**: This directory manages the public company press releases, media coverage, announcements, taxonomy filtering, and article reader for Myanmar Art Space.

## 🚀 Directory Structure
- **`components/`**: Modular presentation components:
  - `blog-card.tsx`: Responsive editorial press card (standard and compact variants) with `whitespace-nowrap` CTAs and responsive author truncation.
  - `featured-blog-hero.tsx`: Featured press announcement spotlight hero banner with balanced typographic scale.
  - `blog-filter-bar.tsx`: Categories, tags, language selector, search bar, and ordering controls.
  - `blog-article-header.tsx`: Article breadcrumbs, title, author metadata, reading time, publication date, and cover visual.
  - `blog-article-content.tsx`: Safe rich HTML prose typography renderer with custom heading, blockquote, table, and list styles.
  - `blog-related-articles.tsx`: Related stories grid section (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
- **`pages/`**:
  - `blog-page.tsx`: Main press releases feed with search, category filtering, and infinite scrolling.
  - `blog-detail-page.tsx`: Single press release reader page with dynamic slug lookup and fallback.
- **`utils.ts`**: Utilities for media variant cover resolution, date formatting, and reading time calculation.

## 🏗️ Technical Logic & Architecture

### 1. Routing & Navigation Placement
- **Primary Routes**:
  - Public Feed: `/press` (`src/app/[locale]/(dashboard)/(public)/press/page.tsx`)
  - Article Reader: `/press/[slug]` (`src/app/[locale]/(dashboard)/(public)/press/[slug]/page.tsx`)
  - Legacy `/blog` routes automatically redirect to `/press`.
- **Navigation**:
  - Placed in the **Footer** under the **Explore** section (`paths.press.path`).
  - Removed from the primary sidebar to keep sidebar navigation focused on core application actions.

### 2. Public Content Model & API Services
- All public press requests communicate with `/api/v1/blog/posts/`, `/api/v1/blog/posts/{slug}/`, `/api/v1/blog/categories/`, and `/api/v1/blog/tags/`.
- **Automatic Dev-Only Mock Fallback**:
  - In `development` mode (`NODE_ENV === "development"`), services automatically fall back to rich curated mock data ([src/mocks/blog.ts](file:///d:/data/learning/work/real-work/art-space-next/src/mocks/blog.ts)) when the backend API returns empty results or is offline.
  - In `production` mode (`NODE_ENV === "production"`), mock fallbacks are completely bypassed.

### 3. Typographic Hierarchy
- **Page Heading (`Press`)**: `text-2xl sm:text-3xl font-semibold font-display` (~28–30px) &mdash; primary page anchor.
- **Featured Hero Spotlight**: `text-lg sm:text-xl lg:text-2xl font-semibold font-display` (~22–24px) &mdash; prominent without overpowering the page title.
- **Card Titles**: `text-base font-semibold font-display` (~16px).
- **Body & Excerpts**: `text-xs sm:text-sm font-normal` with `leading-relaxed`.

### 4. SEO & OpenGraph Integration
- Server-side prefetching via TanStack Query and Next.js App Router.
- Dynamic OpenGraph and Twitter card metadata generation via `generateMetadata`.
