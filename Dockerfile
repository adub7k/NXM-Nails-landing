# TanStack Start SSR site. Railpack/Nixpacks misdetect it as a static Vite app
# (they look for /app/dist); it actually builds to .output. Build with Bun, run on Node.

# ---- Build stage ----
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build:railway

# ---- Runtime stage ----
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
CMD ["node", ".output/server/index.mjs"]
