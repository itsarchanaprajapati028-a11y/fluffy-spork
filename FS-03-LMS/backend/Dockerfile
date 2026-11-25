# FS-03 Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

EXPOSE 5001

CMD ["node", "src/index.js"]