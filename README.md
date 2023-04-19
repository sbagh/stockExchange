# Stock Exchange

Stock exchange full-stack app.

Watch the demo here: https://www.youtube.com/watch?v=fi1zDjc1_h8 

### Tech stack in local build:

Local Build: Node.js/Express, React, PostgreSQL, RabbitMQ, Socket.io

Cloud Build in progress: AWS S3, Lambda, RDS, SQS, SNS, API gateway, Docker, ECS + local build

### Running the project locally

-  Install react and node modules
-  Start each microservice's index.js and start react
-  Create DBs locally and add records to user_accounts, user_portfolio, stock_data
-  Local build uses rabbitMQ, download, install and start it
-  In the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that have a status of "Open".

### Completed work:

Functional Requirements:

-  Signup and login to the application
-  Switch between users and view each user's portfolio and trade history
-  See the latest stock prices
-  Set buy and sell orders, which are matched by highest buy to highest sell order and drive the price of a stock similar to a real stock exchange
-  See the order status of a trade (Pending, Open, Filled, Canceled) and cancel 'Open' trade orders

Infrastructure and non functional reqiurements:

-  Migrated data storage from local JSON files to a PostgreSQL database
-  Refactored application from a monolith to a microservices architecture
-  Created 5 microservices: user accounts, user portfolio, stock data, stock ordering, and order matching
-  Implemented communication between microservices using RabbitMQ through the AMQP protocol
-  Implemented websockets using socket.io to provide real-time updates to the browser
-  Implemented a user signup and login authentication system using a JWT, libraries used are jsonwebtoken for signing, argon2 for hashing and verifying passwords, and crypto for secret key generation

### Next steps:

-  Currently attempting to host serverlessly on AWS using:
   -  S3 for hosting the react app
   -  Lambda for back-end files
   -  RDS (postgreSQL) for data storage
   -  SQS and SNS for messaging between microservices, replacing RabbitMQ in the local build
   -  API gateway as a layer between S3 and lambdas
   -  Replacing rabbitMQ in the local build with Amazon SNS and SQS
-  Implementing caching, deploying microservices in docker containers, ensuring stateless services, and creating circuit breakers
-  Simulating a high load of trade orders to test and improve the systems capabilities
-  Build next features

### High level system design for AWS build:

<img width="1245" alt="Screen Shot 2023-03-02 at 6 59 01 AM" src="https://user-images.githubusercontent.com/52921619/222810242-33159bfc-c21d-4a5b-b285-f711f8527d66.png">
