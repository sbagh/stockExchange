const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { orderMatchingClass } = require("./orderMatchingClass");

// require function to get orders from amqp queue
const {
   receiveFromQue,
   sendToQueue,
   publishToFanOutExchange,
} = require("./rabbitMQ.js");

//receive message from stockOrders queue, received from stock_orders microservice after an order is placed
const stockOrdersQueue = "stockOrdersQueue";
//publish matched order message to this exchange
const matchedOrdersExchange = "matchedOrdersExchange";

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const orderMatchingPORT = 4004;

// require db connection and queries:
const service = require("./dbQueries");

//instantiate a stock exchange from stockMatchingClass
const stockExchange = new orderMatchingClass();

//receive stock orders from stockOrderingQue, then add order to buyOrders or sellOrders array
const receiveStockOrder = async () => {
   const orderDetails = await receiveFromQue(stockOrdersQueue);
   // console.log("order received to index.js from que: ", orderDetails);
   sendToExchange(orderDetails);
};

setInterval(receiveStockOrder, 500);

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

// //send post to stock data microservice after matching a trade
// updateStockDataAfterMatch(matched_order);

// //send post to user portfolio microservice after matching a trade
// updateUserPortfolioAfterMatch(matched_order);

// // send post to stock ordering microservice after matching an order
// const updateStockOrderingAfterMatch = async (matched_order) => {
//    const body = {
//       buy_order_id: matched_order.buy_order_id,
//       sell_order_id: matched_order.sell_order_id,
//    };
//    await axios.put(stock_ordering_URL, body).catch((error) => {
//       console.log(
//          "error in sending matched order to stock ordering microservice",
//          error
//       );
//       throw error;
//    });
// };

// // send post to stock data microservice after matching an order
// const updateStockDataAfterMatch = async (matched_order) => {
//    body = {
//       price: matched_order.price,
//       ticker: matched_order.ticker,
//    };
//    await axios.put(stock_data_URL, body);
// };

// // send post to user portfolio microservice after matching an order
// const updateUserPortfolioAfterMatch = async (matched_order) => {
//    // to update buyer and sellers portfolios, we first need to get user id's, as this is not provided in the matched_order object
//    getBuyerAndSellerID(matched_order).then(async (user_ids) => {
//       // put the user ids in the body along with the matched order price, ticker, and quantity
//       body = {
//          ...user_ids,
//          price: matched_order.price,
//          ticker: matched_order.ticker,
//          quantity: matched_order.quantity,
//       };
//       //send body to user portfolio microservice
//       await axios.put(user_porftolio_URL, body);
//    });
// };

// // get buyer and seller user id from stock_orders microservice after matching an order
// const getBuyerAndSellerID = async (matched_order) => {
//    const user_ids = await axios.get(
//       `${stock_ordering_getUserID_URL}?buy_order_id=${matched_order.buy_order_id}&sell_order_id=${matched_order.sell_order_id}`
//    );
//    return user_ids.data;
// };

app.listen(
   orderMatchingPORT,
   console.log(
      "order matching microservice running on port ",
      orderMatchingPORT
   )
);
