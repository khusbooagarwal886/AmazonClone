# ==========================================
# Stage 1: Build TypeScript into JavaScript
# ==========================================
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy package manifests first to take advantage of Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including typescript and @types devDependencies)
RUN npm ci

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to JavaScript (creates /app/dist)
RUN npm run build


# ==========================================
# Stage 2: Lean Production Runtime
# ==========================================
FROM node:20-alpine AS runner

# Set working directory inside container
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package manifests
COPY package*.json ./

# Install ONLY production dependencies (ignoring devDependencies)
RUN npm ci --omit=dev

# Copy compiled JavaScript output from the builder stage
COPY --from=builder /app/dist ./dist

# Document that container listens on port 5000
EXPOSE 5000

# Command to execute when the container starts
CMD ["node", "dist/index.js"]
