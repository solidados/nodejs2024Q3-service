# Stage 1: Build
FROM node:22-alpine3.18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN sh -c "npm ci --prefer-offline --no-audit && npm cache clean --force"

COPY . .

RUN npm run build

# Stage 2: Final (Production)
FROM node:22-alpine3.18 as runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/doc/api.yaml ./doc/api.yaml

RUN npm ci --only=production && npm cache clean --force

EXPOSE 4000
CMD ["sh", "-c", "npm run prisma:init && npm run start:prod"]
