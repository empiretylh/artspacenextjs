# Myanmar Art Space (Frontend)

Myanmar Art Space is a social media and e-commerce platform focused on showcasing Myanmar artists, galleries, collectors, and curated collections. This repository contains the Next.js frontend application, including public discovery pages and authenticated dashboards for commerce, orders, and user management.

## 📖 Documentation (Start Here)
To ensure consistent development and AI-efficiency, please refer to:
- **[AGENTS.md](./AGENTS.md)**: Global coding policies, navigation rules, and "Source of Truth" pointers.
- **[src/README.md](./src/README.md)**: The **Universal Map** of the project architecture and standard data flow.

---

## 🏗️ Tech Stack
- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4** + Radix UI
- **TanStack Query** (Data Fetching), **Zustand** (Session State)
- **Zod** (Validation), **React Hook Form** (Form Logic)

## 🚀 Getting Started
1. Install dependencies: `npm install`
2. Create environment file: `cp .env.example .env` (Update values accordingly).
3. Start dev server: `npm run dev`
4. Visit `http://localhost:3000`.

## 📂 Project Structure (The Three Pillars)
The project follows a vertical-slice architecture. See the [Universal Map](./src/README.md) for details.
- **`src/app` (The Shell)**: Routing, layouts, and page-level composition.
- **`src/features` (The Muscles)**: Vertical feature slices (`auth`, `artwork`, `orders`). Contains all business logic.
- **`src/components` (The Skin)**: Shared, generic UI primitives (shadcn).
- **`src/features/service` (The Data Hub)**: Centralized API implementation for the entire app.

## 🔑 Environment Variables
Validated in `src/config/env.ts`.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API. |
| `NEXT_PUBLIC_APP_URL` | Public site URL for canonical SEO. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID. |
| `NEXT_PUBLIC_IMAGE_HOSTNAME` | Allowed hostname for Next.js Image optimization. |

## 📦 Features & Docs
- **Authentication**: Backend JWT + Firebase Synchronization. [Auth Guide](./src/features/auth/README.md).
- **Real-time Chat**: Powered by Firebase Firestore. [Firebase Guide](./docs/firebase.md).
- **Artwork Engine**: Grid catalogs and complex submission forms. [Artwork Guide](./src/features/artwork/README.md).
- **Ecommerce**: Orders, tracking, and checkout flows. [Orders Guide](./src/features/orders/README.md).

## 📊 Analytics
Google Analytics is wired via `@next/third-parties`. Standardized tracking is implemented in `src/lib/analytics.ts`.
👉 **[Full Analytics Reference](./docs/analytics_reference.md)**

## ✅ Contributing
1. Always check [AGENTS.md](./AGENTS.md) before starting a task.
2. Update the relevant feature `README.md` if you change its architecture.
3. Run `npm run lint` before opening a PR.
