# Stock Exchange

Stock exchange full-stack app.

To run project:

-  install react and node.js modules
-  start each microservice index.js
-  start react
-  add records to db: user_accounts, user_portfolio, stock_data
-  on the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that have a status of "Open".

Completed features:

-  Functionalities:
   -  Switch between users, and see each user's portfolio and their trade history
   -  See latest stock prices
   -  Set buy and sell orders which are matched by highest buy to highest sell order and drive the price of a stock similar to a real stock exchange
   -  See the order-status of a trade (Pending, Open, Closed, Canceled) and cancel 'Open' trade orders
-  Migrated data storage from local JSON files to a PostgreSQL database, then to separate DBs per microservice
-  Completed refactoring from monolith to a microservices architecture, the 5 microservices are: user accounts, user portfolio, stock data, stock ordering, and order matching
-  Communication between microservices is done through RabbitMQ using the AMQP protocol

Next steps:

-  Host serverlessly on AWS, replacing rabbitMQ in the local build with Amazon SNS and SQS
-  Implement sound solution architecture principles for performance, security and reliabilit, not limited to caching, deploying microservices in docker containers, ensuring stateless services, and creating circuit breakers
-  Simulate a high load of trade orders to test and improve the systems capabilities
-  Possibly move to a websocket based system using socket.io
-  Develop a live paper-trading feature by connecting to real-time stock data API such as polygon.io, and re-using code from the original stock exchange app

issues:

-  facing challenges in re-rendering data in the monolith, a temporary solution is to use a setInterval for useEffects hooks that fetch data.
-  attempted to move to a websocket system for easier back and forth communication, the websocket is promising but did not work well for now, commented code out.

High level system design:
<img width="1245" alt="Screen Shot 2023-03-02 at 6 59 01 AM" src="https://user-images.githubusercontent.com/52921619/222810242-33159bfc-c21d-4a5b-b285-f711f8527d66.png">
