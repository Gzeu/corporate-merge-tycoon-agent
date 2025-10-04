# Corporate Merge Tycoon Agent - Production Dockerfile
# Multi-stage build for optimized production image
# Author: George Pricop (@Gzeu)

# Stage 1: Dependencies and Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application (if needed)
RUN npm run build 2>/dev/null || echo "No build script found, skipping..."

# Stage 2: Production Runtime
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application and dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/catalog ./catalog
COPY --from=builder --chown=nodejs:nodejs /app/examples ./examples

# Copy additional files if they exist
COPY --from=builder --chown=nodejs:nodejs /app/VERSION ./VERSION 2>/dev/null || echo "1.0.0" > ./VERSION
COPY --from=builder --chown=nodejs:nodejs /app/LICENSE ./LICENSE 2>/dev/null || true
COPY --from=builder --chown=nodejs:nodejs /app/CHANGELOG.md ./CHANGELOG.md 2>/dev/null || true

# Create logs directory
RUN mkdir -p /app/logs && chown nodejs:nodejs /app/logs

# Set environment variables
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV API_PORT=3000
ENV API_HOST=0.0.0.0

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "src/agent.js"]

# Metadata
LABEL maintainer="George Pricop <pricopgeorge@gmail.com>"
LABEL version="1.0.0"
LABEL description="Corporate Merge Tycoon Agent - Blockchain-powered M&A simulation on MultiversX"
LABEL org.opencontainers.image.source="https://github.com/Gzeu/corporate-merge-tycoon-agent"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.title="Corporate Merge Tycoon Agent"
LABEL org.opencontainers.image.description="Enterprise-grade blockchain agent for corporate M&A simulation"
LABEL org.opencontainers.image.vendor="George Pricop"
LABEL blockchain.network="MultiversX"
LABEL blockchain.tokens="ESDT"
LABEL gaming.genre="Corporate Simulation"
LABEL architecture="Microservices"