const express = require("express");
const cors = require("cors");
const app = express();

//websocket/socket.io reqiurements
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

// require db connection and queries:
const db = require("./database/dbQueries");

// require functions to send and receive messages using amqp/rabbitMQ
const { receiveFanOutExchange } = require("./rabbitMQ/receiveFanOutExchange");

app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// stock data microdb PORT
const stockDataPORT = 4002;

// Queues and Exchange names used
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockDataQueue";

// create websocket
io.on("connection", async (socket) => {
   console.log("client is connected, id: ", socket.id);
   //emite stock data to UI (StockData component)
   await emitStockData(socket);
});

const emitStockData = async (socket) => {
   // get stock data from db
   const stockData = await db.getStockData();
   console.log(stockData);
   socket.emit("stockData", stockData);
};

// receive matched orders from order matching microdb using rabbitMQ
const receiveMatchedOrder = async (io) => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateStockData(io, matchedOrder)
   );
};
// callback function used to update stock data and send to ui
const updateStockData = async (io, matchedOrder) => {
   db.updateStockDataAfterMatch(matchedOrder.price, matchedOrder.ticker);
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
   await emitStockData(io);
};
receiveMatchedOrder(io);

server.listen(
   stockDataPORT,
   console.log("stock data microdb running on port  ", stockDataPORT)
);
