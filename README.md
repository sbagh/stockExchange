# bankingAndStocks
Stock exchange full-stack app.

Project is in progress, so code and files are not fully orgranized or optimized yet. 


To run project: 
- install react and node modules.
- start server.js. do not use nodemon as everytime the server resets buy/sell orders will be lost.
- start react
- On the browser: select a user, see their portfololio, create buy/sell orders.
- currently when the portfolios,  tock prices, and transaction history table are updated, you must manually refresh page. working on re-rendering automatically.
- if you wish to clear the tradeHistory.json table, make sure you leave empty square brackets in the json (like this: [])


Current progress:
- You can switch between the 3 users.
- See user's portfolio, inlcuding their stocks and cash. (linked to userPortfolio.json in server/data)
- See stock prices through a list of pre-defined tickers and pirces (linked to stockData.json in server/data)
- Set buy/sell orders by inputting order details in a form, specifiying the ticker, quantity, and price of the order.
   - user buy/sell orders will post to server.js which uses the stockMatchingClass
   - the stockMatchingClass is a class with methods to match the highest buy to the highest sell order. it creates an object with ticker, buy, seller,  time, price, and quantity.
- Buy and Sell orders will impact the price of the stock. the new price will be the last matched order price.
- See a trade history table of all stocks matched and their details.

 
 next steps:
 - move to a websocket based system using socket.io
 - create an order status for stock trades and adjust back end for that feature
 - use a database instead of using json files
 - though a button, simulate 100s of buy/sell orders and drive prices up or down to test the back-end's reaction
 
