# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (if any are added in the future)
RUN npm install --production || true

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment variable
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
