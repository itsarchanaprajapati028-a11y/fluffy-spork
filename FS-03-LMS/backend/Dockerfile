# FS-03 Backend Dockerfile
FROM node:18-bullseye-slim

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

EXPOSE 5001

CMD ["node", "backend/src/index.js"]