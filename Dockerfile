# Use an official Node runtime as the parent image
FROM node:16-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Make port 3000 available to the outside world
EXPOSE 3000

# Run the application
CMD [ "node", "index.js" ]
