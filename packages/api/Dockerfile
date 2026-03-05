# Prod docker build file

FROM node:22-slim

# Set app directory
WORKDIR /usr/src/app

EXPOSE 4000

ENV PATH /node_modules/.bin:$PATH

ENV NODE_ENV production

RUN corepack enable

# Install app dependencies
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# this won't work currently since it's going to try to run `tsc` which
# shouldn't exist on a node-slim image.  Maybe do a 2 stage build: #1 transpile
# typescript then #2 host JS files?
CMD [ "pnpm", "start" ]
