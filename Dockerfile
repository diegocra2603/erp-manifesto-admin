FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the application
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
RUN npm run build

# Production image
FROM base AS runtime
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
