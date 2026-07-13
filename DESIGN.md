# Artspace Next.js Design System & UI Guidelines

This document establishes the official Design System and visual guidelines for the **Artspace** project. Since the project uses Tailwind CSS v4, all global configuration variables (design tokens) are declared and customized directly inside `src/app/globals.css` rather than a legacy config file.

---

## 🎨 1. Design Philosophy: "Editorial Minimalist"

Artspace is a premium platform for showcasing and trading artwork. The visual language is modeled after high-end art galleries and modern art catalogs.

1. **Content First**: The artwork is the hero. UI decorations (borders, shadows, backgrounds) must remain minimal to avoid competing with the art.
2. **High-Contrast Elegance**: Clear typography, large margins, and generous line heights give an open, sophisticated feel.
3. **Responsive Flow**: Seamless adaptation from mobile devices to ultra-wide desktop monitors (`3xl` / `4xl` breakpoints).
4. **Burmese Script Inclusivity**: Specialized line height (1.6) and font stacks to ensure that the complex Burmese script displays without vertical clipping.

---

## 💅 2. Color System (Design Tokens)

The colors are mapped to CSS custom variables in `src/app/globals.css`. They automatically change based on the active theme class (`.dark`).

### Light Mode (`:root`)

| Variable | Color Token | Value | Visual Role |
| :--- | :--- | :--- | :--- |
| `--background` | Pure White | `oklch(1 0 0)` / `#FFFFFF` | Main page canvas |
| `--foreground` | Charcoal Gray | `oklch(0.145 0 0)` / `#252525` | Primary body text and icons |
| `--primary` | Forest Green | `#003F1D` | Primary action buttons, active navigation, headers |
| `--primary-foreground` | Off-white | `hsl(210 20% 98%)` | Text inside primary buttons |
| `--secondary` | Light Bluish-Gray | `hsl(210 40% 96.1%)` / `#F1F5F9` | Secondary cards, buttons, background accents |
| `--secondary-foreground` | Deep Slate | `hsl(222.2 47.4% 11.2%)` / `#0F172A` | Text inside secondary containers |
| `--accent` | Warm Gallery Gold | `oklch(83.519% 0.00331 15.646)` | Creamy gold accent for art badges/cards |
| `--accent-foreground` | Deep Olive | `oklch(0.205 0 0)` / `#333333` | Text on top of gold accents |
| `--muted` | Soft Background Gray | `oklch(0.97 0 0)` / `#F7F7F7` | Inactive headers, disabled controls |
| `--muted-foreground` | Cool Medium Gray | `oklch(0.556 0 0)` / `#8F8F8F` | Helper text, secondary labels, dates |
| `--destructive` | Crimson Red | `oklch(0.577 0.245 27.325)` | Destructive operations, active liked heart |
| `--border` / `--input` | Light Gray | `oklch(0.922 0 0)` / `#ECECEC` | UI dividers, form element borders |
| `--ring` | Focus Outline | `oklch(0.708 0 0)` / `#B5B5B5` | Focus indicators for keyboard accessibility |
| `--success` | Emerald Green | `#17C964` | Successful states, orders completed |

### Dark Mode (`.dark`)

| Variable | Color Token | Value | Visual Role |
| :--- | :--- | :--- | :--- |
| `--background` | Charcoal Gray | `oklch(0.145 0 0)` / `#252525` | Dark canvas |
| `--foreground` | Soft White | `oklch(0.985 0 0)` / `#FAFAFA` | Main body text |
| `--primary` | Amber Gold | `#FBBF24` | Primary brand accent in dark mode |
| `--primary-foreground` | Deep Slate | `hsl(222.2 47.4% 11.2%)` | Text inside primary buttons |
| `--secondary` | Off-white | `hsl(210 40% 96.1%)` | Secondary panels (needs custom adjustment for contrast) |
| `--muted` | Dark Neutral | `oklch(0.269 0 0)` / `#424242` | Muted background panels |
| `--muted-foreground` | Muted Silver | `oklch(0.708 0 0)` / `#B5B5B5` | Muted text |
| `--accent` | Dark Slate | `oklch(0.269 0 0)` / `#424242` | Accent highlights in dark mode |
| `--destructive` | Coral Red | `oklch(0.704 0.191 22.216)` | Warning triggers, errors |

