FROM node:22-slim

WORKDIR /usr/app

EXPOSE 3000

ENV PATH /node_modules/.bin:$PATH

RUN corepack enable

COPY package.json ./

RUN pnpm install

CMD ["pnpm", "dev"]
