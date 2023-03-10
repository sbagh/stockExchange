const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { orderMatchingClass } = require("./classes/orderMatchingClass");

// require function to get orders from amqp queue
const {
   receiveFromQue,
   publishToFanOutExchange,
} = require("./rabbitMQ/rabbitMQ.js");

//receive message from stockOrders queue, which comes from stock orders microservice after an order is placed
const stockOrdersQueue = "stockOrdersQueue";
//receive canceled order meessage from canceledOrders queue, which comes from stock orders microservice after an open order is canceled
const canceledOrdersQueue = "canceledOrdersQueue";
//publish matched order message to this exchange
const matchedOrdersExchange = "matchedOrdersExchange";

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const orderMatchingPORT = 4004;

// require db connection and queries:
const service = require("./database/dbQueries");

//instantiate a stock exchange from stockMatchingClass
const stockExchange = new orderMatchingClass();

//receive stock orders from stockOrderingQue, then add order to buyOrders or sellOrders array
const receiveStockOrder = async () => {
   const orderDetails = await receiveFromQue(stockOrdersQueue);
   // console.log("order received to index.js from que: ", orderDetails);
   sendToExchange(orderDetails);
};

setInterval(receiveStockOrder, 500);

// when a stock order is recieved, send it to the stock exchange, to be placed in a buyOrders or sellOrders array then matched
const sendToExchange = (orderDetails) => {
   // add to buy or sell orders array depending on order_type
   orderDetails.orderType === "buy"
      ? stockExchange.addBuyOrder(
           orderDetails.userID,
           orderDetails.ticker,
           orderDetails.quantity,
           orderDetails.price,
           orderDetails.orderID
        )
      : stockExchange.addSellOrder(
           orderDetails.userID,
           orderDetails.ticker,
           orderDetails.quantity,
           orderDetails.price,
           orderDetails.orderID
        );

   // console.log("buy orders: ", stockExchange.buyOrders);
   // console.log("sell orders: ", stockExchange.sellOrders);
};

// match orders, then update matched_order db and send the matched order to other microservices
const matchOrders = async () => {
   // create an interval to match new orders in the stockOrdersQueue
   matchOrdersInterval = setInterval(async () => {
      const matchedOrders = stockExchange.matchOrders();
      if (matchedOrders) {
         // if orders from queue are matched, stop the interval, so as not to keep matching the same orders in the que
         clearInterval(matchOrdersInterval);
         // a matched order object: matchedOrder = { buyOrderID, sellOrderID, buyerID, sellerID, price, time, ticker, quantity }
         let matchedOrder = matchedOrders[0];
         // console.log("matched order: ", matchedOrder);

         //update matched_orders db after matching a trade
         service.updateMatchedOrdersTable(matchedOrder);

         // send matched order to the fanout exchange called matchedOrdersExchange
         await publishToFanOutExchange(matchedOrdersExchange, matchedOrder);
      }
   }, 1000);
};
matchOrders();

// receive canceled trade orders from
const receiveCanceledOrder = async () => {
   const canceledOrder = await receiveFromQue(canceledOrdersQueue);
   console.log(
      "order received to index.js from canceled orders que: ",
      canceledOrder
   );
};
setInterval(receiveCanceledOrder, 500);

app.listen(
   orderMatchingPORT,
   console.log(
      "order matching microservice running on port ",
      orderMatchingPORT
   )
);
