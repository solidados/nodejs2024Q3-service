# Stage 1
FROM node:20-alpine
#FROM node:20.11-alpine3.19 as builder

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci && npm cache clean --force

COPY . .

# RUN npm run build
#RUN npm run prisma:init && npm run start

EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:init && npm run start"]

# Stage 2

#FROM node:20.11-alpine3.19 as runner

#WORKDIR /app

#COPY --from=builder /app .

#CMD [ "npm", "run", "start:home-library" ]
