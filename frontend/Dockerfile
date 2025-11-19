# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 g++ make

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2: Serve the app
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
