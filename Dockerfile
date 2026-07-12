# Stage 1: Build the React client application
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source code
COPY client/ ./

# Define build arguments for Firebase (Vite embeds these at build time)
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Set environment variables for build process
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

# Build the client static bundle (outputs to /app/client/dist)
RUN npm run build

# Stage 2: Set up the production Express API server
FROM node:20-alpine
WORKDIR /app

# Copy server package configuration and install production dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Copy built frontend assets from Stage 1 to /app/client/dist
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose port 8000 (fallback, Cloud Run will inject PORT env var)
EXPOSE 8000
ENV PORT=8000
ENV NODE_ENV=production

# Start the Node.js API server
CMD ["node", "app.js"]
