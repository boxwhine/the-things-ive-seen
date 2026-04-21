FROM node:24.14.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# -- Install ui deps and build --
FROM base AS build
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ui/package.json ./packages/ui/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @ttis/ui...

COPY packages/ui ./packages/ui
RUN pnpm --filter @ttis/ui build

# -- Runtime image (Next.js standalone output is self-contained) --
FROM base AS runtime
WORKDIR /app
COPY --from=build /app/packages/ui/.next/standalone ./
COPY --from=build /app/packages/ui/.next/static ./packages/ui/.next/static
EXPOSE 3000
CMD ["node", "packages/ui/server.js"]
