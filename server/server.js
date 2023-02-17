const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { stockMatchingSystem } = require("./Stocks/stockMatchingClass");
const { dateFormat } = require("./utils/utils.js");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const PORT = 5555;

// require db connection and queries:
const service = require("./dbQueries");

//instantiate a stock exchange (from stockMatchingSystem class)
const stockExchange = new stockMatchingSystem();

// query db for all users (db table: user_portfolio)
app.get("/getAllUsers", (req, res) => {
   service.getAllUsers(req, res).then((users) => {
      // console.log(users);
      res.send(users);
   });
});

// query db for the user's stock holdings (db table: stock_holdings)
app.get("/userStockHoldings", (req, res) => {
   service.getUserStocks(req.query.user_id).then((stocks) => {
      // console.log(stocks);
      res.send(stocks);
   });
});

// query db for stock prices and stock data (db table: stock_data)
app.get("/getStockData", (req, res) => {
   service.getStockData(req, res).then((data) => {
      // console.log(data);
      res.send(data);
   });
});

// query db for trade history (db table: matched_orders)
// app.get("/getTradeHistory", (req, res) => {
//    service.getTradeHistory(req, res).then((data) => {
//       console.log(data);
//       res.send(data);
//    });
// });

// receive trade order, add it to buy/sell order from stockMatching class, and update stock_order table from db
app.post("/sendTradeOrder", (req, res) => {
   // console.log(req.body)
   const orderDetails = req.body.orderDetails;
   // console.log(orderDetails);
   service.addTradeOrder(orderDetails);

   orderDetails.order_type === "buy"
      ? stockExchange.addBuyOrder(
           orderDetails.userID,
           orderDetails.ticker,
           parseInt(orderDetails.quantity),
           parseInt(orderDetails.price),
           orderDetails.orderID
        )
      : stockExchange.addSellOrder(
           orderDetails.userID,
           orderDetails.ticker,
           parseInt(orderDetails.quantity),
           parseInt(orderDetails.price),
           orderDetails.orderID
        );
});

//Stock Exchange functionalities:
//match buy/sell orders inside a setInterval function then update db tables
const matchedOrders = setInterval(async () => {
   const orders = stockExchange.matchOrders();
   if (orders) {
      //fixing time format first:
      // let newTimeFormat = dateFormat(orders[0].time);
      // orders[0].time = newTimeFormat;

      let order = orders[0];
      console.log(order);

      // update db tables after matching an order: matched_orders, stock_data, user_portfolio, stock_holdings tables
      service.updateMatchedOrders(order);
      service.updateStockData(order.price, order.ticker);
      service.updateUserPortfolio(
         order.buyID,
         order.sellID,
         order.price,
         order.quantity
      );
      // service.updateStockHoldings(
      //    order.buyID,
      //    order.sellID,
      //    order.ticker,
      //    order.quantity
      // );
   }
}, 1000);

app.listen(PORT, () => console.log("listening to PORT", PORT));
