# Builder
FROM node:20-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=development

COPY . .

RUN npm run build

# Production
FROM node:20-alpine as base

WORKDIR /usr/src/app

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /usr/src/app /usr/src/app

USER app

EXPOSE 3000

CMD ["node", "dist/src/server.js"]

# Development
FROM base as dev

USER root

RUN npm install --only=development

USER app

EXPOSE 3000

CMD ["npm", "run", "dev"]
