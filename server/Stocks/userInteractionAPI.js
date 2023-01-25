const fs = require("fs");
const { resolve } = require("path");

const userPortfolioLink = "./Stocks/data/userPortfolio.json";
const stockDataLink = "./Stocks/data/stockData.json";
const tradeHistoryLink = "./Stocks/data/tradeHistory.json";

// Get a user's portfolio from userData.json
function getUserPortfolio(user) {
   return new Promise((resolve, reject) => {
      fs.readFile(userPortfolioLink, "utf-8", (err, data) => {
         if (err) reject(err);
         else {
            const usersPortfolios = JSON.parse(data);
            const userPortfolio = usersPortfolios[user];
            if (userPortfolio) {
               resolve(userPortfolio);
            } else {
               reject("no data found");
            }
         }
      });
   });
}

// Get stock data about a ticker from stockData.json
function getStockData() {
   return new Promise((resolve, reject) => {
      fs.readFile(stockDataLink, "utf-8", (err, data) => {
         if (err) reject(err);
         else {
            const stocksData = JSON.parse(data);
            resolve(stocksData);
         }
      });
   });
}

// when user buys a stock, update their portofolio json file
function updateUserPortfolioJSON(user, updatedUserPortfolio) {
   return new Promise((resolve, reject) => {
      fs.readFile(userPortfolioLink, "utf-8", (err, data) => {
         if (err) throw err;
         let usersPortfolios = JSON.parse(data);
         usersPortfolios[user.name] = updatedUserPortfolio;

         //update the changed data:
         fs.writeFile(
            userPortfolioLink,
            JSON.stringify(usersPortfolios),
            (err, data) => {
               if (err) reject(err);
               else {
                  resolve(data);
               }
            }
         );
      });
   });
}

// Append the tradeHistory.json file, first set its contents to a variable, add the new order, then append the file
function updateTradeHistory(order) {
   return new Promise((resolve, reject) => {
      fs.readFile(tradeHistoryLink, "utf-8", (err, data) => {
         if (err) throw err;
         let tradeHistory = JSON.parse(data);
         tradeHistory.push(...order);

         fs.writeFile(
            tradeHistoryLink,
            JSON.stringify(tradeHistory),
            (err, data) => {
               if (err) throw err;
               else {
                  resolve(data);
               }
            }
         );
      });
   });
}

module.exports = {
   getUserPortfolio,
   getStockData,
   updateUserPortfolioJSON,
   updateTradeHistory,
};
