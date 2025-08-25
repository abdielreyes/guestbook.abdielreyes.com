# Dockerfile for SvelteKit + Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --frozen-lockfile --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.svelte-kit ./.svelte-kit
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]
