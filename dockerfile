FROM node:14.11.0-stretch-slim

COPY src/ src/
COPY package.json package.json
COPY .env .env

RUN npm install pm2 -g
RUN npm install

EXPOSE 5000

CMD pm2-runtime src/index.js
