FROM node:22-alpine
LABEL authors="solidados"

WORKDIR /app

RUN npm ci
RUN npm cache clean --force
RUN npm run build

COPY ["package.json", "package-lock.json*", "./"]
COPY . .

CMD ["npm", "run", "start:dev"]

# ENTRYPOINT ["top", "-b"]
