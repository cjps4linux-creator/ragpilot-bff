FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev=false

COPY prisma ./prisma
RUN npx prisma generate
RUN npx prisma db push --skip-generate

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
