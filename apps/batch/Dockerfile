FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
COPY apps/batch/package.json ./apps/batch/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/tokens/package.json ./packages/tokens/
RUN npm install --workspace=@airport-app/batch --workspace=@airport-app/types --workspace=@airport-app/utils --workspace=@airport-app/tokens

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx turbo build --filter=@airport-app/batch

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/apps/batch/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY apps/batch/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
