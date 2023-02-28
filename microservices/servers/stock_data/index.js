const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// stock data microservice URL
const stockDataPORT = 4002;

// require db connection and queries:
const service = require("./dbQueries");

// query db for stock prices and stock data (db: stock_data, table: stock_data)
app.get("/getStockData", (req, res) => {
   service.getStockData(req, res).then((data) => {
      // console.log(data);
      res.send(data);
   });
});

// // update stock_data db after an order is matched, recieved from order_matching microservice
// app.put("/updateStockDataAfterMatch", (req, res) => {
//    service.updateStockDataAfterMatch(req.body.price, req.body.ticker);
// });

app.listen(
   stockDataPORT,
   console.log("stock data microservice running on port  ", stockDataPORT)
);
