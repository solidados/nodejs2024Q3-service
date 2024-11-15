FROM node:22-alpine
LABEL authors="solidados"

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
COPY prisma doc ./

RUN npm ci && npx prisma generate && npm cache clean --force

COPY --chown=node:node . .

# RUN npm run build

CMD ["npm", "run", "start:dev"]

# ENTRYPOINT ["top", "-b"]
