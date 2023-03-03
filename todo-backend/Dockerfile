# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 for the application
EXPOSE 5000

# Specify the command to run when the container starts
CMD [ "npm", "start" ]
