# Stock Exchange

Stock exchange full-stack app.

Tech stack so far in local build: Node/Express, React, PostgreSQL, RabbitMQ, Socket.io

To run project:

-  install react and node.js modules
-  start each microservice index.js
-  start react
-  create DBs locally and add records to user_accounts, user_portfolio, stock_data
-  current local build uses rabbitMQ, download and install it
-  on the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that have a status of "Open".

Completed:

-  Functionalities:
   -  Switch between users, and see each user's portfolio and their trade history
   -  See latest stock prices
   -  Set buy and sell orders which are matched by highest buy to highest sell order and drive the price of a stock similar to a real stock exchange
   -  See the order-status of a trade (Pending, Open, Closed, Canceled) and cancel 'Open' trade orders
-  Migrated data storage from local JSON files to a PostgreSQL database, then to separate DBs per microservice
-  Refactored application from a monolith to a microservices architecture:
   -  the 5 microservices are: user accounts, user portfolio, stock data, stock ordering, and order matching
   -  Communication between microservices is done through RabbitMQ using the AMQP protocol
- Implemented websockets using socket.io to volunteer data to the browser in realtime, data sent includes stock prices, order status, and user portfolio updates

Next steps:

-  Host serverlessly on AWS, replacing rabbitMQ in the local build with Amazon SNS and SQS
-  Implement sound solution architecture principles for performance, security and reliabilit, not limited to caching, deploying microservices in docker containers, ensuring stateless services, and creating circuit breakers
-  Simulate a high load of trade orders to test and improve the systems capabilities
-  Develop a live paper-trading feature by connecting to real-time stock data API such as polygon.io, and re-using code from the original stock exchange app


High level system design:
<img width="1245" alt="Screen Shot 2023-03-02 at 6 59 01 AM" src="https://user-images.githubusercontent.com/52921619/222810242-33159bfc-c21d-4a5b-b285-f711f8527d66.png">
