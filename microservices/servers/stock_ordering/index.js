const express = require("express");
const cors = require("cors");
const app = express();

//websocket/socket.io reqiurements
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// setting socket.io as an app object, to access io in different parts of code
app.set("socketio", io);

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

// setup a websocket
io.on("connection", (socket) => {
   console.log("client is connected, id: ", socket.id);
   //get user ID from UI then emit their oder history
   socket.on("currentUserID", async (userID) => {
      await emitUserOrderHistory(socket, userID);
   });
});

// Emit a specific user's order history
const emitUserOrderHistory = async (socket, userID) => {
   // first get user's order history
   const userOrderHistory = await service.getUserStockOrders(userID);
   // console.log("userOrderHistory: ", userOrderHistory);
   // emit user order history to UI (component UserStockOrders)
   socket.emit("userOrderHistory", userOrderHistory);
   return;
};

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
   // get socket from app definition, and emit user order history to UI
   const socket = app.get("socketio");
   await emitUserOrderHistory(socket, orderDetails.userID);
});

// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrder = async () => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateOrderStatus(matchedOrder)
   );
};

// callback function used to update order status and send to ui
const updateOrderStatus = async (matchedOrder) => {
   await service.updateOrderStatusToClosed(
      matchedOrder.buyOrderID,
      matchedOrder.sellOrderID
   );
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
   const socket = app.get("socketio");
   await emitUserOrderHistory(socket, matchedOrder.buyerID);
   await emitUserOrderHistory(socket, matchedOrder.sellerID);
};
receiveMatchedOrder();

// cancel a trade order if request from UI
app.put("/cancelTradeOrder", async (req, res) => {
   // deconstruct req qeuries and place in a canceledOrder object
   const canceledOrder = {
      orderID: req.query.orderID,
      orderType: req.query.orderType,
      orderStatus: req.query.orderStatus,
      userID: req.query.userID,
   };
   // console.log("canceled order request received from ui: ", canceledOrder);

   //send canceledOrder object to order matching service via
   await sendToQueue(canceledOrdersQueue, canceledOrder);
   res.send("order canceled");
});

// recieve order cancel confirmation from order matching microservice using rabbitMQ
const receiveCanceledOrderConfirmation = async () => {
   await receiveFromQueue(canceledOrdersConfirmationQueue, cancelOrder);
};
// callback function used to update order status and send to ui
const cancelOrder = async (canceledOrder) => {
   await service.updateOrderStatusToCanceled(canceledOrder);
   // console.log("canceled order: ", canceledOrder);
   const socket = app.get("socketio");
   await emitUserOrderHistory(socket, canceledOrder.userID);
};
receiveCanceledOrderConfirmation();

server.listen(
   stockOrderingPORT,
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
