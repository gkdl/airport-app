FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/tokens/package.json ./packages/tokens/
RUN npm install --workspace=@airport-app/api --workspace=@airport-app/types --workspace=@airport-app/utils --workspace=@airport-app/tokens

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx turbo build --filter=@airport-app/api

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main"]
