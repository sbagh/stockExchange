const express = require("express");
const cors = require("cors");
const app = express();

// setup websocker/socket.io
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

// require db connection and queries:
const service = require("./database/dbQueries");

// require functions to send and receive messages using amqp/rabbitMQ
const { sendToQueue } = require("./rabbitMQ/sendToQueue");
const { receiveFromQueue } = require("./rabbitMQ/receiveFromQueue");
const { receiveFanOutExchange } = require("./rabbitMQ/receiveFanOutExchange");

app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// stock ordering microservice PORT
const stockOrderingPORT = 4003;

// Queue and Exchange names used through rabbitMQ
const stockOrdersQueue = "stockOrdersQueue";
const canceledOrdersQueue = "canceledOrdersQueue";
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockOrderingQueue";
const canceledOrdersConfirmationQueue = "canceledOrdersConfirmation";

// get a specifc user's trade orders from stock_orders db, requested from UI
app.get("/getUserStockOrders", async (req, res) => {
   const orders = await service.getUserStockOrders(req.query.userID);
   // console.log(orders);
   res.send(orders);
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

// setup a websocket
io.on("connection", (socket) => {
   console.log("client is connected, id: ", socket.id);
});

// using websocket, emit the updated order status and ID to UI (UserStockOrders component) given an orderID
const emitOrderStatus = async (socket, orderID) => {
   // get order status
   const orderStatus = await service.getOrderStatus(orderID);
   const updatedOrder = { orderID, orderStatus };
   // emit updated order's id and status
   socket.emit("updatedOrderStatus", updatedOrder);
};

// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrder = async (io) => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateOrderStatus(io, matchedOrder)
   );
};

// callback function used to update order status and send to ui
const updateOrderStatus = (io, matchedOrder) => {
   service.updateOrderStatusToClosed(
      matchedOrder.buyOrderID,
      matchedOrder.sellOrderID
   );
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
   emitOrderStatus(io, matchedOrder.buyOrderID);
   emitOrderStatus(io, matchedOrder.sellOrderID);
};
receiveMatchedOrder(io);

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
   // console.log("received canceled order confirmation");
};

receiveCanceledOrderConfirmation();

server.listen(
   stockOrderingPORT,
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
