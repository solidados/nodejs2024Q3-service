FROM node:22-alpine
LABEL authors="solidados"

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]

# ENTRYPOINT ["top", "-b"]
