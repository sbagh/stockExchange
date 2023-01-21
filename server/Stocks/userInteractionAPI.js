const fs = require("fs");

const userPortfolioLink = "./Stocks/data/userPortfolio.json";
const stockDataLink = "./Stocks/data/stockData.json";

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
function getStockData(ticker) {
   return new Promise((resolve, reject) => {
      fs.readFile(stockDataLink, "utf-8", (err, data) => {
         if (err) reject(err);
         else {
            const stocksData = JSON.parse(data);
            const stockData = stocksData.stocks.find(
               (stock) => stock.symbol === ticker
            );
            if (stockData) {
               resolve(stockData);
            } else {
               reject("no data found");
            }
         }
      });
   });
}

// function updateUserPortfolioFile(userPortfolio) {
//    return new Promise((resoleve,reject)=> {

//       const stock =

//       fs.()
//    }

// }

module.exports = {
   getUserPortfolio,
   getStockData,
};
