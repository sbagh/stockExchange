const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { orderMatchingClass } = require("./orderMatchingClass");
const { recieveFromStockOrderingQueue } = require("./rabbitMQ.js");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const orderMatchingPORT = 4004;

// other microservices used in this file
// const stock_ordering_URL =
//    "http://localhost:4003/updateStockOrderingAfterMatch";
// const stock_ordering_getUserID_URL =
//    "http://localhost:4003/getUserIDsfromStockOrdering";

// const stock_data_URL = "http://localhost:4002/updateStockDataAfterMatch";
// const user_porftolio_URL =
//    "http://localhost:4001/updateUserPortfolioAfterMatch";

// require db connection and queries:
// const service = require("./dbQueries");

//instantiate a stock exchange from stockMatchingClass
const stockExchange = new orderMatchingClass();

//receive stock orders from stockOrderingQue, then add order to buyOrders or sellOrders array
recieveFromStockOrderingQueue();

// (async () => {
//    const orderDetails = await recieveFromStockOrderingQueue();
//    console.log("recieved message from queue: ", orderDetails);
// })();

//.then((orderDetails) => {
//    // add to buy or sell orders array depending on order_type
//    // orderDetails.orderType === "buy"
//    //    ? stockExchange.addBuyOrder(
//    //         orderDetails.userID,
//    //         orderDetails.ticker,
//    //         orderDetails.quantity,
//    //         orderDetails.price,
//    //         orderDetails.orderID
//    //      )
//    //    : stockExchange.addSellOrder(
//    //         orderDetails.userID,
//    //         orderDetails.ticker,
//    //         orderDetails.quantity,
//    //         orderDetails.price,
//    //         orderDetails.orderID
//    //      );
// });

// //receive stock orders from stock_ordering microservice
// app.post("/sendOrderToMatchingService", (req, res) => {
//    const order_details = req.body;

//    // add to buy or sell orders array depending on order_type
//    order_details.order_type === "buy"
//       ? stockExchange.addBuyOrder(
//            order_details.user_id,
//            order_details.ticker,
//            order_details.quantity,
//            order_details.price,
//            order_details.order_id
//         )
//       : stockExchange.addSellOrder(
//            order_details.user_id,
//            order_details.ticker,
//            order_details.quantity,
//            order_details.price,
//            order_details.order_id
//         );
// });

// // match orders, then update matched_order db and send the matched order to other microservices
// const matchOrders = async () => {
//    const matched_orders = stockExchange.matchOrders();

//    if (matched_orders) {
//       let matched_order = matched_orders[0];
//       //   console.log(matched_order);

//       // a matched order will be an object of this format:
//       // matched_order = { buy_order_id, sell_order_id, price, time, ticker, quantity, }

//       //update matched_orders db after matching a trade
//       service.updateMatchedOrdersTable(matched_order);

//       //send post to stock ordering microservice after matching a trade
//       updateStockOrderingAfterMatch(matched_order);

//       //send post to stock data microservice after matching a trade
//       updateStockDataAfterMatch(matched_order);

//       //send post to user portfolio microservice after matching a trade
//       updateUserPortfolioAfterMatch(matched_order);
//    }
// };

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
