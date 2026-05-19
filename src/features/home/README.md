# Home (features/home): The Entry Experience

> [!IMPORTANT]
> **AI MODELS**: The Home page is the high-traffic entry point. It uses a "Bleed & Peek" layout strategy for carousels to encourage exploration while maintaining a clean, minimalist aesthetic.

## 🚀 Directory Structure
- **`components/`**: Layout-heavy sections (e.g., `FeaturedArtworksSection`, `FeaturedEventsSection`).
- **`pages/`**: The root landing page composition.

## 🏗️ Technical Logic: The "Bleed & Peek" Carousel

### 1. Swiper Configuration
To ensure a premium feel and high information density, all home page carousels follow these rules:
- **Navigation**: Advancing strictly one-by-one (`slidesPerGroup={1}`) via buttons or swipe gestures.
- **Responsiveness**: Using numeric `slidesPerView` to create a "peek" effect (showing a partial next card) without dynamic width recalculation glitches.
    - **Artworks**: Mobile (`2.2`), Tablet (`3.2`), Desktop (`4.2` - `5.2`).
    - **Events**: Mobile (`1.2`), Tablet (`2.2`), Desktop (`2.8` - `3.5`).
- **Performance**: `watchSlidesProgress={true}` is enabled for accurate snapping.

### 2. Layout Patterns
- **Bleed Effect**: On mobile, sliders use negative horizontal margins (`-mx-4`) and matching internal padding (`!px-4`) to break through the layout container, providing an edge-to-edge feel.
- **Minimalist Cards**: Cards on the Home page are stripped of borders, shadows, and hover transitions to keep the focus entirely on the art content.

## 📂 Key Files
- [featured-artworks-section.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/featured-artworks-section.tsx): Implementation of the dense artwork slider.
- [featured-events-section.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/home/components/featured-events-section.tsx): Implementation of the wide event preview slider.
