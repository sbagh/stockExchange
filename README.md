# bankingAndStocks

Stock exchange full-stack app.

Project is in progress, so code and files are not fully orgranized or optimized yet.

To run project:

-  install react and node modules.
-  start server.js. do not use nodemon as everytime the server resets buy/sell orders will be lost.
-  start react
-  On the browser: select a user, see their portfololio, create buy/sell orders, cancel orders that are "Open"

Current progress:

-  You can switch between the 3 users.
-  See user's portfolio, inlcuding their stocks and cash. (linked to user_portfolio table)
-  See stock prices through a list of pre-defined tickers (linked to stock_data table)
-  Set buy/sell orders by inputting order details in a form, specifiying the ticker, quantity, and price of the order.
   -  user buy/sell orders will post to server.js which uses the stockMatchingClass
   -  the stockMatchingClass is a class with methods to match the highest buy to the highest sell order. it creates an object with ticker, buy, seller, time, price, and quantity.
-  Buy and Sell orders will impact the price of the stock. the new price will be the last matched order price.
-  See a trade history table of all stocks matched and their details.
-  Temporary solution to re-rending json data from back-end. used setInterval inside App.js useEffect functions.
-  Migrated data storage from local JSON files to PostgreSQL database, tables are: user_portfolio, stock_holdings, stock_data, stock_orders, matched_orders
-  Implemented an order-status functionality. will show the user if their order is pending, open, closed, or canceled. User can cancel open orders through a button on the ui

next steps:

-  Currently refactoring code for better readability, maintenance, and DRY principle
-  move to a websocket based system using socket.io
-  though a button, simulate 100s of buy/sell orders and drive prices up or down to test the back-end's reaction
-  Refactor for microservices compatibility
-  host on AWS
-  Implement sound solution architecture principles

issues:

-  attempted to move to a websocket system for easier back and forth communication, websocket is promising but did not work well for now, commented code out.
-  re-rendering of data is not working well on react, temporary solution is to use a setInterval for useEffects that fetch data (which is bad)
