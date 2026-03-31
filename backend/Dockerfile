FROM node:22-alpine AS builder

WORKDIR /app

COPY . ./

RUN npm ci

RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY ./prisma ./prisma
COPY .env ./
COPY dev.db ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/server.js"]