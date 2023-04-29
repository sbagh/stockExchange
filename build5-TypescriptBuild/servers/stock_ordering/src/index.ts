import express from "express";
import cors from "cors";
import http from "http";
// import socket.io requirements
import { Server } from "socket.io";
// import db connection and queries:
import * as db from "./database/dbQueries";
// import functions used by amqp/rabbitMQ
import { sendToQueue } from "./rabbitMQ/sendToQueue";
import { receiveFromQueue } from "./rabbitMQ/receiveFromQueue";
import { receiveFanOutExchange } from "./rabbitMQ/receiveFanOutExchange";
import type { StockOrderDetails } from "./interface/interface";

const app: express.Application = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

//socket.io setup
const server: http.Server = http.createServer(app);
const io: Server = new Server(server);
// setting socket.io as an app object, to access io in different parts of code
app.set("socketio", io);

// stock ordering microservice PORT
const stockOrderingPORT: number = 4003;

// Queue and Exchange names used through rabbitMQ
const stockOrdersQueue: string = "stockOrdersQueue";
const canceledOrdersQueue: string = "canceledOrdersQueue";
const matchedOrdersExchange: string = "matchedOrdersExchange";
const matchedOrdersQueue: string = "matchedOrdersStockOrderingQueue";
const canceledOrdersConfirmationQueue: string = "canceledOrdersConfirmation";

// --------------------- Code Starts Here --------------------- //

// setup a websocket
io.on("connection", (socket: any) => {
   console.log("client is connected, id: ", socket.id);
   //get user ID from UI then emit their oder history
   socket.on("currentUserID", async (userID: number) => {
      await emitUserOrderHistory(socket, userID);
   });
});

// Emit a specific user's order history
const emitUserOrderHistory = async (socket: any, userID: number) => {
   // first get user's order history
   const userOrderHistory = await db.getUserStockOrders(userID);
   // console.log("userOrderHistory: ", userOrderHistory);
   // emit user order history to UI (component UserStockOrders)
   socket.emit("userOrderHistory", userOrderHistory);
};

// receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
app.post(
   "/startTradeOrder",
   async (req: express.Request, res: express.Response) => {
      const orderDetails: StockOrderDetails = req.body.orderDetails;
      // console.log("received order from UI: ", orderDetails);
      // set order_status to open
      orderDetails.orderStatus = "Open";
      // add trade order to stock_orders db
      await db.addStockOrder(orderDetails);
      // send order to stockOrdersQueue, which will send to order matching micromicroservice
      await sendToQueue(stockOrdersQueue, orderDetails);
      // get socket from app definition, and emit user order history to UI
      const socket = app.get("socketio");
      await emitUserOrderHistory(socket, orderDetails.userID);
   }
);

// receive matched orders from order matching micromicroservice using rabbitMQ
const receiveMatchedOrder = async () => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder: any) => updateOrderStatus(matchedOrder)
   );
};

// callback function used to update order status and send to ui
const updateOrderStatus = async (matchedOrder: any) => {
   await db.updateOrderStatusToFilled(
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
app.put(
   "/cancelTradeOrder",
   async (req: express.Request, res: express.Response) => {
      // deconstruct req qeuries and place in a canceledOrder object
      const canceledOrder = {
         orderID: req.query.orderID,
         orderType: req.query.orderType,
         orderStatus: req.query.orderStatus,
         userID: req.query.userID,
      };
      // console.log("canceled order request received from ui: ", canceledOrder);

      //send canceledOrder object to order matching microservice via rabbitMQ queue
      await sendToQueue(canceledOrdersQueue, canceledOrder);
      res.send("order canceled");
   }
);

// recieve order cancel confirmation from order matching microservice using rabbitMQ
const receiveCanceledOrderConfirmation = async () => {
   await receiveFromQueue(canceledOrdersConfirmationQueue, cancelOrder);
};
// callback function used to update order status and send to ui
const cancelOrder = async (canceledOrder: any) => {
   await db.updateOrderStatusToCanceled(canceledOrder);
   // console.log("canceled order: ", canceledOrder);
   const socket = app.get("socketio");
   await emitUserOrderHistory(socket, canceledOrder.userID);
};
receiveCanceledOrderConfirmation();

server.listen(stockOrderingPORT, () =>
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
