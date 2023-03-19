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

// amqp Queues and Exchange names used
const matchedOrdersExchange = "matchedOrdersExchange";
const matchedOrdersQueue = "matchedOrdersUserPortfolioQueue";

// !!!! curently user_id in cash_holdings and stock_holdings tables is not linked to user_id in user accounts table, need to implement cross-microservice data replication or other data sync methods using rabbitMQ as a messanger

// use socket.io
io.on("connection", (socket) => {
   console.log("client is connected, id: ", socket.id);

   // receive userID from UI (UserPortfolio component)
   socket.on("currentUserID", async (userID) => {
      await emitUserPortfolio(socket, userID);
   });
});
// get and emit user portfolio (cash and stock holdings)
const emitUserPortfolio = async (socket, userID) => {
   // get user cash and stock holdings from db tables
   const userCashHoldings = await service.getUserCashHoldings(userID);
   const userStockHoldings = await service.getUserStockHoldings(userID);
   // emit user cash and stock holdings back to UI (UserPortfolio component)
   socket.emit("userPortfolio", {
      userCashHoldings: userCashHoldings.cash,
      userStockHoldings: userStockHoldings,
   });
};
// receive matched orders from order matching microservice using rabbitMQ
const receiveMatchedOrders = async (io) => {
   await receiveFanOutExchange(
      matchedOrdersExchange,
      matchedOrdersQueue,
      (matchedOrder) => updateUserPortfolio(io, matchedOrder)
   );
};
// callback function used to update user portfolio and send to ui
const updateUserPortfolio = async (io, matchedOrder) => {
   // update buyer and seller cash holdings after order is matched
   await service.updateUserCashHoldingsAfterMatch(
      matchedOrder.buyerID,
      matchedOrder.sellerID,
      matchedOrder.price,
      matchedOrder.quantity
   );
   // update buyer and seller stock holdings after order is matched
   await service.updateUserStockHoldingsAfterMatch(
      matchedOrder.buyerID,
      matchedOrder.sellerID,
      matchedOrder.ticker,
      matchedOrder.quantity
   );
   // console.log(
   //    `matched order received from ${matchedOrdersQueue} queue, order: `,
   //    matchedOrder
   // );
   await emitUserPortfolio(io, matchedOrder.buyerID);
   await emitUserPortfolio(io, matchedOrder.sellerID);
};

receiveMatchedOrders(io);

server.listen(
   userPortfolioPORT,
   console.log(
      "user portfolio microservice running on port ",
      userPortfolioPORT
   )
);
