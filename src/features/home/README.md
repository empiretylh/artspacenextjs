# Home (features/home): The Entry Experience

> [!IMPORTANT]
> **AI MODELS**: The Home page is the high-traffic entry point. It uses a "Bleed & Peek" layout strategy for carousels to encourage exploration while maintaining a clean, minimalist aesthetic. To maintain butter-smooth mobile performance, sections below the fold are lazily loaded client-side and use layout-matched skeletons to completely eliminate layout shift.

## 🚀 Directory Structure
- **`components/`**: Layout-heavy sections and matching loading skeletons (e.g., `FeaturedArtworksSection`, `FeaturedArtworksSectionSkeleton`).
- **`pages/`**: The dashboard Home page composition (`index.tsx`), mounted at root path `/`.
- **`landing/`**: Preserved marketing landing page view (`LandingPageView`), mounted at `/landing`.

## 🏗️ Technical Logic: Performance & UX Optimization

### 1. Swiper Configuration
To ensure a premium feel and high information density, all home page carousels follow these rules:
- **Navigation**: Advancing strictly one-by-one (`slidesPerGroup={1}`) via buttons or swipe gestures.
- **Responsiveness**: Using numeric `slidesPerView` to create a "peek" effect (showing a partial next card) without dynamic width recalculation glitches.
    - **Artworks**: Mobile (`2.2`), Tablet (`3.2`), Desktop (`4.2` - `5.2`).
    - **Events**: Mobile (`1.2`), Tablet (`2.2`), Desktop (`2.8` - `3.5`).
- **Touch Responsiveness**: `watchSlidesProgress={true}` and `touchStartPreventDefault={false}` are enabled across all sliders to prevent touch event blocking on low-end mobile devices.

### 2. Client-Side Lazy Loading (`SectionLazyLoader`)
To minimize initial page payload and reduce TTFB, only essential above-the-fold content is loaded eagerly. Below-the-fold sections are wrapped in `SectionLazyLoader` to defer rendering and fetching until the section approaches the viewport.

### 3. Layout-Matched Skeletons (Zero CLS)
To prevent Cumulative Layout Shift (CLS) when lazy-loaded sliders mount:
- **Exact Width Calculations**: Skeletons use the exact same layout-matched responsive width percentages and gap structures calculated directly from the real Swiper `slidesPerView` values:
  - **Artists**: `w-[calc((100%-16px)/3)]` on mobile up to `2xl:w-[calc((100%-40px)/6)]`.
  - **Events**: `w-[calc((100%-12px)/1.2)]` on mobile up to `xl:w-[calc((100%-60px)/3.5)]`.
  - **Artworks**: `w-[calc((100%-12px)/2.2)]` on mobile up to `xl:w-[calc((100%-100px)/5.2)]`.
- **Card Metrics**: Skeleton sub-components (avatar circles, titles, badges, and margins) are pixel-for-pixel matched to the real card elements (`UserSmallCard`, `ArtworkCard`, etc.).

### 4. ScrollArea Compatibility
To maintain custom scrollbars on desktop via `ScrollArea`, the global `ScrollContainer` wraps all home content. On touch-enabled devices (e.g., mobile/tablet), the container dynamically swaps to a native fallback with momentum touch-scrolling (`-webkit-overflow-scrolling: touch`) to ensure butter-smooth frame rates.

### 5. Mobile GPU Constraints (No Backdrop-Blur/Blend-Modes in Grids)
To guarantee high scroll frame rates (60fps) on mid-to-low-end mobile devices (e.g., Helio G99-class processors):
- **Avoid Glassmorphism**: Do not use `backdrop-filter: blur()` (e.g., `backdrop-blur-md`) on elements inside repeating grids or lists (like `GenresList`, `CategoriesList`, and `StylesList`). This causes expensive browser read-back layers.
- **Avoid CSS Blend Modes**: Never use class combinations like `bg-blend-color-burn` on grid cards, as they disable hardware acceleration on mobile Chromium browsers and force laggy software repaints.
- **Sleek Alternative**: Fall back to simple semi-transparent dark backgrounds (e.g., `bg-black/60`) paired with fine borders (`border-white/10`) to retain a premium feel with zero rendering overhead.

> [!WARNING]
> **Layout Constraint**: When running on desktop, Radix UI's `ScrollArea` forces a `display: table` wrapper on the internal viewport. This **breaks Swiper's width calculations**. All instances of `ScrollArea` wrapping home carousels must include the override class: `[&>[data-slot=scroll-area-viewport]>div]:!block`.

## 📂 Key Files
- [landing-page-view.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/landing-page-view.tsx): Marketing landing page (served at `/landing`) with responsive header navigation drawer.
- [mas-intro-banner.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/mas-intro-banner.tsx): Dismissible "What is MAS?" welcome banner with localStorage persistence.
- [featured-artworks-section.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/featured-artworks-section.tsx): Implementation of the dense artwork slider.
- [featured-events-section.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/featured-events-section.tsx): Implementation of the wide event preview slider.
- [section-lazy-loader.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/section-lazy-loader.tsx): IntersectionObserver lazy loading wrapper.


