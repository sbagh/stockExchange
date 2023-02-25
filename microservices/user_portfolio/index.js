const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const user_portfolio_PORT = 4001;

// require db connection and queries:
const service = require("./db_queries");

// get user cash holdings
app.get("/getUserCashHoldings", (req, res) => {
   service.getUserCashHoldings(req.query.user_id).then((cash) => {
      // console.log(cash);
      res.send(cash);
   });
});

// get user stock holdings
app.get("/getUserStockHoldings", (req, res) => {
   service.getUserStockHoldings(req.query.user_id).then((stocks) => {
      // console.log(stocks);
      res.send(stocks);
   });
});

// update buy and seller user portfolios after an order is matched, received from order matching microservice
app.put("/updateUserPortfolioAfterMatch", (req, res) => {
   req.body = { buyer_id, seller_id, price, ticker, quantity };
   service.updateUserCashHoldingsAfterMatch(
      buyer_id,
      seller_id,
      price,
      quantity
   );
   service.updateUserStockHoldingsAfterMatch(
      buyer_id,
      seller_id,
      ticker,
      quantity
   );
});

app.listen(
   user_portfolio_PORT,
   console.log(
      "user portfolio microservice running on port ",
      user_portfolio_PORT
   )
);
