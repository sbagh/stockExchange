# bankingAndStocks

Stock exchange full-stack app.

Project is in progress, so code and files are not fully orgranized or optimized yet.

To run project:

-  install react and node.js modules
-  start each microservice index.js
-  start react
-  add records to db: user_accounts, user_portfolio, stock_data
-  on the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that have a status of "Open".

Completed features:

-  Functionalities: 
   -  Switch between users, and see each user's portfolio and their trade history
   - See latest stock prices, 
   - Set buy and sell orders:
      - Orders will post to the stock ordering microservice, which will publish a message through rabbitMQ to the order matching microservice.
      - The Order matching microservice matches orders based on the stockMatchingClass which matches the highest buy to the highest sell order.
      - Buy and Sell orders will impact the price of the stock similar to a real stock exchange, the new price will be the last matched order price.
-  Migrated data storage from local JSON files to PostgreSQL database, then to separate DBs per microservice and appended data querying APIs for each implementation
-  Implemented an order-status functionality, with options of 'pending', 'open', 'closed', or 'canceled'.
-  Currently moving from monolith to a microservices architecture, the 5 microservices are: user accounts, user portfolio, stock data, stock ordering, and order matching. 

Next steps:

-  Complete refactoring for microservices compatibility, including using rabbitMQ for messaging b/w microservices and replicating db's between microservices.
- Host serverlessly on AWS, replacing rabbitMQ in the local build with Amazon SNS and SQS in the process
-  Implement sound solution architecture principles for performance, security and reliabilit, not limited to caching, deploying microservices in docker containers, ensuring stateless services, and creating circuit breakers
-  Simulate a high load on the system by creaing lots of buy and sell orders.
-  Possibly move to a websocket based system using socket.io.
- Develop a live paper-trading feature by connecting to real-time stock data API such as polygon.io, and re-use code from the original stock exchange app

issues:

-  facing challenges in re-rendering data in the monolith, a temporary solution is to use a setInterval for useEffects hooks that fetch data.
-  attempted to move to a websocket system for easier back and forth communication, the websocket is promising but did not work well for now, commented code out.

High level system design:
<img width="1245" alt="Screen Shot 2023-03-02 at 6 59 01 AM" src="https://user-images.githubusercontent.com/52921619/222810242-33159bfc-c21d-4a5b-b285-f711f8527d66.png">


