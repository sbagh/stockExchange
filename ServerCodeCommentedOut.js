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

//6 - UserIneraction API when i was using json files to store data:

// const e = require("express");
// const fs = require("fs");
// const { resolve } = require("path");

// const userPortfolioLink = "./Stocks/data/userPortfolio.json";
// const stockDataLink = "./Stocks/data/stockData.json";
// const tradeHistoryLink = "./Stocks/data/tradeHistory.json";

// // Get a user's portfolio from userData.json
// function getUserPortfolio(user) {
//    return new Promise((resolve, reject) => {
//       fs.readFile(userPortfolioLink, "utf-8", (err, data) => {
//          if (err) reject(err);
//          else {
//             const usersPortfolios = JSON.parse(data);
//             const userPortfolio = usersPortfolios[user];
//             if (userPortfolio) {
//                resolve(userPortfolio);
//             } else {
//                reject("no data found");
//             }
//          }
//       });
//    });
// }

// //find updated json data
// function findUpdateJSONdata(filepath, previousState) {
//    return new Promise((resolve, reject) => {
//       fs.read(filepath, "utf-8", (err, data) => {
//          if (err) throw err;
//          else {
//             const newState = JSON.parse(data);
//             for (const user in newState) {
//                if (
//                   !previousState.hasOwnProperty[user] ||
//                   JSON.stringify(previousState[user]) !==
//                      JSON.stringify(newState[user])
//                ) {
//                   resolve(newState[user]);
//                   break;
//                }
//             }
//          }
//       });
//    });
// }

// // //get any updates to a user's portfolio from UserPortfolio.json
// // function getUpdatesFromUserPortfolio() {
// //    return new Promise((resolve, reject) => {
// //       //1-
// //    });
// // }

// // Get stock data about a ticker from stockData.json
// function getStockData() {
//    return new Promise((resolve, reject) => {
//       fs.readFile(stockDataLink, "utf-8", (err, data) => {
//          if (err) reject(err);
//          else {
//             const stocksData = JSON.parse(data);
//             resolve(stocksData);
//          }
//       });
//    });
// }

// // old updateUserPortfolioJSON, when i was doing the portfolio changes on client:
// // function updateUserPortfolioJSONold(user, updatedUserPortfolio) {
// //    return new Promise((resolve, reject) => {
// //       fs.readFile(userPortfolioLink, "utf-8", (err, data) => {
// //          if (err) throw err;
// //          let usersPortfolios = JSON.parse(data);
// //          usersPortfolios[user.name] = updatedUserPortfolio;

// //          //update the changed data:
// //          fs.writeFile(
// //             userPortfolioLink,
// //             JSON.stringify(usersPortfolios),
// //             (err, data) => {
// //                if (err) reject(err);
// //                else {
// //                   resolve(data);
// //                }
// //             }
// //          );
// //       });
// //    });
// // }

// function updateUserPortfolioJSON(user, ticker, quantity, price, type) {
//    return new Promise((resolve, reject) => {
//       fs.readFile(userPortfolioLink, "utf-8", (err, data) => {
//          if (err) throw err;
//          let usersPortfolios = JSON.parse(data);
//          let userPortfolio = usersPortfolios[user.name];

//          //  Find index of the stock ticker being traded inside the userPortfolio.Stocks object
//          const stockIndex = userPortfolio.Stocks.findIndex(
//             (stock) => stock.name === ticker
//          );

//          //update users portfolio based on buy order
//          if (type === "buy") {
//             // if the stock already exists in the user's portfolio(stockindex !===-1), then add the bought qty, otherwise add the ticker to the object and assign the qty as value
//             if (stockIndex !== -1) {
//                userPortfolio.Stocks[stockIndex].quantity += parseInt(quantity);
//             } else {
//                userPortfolio.Stocks.push({
//                   name: ticker,
//                   quantity: parseInt(quantity),
//                });
//             }

//             // now subtract the qty*price from the user's cash
//             userPortfolio.cash -= parseInt(price) * parseInt(quantity);
//          }

//          //update users portfolio based on sell order
//          else {
//             // subtract amount of stocks user has from sell order quantity
//             userPortfolio.Stocks[stockIndex].quantity -= quantity;

//             // now add price*qty to the user's cash
//             userPortfolio.cash += parseInt(price) * parseInt(quantity);
//          }

//          //update the changed data:
//          fs.writeFile(
//             userPortfolioLink,
//             JSON.stringify(usersPortfolios),
//             (err, data) => {
//                if (err) reject(err);
//                else {
//                   resolve(userPortfolio);
//                }
//             }
//          );
//       });
//    });
// }

// // Append the tradeHistory.json file, first set its contents to a variable, add the new order, then append the file
// function updateTradeHistory(order) {
//    return new Promise((resolve, reject) => {
//       fs.readFile(tradeHistoryLink, "utf-8", (err, data) => {
//          if (err) throw err;
//          let tradeHistory = JSON.parse(data);
//          tradeHistory.push(...order);

//          fs.writeFile(
//             tradeHistoryLink,
//             JSON.stringify(tradeHistory),
//             (err, data) => {
//                if (err) throw err;
//                else {
//                   resolve(data);
//                }
//             }
//          );
//       });
//    });
// }

// //Get the trade history from tradeHistory.json file, to be sent to UI through app.get('/tradeHistory') call in server.js
// function getTradeHistory() {
//    return new Promise((resolve, reject) => {
//       fs.readFile(tradeHistoryLink, "utf-8", (err, data) => {
//          if (err) throw err;
//          let tradeHistory = JSON.parse(data);
//          resolve(tradeHistory);
//       });
//    });
// }

// //after a buy/sell order has matched, the new price is that matched price. This function will update stockData.json to new price.
// function updateStockData(order) {
//    return new Promise((resolve, reject) => {
//       const { ticker, price, time } = order[0];
//       fs.readFile(stockDataLink, "utf-8", (err, data) => {
//          if (err) throw err;
//          let stocksData = JSON.parse(data);
//          let indexOfTicker = stocksData.stocks.findIndex(
//             (data) => data.ticker === ticker
//          );

//          stocksData.stocks[indexOfTicker].price = price;
//          stocksData.stocks[indexOfTicker].last_update = time;

//          fs.writeFile(
//             stockDataLink,
//             JSON.stringify(stocksData),
//             (err, data) => {
//                if (err) throw err;
//                else {
//                   resolve(data);
//                }
//             }
//          );
//       });
//    });
// }

// module.exports = {
//    getUserPortfolio,
//    getStockData,
//    updateUserPortfolioJSON,
//    updateTradeHistory,
//    getTradeHistory,
//    updateStockData,
//    findUpdateJSONdata,
// };
