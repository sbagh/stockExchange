# bankingAndStocks

Stock exchange full-stack app.

Project is in progress, so code and files are not fully orgranized or optimized yet.

To run project:

-  install react and node modules
-  start server.js
-  start react 
-  add records to db: user_accounts, user_portfolio, stock_data
-  on the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that are "Open"

Completed features:

-  Switch between the 3 users, and see the user's portfolio (their stocks and cash)
-  See latest stock prices
-  Set buy/sell orders:
   -  Orders will post to server.js which uses the stockMatchingClass
   -  The stockMatchingClass matches the highest buy to the highest sell order.
   -  Buy and Sell orders will impact the price of the stock similar to a real stock exchange, the new price will be the last matched order price.
-  See a trade history table of all stocks matched and their details.
-  Migrated data storage from local JSON files to PostgreSQL database, tables are: user_portfolio, stock_holdings, stock_data, stock_orders, matched_orders
-  Implemented an order-status functionality. will show the user if their order is pending, open, closed, or canceled. User can cancel open orders through a button on the ui
-  Set up initial parts of microservices transition.

Next steps:

-  Complete refactoring for microservices compatibility, including using rabbitMQ for messaging b/w microservices and replicating db's between microservices
-  Implement sound solution architecture principles
-  host serverlessly on AWS
-  Simulate a high load on the system by creaing lots of buy/sell orders
-  Possibly move to a websocket based system using socket.io

issues:

-  facing challenges in re-rendering data in the monolith, a temporary solution is to use a setInterval for useEffects hooks that fetch data.
-  attempted to move to a websocket system for easier back and forth communication, the websocket is promising but did not work well for now, commented code out.
