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

# Debug: Show environment and verify node_modules
RUN echo "=== Environment ===" && \
    env | sort && \
    echo "=== Node and NPM Versions ===" && \
    node --version && npm --version && \
    echo "=== Node Modules Contents ===" && \
    ls -la node_modules/.bin/next || echo "next binary not found in node_modules/.bin"

# Build the application with explicit error handling
RUN npm run build || (echo "Build failed" && exit 1)

# Verify the build output and standalone directory
RUN echo "=== Build Output ===" && \
    ls -la .next && \
    echo "=== Standalone Directory ===" && \
    if [ ! -d ".next/standalone" ]; then \
        echo "Standalone directory not found - build may have failed" && exit 1; \
    fi && \
    ls -la .next/standalone

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Verify the server.js file exists
RUN if [ ! -f "server.js" ]; then \
        echo "server.js not found in standalone output" && exit 1; \
    fi

# Set permissions
RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 3000

# Use node to run the server directly
CMD ["node", "server.js"] 