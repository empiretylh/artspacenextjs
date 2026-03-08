# Myanmar Art Space (Frontend)

Myanmar Art Space is a social media and e-commerce platform focused on showcasing Myanmar artists, galleries, collectors, and curated collections. This repository contains the Next.js frontend application, including public discovery pages and authenticated dashboards for commerce, orders, and user management.

## Highlights
- Public discovery pages for artists, galleries, collections, artworks, and events.
- Authenticated experiences for cart, checkout, orders, profile, and settings.
- Responsive UI built with Tailwind CSS and Radix UI components.
- Client state handled with TanStack Query, React Hook Form, and Zustand.
- SEO-friendly metadata, sitemap, robots, and Open Graph assets.

## Tech Stack
- Next.js 16 (App Router) + React 19
- TypeScript + ESLint
- Tailwind CSS 4 + Radix UI
- TanStack Query, React Hook Form, Zod
- Zustand, DnD Kit, Framer Motion

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your environment file:
   ```bash
   cp .env.example .env
   ```
3. Update values in `.env`.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000`.

## Environment Variables
These are validated in `src/config/env.ts`.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for the backend API. |
| `NEXT_PUBLIC_APP_URL` | Yes | Public site URL, used for canonical URLs/SEO. |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | No | Set to `true` to enable Google Analytics. |
| `NEXT_PUBLIC_GA_ID` | Conditionally | Required when analytics are enabled. |
| `NEXT_PUBLIC_ENABLE_API_MOCKING` | No | Enable mock API support when available. |
| `NEXT_PUBLIC_MOCK_API_PORT` | No | Port for mock API (defaults to `8080`). |
| `NODE_ENV` | No | `development` or `production` (defaults to `development`). |
| `IMAGE_HOSTNAME` | No | Allowed hostname for Next.js image optimization. |

## Project Structure
- `src/app` - App Router routes, layouts, metadata, and API handlers.
- `src/features` - Feature-specific UI and logic (auth, artwork, events, cart, orders).
- `src/components` - Shared UI components and layout primitives.
- `src/lib` - Shared utilities, API clients, and helpers.
- `src/hooks` - Custom React hooks.
- `src/config` - Environment, route paths, and query keys.
- `src/mocks` - Local mock data for development.
- `public` - Static assets (icons, screenshots, PWA assets).

## Scripts
- `npm run dev` - Start the local dev server.
- `npm run build` - Create a production build.
- `npm run start` - Serve the production build.
- `npm run lint` - Run ESLint.

## Analytics
Google Analytics is wired via `@next/third-parties` in `src/app/layout.tsx`. Set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` and provide `NEXT_PUBLIC_GA_ID` to enable tracking. Enhanced Measurement handles page views automatically.

### Event Tracking Usage

The application uses a centralized analytics utility (`src/lib/analytics.ts`) to track specific user interactions and product metrics via Google Analytics.

**How to use:**
Import the relevant analytics module from `src/lib/analytics.ts` and call its methods. 
```typescript
import { authAnalytics } from '@/lib/analytics'

// Track user login
authAnalytics.login({ method: 'email', source: 'sign_in_page' })
```

👉 **[See the Full Analytics Event Reference](./docs/analytics_reference.md) for a complete list of events, payload schemas, and data types sent to the Dashboard/Data teams.**

## Deployment
1. Set all required environment variables in your hosting platform.
2. Run `npm run build`.
3. Serve the app with `npm run start` (or your platform's Next.js runtime).

## Contributing
1. Create a feature branch from `main`.
2. Keep changes scoped and formatted.
3. Run `npm run lint` before opening a PR.

## Support
If you run into issues, capture the exact error message, Node.js version, and steps to reproduce.
