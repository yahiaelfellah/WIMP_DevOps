# Use a base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# # Install webpack globally
# RUN npm install -g webpack webpack-cli

# Copy the rest of the application code to the container and clean up unnecessary files
COPY . .

# # Build the application using Webpack
# RUN webpack --mode development --config webpack.config.js

# Expose port 80 (or the port your application listens on)
EXPOSE 3001

# Specify the command to run when the container starts
CMD [ "npm", "start" ]
