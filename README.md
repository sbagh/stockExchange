# bankingAndStocks
Stock exchange full-stack app - practice.

Project is in progress, so code and files are not fully orgranized or optimized yet. 



Current progress:
- You can switch between the 3 users.
- See user's portfolio, inlcuding their stocks and cash, linked to the back-end data file userPortfolio.json
- See stock prices through a list of pre-defined tickers and pirces, linked to back-end data file stockData.json
- Set buy/sell orders by inputting order details in a form, specifiying the ticker, quantity, and price of the order.
   - user buy/sell orders wil post to server.js which uses the stockMatchingClass
   - the stockMatchingClass is a class with methods to match the highest buy to the highest sell order. it creates an object with ticker, buy, seller,  time, price, and quantity.
- Buy and Sell orders will impact the price of the stock. the new price will be the last matched order price.
- See a trade history table of all stocks matched and their details.


To run project: 
- install react and node modules.
- start server.js. do not use nodemon as everytime the server re-sets buy/sell orders will be lost.
- start react
- select a user, see their portfololio, create buy/sell orders.
- currently to re-render the portfolios, updated stock prices, and transaction history table, you must refresh page. working on re-rendering automatically.


next fixes: 
 - fix time values rendered to ui
 - re-render components without refresh
 
 nexte features:
 - create an order status for stock trades and adjust back end for that feature
 - use a database instead of using json files
 - though a button, simulate 100s of buy/sell orders and drive prices up or down to test the back-end's reaction
 
