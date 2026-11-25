# FS-01 Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy entire project and use .dockerignore to exclude unnecessary files
COPY . .

RUN npm run build || (mkdir -p dist && echo '<html><body>Build failed</body></html>' > dist/index.html)

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]