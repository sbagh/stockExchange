import type { UserCashHoldings, UserStockHoldings } from "../interfaces/interfaces";
declare const getUserCashHoldings: (userID: number) => Promise<UserCashHoldings>;
declare const getUserStockHoldings: (userID: number) => Promise<UserStockHoldings[]>;
declare const updateUserCashHoldingsAfterMatch: (buyerID: number, sellerID: number, price: number, quantity: number) => Promise<void>;
declare const updateUserStockHoldingsAfterMatch: (buyerID: number, sellerID: number, ticker: string, quantity: number) => Promise<void>;
export { getUserCashHoldings, getUserStockHoldings, updateUserCashHoldingsAfterMatch, updateUserStockHoldingsAfterMatch, };
