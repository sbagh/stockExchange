# Stock Exchange

Stock exchange full-stack app.

## Tech stack

### local build:
-  Node.js/Express, React, PostgreSQL, RabbitMQ, Socket.io

## Running the project locally
-  Install react and node modules
-  Start each microservice's index.js and start react
-  Create DBs locally and add records to user_accounts, user_portfolio, stock_data
-  Current local build uses rabbitMQ, download, install, and start it
-  In the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that have a status of "Open".

## Completed tasks

### functional requirements
-  Switch between users and view each user's portfolio and trade history
-  See the latest stock prices
-  Set buy and sell orders, which are matched by highest buy to highest sell order and drive the price of a stock similar to a real stock exchange
-  See the order status of a trade (Pending, Open, Closed, Canceled) and cancel 'Open' trade orders

### non functional reqiurements
-  Migrated data storage from local JSON files to a PostgreSQL database
-  Refactored application from a monolith to a microservices architecture:
-  Created 5 microservices are: user accounts, user portfolio, stock data, stock ordering, and order matching
-  Implemented communication between microservices through RabbitMQ using the AMQP protocol
-  Implemented websockets using socket.io to provide real-time updates to the browser, including stock prices, order status, and user portfolio updates

## Next steps:

-  Hosting the appserverlessly on AWS and replacing rabbitMQ in the local build with Amazon SNS and SQS:
    - set up docker images and containers
-  Implementing sound solution architecture principles for performance, security and reliabilit, not limited to caching, deploying microservices in docker containers, ensuring stateless services, and creating circuit breakers
-  Simulating a high load of trade orders to test and improve the systems capabilities
-  Developing a live paper-trading feature by connecting to real-time stock data API such as polygon.io, and re-using code from the original stock exchange app

## System Diagram
### High level system design for AWS build:

<img width="1245" alt="Screen Shot 2023-03-02 at 6 59 01 AM" src="https://user-images.githubusercontent.com/52921619/222810242-33159bfc-c21d-4a5b-b285-f711f8527d66.png">
