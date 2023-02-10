const express = require("express");
const {
   getUserPortfolio,
   getStockData,
   updateUserPortfolioJSON,
   updateTradeHistory,
   getTradeHistory,
   updateStockData,
   findUpdateJSONdata,
} = require("./Stocks/userInteractionAPI");
const cors = require("cors");
const axios = require("axios");
const { stockMatchingSystem } = require("./Stocks/stockMatchingClass");
const { dateFormat } = require("./utils/utils.js");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const PORT = 5555;

const service = require("./dbQueries");

//instantiate a stock exchange (from stockMatchingSystem class)
const stockExchange = new stockMatchingSystem();

// query db for all users (db table: user_portfolio)
app.get("/getAllUsers", (req, res) => {
   service.getAllUsers(req, res).then((users) => {
      console.log(users);
      res.send(users);
   });
});

// query db for the user's stock holdings (db table: stock_holdings)
app.get("/userStockHoldings", (req, res) => {
   service.getUserStocks(req.query.user_id).then((stocks) => {
      console.log(stocks);
      res.send(stocks);
   });
});

// query db for stock prices and stock data (db table: stock_data)
app.get("/getStockData", (req, res) => {
   service.getStockData(req, res).then((data) => {
      console.log(data);
      res.send(data);
   });
});

// query db for trade history (db table: trade_history)
app.get("/getTradeHistory", (req, res) => {
   service.getTradeHistory(req, res).then((data) => {
      console.log(data);
      res.send(data);
   });
});

// // respond to userPortfolio fetch request from ui (component: App.js)
// app.get("/userPortfolio", async (req, res) => {
//    const userData = await getUserPortfolio(req.query.user);
//    res.send(userData);
// });

// // respond to stockData fetch request from ui (component: App.js)
// app.get("/stockData", async (req, res) => {
//    const stockData = await getStockData(req);
//    res.send(stockData);
// });

//receive a stock trade order from StockMarket.js
app.post("/sendTradeOrder", async (req, res) => {
   const {
      user,
      orderDetails: { orderID, ticker, quantity, price, type },
   } = req.body;

   //test if order is received:
   // console.log(user, orderID, ticker, quantity, price, type );

   //need to move this to occur AFTER the order is matched
   const updatedUserPortfolio = await updateUserPortfolioJSON(
      user,
      ticker,
      quantity,
      price,
      type
   );

   // console.log(updatedUserPortfolio);

   //send orders to stockExchange
   if (type === "buy") {
      stockExchange.addBuyOrder(
         user,
         ticker,
         parseInt(quantity),
         parseInt(price),
         orderID
         // orderStatus
      );
   } else {
      stockExchange.addSellOrder(
         user,
         ticker,
         parseInt(quantity),
         parseInt(price),
         orderID
      );
   }

   res.send("test received");
});

// respond to tradeHistory fetch request from ui (component: App.js)
app.get("/tradeHistory", async (req, res) => {
   const stockData = await getTradeHistory(req);
   res.send(stockData);
   // console.log(stockData);
});

//Stock Exchange functionalities:
//1- match buy/sell orders inside a setInterval function
//2- then send the most recent matched order to tradeHistory.json (append the json file)
const matchedOrders = setInterval(async () => {
   const orders = stockExchange.matchOrders();
   if (orders) {
      //fixing time format first:
      let newTimeFormat = dateFormat(orders[0].time);
      orders[0].time = newTimeFormat;
      // console.log(orders);

      //updating tradeHistory.json and stockData.json:
      await updateTradeHistory(orders);
      await updateStockData(orders);

      console.log("matched order: ", orders);
   }
}, 1000);

app.listen(PORT, () => console.log("listening to PORT", PORT));
