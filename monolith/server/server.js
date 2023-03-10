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

//query to get a specific user's orders (db table: stock_orders)
app.get("/getUserStockOrders", (req, res) => {
   service.getUserStockOrders(req.query.user_id).then((orders) => {
      // console.log(orders);
      res.send(orders);
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
   orderDetails.order_status = "Open";

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

// remove an order from buyOrders/sellOrders array in stockExchange and update order_status to "Canceled" in stock_orders table
app.put("/cancelTradeOrder", (req, res) => {
   // remove from buyOrders or sellOrders array in stock exchange (stockMatchingClass)
   stockExchange.removeOrder(req.query.order_id, req.query.order_type);

   //update the stock_orders table to change order_status to "Canceled"
   service.updateOrderStatusToCanceled(req.query.order_id);

   res.send("order canceled");
   // //log buy/sell orders to ensure order is removed from arrays:
   // console.log(stockExchange.buyOrders);
   // console.log(stockExchange.sellOrders);
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
      service.updateMatchedOrdersTable(order);
      service.updateOrderStatusStockOrdersTable(order.buyID, order.sellID);
      service.updateStockDataTable(order.price, order.ticker);
      service.updateUserPortfolioTable(
         order.buyID,
         order.sellID,
         order.price,
         order.quantity
      );
      service.updateStockHoldingsTable(
         order.buyID,
         order.sellID,
         order.ticker,
         order.quantity
      );
   }
}, 1000);

app.listen(PORT, () => console.log("listening to PORT", PORT));
