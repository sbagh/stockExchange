// This is server code I commented out during refactoring
// in case I want to look at it again


//server.js

// 1 - old way to update userPortfolio:

// update userPortfolio through the updateUserPortfolio axios put request from ui (component: StockMarket.js)
// app.put("/updateUserPortfolio", async (req, res) => {
//    const { user, userPortfolio } = req.body;
//    const result = await updateUserPortfolioJSON(user, userPortfolio);
//    res.send(result);
// });


// 2- old way to receive buy orders:

// receive buy orders through the stockBuyOrder axios post request from ui (component: StockMarket.js), then send them to the stock exchange
// app.post("/stockBuyOrder", (req, res) => {
//    const {
//       user,
//       orderDetails: { ticker, quantity, price },
//    } = req.body;
//    stockExchange.addBuyOrder(user, ticker, parseInt(quantity), parseInt(price));
//    // console.log("buy orders: ", stockExchange.buyOrders);
//    res.send("done");
// });

// 3- old way to receive sell orders:

// receive sell orders through the stockBuyOrder axios post request from ui (component: StockMarket.js), then send them to the stock exchange
// app.post("/stockSellOrder", (req, res) => {
//    const {
//       user,
//       orderDetails: { ticker, quantity, price },
//    } = req.body;
//    stockExchange.addSellOrder(
//       user,
//       ticker,
//       parseInt(quantity),
//       parseInt(price)
//    );
//    // console.log("sell orders: ", stockExchange.sellOrders);
//    res.send("done");
// });



// 4- using Chokidar to watch file changes:

//import and set up chokidar to read json file updates
// const chokidar = require("chokidar");

// const userPortfolioWatcher = chokidar.watch(".Stocks/data/userPortfolio.json", {
//    ignored: /(^|[\/\\])\../, // ignore dotfiles
//    persistent: true,
// });

// let changeListener = async (socket, path) => {
//    const updatedData = await findUpdateJSONdata(path, userPortfolioTempHold);
//    console.log(updatedData);
//    socket.emit("updatedUserProfile", updatedData);
// };



// 5 - moving system to websocket / socket.io

// commenting out socket code, it is not working well
//import and setup Socket.io
// const http = require("http").Server(app);
// const io = require("socket.io")(http);

// io.on("connection", (socket) => {
//    // Temporary object  to hold the JSON file in its previous state. This object will be used to compare the updated state to find changes in a user's portfolio.
//    let userPortfolioTempHold = {};

//    socket.on("getUserPortfolio", async (username) => {
//       const userData = await getUserPortfolio(username);
//       userPortfolioTempHold = userData;
//       socket.emit("userPortfolio", userData);
//    });

//    if (!userPortfolioWatcher) {
//       userPortfolioWatcher.on("change", (path) => changeListener(socket, path));
//    }

//    socket.on("disconnect", () => {
//       userPortfolioWatcher.off("change", (path) =>
//          changeListener(socket, path)
//       );
//    });
// });