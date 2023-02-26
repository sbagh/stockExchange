const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const userPortfolioPORT = 4001;

// require db connection and queries:
const service = require("./dbQueries");

// !!!! curently user_id in cash_holdings and stock_holdings is not linked to user_id in user accounts, need to implement cross-microservice data replication using rabbitMQ as a messanger

// get user cash holdings
app.get("/getUserCashHoldings", (req, res) => {
   service.getUserCashHoldings(req.query.userID).then((result) => {
      console.log(result.cash);
      res.send(result.cash);
   });
});

// get user stock holdings
// need to setup database replication for this to work, using rabbitMQ
app.get("/getUserStockHoldings", (req, res) => {
   service.getUserStockHoldings(req.query.userID).then((stocks) => {
      console.log(stocks);
      res.send(stocks);
   });
});

// // update buy and seller user portfolios after an order is matched, received from order matching microservice
// app.put("/updateUserPortfolioAfterMatch", (req, res) => {
//    req.body = { buyer_id, seller_id, price, ticker, quantity };
//    service.updateUserCashHoldingsAfterMatch(
//       buyer_id,
//       seller_id,
//       price,
//       quantity
//    );
//    service.updateUserStockHoldingsAfterMatch(
//       buyer_id,
//       seller_id,
//       ticker,
//       quantity
//    );
// });

app.listen(
   userPortfolioPORT,
   console.log(
      "user portfolio microservice running on port ",
      userPortfolioPORT
   )
);
