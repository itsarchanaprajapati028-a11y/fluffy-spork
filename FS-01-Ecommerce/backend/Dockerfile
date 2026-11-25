# FS-01 Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

EXPOSE 5000

CMD ["node", "src/index.js"]