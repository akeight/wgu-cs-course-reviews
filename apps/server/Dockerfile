FROM node:22-alpine

WORKDIR /app

# Install dependencies in production mode using npm + package-lock
COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Copy source
COPY . .

EXPOSE 3000
CMD ["node", "src/server.js"]