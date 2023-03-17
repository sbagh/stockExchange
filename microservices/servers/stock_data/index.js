const express = require("express");
const cors = require("cors");

// require db connection and queries:
const service = require("./database/dbQueries");

// require functions to send and receive messages using amqp/rabbitMQ
const { receiveFanOutExchange } = require("./rabbitMQ/receiveFanOutExchange");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// stock data microservice PORT
const stockDataPORT = 4002;

// Queues and Exchange names used
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersStockDataQueue";

// query db for stock prices and stock data (db: stock_data, table: stock_data)
app.get("/getStockData", (req, res) => {
   service.getStockData(req, res).then((data) => {
      // console.log(data);
      res.send(data);
   });
});

// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrder = async () => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      updateStockData
   );
};
// callback function used to update stock data and send to ui
const updateStockData = (matchedOrder) => {
   service.updateStockDataAfterMatch(matchedOrder.price, matchedOrder.ticker);
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
};
receiveMatchedOrder();

app.listen(
   stockDataPORT,
   console.log("stock data microservice running on port  ", stockDataPORT)
);
