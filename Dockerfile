FROM node:22-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 4000
CMD ["sh", "-c", "npm run prisma:init && npm run start"]

## Stage 1: Build
#FROM node:18-alpine as builder
#
#WORKDIR /app
#
#COPY ["package.json", "package-lock.json*", "./"]
#
#RUN npm ci && npm cache clean --force
#
#COPY . .
#
#RUN npm run build
#
## Stage 2: Final (Production)
#FROM node:18-alpine as runner
#
#WORKDIR /app
#
#COPY --from=builder /app .
#
#RUN npm ci --only=production && npm cache clean --force
#
#COPY --from=builder /app/dist /app/dist
#
#EXPOSE 4000
#CMD ["npm", "run", "start:home-library"]
