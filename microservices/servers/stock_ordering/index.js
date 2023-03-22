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
const { userInfo } = require("os");

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

const emitUserOrderHistory = async (socket, userID) => {
   console.log("received user id in emit function: ", userID);
   // first get user's order history
   const userOrderHistory = await service.getUserStockOrders(userID);
   console.log("got order history to emit function: ", userOrderHistory);
   // emit user order history to UI (component UserStockOrders)
   socket.emit("userOrderHistory", userOrderHistory);
   return;
};

// 2- receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
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

// 3- receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrder = async () => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateOrderStatus(matchedOrder)
   );
};

// 4- callback function used to update order status and send to ui
const updateOrderStatus = async (matchedOrder) => {
   await service.updateOrderStatusToClosed(
      matchedOrder.buyOrderID,
      matchedOrder.sellOrderID
   );
   console.log(
      `matched order received from ${matchedOrdersQueue} queue, order: `,
      matchedOrder
   );
   const socket = app.get("socketio");
   await emitUserOrderHistory(socket, matchedOrder.buyerID);
   await emitUserOrderHistory(socket, matchedOrder.sellerID);
};
receiveMatchedOrder();

// 6- cancel a trade order if request from UI
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

// 7- recieve order cancel confirmation from order matching microservice using rabbitMQ
const receiveCanceledOrderConfirmation = async () => {
   await receiveFromQueue(canceledOrdersConfirmationQueue, cancelOrder);
};

// 8- callback function used to update order status and send to ui
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
