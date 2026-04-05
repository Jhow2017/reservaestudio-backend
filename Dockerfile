FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn prisma generate
RUN yarn build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

RUN yarn prisma generate

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start:prod"]
