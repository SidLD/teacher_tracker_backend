FROM node:18-alpine

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY package*.json ./

RUN chown -R node:node /app

USER node

RUN npm install --pure-lockfile

COPY . .

CMD ["npm", "run", "dev"]