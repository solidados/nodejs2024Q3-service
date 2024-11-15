FROM node:22-alpine
LABEL authors="solidados"

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

CMD ["npm", "run", "start:home-library"]
