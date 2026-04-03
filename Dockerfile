FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# -- Install all deps and build everything --
FROM base AS build
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --legacy --filter=@ttis/api --prod /prod/api
RUN pnpm deploy --legacy --filter=@ttis/ui --prod /prod/ui

# -- API production image --
FROM base AS api
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /prod/api/node_modules ./node_modules
COPY --from=build /prod/api/package.json ./package.json
COPY --from=build /app/packages/api/build ./build
EXPOSE 4000
CMD ["node", "./build/src/index.js"]

# -- UI production image --
FROM base AS ui
WORKDIR /app
COPY --from=build /app/packages/ui/.next/standalone ./
COPY --from=build /app/packages/ui/.next/static ./packages/ui/.next/static
EXPOSE 3000
CMD ["node", "packages/ui/server.js"]
