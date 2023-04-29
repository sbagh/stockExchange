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

interface UserOrderHistory {
   orderID: string;
   orderType: string;
   ticker: string;
   quantity: number;
   price: number;
   orderTime: string;
   orderStatus: string;
}

interface StockOrderDetails {
   orderID: string;
   userID: number | null;
   orderType: string;
   ticker: string;
   quantity: number | null;
   price: number | null;
   orderTime: Date | null;
   orderStatus: string;
}

interface UserLoginCredentials {
   username: string;
   password: string;
}

export {
   User,
   CashHoldings,
   StockHoldings,
   StockData,
   UserOrderHistory,
   StockOrderDetails,
   UserLoginCredentials,
};
