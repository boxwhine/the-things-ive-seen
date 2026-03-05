FROM node:18.19.0

WORKDIR /usr/app

EXPOSE 3000

ENV PATH /node_modules/.bin:$PATH

COPY package*.json .npmrc ./

RUN npm i -qy

CMD ["npm", "start"]
