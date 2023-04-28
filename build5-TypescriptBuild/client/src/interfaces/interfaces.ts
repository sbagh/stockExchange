// typescript interfaces
interface User {
   userID: number;
   firstName: string;
   lastName: string;
}

interface CashHoldings {
   // userID: number;
   cash: string;
}

interface StockHoldings {
   // userID: number;
   ticker: string;
   quantity: number;
}

interface StockData {
   ticker: string;
   price: number;
   lastUpdate: string;
}

export { User, CashHoldings, StockHoldings, StockData };
