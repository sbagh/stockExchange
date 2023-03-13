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

// receive matched order from order_matching microservice
const receiveMatchedOrder = async () => {
   const matchedOrder = await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue
   );
   console.log(
      `matched order received from ${matchedOrdersQueue} queue, order: `,
      matchedOrder
   );
   // update order status to closed in stock_orders table after buy and sell orders are matched
   service.updateOrderStatusStockOrdersTable(
      matchedOrder.buyOrderID,
      matchedOrder.sellOrderID
   );
};
setInterval(receiveMatchedOrder, 1000);

// cancel a trade order if request from UI
app.put("/cancelTradeOrder", async (req, res) => {
   // deconstruct req qeuries and place in a canceledOrder object
   const canceledOrder = {
      orderID: req.query.orderID,
      orderType: req.query.orderType,
      orderStatus: req.query.orderStatus,
   };
   console.log(canceledOrder);

   //send canceledOrder object to order matching service via
   await sendToQueue(canceledOrdersQueue, canceledOrder);
   res.send("order canceled");
});

// recieve confirmation that order is canceled then update order status in stock orders db
const receiveCanceledOrderConfirmation = async () => {
   const canceledorder = await receiveFromQueue(
      canceledOrdersConfirmationQueue
   );
   // update db
   console.log("received canceled order confirmation");
   service.updateOrderStatusToCanceled(canceledorder);
};
setInterval(receiveCanceledOrderConfirmation, 1000);

app.listen(
   stockOrderingPORT,
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
