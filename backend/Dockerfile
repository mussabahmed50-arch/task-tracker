# 1. Base image: Node.js 22 on Alpine Linux (small and secure)
FROM node:22-alpine

# 2. Working folder inside the container
WORKDIR /app

# 3. Copy only the dependency list first (better caching)
COPY package*.json ./

# 4. Install only production dependencies (no nodemon)
RUN npm ci --omit=dev

# 5. Copy the application code
COPY src ./src

# 6. Don't run as root
USER node

# 7. Document the port the API listens on
EXPOSE 5000

# 8. Docker checks this URL to know if the API is healthy
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# 9. Start the server
CMD ["node", "src/server.js"]
