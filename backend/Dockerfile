FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source
COPY src/ ./src/
COPY .env* ./

EXPOSE 5000

CMD ["node", "src/server.js"]
