# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build TypeScript
RUN npm run build

# Move data directory into dist so it is available at runtime
RUN cp -r data dist/

# Remove devDependencies for smaller image
RUN npm prune --production

# Expose port (default for Express)
EXPOSE 3000

# Start the app
CMD ["node", "dist/src/adapters/http/index.js"]
