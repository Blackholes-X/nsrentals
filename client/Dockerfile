# Use an official Node.js runtime as the base image
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Set environment variable
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install your app dependencies using Yarn
RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the app for production using Yarn
RUN yarn build

# Use the Nginx image to serve the built app
FROM nginx:alpine

# Copy the build output to replace the default Nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Use the default Nginx command to serve the content
CMD ["nginx", "-g", "daemon off;"]
