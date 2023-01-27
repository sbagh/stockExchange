const express = require("express");
const {
   getUserPortfolio,
   getStockData,
   updateUserPortfolioJSON,
   updateTradeHistory,
   getTradeHistory,
   updateStockData,
} = require("./Stocks/userInteractionAPI");
const cors = require("cors");
const axios = require("axios");
const { stockMatchingSystem } = require("./Stocks/stockMatchingClass");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5555;

//instantiate a stock exchange (from stockMatchingSystem class)
const stockExchange = new stockMatchingSystem();

// respond to userPortfolio fetch request from ui (component: App.js)
app.get("/userPortfolio", async (req, res) => {
   const userData = await getUserPortfolio(req.query.user);
   res.send(userData);
});

// respond to stockData fetch request from ui (component: App.js)
app.get("/stockData", async (req, res) => {
   const stockData = await getStockData(req);
   res.send(stockData);
});

// update userPortfolio through the updateUserPortfolio axios put request from ui (component: StockMarket.js)
app.put("/updateUserPortfolio", async (req, res) => {
   const { user, userPortfolio } = req.body;
   const result = await updateUserPortfolioJSON(user, userPortfolio);
   res.send(result);
});

// receive buy orders through the stockBuyOrder axios post request from ui (component: StockMarket.js), then send them to the stock exchange
app.post("/stockBuyOrder", (req, res) => {
   const {
      user,
      orderDetails: { ticker, quantity, price },
   } = req.body;
   stockExchange.addBuyOrder(user, ticker, parseInt(quantity), parseInt(price));
   // console.log("buy orders: ", stockExchange.buyOrders);
   res.send("done");
});

// receive sell orders through the stockBuyOrder axios post request from ui (component: StockMarket.js), then send them to the stock exchange
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
   // console.log("sell orders: ", stockExchange.sellOrders);
   res.send("done");
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
      //fixing time format first
      let dateOptions = {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
      };
      let newTimeFormat = new Date(orders[0].time).toLocaleString(
         "en-US",
         dateOptions
      );
      orders[0].time = newTimeFormat;
      // console.log(orders);

      //updating tradeHistory.json and stockData.json:
      await updateTradeHistory(orders);
      await updateStockData(orders);

      // console.log("matched order: ", orders);
   }
}, 1000);

app.listen(PORT, () => console.log("listening to PORT", PORT));
