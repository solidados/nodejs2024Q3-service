# Stage 1: Build
FROM node:22-alpine3.18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

# Stage 2: Final (Production)
FROM node:22-alpine3.18 as runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["npm", "run", "start"]

#FROM node:22-alpine3.18
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN npm ci && npm cache clean --force
#
#COPY . .
#
#EXPOSE 4000
#CMD ["sh", "-c", "npm run prisma:init && npm run start"]
