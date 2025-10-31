# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (currently none, but this ensures future dependencies are installed)
RUN npm install --production 2>/dev/null || echo "No dependencies to install"

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment variable
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
