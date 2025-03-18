FROM node:20 AS builder

ENV TZ America/Santiago

RUN apt update && apt upgrade -y && apt install libssl-dev -y --no-install-recommends && apt clean

WORKDIR /build

COPY . .

RUN npm i -g npm
RUN npm i
RUN npm run build --prod

FROM node:20-slim

RUN apt update && apt upgrade -y && apt install openssl -y --no-install-recommends && apt clean

WORKDIR /app

COPY --chown=node:node --from=builder /build/dist ./dist
COPY --chown=node:node --from=builder /build/package.json .
COPY --chown=node:node --from=builder /build/package-lock.json .

RUN npm i -g npm
RUN npm i --omit=dev

ENV TZ America/Santiago

CMD ["npm", "run", "start:prod"]
