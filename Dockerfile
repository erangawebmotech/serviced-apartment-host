# Stage 1: Build the Vite React app
FROM node:22-alpine AS builder

# 🛠️ Accept build argument from Jenkins
ARG BUILD_ENV

# Set working directory
WORKDIR /app

# # Copy the .env file and rename to .env.development
# COPY .env .env.${BUILD_ENV}

# Install dependencies
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
RUN npm install

# Copy rest of the source code
COPY . .

# Build the app
RUN echo "👉 BUILD_ENV is: ${BUILD_ENV}"
# RUN npm run build:${BUILD_ENV}
RUN npm run build:staging

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove default static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Uncomment below if using React Router or other SPA routes
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
