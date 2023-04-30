"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
// import socket.io requirements
const socket_io_1 = require("socket.io");
// import db connection and queries
const db = __importStar(require("./database/dbQueries"));
// import functions used by amqp/rabbitMQ
const sendToQueue_1 = require("./rabbitMQ/sendToQueue");
const receiveFromQueue_1 = require("./rabbitMQ/receiveFromQueue");
const receiveFanOutExchange_1 = require("./rabbitMQ/receiveFanOutExchange");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
//socket.io setup
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// setting socket.io as an app object, to access io in different parts of code
app.set("socketio", io);
// stock ordering microservice PORT
const stockOrderingPORT = 4003;
// Queue and Exchange names used through rabbitMQ
const stockOrdersQueue = "stockOrdersQueue";
const canceledOrdersQueue = "canceledOrdersQueue";
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockOrderingQueue";
const canceledOrdersConfirmationQueue = "canceledOrdersConfirmation";
// ------------------- Code Starts Here ------------------- //
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
    const userOrderHistory = await db.getUserStockOrders(userID);
    // console.log("userOrderHistory: ", userOrderHistory);
    // emit user order history to UI (component UserStockOrders)
    socket.emit("userOrderHistory", userOrderHistory);
};
// ----- New Stock Order Functions ----- //
// receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
app.post("/startTradeOrder", async (req, res) => {
    // get orderDetails from req body
    const orderDetails = req.body.orderDetails;
    // console.log("received order from UI: ", orderDetails);
    // set order_status to open
    orderDetails.orderStatus = "Open";
    // add trade order to stock_orders db
    await db.addStockOrder(orderDetails);
    // send order to stockOrdersQueue, which will send to order matching micromicroservice
    await (0, sendToQueue_1.sendToQueue)(stockOrdersQueue, orderDetails);
    // get socket from app definition, and emit user order history to UI
    const socket = app.get("socketio");
    await emitUserOrderHistory(socket, orderDetails.userID);
});
// ----- Matched Order Functions ----- //
// receive matched orders from order matching micromicroservice using rabbitMQ
const receiveMatchedOrder = async () => {
    await (0, receiveFanOutExchange_1.receiveFanOutExchange)(matchedOrdersExchange, matchedOrdersQueue, (matchedOrder) => updateOrderStatus(matchedOrder));
};
// callback function used to update order status and re-send user trade history to ui
const updateOrderStatus = async (matchedOrder) => {
    // update stock orders table
    await db.updateOrderStatusToFilled(matchedOrder.buyOrderID, matchedOrder.sellOrderID);
    // console.log(
    //    `matched order received from ${matchedOrdersQueue} queue, order: `,
    //    matchedOrder
    // );
    //get stocket from app definition
    const socket = app.get("socketio");
    //re-send order history to UI for both buyer and seller
    await emitUserOrderHistory(socket, matchedOrder.buyerID);
    await emitUserOrderHistory(socket, matchedOrder.sellerID);
};
receiveMatchedOrder();
// ----- Canceled Order Functions ----- //
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
    //send canceledOrder object to order matching microservice via rabbitMQ queue
    await (0, sendToQueue_1.sendToQueue)(canceledOrdersQueue, canceledOrder);
    res.send("order canceled");
});
// recieve order cancel confirmation from order matching microservice using rabbitMQ
const receiveCanceledOrderConfirmation = async () => {
    await (0, receiveFromQueue_1.receiveFromQueue)(canceledOrdersConfirmationQueue, cancelOrder);
};
// callback function used to update order status and send to ui
const cancelOrder = async (canceledOrder) => {
    await db.updateOrderStatusToCanceled(canceledOrder);
    // console.log("canceled order: ", canceledOrder);
    const socket = app.get("socketio");
    await emitUserOrderHistory(socket, canceledOrder.userID);
};
receiveCanceledOrderConfirmation();
server.listen(stockOrderingPORT, () => console.log("stock ordering microservice running on port ", stockOrderingPORT));
//# sourceMappingURL=index.js.map