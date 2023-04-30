"use strict";
// !!!! curently 'user_id' in cash_holdings & stock_holdings tables is not referenced to 'user_id' in user accounts table, need to implement cross-microservice data replication or other data sync methods using rabbitMQ as a messanger
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
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
// import socket.io requirements
const socket_io_1 = require("socket.io");
// imoprt db connection and queries
const db = __importStar(require("./database/dbQueries"));
// require rabbitMQ functions used here
const receiveFanOutExchange_1 = require("./rabbitMQ/receiveFanOutExchange");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
// socket.io setup
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// user portfolio microservice PORT
const userPortfolioPORT = 4001;
// amqp Queues and Exchange names used by rabbitMQ
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersUserPortfolioQueue";
// --------------------- Code Starts Here --------------------- //
// ----------- 1. Socket.io Functions ----------- //
// use socket.io
io.on("connection", (socket) => {
    console.log("client is connected, id: ", socket.id);
    // receive userID from UI (UserPortfolio component)
    socket.on("currentUserID", async (userID) => {
        await emitUserPortfolio(socket, userID);
    });
});
// emit user portfolio to ui (both cash and stock holdings)
const emitUserPortfolio = async (socket, userID) => {
    // get user cash and stock holdings from db tables
    const userCashHoldings = await db.getUserCashHoldings(userID);
    const userStockHoldings = await db.getUserStockHoldings(userID);
    // emit user cash and stock holdings back to UI (UserPortfolio component)
    socket.emit("userPortfolio", {
        userCashHoldings: userCashHoldings,
        userStockHoldings: userStockHoldings,
    });
};
// ----------- 2. Matched Order Functions ----------- //
// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrders = async (io) => {
    await (0, receiveFanOutExchange_1.receiveFanOutExchange)(matchedOrdersExchange, matchedOrdersQueue, (matchedOrder) => updateUserPortfolio(io, matchedOrder));
};
// callback function used to update user portfolio and send to ui
const updateUserPortfolio = async (io, matchedOrder) => {
    // update buyer and seller cash holdings after order is matched
    await db.updateUserCashHoldingsAfterMatch(matchedOrder.buyerID, matchedOrder.sellerID, matchedOrder.price, matchedOrder.quantity);
    // update buyer and seller stock holdings after order is matched
    await db.updateUserStockHoldingsAfterMatch(matchedOrder.buyerID, matchedOrder.sellerID, matchedOrder.ticker, matchedOrder.quantity);
    // console.log(
    //    `matched order received from ${matchedOrdersQueue} queue, order: `,
    //    matchedOrder
    // );
    await emitUserPortfolio(io, matchedOrder.buyerID);
    await emitUserPortfolio(io, matchedOrder.sellerID);
};
receiveMatchedOrders(io);
server.listen(userPortfolioPORT, () => console.log("user portfolio microservice running on port ", userPortfolioPORT));
//# sourceMappingURL=index.js.map