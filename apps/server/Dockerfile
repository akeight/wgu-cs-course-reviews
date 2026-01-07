FROM node:22-alpine

WORKDIR /app

# Enable pnpm via corepack (included with recent Node images)
RUN corepack enable

# Install dependencies in production mode using the lockfile
COPY package.json pnpm-lock.yaml ./
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile --prod

# Copy source
COPY . .

EXPOSE 3000
CMD ["node", "src/server.js"]