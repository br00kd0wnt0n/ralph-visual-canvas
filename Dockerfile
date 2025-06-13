FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set build environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SHARP_PATH=/app/node_modules/sharp

# Debug: Show environment
RUN echo "=== Environment ===" && \
    env | sort && \
    echo "=== Node and NPM Versions ===" && \
    node --version && npm --version && \
    echo "=== Build Directory Contents ===" && \
    ls -la && \
    echo "=== Node Modules Contents ===" && \
    ls -la node_modules || echo "node_modules not found"

# Build the application
RUN npm run build

# Verify the build output
RUN echo "=== Build Output ===" && \
    ls -la .next && \
    echo "=== Standalone Directory ===" && \
    ls -la .next/standalone || echo "standalone directory not found"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
RUN mkdir .next
RUN chown -R nextjs:nodejs .next
RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"] 