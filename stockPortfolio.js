const fs = require("fs");

class Portfolio {
   constructor(cash, stocksOwned) {
      this.cash = cash;
      this.stocksOwned = stocksOwned; //object e.g {TSLA: 300, AMD: 40, APPL: 22}
   }

   //returns a promise which gets the price of a given ticker from the stockList.json file
   stockPrice(ticker) {
      return new Promise((resolve, reject) => {
         fs.readFile("./stockList.json", "utf-8", (err, data) => {
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
      //to do: check if buyPrice is within stock price range
      if (buyPrice !== this.stockPrice(ticker)) `wrong buyPrice`;

      //check if user has enough cash to purchase the shares, if so buy them by removing cash and adding shares to the stocksOwned object
      let totalCost = shares * buyPrice;
      if (totalCost > cash)
         `you do not suffecient funds to purchase ${shares} shares of ${ticker}`;
      else {
         this.cash -= totalCost;
         this.stocksOwned[ticker] += shares;
      }
   }

   sellStock(ticker, shares, sellPrice) {
      //check if user has enough shares of that ticket to sell
      if (this.stocksOwned[ticker] - shares < 0)
         `you do not have ${shares} shares to sell`;

      //check if sellPriceis  within stock price range 
      if (sellPrice !== this.stockPrice(ticker)) `wrong sellPrice`;

      let totalSale = shares * sellPrice;
      this.cash += totalCost;
      this.stocksOwned[ticker] -= shares;

      return `${shares} of ${ticker} sold for ${totalSale}, you now have ${this.cash} in your account`;
   }
}
