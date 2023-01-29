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

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
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

//receive a stock trade order from StockMarket.js
app.post("/sendTradeOrder", async (req, res) => {
   const {
      user,
      orderDetails: { orderID, ticker, quantity, price, type },
   } = req.body;
   // console.log(user, orderID, ticker, quantity, price, type );

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

      console.log("matched order: ", orders);
   }
}, 1000);

app.listen(PORT, () => console.log("listening to PORT", PORT));
