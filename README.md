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

-  Switch between users, and see each user's portfolio and their trade history
-  See latest stock prices.
-  Set buy and sell orders:
   -  Orders will post to stock_ordering microservice, which will publish a message through rabbitMQ to order_matching microservice.
   -  Order_matching microservice matches orders based on the stockMatchingClass which matches the highest buy to the highest sell order.
   -  Buy and Sell orders will impact the price of the stock similar to a real stock exchange, the new price will be the last matched order price.
-  Migrated data storage from local JSON files to PostgreSQL database.
-  Implemented an order-status functionality, with options of 'pending', 'open', 'closed', or 'canceled'.
-  Set up initial phase of microservices transition.

Next steps:

-  Complete refactoring for microservices compatibility, including using rabbitMQ for messaging b/w microservices and replicating db's between microservices.
-  Implement sound solution architecture principles.
-  host serverlessly on AWS.
-  Simulate a high load on the system by creaing lots of buy and sell orders.
-  Possibly move to a websocket based system using socket.io.

issues:

-  facing challenges in re-rendering data in the monolith, a temporary solution is to use a setInterval for useEffects hooks that fetch data.
-  attempted to move to a websocket system for easier back and forth communication, the websocket is promising but did not work well for now, commented code out.
