import express from "express";
import cors from "cors";
//import order matching class from classes, used to match orders
import { orderMatchingClass } from "./classes/orderMatchingClass";
// require db connection and queries
import * as db from "./database/dbQueries";
// import functions used by amqp/rabbitMQ
import { sendToQueue } from "./rabbitMQ/sendToQueue";
import { receiveFromQueue } from "./rabbitMQ/receiveFromQueue";
import { publishFanOutExchange } from "./rabbitMQ/publishFanOutExchange";
// import interfaces for typescript
import type {
   StockOrderDetails,
   CanceledOrderDetails,
   MatchedOrder,
} from "./interfaces/interfaces";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// order matching microservice PORT
const orderMatchingPORT = 4004;

// Queue and Exchange names used
const stockOrdersQueue = "stockOrdersQueue";
const canceledOrdersQueue = "canceledOrdersQueue";
const canceledOrdersConfirmationQueue = "canceledOrdersConfirmation";
const matchedOrdersExchange = "matchedOrdersExchange";

//instantiate a stock exchange from stockMatchingClass
const stockExchange = new orderMatchingClass();

// --------------------- Code Starts Here --------------------- //

//receive stock orders from stockOrderingQue, then add the order to buyOrders or sellOrders array in stock exchange
const receiveStockOrder = async () => {
   //receiveFromQueue rabbitmq function / sendToExchange callback function
   await receiveFromQueue(stockOrdersQueue, sendToExchange);
};
// when a stock order is recieved, send it to the stock exchange, to be placed in a buyOrders or sellOrders array then matched
const sendToExchange = (orderDetails: StockOrderDetails) => {
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
   // console.log(
   //    "order received to order matching index.js from que: ",
   //    orderDetails
   // );
   // console.log("buy orders array before match: ", stockExchange.buyOrders);
   // console.log("sell orders array before match: ", stockExchange.sellOrders);
};
receiveStockOrder();

let matchOrdersInterval: NodeJS.Timeout;

// match orders, then update matched_order db and send the matched order to other microservices
const matchOrders = async () => {
   // create an interval to match new orders in the stockOrdersQueue
   matchOrdersInterval = setInterval(async () => {
      const matchedOrders = stockExchange.matchOrders();
      // console.log(matchedOrders);
      if (matchedOrders && matchedOrders.length > 0) {
         //loop over the matchedOrders array
         while (matchedOrders.length > 0) {
            // a matched order object: matchedOrder = { buyOrderID, sellOrderID, buyerID, sellerID, price, time, ticker, quantity }
            // take out the first order in the matchedOrders array and process it
            let matchedOrder = matchedOrders.shift();
            // console.log("matched order: ", matchedOrder);
            // ensure matchedOrder is not undefined after .shift()
            if (matchedOrder) {
               //update matched_orders db after matching a trade
               db.updateMatchedOrdersTable(matchedOrder);
               // send matched order to the fanout exchange called matchedOrdersExchange
               await publishFanOutExchange(matchedOrdersExchange, matchedOrder);
            }
         }
      }
   }, 1000);
};
matchOrders();

// recieve canceled stock order from stock ordering microservice using rabbitMQ
const receiveCanceledOrder = async () => {
   await receiveFromQueue(canceledOrdersQueue, removeOrder);
};
// callback to remove order from buyOrders or sellOrders array in stock exchange
const removeOrder = async (canceledOrder: CanceledOrderDetails) => {
   await stockExchange.removeOrder(
      canceledOrder.orderID,
      canceledOrder.orderType
   );
   console.log(
      "order received to index.js from canceled orders que: ",
      canceledOrder
   );
   // send canceled order confirmation to canceledOrdersConfirmation queue, to be received by stock ordering microservice
   await sendToQueue(canceledOrdersConfirmationQueue, canceledOrder);
   // console.log("sent confirmation of canceled order");
};
receiveCanceledOrder();

app.listen(orderMatchingPORT, () =>
   console.log(
      "order matching microservice running on port ",
      orderMatchingPORT
   )
);
