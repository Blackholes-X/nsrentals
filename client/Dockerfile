# Use an official Node.js runtime as the base image
FROM node:14-alpine as build

# Step 2: Set the working directory in the container
WORKDIR /app

# Set environment variable
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Step 4: Install your app dependencies using the npm binary
RUN npm install

# Step 5: Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Serve the app using a simple web server
# Use the Nginx image to serve the built app
FROM nginx:alpine

# Step 8: Copy the build output to replace the default Nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to the outside once the container has launched
EXPOSE 80

# Step 10: Define the command to run your app using CMD which defines your runtime
# Use the default Nginx command to serve the content
CMD ["nginx", "-g", "daemon off;"]
