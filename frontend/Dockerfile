# Use an official Node runtime as a parent image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the app's source code
COPY . .

# Copy the .env file (if needed)
# COPY .env ./

# Build the React app
RUN yarn build

# Serve the app (optional: if using a server like Nginx)
RUN yarn global add serve
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000
