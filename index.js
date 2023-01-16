const {Portfolio} = require(`./Stocks/stockPortfolio`)

const myPortfolio = new Portfolio(10000, {"TSLA": 200, "AMD": 100})

let currentValue = myPortfolio.currentValue()

console.log(currentValue);


