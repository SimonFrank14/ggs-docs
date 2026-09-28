FROM node:22-alpine AS base

# Deps
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# Ohne Skripte: Das postinstall (fumadocs-mdx) braucht die Inhalte, die erst im
# Builder da sind. Nur die nativen Pakete bauen wir nach.
RUN npm ci --ignore-scripts && npm rebuild esbuild sharp

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Markdown-Quellen für llms.txt und „Markdown kopieren" (lib/llm.ts)
COPY --from=builder --chown=nextjs:nodejs /app/content/docs ./content/docs
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
