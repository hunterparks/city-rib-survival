FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

ARG ARG_VERSION=0.0.0

ENV VERSION=$ARG_VERSION

RUN npm install

COPY --chown=node:node . .

RUN npm run build

CMD ["node", "dist/index.js"]