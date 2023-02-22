const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const PORT = 5555;

// require db connection and queries:
const service = require("./db_queries");
const { default: App } = require("../../client/src/App");

// get user cash holdings
app.get("/getUserCashHoldings", (req, res) => {
   service.getUserCashHoldigns(req.query.user_id).then((cash) => {
      console.log(cash);
      res.send(cash);
   });
});

// get user stock holdings
app.get("/getUserStockHoldings", (req, res) => {
   service.getUserStockHoldings(req.query.user_id).then((stocks) => {
      console.log(stocks);
      res.send(stocks);
   });
});

app.listen(PORT, console.log("listening on port: ", PORT));
