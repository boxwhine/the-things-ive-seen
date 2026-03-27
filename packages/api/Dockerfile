# Prod docker build file

FROM node:22-slim

# Required for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set app directory
WORKDIR /usr/src/app

EXPOSE 4000

ENV PATH /node_modules/.bin:$PATH

ENV NODE_ENV production

RUN corepack enable

# Install app dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Generate Prisma client
COPY prisma ./prisma/
RUN pnpm run generate

CMD [ "pnpm", "start" ]
