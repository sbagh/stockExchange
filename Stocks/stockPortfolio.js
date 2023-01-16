const fs = require("fs");

class Portfolio {
   constructor(cash, stocksOwned) {
      this.cash = cash;
      this.stocksOwned = stocksOwned; //object e.g {TSLA: 300, AMD: 40, APPL: 22}
   }

   //returns a promise which gets the price of a given ticker from the stockList.json file
   stockPrice(ticker) {
      return new Promise((resolve, reject) => {
         fs.readFile("./Stocks/stockList.json", "utf-8", (err, data) => {
            if (err) reject(err);
            else {
               const stockPrices = JSON.parse(data);
               const stockPrice = stockPrices[ticker];
               if (stockPrice) resolve(stockPrice);
               else reject(`stock ${ticker} not found`);
            }
         });
      });
   }

   buyStock(ticker, shares, buyPrice) {
      //check if user has enough cash to purchase the shares, if so buy them by removing cash and adding shares to the stocksOwned object
      let totalCost = shares * buyPrice;
      if (totalCost > this.cash)
         `you do not suffecient funds to purchase ${shares} shares of ${ticker}`;
      else {
         this.cash -= totalCost;
         this.stocksOwned[ticker] = shares;
         return `${shares} of ${ticker} bought for ${totalCost}, you now have ${this.cash}$ cash in your account`;
      }
   }

   sellStock(ticker, shares, sellPrice) {
      //check if user has enough shares of that ticket to sell
      if (this.stocksOwned[ticker] < shares)
         return `you do not have ${shares} shares of ${ticker} to sell`;
      else {
         let totalSale = shares * sellPrice;
         this.cash += totalSale;
         this.stocksOwned[ticker] -= shares;
         return `${shares} of ${ticker} sold for ${totalSale}, you now have ${this.cash}$ cash in your account`;
      }
   }

   async currentValue() {
      let stocksValue = 0;

      for (let ticker in this.stocksOwned) {
         stocksValue +=
            this.stocksOwned[ticker] * (await this.stockPrice(ticker));
      }

      return `you have ${this.cash}$ in cash and ${stocksValue}$ in shares`;
   }
}

module.exports = {
   Portfolio,
};
