# Prod docker build file

FROM node:10.15.3-slim

# Set app directory
WORKDIR /usr/src/app

EXPOSE 4000

# Since `node_modules` dir is in root and our app lives under `/src`
# we need to add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

ENV NODE_ENV production

# Install app dependencies
COPY package*.json ./

RUN npm ci

# this won't work currently since it's going to try to run `tsc` which
# shouldn't exist on a node-slim image.  Maybe do a 2 stage build: #1 transpile
# typescript then #2 host JS files?
CMD [ "npm", "start" ]
