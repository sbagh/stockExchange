const { Portfolio } = require(`./Stocks/userInteractionAPI2`);
const { stockMatchingSystem } = require("./Stocks/stockMatchingClass");

// const myPortfolio = new Portfolio(10000, { TSLA: 200, AMD: 100 });

// console.log(myPortfolio);

// // immediatly invoked function expression in async
// (async () => {
//    await myPortfolio.currentValue().then((val) => console.log(val));
//    let sellOrder1 = myPortfolio.sellStock("TSLA", 200, 100);
//    console.log(sellOrder1);

//    await myPortfolio.currentValue().then((val) => console.log(val));
//    let sellOrder2 = myPortfolio.sellStock("TSLA", 200, 100);
//    console.log(sellOrder2);

//    let buyOrder1 = myPortfolio.buyStock("TSLA", 100, 100);
//    console.log(buyOrder1);
//    await myPortfolio.currentValue().then((val) => console.log(val));
// })();

const myStockMatchingSystem = new stockMatchingSystem();

myStockMatchingSystem.addBuyOrder({ buyer: "john", price: 10, quantity: 20 });
myStockMatchingSystem.addSellOrder({ seller: "Ron", price: 9, quantity: 16 });

let matchedOrders = myStockMatchingSystem.matchOrders();

console.log(matchedOrders);
