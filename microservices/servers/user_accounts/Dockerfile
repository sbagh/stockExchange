# use Node.js runtime as a parent image
FROM node:18.12

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm Install

# Copy rest of microservice code to the working directory
COPY . .

# Expose port that microserivce is running on
EXPOSE 4000

# Start the applicatoin
CMD ["npm", "start"]