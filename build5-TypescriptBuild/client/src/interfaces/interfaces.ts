// typescript interfaces
interface User {
   userID: number;
   firstName: string;
   lastName: string;
}

interface CashHoldings {
   userID: number;
   cash?: number;
}

interface StockHoldings {
   userID: number;
   ticker: string;
   quantity: number;
}

export { User, CashHoldings, StockHoldings };
