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
   console.log("client is connected, id: ", socket.id);

   // receive userID initiated by UI (UserPortfolio component)
   socket.on("currentUserID", async (userID) => {
      // get user cash and stock holdings
      const userCashHoldings = await service.getUserCashHoldings(userID);
      const userStockHoldings = await service.getUserStockHoldings(userID);
      // console.log("user portfolio: ", {cash: userCashHoldings, stocks: userStockHoldings});

      // emit user cash and stock holdings back to UI (UserPortfolio component)
      socket.emit("userPortfolio", {
         userCashHoldings: userCashHoldings.cash,
         userStockHoldings: userStockHoldings,
      });
   });
});

// receive matched order from order_matching microservice
const startReceivingMatchedOrders = async () => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      receiveMatchedOrder
   );
};
const receiveMatchedOrder = (matchedOrder) => {
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

startReceivingMatchedOrders();

server.listen(
   userPortfolioPORT,
   console.log(
      "user portfolio microservice running on port ",
      userPortfolioPORT
   )
);
