const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { stockMatchingClass } = require("./orderMatchingClass");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const order_matching_PORT = 4004;

// microservices url used in this file
const stock_order_URL = "http://localhost:4003/updateStockOrderingAfterMatch";
const stock_data_URL = "http://localhost:4002/updateStockDataAfterMatch";
const user_porftolio_URL =
   "http://localhost:4001/updateUserPortfolioAfterMatch";

// require db connection and queries:
const service = require("./dbQueries");

//instantiate a stock exchange from stockMatchingSystem class
const stockExchange = new stockMatchingClass();

//receive stock orders from stock_ordering microservice
app.post("/startTradeOrder", (req, res) => {
   const order_details = req.body;

   // add to buy or sell orders array depending on order_type
   order_details.order_type === "buy"
      ? stockExchange.addBuyOrder(
           order_details.userID,
           order_details.ticker,
           order_details.quantity,
           order_details.price,
           order_details.order_id
        )
      : stockExchange.addSellOrder(
           order_details.userID,
           order_details.ticker,
           order_details.quantity,
           order_details.price,
           order_details.order_id
        );
});

// match orders then update matched_order db and send matched order to other microservices
const matchOrders = async () => {
   const orders = stockExchange.matchOrders();

   if (orders) {
      let order = orders[0];
      console.log(order);

      //update matched_orders db
      service.updateMatchedOrdersTable(order);

      //send post to stock ordering microservice
      updateStockOrderingAfterMatch(order);

      //send post to stock data microservice
      updateStockDataAfterMatch(order);

      //send post to user portfolio microservice
      updateUserPortfolioAfterMatch(order);
   }
};

// send post to stock ordering microservice after matching an order
const updateStockOrderingAfterMatch = async (order) => {
   data = {
      buy_id: order.buy_id,
      sell_id: order.sell_id,
   };
   axios.put(stock_order_URL, data);
};

// send post to stock data microservice after matching an order
const updateStockDataAfterMatch = async (order) => {
   data = {
      price: order.price,
      ticker: order.ticker,
   };
   axios.put(stock_data_URL, data);
};

// send post to user portfolio microservice after matching an order
const updateUserPortfolioAfterMatch = async (order) => {
   data = {
      buy_id: order.buy_id,
      sell_id: order.sell_id,
      price: order.price,
      ticker: order.ticker,
   };
   axios.put(user_porftolio_URL, data);
};

app.listen(
   order_matching_PORT,
   console.log(
      "order matching microservice running on port ",
      order_matching_PORT
   )
);
