// !!!! curently 'user_id' in cash_holdings & stock_holdings tables is not referenced to 'user_id' in user accounts table, need to implement cross-microservice data replication or other data sync methods using rabbitMQ as a messanger

import express from "express";
import http from "http";
import cors from "cors";
// import socket.io requirements
import { Server } from "socket.io";
// imoprt db connection and queries
import * as db from "./database/dbQueries";
// require rabbitMQ functions used here
import { receiveFanOutExchange } from "./rabbitMQ/receiveFanOutExchange";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// socket.io setup
const server = http.createServer(app);
const io: Server = new Server(server);

// user portfolio microservice PORT
const userPortfolioPORT = 4001;

// amqp Queues and Exchange names used by rabbitMQ
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersUserPortfolioQueue";

// --------------------- Code Starts Here --------------------- //

// use socket.io
io.on("connection", (socket: any) => {
   console.log("client is connected, id: ", socket.id);

   // receive userID from UI (UserPortfolio component)
   socket.on("currentUserID", async (userID) => {
      await emitUserPortfolio(socket, userID);
   });
});

// get and emit user portfolio (cash and stock holdings)
const emitUserPortfolio = async (socket: any, userID: number) => {
   // get user cash and stock holdings from db tables
   const userCashHoldings = await db.getUserCashHoldings(userID);
   const userStockHoldings = await db.getUserStockHoldings(userID);
   // emit user cash and stock holdings back to UI (UserPortfolio component)
   socket.emit("userPortfolio", {
      userCashHoldings: userCashHoldings,
      userStockHoldings: userStockHoldings,
   });
};

// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrders = async (io: Server) => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateUserPortfolio(io, matchedOrder)
   );
};
// callback function used to update user portfolio and send to ui
const updateUserPortfolio = async (
   io: Server,
   matchedOrder: {
      buyerID: number;
      sellerID: number;
      price: number;
      ticker: string;
      quantity: number;
   }
) => {
   // update buyer and seller cash holdings after order is matched
   await db.updateUserCashHoldingsAfterMatch(
      matchedOrder.buyerID,
      matchedOrder.sellerID,
      matchedOrder.price,
      matchedOrder.quantity
   );
   // update buyer and seller stock holdings after order is matched
   await db.updateUserStockHoldingsAfterMatch(
      matchedOrder.buyerID,
      matchedOrder.sellerID,
      matchedOrder.ticker,
      matchedOrder.quantity
   );
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
   await emitUserPortfolio(io, matchedOrder.buyerID);
   await emitUserPortfolio(io, matchedOrder.sellerID);
};

receiveMatchedOrders(io);

server.listen(userPortfolioPORT, () =>
   console.log(
      "user portfolio microservice running on port ",
      userPortfolioPORT
   )
);
