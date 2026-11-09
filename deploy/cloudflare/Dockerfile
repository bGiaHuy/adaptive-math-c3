FROM node:24-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
RUN npm ci --include=dev
COPY packages/contracts ./packages/contracts
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/src ./apps/api/src
RUN npm run prisma:generate && npm run build:api

FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/contracts ./packages/contracts
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY content/thpt-materials ./content/thpt-materials
COPY outputs/thpt-extracted-batches ./outputs/thpt-extracted-batches
ENV NODE_ENV=production PORT=8080 MATH_PROJECT_ROOT=/app
RUN mkdir -p /app/.cache && chown node:node /app/.cache
USER node
WORKDIR /app/apps/api
EXPOSE 8080
CMD ["node", "dist/main.js"]
