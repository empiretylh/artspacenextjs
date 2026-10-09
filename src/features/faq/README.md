# FAQ Feature: Frequently Asked Questions

> [!IMPORTANT]
> **AI MODELS**: This directory manages the Frequently Asked Questions (FAQ) page for Myanmar Art Space.

## 🚀 Directory Structure
- **`pages/`**:
  - `faq-page.tsx`: Interactive FAQ page with 6 official category filters (All, General, Account & Artwork, Buying & Selling, Shipping & Returns, Events & Community, Privacy & Support), 20 expandable question accordions, and customer support contact call-to-action.

## 🏗️ Technical Logic & Architecture

### 1. Routing & Navigation Placement
- **Primary Route**: `/faq` (`src/app/[locale]/(public-pages)/faq/page.tsx`)
- **Navigation**:
  - Placed in the **Footer** under the **Help** section (`paths.faq.path`).
  - Managed via central routing config in [src/config/paths.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/paths.ts).

### 2. Design Standards & Typography
- Follows the About Us page layout rhythm (`mx-auto max-w-3xl` with top primary accent bar).
- Features top-level [BackButton](file:///d:/data/learning/work/real-work/art-space-next/src/components/common/back-button.tsx) powered by `useSafeBack` for seamless browser history restoration with fallback to `/`.
- Top-level card and question headings use **semi-bold** (`font-semibold`) per repository standard.
- Fully internationalized across English (`en`) and Burmese (`my`) via `next-intl` namespaces.

