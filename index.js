const { Portfolio } = require(`./Stocks/stockPortfolio`);

const myPortfolio = new Portfolio(10000, { TSLA: 200, AMD: 100 });

console.log(myPortfolio);

// immediatly invoked function expression in async
(async () => {
   await myPortfolio.currentValue().then((val) => console.log(val));
   let sellOrder1 = myPortfolio.sellStock("TSLA", 200, 100);
   console.log(sellOrder1);

   await myPortfolio.currentValue().then((val) => console.log(val));
   let sellOrder2 = myPortfolio.sellStock("TSLA", 200, 100);
   console.log(sellOrder2);

   let buyOrder1 = myPortfolio.buyStock("TSLA", 100, 100);
   console.log(buyOrder1);
   await myPortfolio.currentValue().then((val) => console.log(val));
})();
