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
- **Nextjs Toploader** (Navigation Progress)
- **Myanmar Language Font Support**: Seamless integration of `Noto_Sans_Myanmar` via `next/font/google` and `MasterpieceUniRound` as dynamic fallbacks, with line-height collision prevention applied to the layout and form elements.

## 🚀 Getting Started
### Local Development
1. Install dependencies: `npm install`
2. Create environment file: `cp .env.example .env` (Update values accordingly).
3. Start dev server: `npm run dev`
4. Visit `http://localhost:3000`.

### Docker (Local Testing)
The project is configured with a multi-stage Docker build utilizing Next.js `standalone` mode for optimal performance.
1. Build and run via Docker Compose (`next build` reads its env at build time, so the file must arrive as an argument):
   ```bash
   export CLIENT_ENV_B64="$(base64 -i .env | tr -d '\n')"   # Linux: base64 -w0 .env
   docker compose up --build -d
   ```
2. The app will be available at `http://localhost:3000`.

### Production deploy (GitHub Actions -> GHCR -> EC2)
`.github/workflows/launch_to_ec2.yml` runs on every push to `production` in two jobs:

1. **build** — `docker/build-push-action` on the runner, pushed to `ghcr.io/empiretylh/artspacenextjs` as `:production` and as the immutable commit sha. BuildKit layer cache lives in the GitHub Actions cache, so a no-source-change rebuild is a few seconds instead of a full `npm ci`.
2. **deploy** — SSH through the bastion, `git` sync (the server still needs `docker-compose.yml`), then `docker compose pull app` and `up -d --no-build` with `IMAGE_TAG=<sha>`, and a `curl` health check on `:3000`. Nothing is compiled on EC2 any more.

Repository secrets/variables:

| Name | Required | Purpose |
| --- | --- | --- |
| `CLIENT_ENV_B64` | yes | base64 one-liner of the production env file. `src/config/env.ts` hard-requires `NEXT_PUBLIC_API_URL`/`NEXT_PUBLIC_APP_URL`, and `src/lib/firebase-admin.ts` initializes the service account at import, so `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` must be present for the build to finish. The file only ever exists in the builder stage. |
| `GHCR_PULL_TOKEN` | only if the package is private | fine-grained PAT with `read:packages` on this repo, used for `docker login ghcr.io` on EC2. A public package needs no login, and the deploy skips it when the secret is empty. |
| `EC2_SSH_PRIVATE_KEY`, `EC2_SSH_PASSPHRASE`, `BASTION_HOST`, `EC2_HOST`, `EC2_USER`, `EC2_PROJECT_PATH` | already in use | unchanged from the previous workflow. |

`.env.production` stays on the server as the runtime `env_file`; only the build inputs moved to CI.

Before the first run, check the instance architecture and match it to `platforms:` in the workflow (`uname -m`: `x86_64` -> `linux/amd64`, `aarch64` -> `linux/arm64`), otherwise the container fails with an exec format error.

Roll back to an earlier commit without rebuilding:

```bash
sudo env IMAGE_TAG=<old-commit-sha> docker compose pull app
sudo env IMAGE_TAG=<old-commit-sha> docker compose up -d --no-build app
```

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
 