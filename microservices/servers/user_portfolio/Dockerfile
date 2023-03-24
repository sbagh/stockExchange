# use Node.js runtime as a parent image
FROM node:18.12

# set up /app as a working directory
WORKDIR /app

# copy dependencies to working directory
COPY package*.json ./

# install dependencies
RUN npm install

# copy rest of files
COPY . .

# expose port the microservice is running on
EXPOSE 4001

# Start the applicatoin
CMD ["npm", "start"]




