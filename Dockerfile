FROM node:20 AS build

WORKDIR /usr/src/app

COPY package.json yarn.lock .
RUN yarn

COPY . .
RUN npx quasar b

FROM nginx:latest

COPY --from=build /usr/src/app/dist/spa/ /usr/share/nginx/html/
