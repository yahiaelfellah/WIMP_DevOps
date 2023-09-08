# Use a base image
FROM node:16-alpine

# Install Python and build-essential
RUN apk add --no-cache python3 make g++

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install webpack globally
RUN npm install -g webpack webpack-cli

# Copy the rest of the application code to the container and clean up unnecessary files
COPY . ./
# Example: RUN rm -rf some-unnecessary-folder
RUN ["ls","-l"]

# # Build the application using Webpack
RUN webpack --mode development --config webpack.config.js

# # Specify the command to run when the container starts
# CMD [ "npm", "start" ]
