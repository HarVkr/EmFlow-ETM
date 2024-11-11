# Use Node.js 20.12.2 as the base image
FROM node:20.12.2

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./
RUN npm install 


# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to run the backend server
CMD ["node", "Server.js"]
