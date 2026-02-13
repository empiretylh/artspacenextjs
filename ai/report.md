# Code Quality Report

Date: 2026-02-13

## Legend
- [ ] Not fixed
- [x] Fixed

## Critical
- [x] Re-enable TypeScript build errors (`next.config.ts`)
- [ ] Split env into `env.server` and `env.client` to avoid bundling `dotenv` in client (`src/config/env.ts`, `src/lib/analytics.ts`, `src/features/auth/auth-initializer.tsx`, `src/lib/api-client.ts`)
- [ ] Store auth tokens securely (avoid non-HttpOnly access token in `artspace_auth_session`) (`src/app/api/auth/*`, `src/lib/api-client.ts`)

## High
- [ ] Replace `react-router` usage with Next App Router APIs (`src/features/posts/page/post-page.tsx`, `src/features/posts/page/post-edit-page.tsx`, `src/features/gallery/components/gallery-layout.tsx`)
- [ ] Harden API proxy to forward status/headers and handle non-JSON (`src/app/api/proxy/[...path]/route.ts`)
- [ ] Remove or guard production `console.log` statements (multiple files)

## Medium
- [ ] Reduce `any` usage in core components and API types (multiple files)
- [ ] Remove or implement empty hook (`src/hooks/use-theme.tsx`)
- [ ] Remove/relocate legacy `.old` and test files in production tree (`src/features/profile/pages/profile-artworks-page.old.tsx`, `src/components/app/profile/test.tsx`)

## Low
- [ ] Fix typos in file names (`scroll-contianer.tsx`, `input-with-left-seletct.tsx`)
- [ ] Clean up unused variables (e.g. `src/features/auth/auth-initializer.tsx`)
