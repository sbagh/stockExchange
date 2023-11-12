# Stock Exchange

Stock exchange full-stack app. Latest build is build 5

Watch the demo here: https://www.youtube.com/watch?v=fi1zDjc1_h8

### 1 - Tech stack

-  Node.js/Express, React, Typescript, PostgreSQL, RabbitMQ, Socket.io

### 2 - Running the project locally

-  Install react and node modules then start each microservice's index.js and start react
-  Create DBs locally and add records to user_accounts, user_portfolio, stock_data
-  Local build uses rabbitMQ, download, install and start it

### 3 - Completed work:

Functional Requirements:

-  Signup and login to the application
-  View each user's portfolio and trade history
-  See the latest stock prices
-  Set buy and sell orders, which are matched by highest buy to highest sell order and drive the price of a stock
-  See the order status of a trade (Pending, Open, Filled, Canceled) and cancel 'Open' trade orders

Infrastructure and non functional reqiurements:

-  Migrated data storage from local JSON files to a PostgreSQL database
-  Refactored application from a monolith to a microservices architecture (user accounts, user portfolio, stock data, stock ordering, order matching)
-  Implemented communication between microservices using RabbitMQ through AMQP
-  Implemented websockets using socket.io to provide real-time updates to the browser
-  Implemented a user signup and login authentication system using a JWT
-  Refactored back-end and front-end to Typescript

### 4 - Next steps:

- Implement a data validaition layer for buy and sell orders
- Host serverlessly on AWS, possibly using:
   -  S3 for hosting the react app
   -  Lambda for back-end files
   -  RDS (postgreSQL) for data storage
   -  SQS and SNS for messaging between microservices, replacing RabbitMQ in the local build
   -  API gateway as a layer between S3 and lambdas
-  Implementing caching, deploying microservices in docker containers, ensuring stateless services, and creating circuit breakers
-  Build next features

### 5 - High level system design for AWS build:

-  local build uses rabbitMQ's direct exchange and fan out exchange:
![Screenshot 2023-11-12 at 12 28 32 PM](https://github.com/sbagh/stockExchange/assets/52921619/9f4b2cf8-e9bc-43ad-b143-2a315d3a42b4)


