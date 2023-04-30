// interfaces used by user portfolio:

//matched order
interface MatchedOrder {
   buyerID: number;
   sellerID: number;
   price: number;
   ticker: string;
   quantity: number;
}
interface UserCashHoldings {
   // userID: number;
   cash: string;
}

interface UserStockHoldings {
   // userID: number;
   ticker: string;
   quantity: number;
}

export { MatchedOrder, UserCashHoldings, UserStockHoldings };
