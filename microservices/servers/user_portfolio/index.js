const express = require("express");
const cors = require("cors");
const app = express();

// websocket/socket.io requirements
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

// require db connection and queries
const service = require("./database/dbQueries");

// require functions to send and receive messages using amqp/rabbitMQ
const { receiveFanOutExchange } = require("./rabbitMQ/receiveFanOutExchange");

app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// user portfolio microservice PORT
const userPortfolioPORT = 4001;

// Queues and Exchange names used
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersUserPortfolioQueue";

// !!!! curently user_id in cash_holdings and stock_holdings is not linked to user_id in user accounts, need to implement cross-microservice data replication using rabbitMQ as a messanger

// use socket.io
io.on("connection", (socket) => {
   console.log("websocket connection started", socket.id);

   socket.on("currentUserID", async (userID) => {
      const userCashHoldings = await service.getUserCashHoldings(userID);
      const userStockHoldings = await service.getUserStockHoldings(userID);
      // console.log("user cash holdings: ", userCashHoldings);
      // console.log("user stock holdings: ", userStockHoldings);
      socket.emit("userPortfolio", {
         cash: userCashHoldings.cash,
         stocks: userStockHoldings,
      });
   });
});

// get user cash holdings
app.get("/getUserCashHoldings", (req, res) => {
   service.getUserCashHoldings(req.query.userID).then((result) => {
      // console.log(result.cash);
      res.send(result.cash);
   });
});

// get user stock holdings
// need to setup database replication for this to work, using rabbitMQ
app.get("/getUserStockHoldings", (req, res) => {
   service.getUserStockHoldings(req.query.userID).then((stocks) => {
      // console.log(stocks);
      res.send(stocks);
   });
});

// receive matched order from order_matching microservice
const receiveMatchedOrder = async () => {
   const matchedOrder = await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue
   );
   console.log(
      `matched order received from ${matchedOrdersQueue} queue, order: `,
      matchedOrder
   );

   // update user cash and stock holdings after matched order is received
   service.updateUserCashHoldingsAfterMatch(
      matchedOrder.buyerID,
      matchedOrder.sellerID,
      matchedOrder.price,
      matchedOrder.quantity
   );
   service.updateUserStockHoldingsAfterMatch(
      matchedOrder.buyerID,
      matchedOrder.sellerID,
      matchedOrder.ticker,
      matchedOrder.quantity
   );
};
setInterval(receiveMatchedOrder, 1000);

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

server.listen(
   userPortfolioPORT,
   console.log(
      "user portfolio microservice running on port ",
      userPortfolioPORT
   )
);