---

## 🔤 3. Typography & Language Support

To maintain typographic elegance while serving a multilingual user base, Artspace utilizes distinct font stacks:

### Font Families

1. **Sans-Serif (Body & UI Control)**: 
   - Font Stack: `var(--font-outfit-sans), var(--font-noto-myanmar), "Outfit", sans-serif`
   - Purpose: Standard readability for UI text, menus, forms, and lists.
2. **Display/Serif (Headings & Artistic Titles)**:
   - Font Stack: `var(--font-fraunces), var(--font-noto-serif-myanmar), "Fraunces", serif`
   - Purpose: Elegant serif style used for exhibition titles, artwork headings, artist signatures.

### Line Height Constraints
- **General Body Text (Latin)**: `line-height: 1.8` for open, breathable layouts.
- **Form Controls (Inputs / Textareas)**: `line-height: 1.5` to prevent diacritics clipping.
- **Burmese Locale (html[lang="my"])**: 
  - Adjusted globally to `line-height: 1.6` for all text blocks, headings, and paragraphs. This is **mandatory** because Burmese characters contain top and bottom vocal marks that get truncated under tight line heights.

---

## 🍱 4. Core Component Standards

### A. Artwork Catalog Card
- **Aspect Ratio**: Must be strictly 1:1 (`aspect-square`) to align grid items neatly.
- **Corners**: `rounded-sm` (sharp, classic gallery frame aesthetic) instead of Rounded-LG.
- **Density**: Minimal padding (`p-3`), borderless, and shadowless. Shadow/borders are reserved exclusively for "Masonry" grids.
- **Overlaid Actions**: Heart/like button sits in the top-right corner. It uses a high-visibility red highlight when active. On mobile viewports, the icon stays visible via a bottom-to-top subtle dark gradient overlay.
- **Clean Border Policy**: Status text (e.g. `SOLD`) must **not** be overlaid on the card itself to maintain the clean gallery aesthetic. Keep the card face focused on the artwork.

### B. High-Gravity Pills (Filters & Tabs)
- **Inactive State**: `bg-white`, `border-2 border-muted/70`, `shadow-sm`.
- **Active State**: `bg-primary`, `text-primary-foreground`.
- **Labeling**: Enums from the database must be converted to Title Case (e.g., `AVAILABLE` -> "Available", `NOT_FOR_SALE` -> "Not For Sale").

### C. Hero Banners & Cover Images
To display varying image dimensions fetched from the API (such as event banners or profile covers) without awkward cropping or squeezing:
1. **Blurred Background Frame**: The outer banner uses a heavily blurred version of the cover photo (`backdrop-blur-md` or CSS filters).
2. **Centered Foreground Image**: The actual, uncropped image is centered on top (`object-fit: contain`) with a drop shadow.
3. **Glassmorphic Overlays**: Metadata (exhibition date, location, title) is rendered on absolute-positioned frosted glass panels (`backdrop-blur-md bg-black/40` or `bg-white/40`) to guarantee high contrast.

---

## 💬 5. Interaction & Rich Aesthetics

### Persisted Mini-Chat Widget
- Uses a glassmorphism shell (`backdrop-blur bg-background/80`).
- State (active chat thread, maximized/minimized) is persisted in `localStorage` via Zustand to avoid disruption during page transitions.
- Responsive height limit of `calc(100vh - 100px)` ensures that controls stay within bounds on small screens.

### Media Lightbox Viewer
- Backed by an immersive backdrop blur (`backdrop-blur-xl bg-black/90`).
- Auto-Hiding Controls: Navigation buttons, titles, and thumbnails automatically fade out after 3 seconds of user inactivity.
- Sliding thumbnail strip: Implements active centering scroll to keep the current preview item in focus.

### Feedback Systems
- **Toasts**: Handled via `sonner` for crisp notifications.
- **Loading**: Use the customized `<Skeleton>` elements designed to mirror cards and filters.
