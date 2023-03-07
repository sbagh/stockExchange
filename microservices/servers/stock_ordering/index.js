const express = require("express");
const cors = require("cors");
const axios = require("axios");

// require functions to send and receive messages to amqp/rabbitMQ queue
const { sendToQueue, receiveFromQue } = require("./rabbitMQ");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const stockOrderingPORT = 4003;

//send message to stockOrders queue using rabbitMQ/amqplib:
const stockOrdersQueue = "stockOrdersQueue";
// receive messages from order matching queue using rabbitMQ/amqplib:
const matchedOrderStockOrderingQueue = "matchedOrderStockOrdering";

// require db connection and queries:
const service = require("./dbQueries");

// get a specifc user's trade orders from stock_orders db, requested from UI
app.get("/getUserStockOrders", (req, res) => {
   service.getUserStockOrders(req.query.userID).then((orders) => {
      // console.log(orders);
      res.send(orders);
   });
});

// receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
app.post("/startTradeOrder", async (req, res) => {
   // console.log(req.body);

   const orderDetails = req.body.orderDetails;
   // console.log("received order: ", orderDetails);

   // set order_status to open
   orderDetails.orderStatus = "Open";

   // add trade order to stock_orders db
   service.addStockOrder(orderDetails);

   // send order to order mathcing queue, which will send to order matching microservice
   await sendToQueue(stockOrdersQueue, orderDetails);

   res.send("order received");
});

// // receive matched order from order_matching microservice
// const receivedMatchedOrder = await receiveFromQue(
//    matchedOrderStockOrderingQueue
// );

// app.put("/updateStockOrderingAfterMatch", (req, res) => {
//    const matched_order = req.body;
//    service.updateOrderStatusStockOrdersTable(
//       matched_order.buy_order_id,
//       matched_order.sell_order_id
//    );
// });

// get buyer and seller id given order ids, request from order matching microservice
// app.get("/getUserIDsfromStockOrdering", (req, res) => {
//    const { buy_order_id, sell_order_id } = req.query;
//    const user_ids = service.getBuyerAndSellerID(buy_order_id, sell_order_id);
//    res.send(user_ids);
// });

app.listen(
   stockOrderingPORT,
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
