interface UserCashHoldings {
    userID: number;
    cash: number;
}
interface UserStockHoldings {
    userID: number;
    ticker: string;
    quantity: number;
}
declare const getUserCashHoldings: (userID: number) => Promise<UserCashHoldings>;
declare const getUserStockHoldings: (userID: number) => Promise<UserStockHoldings[]>;
declare const updateUserCashHoldingsAfterMatch: (buyerID: number, sellerID: number, price: number, quantity: number) => Promise<void>;
declare const updateUserStockHoldingsAfterMatch: (buyerID: number, sellerID: number, ticker: string, quantity: number) => Promise<void>;
export { getUserCashHoldings, getUserStockHoldings, updateUserCashHoldingsAfterMatch, updateUserStockHoldingsAfterMatch, };
