FROM node:16-alpine

# Set working directory\ nWORKDIR /app
FROM node:23-alpine
# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start development server (for production use build & serve static files)
CMD ["npm", "run", "dev"]