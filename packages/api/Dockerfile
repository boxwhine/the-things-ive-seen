FROM node:24.14.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# -- Install api deps and build --
FROM base AS build
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/api/package.json ./packages/api/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @ttis/api...

COPY packages/api ./packages/api
RUN pnpm --filter @ttis/api build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm deploy --legacy --filter=@ttis/api --prod /prod/api

# -- Runtime image --
FROM base AS runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /prod/api/node_modules ./node_modules
COPY --from=build /prod/api/package.json ./package.json
COPY --from=build /app/packages/api/build ./build
COPY --from=build /app/packages/api/prisma/schema.prisma ./build/prisma/schema.prisma
COPY --from=build /app/packages/api/prisma/migrations ./build/prisma/migrations
EXPOSE 4000
CMD ["node", "./build/src/index.js"]
