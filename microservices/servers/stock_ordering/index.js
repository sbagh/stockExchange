const express = require("express");
const cors = require("cors");
const axios = require("axios");

// require db connection and queries:
const service = require("./database/dbQueries");

// require functions to send and receive messages using amqp/rabbitMQ
const { sendToQueue } = require("./rabbitMQ/sendToQueue");
const { receiveFromQueue } = require("./rabbitMQ/receiveFromQueue");
const { receiveFanOutExchange } = require("./rabbitMQ/receiveFanOutExchange");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// stock ordering microservice PORT
const stockOrderingPORT = 4003;

// Queue and Exchange names used
const stockOrdersQueue = "stockOrdersQueue";
const canceledOrdersQueue = "canceledOrdersQueue";
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockOrderingQueue";
const canceledOrdersConfirmationQueue = "canceledOrdersConfirmation";

// get a specifc user's trade orders from stock_orders db, requested from UI
app.get("/getUserStockOrders", (req, res) => {
   service.getUserStockOrders(req.query.userID).then((orders) => {
      // console.log(orders);
      res.send(orders);
   });
});

// receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
app.post("/startTradeOrder", async (req, res) => {
   const orderDetails = req.body.orderDetails;
   // console.log("received order from UI: ", orderDetails);
   // set order_status to open
   orderDetails.orderStatus = "Open";
   // add trade order to stock_orders db
   service.addStockOrder(orderDetails);
   // send order to stockOrdersQueue, which will send to order matching microservice
   await sendToQueue(stockOrdersQueue, orderDetails);
   res.send("order received");
});

// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrder = async () => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      updateOrderStatus
   );
};
// callback function used to update order status and send to ui
const updateOrderStatus = (matchedOrder) => {
   service.updateOrderStatusStockOrdersTable(
      matchedOrder.buyOrderID,
      matchedOrder.sellOrderID
   );
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
};
receiveMatchedOrder();

// cancel a trade order if request from UI
app.put("/cancelTradeOrder", async (req, res) => {
   // deconstruct req qeuries and place in a canceledOrder object
   const canceledOrder = {
      orderID: req.query.orderID,
      orderType: req.query.orderType,
      orderStatus: req.query.orderStatus,
   };
   // console.log("canceled order from ui: ", canceledOrder);

   //send canceledOrder object to order matching service via
   await sendToQueue(canceledOrdersQueue, canceledOrder);
   res.send("order canceled");
});

// recieve order cancel confirmation from order matching microservice using rabbitMQ
const receiveCanceledOrderConfirmation = async () => {
   await receiveFromQueue(canceledOrdersConfirmationQueue, cancelOrder);
};
// callback function used to update order status and send to ui
const cancelOrder = (canceledOrder) => {
   service.updateOrderStatusToCanceled(canceledOrder);
   console.log("received canceled order confirmation");
};
receiveCanceledOrderConfirmation();

app.listen(
   stockOrderingPORT,
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
