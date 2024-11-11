# Use Node.js 20.12.2 as the base image
FROM node:20.12.2

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies, including devDependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the Vite development server port
EXPOSE 5173

# Set environment variable for Vite to listen on all network interfaces
ENV HOST 0.0.0.0

# Command to run the Vite development server
CMD ["npm", "run", "dev"]
