const fs = require("fs");

// Get each users portfolio from userData.json
function getUserPortfolio(user) {
   return new Promise((resolve, reject) => {
      fs.readFile("./Stocks/userPortfolio.json", "utf-8", (err, data) => {
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

// Get stock data about a spefic ticker
function getStockData(ticker) {
   return new Promise((resolve, reject) => {
      fs.readFile("./Stocks/stockData.json", "utf-8", (err, data) => {
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

module.exports = {
   getUserPortfolio,
   getStockData,
};
