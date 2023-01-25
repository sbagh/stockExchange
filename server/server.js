const express = require("express");
const {
   getUserPortfolio,
   getStockData,
   updateUserPortfolioJSON,
   updateTradeHistory,
   getTradeHistory,
} = require("./Stocks/userInteractionAPI");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const { stockMatchingSystem } = require("./Stocks/stockMatchingClass");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5555;

//initialize a stock exchange (from stockMatchingSystem class)
const stockExchange = new stockMatchingSystem();

// respond to userPortfolio fetch request from ui (get a user's portfolio)
app.get("/userPortfolio", async (req, res) => {
   const userData = await getUserPortfolio(req.query.user);
   res.send(userData);
});

// respond to stockData fetch request from ui
app.get("/stockData", async (req, res) => {
   const stockData = await getStockData(req);
   res.send(stockData);
});

// update userPortfolio through sendBuyOrder's updateUserPortfolio axios put from ui
app.put("/updateUserPortfolio", async (req, res) => {
   const { user, userPortfolio } = req.body;
   const result = await updateUserPortfolioJSON(user, userPortfolio);
   res.send(result);
});

// receive buy orders from axios post request, and send them to the stock exchange (an initializaation of the stockMatching class)
app.post("/stockBuyOrder", (req, res) => {
   const {
      user,
      orderDetails: { ticker, quantity, price },
   } = req.body;
   stockExchange.addBuyOrder(user, ticker, parseInt(quantity), parseInt(price));
   console.log("buy orders: ", stockExchange.buyOrders);
   res.send("done");
});

// receive sell orders from axios post request, and send them to the stock exchange (an initializaation of the stockMatching class)
app.post("/stockSellOrder", (req, res) => {
   const {
      user,
      orderDetails: { ticker, quantity, price },
   } = req.body;
   stockExchange.addSellOrder(
      user,
      ticker,
      parseInt(quantity),
      parseInt(price)
   );
   console.log("sell orders: ", stockExchange.sellOrders);
   res.send("done");
});

// respond to tradeHistory fetch request from ui
app.get("/tradeHistory", async (req, res) => {
   const stockData = await getTradeHistory(req);
   res.send(stockData);
   console.log(stockData);
});

//Stock Exchange functionalities:
//1- match buy/sell orders inside a setInterval function
//2- then send the most recent matched order to tradeHistory.json (append the json file)
const matchedOrders = setInterval(async () => {
   const orders = stockExchange.matchOrders();
   if (orders) {
      await updateTradeHistory(orders);
      console.log("matched order: ", orders);
   }
}, 1000);

app.listen(PORT, () => console.log("listening to PORT", PORT));
