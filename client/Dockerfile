FROM node:16.20.2

WORKDIR /usr/app

EXPOSE 3000

ENV PATH /node_modules/.bin:$PATH

COPY package*.json .npmrc ./

RUN npm i -qy

CMD ["npm", "start"]
