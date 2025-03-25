# Use Node.js as the base image
FROM node:22-alpine
# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port for Next.js
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start"]
