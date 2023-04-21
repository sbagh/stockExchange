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
// import db functions
const db = __importStar(require("./database/dbQueries"));
// import rabbitMQ functions used here
const receiveFanOutExchange_1 = require("./rabbitMQ/receiveFanOutExchange");
// import socket.io functoin:
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
//websocket/socket.io setup
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// stock data microservice PORT
const stockDataPORT = 4002;
// Queues and Exchange names used by rabbitMQ
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockDataQueue";
// --------------------- Code Starts Here --------------------- //
// create websocket
io.on("connection", async (socket) => {
    console.log("client is connected, id: ", socket.id);
    //emite stock data to UI (StockData component)
    await emitStockData(socket);
});
const emitStockData = async (socket) => {
    // get stock data from db
    const stockData = await db.getStockData();
    // console.log(stockData);
    socket.emit("stockData", stockData);
};
// receive matched orders from order matching microservice using rabbitMQ, then run the updateStockData as a callback function
const receiveMatchedOrder = async (io) => {
    await (0, receiveFanOutExchange_1.receiveFanOutExchange)(matchedOrdersExchange, matchedOrdersQueue, (matchedOrder) => updateStockData(io, matchedOrder));
};
// callback function used to update stock data and send to ui
const updateStockData = async (io, matchedOrder) => {
    await db.updateStockDataAfterMatch(matchedOrder.price, matchedOrder.time, matchedOrder.ticker);
    // console.log(
    //    `matched order received from ${matchedOrdersQueue} queue, order: `,
    //    matchedOrder
    // );
    emitStockData(io);
};
receiveMatchedOrder(io);
server.listen(stockDataPORT, () => console.log("stock data microservice running on port  ", stockDataPORT));
//# sourceMappingURL=index.js.map