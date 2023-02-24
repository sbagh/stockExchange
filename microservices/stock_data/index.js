const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const stock_data_PORT = 4002;

// require db connection and queries:
const service = require("./dbQueries");

// query db for stock prices and stock data (db table: stock_data)
app.get("/getStockData", (req, res) => {
   service.getStockData(req, res).then((data) => {
      // console.log(data);
      res.send(data);
   });
});

app.listen(
   stock_data_PORT,
   console.log("stock data microservice running on port  ", stock_data_PORT)
);
