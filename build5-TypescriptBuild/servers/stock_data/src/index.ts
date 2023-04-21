import express from "express";
import cors from "cors";
import http from "http";
// import socket.io requirements
import { Server } from "socket.io";
// import db functions
import * as db from "./database/dbQueries";
// import rabbitMQ functions used here
import { receiveFanOutExchange } from "./rabbitMQ/receiveFanOutExchange";
// import socket.io functoin:

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

//socket.io setup
const server = http.createServer(app);
const io: Server = new Server(server);

// stock data microservice PORT
const stockDataPORT = 4002;

// Queues and Exchange names used by rabbitMQ
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockDataQueue";

// --------------------- Code Starts Here --------------------- //

// create websocket
io.on("connection", async (socket: any) => {
   console.log("client is connected, id: ", socket.id);
   //emite stock data to UI (StockData component)
   await emitStockData(socket);
});

const emitStockData = async (socket: any) => {
   // get stock data from db
   const stockData = await db.getStockData();
   // console.log(stockData);
   socket.emit("stockData", stockData);
};

// receive matched orders from order matching microservice using rabbitMQ, then run the updateStockData as a callback function
const receiveMatchedOrder = async (io: Server) => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateStockData(io, matchedOrder)
   );
};

// callback function used to update stock data and send to ui
const updateStockData = async (
   io: Server,
   matchedOrder: { price: number; time: Date; ticker: string }
) => {
   await db.updateStockDataAfterMatch(
      matchedOrder.price,
      matchedOrder.time,
      matchedOrder.ticker
   );
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
   emitStockData(io);
};
receiveMatchedOrder(io);

server.listen(stockDataPORT, () =>
   console.log("stock data microservice running on port  ", stockDataPORT)
);
