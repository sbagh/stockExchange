const express = require("express");
const cors = require("cors");

// require functions to send and receive messages to amqp/rabbitMQ queue
const { receiveFromQue } = require("./rabbitMQ");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// stock data microservice URL
const stockDataPORT = 4002;

// receive messages from order matching queue using rabbitMQ/amqplib:
const matchedOrdersQueue = "matchedOrdersQueue";

// require db connection and queries:
const service = require("./dbQueries");

// query db for stock prices and stock data (db: stock_data, table: stock_data)
app.get("/getStockData", (req, res) => {
   service.getStockData(req, res).then((data) => {
      // console.log(data);
      res.send(data);
   });
});

// // receive matched order from order_matching microservice
// const receiveMatchedOrder = async () => {
//    const matchedOrder = await receiveFromQue(matchedOrdersQueue);
//    console.log(
//       `matched order received from ${matchedOrdersQueue} queue, order: `,
//       matchedOrder
//    );

//    // update order status to closed in stock_orders table after buy and sell orders are matched
//    service.updateStockDataAfterMatch(matchedOrder.price, matchedOrder.ticker);
// };
// setInterval(receiveMatchedOrder, 1000);

// // update stock_data db after an order is matched, recieved from order_matching microservice
// app.put("/updateStockDataAfterMatch", (req, res) => {
//    service.updateStockDataAfterMatch(req.body.price, req.body.ticker);
// });

app.listen(
   stockDataPORT,
   console.log("stock data microservice running on port  ", stockDataPORT)
);
