# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# `next build` inlines every NEXT_PUBLIC_* value into the client bundle, and
# src/config/env.ts throws without API_URL and APP_URL, so the build needs a real
# env file: .dockerignore keeps `.env` out of the context, and compose's env_file
# only reaches the running container, never the build. Anything the build imports
# must be in here — src/lib/firebase-admin.ts initializes the service account at
# import time, so FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY are required at
# build, not just at runtime. They stay in this stage: the runner image copies
# only public/, .next/static and .next/standalone, so /app/.env is never published.
# Base64 because build args are parsed line by line and cannot carry a file:
#   base64 -i .env.production | tr -d '\n'      (macOS)
#   base64 -w0 .env.production                  (Linux)
ARG CLIENT_ENV_B64
RUN printf '%s' "${CLIENT_ENV_B64}" | base64 -d > /app/.env

# Next.js telemetry is disabled
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
