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
//import order matching class from classes, used to match orders
const orderMatchingClass_1 = require("./classes/orderMatchingClass");
// require db connection and queries
const db = __importStar(require("./database/dbQueries"));
// import functions used by amqp/rabbitMQ
const sendToQueue_1 = require("./rabbitMQ/sendToQueue");
const receiveFromQueue_1 = require("./rabbitMQ/receiveFromQueue");
const publishFanOutExchange_1 = require("./rabbitMQ/publishFanOutExchange");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
// order matching microservice PORT
const orderMatchingPORT = 4004;
// Queue and Exchange names used
const stockOrdersQueue = "stockOrdersQueue";
const canceledOrdersQueue = "canceledOrdersQueue";
const canceledOrdersConfirmationQueue = "canceledOrdersConfirmation";
const matchedOrdersExchange = "matchedOrdersExchange";
//instantiate a stock exchange from stockMatchingClass
const stockExchange = new orderMatchingClass_1.orderMatchingClass();
// ------------------- Code Starts Here ------------------- //
// ----------- 1. Received Stock Order Functions ----------- //
//receive stock orders from stockOrderingQue, then add the order to buyOrders or sellOrders array in stock exchange
const receiveStockOrder = async () => {
    //receiveFromQueue rabbitmq function / sendToExchange callback function
    await (0, receiveFromQueue_1.receiveFromQueue)(stockOrdersQueue, sendToExchange);
};
// when a stock order is recieved, send it to the stock exchange, to be placed in a buyOrders or sellOrders array then matched
const sendToExchange = (orderDetails) => {
    // add to buy or sell orders array depending on order_type
    orderDetails.orderType === "buy"
        ? stockExchange.addBuyOrder(orderDetails.userID, orderDetails.ticker, orderDetails.quantity, orderDetails.price, orderDetails.orderID)
        : stockExchange.addSellOrder(orderDetails.userID, orderDetails.ticker, orderDetails.quantity, orderDetails.price, orderDetails.orderID);
    // console.log(
    //    "order received to order matching index.js from que: ",
    //    orderDetails
    // );
    // console.log("buy orders array before match: ", stockExchange.buyOrders);
    // console.log("sell orders array before match: ", stockExchange.sellOrders);
};
receiveStockOrder();
// ----------- 2. Match Orders Functions ----------- //
let matchOrdersInterval;
// match orders, then update matched_order db and send the matched order to other microservices
const matchOrders = async () => {
    // create an interval to match new orders in the stockOrdersQueue
    matchOrdersInterval = setInterval(async () => {
        const matchedOrders = stockExchange.matchOrders();
        // console.log(matchedOrders);
        if (matchedOrders && matchedOrders.length > 0) {
            //loop over the matchedOrders array
            while (matchedOrders.length > 0) {
                // a matched order object: matchedOrder = { buyOrderID, sellOrderID, buyerID, sellerID, price, time, ticker, quantity }
                // take out the first order in the matchedOrders array and process it
                let matchedOrder = matchedOrders.shift();
                // console.log("matched order: ", matchedOrder);
                // ensure matchedOrder is not undefined after .shift()
                if (matchedOrder) {
                    //update matched_orders db after matching a trade
                    db.updateMatchedOrdersTable(matchedOrder);
                    // send matched order to the fanout exchange called matchedOrdersExchange
                    await (0, publishFanOutExchange_1.publishFanOutExchange)(matchedOrdersExchange, matchedOrder);
                }
            }
        }
    }, 1000);
};
matchOrders();
// ----------- 3. Cancel Orders Functions ----------- //
// recieve canceled stock order from stock ordering microservice using rabbitMQ
const receiveCanceledOrder = async () => {
    await (0, receiveFromQueue_1.receiveFromQueue)(canceledOrdersQueue, removeOrder);
};
// callback to remove order from buyOrders or sellOrders array in stock exchange
const removeOrder = async (canceledOrder) => {
    await stockExchange.removeOrder(canceledOrder.orderID, canceledOrder.orderType);
    console.log("order received to index.js from canceled orders que: ", canceledOrder);
    // send canceled order confirmation to canceledOrdersConfirmation queue, to be received by stock ordering microservice
    await (0, sendToQueue_1.sendToQueue)(canceledOrdersConfirmationQueue, canceledOrder);
    // console.log("sent confirmation of canceled order");
};
receiveCanceledOrder();
app.listen(orderMatchingPORT, () => console.log("order matching microservice running on port ", orderMatchingPORT));
//# sourceMappingURL=index.js.map