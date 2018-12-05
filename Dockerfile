# stage: 1
FROM node:10 as react-build
WORKDIR /src
COPY . ./
RUN npm i
RUN npm run-script build

# Stage 2 - the production environment
FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /src/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]