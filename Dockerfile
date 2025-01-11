FROM node:16 as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g npm@9.9.2
# Copy the entire app source code
COPY . .

# Build the Angular application
EXPOSE 80

